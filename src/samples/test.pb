' Sample ProgB (BASIC-style Prog8) program
/' This is a block comment
   that spans multiple lines '/

IMPORT textio
IMPORT conv
IMPORT math
ZEROPAGE basicsafe

MODULE mainOther
    ' Module-level variable declarations
    DIM buffer[10], bob AS UBYTE
    DIM counter AS UBYTE = 0
    DIM fastptr AS UWORD @zp
    CONST MAX_ITEMS AS UBYTE = 100
    DIM BORDER AS UBYTE AT $d020

    ' Main entry point
    SUB start()
        DIM secret AS UBYTE = math.rnd() MOD 100 + 1
        DIM guess AS UBYTE
        DIM attempts AS UBYTE = 0
        
        txt.print("Guess the number (1-100)!\n")
        
        ' Game loop
        DO
            txt.print("Your guess: ")
            guess = conv.str2ubyte(txt.input_chars(buffer))
            attempts++
            
            IF guess < secret THEN
                txt.print("Too low!\n")
            ELSEIF guess > secret THEN
                txt.print("Too high!\n")
            END IF
        LOOP UNTIL guess = secret
        
        txt.print("Correct! Attempts: ")
        txt.print_ub(attempts)
        txt.nl()
        
        CALL demonstrate_loops()
    END SUB
    
    ' Function with return value
    FUNCTION calculate(a AS UBYTE, b AS UBYTE) AS UBYTE
        RETURN a + b
    END FUNCTION
    
    ' Demonstrate various loop types
    SUB demonstrate_loops()
        DIM i AS UBYTE
        DIM values[] AS UWORD = [100, 200, 300, 400, 500]
        maino
        ' Range-based FOR loop
        FOR i = 0 TO 9
            txt.print_ub(i)
            txt.spc()
        NEXT
        txt.nl()
        
        ' Downward FOR loop
        FOR i = 10 DOWNTO 1 STEP -1
            txt.print_ub(i)
            txt.spc()
        NEXT
        txt.nl()
        
        ' Array iteration FOR loop
        FOR cx16.r0 IN values
            txt.print_uw(cx16.r0)
            txt.spc()
        NEXT
        txt.nl()
        
        ' WHILE loop
        i = 0
        WHILE i < 5
            txt.print_ub(i)
            i++
        WEND
        txt.nl()
        
        ' REPEAT loop
        REPEAT 5
            txt.print("*")
        END REPEAT
        txt.nl()

        ' SELECT CASE statement
        SELECT CASE i
            CASE 1
                txt.print("one")
            CASE 2, 3
                txt.print("two or three")
            CASE ELSE
                txt.print("other")
        END SELECT
        
    END SUB
    
    ' Inline assembly example
    ASMSUB plot(x AS UWORD @AX, y AS UBYTE @Y) CLOBBERS(A, X, Y)
        ASM
            ' Assembly code here
            lda #$00
            sta $d020
        END ASM
    END ASMSUB
    
    ' External subroutine declaration
    EXTSUB $ffd2 = chrout(c AS UBYTE @A) CLOBBERS(A)
    
END MODULE

' Another module with address
MODULE data AT $c000
    DIM origin AS Point
    DIM screen_colors[256] AS UBYTE @align256
    
    ' Struct definition
    TYPE Point
        x AS UBYTE
        y AS UBYTE
    END TYPE
    
    
END MODULE
