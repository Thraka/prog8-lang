%import textio
%import diskio
%import palette
%zeropage basicsafe
%option no_sysinit

; Note: this program can be compiled for multiple target systems.

main {
    sub start() {
        
        cx16.set_screen_mode(1)
        palette.set_c64pepto()
        txt.lowercase() ;cx16.screen_set_charset(3, 0)
        txt.cls()
        txt.color2(drawing.BLUE, drawing.CYAN)
        txt.print("  XTREE  File  Directory  Volume  Tag  Window            12/11/2025  8:34:33 PM ")

        const ubyte LINECOLOR = (drawing.BLUE << 4) | drawing.CYAN
        drawing.box(0, 1, 57, 21, LINECOLOR)
        drawing.box(56, 1, 24, 29, LINECOLOR)
        drawing.box(0, 21, 57, 9, LINECOLOR)
        drawing.line_horizontal(57, 3, 22, LINECOLOR)
        drawing.line_horizontal(57, 7, 22, LINECOLOR)

        txt.waitkey()
        ;ubyte color = (bg << 4) | fg
        ;txt.setcc2(0, 0, 65, color)
    }
}

drawing{

    const ubyte BLACK = 0
    const ubyte WHITE = 1
    const ubyte RED = 2
    const ubyte CYAN = 3
    const ubyte PURPLE = 4
    const ubyte GREEN = 5
    const ubyte BLUE = 6
    const ubyte YELLOW = 7
    const ubyte ORANGE = 8
    const ubyte BROWN = 9
    const ubyte LIGHTRED = 10
    const ubyte DARKGREY = 11
    const ubyte GREY = 12
    const ubyte LIGHTGREEN = 13
    const ubyte LIGHTBLUE = 14
    const ubyte LIGHTGREY = 15

    sub line_horizontal(ubyte x, ubyte y, ubyte length, ubyte color) {
        const ubyte HORIZONTAL = 64  ; Horizontal
        ubyte i
        for i in 0 to length-1 {
            txt.setcc2(x+i, y, HORIZONTAL, color)
        }
    }

    sub box(ubyte x, ubyte y, ubyte w, ubyte h, ubyte color) {
        ; Corners and sides (PETSCII codes)
        const ubyte TOPLEFT = 112  ; Top-Left
        const ubyte TOPRIGHT = 110  ; Top-Right
        const ubyte BOTTOMLEFT = 109  ; Bottom-Left
        const ubyte BOTTOMRIGHT = 125  ; Bottom-Right
        const ubyte HORIZONTAL  = 64   ; Horizontal
        const ubyte VERTICAL  = 93   ; Vertical

        ubyte i, j
        
        ; draw corners
        txt.setcc2(x, y, TOPLEFT, color)
        txt.setcc2(x+w-1, y, TOPRIGHT, color)
        txt.setcc2(x, y+h-1, BOTTOMLEFT, color)
        txt.setcc2(x+w-1, y+h-1, BOTTOMRIGHT, color)

        ; draw horizontals
        for i in 1 to w-2 {
            txt.setcc2(x+i, y, HORIZONTAL, color)
            txt.setcc2(x+i, y+h-1, HORIZONTAL, color)
        }

        ; Draw verticals
        for j in 1 to h-2 {
            txt.setcc2(x, y+j, VERTICAL, color)
            txt.setcc2(x+w-1, y+j, VERTICAL, color)
        }
    }
}