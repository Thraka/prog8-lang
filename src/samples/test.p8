; Sample Prog8 program to test syntax highlighting
; This is a line comment

/*
 * This is a block comment
 * spanning multiple lines
 */

%import textio
%import math
%import floats
%zeropage basicsafe
%option no_sysinit

main {

    ; Constants
    const ubyte MAX_COUNT = 100
    const float PI_VALUE = 3.14159

    ; Variables with various types
    ubyte counter, counter2 = 0
    byte signed_val = -42
    uword address = $c000
    word negative_word = -1000
    long big_number = $12345678
    float pi = 3.14159
    bool flag = true
    str message = "Hello, World!\n"
    
    ; Arrays
    ubyte[10] buffer
    ubyte[] data = [1, 2, 3, 4, 5]
    word[] @nosplit words = [100, 200, 300]
    
    ; Memory-mapped variable
    &ubyte BORDER_COLOR = $d020
    
    ; Variable with tags
    ubyte @zp fast_var = 0
    uword @requirezp critical_ptr = $4000
    byte @shared asm_shared = 0
    
    sub start() {
        ; Simple output
        txt.print("Prog8 Syntax Test\n")
        txt.print(sc:"Screencode string\n")
        txt.print(iso:"ISO encoded: café\n")
        
        ; For loop
        ubyte i
        for i in 0 to 9 {
            txt.print_ub(i)
            txt.spc()
        }
        txt.nl()
        
        ; Downto loop with step
        for i in 20 downto 10 step -2 {
            txt.print_ub(i)
            txt.spc()
        }
        txt.nl()
        
        ; While loop
        counter = 0
        while counter < 5 {
            counter++
        }
        
        ; Do-until loop
        do {
            counter--
        } until counter == 0
        
        ; Repeat loop
        repeat 10 {
            txt.chrout('*')
        }
        txt.nl()
        
        ; If-else
        if counter == 0 {
            txt.print("Counter is zero\n")
        } else if counter < 10 {
            txt.print("Counter is small\n")
        } else {
            txt.print("Counter is large\n")
        }
        
        ; When statement
        when counter {
            0 -> txt.print("zero")
            1, 2, 3 -> txt.print("one to three")
            10 to 20 -> txt.print("ten to twenty")
            else -> txt.print("other")
        }
        txt.nl()
        
        ; Conditional branches
        if_cs goto carry_set
        if_cc {
            txt.print("carry clear\n")
        }
        
        ; Built-in functions
        ubyte low = lsb(address)
        ubyte high = msb(address)
        uword combined = mkword(high, low)
        ubyte size = sizeof(buffer)
        ubyte length = len(message)
        
        ; Math operations
        word result = abs(-100)
        ubyte minimum = min(10, 20)
        ubyte maximum = max(10, 20)
        
        ; Bitwise operations
        ubyte bits = %10101010
        rol(bits)
        ror(bits)
        bits = bits << 2
        bits = bits >> 1
        bits = bits & $0f
        bits = bits | $f0
        bits = bits ^ $ff
        bits = ~bits
        
        ; Logical operations
        if flag and not false {
            flag = true or false
            flag = true xor false
        }
        
        ; Containment check
        if 5 in [1, 2, 3, 4, 5] {
            txt.print("found!\n")
        }
        
        ; Type casting
        word signed_result = counter as word
        float float_result = counter as float
        
        ; Pointer operations
        uword ptr = &buffer
        @(ptr) = 42
        @(ptr+1) = peek(ptr)
        poke(ptr+2, 99)
        
        ; Virtual registers (Commander X16)
        cx16.r0 = $1234
        cx16.r1L = $ab
        cx16.r2H = $cd
        
        ; Function calls
        process_data(buffer, len(buffer))
        uword addr = memory("temp_buffer", 256, 1)
        
        ; Subroutine with return value
        ubyte result2 = calculate(10, 20)
        
        ; On-goto jump table
        on counter goto (label1, label2, label3)
        
label1:
        txt.print("label 1\n")
        goto done
label2:
        txt.print("label 2\n")
        goto done
label3:
        txt.print("label 3\n")
        goto done
carry_set:
        txt.print("carry was set\n")
done:
        
        ; Defer example
        defer txt.print("cleanup!\n")
        
        return
    }
    
    sub calculate(ubyte a, ubyte b) -> ubyte {
        return a + b
    }
    
    sub process_data(uword data_ptr, ubyte size) {
        ; Process the data...
        graphics_utils.clear_screen()
        void txt.print("Processing data\n")
    }
    
    ; Assembly subroutine
    asmsub fast_multiply(ubyte value @ A) clobbers(Y) -> ubyte @ A {
        %asm {{
            ; Multiply A by 2
            asl a
            rts
        }}
    }
    
    ; External subroutine (ROM routine)
    extsub $FFD2 = CHROUT(ubyte char @ A) clobbers(A)
    
    ; Inline assembly block
    sub inline_asm_example() {
        %asm {{
            lda #$00
            sta $d020       ; border color
            sta $d021       ; background color
_loop:
            inc $d020
            jmp _loop
        }}
    }
    
    ; Struct definition
    struct Point {
        word x
        word y
    }
    
    ; Struct usage
    sub struct_example() {
        ^^Point p
        p.x = 100
        p.y = 200
        
        ; Typed pointer
        ^^Point ptr = &&p
    }
}

; Another block
graphics_utils $c000 {
    sub clear_screen() {
        sys.memset($0400, 1000, ' ')
    }
}
