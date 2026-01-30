; Test file to verify hover on local imports

%import textio
%import myhelper

main {
    sub start() {
        ; Test hover on these - should show info from myhelper.p8
        txt.print("Testing local imports\n")
        
        ; Hover on "helpers" should show block info
        ; Hover on "say_hello" should show subroutine info
        ; Hover on "MY_CONST" should show constant info
        helpers.say_hello()
        
        ubyte result = helpers.add_numbers(5, 3)
        txt.print_ub(result)
        txt.nl()
        
        txt.print_ub(helpers.MY_CONST)
    }
}
