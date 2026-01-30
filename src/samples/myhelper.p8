; Helper module for testing local imports

helpers {
    const ubyte MY_CONST = 42
    
    sub say_hello() {
        txt.print("Hello from helpers!\n")
    }
    
    sub add_numbers(ubyte a, ubyte b) -> ubyte {
        return a + b
    }
}
