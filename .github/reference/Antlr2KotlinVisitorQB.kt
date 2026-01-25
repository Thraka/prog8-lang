package prog8.ast.antlr

import org.antlr.v4.runtime.ParserRuleContext
import org.antlr.v4.runtime.Token
import org.antlr.v4.runtime.tree.AbstractParseTreeVisitor
import org.antlr.v4.runtime.tree.TerminalNode
import prog8.ast.FatalAstException
import prog8.ast.Module
import prog8.ast.Node
import prog8.ast.SyntaxError
import prog8.ast.expressions.*
import prog8.ast.statements.*
import prog8.code.core.*
import prog8.code.source.SourceCode
import prog8.parser.Prog8QBParser.*
import prog8.parser.Prog8QBVisitor
import kotlin.io.path.Path
import kotlin.io.path.isRegularFile


/**
 * ANTLR parse tree visitor for ProgB (BASIC-style syntax).
 * This visitor produces the same AST nodes as Antlr2KotlinVisitor,
 * allowing ProgB and Prog8 files to be used interchangeably.
 */
class Antlr2KotlinVisitorQB(val source: SourceCode): AbstractParseTreeVisitor<Node>(), Prog8QBVisitor<Node> {

    override fun visitModule(ctx: ModuleContext): Module {
        val statements = ctx.module_element().map { it.accept(this) as Statement }
        return Module(statements.toMutableList(), ctx.toPosition(), source)
    }

    override fun visitBlock(ctx: BlockContext): Block {
        val name = getname(ctx.identifier())
        val address = (ctx.integerliteral()?.accept(this) as NumericLiteral?)?.number?.toUInt()
        val statements = ctx.block_body().block_statement().map { it.accept(this) as Statement }
        return Block(name, address, statements.toMutableList(), source.isFromLibrary, ctx.toPosition())
    }

    override fun visitExpression(ctx: ExpressionContext): Expression {
        // sizeof expression
        if(ctx.sizeof_expression!=null) {
            if(ctx.sizeof_argument().pointertype()!=null)
                return IdentifierReference(listOf("sys", "SIZEOF_POINTER"), ctx.toPosition())

            val sdt = ctx.sizeof_argument().basedatatype()
            val datatype = baseDatatypeFor(sdt)
            val expression = ctx.sizeof_argument().expression()?.accept(this) as Expression?
            val sizeof = IdentifierReference(listOf("sizeof"), ctx.toPosition())
            val arg = if (expression != null) expression else {
                require(datatype != null)
                IdentifierReference(listOf(datatype.name.lowercase()), ctx.toPosition())
            }
            return FunctionCallExpression(sizeof, mutableListOf(arg), ctx.toPosition())
        }

        // PEEK(address) expression
        if(ctx.peekexpr()!=null) {
            val address = ctx.peekexpr().expression().accept(this) as Expression
            return DirectMemoryRead(address, ctx.toPosition())
        }

        // ADDRESSOF(var) or TYPEDADDR(var) expressions
        if(ctx.addressof_expr()!=null) {
            val identifier = ctx.addressof_expr().scoped_identifier().accept(this) as IdentifierReference
            val index = ctx.addressof_expr().arrayindex()?.accept(this) as? ArrayIndex
            val typed = ctx.addressof_expr().TYPEDADDR_KW() != null
            return if (index != null) {
                AddressOf(identifier, index, null, false, typed, ctx.toPosition())
            } else {
                AddressOf(identifier, null, null, false, typed, ctx.toPosition())
            }
        }

        // Binary operators
        if(ctx.bop!=null) {
            val operator = mapOperator(ctx.bop.text.trim().uppercase())
            return BinaryExpression(
                ctx.left.accept(this) as Expression,
                operator,
                ctx.right.accept(this) as Expression,
                ctx.toPosition()
            )
        }

        // NOT IN special handling
        if(ctx.NOT()!=null && ctx.IN()!=null) {
            return BinaryExpression(
                ctx.left.accept(this) as Expression,
                "not in",
                ctx.right.accept(this) as Expression,
                ctx.toPosition()
            )
        }

        // Prefix operators
        if(ctx.prefix!=null) {
            val prefixOp = mapPrefixOperator(ctx.prefix.text.uppercase())
            return PrefixExpression(prefixOp, ctx.expression(0).accept(this) as Expression, ctx.toPosition())
        }

        // Range expression (TO/DOWNTO)
        if(ctx.rangefrom!=null && ctx.rangeto!=null) {
            val defaultstep = if(ctx.rto.text.uppercase() == "TO") 1 else -1
            return RangeExpression(
                ctx.rangefrom.accept(this) as Expression,
                ctx.rangeto.accept(this) as Expression,
                ctx.rangestep?.accept(this) as Expression? ?: NumericLiteral.optimalInteger(defaultstep, ctx.toPosition()),
                ctx.toPosition())
        }

        // Typecast
        if(ctx.typecast()!=null) {
            val dt = dataTypeFor(ctx.typecast().datatype())!!
            return TypecastExpression(ctx.expression(0).accept(this) as Expression, dt, false, ctx.toPosition())
        }

        // Expression within parentheses
        if(ctx.childCount==3 && ctx.children[0].text=="(" && ctx.children[2].text==")")
            return ctx.expression(0).accept(this) as Expression

        return visitChildren(ctx) as Expression
    }

    private fun mapOperator(op: String): String = when(op) {
        "AND" -> "and"
        "OR" -> "or"
        "XOR" -> "xor"
        "MOD" -> "%"
        "SHL", "<<" -> "<<"
        "SHR", ">>" -> ">>"
        "BITAND", "&" -> "&"
        "BITOR", "|" -> "|"
        "BITXOR", "^" -> "^"
        "<>" -> "!="
        "=", "==" -> "=="   // both = and == map to equality comparison in expressions
        else -> op.lowercase()
    }

    private fun mapPrefixOperator(op: String): String = when(op) {
        "NOT" -> "not"
        "BITNOT", "~" -> "~"
        else -> op
    }

    override fun visitSubroutinedeclaration(ctx: SubroutinedeclarationContext): Subroutine {
        if(ctx.subroutine()!=null)
            return ctx.subroutine().accept(this) as Subroutine
        if(ctx.functiondecl()!=null)
            return ctx.functiondecl().accept(this) as Subroutine
        if(ctx.asmsubroutine()!=null)
            return ctx.asmsubroutine().accept(this) as Subroutine
        if(ctx.extsubroutine()!=null)
            return ctx.extsubroutine().accept(this) as Subroutine
        throw FatalAstException("weird subroutine")
    }

    override fun visitAlias(ctx: AliasContext): Alias {
        val identifier = getname(ctx.identifier())
        val target = ctx.scoped_identifier().accept(this) as IdentifierReference
        return Alias(identifier, target, ctx.toPosition())
    }

    override fun visitDefer(ctx: DeferContext): Defer {
        val statements = stmtBlockOrSingle(ctx.statement_block(), ctx.statement())
        return Defer(statements, ctx.toPosition())
    }

    override fun visitLabeldef(ctx: LabeldefContext): Label {
        return Label(getname(ctx.identifier()), ctx.toPosition())
    }

    override fun visitUnconditionaljump(ctx: UnconditionaljumpContext): Jump {
        return Jump(ctx.expression().accept(this) as Expression, ctx.toPosition())
    }

    // ============================================================================
    // DIRECTIVES
    // ============================================================================

    override fun visitDirective(ctx: DirectiveContext): Directive {
        return visitChildren(ctx) as Directive
    }

    override fun visitImportdirective(ctx: ImportdirectiveContext): Directive {
        val moduleName = getname(ctx.identifier())
        return Directive("%import", listOf(DirectiveArg(moduleName, null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitZeropagedir(ctx: ZeropagedirContext): Directive {
        val option = getname(ctx.identifier())
        return Directive("%zeropage", listOf(DirectiveArg(option, null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitAddressdir(ctx: AddressdirContext): Directive {
        val address = (ctx.integerliteral().accept(this) as NumericLiteral).number.toUInt()
        return Directive("%address", listOf(DirectiveArg(null, address, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitMemtopdir(ctx: MemtopdirContext): Directive {
        val address = (ctx.integerliteral().accept(this) as NumericLiteral).number.toUInt()
        return Directive("%memtop", listOf(DirectiveArg(null, address, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitEncodingdir(ctx: EncodingdirContext): Directive {
        val encoding = getname(ctx.identifier())
        return Directive("%encoding", listOf(DirectiveArg(encoding, null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitOutputdir(ctx: OutputdirContext): Directive {
        val output = getname(ctx.identifier())
        return Directive("%output", listOf(DirectiveArg(output, null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitLauncherdir(ctx: LauncherdirContext): Directive {
        val launcher = getname(ctx.identifier())
        return Directive("%launcher", listOf(DirectiveArg(launcher, null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitOptiondir(ctx: OptiondirContext): Directive {
        val option = getname(ctx.identifier())
        return Directive("%option", listOf(DirectiveArg(option, null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitZpreserveddir(ctx: ZpreserveddirContext): Directive {
        val from = (ctx.integerliteral(0).accept(this) as NumericLiteral).number.toUInt()
        val to = (ctx.integerliteral(1).accept(this) as NumericLiteral).number.toUInt()
        return Directive("%zpreserved", listOf(
            DirectiveArg(null, from, ctx.toPosition()),
            DirectiveArg(null, to, ctx.toPosition())
        ), ctx.toPosition())
    }

    override fun visitZpalloweddir(ctx: ZpalloweddirContext): Directive {
        val from = (ctx.integerliteral(0).accept(this) as NumericLiteral).number.toUInt()
        val to = (ctx.integerliteral(1).accept(this) as NumericLiteral).number.toUInt()
        return Directive("%zpallowed", listOf(
            DirectiveArg(null, from, ctx.toPosition()),
            DirectiveArg(null, to, ctx.toPosition())
        ), ctx.toPosition())
    }

    override fun visitBreakpointdir(ctx: BreakpointdirContext): Directive {
        return Directive("%breakpoint", emptyList(), ctx.toPosition())
    }

    override fun visitAsmbinarydir(ctx: AsmbinarydirContext): Directive {
        val args = mutableListOf<DirectiveArg>()
        val str = ctx.stringliteral()
        if(str!=null) {
            val text = str.STRING_LIT().text
            args.add(DirectiveArg(text.substring(1, text.length-1), null, ctx.toPosition()))
        }
        ctx.expression().forEach { expr ->
            val value = expr.accept(this) as Expression
            if(value is NumericLiteral) {
                args.add(DirectiveArg(null, value.number.toUInt(), value.position))
            }
        }
        return Directive("%asmbinary", args, ctx.toPosition())
    }

    override fun visitAsmincludedir(ctx: AsmincludedirContext): Directive {
        val str = ctx.stringliteral()
        val text = str.STRING_LIT().text
        return Directive("%asminclude", listOf(DirectiveArg(text.substring(1, text.length-1), null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitAligndir(ctx: AligndirContext): Directive {
        val alignment = (ctx.integerliteral().accept(this) as NumericLiteral).number.toUInt()
        return Directive("%align", listOf(DirectiveArg(null, alignment, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitJmptabledir(ctx: JmptabledirContext): Directive {
        val identifiers = ctx.scoped_identifier().map { it.accept(this) as IdentifierReference }
        val args = identifiers.map { DirectiveArg(it.nameInSource.joinToString("."), null, it.position) }
        return Directive("%jmptable", args, ctx.toPosition())
    }

    override fun visitMergedir(ctx: MergedirContext): Directive {
        return Directive("%option", listOf(DirectiveArg("merge", null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitForceoutputdir(ctx: ForceoutputdirContext): Directive {
        return Directive("%option", listOf(DirectiveArg("force_output", null, ctx.toPosition())), ctx.toPosition())
    }

    override fun visitVerafxmulsdir(ctx: VerafxmulsdirContext): Directive {
        return Directive("%option", listOf(DirectiveArg("verafxmuls", null, ctx.toPosition())), ctx.toPosition())
    }

    // Generic Prog8-compatible directive: %name args
    override fun visitGenericdirective(ctx: GenericdirectiveContext): Directive {
        val directiveName = ctx.DIRECTIVE_NAME().text  // includes the % prefix
        val args = mutableListOf<DirectiveArg>()
        
        // Handle directive name list: %directive (name1, name2, ...)
        ctx.directivenamelist()?.let { nameList ->
            val identifiers = nameList.scoped_identifier().map { it.accept(this) as IdentifierReference }
            args.addAll(identifiers.map { DirectiveArg(it.nameInSource.joinToString("."), null, it.position) })
        }
        
        // Handle directive args: %directive arg1, arg2, ...
        ctx.directivearg().forEach { argCtx ->
            args.add(visitDirectivearg(argCtx))
        }
        
        return Directive(directiveName, args, ctx.toPosition())
    }

    override fun visitDirectivenamelist(ctx: DirectivenamelistContext): Node {
        throw FatalAstException("should not be called directly")
    }

    override fun visitDirectivearg(ctx: DirectiveargContext): DirectiveArg {
        ctx.stringliteral()?.let {
            val text = it.STRING_LIT().text
            return DirectiveArg(text.substring(1, text.length - 1), null, ctx.toPosition())
        }
        ctx.identifier()?.let {
            return DirectiveArg(getname(it), null, ctx.toPosition())
        }
        ctx.integerliteral()?.let {
            val value = (it.accept(this) as NumericLiteral).number.toUInt()
            return DirectiveArg(null, value, ctx.toPosition())
        }
        throw FatalAstException("invalid directive arg at ${ctx.toPosition()}")
    }

    // ============================================================================
    // VARIABLE DECLARATIONS
    // ============================================================================

    override fun visitDimstmt(ctx: DimstmtContext): VarDecl {
        val tags = ctx.TAG().map { it.text }
        val validTags = arrayOf("@zp", "@requirezp", "@nozp", "@nosplit", "@shared", "@alignword", "@alignpage", "@align64", "@dirty", "@split")
        for(tag in tags) {
            if(tag.lowercase() !in validTags.map { it.lowercase() })
                throw SyntaxError("invalid variable tag '$tag'", ctx.toPosition())
        }
        val zp = getZpOption(tags)
        val split = getSplitOption(tags)
        val alignword = tags.any { it.lowercase() == "@alignword" }
        val align64 = tags.any { it.lowercase() == "@align64" }
        val alignpage = tags.any { it.lowercase() == "@alignpage" || it.lowercase() == "@align256" }
        if(alignpage && alignword)
            throw SyntaxError("choose a single alignment option", ctx.toPosition())

        val identifiers = ctx.identifierlist().identifier().map { getname(it) }
        val identifiername = identifiers[0]
        val name = if(identifiers.size==1) identifiername else "<multiple>"

        val arrayIndex = ctx.arrayindex()?.accept(this) as ArrayIndex?
        val isArray = ctx.EMPTYARRAYSIG() != null || arrayIndex != null

        val baseDt = dataTypeFor(ctx.datatype()) ?: DataType.UNDEFINED
        val dt = if(!isArray) baseDt else {
            if(baseDt.isPointer)
                DataType.arrayOfPointersFromAntlrTo(baseDt.sub, baseDt.subTypeFromAntlr)
            else if(baseDt.isStructInstance)
                throw SyntaxError("array of structures not allowed (use array of pointers)", ctx.toPosition())
            else
                DataType.arrayFor(baseDt.base, split!=SplitWish.NOSPLIT)
        }

        // Check for AT expression (memory-mapped variable)
        val atExpr = ctx.expression().lastOrNull()
        val hasAtClause = ctx.AT() != null
        val initValue = if(ctx.ASSIGN() != null) {
            val exprList = ctx.expression()
            if(hasAtClause && exprList.size > 1) {
                // Has both = value and AT address
                exprList[0].accept(this) as Expression
            } else if(!hasAtClause && exprList.isNotEmpty()) {
                exprList[0].accept(this) as Expression
            } else null
        } else null

        val vardecl = VarDecl(
            if(hasAtClause) VarDeclType.MEMORY else VarDeclType.VAR,
            VarDeclOrigin.USERCODE,
            dt,
            zp,
            split,
            arrayIndex,
            name,
            if(identifiers.size==1) emptyList() else identifiers,
            initValue,
            tags.any { it.lowercase() == "@shared" },
            if(alignword) 2u else if(align64) 64u else if(alignpage) 256u else 0u,
            tags.any { it.lowercase() == "@dirty" },
            ctx.toPosition()
        )

        // For AT clause, the address becomes the initial value for MEMORY type
        if(hasAtClause && atExpr != null) {
            vardecl.value = atExpr.accept(this) as Expression
        }

        return vardecl
    }

    override fun visitConstdecl(ctx: ConstdeclContext): VarDecl {
        val datatype = dataTypeFor(ctx.datatype()) ?: DataType.LONG
        val identifiers = ctx.identifierlist().identifier().map { getname(it) }
        val identifiername = identifiers[0]
        val name = if(identifiers.size==1) identifiername else "<multiple>"
        val initialvalue = ctx.expression().accept(this) as Expression
        val actualValue = if(initialvalue is NumericLiteral && datatype.base.largerSizeThan(initialvalue.type))
            NumericLiteral(datatype.base, initialvalue.number, initialvalue.position)
        else
            initialvalue

        return VarDecl(
            VarDeclType.CONST,
            VarDeclOrigin.USERCODE,
            datatype,
            ZeropageWish.DONTCARE,
            SplitWish.DONTCARE,
            null,
            name,
            if(identifiers.size==1) emptyList() else identifiers,
            actualValue,
            false,
            0u,
            false,
            ctx.toPosition()
        )
    }

    override fun visitArrayindex(ctx: ArrayindexContext): ArrayIndex {
        return ArrayIndex(ctx.expression().accept(this) as Expression, ctx.toPosition())
    }

    // ============================================================================
    // ASSIGNMENTS
    // ============================================================================

    override fun visitAssignment(ctx: AssignmentContext): Statement {
        val multiAssign = ctx.multi_assign_target()
        if(multiAssign!=null) {
            return Assignment(multiAssign.accept(this) as AssignTarget, ctx.expression().accept(this) as Expression, AssignmentOrigin.USERCODE, ctx.toPosition())
        }

        val nestedAssign = ctx.assignment()
        return if(nestedAssign==null)
            Assignment(ctx.assign_target().accept(this) as AssignTarget, ctx.expression().accept(this) as Expression, AssignmentOrigin.USERCODE, ctx.toPosition())
        else
            ChainedAssignment(ctx.assign_target().accept(this) as AssignTarget, nestedAssign.accept(this) as Statement, ctx.toPosition())
    }

    override fun visitAugassignment(ctx: AugassignmentContext): Assignment {
        val target = ctx.assign_target().accept(this) as AssignTarget
        val oper = ctx.operator.text.substringBefore('=')
        val expression = BinaryExpression(target.toExpression(), oper, ctx.expression().accept(this) as Expression, ctx.toPosition())
        return Assignment(target, expression, AssignmentOrigin.USERCODE, ctx.toPosition())
    }

    override fun visitIdentifierTarget(ctx: IdentifierTargetContext): AssignTarget {
        val identifier = ctx.scoped_identifier().accept(this) as IdentifierReference
        return AssignTarget(identifier, null, null, null, false, position=ctx.toPosition())
    }

    override fun visitArrayindexedTarget(ctx: ArrayindexedTargetContext): AssignTarget {
        val ax = ctx.arrayindexed()
        val arrayvar = ax.scoped_identifier().accept(this) as IdentifierReference
        val index = ax.arrayindex().accept(this) as ArrayIndex
        val arrayindexed = ArrayIndexedExpression(arrayvar, null, index, ax.toPosition())
        return AssignTarget(null, arrayindexed, null, null, false, position=ctx.toPosition())
    }

    override fun visitMemoryTarget(ctx: MemoryTargetContext): AssignTarget {
        return AssignTarget(null, null,
            DirectMemoryWrite(ctx.directmemory().expression().accept(this) as Expression, ctx.toPosition()),
            null, false, position=ctx.toPosition())
    }

    override fun visitVoidTarget(ctx: VoidTargetContext): AssignTarget {
        return AssignTarget(null, null, null, null, true, position=ctx.toPosition())
    }

    override fun visitMulti_assign_target(ctx: Multi_assign_targetContext): AssignTarget {
        val targets = ctx.assign_target().map { it.accept(this) as AssignTarget }
        return AssignTarget(null, null, null, targets, false, position=ctx.toPosition())
    }

    override fun visitPostincrdecr(ctx: PostincrdecrContext): Assignment {
        val tgt = ctx.assign_target().accept(this) as AssignTarget
        val operator = ctx.operator.text
        val pos = ctx.toPosition()
        val addSubOne = BinaryExpression(tgt.toExpression(), if(operator=="++") "+" else "-", NumericLiteral.optimalInteger(1, pos), pos)
        return Assignment(tgt, addSubOne, AssignmentOrigin.USERCODE, pos)
    }

    // INC x / DEC x statement
    override fun visitIncdecstmt(ctx: IncdecstmtContext): Assignment {
        val tgt = ctx.assign_target().accept(this) as AssignTarget
        val isInc = ctx.operator.text.uppercase() == "INC"
        val pos = ctx.toPosition()
        val addSubOne = BinaryExpression(tgt.toExpression(), if(isInc) "+" else "-", NumericLiteral.optimalInteger(1, pos), pos)
        return Assignment(tgt, addSubOne, AssignmentOrigin.USERCODE, pos)
    }

    // POKE address, value
    override fun visitPokestmt(ctx: PokestmtContext): Assignment {
        val address = ctx.expression(0).accept(this) as Expression
        val value = ctx.expression(1).accept(this) as Expression
        val target = AssignTarget(null, null, DirectMemoryWrite(address, ctx.toPosition()), null, false, position=ctx.toPosition())
        return Assignment(target, value, AssignmentOrigin.USERCODE, ctx.toPosition())
    }

    // ============================================================================
    // EXPRESSIONS
    // ============================================================================

    override fun visitArrayindexed(ctx: ArrayindexedContext): ArrayIndexedExpression {
        val identifier = ctx.scoped_identifier().accept(this) as IdentifierReference
        val index = ctx.arrayindex().accept(this) as ArrayIndex
        return ArrayIndexedExpression(identifier, null, index, ctx.toPosition())
    }

    override fun visitDirectmemory(ctx: DirectmemoryContext): DirectMemoryRead {
        return DirectMemoryRead(ctx.expression().accept(this) as Expression, ctx.toPosition())
    }

    override fun visitAddressof(ctx: AddressofContext): AddressOf {
        val identifier = ctx.scoped_identifier().accept(this) as IdentifierReference
        val msb = ctx.ADDRESS_OF_MSB()!=null
        val index = ctx.arrayindex()?.accept(this) as? ArrayIndex
        var typed = false
        if(ctx.TYPED_ADDRESS_OF()!=null) {
            if(msb)
                throw SyntaxError("typed address of not allowed with msb", ctx.toPosition())
            typed = true
        }
        return if (index != null) {
            AddressOf(identifier, index, null, msb, typed, ctx.toPosition())
        } else {
            AddressOf(identifier, null, null, msb, typed, ctx.toPosition())
        }
    }

    override fun visitFunctioncall(ctx: FunctioncallContext): FunctionCallExpression {
        val name = ctx.scoped_identifier().accept(this) as IdentifierReference
        val args = ctx.expression_list()?.expression()?.map { it.accept(this) as Expression } ?: emptyList()
        return FunctionCallExpression(name, args.toMutableList(), ctx.toPosition())
    }

    override fun visitFunctioncall_stmt(ctx: Functioncall_stmtContext): FunctionCallStatement {
        val void = ctx.VOID() != null
        val name = ctx.scoped_identifier().accept(this) as IdentifierReference
        val args = ctx.expression_list()?.expression()?.map { it.accept(this) as Expression } ?: emptyList()
        return FunctionCallStatement(name, args.toMutableList(), void, ctx.toPosition())
    }

    override fun visitReturnstmt(ctx: ReturnstmtContext): Return {
        val cvalues = ctx.returnvalues()
        val values = if(cvalues==null || cvalues.expression().isEmpty()) arrayOf() else cvalues.expression().map { it.accept(this) as Expression }.toTypedArray()
        return Return(values, ctx.toPosition())
    }

    override fun visitBreakstmt(ctx: BreakstmtContext): Break {
        return Break(ctx.toPosition())
    }

    override fun visitContinuestmt(ctx: ContinuestmtContext): Continue {
        return Continue(ctx.toPosition())
    }

    override fun visitIdentifier(ctx: IdentifierContext): IdentifierReference {
        return IdentifierReference(listOf(getname(ctx)), ctx.toPosition())
    }

    override fun visitScoped_identifier(ctx: Scoped_identifierContext): IdentifierReference {
        val children = ctx.identifier().map { getname(it) }
        return IdentifierReference(children, ctx.toPosition())
    }

    override fun visitIntegerliteral(ctx: IntegerliteralContext): NumericLiteral {
        fun makeLiteral(literalTextWithGrouping: String, radix: Int): Pair<Double, BaseDataType> {
            val literalText = literalTextWithGrouping.replace("_", "")
            val integer: Long
            var datatype = BaseDataType.UBYTE
            when (radix) {
                10 -> {
                    integer = try {
                        literalText.toLong()
                    } catch(x: NumberFormatException) {
                        throw SyntaxError("invalid decimal literal ${x.message}", ctx.toPosition())
                    }
                    datatype = when(integer) {
                        in 0..255 -> BaseDataType.UBYTE
                        in -128..127 -> BaseDataType.BYTE
                        in 0..65535 -> BaseDataType.UWORD
                        in -32768..32767 -> BaseDataType.WORD
                        in -2147483648L..0xffffffffL -> BaseDataType.LONG
                        else -> BaseDataType.FLOAT
                    }
                }
                2 -> {
                    if(literalText.length>16)
                        datatype = BaseDataType.LONG
                    else if(literalText.length>8)
                        datatype = BaseDataType.UWORD
                    try {
                        integer = literalText.toLong(2)
                    } catch(x: NumberFormatException) {
                        throw SyntaxError("invalid binary literal ${x.message}", ctx.toPosition())
                    }
                }
                16 -> {
                    if(literalText.length>4)
                        datatype = BaseDataType.LONG
                    else if(literalText.length>2)
                        datatype = BaseDataType.UWORD
                    try {
                        integer = literalText.lowercase().toLong(16)
                    } catch(x: NumberFormatException) {
                        throw SyntaxError("invalid hexadecimal literal ${x.message}", ctx.toPosition())
                    }
                }
                else -> throw FatalAstException("invalid radix")
            }
            return integer.toDouble() to datatype
        }

        val terminal: TerminalNode = ctx.children[0] as TerminalNode
        val integerPart = ctx.intpart.text
        val integer = when (terminal.symbol.type) {
            DEC_INTEGER -> makeLiteral(integerPart, 10)
            HEX_INTEGER -> makeLiteral(integerPart.substring(1), 16)
            BIN_INTEGER -> makeLiteral(integerPart.substring(1), 2)
            else -> throw FatalAstException(terminal.text)
        }

        if(integer.second.isLong && integer.first > Integer.MAX_VALUE && integer.first <= 0xffffffff) {
            val signedLong = integer.first.toLong().toInt()
            return NumericLiteral(integer.second, signedLong.toDouble(), ctx.toPosition())
        }

        return NumericLiteral(integer.second, integer.first, ctx.toPosition())
    }

    override fun visitBooleanliteral(ctx: BooleanliteralContext): NumericLiteral {
        val boolean = when(ctx.text.uppercase()) {
            "TRUE" -> true
            "FALSE" -> false
            else -> throw FatalAstException(ctx.text)
        }
        return NumericLiteral.fromBoolean(boolean, ctx.toPosition())
    }

    override fun visitArrayliteral(ctx: ArrayliteralContext): ArrayLiteral {
        val array = ctx.expression().map { it.accept(this) as Expression }.toTypedArray()
        return ArrayLiteral(InferredTypes.InferredType.unknown(), array, position = ctx.toPosition())
    }

    override fun visitStringliteral(ctx: StringliteralContext): StringLiteral {
        val text = ctx.STRING_LIT().text
        val enc = ctx.encoding?.text
        val encoding =
            if(enc!=null)
                Encoding.entries.singleOrNull { it.prefix == enc }
                    ?: throw SyntaxError("invalid encoding", ctx.toPosition())
            else
                Encoding.DEFAULT
        val raw = text.substring(1, text.length-1)
        try {
            return StringLiteral.fromEscaped(raw, encoding, ctx.toPosition())
        } catch(ex: IllegalArgumentException) {
            throw SyntaxError(ex.message!!, ctx.toPosition())
        }
    }

    override fun visitCharliteral(ctx: CharliteralContext): CharLiteral {
        val text = ctx.CHARLITERAL().text
        val enc = ctx.encoding?.text
        val encoding =
            if(enc!=null)
                Encoding.entries.singleOrNull { it.prefix == enc }
                    ?: throw SyntaxError("invalid encoding", ctx.toPosition())
            else
                Encoding.DEFAULT
        // Remove surrounding quotes and the 'c' or 'C' suffix: "x"c -> x
        val raw = text.substring(1, text.length - 2)
        try {
            return CharLiteral.fromEscaped(raw, encoding, ctx.toPosition())
        } catch(ex: IllegalArgumentException) {
            throw SyntaxError(ex.message!!, ctx.toPosition())
        }
    }

    override fun visitFloatliteral(ctx: FloatliteralContext): NumericLiteral {
        val floatvalue = ctx.text.replace("_","").toDouble()
        return NumericLiteral(BaseDataType.FLOAT, floatvalue, ctx.toPosition())
    }

    override fun visitInlineasm(ctx: InlineasmContext): InlineAssembly {
        // Check if using ASMBLOCK_CONTENT (ASM ... END ASM syntax)
        val asmBlockContent = ctx.ASMBLOCK_CONTENT()
        if (asmBlockContent != null) {
            val fullText = asmBlockContent.text
            // Extract: remove "ASM\n" from start and "\nEND ASM" from end (case-insensitive)
            val lines = fullText.lines()
            val firstLine = lines.first().trim().uppercase()
            val isIR = firstLine.startsWith("IR")
            // Skip first line (ASM/IR) and last line (END ASM/END IR)
            val asmText = if (lines.size > 2) {
                lines.drop(1).dropLast(1).joinToString("\n")
            } else {
                ""
            }
            return InlineAssembly(asmText, isIR, ctx.toPosition())
        }
        
        // Otherwise using {{ }} syntax
        val isIR = ctx.asmtype?.text?.uppercase() == "IR"
        val text = ctx.INLINEASMBLOCK()?.text ?: ""
        val asmText = if(text.length > 4) text.substring(2, text.length-2) else ""
        return InlineAssembly(asmText, isIR, ctx.toPosition())
    }

    // ============================================================================
    // SUBROUTINES
    // ============================================================================

    override fun visitSubroutine(ctx: SubroutineContext): Subroutine {
        val name = getname(ctx.identifier())
        val parameters = ctx.sub_params()?.sub_param()?.map { subParam(it) } ?: emptyList()
        val statements = ctx.subroutine_body().statement().map { it.accept(this) as Statement }.toMutableList()
        return Subroutine(
            name,
            parameters.toMutableList(),
            mutableListOf(),  // no return types for SUB
            emptyList(),
            emptyList(),
            emptySet(),
            asmAddress = null,
            isAsmSubroutine = false,
            inline = false,
            statements = statements,
            position = ctx.toPosition()
        )
    }

    override fun visitFunctiondecl(ctx: FunctiondeclContext): Subroutine {
        val name = getname(ctx.identifier())
        val parameters = ctx.sub_params()?.sub_param()?.map { subParam(it) } ?: emptyList()
        val returntypes = ctx.datatype().map { dataTypeFor(it)!! }
        val statements = ctx.subroutine_body().statement().map { it.accept(this) as Statement }.toMutableList()
        return Subroutine(
            name,
            parameters.toMutableList(),
            returntypes.toMutableList(),
            emptyList(),
            emptyList(),
            emptySet(),
            asmAddress = null,
            isAsmSubroutine = false,
            inline = false,
            statements = statements,
            position = ctx.toPosition()
        )
    }

    private fun subParam(pctx: Sub_paramContext): SubroutineParameter {
        val name = getname(pctx.identifier())
        var datatype = dataTypeFor(pctx.datatype()) ?: DataType.UNDEFINED
        if(pctx.EMPTYARRAYSIG()!=null || pctx.arrayindex()!=null)
            datatype = datatype.elementToArray()

        val registerText = pctx.TAG()?.text?.substring(1)  // strip @ prefix from TAG token
        val (registerorpair, _) = if(registerText != null) parseParamRegister(registerText, pctx.toPosition()) else Pair(null, null)

        return SubroutineParameter(name, datatype, ZeropageWish.DONTCARE, registerorpair, pctx.toPosition())
    }

    override fun visitAsmsubroutine(ctx: AsmsubroutineContext): Subroutine {
        val inline = ctx.INLINE()!=null
        val ad = asmSubDecl(ctx.asmsub_decl())
        val statements = ctx.subroutine_body().statement().map { it.accept(this) as Statement }.toMutableList()

        return Subroutine(ad.name,
            ad.parameters.toMutableList(),
            ad.returntypes.toMutableList(),
            ad.asmParameterRegisters,
            ad.asmReturnvaluesRegisters,
            ad.asmClobbers, null, true, inline,
            statements = statements, position = ctx.toPosition()
        )
    }

    override fun visitExtsubroutine(ctx: ExtsubroutineContext): Subroutine {
        val subdecl = asmSubDecl(ctx.asmsub_decl())
        val constbank = (ctx.constbank?.accept(this) as NumericLiteral?)?.number?.toUInt()?.toUByte()
        val varbank = ctx.varbank?.accept(this) as IdentifierReference?
        val addr = ctx.address.accept(this) as Expression
        val address = Subroutine.Address(constbank, varbank, addr)
        return Subroutine(subdecl.name, subdecl.parameters.toMutableList(), subdecl.returntypes.toMutableList(),
            subdecl.asmParameterRegisters, subdecl.asmReturnvaluesRegisters,
            subdecl.asmClobbers, address, true, inline = false, statements = mutableListOf(), position = ctx.toPosition()
        )
    }

    // ============================================================================
    // CONTROL FLOW
    // ============================================================================

    override fun visitIf_stmt(ctx: If_stmtContext): IfElse {
        val condition = ctx.expression().accept(this) as Expression

        // Build true part from if_body or single statement
        val trueStatements = mutableListOf<Statement>()
        val statements = ctx.statement()
        if(statements.isNotEmpty()) {
            // Single-line if: statement(0) is the THEN part
            trueStatements.add(statements[0].accept(this) as Statement)
        }
        ctx.if_body()?.let { body ->
            trueStatements.addAll(body.statement().map { it.accept(this) as Statement })
        }
        val truepart = AnonymousScope(trueStatements, ctx.toPosition())

        // Handle elseif parts by creating nested IfElse
        var elsepart: AnonymousScope = AnonymousScope.empty()

        val elseifParts = ctx.elseif_part()
        val elsePart = ctx.else_part()

        if(elseifParts.isNotEmpty()) {
            // Build nested if-else chain for elseif
            var currentElse = if(elsePart != null) {
                val elseStatements = mutableListOf<Statement>()
                elsePart.statement()?.let { elseStatements.add(it.accept(this) as Statement) }
                elsePart.if_body()?.let { body ->
                    elseStatements.addAll(body.statement().map { it.accept(this) as Statement })
                }
                AnonymousScope(elseStatements, elsePart.toPosition())
            } else {
                AnonymousScope.empty()
            }

            // Process elseif parts in reverse to build the chain
            for(i in elseifParts.indices.reversed()) {
                val elseifCtx = elseifParts[i]
                val elseifCondition = elseifCtx.expression().accept(this) as Expression
                val elseifStatements = mutableListOf<Statement>()
                elseifCtx.statement()?.let { elseifStatements.add(it.accept(this) as Statement) }
                elseifCtx.if_body()?.let { body ->
                    elseifStatements.addAll(body.statement().map { it.accept(this) as Statement })
                }
                val nestedIf = IfElse(elseifCondition, AnonymousScope(elseifStatements, elseifCtx.toPosition()), currentElse, elseifCtx.toPosition())
                currentElse = AnonymousScope(mutableListOf(nestedIf), elseifCtx.toPosition())
            }
            elsepart = currentElse
        } else if(elsePart != null) {
            val elseStatements = mutableListOf<Statement>()
            elsePart.statement()?.let { elseStatements.add(it.accept(this) as Statement) }
            elsePart.if_body()?.let { body ->
                elseStatements.addAll(body.statement().map { it.accept(this) as Statement })
            }
            elsepart = AnonymousScope(elseStatements, elsePart.toPosition())
        } else if(statements.size > 1) {
            // Single-line if-else: statement(1) is the ELSE part
            val elseStatements = mutableListOf<Statement>()
            elseStatements.add(statements[1].accept(this) as Statement)
            elsepart = AnonymousScope(elseStatements, ctx.toPosition())
        }

        return IfElse(condition, truepart, elsepart, ctx.toPosition())
    }

    override fun visitIf_expression(ctx: If_expressionContext): IfExpression {
        val expressions = ctx.expression()
        val condition = expressions[0].accept(this) as Expression
        val truevalue = expressions[1].accept(this) as Expression
        val falsevalue = expressions[2].accept(this) as Expression
        return IfExpression(condition, truevalue, falsevalue, ctx.toPosition())
    }

    override fun visitBranchcondition_expression(ctx: Branchcondition_expressionContext): BranchConditionExpression {
        val condition = branchCondition(ctx.branchcondition())
        val (truevalue, falsevalue) = ctx.expression().map { it.accept(this) as Expression }
        return BranchConditionExpression(condition, truevalue, falsevalue, ctx.toPosition())
    }

    override fun visitBranch_stmt(ctx: Branch_stmtContext): ConditionalBranch {
        val branchcondition = branchCondition(ctx.branchcondition())
        val truepart = stmtBlockOrSingle(ctx.statement_block(), ctx.statement())
        val elsepart = ctx.else_part()?.let { visitElse_part_branch(it) } ?: AnonymousScope.empty()
        return ConditionalBranch(branchcondition, truepart, elsepart, ctx.toPosition())
    }

    private fun visitElse_part_branch(ctx: Else_partContext): AnonymousScope {
        val statements = mutableListOf<Statement>()
        ctx.statement()?.let { statements.add(it.accept(this) as Statement) }
        ctx.if_body()?.let { body ->
            statements.addAll(body.statement().map { it.accept(this) as Statement })
        }
        return AnonymousScope(statements, ctx.toPosition())
    }

    override fun visitForloop(ctx: ForloopContext): ForLoop {
        val loopvar = ctx.scoped_identifier().accept(this) as IdentifierReference
        
        // Check if this is a range-based loop (TO/DOWNTO) or an IN-based loop
        val iterable = if (ctx.TO() != null || ctx.DOWNTO() != null) {
            // Range-based: FOR i = start TO end [STEP n]
            val from = ctx.expression(0).accept(this) as Expression
            val to = ctx.expression(1).accept(this) as Expression
            val step = ctx.expression(2)?.accept(this) as Expression?

            val isDownto = ctx.DOWNTO() != null
            val defaultStep = if(isDownto) -1 else 1
            val actualStep = step ?: NumericLiteral.optimalInteger(defaultStep, ctx.toPosition())

            RangeExpression(from, to, actualStep, ctx.toPosition())
        } else {
            // IN-based: FOR i IN expression (array literal or any iterable)
            ctx.expression(0).accept(this) as Expression
        }

        val statements = ctx.forloop_body().statement().map { it.accept(this) as Statement }.toMutableList()
        val scope = AnonymousScope(statements, ctx.toPosition())
        return ForLoop(loopvar, iterable, scope, ctx.toPosition())
    }

    override fun visitWhileloop(ctx: WhileloopContext): WhileLoop {
        val condition = ctx.expression().accept(this) as Expression
        val statements = ctx.whileloop_body().statement().map { it.accept(this) as Statement }.toMutableList()
        return WhileLoop(condition, AnonymousScope(statements, ctx.toPosition()), ctx.toPosition())
    }

    override fun visitUntilloop(ctx: UntilloopContext): UntilLoop {
        // If no UNTIL condition, it's an infinite loop (condition = false, never exits)
        val condition = ctx.expression()?.accept(this) as Expression?
            ?: NumericLiteral.fromBoolean(false, ctx.toPosition())
        val statements = ctx.doloop_body().statement().map { it.accept(this) as Statement }.toMutableList()
        return UntilLoop(AnonymousScope(statements, ctx.toPosition()), condition, ctx.toPosition())
    }

    override fun visitRepeatloop(ctx: RepeatloopContext): RepeatLoop {
        val iterations = ctx.expression()?.accept(this) as Expression?
        val statements = mutableListOf<Statement>()
        ctx.statement()?.let { statements.add(it.accept(this) as Statement) }
        ctx.repeatloop_body()?.let { body ->
            statements.addAll(body.statement().map { it.accept(this) as Statement })
        }
        return RepeatLoop(iterations, AnonymousScope(statements, ctx.toPosition()), ctx.toPosition())
    }

    override fun visitUnrollloop(ctx: UnrollloopContext): UnrollLoop {
        val iterations = ctx.expression().accept(this) as Expression
        val statements = ctx.unrollloop_body().statement().map { it.accept(this) as Statement }.toMutableList()
        return UnrollLoop(iterations, AnonymousScope(statements, ctx.toPosition()), ctx.toPosition())
    }

    override fun visitWhenstmt(ctx: WhenstmtContext): When {
        val condition = ctx.expression().accept(this) as Expression
        val choices = ctx.when_choice()?.map { it.accept(this) as WhenChoice }?.toMutableList() ?: mutableListOf()
        return When(condition, choices, ctx.toPosition())
    }

    override fun visitWhen_choice(ctx: When_choiceContext): WhenChoice {
        val values = ctx.expression_list()?.expression()?.map { it.accept(this) as Expression }
        val statements = ctx.when_body().statement().map { it.accept(this) as Statement }.toMutableList()
        return WhenChoice(values?.toMutableList(), AnonymousScope(statements, ctx.toPosition()), ctx.toPosition())
    }

    override fun visitOngoto(ctx: OngotoContext): OnGoto {
        val elsepart = ctx.else_part()?.let { visitElse_part_branch(it) } ?: AnonymousScope.empty()
        val isCall = ctx.kind.text.uppercase() in listOf("CALL", "GOSUB")
        val index = ctx.expression().accept(this) as Expression
        val labels = ctx.identifierlist().identifier().map {
            IdentifierReference(listOf(getname(it)), it.toPosition())
        }
        return OnGoto(isCall, index, labels, elsepart, ctx.toPosition())
    }

    override fun visitStaticstructinitializer(ctx: StaticstructinitializerContext): StaticStructInitializer {
        if(ctx.POINTER()==null)
            throw SyntaxError("struct initializer requires '^^' before struct name", ctx.toPosition())
        val struct = ctx.scoped_identifier().accept(this) as IdentifierReference
        val array = ctx.arrayliteral()
        val args = if(array==null) mutableListOf() else (array.accept(this) as ArrayLiteral).value.toMutableList()
        return StaticStructInitializer(struct, args, ctx.toPosition())
    }

    override fun visitPointerDereferenceTarget(ctx: PointerDereferenceTargetContext): AssignTarget {
        return when (val deref = ctx.pointerdereference().accept(this)) {
            is PtrDereference -> AssignTarget(null, null, null, null, false, pointerDereference = deref, position = deref.position)
            is ArrayIndexedPtrDereference -> AssignTarget(null, null, null, null, false, arrayIndexedDereference = deref, position = deref.position)
            else -> throw FatalAstException("weird dereference ${ctx.toPosition()}")
        }
    }

    override fun visitPointerdereference(ctx: PointerdereferenceContext): Expression {
        val scopeprefix = ctx.prefix?.accept(this) as IdentifierReference?
        val derefs = ctx.derefchain()!!.singlederef()!!.map { it.identifier().text to it.arrayindex()?.accept(this) as ArrayIndex? }
        if(derefs.all { it.second==null }) {
            val derefchain = derefs.map { it.first }
            val chain = ((scopeprefix?.nameInSource ?: emptyList()) + derefchain).toMutableList()
            if (ctx.field != null)
                chain += ctx.field.text
            return PtrDereference(chain, ctx.field == null, ctx.toPosition())
        } else {
            val chain = derefs.toMutableList()
            if(scopeprefix!=null) {
                chain.addAll(0, scopeprefix.nameInSource.map { it to (null as ArrayIndex?) }.toMutableList())
            }
            if (ctx.field != null)
                chain += ctx.field.text to null
            return ArrayIndexedPtrDereference(chain, ctx.field == null, ctx.toPosition())
        }
    }

    override fun visitStructdeclaration(ctx: StructdeclarationContext): StructDecl {
        val name = getname(ctx.identifier())
        val fields: List<Pair<DataType, List<String>>> = ctx.structfielddecl().map { getStructField(it) }
        val flattened = fields.flatMap { (dt, names) -> names.map { dt to it}}
        return StructDecl(name, flattened.toTypedArray(), ctx.toPosition())
    }

    private fun getStructField(ctx: StructfielddeclContext): Pair<DataType, List<String>> {
        val identifiers = ctx.identifierlist()?.identifier() ?: emptyList()
        val dt = dataTypeFor(ctx.datatype())!!
        return dt to identifiers.map { getname(it) }
    }

    // ============================================================================
    // VISITOR OVERRIDES (delegate to children or throw)
    // ============================================================================

    override fun visitModule_element(ctx: Module_elementContext): Node = visitChildren(ctx)
    override fun visitBlock_body(ctx: Block_bodyContext): Node = visitChildren(ctx)
    override fun visitBlock_statement(ctx: Block_statementContext): Statement = visitChildren(ctx) as Statement
    override fun visitStatement(ctx: StatementContext): Statement = visitChildren(ctx) as Statement
    override fun visitVariabledeclaration(ctx: VariabledeclarationContext): VarDecl = visitChildren(ctx) as VarDecl
    override fun visitLiteralvalue(ctx: LiteralvalueContext): Expression = visitChildren(ctx) as Expression

    override fun visitBasedatatype(ctx: BasedatatypeContext) = throw FatalAstException("should not be called")
    override fun visitAsmsub_decl(ctx: Asmsub_declContext) = throw FatalAstException("should not be called")
    override fun visitAsmsub_params(ctx: Asmsub_paramsContext) = throw FatalAstException("should not be called")
    override fun visitExpression_list(ctx: Expression_listContext) = throw FatalAstException("should not be called")
    override fun visitBranchcondition(ctx: BranchconditionContext) = throw FatalAstException("should not be called")
    override fun visitDatatype(ctx: DatatypeContext) = throw FatalAstException("should not be called")
    override fun visitIdentifierlist(ctx: IdentifierlistContext) = throw FatalAstException("should not be called")
    override fun visitSizeof_argument(ctx: Sizeof_argumentContext) = throw FatalAstException("should not be called")
    override fun visitReturnvalues(ctx: ReturnvaluesContext) = throw FatalAstException("should not be called")
    override fun visitTypecast(ctx: TypecastContext) = throw FatalAstException("should not be called")
    override fun visitSub_params(ctx: Sub_paramsContext) = throw FatalAstException("should not be called")
    override fun visitSub_param(ctx: Sub_paramContext) = throw FatalAstException("should not be called")
    override fun visitAsmsub_param(ctx: Asmsub_paramContext) = throw FatalAstException("should not be called")
    override fun visitAsmsub_clobbers(ctx: Asmsub_clobbersContext) = throw FatalAstException("should not be called")
    override fun visitClobber(ctx: ClobberContext) = throw FatalAstException("should not be called")
    override fun visitAsmsub_returns(ctx: Asmsub_returnsContext) = throw FatalAstException("should not be called")
    override fun visitAsmsub_return(ctx: Asmsub_returnContext) = throw FatalAstException("should not be called")
    override fun visitStructfielddecl(ctx: StructfielddeclContext) = throw FatalAstException("should not be called")
    override fun visitDerefchain(ctx: DerefchainContext) = throw FatalAstException("should not be called")
    override fun visitSinglederef(ctx: SinglederefContext) = throw FatalAstException("should not be called")
    override fun visitPointertype(ctx: PointertypeContext) = throw FatalAstException("should not be called")
    override fun visitSubroutine_body(ctx: Subroutine_bodyContext) = throw FatalAstException("should not be called")
    override fun visitIf_body(ctx: If_bodyContext) = throw FatalAstException("should not be called")
    override fun visitElseif_part(ctx: Elseif_partContext) = throw FatalAstException("should not be called")
    override fun visitElse_part(ctx: Else_partContext) = throw FatalAstException("should not be called")
    override fun visitForloop_body(ctx: Forloop_bodyContext) = throw FatalAstException("should not be called")
    override fun visitWhileloop_body(ctx: Whileloop_bodyContext) = throw FatalAstException("should not be called")
    override fun visitDoloop_body(ctx: Doloop_bodyContext) = throw FatalAstException("should not be called")
    override fun visitRepeatloop_body(ctx: Repeatloop_bodyContext) = throw FatalAstException("should not be called")
    override fun visitUnrollloop_body(ctx: Unrollloop_bodyContext) = throw FatalAstException("should not be called")
    override fun visitWhen_body(ctx: When_bodyContext) = throw FatalAstException("should not be called")
    override fun visitStatement_block(ctx: Statement_blockContext) = throw FatalAstException("should not be called")
    override fun visitPeekexpr(ctx: PeekexprContext) = throw FatalAstException("should not be called")
    override fun visitAddressof_expr(ctx: Addressof_exprContext) = throw FatalAstException("should not be called")

    // ============================================================================
    // HELPER METHODS
    // ============================================================================

    private fun getname(identifier: IdentifierContext): String {
        val text = identifier.children[0].text
        // For keywords that can also be identifiers, we need the actual text
        return text
    }

    private fun ParserRuleContext.toPosition() : Position {
        val pathString = start.inputStream.sourceName
        val filename = if(SourceCode.isRegularFilesystemPath(pathString)) {
            val path = Path(pathString)
            if(path.isRegularFile()) {
                SourceCode.relative(path).toString()
            } else {
                path.toString()
            }
        } else {
            pathString
        }
        val endOffset = if(start.startIndex<0 || start.stopIndex<0) 0 else start.stopIndex - start.startIndex
        return Position(filename, start.line, start.charPositionInLine+1, start.charPositionInLine + 1 + endOffset)
    }

    private fun getZpOption(tags: List<String>): ZeropageWish = when {
        tags.any { it.lowercase() == "@requirezp" } -> ZeropageWish.REQUIRE_ZEROPAGE
        tags.any { it.lowercase() == "@zp" } -> ZeropageWish.PREFER_ZEROPAGE
        tags.any { it.lowercase() == "@nozp" } -> ZeropageWish.NOT_IN_ZEROPAGE
        else -> ZeropageWish.DONTCARE
    }

    private fun getSplitOption(tags: List<String>): SplitWish {
        return when {
            tags.any { it.lowercase() == "@nosplit" } -> SplitWish.NOSPLIT
            tags.any { it.lowercase() == "@split" } -> SplitWish.DONTCARE  // split is the default
            else -> SplitWish.DONTCARE
        }
    }

    private fun parseParamRegister(registerText: String, pos: Position): Pair<RegisterOrPair?, Statusflag?> {
        var registerorpair: RegisterOrPair? = null
        var statusregister: Statusflag? = null
        val upperText = registerText.uppercase()
        when {
            upperText in RegisterOrPair.names -> registerorpair = RegisterOrPair.valueOf(upperText)
            upperText in Statusflag.names.map { it.uppercase() } -> {
                statusregister = Statusflag.entries.first { it.name.uppercase() == upperText }
            }
            else -> {
                throw SyntaxError("invalid register or status flag: $registerText", pos)
            }
        }
        return Pair(registerorpair, statusregister)
    }

    private fun asmSubroutineParam(pctx: Asmsub_paramContext): AsmSubroutineParameter {
        val name = getname(pctx.identifier())
        var datatype = dataTypeFor(pctx.datatype()) ?: DataType.UNDEFINED
        if(pctx.EMPTYARRAYSIG()!=null || pctx.arrayindex()!=null)
            datatype = datatype.elementToArray()
        val registerText = pctx.TAG().text.substring(1)  // strip @ prefix from TAG token
        val (registerorpair, statusregister) = parseParamRegister(registerText, pctx.toPosition())
        return AsmSubroutineParameter(name, datatype, registerorpair, statusregister, pctx.toPosition())
    }

    private fun asmReturn(rctx: Asmsub_returnContext): AsmSubroutineReturn {
        val registerText = rctx.TAG().text.substring(1)  // strip @ prefix from TAG token
        var registerorpair: RegisterOrPair? = null
        var statusregister: Statusflag? = null
        val upperText = registerText.uppercase()
        when {
            upperText in RegisterOrPair.names -> registerorpair = RegisterOrPair.valueOf(upperText)
            upperText in Statusflag.names.map { it.uppercase() } -> {
                statusregister = Statusflag.entries.first { it.name.uppercase() == upperText }
            }
            else -> throw SyntaxError("invalid register or status flag: $registerText", rctx.toPosition())
        }
        return AsmSubroutineReturn(
            dataTypeFor(rctx.datatype())!!,
            registerorpair,
            statusregister)
    }

    private fun cpuRegister(text: String, pos: Position): CpuRegister {
        try {
            return CpuRegister.valueOf(text.uppercase())
        } catch(_: IllegalArgumentException) {
            throw SyntaxError("invalid cpu register: $text", pos)
        }
    }

    private fun dataTypeFor(dtctx: DatatypeContext?): DataType? {
        if(dtctx==null)
            return null
        val base = baseDatatypeFor(dtctx.basedatatype())
        if(base!=null)
            return DataType.forDt(base)
        val pointer = pointerDatatypeFor(dtctx.pointertype())
        if(pointer!=null)
            return pointer
        val struct = dtctx.structtype.identifier().map { it.text }
        return DataType.structInstanceFromAntlr(struct)
    }

    private fun pointerDatatypeFor(pointertype: PointertypeContext?): DataType? {
        if(pointertype==null)
            return null
        val base = baseDatatypeFor(pointertype.basedatatype())
        if(base!=null)
            return DataType.pointer(base)
        val identifier = pointertype.scoped_identifier().identifier().map { it.text }
        return DataType.pointerFromAntlr(identifier)
    }

    private fun baseDatatypeFor(ctx: BasedatatypeContext?): BaseDataType? {
        if(ctx==null)
            return null
        return when(ctx.text.uppercase()) {
            "UBYTE" -> BaseDataType.UBYTE
            "BYTE" -> BaseDataType.BYTE
            "UWORD" -> BaseDataType.UWORD
            "WORD" -> BaseDataType.WORD
            "LONG" -> BaseDataType.LONG
            "FLOAT" -> BaseDataType.FLOAT
            "BOOL" -> BaseDataType.BOOL
            "STRING" -> BaseDataType.STR
            else -> null
        }
    }

    private fun stmtBlockOrSingle(statementBlock: Statement_blockContext?, statement: StatementContext?): AnonymousScope {
        return if(statementBlock!=null) {
            val statements = statementBlock.statement().map { it.accept(this) as Statement }.toMutableList()
            AnonymousScope(statements, statementBlock.toPosition())
        }
        else if(statement!=null)
            AnonymousScope(mutableListOf(statement.accept(this) as Statement), statement.toPosition())
        else
            AnonymousScope.empty()
    }

    private fun branchCondition(ctx: BranchconditionContext): BranchCondition {
        val text = ctx.text.uppercase()
        return when {
            text.contains("CS") -> BranchCondition.CS
            text.contains("CC") -> BranchCondition.CC
            text.contains("EQ") || text.endsWith("Z") -> BranchCondition.Z
            text.contains("NE") || text.endsWith("NZ") -> BranchCondition.NZ
            text.contains("PL") || text.contains("POS") -> BranchCondition.POS
            text.contains("MI") || text.contains("NEG") -> BranchCondition.NEG
            text.contains("VS") -> BranchCondition.VS
            text.contains("VC") -> BranchCondition.VC
            else -> throw SyntaxError("unknown branch condition: $text", ctx.toPosition())
        }
    }

    private fun asmSubDecl(ad: Asmsub_declContext): AsmsubDecl {
        val name = getname(ad.identifier())
        val params = ad.asmsub_params()?.asmsub_param()?.map { asmSubroutineParam(it) } ?: emptyList()
        val returns = ad.asmsub_returns()?.asmsub_return()?.map { asmReturn(it) } ?: emptyList()
        val clobbers = ad.asmsub_clobbers()?.clobber()?.identifier()?.map { cpuRegister(it.text, ad.toPosition()) } ?: emptyList()
        val normalParameters = params.map { SubroutineParameter(it.name, it.type, it.zp, it.registerOrPair, it.position) }
        val normalReturntypes = returns.map { it.type }
        val paramRegisters = params.map { RegisterOrStatusflag(it.registerOrPair, it.statusflag) }
        val returnRegisters = returns.map { RegisterOrStatusflag(it.registerOrPair, it.statusflag) }
        return AsmsubDecl(name, normalParameters, normalReturntypes, paramRegisters, returnRegisters, clobbers.toSet())
    }

    private class AsmsubDecl(val name: String,
                             val parameters: List<SubroutineParameter>,
                             val returntypes: List<DataType>,
                             val asmParameterRegisters: List<RegisterOrStatusflag>,
                             val asmReturnvaluesRegisters: List<RegisterOrStatusflag>,
                             val asmClobbers: Set<CpuRegister>)

    private class AsmSubroutineParameter(name: String,
                                         type: DataType,
                                         registerOrPair: RegisterOrPair?,
                                         val statusflag: Statusflag?,
                                         position: Position) : SubroutineParameter(name, type, ZeropageWish.DONTCARE, registerOrPair, position)

    private class AsmSubroutineReturn(val type: DataType,
                                      val registerOrPair: RegisterOrPair?,
                                      val statusflag: Statusflag?)
}
