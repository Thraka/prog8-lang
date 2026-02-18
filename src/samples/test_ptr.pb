' Test file for PTR type declarations

MODULE test_pointers
    ' Test various pointer declarations
    ' PTR UBYTE should show as ^^ubyte in hover
    DIM _currentLocation AS PTR UBYTE
    DIM doublePtr AS PTR PTR UWORD
    DIM singlePtr AS PTR BYTE
    
    ' Test with caret notation (should still work)
    ' ^^UBYTE should show as ^^ubyte in hover
    DIM caretPtr AS ^^UBYTE
    DIM quadCaret AS ^^^^WORD
    
    ' Test in function parameters
    SUB processPointer(ptr AS PTR UBYTE, data AS PTR PTR WORD)
        ' Function body
    END SUB
    
    ' Test in function return type
    FUNCTION getPointer() AS PTR UBYTE
        RETURN _currentLocation
    END FUNCTION
    
    ' Test in struct
    TYPE MyStruct
        ptr AS PTR UBYTE
        doublePtr AS PTR PTR UWORD
    END TYPE
    
    ' Test constant
    CONST NULL_PTR AS PTR UBYTE = 0
    
END MODULE
