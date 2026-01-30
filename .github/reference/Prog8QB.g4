/*
ProgB combined lexer and parser grammar
A QuickBASIC-style syntax frontend for the Prog8 compiler

NOTES:

- Whitespace is ignored (tabs/spaces)
- Keywords are case-insensitive (OPTION, Option, option all work)
- Identifiers remain case-sensitive
- Comments use ' or REM for line comments, /' ... '/ for block comments
- Every position can be empty, be a comment, or contain ONE statement

This grammar produces the same AST as Prog8ANTLR.g4, allowing both syntaxes
to coexist in the same project.

*/

grammar Prog8QB;

@header {
package prog8.parser;
}

// ============================================================================
// LEXER RULES (must come before parser rules in combined grammar)
// ============================================================================

// ASM block content - MUST BE FIRST to capture entire blocks before other tokens
// Captures everything between ASM/IR and END ASM/END IR as a single token
ASMBLOCK_CONTENT :
    (A S M | I R) [ \t]* ('\r'? '\n' | '\r' | '\n')
    .*?
    ('\r'? '\n' | '\r' | '\n') [ \t]* E N D [ \t]+ (A S M | I R)
    ;

// Case-insensitive keyword fragments
fragment A: [aA];
fragment B: [bB];
fragment C: [cC];
fragment D: [dD];
fragment E: [eE];
fragment F: [fF];
fragment G: [gG];
fragment H: [hH];
fragment I: [iI];
fragment J: [jJ];
fragment K: [kK];
fragment L: [lL];
fragment M: [mM];
fragment N: [nN];
fragment O: [oO];
fragment P: [pP];
fragment Q: [qQ];
fragment R: [rR];
fragment S: [sS];
fragment T: [tT];
fragment U: [uU];
fragment V: [vV];
fragment W: [wW];
fragment X: [xX];
fragment Y: [yY];
fragment Z: [zZ];

fragment HEX_DIGIT: [a-fA-F0-9] ;
fragment BIN_DIGIT: [01] ;
fragment DEC_DIGIT: [0-9] ;

// Whitespace and newlines
EOL :  ('\r'? '\n' | '\r' | '\n')+ ;
WS :  [ \t] -> skip ;

// Comments - BASIC style using ' (apostrophe) or REM
// Single quote starts a comment that runs to end of line
// Comment patterns:
//   - ' followed by anything to end of line (handles: 'comment, ' comment, 'this is 'a' comment)
LINECOMMENT : EOL [ \t]* '\'' ~[\r\n]* -> channel(HIDDEN);
COMMENT : '\'' ~[\r\n]* -> channel(HIDDEN) ;
REM_COMMENT : R E M ([ \t] ~[\r\n]*)? -> channel(HIDDEN) ;
BLOCK_COMMENT : '/\'' ( BLOCK_COMMENT | ~'\'' | '\'' ~'/' )*? '\'/' -> skip ;

// Multi-character operators (must come before single-character)
POINTER: '^^';
TYPED_ADDRESS_OF: '&&' ;
ADDRESS_OF_MSB: '&>' ;
ADDRESS_OF_LSB: '&<' ;
SHIFTLEFT: '<<' ;
SHIFTRIGHT: '>>' ;
PLUSPLUS: '++' ;
MINUSMINUS: '--' ;
PLUSEQ: '+=' ;
MINUSEQ: '-=' ;
STAREQ: '*=' ;
SLASHEQ: '/=' ;
MODEQ: '%=' ;
ANDEQ: '&=' ;
OREQ: '|=' ;
XOREQ: '^=' ;
SHLEQ: '<<=' ;
SHREQ: '>>=' ;
ARROW: '->' ;
NE: '<>' ;
LE: '<=' ;
GE: '>=' ;
EQ: '==' ;

// Single-character operators and punctuation
LPAREN: '(' ;
RPAREN: ')' ;
LBRACKET: '[' ;
RBRACKET: ']' ;
COMMA: ',' ;
COLON: ':' ;
DOT: '.' ;
ATSIGN: '@' ;
ASSIGN: '=' ;
LT: '<' ;
GT: '>' ;
PLUS: '+' ;
MINUS: '-' ;
STAR: '*' ;
SLASH: '/' ;
ADDRESS_OF: '&' ;
PIPE: '|' ;
CARET: '^' ;
TILDE: '~' ;

// Keywords (case-insensitive) - order matters for longest match
// Branch conditions must come before IF
IF_CS: I F '_' C S ;
IF_CC: I F '_' C C ;
IF_EQ: I F '_' E Q ;
IF_NE: I F '_' N E ;
IF_NZ: I F '_' N Z ;
IF_PL: I F '_' P L ;
IF_POS: I F '_' P O S ;
IF_MI: I F '_' M I ;
IF_NEG: I F '_' N E G ;
IF_VS: I F '_' V S ;
IF_VC: I F '_' V C ;
IF_Z: I F '_' Z ;

// Multi-word keywords
FORCE_OUTPUT: F O R C E '_' O U T P U T ;

// Keywords
IMPORT: I M P O R T ;
ZEROPAGE: Z E R O P A G E ;
ADDRESSOF_KW: A D D R E S S O F ;
ADDRESS: A D D R E S S ;
MEMTOP: M E M T O P ;
ENCODING: E N C O D I N G ;
OUTPUT: O U T P U T ;
LAUNCHER: L A U N C H E R ;
OPTION: O P T I O N ;
ZPRESERVED: Z P R E S E R V E D ;
ZPALLOWED: Z P A L L O W E D ;
BREAKPOINT: B R E A K P O I N T ;
ASMBINARY: A S M B I N A R Y ;
ASMINCLUDE: A S M I N C L U D E ;
ALIGN: A L I G N ;
JMPTABLE: J M P T A B L E ;
MERGE: M E R G E ;
VERAFXMULS: V E R A F X M U L S ;

MODULE: M O D U L E ;
END: E N D ;
FUNCTION: F U N C T I O N ;
ASMSUB: A S M S U B ;
EXTSUB: E X T S U B ;
INLINE: I N L I N E ;
CLOBBERS: C L O B B E R S ;
SUB: S U B ;

TYPEDADDR_KW: T Y P E D A D D R ;
TYPE: T Y P E ;
ALIAS: A L I A S ;

ELSEIF: E L S E I F ;
ELSE: E L S E ;
THEN: T H E N ;
IF: I F ;

DOWNTO: D O W N T O ;
FOR: F O R ;
TO: T O ;
STEP: S T E P ;
NEXT: N E X T ;

WHILE: W H I L E ;
WEND: W E N D ;

UNTIL: U N T I L ;
LOOP: L O O P ;
DO: D O ;

REPEAT: R E P E A T ;
UNROLL: U N R O L L ;

DEFER: D E F E R ;

SELECT: S E L E C T ;
CASE: C A S E ;

GOSUB: G O S U B ;
GOTO: G O T O ;
CALL: C A L L ;
ON: O N ;

RETURN: R E T U R N ;
CONTINUE: C O N T I N U E ;
BREAK: B R E A K ;
EXIT: E X I T ;

VOID: V O I D ;

// Operators (keywords)
BITNOT: B I T N O T ;
BITAND: B I T A N D ;
BITOR: B I T O R ;
BITXOR: B I T X O R ;
AND: A N D ;
XOR: X O R ;
NOT: N O T ;
MOD: M O D ;
SHL: S H L ;
SHR: S H R ;
OR: O R ;
IN: I N ;

INC: I N C ;
DEC: D E C ;

// Data types
STRING: S T R I N G ;
UBYTE: U B Y T E ;
UWORD: U W O R D ;
FLOAT: F L O A T ;
BYTE: B Y T E ;
WORD: W O R D ;
LONG: L O N G ;
BOOL: B O O L ;

// Boolean literals
FALSE: F A L S E ;
TRUE: T R U E ;

// BASIC memory operations
SIZEOF: S I Z E O F ;
PEEK: P E E K ;
POKE: P O K E ;

// Assembly
ASM: A S M ;
IR: I R ;

DIM: D I M ;
CONST: C O N S T ;
BANK: B A N K ;
PTR: P T R ;
AS: A S ;
AT: A T ;

// Literals and identifiers (order matters - more specific first)
// DIRECTIVE_NAME must come before BIN_INTEGER since both start with %
// DEC_INTEGER must come before FLOAT_NUMBER so plain integers like 0 aren't matched as floats
DIRECTIVE_NAME: '%' [a-zA-Z_][a-zA-Z0-9_]* ;
DEC_INTEGER :  DEC_DIGIT (DEC_DIGIT | '_')* ;
HEX_INTEGER :  '$' HEX_DIGIT (HEX_DIGIT | '_')* ;
BIN_INTEGER :  '%' BIN_DIGIT (BIN_DIGIT | '_')* ;
FLOAT_NUMBER :  FNUMBER (('E'|'e') ('+' | '-')? DEC_INTEGER)? ;
fragment FNUMBER : FDOTNUMBER |  FNUMDOTNUMBER ;
fragment FDOTNUMBER : DOT (DEC_DIGIT | '_')+ ;
fragment FNUMDOTNUMBER : DEC_DIGIT (DEC_DIGIT | '_')* FDOTNUMBER ;

fragment STRING_ESCAPE_SEQ :  '\\' [\u0021-\u007E] | '\\x' HEX_DIGIT HEX_DIGIT | '\\u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT;

// Character literal must come BEFORE STRING_LIT to match first
// Matches: " "c, "g"c, "\t"c, etc.
CHARLITERAL :
    '"' ( STRING_ESCAPE_SEQ | ~[\\\r\n\f"] ) '"' [cC]
    ;

STRING_LIT :
    '"' ( STRING_ESCAPE_SEQ | ~[\\\r\n\f"] )* '"'
    ;

INLINEASMBLOCK :
    '{{' .+? '}}'
    ;

TAG: ATSIGN ([a-zA-Z0-9])+ ;

EMPTYARRAYSIG : LBRACKET [ \t]* RBRACKET ;

// Identifiers (must come after keywords)
UNICODEDNAME :  [\p{Letter}][\p{Letter}\p{Mark}\p{Digit}_]* ;
UNDERSCORENAME :  '_' UNICODEDNAME ;


// ============================================================================
// PARSER RULES
// ============================================================================

// A module (file) consists of directives and module blocks
module: EOL* (module_element (EOL+ module_element)*)? EOL* EOF;

module_element:
    directive | block ;


// MODULE name [AT $addr] ... END MODULE
block: MODULE identifier (AT integerliteral)? EOL? block_body END MODULE;

block_body: (block_statement | EOL | COLON)* ;

block_statement:
    directive
    | variabledeclaration
    | structdeclaration
    | subroutinedeclaration
    | inlineasm
    | labeldef
    | alias
    ;


statement :
    directive
    | ongoto
    | variabledeclaration
    | structdeclaration
    | functioncall_stmt      // must come before assignment - func() is unambiguous, id = ... needs lookahead
    | assignment
    | augassignment
    | unconditionaljump
    | postincrdecr
    | incdecstmt
    | pokestmt
    | if_stmt
    | branch_stmt
    | subroutinedeclaration
    | inlineasm
    | returnstmt
    | forloop
    | whileloop
    | untilloop
    | repeatloop
    | unrollloop
    | whenstmt
    | breakstmt
    | continuestmt
    | labeldef
    | defer
    | alias
    ;


variabledeclaration :
    dimstmt
    | constdecl
    ;


structdeclaration:
    TYPE identifier EOL? (structfielddecl | EOL)+ END TYPE
    ;

structfielddecl: identifierlist AS datatype ;


subroutinedeclaration :
    subroutine
    | functiondecl
    | asmsubroutine
    | extsubroutine
    ;

alias: ALIAS identifier ASSIGN scoped_identifier ;

defer: DEFER (statement | statement_block) ;

labeldef :  identifier COLON EOL ;    // EOL required to disambiguate from : statement separator

unconditionaljump :  GOTO expression ;

// ============================================================================
// DIRECTIVES
// ============================================================================

directive:
    importdirective
    | zeropagedir
    | addressdir
    | memtopdir
    | encodingdir
    | outputdir
    | launcherdir
    | optiondir
    | zpreserveddir
    | zpalloweddir
    | breakpointdir
    | asmbinarydir
    | asmincludedir
    | aligndir
    | jmptabledir
    | mergedir
    | forceoutputdir
    | verafxmulsdir
    | genericdirective       // Prog8-compatible fallback for any %directive
    ;

importdirective: IMPORT identifier ;
zeropagedir: ZEROPAGE identifier ;
addressdir: ADDRESS integerliteral ;
memtopdir: MEMTOP integerliteral ;
encodingdir: ENCODING identifier ;
outputdir: OUTPUT identifier ;
launcherdir: LAUNCHER identifier ;
optiondir: OPTION identifier ;
zpreserveddir: ZPRESERVED integerliteral COMMA integerliteral ;
zpalloweddir: ZPALLOWED integerliteral COMMA integerliteral ;
breakpointdir: BREAKPOINT ;
asmbinarydir: ASMBINARY stringliteral (COMMA expression (COMMA expression)?)? ;
asmincludedir: ASMINCLUDE stringliteral ;
aligndir: ALIGN integerliteral ;
jmptabledir: JMPTABLE scoped_identifier (COMMA scoped_identifier)* ;
mergedir: MERGE ;
forceoutputdir: FORCE_OUTPUT ;
verafxmulsdir: VERAFXMULS ;

// Generic Prog8-compatible directive: %name args or %name (list)
// Allows any directive syntax, validation done at compile time
genericdirective: DIRECTIVE_NAME (directivenamelist | (directivearg (',' directivearg)*)?) ;
directivenamelist: LPAREN EOL? scoped_identifier (COMMA EOL? scoped_identifier)* COMMA? EOL? RPAREN ;
directivearg: stringliteral | identifier | integerliteral ;

// ============================================================================
// VARIABLE DECLARATIONS
// ============================================================================

// DIM varname[size] AS TYPE [@tags] [= value] [AT address]
dimstmt:
    DIM identifierlist (arrayindex | EMPTYARRAYSIG)? AS datatype TAG* (ASSIGN expression)? (AT expression)?
    ;

constdecl: CONST identifierlist AS datatype ASSIGN expression ;

basedatatype:  UBYTE | BYTE | UWORD | WORD | LONG | FLOAT | STRING | BOOL ;

datatype: pointertype | basedatatype | structtype=scoped_identifier;

pointertype: (PTR | POINTER) (scoped_identifier | basedatatype);

arrayindex:  LBRACKET expression RBRACKET ;

// ============================================================================
// ASSIGNMENTS
// ============================================================================

// Order matters: try chained assignment first so 'a = b = 0' parses as chained assignment
// rather than 'a = (b == 0)' comparison
assignment :  (assign_target ASSIGN assignment) | (assign_target ASSIGN expression) | (multi_assign_target ASSIGN expression);

augassignment :
    assign_target operator=(PLUSEQ | MINUSEQ | SLASHEQ | STAREQ | MODEQ | ANDEQ | OREQ | XOREQ | SHLEQ | SHREQ) expression
    ;

assign_target:
    scoped_identifier               #IdentifierTarget
    | arrayindexed                  #ArrayindexedTarget
    | directmemory                  #MemoryTarget
    | pointerdereference            #PointerDereferenceTarget
    | VOID                          #VoidTarget
    ;


multi_assign_target:
    assign_target (COMMA assign_target)+ ;

postincrdecr :  assign_target operator = (PLUSPLUS | MINUSMINUS) ;

// INC x / DEC x statements
incdecstmt : operator=(INC | DEC) assign_target ;

// POKE address, value
pokestmt : POKE expression COMMA expression ;

// ============================================================================
// EXPRESSIONS
// ============================================================================

expression :
    LPAREN expression RPAREN
    | sizeof_expression = SIZEOF LPAREN sizeof_argument RPAREN
    | peekexpr
    | addressof_expr
    | functioncall
    | left = expression EOL? bop = DOT EOL? right = expression          // scope traversal operator
    | <assoc=right> prefix = (PLUS|MINUS|TILDE|NOT|BITNOT) expression
    | left = expression EOL? bop = (STAR | SLASH | MOD ) EOL? right = expression
    | left = expression EOL? bop = (PLUS | MINUS ) EOL? right = expression
    | left = expression EOL? bop = (SHIFTLEFT | SHIFTRIGHT | SHL | SHR ) EOL? right = expression
    | left = expression EOL? bop = (ADDRESS_OF | BITAND) EOL? right = expression
    | left = expression EOL? bop = (CARET | BITXOR) EOL? right = expression
    | left = expression EOL? bop = (PIPE | BITOR) EOL? right = expression
    | left = expression EOL? bop = (LT | GT | LE | GE) EOL? right = expression
    | left = expression EOL? bop = (EQ | ASSIGN | NE) EOL? right = expression    // EQ (==) or ASSIGN (=) for equality, NE (<>) for not-equal
    | rangefrom = expression rto = (TO|DOWNTO) rangeto = expression (STEP rangestep = expression)?
    | left = expression EOL? bop = IN EOL? right = expression
    | left = expression EOL? NOT IN EOL? right = expression
    | left = expression EOL? bop = AND EOL? right = expression
    | left = expression EOL? bop = OR EOL? right = expression
    | left = expression EOL? bop = XOR EOL? right = expression
    | literalvalue
    | scoped_identifier
    | arrayindexed
    | directmemory
    | addressof
    | expression typecast
    | if_expression
    | branchcondition_expression
    | pointerdereference
    | staticstructinitializer
    ;


sizeof_argument: basedatatype | expression | pointertype ;

// PEEK(address)
peekexpr: PEEK LPAREN expression RPAREN ;

// ADDRESSOF(var) or TYPEDADDR(var)
addressof_expr: (ADDRESSOF_KW | TYPEDADDR_KW) LPAREN scoped_identifier arrayindex? RPAREN ;

arrayindexed:
    scoped_identifier arrayindex
    ;


typecast : AS datatype;

directmemory : ATSIGN LPAREN expression RPAREN;

addressof : <assoc=right> (ADDRESS_OF | TYPED_ADDRESS_OF | ADDRESS_OF_LSB | ADDRESS_OF_MSB) scoped_identifier arrayindex? ;

functioncall : scoped_identifier LPAREN EOL? expression_list? EOL? RPAREN  ;

// CALL is optional: CALL mysub() or just mysub()
functioncall_stmt : VOID? CALL? scoped_identifier LPAREN EOL? expression_list? EOL? RPAREN  ;

expression_list :
    expression (COMMA EOL? expression)*
    ;

returnstmt : RETURN returnvalues? ;

returnvalues: expression (COMMA expression)*  ;

breakstmt : BREAK | EXIT FOR | EXIT DO | EXIT WHILE ;

continuestmt: CONTINUE ;

identifier :  UNICODEDNAME | UNDERSCORENAME | ON | CALL | INLINE | STEP
            | IMPORT | ZEROPAGE | ADDRESS | MEMTOP | ENCODING | OUTPUT | LAUNCHER
            | OPTION | ZPRESERVED | ZPALLOWED | BREAKPOINT | ASMBINARY | ASMINCLUDE
            | ALIGN | JMPTABLE | MERGE | FORCE_OUTPUT | VERAFXMULS ;

scoped_identifier :  identifier (DOT identifier)* ;

integerliteral :  intpart=(DEC_INTEGER | HEX_INTEGER | BIN_INTEGER) ;

booleanliteral :  TRUE | FALSE ;

arrayliteral :  EMPTYARRAYSIG | LBRACKET EOL? expression? (COMMA EOL? expression)* COMMA? EOL? RBRACKET ;

stringliteral : (encoding=UNICODEDNAME COLON)? STRING_LIT ;

charliteral : (encoding=UNICODEDNAME COLON)? CHARLITERAL ;

floatliteral :  FLOAT_NUMBER ;


literalvalue :
    integerliteral
    | booleanliteral
    | arrayliteral
    | charliteral
    | stringliteral
    | floatliteral
    ;

// ASM ... END ASM  or  IR ... END IR
// Can use either {{ }} block syntax or ASM/END ASM block syntax
inlineasm :  asmtype=(ASM | IR) EOL? INLINEASMBLOCK
           | ASMBLOCK_CONTENT
           ;

// ============================================================================
// SUBROUTINES
// ============================================================================

// SUB name(params) ... END SUB
subroutine :
    SUB identifier LPAREN sub_params? RPAREN EOL? subroutine_body END SUB
    ;

// FUNCTION name(params) AS returntype[, returntype] ... END FUNCTION
functiondecl :
    FUNCTION identifier LPAREN sub_params? RPAREN AS datatype (COMMA datatype)* EOL? subroutine_body END FUNCTION
    ;

subroutine_body: (statement | EOL | COLON)* ;

sub_params :  sub_param (COMMA EOL? sub_param)* ;

sub_param: identifier (arrayindex | EMPTYARRAYSIG)? AS datatype TAG? ;

// ASMSUB name(params) [CLOBBERS(regs)] [AS returntype @reg] ... END ASMSUB
asmsubroutine :
    INLINE? ASMSUB asmsub_decl EOL? subroutine_body END ASMSUB
    ;

extsubroutine :
    EXTSUB (AT BANK (constbank=integerliteral | varbank=scoped_identifier))? address=expression ASSIGN asmsub_decl
    ;

asmsub_decl : identifier LPAREN asmsub_params? RPAREN asmsub_clobbers? asmsub_returns? ;

asmsub_params :  asmsub_param (COMMA EOL? asmsub_param)* ;

asmsub_param :  identifier (arrayindex | EMPTYARRAYSIG)? AS datatype TAG ;

asmsub_clobbers : CLOBBERS LPAREN clobber? RPAREN ;

clobber :  identifier (COMMA identifier)* ;

asmsub_returns :  AS asmsub_return (COMMA EOL? asmsub_return)* ;

asmsub_return :  datatype TAG ;


// ============================================================================
// CONTROL FLOW
// ============================================================================

// IF condition THEN ... [ELSEIF ... THEN ...] [ELSE ...] END IF
// or single-line: IF condition THEN statement [ELSE statement] (no END IF on single line)
if_stmt :
    IF expression THEN statement (ELSE statement)?                            // single-line if-else: no END IF
    | IF expression THEN? EOL if_body (elseif_part)* else_part? END IF        // block if: requires END IF
    ;

if_body: (statement | EOL | COLON)* ;

elseif_part: ELSEIF expression THEN? EOL? (statement | if_body) ;

else_part :  ELSE EOL? (statement | if_body) ;

if_expression :  IF expression THEN? EOL? expression EOL? ELSE EOL? expression ;

branchcondition_expression:  branchcondition THEN? expression EOL? ELSE EOL? expression ;

pointerdereference:  (prefix = scoped_identifier DOT)? derefchain (DOT field = identifier)? ;

derefchain :  singlederef (DOT singlederef)* ;

singlederef : identifier arrayindex? POINTER ;

branch_stmt : branchcondition EOL? (statement | statement_block) EOL? else_part? ;

branchcondition: IF_CS | IF_CC | IF_EQ | IF_Z | IF_NE | IF_NZ | IF_PL | IF_POS | IF_MI | IF_NEG | IF_VS | IF_VC ;


// FOR i = start TO end [STEP n] ... NEXT
// FOR i IN [val1, val2, val3] ... NEXT
forloop :  FOR scoped_identifier (ASSIGN expression (TO | DOWNTO) expression (STEP expression)? | IN expression) EOL? forloop_body NEXT ;

forloop_body: (statement | EOL | COLON)* ;

// WHILE condition ... WEND
whileloop:  WHILE expression EOL? whileloop_body WEND ;

whileloop_body: (statement | EOL | COLON)* ;

// DO ... LOOP [UNTIL condition]  (without UNTIL = infinite loop)
untilloop:  DO EOL? doloop_body LOOP (UNTIL expression)? ;

doloop_body: (statement | EOL | COLON)* ;

// REPEAT [n] ... END REPEAT
// or single-line: REPEAT [n] statement
repeatloop:
    REPEAT expression? statement                                              // single-line repeat
    | REPEAT expression? EOL? repeatloop_body END REPEAT                      // block repeat: requires END REPEAT
    ;

repeatloop_body: (statement | EOL | COLON)* ;

// UNROLL n ... END UNROLL
unrollloop:  UNROLL expression EOL? unrollloop_body END UNROLL ;

unrollloop_body: (statement | EOL | COLON)* ;

// SELECT CASE expr ... CASE val ... CASE ELSE ... END SELECT
whenstmt: SELECT CASE expression EOL? (when_choice | EOL)* END SELECT ;

when_choice:  (CASE expression_list | CASE ELSE) EOL? when_body ;

when_body: (statement | EOL | COLON)* ;

// ON expr GOTO/GOSUB label1, label2, ...
ongoto: ON expression kind=(GOTO | GOSUB | CALL) identifierlist EOL? else_part? ;

identifierlist: identifier (COMMA identifier)* ;

staticstructinitializer: POINTER? scoped_identifier COLON arrayliteral ;

// Block statement for branch_stmt and defer
statement_block :
    EOL?
        (statement | EOL | COLON) *
    END (IF | SUB | FUNCTION | ASMSUB | MODULE | FOR | WHILE | DO | REPEAT | UNROLL | SELECT | DEFER | ASM | IR | TYPE)?
    ;
