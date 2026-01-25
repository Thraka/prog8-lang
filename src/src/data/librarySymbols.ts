/**
 * Auto-generated Prog8 library symbol data.
 * Generated from official Prog8 skeleton files.
 * DO NOT EDIT MANUALLY - run parseSkeletons.ts to regenerate.
 */

export interface Parameter {
    name: string;
    type: string;
    register?: string;
}

export interface ReturnType {
    type: string;
    register?: string;
}

export interface SubroutineInfo {
    name: string;
    parameters: Parameter[];
    returns: ReturnType[];
    clobbers: string[];
    address?: string;
    bank?: number;
    isAlias?: string;
}

export interface VariableInfo {
    name: string;
    type: string;
    isMemoryMapped: boolean;
    isShared: boolean;
    isZeroPage: boolean;
}

export interface ConstantInfo {
    name: string;
    type: string;
    value?: string;
}

export interface BlockInfo {
    name: string;
    subroutines: SubroutineInfo[];
    variables: VariableInfo[];
    constants: ConstantInfo[];
}

export interface ModuleInfo {
    name: string;
    blocks: BlockInfo[];
}

export interface LibraryData {
    target: string;
    version: string;
    modules: ModuleInfo[];
}

export const library_cx16: LibraryData = {
  "target": "cx16",
  "version": "12.1",
  "modules": [
    {
      "name": "bcd",
      "blocks": [
        {
          "name": "bcd",
          "subroutines": [
            {
              "name": "addb",
              "parameters": [
                {
                  "name": "a",
                  "type": "byte"
                },
                {
                  "name": "b",
                  "type": "byte"
                }
              ],
              "returns": [
                {
                  "type": "byte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "addl",
              "parameters": [
                {
                  "name": "a",
                  "type": "long"
                },
                {
                  "name": "b",
                  "type": "long"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "addtol",
              "parameters": [
                {
                  "name": "a",
                  "type": "^^long"
                },
                {
                  "name": "b",
                  "type": "long"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "addub",
              "parameters": [
                {
                  "name": "a",
                  "type": "ubyte"
                },
                {
                  "name": "b",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "adduw",
              "parameters": [
                {
                  "name": "a",
                  "type": "uword"
                },
                {
                  "name": "b",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "addw",
              "parameters": [
                {
                  "name": "a",
                  "type": "word"
                },
                {
                  "name": "b",
                  "type": "word"
                }
              ],
              "returns": [
                {
                  "type": "word"
                }
              ],
              "clobbers": []
            },
            {
              "name": "clearbcd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "setbcd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "subb",
              "parameters": [
                {
                  "name": "a",
                  "type": "byte"
                },
                {
                  "name": "b",
                  "type": "byte"
                }
              ],
              "returns": [
                {
                  "type": "byte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "subfroml",
              "parameters": [
                {
                  "name": "a",
                  "type": "^^long"
                },
                {
                  "name": "b",
                  "type": "long"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "subl",
              "parameters": [
                {
                  "name": "a",
                  "type": "long"
                },
                {
                  "name": "b",
                  "type": "long"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "subub",
              "parameters": [
                {
                  "name": "a",
                  "type": "ubyte"
                },
                {
                  "name": "b",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "subuw",
              "parameters": [
                {
                  "name": "a",
                  "type": "uword"
                },
                {
                  "name": "b",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "bmx",
      "blocks": [
        {
          "name": "bmx",
          "subroutines": [
            {
              "name": "build_header",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "bytes_per_scanline",
              "parameters": [
                {
                  "name": "w",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "close",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "continue_load",
              "parameters": [
                {
                  "name": "vbank",
                  "type": "ubyte"
                },
                {
                  "name": "vaddr",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "continue_load_only_palette",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "continue_load_stamp",
              "parameters": [
                {
                  "name": "vbank",
                  "type": "ubyte"
                },
                {
                  "name": "vaddr",
                  "type": "uword"
                },
                {
                  "name": "screenwidth",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "open",
              "parameters": [
                {
                  "name": "drivenumber",
                  "type": "ubyte"
                },
                {
                  "name": "filename",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "parse_header",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "read_bitmap",
              "parameters": [
                {
                  "name": "vbank",
                  "type": "ubyte"
                },
                {
                  "name": "vaddr",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "read_bitmap_padded",
              "parameters": [
                {
                  "name": "vbank",
                  "type": "ubyte"
                },
                {
                  "name": "vaddr",
                  "type": "uword"
                },
                {
                  "name": "screenwidth",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "read_header",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "read_palette",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "read_scanline",
              "parameters": [
                {
                  "name": "size",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "save",
              "parameters": [
                {
                  "name": "drivenumber",
                  "type": "ubyte"
                },
                {
                  "name": "filename",
                  "type": "str"
                },
                {
                  "name": "vbank",
                  "type": "ubyte"
                },
                {
                  "name": "vaddr",
                  "type": "uword"
                },
                {
                  "name": "screenwidth",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "set_bpp",
              "parameters": [
                {
                  "name": "bpp",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_vera_colordepth",
              "parameters": [
                {
                  "name": "depth",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "write_bitmap",
              "parameters": [
                {
                  "name": "vbank",
                  "type": "ubyte"
                },
                {
                  "name": "vaddr",
                  "type": "uword"
                },
                {
                  "name": "screenwidth",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "write_header",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "write_palette",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "FILEID",
              "type": "str",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "bitsperpixel",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "border",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "compression",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "error_message",
              "type": "^^ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "header",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "height",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "old_drivenumber",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "palette_buffer_ptr",
              "type": "^^ubyte",
              "isMemoryMapped": false,
              "isShared": true,
              "isZeroPage": false
            },
            {
              "name": "palette_entries",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "palette_start",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "vera_colordepth",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "width",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        }
      ]
    },
    {
      "name": "buffers",
      "blocks": [
        {
          "name": "smallringbuffer",
          "subroutines": [
            {
              "name": "free",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "getw",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isempty",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "isfull",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "put",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "putw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "buffer",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "fill",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "head",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "tail",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "smallstack",
          "subroutines": [
            {
              "name": "free",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isempty",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "isfull",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "pop",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "popw",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "push",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pushw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "buffer",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "sp",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "stack",
          "subroutines": [
            {
              "name": "free",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [
                {
                  "name": "rambank",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isempty",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "isfull",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "pop",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "popw",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "push",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pushw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "bank",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "sp",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "ringbuffer",
          "subroutines": [
            {
              "name": "free",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "getw",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "inc_head",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "inc_tail",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [
                {
                  "name": "rambank",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isempty",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "isfull",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "put",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "putw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "tail",
              "type": "uword fill, head,",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "bank",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        }
      ]
    },
    {
      "name": "compression",
      "blocks": [
        {
          "name": "compression",
          "subroutines": [
            {
              "name": "decode_rle",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "maxsize",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "decode_rle_srcfunc",
              "parameters": [
                {
                  "name": "source_function",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "maxsize",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "decode_rle_vram",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "vbank",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "vaddr",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "decode_tscrunch",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "decode_tscrunch_inplace",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "decode_zx0",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "encode_rle",
              "parameters": [
                {
                  "name": "data",
                  "type": "uword"
                },
                {
                  "name": "size",
                  "type": "uword"
                },
                {
                  "name": "target",
                  "type": "uword"
                },
                {
                  "name": "is_last_block",
                  "type": "bool"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "encode_rle_outfunc",
              "parameters": [
                {
                  "name": "data",
                  "type": "uword"
                },
                {
                  "name": "size",
                  "type": "uword"
                },
                {
                  "name": "output_function",
                  "type": "uword"
                },
                {
                  "name": "is_last_block",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "conv",
      "blocks": [
        {
          "name": "conv",
          "subroutines": [
            {
              "name": "any2uword",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "bin2uword",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "hex2long",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "hex2uword",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_byte2decimal",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_ubyte2decimal",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_ubyte2hex",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "internal_uword2decimal",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_uword2hex",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "str2byte",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "str2ubyte",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "str2uword",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "str2word",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "str_b",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_l",
              "parameters": [
                {
                  "name": "value",
                  "type": "long"
                }
              ],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "str_ub",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_ub0",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_ubbin",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_ubhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_ulhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "long"
                }
              ],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "str_uw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_uw0",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_uwbin",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_uwhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "str_w",
              "parameters": [
                {
                  "name": "value",
                  "type": "word",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            }
          ],
          "variables": [
            {
              "name": "string_out",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": true,
              "isZeroPage": false
            }
          ],
          "constants": []
        }
      ]
    },
    {
      "name": "coroutines",
      "blocks": [
        {
          "name": "coroutines",
          "subroutines": [
            {
              "name": "add",
              "parameters": [
                {
                  "name": "taskaddress",
                  "type": "uword"
                },
                {
                  "name": "userdata",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "current",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "kill",
              "parameters": [
                {
                  "name": "taskid",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "killall",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "run",
              "parameters": [
                {
                  "name": "supervisor_routine",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "termination",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "yield",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "active_task",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "supervisor",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "tasklist",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "userdatas",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "MAX_TASKS",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "cx16logo",
      "blocks": [
        {
          "name": "cx16logo",
          "subroutines": [
            {
              "name": "logo",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "logo_at",
              "parameters": [
                {
                  "name": "column",
                  "type": "ubyte"
                },
                {
                  "name": "row",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "logo_lines",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        }
      ]
    },
    {
      "name": "diskio",
      "blocks": [
        {
          "name": "diskio",
          "subroutines": [
            {
              "name": "chdir",
              "parameters": [
                {
                  "name": "path",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "curdir",
              "parameters": [],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "delete",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "directory",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "directory_dirs",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "directory_files",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "diskname",
              "parameters": [],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "exists",
              "parameters": [
                {
                  "name": "filename",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_close",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "f_close_w",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "f_fatlba",
              "parameters": [],
              "returns": [
                {
                  "type": "long"
                },
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_open",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_open_w",
              "parameters": [
                {
                  "name": "filename",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_open_w_seek",
              "parameters": [
                {
                  "name": "filename",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_read",
              "parameters": [
                {
                  "name": "bufferpointer",
                  "type": "uword"
                },
                {
                  "name": "num_bytes",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_read_all",
              "parameters": [
                {
                  "name": "bufferpointer",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_readline",
              "parameters": [
                {
                  "name": "bufptr",
                  "type": "^^ubyte",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "f_seek",
              "parameters": [
                {
                  "name": "position",
                  "type": "long"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "f_seek_w",
              "parameters": [
                {
                  "name": "position",
                  "type": "long"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "f_tell",
              "parameters": [],
              "returns": [
                {
                  "type": "long"
                },
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_write",
              "parameters": [
                {
                  "name": "bufferpointer",
                  "type": "uword"
                },
                {
                  "name": "num_bytes",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "fastmode",
              "parameters": [
                {
                  "name": "mode",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get_loadaddress",
              "parameters": [
                {
                  "name": "filename",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "internal_f_open_w",
              "parameters": [
                {
                  "name": "filename",
                  "type": "str"
                },
                {
                  "name": "open_for_seeks",
                  "type": "bool"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "internal_load_routine",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "address_override",
                  "type": "uword"
                },
                {
                  "name": "headerless",
                  "type": "bool"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "internal_next_entry",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "internal_save_routine",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "startaddress",
                  "type": "uword"
                },
                {
                  "name": "savesize",
                  "type": "uword"
                },
                {
                  "name": "headerless",
                  "type": "bool"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_end_list",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lf_next_entry",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_next_entry_nocase",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_start_list",
              "parameters": [
                {
                  "name": "pattern_ptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_start_list_dirs",
              "parameters": [
                {
                  "name": "pattern_ptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_start_list_files",
              "parameters": [
                {
                  "name": "pattern_ptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "list_filenames",
              "parameters": [
                {
                  "name": "pattern_ptr",
                  "type": "str"
                },
                {
                  "name": "filenames_buffer",
                  "type": "uword"
                },
                {
                  "name": "filenames_buf_size",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "list_filenames_nocase",
              "parameters": [
                {
                  "name": "lowercase_pattern_ptr",
                  "type": "str"
                },
                {
                  "name": "filenames_buffer",
                  "type": "uword"
                },
                {
                  "name": "filenames_buf_size",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "load",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "address_override",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "load_raw",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "startaddress",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "load_size",
              "parameters": [
                {
                  "name": "startbank",
                  "type": "ubyte"
                },
                {
                  "name": "startaddress",
                  "type": "uword"
                },
                {
                  "name": "endaddress",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "loadlib",
              "parameters": [
                {
                  "name": "libnameptr",
                  "type": "str"
                },
                {
                  "name": "libaddress",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "mkdir",
              "parameters": [
                {
                  "name": "name",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "read8hex",
              "parameters": [],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "relabel",
              "parameters": [
                {
                  "name": "name",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rename",
              "parameters": [
                {
                  "name": "oldfileptr",
                  "type": "str"
                },
                {
                  "name": "newfileptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "reset_read_channel",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "reset_write_channel",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rmdir",
              "parameters": [
                {
                  "name": "name",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "save",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "startaddress",
                  "type": "uword"
                },
                {
                  "name": "savesize",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "save_raw",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "startaddress",
                  "type": "uword"
                },
                {
                  "name": "savesize",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "send_command",
              "parameters": [
                {
                  "name": "commandptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "status",
              "parameters": [],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "status_code",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "vload",
              "parameters": [
                {
                  "name": "name",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "startaddress",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            },
            {
              "name": "vload_raw",
              "parameters": [
                {
                  "name": "name",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "startaddress",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            }
          ],
          "variables": [
            {
              "name": "drivenumber",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": true,
              "isZeroPage": false
            },
            {
              "name": "iteration_in_progress",
              "type": "bool",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_blocks",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_filename",
              "type": "str",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_filetype",
              "type": "str",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_pattern",
              "type": "^^ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_skip_disk_name",
              "type": "bool",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "write_iteration_in_progress",
              "type": "bool",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "READ_IO_CHANNEL",
              "type": "ubyte"
            },
            {
              "name": "STATUS_EOF",
              "type": "ubyte"
            },
            {
              "name": "WRITE_IO_CHANNEL",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "emudbg",
      "blocks": [
        {
          "name": "emudbg",
          "subroutines": [
            {
              "name": "console_chrout",
              "parameters": [
                {
                  "name": "char",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "console_nl",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "console_value1",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "console_value2",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "console_write",
              "parameters": [
                {
                  "name": "isoString",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "cpu_cycles",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "is_emulator",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "reset_cpu_cycles",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "EMU_CHROUT",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_CMDKEYS_DISABLED",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_CPUCLK_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_CPUCLK_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_CPUCLK_M",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_CPUCLK_RESET",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_CPUCLK_U",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_DBGOUT1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_DBGOUT2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_DBG_HOTKEY_ENABLED",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_ECHO_MODE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_EMU_DETECT1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_EMU_DETECT2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_KEYMAP",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_LOG_KEYBOARD",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_LOG_VIDEO",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_RECORD_GIF",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_RECORD_WAV",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EMU_SAVE_ON_EXIT",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "EMU_BASE",
              "type": "uword"
            }
          ]
        }
      ]
    },
    {
      "name": "floats",
      "blocks": [
        {
          "name": "floats",
          "subroutines": [
            {
              "name": "ABS",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe4e"
            },
            {
              "name": "ATN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe48"
            },
            {
              "name": "AYINT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe00"
            },
            {
              "name": "AYINT2",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "CONUPK",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe5a"
            },
            {
              "name": "COS",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe3f"
            },
            {
              "name": "DIV10",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe7e"
            },
            {
              "name": "EXP",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe3c"
            },
            {
              "name": "FADD",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe18"
            },
            {
              "name": "FADDH",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe6f"
            },
            {
              "name": "FADDT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe1b"
            },
            {
              "name": "FCOMP",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$fe54"
            },
            {
              "name": "FDIV",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe24"
            },
            {
              "name": "FDIVT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe27"
            },
            {
              "name": "FINLOG",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe90"
            },
            {
              "name": "FLOAT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe87"
            },
            {
              "name": "FLOATC",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe0f"
            },
            {
              "name": "FLOATS",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe8a"
            },
            {
              "name": "FMULT",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe1e"
            },
            {
              "name": "FMULTT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe21"
            },
            {
              "name": "FOUT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$fe06"
            },
            {
              "name": "FPWR",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe36"
            },
            {
              "name": "FPWRT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe39"
            },
            {
              "name": "FREADSA",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "FREADU24AXY",
              "parameters": [
                {
                  "name": "lo",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "mid",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "hi",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "FREADUY",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "FSUB",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe12"
            },
            {
              "name": "FSUBT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe15"
            },
            {
              "name": "GETADR",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$fe0c"
            },
            {
              "name": "GETADRAY",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "GIVAYF",
              "parameters": [
                {
                  "name": "lo",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "hi",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe03"
            },
            {
              "name": "GIVAYFAY",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "GIVUAYFAY",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "INT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe2d"
            },
            {
              "name": "LOG",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe2a"
            },
            {
              "name": "MOVAF",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$fe6c"
            },
            {
              "name": "MOVEF",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$fe81"
            },
            {
              "name": "MOVFA",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$fe69"
            },
            {
              "name": "MOVFM",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe63"
            },
            {
              "name": "MOVFRM",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe60"
            },
            {
              "name": "MOVMF",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe66"
            },
            {
              "name": "MUL10",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe7b"
            },
            {
              "name": "NEGFAC",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$fe78"
            },
            {
              "name": "NEGOP",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$fe33"
            },
            {
              "name": "NORMAL",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe75"
            },
            {
              "name": "QINT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe8d"
            },
            {
              "name": "RND",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe57"
            },
            {
              "name": "RND_0",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe57"
            },
            {
              "name": "ROMUPK",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe5d"
            },
            {
              "name": "ROUND",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe4b"
            },
            {
              "name": "SGN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe84"
            },
            {
              "name": "SIGN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$fe51"
            },
            {
              "name": "SIN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe42"
            },
            {
              "name": "SQR",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe30"
            },
            {
              "name": "TAN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe45"
            },
            {
              "name": "VAL_1",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@XY"
                },
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe09"
            },
            {
              "name": "ZEROFC",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fe72"
            },
            {
              "name": "atan",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "atan2",
              "parameters": [
                {
                  "name": "y",
                  "type": "float"
                },
                {
                  "name": "x",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "ceil",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "clampf",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                },
                {
                  "name": "minimum",
                  "type": "float"
                },
                {
                  "name": "maximum",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "cos",
              "parameters": [
                {
                  "name": "angle",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "cot",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "csc",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "deg",
              "parameters": [
                {
                  "name": "angle",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "floor",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "highest_bit_in_byte",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_get_vptr_highest_bit_pos",
              "parameters": [
                {
                  "name": "vptr",
                  "type": "^^ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "internal_long_AY_to_FAC",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_long_R1_to_float_AY",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "interpolate",
              "parameters": [
                {
                  "name": "v",
                  "type": "float"
                },
                {
                  "name": "inputMin",
                  "type": "float"
                },
                {
                  "name": "inputMax",
                  "type": "float"
                },
                {
                  "name": "outputMin",
                  "type": "float"
                },
                {
                  "name": "outputMax",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lerp",
              "parameters": [
                {
                  "name": "v0",
                  "type": "float"
                },
                {
                  "name": "v1",
                  "type": "float"
                },
                {
                  "name": "t",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lerp_fast",
              "parameters": [
                {
                  "name": "v0",
                  "type": "float"
                },
                {
                  "name": "v1",
                  "type": "float"
                },
                {
                  "name": "t",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "ln",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "log2",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "maxf",
              "parameters": [
                {
                  "name": "f1",
                  "type": "float"
                },
                {
                  "name": "f2",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "minf",
              "parameters": [
                {
                  "name": "f1",
                  "type": "float"
                },
                {
                  "name": "f2",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "normalize",
              "parameters": [
                {
                  "name": "value",
                  "type": "float",
                  "register": "@FAC1"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "parse",
              "parameters": [
                {
                  "name": "value",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pop",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pow",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                },
                {
                  "name": "power",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "print",
              "parameters": [
                {
                  "name": "value",
                  "type": "float",
                  "register": "@FAC1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "push",
              "parameters": [
                {
                  "name": "value",
                  "type": "float",
                  "register": "@FAC1"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rad",
              "parameters": [
                {
                  "name": "angle",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "rnd",
              "parameters": [],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "rndseed",
              "parameters": [
                {
                  "name": "seed",
                  "type": "float"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "round",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "secant",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "sin",
              "parameters": [
                {
                  "name": "angle",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "tan",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "time",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "tostr",
              "parameters": [
                {
                  "name": "value",
                  "type": "float",
                  "register": "@FAC1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            }
          ],
          "variables": [],
          "constants": [
            {
              "name": "E",
              "type": "float"
            },
            {
              "name": "EPSILON",
              "type": "float"
            },
            {
              "name": "FAC_ADDR",
              "type": "uword"
            },
            {
              "name": "PI",
              "type": "float"
            },
            {
              "name": "TWOPI",
              "type": "float"
            },
            {
              "name": "π",
              "type": "float"
            }
          ]
        }
      ]
    },
    {
      "name": "gfx_hires",
      "blocks": [
        {
          "name": "gfx_hires",
          "subroutines": [
            {
              "name": "addr_mul_24_for_highres_4c",
              "parameters": [
                {
                  "name": "yy",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "xx",
                  "type": "uword",
                  "register": "@R3"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "circle",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_screen",
              "parameters": [
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "cs_innerloop640",
              "parameters": [
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "disc",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fill",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword"
                },
                {
                  "name": "y",
                  "type": "uword"
                },
                {
                  "name": "new_color",
                  "type": "ubyte"
                },
                {
                  "name": "stack_rambank",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fillrect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "graphics_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "horizontal_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "length",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "line",
              "parameters": [
                {
                  "name": "x1",
                  "type": "uword"
                },
                {
                  "name": "y1",
                  "type": "uword"
                },
                {
                  "name": "x2",
                  "type": "uword"
                },
                {
                  "name": "y2",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "next_pixel",
              "parameters": [
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "next_pixels",
              "parameters": [
                {
                  "name": "pixels",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "amount",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "pget",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "plot",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "position",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "position2",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "also_port_1",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_circle",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_disc",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_fillrect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_horizontal_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "length",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_plot",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_rect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_vertical_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "lheight",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_8_pixels_from_bits",
              "parameters": [
                {
                  "name": "bits",
                  "type": "ubyte",
                  "register": "@R0"
                },
                {
                  "name": "oncolor",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "offcolor",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "text",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                },
                {
                  "name": "sctextptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "text_charset",
              "parameters": [
                {
                  "name": "charset",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "text_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "vertical_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "lheight",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": [
            {
              "name": "HEIGHT",
              "type": "uword"
            },
            {
              "name": "WIDTH",
              "type": "uword"
            },
            {
              "name": "charset_addr",
              "type": "uword"
            },
            {
              "name": "charset_bank",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "gfx_lores",
      "blocks": [
        {
          "name": "gfx_lores",
          "subroutines": [
            {
              "name": "circle",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "ubyte"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_screen",
              "parameters": [
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disc",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "ubyte"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "drawmode_eor",
              "parameters": [
                {
                  "name": "enabled",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fill",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword"
                },
                {
                  "name": "y",
                  "type": "ubyte"
                },
                {
                  "name": "new_color",
                  "type": "ubyte"
                },
                {
                  "name": "stack_rambank",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fillrect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "graphics_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "horizontal_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "length",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "line",
              "parameters": [
                {
                  "name": "x1",
                  "type": "uword"
                },
                {
                  "name": "y1",
                  "type": "ubyte"
                },
                {
                  "name": "x2",
                  "type": "uword"
                },
                {
                  "name": "y2",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "next_pixel",
              "parameters": [
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "next_pixels",
              "parameters": [
                {
                  "name": "pixels",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "amount",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "pget",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@AX"
                },
                {
                  "name": "y",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "plot",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@AX"
                },
                {
                  "name": "y",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "position",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@AX"
                },
                {
                  "name": "y",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_circle",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_disc",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_fillrect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_horizontal_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "length",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_plot",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_rect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_vertical_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "lheight",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_8_pixels_from_bits",
              "parameters": [
                {
                  "name": "bits",
                  "type": "ubyte",
                  "register": "@R0"
                },
                {
                  "name": "oncolor",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "offcolor",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "text",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                },
                {
                  "name": "textptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "text_charset",
              "parameters": [
                {
                  "name": "charset",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "text_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "vertical_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "lheight",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "eor_mode",
              "type": "bool",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "HEIGHT",
              "type": "ubyte"
            },
            {
              "name": "WIDTH",
              "type": "uword"
            },
            {
              "name": "charset_addr",
              "type": "uword"
            },
            {
              "name": "charset_bank",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "graphics",
      "blocks": [
        {
          "name": "graphics",
          "subroutines": [
            {
              "name": "FB_cursor_position2",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$feff"
            },
            {
              "name": "circle",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "ubyte"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_screen",
              "parameters": [
                {
                  "name": "pixelcolor",
                  "type": "ubyte"
                },
                {
                  "name": "bgcolor",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "colors",
              "parameters": [
                {
                  "name": "stroke",
                  "type": "ubyte"
                },
                {
                  "name": "fill",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disable_bitmap_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disc",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "ubyte"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "enable_bitmap_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "filled_oval",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "ubyte"
                },
                {
                  "name": "h_radius",
                  "type": "uword"
                },
                {
                  "name": "v_radius",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fillrect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "width",
                  "type": "uword"
                },
                {
                  "name": "height",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "horizontal_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "length",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "line",
              "parameters": [
                {
                  "name": "x1",
                  "type": "uword"
                },
                {
                  "name": "y1",
                  "type": "ubyte"
                },
                {
                  "name": "x2",
                  "type": "uword"
                },
                {
                  "name": "y2",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "oval",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "ubyte"
                },
                {
                  "name": "h_radius",
                  "type": "uword"
                },
                {
                  "name": "v_radius",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "plot",
              "parameters": [
                {
                  "name": "plotx",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "ploty",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "rect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "width",
                  "type": "uword"
                },
                {
                  "name": "height",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "vertical_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "height",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "background_color",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "stroke_color",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "HEIGHT",
              "type": "ubyte"
            },
            {
              "name": "WIDTH",
              "type": "uword"
            }
          ]
        }
      ]
    },
    {
      "name": "math",
      "blocks": [
        {
          "name": "math",
          "subroutines": [
            {
              "name": "atan2",
              "parameters": [
                {
                  "name": "x1",
                  "type": "ubyte",
                  "register": "@R0"
                },
                {
                  "name": "y1",
                  "type": "ubyte",
                  "register": "@R1"
                },
                {
                  "name": "x2",
                  "type": "ubyte",
                  "register": "@R2"
                },
                {
                  "name": "y2",
                  "type": "ubyte",
                  "register": "@R3"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "cos8",
              "parameters": [
                {
                  "name": "angle",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "cos8u",
              "parameters": [
                {
                  "name": "angle",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "cosr8",
              "parameters": [
                {
                  "name": "radians",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "cosr8u",
              "parameters": [
                {
                  "name": "radians",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "crc16",
              "parameters": [
                {
                  "name": "data",
                  "type": "^^ubyte"
                },
                {
                  "name": "length",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "crc16_end",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "crc16_start",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "crc16_update",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "crc32",
              "parameters": [
                {
                  "name": "data",
                  "type": "^^ubyte"
                },
                {
                  "name": "length",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "crc32_end",
              "parameters": [],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "crc32_end_result",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "crc32_start",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "crc32_update",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "diff",
              "parameters": [
                {
                  "name": "v1",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "v2",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "diffw",
              "parameters": [
                {
                  "name": "w1",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "w2",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "direction",
              "parameters": [
                {
                  "name": "x1",
                  "type": "ubyte"
                },
                {
                  "name": "y1",
                  "type": "ubyte"
                },
                {
                  "name": "x2",
                  "type": "ubyte"
                },
                {
                  "name": "y2",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "direction_qd",
              "parameters": [
                {
                  "name": "quadrant",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "xdelta",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "ydelta",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "direction_sc",
              "parameters": [
                {
                  "name": "x1",
                  "type": "byte"
                },
                {
                  "name": "y1",
                  "type": "byte"
                },
                {
                  "name": "x2",
                  "type": "byte"
                },
                {
                  "name": "y2",
                  "type": "byte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "gcd",
              "parameters": [
                {
                  "name": "a",
                  "type": "uword"
                },
                {
                  "name": "b",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "interpolate",
              "parameters": [
                {
                  "name": "v",
                  "type": "ubyte"
                },
                {
                  "name": "inputMin",
                  "type": "ubyte"
                },
                {
                  "name": "inputMax",
                  "type": "ubyte"
                },
                {
                  "name": "outputMin",
                  "type": "ubyte"
                },
                {
                  "name": "outputMax",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "interpolatef",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "floats.interpolate"
            },
            {
              "name": "lerp",
              "parameters": [
                {
                  "name": "v0",
                  "type": "ubyte"
                },
                {
                  "name": "v1",
                  "type": "ubyte"
                },
                {
                  "name": "t",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lerpf",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "floats.lerp"
            },
            {
              "name": "lerpf_fast",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "floats.lerp_fast"
            },
            {
              "name": "lerpw",
              "parameters": [
                {
                  "name": "v0",
                  "type": "uword"
                },
                {
                  "name": "v1",
                  "type": "uword"
                },
                {
                  "name": "t",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "log2",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "log2w",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "mul16_last_upper",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "mul32",
              "parameters": [
                {
                  "name": "a",
                  "type": "uword"
                },
                {
                  "name": "b",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "randrange",
              "parameters": [
                {
                  "name": "n",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "randrange_rom",
              "parameters": [
                {
                  "name": "n",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "randrangew",
              "parameters": [
                {
                  "name": "n",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "randrangew_rom",
              "parameters": [
                {
                  "name": "n",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "rnd",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "rnd_rom",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "rndseed",
              "parameters": [
                {
                  "name": "seed1",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "seed2",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "rndseed_rom",
              "parameters": [
                {
                  "name": "seed1",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "seed2",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "rndw",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rndw_rom",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "sin8",
              "parameters": [
                {
                  "name": "angle",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "sin8u",
              "parameters": [
                {
                  "name": "angle",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "sinr8",
              "parameters": [
                {
                  "name": "radians",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "sinr8u",
              "parameters": [
                {
                  "name": "radians",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "monogfx",
      "blocks": [
        {
          "name": "monogfx",
          "subroutines": [
            {
              "name": "circle",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_screen",
              "parameters": [
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "cs_innerloop640",
              "parameters": [
                {
                  "name": "draw",
                  "type": "bool",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "disc",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "drawmode",
              "parameters": [
                {
                  "name": "dm",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "enable_doublebuffer",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fill",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword"
                },
                {
                  "name": "y",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                },
                {
                  "name": "stack_rambank",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fillrect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "hires",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "horizontal_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "length",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "line",
              "parameters": [
                {
                  "name": "x1",
                  "type": "uword"
                },
                {
                  "name": "y1",
                  "type": "uword"
                },
                {
                  "name": "x2",
                  "type": "uword"
                },
                {
                  "name": "y2",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lores",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pget",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "plot",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "position",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "position2",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "rwidth",
                  "type": "uword"
                },
                {
                  "name": "rheight",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_circle",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_disc",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "uword"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_horizontal_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "length",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "safe_plot",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "swap_buffers",
              "parameters": [
                {
                  "name": "wait_for_vsync",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "text",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                },
                {
                  "name": "sctextptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "text_charset",
              "parameters": [
                {
                  "name": "charset",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "textmode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "vertical_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "uword"
                },
                {
                  "name": "lheight",
                  "type": "uword"
                },
                {
                  "name": "draw",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "buffer_back",
              "type": "uword buffer_visible,",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "height",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "lores_mode",
              "type": "bool",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "mode",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "times40",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": true,
              "isZeroPage": false
            },
            {
              "name": "width",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "MODE_INVERT",
              "type": "ubyte"
            },
            {
              "name": "MODE_NORMAL",
              "type": "ubyte"
            },
            {
              "name": "MODE_STIPPLE",
              "type": "ubyte"
            },
            {
              "name": "charset_addr",
              "type": "uword"
            },
            {
              "name": "charset_bank",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "palette",
      "blocks": [
        {
          "name": "palette",
          "subroutines": [
            {
              "name": "channel8to4",
              "parameters": [
                {
                  "name": "channelvalue",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "color8to4",
              "parameters": [
                {
                  "name": "colorpointer",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "fade_step",
              "parameters": [
                {
                  "name": "index",
                  "type": "ubyte"
                },
                {
                  "name": "target_rgb",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "fade_step_colors",
              "parameters": [
                {
                  "name": "startindex",
                  "type": "ubyte"
                },
                {
                  "name": "endindex",
                  "type": "ubyte"
                },
                {
                  "name": "target_colors",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "fade_step_multi",
              "parameters": [
                {
                  "name": "startindex",
                  "type": "ubyte"
                },
                {
                  "name": "endindex",
                  "type": "ubyte"
                },
                {
                  "name": "target_rgb",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get_color",
              "parameters": [
                {
                  "name": "index",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get_default",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "cx16.get_default_palette"
            },
            {
              "name": "set_all_black",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_all_white",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_c64ntsc",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_c64pepto",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_color",
              "parameters": [
                {
                  "name": "index",
                  "type": "ubyte"
                },
                {
                  "name": "color",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_default",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "cx16.set_default_palette"
            },
            {
              "name": "set_default16",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_grayscale",
              "parameters": [
                {
                  "name": "startindex",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_rgb",
              "parameters": [
                {
                  "name": "palette_words_ptr",
                  "type": "uword"
                },
                {
                  "name": "num_colors",
                  "type": "uword"
                },
                {
                  "name": "startindex",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_rgb8",
              "parameters": [
                {
                  "name": "palette_bytes_ptr",
                  "type": "uword"
                },
                {
                  "name": "num_colors",
                  "type": "uword"
                },
                {
                  "name": "startindex",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_rgb_be",
              "parameters": [
                {
                  "name": "palette_ptr",
                  "type": "uword"
                },
                {
                  "name": "num_colors",
                  "type": "uword"
                },
                {
                  "name": "startindex",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_rgb_be_nosplit",
              "parameters": [
                {
                  "name": "palette_ptr",
                  "type": "uword"
                },
                {
                  "name": "num_colors",
                  "type": "uword"
                },
                {
                  "name": "startindex",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_rgb_nosplit",
              "parameters": [
                {
                  "name": "palette_words_ptr",
                  "type": "uword"
                },
                {
                  "name": "num_colors",
                  "type": "uword"
                },
                {
                  "name": "startindex",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "psg",
      "blocks": [
        {
          "name": "psg",
          "subroutines": [
            {
              "name": "envelope",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "maxvolume",
                  "type": "ubyte"
                },
                {
                  "name": "attack",
                  "type": "ubyte"
                },
                {
                  "name": "sustain",
                  "type": "ubyte"
                },
                {
                  "name": "release",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "envelopes_irq",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "freq",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "vera_freq",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pulse_width",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "pw",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "silent",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "voice",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "channel",
                  "type": "ubyte"
                },
                {
                  "name": "vol",
                  "type": "ubyte"
                },
                {
                  "name": "waveform",
                  "type": "ubyte"
                },
                {
                  "name": "pulsewidth",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "volume",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "vol",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "envelope_attacks",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_maxvolumes",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_releases",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_states",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_sustains",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_volumes",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "voice_enabled",
              "type": "bool[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "DISABLED",
              "type": "ubyte"
            },
            {
              "name": "LEFT",
              "type": "ubyte"
            },
            {
              "name": "NOISE",
              "type": "ubyte"
            },
            {
              "name": "PULSE",
              "type": "ubyte"
            },
            {
              "name": "RIGHT",
              "type": "ubyte"
            },
            {
              "name": "SAWTOOTH",
              "type": "ubyte"
            },
            {
              "name": "TRIANGLE",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "psg2",
      "blocks": [
        {
          "name": "psg2",
          "subroutines": [
            {
              "name": "envelope",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "attack",
                  "type": "ubyte"
                },
                {
                  "name": "sustain",
                  "type": "ubyte"
                },
                {
                  "name": "release",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "frequency",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "freq",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "getvoice",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "^^psg2.Voice"
                }
              ],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "off",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "update",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "voice",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "channels",
                  "type": "ubyte"
                },
                {
                  "name": "volume",
                  "type": "ubyte"
                },
                {
                  "name": "waveform",
                  "type": "ubyte"
                },
                {
                  "name": "pulsewidth",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "volume",
              "parameters": [
                {
                  "name": "voice_num",
                  "type": "ubyte"
                },
                {
                  "name": "vol",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "envelope_attacks",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_maxvolumes",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_releases",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_states",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_sustains",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "envelope_volumes",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "voices",
              "type": "^^psg2.Voice",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "vptr",
              "type": "^^psg2.Voice",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "BOTH",
              "type": "ubyte"
            },
            {
              "name": "DISABLED",
              "type": "ubyte"
            },
            {
              "name": "E_ATTACK",
              "type": "ubyte"
            },
            {
              "name": "E_OFF",
              "type": "ubyte"
            },
            {
              "name": "E_RELEASE",
              "type": "ubyte"
            },
            {
              "name": "E_SUSTAIN",
              "type": "ubyte"
            },
            {
              "name": "LEFT",
              "type": "ubyte"
            },
            {
              "name": "NOISE",
              "type": "ubyte"
            },
            {
              "name": "PULSE",
              "type": "ubyte"
            },
            {
              "name": "RIGHT",
              "type": "ubyte"
            },
            {
              "name": "SAWTOOTH",
              "type": "ubyte"
            },
            {
              "name": "SQUARE",
              "type": "ubyte"
            },
            {
              "name": "TRIANGLE",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "sorting",
      "blocks": [
        {
          "name": "sorting",
          "subroutines": [
            {
              "name": "gnomesort_by_ub",
              "parameters": [
                {
                  "name": "ub_keys",
                  "type": "^^ubyte"
                },
                {
                  "name": "wordvalues",
                  "type": "^^uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "gnomesort_by_uw",
              "parameters": [
                {
                  "name": "uw_keys",
                  "type": "uword"
                },
                {
                  "name": "wordvalues",
                  "type": "uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "gnomesort_ub",
              "parameters": [
                {
                  "name": "bytearray",
                  "type": "^^ubyte",
                  "register": "@AY"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "gnomesort_uw",
              "parameters": [
                {
                  "name": "wordvalues",
                  "type": "uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_by_ub",
              "parameters": [
                {
                  "name": "ub_keys",
                  "type": "^^ubyte"
                },
                {
                  "name": "wordvalues",
                  "type": "^^uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_by_uw",
              "parameters": [
                {
                  "name": "uw_keys",
                  "type": "^^uword"
                },
                {
                  "name": "wordvalues",
                  "type": "^^uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_pointers",
              "parameters": [
                {
                  "name": "pointers",
                  "type": "uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                },
                {
                  "name": "comparefunc",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_ub",
              "parameters": [
                {
                  "name": "values",
                  "type": "^^ubyte"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_uw",
              "parameters": [
                {
                  "name": "values",
                  "type": "^^uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "string_comparator",
              "parameters": [
                {
                  "name": "string1",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "string2",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "sprites",
      "blocks": [
        {
          "name": "sprites",
          "subroutines": [
            {
              "name": "data",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "bank",
                  "type": "ubyte"
                },
                {
                  "name": "addr",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "flipx",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "flipped",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "flipy",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "flipped",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_data_ptr",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_data_ptr_internal",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "getx",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "word"
                }
              ],
              "clobbers": []
            },
            {
              "name": "getxy",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "word"
                },
                {
                  "type": "word"
                }
              ],
              "clobbers": []
            },
            {
              "name": "gety",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "word"
                }
              ],
              "clobbers": []
            },
            {
              "name": "hide",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "databank",
                  "type": "ubyte"
                },
                {
                  "name": "dataaddr",
                  "type": "uword"
                },
                {
                  "name": "width_flag",
                  "type": "ubyte"
                },
                {
                  "name": "height_flag",
                  "type": "ubyte"
                },
                {
                  "name": "colors_flag",
                  "type": "ubyte"
                },
                {
                  "name": "palette_offset",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "move",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "dx",
                  "type": "word"
                },
                {
                  "name": "dy",
                  "type": "word"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "movex",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "dx",
                  "type": "word"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "movey",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "dy",
                  "type": "word"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pos",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "xpos",
                  "type": "word"
                },
                {
                  "name": "ypos",
                  "type": "word"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pos_batch",
              "parameters": [
                {
                  "name": "first_spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "num_sprites",
                  "type": "ubyte"
                },
                {
                  "name": "xpositions_ptr",
                  "type": "uword"
                },
                {
                  "name": "ypositions_ptr",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pos_batch_nosplit",
              "parameters": [
                {
                  "name": "first_spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "num_sprites",
                  "type": "ubyte"
                },
                {
                  "name": "xpositions_ptr",
                  "type": "uword"
                },
                {
                  "name": "ypositions_ptr",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "reset",
              "parameters": [
                {
                  "name": "spritenum_start",
                  "type": "ubyte"
                },
                {
                  "name": "count",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_mousepointer_hand",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_mousepointer_image",
              "parameters": [
                {
                  "name": "data",
                  "type": "uword"
                },
                {
                  "name": "compressed",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_palette_offset",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "offset",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "setx",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "xpos",
                  "type": "word"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "sety",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "ypos",
                  "type": "word"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "show",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "zdepth",
              "parameters": [
                {
                  "name": "spritenum",
                  "type": "ubyte"
                },
                {
                  "name": "depth",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "sprite_reg",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": true
            }
          ],
          "constants": [
            {
              "name": "COLORS_16",
              "type": "ubyte"
            },
            {
              "name": "COLORS_256",
              "type": "ubyte"
            },
            {
              "name": "SIZE_16",
              "type": "ubyte"
            },
            {
              "name": "SIZE_32",
              "type": "ubyte"
            },
            {
              "name": "SIZE_64",
              "type": "ubyte"
            },
            {
              "name": "SIZE_8",
              "type": "ubyte"
            },
            {
              "name": "VERA_SPRITEREGS",
              "type": "uword"
            }
          ]
        }
      ]
    },
    {
      "name": "strings",
      "blocks": [
        {
          "name": "strings",
          "subroutines": [
            {
              "name": "append",
              "parameters": [
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "suffix",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "compare",
              "parameters": [
                {
                  "name": "string1",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "string2",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "compare_nocase",
              "parameters": [
                {
                  "name": "string1",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "string2",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "compare_nocase_iso",
              "parameters": [
                {
                  "name": "string1",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "string2",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "contains",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "copy",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "endswith",
              "parameters": [
                {
                  "name": "st",
                  "type": "str"
                },
                {
                  "name": "suffix",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "find",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "find_eol",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "findstr",
              "parameters": [
                {
                  "name": "haystack",
                  "type": "str"
                },
                {
                  "name": "needle",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "hash",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isdigit",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isletter",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "islower",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isprint",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isspace",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isupper",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "left",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@AX"
                },
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "length",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "lower",
              "parameters": [
                {
                  "name": "st",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lower_iso",
              "parameters": [
                {
                  "name": "st",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lowerchar",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lowerchar_iso",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lstrip",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lstripped",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "ltrim",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "ltrimmed",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "nappend",
              "parameters": [
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "suffix",
                  "type": "str",
                  "register": "@R1"
                },
                {
                  "name": "maxlength",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "ncopy",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "maxlength",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "pattern_match",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "pattern",
                  "type": "str",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "pattern_match_nocase",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "lowercase_pattern",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "iso",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "rfind",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "right",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "rstrip",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rtrim",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "slice",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "start",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "startswith",
              "parameters": [
                {
                  "name": "st",
                  "type": "str"
                },
                {
                  "name": "prefix",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "strip",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "trim",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "upper",
              "parameters": [
                {
                  "name": "st",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "upper_iso",
              "parameters": [
                {
                  "name": "st",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "upperchar",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "upperchar_iso",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "syslib",
      "blocks": [
        {
          "name": "cbm",
          "subroutines": [
            {
              "name": "ACPTR",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ffa5"
            },
            {
              "name": "CHKIN",
              "parameters": [
                {
                  "name": "logical",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffc6"
            },
            {
              "name": "CHKOUT",
              "parameters": [
                {
                  "name": "logical",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffc9"
            },
            {
              "name": "CHRIN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$ffcf"
            },
            {
              "name": "CHROUT",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffd2"
            },
            {
              "name": "CINT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff81"
            },
            {
              "name": "CIOUT",
              "parameters": [
                {
                  "name": "databyte",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffa8"
            },
            {
              "name": "CLALL",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffe7"
            },
            {
              "name": "CLEARST",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "CLOSE",
              "parameters": [
                {
                  "name": "logical",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ffc3"
            },
            {
              "name": "CLRCHN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffcc"
            },
            {
              "name": "GETIN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$ffe4"
            },
            {
              "name": "GETIN2",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            },
            {
              "name": "IOBASE",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$fff3"
            },
            {
              "name": "IOINIT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ff84"
            },
            {
              "name": "LISTEN",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ffb1"
            },
            {
              "name": "LOAD",
              "parameters": [
                {
                  "name": "verify",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffd5"
            },
            {
              "name": "MEMBOT",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "dir",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff9c"
            },
            {
              "name": "MEMTOP",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "dir",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff99"
            },
            {
              "name": "OPEN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$ffc0"
            },
            {
              "name": "PLOT",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "dir",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$fff0"
            },
            {
              "name": "RAMTAS",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff87"
            },
            {
              "name": "RDTIM",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ffde"
            },
            {
              "name": "RDTIM16",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "RDTIML",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "RDTIM_safe",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "READST",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ffb7"
            },
            {
              "name": "RESTOR",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff8a"
            },
            {
              "name": "SAVE",
              "parameters": [
                {
                  "name": "zp_startaddr",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "endaddr",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$ffd8"
            },
            {
              "name": "SCNKEY",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff9f"
            },
            {
              "name": "SCREEN",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ffed"
            },
            {
              "name": "SECOND",
              "parameters": [
                {
                  "name": "address",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ff93"
            },
            {
              "name": "SETLFS",
              "parameters": [
                {
                  "name": "logical",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "secondary",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffba"
            },
            {
              "name": "SETMSG",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff90"
            },
            {
              "name": "SETNAM",
              "parameters": [
                {
                  "name": "namelen",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "filename",
                  "type": "str",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffbd"
            },
            {
              "name": "SETTIM",
              "parameters": [
                {
                  "name": "low",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "middle",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "high",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffdb"
            },
            {
              "name": "SETTIML",
              "parameters": [
                {
                  "name": "jiffies",
                  "type": "long",
                  "register": "@R0R1"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "SETTMO",
              "parameters": [
                {
                  "name": "timeout",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffa2"
            },
            {
              "name": "STOP",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$ffe1"
            },
            {
              "name": "STOP2",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "TALK",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ffb4"
            },
            {
              "name": "TKSA",
              "parameters": [
                {
                  "name": "address",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ff96"
            },
            {
              "name": "UDTIM",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffea"
            },
            {
              "name": "UNLSN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ffae"
            },
            {
              "name": "UNTLK",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ffab"
            },
            {
              "name": "VECTOR",
              "parameters": [
                {
                  "name": "userptr",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "dir",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$ff8d"
            },
            {
              "name": "kbdbuf_clear",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "CBINV",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CINV",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IBASIN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IBSOUT",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICHKIN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICKOUT",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICLALL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICLOSE",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICLRCH",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICRNCH",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IERROR",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IEVAL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IGETIN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IGONE",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ILOAD",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IMAIN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IOPEN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IQPLOP",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IRQ_VEC",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ISAVE",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ISTOP",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "NMINV",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "NMI_VEC",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "RESET_VEC",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SAREG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPREG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SXREG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SYREG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "USRADD",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "cx16",
          "subroutines": [
            {
              "name": "BSAVE",
              "parameters": [
                {
                  "name": "zp_startaddr",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "endaddr",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$feba"
            },
            {
              "name": "CLOSE_ALL",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff4a"
            },
            {
              "name": "FB_cursor_next_line",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff02"
            },
            {
              "name": "FB_cursor_position",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$feff"
            },
            {
              "name": "FB_fill_pixels",
              "parameters": [
                {
                  "name": "count",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "pstep",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff17"
            },
            {
              "name": "FB_filter_pixels",
              "parameters": [
                {
                  "name": "pointer",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "count",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff1a"
            },
            {
              "name": "FB_get_info",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$fef9"
            },
            {
              "name": "FB_get_pixel",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$ff05"
            },
            {
              "name": "FB_get_pixels",
              "parameters": [
                {
                  "name": "pointer",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "count",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff08"
            },
            {
              "name": "FB_init",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fef6"
            },
            {
              "name": "FB_move_pixels",
              "parameters": [
                {
                  "name": "sx",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "sy",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "tx",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "ty",
                  "type": "uword",
                  "register": "@R3"
                },
                {
                  "name": "count",
                  "type": "uword",
                  "register": "@R4"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff1d"
            },
            {
              "name": "FB_set_8_pixels",
              "parameters": [
                {
                  "name": "pattern",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff11"
            },
            {
              "name": "FB_set_8_pixels_opaque",
              "parameters": [
                {
                  "name": "pattern",
                  "type": "ubyte",
                  "register": "@R0"
                },
                {
                  "name": "mask",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "color1",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "color2",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff14"
            },
            {
              "name": "FB_set_palette",
              "parameters": [
                {
                  "name": "pointer",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "index",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "colorcount",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fefc"
            },
            {
              "name": "FB_set_pixel",
              "parameters": [
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff0b"
            },
            {
              "name": "FB_set_pixels",
              "parameters": [
                {
                  "name": "pointer",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "count",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff0e"
            },
            {
              "name": "GRAPH_clear",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff23"
            },
            {
              "name": "GRAPH_draw_image",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "ptr",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "width",
                  "type": "uword",
                  "register": "@R3"
                },
                {
                  "name": "height",
                  "type": "uword",
                  "register": "@R4"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff38"
            },
            {
              "name": "GRAPH_draw_line",
              "parameters": [
                {
                  "name": "x1",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y1",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "x2",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "y2",
                  "type": "uword",
                  "register": "@R3"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff2c"
            },
            {
              "name": "GRAPH_draw_oval",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "width",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "height",
                  "type": "uword",
                  "register": "@R3"
                },
                {
                  "name": "fill",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff35"
            },
            {
              "name": "GRAPH_draw_rect",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "width",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "height",
                  "type": "uword",
                  "register": "@R3"
                },
                {
                  "name": "cornerradius",
                  "type": "uword",
                  "register": "@R4"
                },
                {
                  "name": "fill",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff2f"
            },
            {
              "name": "GRAPH_get_char_size",
              "parameters": [
                {
                  "name": "baseline",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "width",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "height_or_style",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "is_control",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff3e"
            },
            {
              "name": "GRAPH_init",
              "parameters": [
                {
                  "name": "vectors",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff20"
            },
            {
              "name": "GRAPH_move_rect",
              "parameters": [
                {
                  "name": "sx",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "sy",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "tx",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "ty",
                  "type": "uword",
                  "register": "@R3"
                },
                {
                  "name": "width",
                  "type": "uword",
                  "register": "@R4"
                },
                {
                  "name": "height",
                  "type": "uword",
                  "register": "@R5"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff32"
            },
            {
              "name": "GRAPH_put_char",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff41"
            },
            {
              "name": "GRAPH_put_next_char",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff41"
            },
            {
              "name": "GRAPH_set_colors",
              "parameters": [
                {
                  "name": "stroke",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "fill",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "background",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff29"
            },
            {
              "name": "GRAPH_set_font",
              "parameters": [
                {
                  "name": "fontptr",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff3b"
            },
            {
              "name": "GRAPH_set_window",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "width",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "height",
                  "type": "uword",
                  "register": "@R3"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff26"
            },
            {
              "name": "JSRFAR",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ff6e"
            },
            {
              "name": "LKUPLA",
              "parameters": [
                {
                  "name": "la",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff59"
            },
            {
              "name": "LKUPSA",
              "parameters": [
                {
                  "name": "sa",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff5c"
            },
            {
              "name": "MACPTR",
              "parameters": [
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "buffer",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "dontAdvance",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ff44"
            },
            {
              "name": "MCIOUT",
              "parameters": [
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "buffer",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "dontAdvance",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$feb1"
            },
            {
              "name": "PRIMM",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ff7d"
            },
            {
              "name": "audio_init",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c09f",
              "bank": 10
            },
            {
              "name": "bas_fmchordstring",
              "parameters": [
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "string",
                  "type": "str",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c08d",
              "bank": 10
            },
            {
              "name": "bas_fmfreq",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "freq",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "noretrigger",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c000",
              "bank": 10
            },
            {
              "name": "bas_fmnote",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "fracsemitone",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "noretrigger",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c003",
              "bank": 10
            },
            {
              "name": "bas_fmplaystring",
              "parameters": [
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "string",
                  "type": "str",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c006",
              "bank": 10
            },
            {
              "name": "bas_fmvib",
              "parameters": [
                {
                  "name": "speed",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "depth",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c009",
              "bank": 10
            },
            {
              "name": "bas_playstringvoice",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c00c",
              "bank": 10
            },
            {
              "name": "bas_psgchordstring",
              "parameters": [
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "string",
                  "type": "str",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c090",
              "bank": 10
            },
            {
              "name": "bas_psgfreq",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "freq",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c00f",
              "bank": 10
            },
            {
              "name": "bas_psgnote",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "fracsemitone",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c012",
              "bank": 10
            },
            {
              "name": "bas_psgplaystring",
              "parameters": [
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "string",
                  "type": "str",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c018",
              "bank": 10
            },
            {
              "name": "bas_psgwav",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "waveform",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c015",
              "bank": 10
            },
            {
              "name": "blink_enable",
              "parameters": [
                {
                  "name": "enable",
                  "type": "bool",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "clock_get_date_time",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff50"
            },
            {
              "name": "clock_set_date_time",
              "parameters": [
                {
                  "name": "yearmonth",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "dayhours",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "minsecs",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "jiffiesweekday",
                  "type": "uword",
                  "register": "@R3"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff4d"
            },
            {
              "name": "console_get_char",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$fee1"
            },
            {
              "name": "console_init",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "width",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "height",
                  "type": "uword",
                  "register": "@R3"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fedb"
            },
            {
              "name": "console_put_char",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "wrapping",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fede"
            },
            {
              "name": "console_put_image",
              "parameters": [
                {
                  "name": "pointer",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "width",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "height",
                  "type": "uword",
                  "register": "@R2"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fed8"
            },
            {
              "name": "console_set_paging_message",
              "parameters": [
                {
                  "name": "msgptr",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fed5"
            },
            {
              "name": "disable_irq_handlers",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disable_irqs",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "enable_irq_handlers",
              "parameters": [
                {
                  "name": "disable_all_irq_sources",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "enter_basic",
              "parameters": [
                {
                  "name": "cold_or_warm",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff47"
            },
            {
              "name": "entropy_get",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$fecf"
            },
            {
              "name": "extapi",
              "parameters": [
                {
                  "name": "callnumber",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$feab"
            },
            {
              "name": "fetch",
              "parameters": [
                {
                  "name": "zp_startaddr",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "index",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$ff74"
            },
            {
              "name": "get_charset",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_chrin_keyhandler",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_default_palette",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_program_args",
              "parameters": [
                {
                  "name": "buffer",
                  "type": "^^ubyte",
                  "register": "@R0"
                },
                {
                  "name": "buf_size",
                  "type": "ubyte",
                  "register": "@R1"
                },
                {
                  "name": "binary",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_screen_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "getlfs",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "getrambank",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "getrombank",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "has_machine_property",
              "parameters": [
                {
                  "name": "property",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "i2c_batch_read",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "buffer",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "length",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "advance",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$feb4"
            },
            {
              "name": "i2c_batch_write",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "buffer",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "length",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "advance",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$feb7"
            },
            {
              "name": "i2c_read_byte",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "offset",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$fec6"
            },
            {
              "name": "i2c_write_byte",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "offset",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "data",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fec9"
            },
            {
              "name": "iso_cursor_char",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "joystick_get",
              "parameters": [
                {
                  "name": "joynr",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff56"
            },
            {
              "name": "joystick_scan",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff53"
            },
            {
              "name": "joysticks_detect",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "joysticks_getall",
              "parameters": [
                {
                  "name": "also_keyboard_js",
                  "type": "bool"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "kbdbuf_clear",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "kbdbuf_get",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            },
            {
              "name": "kbdbuf_get_modifiers",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$fec0"
            },
            {
              "name": "kbdbuf_peek",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$febd"
            },
            {
              "name": "kbdbuf_put",
              "parameters": [
                {
                  "name": "key",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$fec3"
            },
            {
              "name": "keymap",
              "parameters": [
                {
                  "name": "identifier",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "read",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$fed2"
            },
            {
              "name": "memory_copy",
              "parameters": [
                {
                  "name": "source",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "num_bytes",
                  "type": "uword",
                  "register": "@R2"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fee7"
            },
            {
              "name": "memory_crc",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "num_bytes",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$feea"
            },
            {
              "name": "memory_decompress",
              "parameters": [
                {
                  "name": "input",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "output",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$feed"
            },
            {
              "name": "memory_decompress_from_func",
              "parameters": [
                {
                  "name": "datafunction",
                  "type": "uword",
                  "register": "@R4"
                },
                {
                  "name": "output",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "memory_fill",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "num_bytes",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fee4"
            },
            {
              "name": "monitor",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fecc"
            },
            {
              "name": "mouse_config",
              "parameters": [
                {
                  "name": "shape",
                  "type": "byte",
                  "register": "@A"
                },
                {
                  "name": "resX",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "resY",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff68"
            },
            {
              "name": "mouse_config2",
              "parameters": [
                {
                  "name": "shape",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "mouse_get",
              "parameters": [
                {
                  "name": "zdataptr",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff6b"
            },
            {
              "name": "mouse_get_sprite_offset",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "mouse_pos",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "mouse_present",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "mouse_scan",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff71"
            },
            {
              "name": "mouse_set_pos",
              "parameters": [
                {
                  "name": "xpos",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "ypos",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "mouse_set_sprite_offset",
              "parameters": [
                {
                  "name": "xoffset",
                  "type": "word",
                  "register": "@R0"
                },
                {
                  "name": "yoffset",
                  "type": "word",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "notecon_bas2fm",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c01b",
              "bank": 10
            },
            {
              "name": "notecon_bas2midi",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c01e",
              "bank": 10
            },
            {
              "name": "notecon_bas2psg",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "fracsemitone",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c021",
              "bank": 10
            },
            {
              "name": "notecon_fm2bas",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c024",
              "bank": 10
            },
            {
              "name": "notecon_fm2midi",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c027",
              "bank": 10
            },
            {
              "name": "notecon_fm2psg",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "fracsemitone",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c02a",
              "bank": 10
            },
            {
              "name": "notecon_freq2bas",
              "parameters": [
                {
                  "name": "freqHz",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c02d",
              "bank": 10
            },
            {
              "name": "notecon_freq2fm",
              "parameters": [
                {
                  "name": "freqHz",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c030",
              "bank": 10
            },
            {
              "name": "notecon_freq2midi",
              "parameters": [
                {
                  "name": "freqHz",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c033",
              "bank": 10
            },
            {
              "name": "notecon_freq2psg",
              "parameters": [
                {
                  "name": "freqHz",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c036",
              "bank": 10
            },
            {
              "name": "notecon_midi2bas",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c039",
              "bank": 10
            },
            {
              "name": "notecon_midi2fm",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c03c",
              "bank": 10
            },
            {
              "name": "notecon_midi2psg",
              "parameters": [
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "fracsemitone",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c03f",
              "bank": 10
            },
            {
              "name": "notecon_psg2bas",
              "parameters": [
                {
                  "name": "freq",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c042",
              "bank": 10
            },
            {
              "name": "notecon_psg2fm",
              "parameters": [
                {
                  "name": "freq",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c045",
              "bank": 10
            },
            {
              "name": "notecon_psg2midi",
              "parameters": [
                {
                  "name": "freq",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$c048",
              "bank": 10
            },
            {
              "name": "numbanks",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "pop_rambank",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pop_rombank",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "poweroff_system",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "psg_getatten",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c093",
              "bank": 10
            },
            {
              "name": "psg_getpan",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c096",
              "bank": 10
            },
            {
              "name": "psg_init",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c04b",
              "bank": 10
            },
            {
              "name": "psg_playfreq",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "freq",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c04e",
              "bank": 10
            },
            {
              "name": "psg_read",
              "parameters": [
                {
                  "name": "offset",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "cookedVol",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c051",
              "bank": 10
            },
            {
              "name": "psg_setatten",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "attenuation",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c054",
              "bank": 10
            },
            {
              "name": "psg_setfreq",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "freq",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c057",
              "bank": 10
            },
            {
              "name": "psg_setpan",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "panning",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c05a",
              "bank": 10
            },
            {
              "name": "psg_setvol",
              "parameters": [
                {
                  "name": "voice",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "volume",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c05d",
              "bank": 10
            },
            {
              "name": "psg_write",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "offset",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c060",
              "bank": 10
            },
            {
              "name": "psg_write_fast",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "offset",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c0a2",
              "bank": 10
            },
            {
              "name": "push_rambank",
              "parameters": [
                {
                  "name": "newbank",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "push_rombank",
              "parameters": [
                {
                  "name": "newbank",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "rambank",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "reset_system",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "restore_vera_context",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "restore_virtual_registers",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "rom_version",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "rombank",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "save_vera_context",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "save_virtual_registers",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "scnsiz",
              "parameters": [
                {
                  "name": "width",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "heigth",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "screen_mode",
              "parameters": [
                {
                  "name": "mode",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "getCurrent",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff5f"
            },
            {
              "name": "screen_set_charset",
              "parameters": [
                {
                  "name": "charset",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "charsetptr",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff62"
            },
            {
              "name": "search_x16edit",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "set_aflow_irq_handler",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "set_chrin_keyhandler",
              "parameters": [
                {
                  "name": "handlerbank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "handler",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "set_default_palette",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_led_state",
              "parameters": [
                {
                  "name": "on",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_line_irq_handler",
              "parameters": [
                {
                  "name": "rasterline",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "set_program_args",
              "parameters": [
                {
                  "name": "args_ptr",
                  "type": "str"
                },
                {
                  "name": "args_size",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_screen_mode",
              "parameters": [
                {
                  "name": "mode",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "set_sprcol_irq_handler",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "set_timer1",
              "parameters": [
                {
                  "name": "delay",
                  "type": "uword"
                },
                {
                  "name": "keeprunning",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_timer1_irq_handler",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_vsync_irq_handler",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "sprite_set_image",
              "parameters": [
                {
                  "name": "pixels",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "mask",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "bpp",
                  "type": "ubyte",
                  "register": "@R2"
                },
                {
                  "name": "number",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "width",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "height",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "apply_mask",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fef0"
            },
            {
              "name": "sprite_set_position",
              "parameters": [
                {
                  "name": "x",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "y",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "number",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$fef3"
            },
            {
              "name": "stash",
              "parameters": [
                {
                  "name": "data",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "index",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$ff77"
            },
            {
              "name": "vaddr",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "addrsel",
                  "type": "ubyte",
                  "register": "@R1"
                },
                {
                  "name": "autoIncrOrDecrByOne",
                  "type": "byte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "vaddr_autodecr",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "addrsel",
                  "type": "ubyte",
                  "register": "@R1"
                },
                {
                  "name": "autoDecrAmount",
                  "type": "uword",
                  "register": "@R2"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "vaddr_autoincr",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "addrsel",
                  "type": "ubyte",
                  "register": "@R1"
                },
                {
                  "name": "autoIncrAmount",
                  "type": "uword",
                  "register": "@R2"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "vaddr_clone",
              "parameters": [
                {
                  "name": "port",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "vpeek",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "vpoke",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "vpoke_and",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "vpoke_mask",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "mask",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "vpoke_or",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "vpoke_xor",
              "parameters": [
                {
                  "name": "bank",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "x16edit_default",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c000"
            },
            {
              "name": "x16edit_loadfile",
              "parameters": [
                {
                  "name": "firstbank",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "lastbank",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "filename",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "filenameLength",
                  "type": "ubyte",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c003"
            },
            {
              "name": "x16edit_loadfile_options",
              "parameters": [
                {
                  "name": "firstbank",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "lastbank",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "filename",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "filenameLengthAndOptions",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "tabstopAndWordwrap",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "disknumberAndColors",
                  "type": "uword",
                  "register": "@R3"
                },
                {
                  "name": "headerAndStatusColors",
                  "type": "uword",
                  "register": "@R4"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c006"
            },
            {
              "name": "x16edit_loadfile_options2",
              "parameters": [
                {
                  "name": "firstbank",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "lastbank",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "filename",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "filenameLengthAndOptions",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "tabstopAndWordwrap",
                  "type": "uword",
                  "register": "@R2"
                },
                {
                  "name": "disknumberAndColors",
                  "type": "uword",
                  "register": "@R3"
                },
                {
                  "name": "headerAndStatusColors",
                  "type": "uword",
                  "register": "@R4"
                },
                {
                  "name": "linenumberLM",
                  "type": "uword",
                  "register": "@R5"
                },
                {
                  "name": "linenumberH",
                  "type": "ubyte",
                  "register": "@R6"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c009"
            },
            {
              "name": "ym_get_chip_type",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$c0a5",
              "bank": 10
            },
            {
              "name": "ym_getatten",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c099",
              "bank": 10
            },
            {
              "name": "ym_getpan",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c09c",
              "bank": 10
            },
            {
              "name": "ym_init",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c063",
              "bank": 10
            },
            {
              "name": "ym_loaddefpatches",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c066",
              "bank": 10
            },
            {
              "name": "ym_loadpatch",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "patchOrAddress",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "what",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c069",
              "bank": 10
            },
            {
              "name": "ym_loadpatchlfn",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "lfn",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$c06c",
              "bank": 10
            },
            {
              "name": "ym_playdrum",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c06f",
              "bank": 10
            },
            {
              "name": "ym_playnote",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "kc",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "kf",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "notrigger",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c072",
              "bank": 10
            },
            {
              "name": "ym_read",
              "parameters": [
                {
                  "name": "register",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "cooked",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c081",
              "bank": 10
            },
            {
              "name": "ym_release",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c084",
              "bank": 10
            },
            {
              "name": "ym_setatten",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "attenuation",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c075",
              "bank": 10
            },
            {
              "name": "ym_setdrum",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "note",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c078",
              "bank": 10
            },
            {
              "name": "ym_setnote",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "kc",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "kf",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c07b",
              "bank": 10
            },
            {
              "name": "ym_setpan",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "panning",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c07e",
              "bank": 10
            },
            {
              "name": "ym_trigger",
              "parameters": [
                {
                  "name": "channel",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "noRelease",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$c087",
              "bank": 10
            },
            {
              "name": "ym_write",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "register",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ],
              "address": "$c08a",
              "bank": 10
            }
          ],
          "variables": [
            {
              "name": "KEYHDL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_ADDR",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_ADDR_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_ADDR_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_ADDR_M",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_AUDIO_CTRL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_AUDIO_DATA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_AUDIO_RATE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_CTRL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DATA0",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DATA1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_BORDER",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_HSCALE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_HSTART",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_HSTOP",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_VER0",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_VER1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_VER2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_VER3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_VIDEO",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_VSCALE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_VSTART",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_DC_VSTOP",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_ACCUM",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_ACCUM_RESET",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_CACHE_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_CACHE_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_CACHE_M",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_CACHE_U",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_CTRL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_MAPBASE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_MULT",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_POLY_FILL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_POLY_FILL_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_POLY_FILL_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_TILEBASE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_X_INCR",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_X_INCR_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_X_INCR_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_X_POS",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_X_POS_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_X_POS_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_X_POS_S",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_Y_INCR",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_Y_INCR_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_Y_INCR_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_Y_POS",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_Y_POS_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_Y_POS_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_FX_Y_POS_S",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_IEN",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_IRQLINE_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_ISR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_CONFIG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_HSCROLL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_HSCROLL_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_HSCROLL_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_MAPBASE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_TILEBASE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_VSCROLL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_VSCROLL_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L0_VSCROLL_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_CONFIG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_HSCROLL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_HSCROLL_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_HSCROLL_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_MAPBASE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_TILEBASE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_VSCROLL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_VSCROLL_H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_L1_VSCROLL_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_SCANLINE_L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_SPI_CTRL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VERA_SPI_DATA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "YM_ADDRESS",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "YM_DATA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "edkeybk",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "edkeyvec",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0r1sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10r11sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12r13sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14r15sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2r3sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4r5sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6r7sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8r9sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "stavec",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1acr",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1ddra",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1ddrb",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1ier",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1ifr",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1ora",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1pcr",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1pra",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1prb",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1sr",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t1",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t1h",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t1l",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t1lh",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t1ll",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t1lw",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t2",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t2h",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via1t2l",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2acr",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2ddra",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2ddrb",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2ier",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2ifr",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2ora",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2pcr",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2pra",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2prb",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2sr",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t1",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t1h",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t1l",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t1lh",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t1ll",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t1lw",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t2",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t2h",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "via2t2l",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "EXTAPI16_get_last_far_bank",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI16_hbload",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI16_stack_enter_kernal_stack",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI16_stack_leave_kernal_stack",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI16_stack_pop",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI16_stack_push",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI16_test",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI16_xmacptr",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI16_xmciout",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_blink_enable",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_clear_status",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_cursor_blink",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_default_palette",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_getlfs",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_has_machine_property",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_iso_cursor_char",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_joystick_ps2_keycodes",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_kbd_leds",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_kbdbuf_clear",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_kbdbuf_get",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_led_update",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_memory_decompress_from_func",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_mouse_set_position",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_mouse_sprite_offset",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_pfkey",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_ps2data_fetch",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_ps2data_raw",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_ps2kbd_typematic",
              "type": "ubyte"
            },
            {
              "name": "EXTAPI_scnsiz",
              "type": "ubyte"
            },
            {
              "name": "VERA_BASE",
              "type": "uword"
            },
            {
              "name": "VERA_PALETTE_BASE",
              "type": "long"
            },
            {
              "name": "VERA_PSG_BASE",
              "type": "long"
            },
            {
              "name": "VERA_SPRITES_BASE",
              "type": "long"
            },
            {
              "name": "VIA1_BASE",
              "type": "uword"
            },
            {
              "name": "VIA2_BASE",
              "type": "uword"
            },
            {
              "name": "extdev",
              "type": "uword"
            }
          ]
        },
        {
          "name": "sys",
          "subroutines": [
            {
              "name": "clear_carry",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_irqd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "cpu_is_65816",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disable_caseswitch",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "enable_caseswitch",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "exit",
              "parameters": [
                {
                  "name": "returnvalue",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "exit2",
              "parameters": [
                {
                  "name": "resulta",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "resultx",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "resulty",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "exit3",
              "parameters": [
                {
                  "name": "resulta",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "resultx",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "resulty",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "carry",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_as_returnaddress",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_stringcopy",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "irqsafe_clear_irqd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "irqsafe_set_irqd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "memcmp",
              "parameters": [
                {
                  "name": "address1",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "address2",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "size",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "memcopy",
              "parameters": [
                {
                  "name": "source",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "count",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "memset",
              "parameters": [
                {
                  "name": "mem",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "numbytes",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "memsetw",
              "parameters": [
                {
                  "name": "mem",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "numwords",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "pop",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "popl",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "popw",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "poweroff_system",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "progend",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "progstart",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "push",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "push_returnaddress",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pushl",
              "parameters": [
                {
                  "name": "value",
                  "type": "long",
                  "register": "@R0R1"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pushw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "read_flags",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "reset_system",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "restore_irq",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "restore_prog8_internals",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "save_prog8_internals",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_carry",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_irq",
              "parameters": [
                {
                  "name": "handler",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "set_irqd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_rasterirq",
              "parameters": [
                {
                  "name": "handler",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "rasterpos",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "set_rasterline",
              "parameters": [
                {
                  "name": "line",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "update_rasterirq",
              "parameters": [
                {
                  "name": "handler",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "rasterpos",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "wait",
              "parameters": [
                {
                  "name": "jiffies",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "waitrasterline",
              "parameters": [
                {
                  "name": "line",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "waitvsync",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": [
            {
              "name": "MAX_BYTE",
              "type": "byte"
            },
            {
              "name": "MAX_FLOAT",
              "type": "float"
            },
            {
              "name": "MAX_UBYTE",
              "type": "ubyte"
            },
            {
              "name": "MAX_UWORD",
              "type": "uword"
            },
            {
              "name": "MAX_WORD",
              "type": "word"
            },
            {
              "name": "MIN_BYTE",
              "type": "byte"
            },
            {
              "name": "MIN_FLOAT",
              "type": "float"
            },
            {
              "name": "MIN_UBYTE",
              "type": "ubyte"
            },
            {
              "name": "MIN_UWORD",
              "type": "uword"
            },
            {
              "name": "MIN_WORD",
              "type": "word"
            },
            {
              "name": "SIZEOF_BOOL",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_BYTE",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_FLOAT",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_LONG",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_POINTER",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_UBYTE",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_UWORD",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_WORD",
              "type": "ubyte"
            },
            {
              "name": "target",
              "type": "ubyte"
            }
          ]
        },
        {
          "name": "p8_sys_startup",
          "subroutines": [
            {
              "name": "cleanup_at_exit",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "init_system",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "init_system_phase2",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "test_stack",
      "blocks": [
        {
          "name": "test_stack",
          "subroutines": [
            {
              "name": "test",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "textio",
      "blocks": [
        {
          "name": "txt",
          "subroutines": [
            {
              "name": "bell",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "chrout",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffd2"
            },
            {
              "name": "chrout_lit",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_screen",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_screenchars",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            },
            {
              "name": "clear_screencolors",
              "parameters": [
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            },
            {
              "name": "cls",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "color",
              "parameters": [
                {
                  "name": "txtcol",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "color2",
              "parameters": [
                {
                  "name": "txtcol",
                  "type": "ubyte"
                },
                {
                  "name": "bgcol",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "column",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "cp437",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fill_screen",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "get_column",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_cursor",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_row",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "getchr",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "getclr",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "height",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            },
            {
              "name": "home",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "input_chars",
              "parameters": [
                {
                  "name": "buffer",
                  "type": "^^ubyte",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "iso",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "iso16",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "iso2petscii",
              "parameters": [
                {
                  "name": "iso_char",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "iso2petscii_str",
              "parameters": [
                {
                  "name": "iso_string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "iso5",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "iso_off",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "kata",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lowercase",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "nl",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "petscii2scr",
              "parameters": [
                {
                  "name": "petscii_char",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "petscii2scr_str",
              "parameters": [
                {
                  "name": "petscii_string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "plot",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "print",
              "parameters": [
                {
                  "name": "text",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "print_b",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_bool",
              "parameters": [
                {
                  "name": "value",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "print_f",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "floats.print"
            },
            {
              "name": "print_l",
              "parameters": [
                {
                  "name": "value",
                  "type": "long"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "print_lit",
              "parameters": [
                {
                  "name": "text",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "print_ub",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_ub0",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_ubbin",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "prefix",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_ubhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "prefix",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_ulhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "long"
                },
                {
                  "name": "prefix",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "print_uw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_uw0",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_uwbin",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "prefix",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_uwhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "prefix",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_w",
              "parameters": [
                {
                  "name": "value",
                  "type": "word",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "row",
              "parameters": [
                {
                  "name": "rownum",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "rvs_off",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rvs_on",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "scroll_down",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "scroll_left",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "scroll_right",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "scroll_up",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "setcc",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte"
                },
                {
                  "name": "row",
                  "type": "ubyte"
                },
                {
                  "name": "character",
                  "type": "ubyte"
                },
                {
                  "name": "charcolor",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "setcc2",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte"
                },
                {
                  "name": "row",
                  "type": "ubyte"
                },
                {
                  "name": "character",
                  "type": "ubyte"
                },
                {
                  "name": "colors",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "setchr",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "setclr",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "spc",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "t256c",
              "parameters": [
                {
                  "name": "enable",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "uppercase",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "waitkey",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "width",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            }
          ],
          "variables": [
            {
              "name": "color_to_charcode",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "DEFAULT_HEIGHT",
              "type": "ubyte"
            },
            {
              "name": "DEFAULT_WIDTH",
              "type": "ubyte"
            },
            {
              "name": "VERA_TEXTMATRIX",
              "type": "long"
            }
          ]
        }
      ]
    },
    {
      "name": "verafx",
      "blocks": [
        {
          "name": "verafx",
          "subroutines": [
            {
              "name": "available",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "clear",
              "parameters": [
                {
                  "name": "vbank",
                  "type": "ubyte"
                },
                {
                  "name": "vaddr",
                  "type": "uword"
                },
                {
                  "name": "data",
                  "type": "ubyte"
                },
                {
                  "name": "num_longwords",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "copy",
              "parameters": [
                {
                  "name": "srcbank",
                  "type": "ubyte"
                },
                {
                  "name": "srcaddr",
                  "type": "uword"
                },
                {
                  "name": "tgtbank",
                  "type": "ubyte"
                },
                {
                  "name": "tgtaddr",
                  "type": "uword"
                },
                {
                  "name": "num_longwords",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "muls",
              "parameters": [
                {
                  "name": "value1",
                  "type": "word",
                  "register": "@R0"
                },
                {
                  "name": "value2",
                  "type": "word",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "muls16",
              "parameters": [
                {
                  "name": "value1",
                  "type": "word",
                  "register": "@R0"
                },
                {
                  "name": "value2",
                  "type": "word",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "mult16",
              "parameters": [
                {
                  "name": "value1",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "value2",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "transparency",
              "parameters": [
                {
                  "name": "enable",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    }
  ]
};

export const library_c64: LibraryData = {
  "target": "c64",
  "version": "12.1",
  "modules": [
    {
      "name": "bcd",
      "blocks": [
        {
          "name": "bcd",
          "subroutines": [
            {
              "name": "addb",
              "parameters": [
                {
                  "name": "a",
                  "type": "byte"
                },
                {
                  "name": "b",
                  "type": "byte"
                }
              ],
              "returns": [
                {
                  "type": "byte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "addl",
              "parameters": [
                {
                  "name": "a",
                  "type": "long"
                },
                {
                  "name": "b",
                  "type": "long"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "addtol",
              "parameters": [
                {
                  "name": "a",
                  "type": "^^long"
                },
                {
                  "name": "b",
                  "type": "long"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "addub",
              "parameters": [
                {
                  "name": "a",
                  "type": "ubyte"
                },
                {
                  "name": "b",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "adduw",
              "parameters": [
                {
                  "name": "a",
                  "type": "uword"
                },
                {
                  "name": "b",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "addw",
              "parameters": [
                {
                  "name": "a",
                  "type": "word"
                },
                {
                  "name": "b",
                  "type": "word"
                }
              ],
              "returns": [
                {
                  "type": "word"
                }
              ],
              "clobbers": []
            },
            {
              "name": "clearbcd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "setbcd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "subb",
              "parameters": [
                {
                  "name": "a",
                  "type": "byte"
                },
                {
                  "name": "b",
                  "type": "byte"
                }
              ],
              "returns": [
                {
                  "type": "byte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "subfroml",
              "parameters": [
                {
                  "name": "a",
                  "type": "^^long"
                },
                {
                  "name": "b",
                  "type": "long"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "subl",
              "parameters": [
                {
                  "name": "a",
                  "type": "long"
                },
                {
                  "name": "b",
                  "type": "long"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "subub",
              "parameters": [
                {
                  "name": "a",
                  "type": "ubyte"
                },
                {
                  "name": "b",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "subuw",
              "parameters": [
                {
                  "name": "a",
                  "type": "uword"
                },
                {
                  "name": "b",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "buffers",
      "blocks": [
        {
          "name": "smallringbuffer",
          "subroutines": [
            {
              "name": "free",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "getw",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isempty",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "isfull",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "put",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "putw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "buffer",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "fill",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "head",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "tail",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "smallstack",
          "subroutines": [
            {
              "name": "free",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isempty",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "isfull",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "pop",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "popw",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "push",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pushw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "buffer",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "sp",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "stack",
          "subroutines": [
            {
              "name": "free",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isempty",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "isfull",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "pop",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "popw",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "push",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pushw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "buffer_ptr",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "sp",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "ringbuffer",
          "subroutines": [
            {
              "name": "free",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "getw",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "inc_head",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "inc_tail",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "init",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isempty",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "isfull",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "put",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "putw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "buffer_ptr",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "fill",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "head",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "tail",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        }
      ]
    },
    {
      "name": "compression",
      "blocks": [
        {
          "name": "compression",
          "subroutines": [
            {
              "name": "decode_rle",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "maxsize",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "decode_rle_srcfunc",
              "parameters": [
                {
                  "name": "source_function",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "maxsize",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "decode_tscrunch",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "decode_tscrunch_inplace",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "decode_zx0",
              "parameters": [
                {
                  "name": "compressed",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "encode_rle",
              "parameters": [
                {
                  "name": "data",
                  "type": "uword"
                },
                {
                  "name": "size",
                  "type": "uword"
                },
                {
                  "name": "target",
                  "type": "uword"
                },
                {
                  "name": "is_last_block",
                  "type": "bool"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "encode_rle_outfunc",
              "parameters": [
                {
                  "name": "data",
                  "type": "uword"
                },
                {
                  "name": "size",
                  "type": "uword"
                },
                {
                  "name": "output_function",
                  "type": "uword"
                },
                {
                  "name": "is_last_block",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "conv",
      "blocks": [
        {
          "name": "conv",
          "subroutines": [
            {
              "name": "any2uword",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "bin2uword",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "hex2long",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "hex2uword",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_byte2decimal",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_ubyte2decimal",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_ubyte2hex",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "internal_uword2decimal",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_uword2hex",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "str2byte",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "str2ubyte",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "str2uword",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "str2word",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "str_b",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_l",
              "parameters": [
                {
                  "name": "value",
                  "type": "long"
                }
              ],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "str_ub",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_ub0",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_ubbin",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_ubhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_ulhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "long"
                }
              ],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "str_uw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_uw0",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_uwbin",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "str_uwhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "str_w",
              "parameters": [
                {
                  "name": "value",
                  "type": "word",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            }
          ],
          "variables": [
            {
              "name": "string_out",
              "type": "ubyte[]",
              "isMemoryMapped": false,
              "isShared": true,
              "isZeroPage": false
            }
          ],
          "constants": []
        }
      ]
    },
    {
      "name": "coroutines",
      "blocks": [
        {
          "name": "coroutines",
          "subroutines": [
            {
              "name": "add",
              "parameters": [
                {
                  "name": "taskaddress",
                  "type": "uword"
                },
                {
                  "name": "userdata",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "current",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "kill",
              "parameters": [
                {
                  "name": "taskid",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "killall",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "run",
              "parameters": [
                {
                  "name": "supervisor_routine",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "termination",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "yield",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "active_task",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "supervisor",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "tasklist",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "userdatas",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "MAX_TASKS",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "cx16logo",
      "blocks": [
        {
          "name": "cx16logo",
          "subroutines": [
            {
              "name": "logo",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "logo_at",
              "parameters": [
                {
                  "name": "column",
                  "type": "ubyte"
                },
                {
                  "name": "row",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "logo_lines",
              "type": "uword[]",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        }
      ]
    },
    {
      "name": "diskio",
      "blocks": [
        {
          "name": "diskio",
          "subroutines": [
            {
              "name": "delete",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "directory",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "directory_dirs",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "directory_files",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "diskname",
              "parameters": [],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "exists",
              "parameters": [
                {
                  "name": "filename",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_close",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "f_close_w",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "f_open",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_open_w",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_read",
              "parameters": [
                {
                  "name": "bufferpointer",
                  "type": "uword"
                },
                {
                  "name": "num_bytes",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_read_all",
              "parameters": [
                {
                  "name": "bufferpointer",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "f_readline",
              "parameters": [
                {
                  "name": "bufptr",
                  "type": "^^ubyte",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "f_write",
              "parameters": [
                {
                  "name": "bufferpointer",
                  "type": "uword"
                },
                {
                  "name": "num_bytes",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get_loadaddress",
              "parameters": [
                {
                  "name": "filename",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_end_list",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lf_next_entry",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_start_list",
              "parameters": [
                {
                  "name": "pattern_ptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_start_list_dirs",
              "parameters": [
                {
                  "name": "pattern_ptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lf_start_list_files",
              "parameters": [
                {
                  "name": "pattern_ptr",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "list_filenames",
              "parameters": [
                {
                  "name": "pattern_ptr",
                  "type": "str"
                },
                {
                  "name": "filenames_buffer",
                  "type": "uword"
                },
                {
                  "name": "filenames_buf_size",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "load",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "address_override",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "load_raw",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "start_address",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "loadlib",
              "parameters": [
                {
                  "name": "libnameptr",
                  "type": "str"
                },
                {
                  "name": "libaddress",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "rename",
              "parameters": [
                {
                  "name": "oldfileptr",
                  "type": "str"
                },
                {
                  "name": "newfileptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "reset_read_channel",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "reset_write_channel",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "save",
              "parameters": [
                {
                  "name": "filenameptr",
                  "type": "str"
                },
                {
                  "name": "start_address",
                  "type": "uword"
                },
                {
                  "name": "savesize",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "send_command",
              "parameters": [
                {
                  "name": "commandptr",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "status",
              "parameters": [],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "status_code",
              "parameters": [],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "drivenumber",
              "type": "ubyte",
              "isMemoryMapped": false,
              "isShared": true,
              "isZeroPage": false
            },
            {
              "name": "iteration_in_progress",
              "type": "bool",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_blocks",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_filename",
              "type": "str",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_filetype",
              "type": "str",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_pattern",
              "type": "^^ubyte",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "list_skip_disk_name",
              "type": "bool",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "write_iteration_in_progress",
              "type": "bool",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "READ_IO_CHANNEL",
              "type": "ubyte"
            },
            {
              "name": "STATUS_EOF",
              "type": "ubyte"
            },
            {
              "name": "WRITE_IO_CHANNEL",
              "type": "ubyte"
            }
          ]
        }
      ]
    },
    {
      "name": "floats",
      "blocks": [
        {
          "name": "floats",
          "subroutines": [
            {
              "name": "ABS",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$bc58"
            },
            {
              "name": "ATN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$e30e"
            },
            {
              "name": "AYINT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b1bf"
            },
            {
              "name": "AYINT2",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "CONUPK",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$ba8c"
            },
            {
              "name": "COS",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$e264"
            },
            {
              "name": "DIV10",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bafe"
            },
            {
              "name": "EXP",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bfed"
            },
            {
              "name": "FADD",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b867"
            },
            {
              "name": "FADDH",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b849"
            },
            {
              "name": "FADDT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b86a"
            },
            {
              "name": "FAREADMEM",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$ba90"
            },
            {
              "name": "FCOMP",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$bc5b"
            },
            {
              "name": "FDIV",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bb0f"
            },
            {
              "name": "FDIVT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bb12"
            },
            {
              "name": "FINLOG",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bd7e"
            },
            {
              "name": "FMULT",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ba28"
            },
            {
              "name": "FMULTT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ba2b"
            },
            {
              "name": "FOUT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$bddd"
            },
            {
              "name": "FPRINTLN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$aabc"
            },
            {
              "name": "FPWR",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bf78"
            },
            {
              "name": "FPWRT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bf7b"
            },
            {
              "name": "FREADMEM",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$bba6"
            },
            {
              "name": "FREADS24AXY",
              "parameters": [
                {
                  "name": "lo",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "mid",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "hi",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "FREADS32",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "FREADSA",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bc3c"
            },
            {
              "name": "FREADSTR",
              "parameters": [
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b7b5"
            },
            {
              "name": "FREADU24AXY",
              "parameters": [
                {
                  "name": "lo",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "mid",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "hi",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "FREADUS32",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "FREADUY",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b3a2"
            },
            {
              "name": "FSUB",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b850"
            },
            {
              "name": "FSUBT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b853"
            },
            {
              "name": "GETADR",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$b7f7"
            },
            {
              "name": "GETADRAY",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "GIVAYF",
              "parameters": [
                {
                  "name": "lo",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "hi",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b391"
            },
            {
              "name": "GIVAYFAY",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "GIVUAYFAY",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "INT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bccc"
            },
            {
              "name": "LOG",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$b9ea"
            },
            {
              "name": "MOVAF",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$bc0c"
            },
            {
              "name": "MOVEF",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$bc0f"
            },
            {
              "name": "MOVFA",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$bbfc"
            },
            {
              "name": "MOVFM",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$bba2"
            },
            {
              "name": "MOVMF",
              "parameters": [
                {
                  "name": "mflpt",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$bbd4"
            },
            {
              "name": "MUL10",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bae2"
            },
            {
              "name": "NEGOP",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$bfb4"
            },
            {
              "name": "NORMAL",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$b8d7"
            },
            {
              "name": "NOTOP",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$aed4"
            },
            {
              "name": "QINT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bc9b"
            },
            {
              "name": "RND",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$e097"
            },
            {
              "name": "SGN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bc39"
            },
            {
              "name": "SIGN",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$bc2b"
            },
            {
              "name": "SIN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$e26b"
            },
            {
              "name": "SQR",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bf71"
            },
            {
              "name": "SQRA",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$bf74"
            },
            {
              "name": "TAN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$e2b4"
            },
            {
              "name": "atan",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "atan2",
              "parameters": [
                {
                  "name": "y",
                  "type": "float"
                },
                {
                  "name": "x",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "ceil",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "clampf",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                },
                {
                  "name": "minimum",
                  "type": "float"
                },
                {
                  "name": "maximum",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "cos",
              "parameters": [
                {
                  "name": "angle",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "cot",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "csc",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "deg",
              "parameters": [
                {
                  "name": "angle",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "floor",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "highest_bit_in_byte",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_get_vptr_highest_bit_pos",
              "parameters": [
                {
                  "name": "vptr",
                  "type": "^^ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "internal_long_AY_to_FAC",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_long_R1_to_float_AY",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "interpolate",
              "parameters": [
                {
                  "name": "v",
                  "type": "float"
                },
                {
                  "name": "inputMin",
                  "type": "float"
                },
                {
                  "name": "inputMax",
                  "type": "float"
                },
                {
                  "name": "outputMin",
                  "type": "float"
                },
                {
                  "name": "outputMax",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lerp",
              "parameters": [
                {
                  "name": "v0",
                  "type": "float"
                },
                {
                  "name": "v1",
                  "type": "float"
                },
                {
                  "name": "t",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lerp_fast",
              "parameters": [
                {
                  "name": "v0",
                  "type": "float"
                },
                {
                  "name": "v1",
                  "type": "float"
                },
                {
                  "name": "t",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "ln",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "log2",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "maxf",
              "parameters": [
                {
                  "name": "f1",
                  "type": "float"
                },
                {
                  "name": "f2",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "minf",
              "parameters": [
                {
                  "name": "f1",
                  "type": "float"
                },
                {
                  "name": "f2",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "normalize",
              "parameters": [
                {
                  "name": "value",
                  "type": "float",
                  "register": "@FAC1"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "parse",
              "parameters": [
                {
                  "name": "value",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pop",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pow",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                },
                {
                  "name": "power",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "print",
              "parameters": [
                {
                  "name": "value",
                  "type": "float",
                  "register": "@FAC1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "push",
              "parameters": [
                {
                  "name": "value",
                  "type": "float",
                  "register": "@FAC1"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rad",
              "parameters": [
                {
                  "name": "angle",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "rnd",
              "parameters": [],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "rndseed",
              "parameters": [
                {
                  "name": "seed",
                  "type": "float"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "round",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "secant",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "sin",
              "parameters": [
                {
                  "name": "angle",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "tan",
              "parameters": [
                {
                  "name": "value",
                  "type": "float"
                }
              ],
              "returns": [
                {
                  "type": "float"
                }
              ],
              "clobbers": []
            },
            {
              "name": "time",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "tostr",
              "parameters": [
                {
                  "name": "value",
                  "type": "float",
                  "register": "@FAC1"
                }
              ],
              "returns": [],
              "clobbers": [
                "X"
              ]
            }
          ],
          "variables": [],
          "constants": [
            {
              "name": "E",
              "type": "float"
            },
            {
              "name": "EPSILON",
              "type": "float"
            },
            {
              "name": "FAC_ADDR",
              "type": "uword"
            },
            {
              "name": "PI",
              "type": "float"
            },
            {
              "name": "TWOPI",
              "type": "float"
            },
            {
              "name": "π",
              "type": "float"
            }
          ]
        }
      ]
    },
    {
      "name": "graphics",
      "blocks": [
        {
          "name": "graphics",
          "subroutines": [
            {
              "name": "circle",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "ubyte"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_screen",
              "parameters": [
                {
                  "name": "pixelcolor",
                  "type": "ubyte"
                },
                {
                  "name": "bgcolor",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disable_bitmap_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disc",
              "parameters": [
                {
                  "name": "xcenter",
                  "type": "uword"
                },
                {
                  "name": "ycenter",
                  "type": "ubyte"
                },
                {
                  "name": "radius",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "enable_bitmap_mode",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "fillrect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "width",
                  "type": "uword"
                },
                {
                  "name": "height",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_y_lookup",
              "parameters": [
                {
                  "name": "yy",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "horizontal_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "length",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_plot",
              "parameters": [
                {
                  "name": "ploty",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "line",
              "parameters": [
                {
                  "name": "x1",
                  "type": "uword"
                },
                {
                  "name": "y1",
                  "type": "ubyte"
                },
                {
                  "name": "x2",
                  "type": "uword"
                },
                {
                  "name": "y2",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "plot",
              "parameters": [
                {
                  "name": "plotx",
                  "type": "uword",
                  "register": "@AX"
                },
                {
                  "name": "ploty",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "rect",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "width",
                  "type": "uword"
                },
                {
                  "name": "height",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "vertical_line",
              "parameters": [
                {
                  "name": "xx",
                  "type": "uword"
                },
                {
                  "name": "yy",
                  "type": "ubyte"
                },
                {
                  "name": "height",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "internal_plotx",
              "type": "uword",
              "isMemoryMapped": false,
              "isShared": false,
              "isZeroPage": true
            }
          ],
          "constants": [
            {
              "name": "BITMAP_ADDRESS",
              "type": "uword"
            },
            {
              "name": "CHARS_ADDRESS",
              "type": "uword"
            },
            {
              "name": "HEIGHT",
              "type": "ubyte"
            },
            {
              "name": "WIDTH",
              "type": "uword"
            }
          ]
        }
      ]
    },
    {
      "name": "math",
      "blocks": [
        {
          "name": "math",
          "subroutines": [
            {
              "name": "atan2",
              "parameters": [
                {
                  "name": "x1",
                  "type": "ubyte",
                  "register": "@R0"
                },
                {
                  "name": "y1",
                  "type": "ubyte",
                  "register": "@R1"
                },
                {
                  "name": "x2",
                  "type": "ubyte",
                  "register": "@R2"
                },
                {
                  "name": "y2",
                  "type": "ubyte",
                  "register": "@R3"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "cos8",
              "parameters": [
                {
                  "name": "angle",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "cos8u",
              "parameters": [
                {
                  "name": "angle",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "cosr8",
              "parameters": [
                {
                  "name": "radians",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "cosr8u",
              "parameters": [
                {
                  "name": "radians",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "crc16",
              "parameters": [
                {
                  "name": "data",
                  "type": "^^ubyte"
                },
                {
                  "name": "length",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "crc16_end",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "crc16_start",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "crc16_update",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "crc32",
              "parameters": [
                {
                  "name": "data",
                  "type": "^^ubyte"
                },
                {
                  "name": "length",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "crc32_end",
              "parameters": [],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "crc32_end_result",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "crc32_start",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "crc32_update",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "diff",
              "parameters": [
                {
                  "name": "v1",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "v2",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "diffw",
              "parameters": [
                {
                  "name": "w1",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "w2",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "direction",
              "parameters": [
                {
                  "name": "x1",
                  "type": "ubyte"
                },
                {
                  "name": "y1",
                  "type": "ubyte"
                },
                {
                  "name": "x2",
                  "type": "ubyte"
                },
                {
                  "name": "y2",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "direction_qd",
              "parameters": [
                {
                  "name": "quadrant",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "xdelta",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "ydelta",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "direction_sc",
              "parameters": [
                {
                  "name": "x1",
                  "type": "byte"
                },
                {
                  "name": "y1",
                  "type": "byte"
                },
                {
                  "name": "x2",
                  "type": "byte"
                },
                {
                  "name": "y2",
                  "type": "byte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "gcd",
              "parameters": [
                {
                  "name": "a",
                  "type": "uword"
                },
                {
                  "name": "b",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "interpolate",
              "parameters": [
                {
                  "name": "v",
                  "type": "ubyte"
                },
                {
                  "name": "inputMin",
                  "type": "ubyte"
                },
                {
                  "name": "inputMax",
                  "type": "ubyte"
                },
                {
                  "name": "outputMin",
                  "type": "ubyte"
                },
                {
                  "name": "outputMax",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "interpolatef",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "floats.interpolate"
            },
            {
              "name": "lerp",
              "parameters": [
                {
                  "name": "v0",
                  "type": "ubyte"
                },
                {
                  "name": "v1",
                  "type": "ubyte"
                },
                {
                  "name": "t",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "lerpf",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "floats.lerp"
            },
            {
              "name": "lerpf_fast",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "floats.lerp_fast"
            },
            {
              "name": "lerpw",
              "parameters": [
                {
                  "name": "v0",
                  "type": "uword"
                },
                {
                  "name": "v1",
                  "type": "uword"
                },
                {
                  "name": "t",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "log2",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "log2w",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "mul16_last_upper",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "mul32",
              "parameters": [
                {
                  "name": "a",
                  "type": "uword"
                },
                {
                  "name": "b",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "long"
                }
              ],
              "clobbers": []
            },
            {
              "name": "randrange",
              "parameters": [
                {
                  "name": "n",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "randrange_rom",
              "parameters": [
                {
                  "name": "n",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "randrangew",
              "parameters": [
                {
                  "name": "n",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "randrangew_rom",
              "parameters": [
                {
                  "name": "n",
                  "type": "uword"
                }
              ],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "rnd",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "rnd_rom",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "rndseed",
              "parameters": [
                {
                  "name": "seed1",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "seed2",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "rndseed_rom",
              "parameters": [
                {
                  "name": "seed1",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "seed2",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "rndw",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rndw_rom",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "sin8",
              "parameters": [
                {
                  "name": "angle",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "sin8u",
              "parameters": [
                {
                  "name": "angle",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "sinr8",
              "parameters": [
                {
                  "name": "radians",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "sinr8u",
              "parameters": [
                {
                  "name": "radians",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "petgfx",
      "blocks": [
        {
          "name": "petgfx",
          "subroutines": [
            {
              "name": "hline",
              "parameters": [
                {
                  "name": "x",
                  "type": "ubyte"
                },
                {
                  "name": "y",
                  "type": "ubyte"
                },
                {
                  "name": "length",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "plot",
              "parameters": [
                {
                  "name": "x",
                  "type": "ubyte"
                },
                {
                  "name": "y",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "vline",
              "parameters": [
                {
                  "name": "x",
                  "type": "ubyte"
                },
                {
                  "name": "y",
                  "type": "ubyte"
                },
                {
                  "name": "length",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "sorting",
      "blocks": [
        {
          "name": "sorting",
          "subroutines": [
            {
              "name": "gnomesort_by_ub",
              "parameters": [
                {
                  "name": "ub_keys",
                  "type": "^^ubyte"
                },
                {
                  "name": "wordvalues",
                  "type": "^^uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "gnomesort_by_uw",
              "parameters": [
                {
                  "name": "uw_keys",
                  "type": "uword"
                },
                {
                  "name": "wordvalues",
                  "type": "uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "gnomesort_ub",
              "parameters": [
                {
                  "name": "bytearray",
                  "type": "^^ubyte",
                  "register": "@AY"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "gnomesort_uw",
              "parameters": [
                {
                  "name": "wordvalues",
                  "type": "uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_by_ub",
              "parameters": [
                {
                  "name": "ub_keys",
                  "type": "^^ubyte"
                },
                {
                  "name": "wordvalues",
                  "type": "^^uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_by_uw",
              "parameters": [
                {
                  "name": "uw_keys",
                  "type": "^^uword"
                },
                {
                  "name": "wordvalues",
                  "type": "^^uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_pointers",
              "parameters": [
                {
                  "name": "pointers",
                  "type": "uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                },
                {
                  "name": "comparefunc",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_ub",
              "parameters": [
                {
                  "name": "values",
                  "type": "^^ubyte"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "shellsort_uw",
              "parameters": [
                {
                  "name": "values",
                  "type": "^^uword"
                },
                {
                  "name": "num_elements",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "string_comparator",
              "parameters": [
                {
                  "name": "string1",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "string2",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "strings",
      "blocks": [
        {
          "name": "strings",
          "subroutines": [
            {
              "name": "append",
              "parameters": [
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "suffix",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "compare",
              "parameters": [
                {
                  "name": "string1",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "string2",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "compare_nocase",
              "parameters": [
                {
                  "name": "string1",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "string2",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "compare_nocase_iso",
              "parameters": [
                {
                  "name": "string1",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "string2",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "contains",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "copy",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "endswith",
              "parameters": [
                {
                  "name": "st",
                  "type": "str"
                },
                {
                  "name": "suffix",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "find",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "find_eol",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "findstr",
              "parameters": [
                {
                  "name": "haystack",
                  "type": "str"
                },
                {
                  "name": "needle",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "hash",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isdigit",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isletter",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "islower",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isprint",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isspace",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "isupper",
              "parameters": [
                {
                  "name": "petsciichar",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "left",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@AX"
                },
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "length",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "lower",
              "parameters": [
                {
                  "name": "st",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lower_iso",
              "parameters": [
                {
                  "name": "st",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lowerchar",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lowerchar_iso",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lstrip",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lstripped",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "ltrim",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "ltrimmed",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "str"
                }
              ],
              "clobbers": []
            },
            {
              "name": "nappend",
              "parameters": [
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "suffix",
                  "type": "str",
                  "register": "@R1"
                },
                {
                  "name": "maxlength",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "ncopy",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "maxlength",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "pattern_match",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "pattern",
                  "type": "str",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "pattern_match_nocase",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "lowercase_pattern",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "iso",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "rfind",
              "parameters": [
                {
                  "name": "string",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "right",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@AY"
                },
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "rstrip",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rtrim",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "slice",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "start",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "length",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@R1"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "startswith",
              "parameters": [
                {
                  "name": "st",
                  "type": "str"
                },
                {
                  "name": "prefix",
                  "type": "str"
                }
              ],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "strip",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "trim",
              "parameters": [
                {
                  "name": "s",
                  "type": "str"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "upper",
              "parameters": [
                {
                  "name": "st",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "upper_iso",
              "parameters": [
                {
                  "name": "st",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "upperchar",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "upperchar_iso",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "syslib",
      "blocks": [
        {
          "name": "cbm",
          "subroutines": [
            {
              "name": "ACPTR",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ffa5"
            },
            {
              "name": "CHKIN",
              "parameters": [
                {
                  "name": "logical",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffc6"
            },
            {
              "name": "CHKOUT",
              "parameters": [
                {
                  "name": "logical",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffc9"
            },
            {
              "name": "CHRIN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$ffcf"
            },
            {
              "name": "CHROUT",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffd2"
            },
            {
              "name": "CINT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff81"
            },
            {
              "name": "CIOUT",
              "parameters": [
                {
                  "name": "databyte",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffa8"
            },
            {
              "name": "CLALL",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffe7"
            },
            {
              "name": "CLEARSCR",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$e544"
            },
            {
              "name": "CLEARST",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "CLOSE",
              "parameters": [
                {
                  "name": "logical",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ffc3"
            },
            {
              "name": "CLRCHN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffcc"
            },
            {
              "name": "GETIN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$ffe4"
            },
            {
              "name": "GETIN2",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            },
            {
              "name": "HOMECRSR",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$e566"
            },
            {
              "name": "IOBASE",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$fff3"
            },
            {
              "name": "IOINIT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ff84"
            },
            {
              "name": "IRQDFEND",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ea81"
            },
            {
              "name": "IRQDFRT",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ea31"
            },
            {
              "name": "LISTEN",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ffb1"
            },
            {
              "name": "LOAD",
              "parameters": [
                {
                  "name": "verify",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffd5"
            },
            {
              "name": "MEMBOT",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "dir",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff9c"
            },
            {
              "name": "MEMTOP",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "dir",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff99"
            },
            {
              "name": "OPEN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ],
              "address": "$ffc0"
            },
            {
              "name": "PLOT",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "dir",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$fff0"
            },
            {
              "name": "RAMTAS",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff87"
            },
            {
              "name": "RDTIM",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ffde"
            },
            {
              "name": "RDTIM16",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "RDTIML",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ]
            },
            {
              "name": "READST",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ffb7"
            },
            {
              "name": "RESTOR",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff8a"
            },
            {
              "name": "SAVE",
              "parameters": [
                {
                  "name": "zp_startaddr",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "endaddr",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffd8"
            },
            {
              "name": "SCNKEY",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ff9f"
            },
            {
              "name": "SCREEN",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "address": "$ffed"
            },
            {
              "name": "SECOND",
              "parameters": [
                {
                  "name": "address",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ff93"
            },
            {
              "name": "SETLFS",
              "parameters": [
                {
                  "name": "logical",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "secondary",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffba"
            },
            {
              "name": "SETMSG",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ff90"
            },
            {
              "name": "SETNAM",
              "parameters": [
                {
                  "name": "namelen",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "filename",
                  "type": "str",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffbd"
            },
            {
              "name": "SETTIM",
              "parameters": [
                {
                  "name": "low",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "middle",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "high",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffdb"
            },
            {
              "name": "SETTIML",
              "parameters": [
                {
                  "name": "jiffies",
                  "type": "long",
                  "register": "@R0R1"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "SETTMO",
              "parameters": [
                {
                  "name": "timeout",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffa2"
            },
            {
              "name": "STOP",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X"
              ],
              "address": "$ffe1"
            },
            {
              "name": "STOP2",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "STROUT",
              "parameters": [
                {
                  "name": "strptr",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ],
              "address": "$ab1e"
            },
            {
              "name": "TALK",
              "parameters": [
                {
                  "name": "device",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ffb4"
            },
            {
              "name": "TKSA",
              "parameters": [
                {
                  "name": "address",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ff96"
            },
            {
              "name": "UDTIM",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ],
              "address": "$ffea"
            },
            {
              "name": "UNLSN",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ffae"
            },
            {
              "name": "UNTLK",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ],
              "address": "$ffab"
            },
            {
              "name": "VECTOR",
              "parameters": [
                {
                  "name": "userptr",
                  "type": "uword",
                  "register": "@XY"
                },
                {
                  "name": "dir",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ],
              "address": "$ff8d"
            },
            {
              "name": "kbdbuf_clear",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "CBINV",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CINV",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "COLOR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "HIBASE",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IBASIN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IBSOUT",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICHKIN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICKOUT",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICLALL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICLOSE",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICLRCH",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ICRNCH",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IERROR",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IEVAL",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IGETIN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IGONE",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ILOAD",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IMAIN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IOPEN",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IQPLOP",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IRQ_VEC",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ISAVE",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ISTOP",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "NMINV",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "NMI_VEC",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "RESET_VEC",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SAREG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SFDX",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SHFLAG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPREG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "STATUS",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "STKEY",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SXREG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SYREG",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "TIME_HI",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "TIME_LO",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "TIME_MID",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "USERCMD",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "USRADD",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": [
            {
              "name": "Colors",
              "type": "uword"
            },
            {
              "name": "Screen",
              "type": "uword"
            }
          ]
        },
        {
          "name": "c64",
          "subroutines": [
            {
              "name": "banks",
              "parameters": [
                {
                  "name": "banks",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_bitmap_ptr",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get_char_matrix_ptr",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get_sprite_addr_ptrs",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "get_vic_memory_base",
              "parameters": [],
              "returns": [
                {
                  "type": "uword"
                }
              ],
              "clobbers": []
            },
            {
              "name": "getbanks",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_sprite_ptr",
              "parameters": [
                {
                  "name": "sprite_num",
                  "type": "ubyte"
                },
                {
                  "name": "sprite_data_address",
                  "type": "uword"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "x16jsrfar",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [
            {
              "name": "AD1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "AD2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "AD3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "BGCOL0",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "BGCOL1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "BGCOL2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "BGCOL4",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1CRA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1CRB",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1DDRA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1DDRB",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1ICR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1PRA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1PRB",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1SDR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1TAH",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1TAL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1TBH",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1TBL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1TOD10",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1TODHR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1TODMMIN",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA1TODSEC",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2CRA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2CRB",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2DDRA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2DDRB",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2ICR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2PRA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2PRB",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2SDR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2TAH",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2TAL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2TBH",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2TBL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2TOD10",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2TODHR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2TODMIN",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CIA2TODSEC",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CR1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CR2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "CR3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "ENV3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "EXTCOL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FC",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FCHI",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FCLO",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQ1",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQ2",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQ3",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQHI1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQHI2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQHI3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQLO1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQLO2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "FREQLO3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "IREQMASK",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "LPENX",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "LPENY",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "MSIGX",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "MVOL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "OSC3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "POTX",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "POTY",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PW1",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PW2",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PW3",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PWHI1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PWHI2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PWHI3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PWLO1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PWLO2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "PWLO3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "RASTER",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "RESFILT",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SCROLX",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SCROLY",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP0COL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP0X",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP0Y",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP1COL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP1X",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP1Y",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP2COL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP2X",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP2Y",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP3COL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP3X",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP3Y",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP4COL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP4X",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP4Y",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP5COL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP5X",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP5Y",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP6COL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP6X",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP6Y",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP7COL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP7X",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SP7Y",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPBGCL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPBGPR",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPCOL",
              "type": "ubyte[]",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPENA",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPMC",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPMC0",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPMC1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR",
              "type": "ubyte[]",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR0",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR4",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR5",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR6",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPRPTR7",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPSPCL",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPXY",
              "type": "ubyte[]",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SPXYW",
              "type": "@nosplit uword[]",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SR1",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SR2",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "SR3",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VICIRQ",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "VMCSB",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "XXPAND",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "YXPAND",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "c128",
          "subroutines": [
            {
              "name": "fast",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "slow",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        },
        {
          "name": "sys",
          "subroutines": [
            {
              "name": "clear_carry",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_irqd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "cpu_is_65816",
              "parameters": [],
              "returns": [
                {
                  "type": "bool"
                }
              ],
              "clobbers": []
            },
            {
              "name": "disable_caseswitch",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disable_runstop_and_charsetswitch",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "enable_caseswitch",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "enable_runstop_and_charsetswitch",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "exit",
              "parameters": [
                {
                  "name": "returnvalue",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "exit2",
              "parameters": [
                {
                  "name": "resulta",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "resultx",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "resulty",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "exit3",
              "parameters": [
                {
                  "name": "resulta",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "resultx",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "resulty",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "carry",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_as_returnaddress",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "internal_stringcopy",
              "parameters": [
                {
                  "name": "source",
                  "type": "str",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "irqsafe_clear_irqd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "irqsafe_set_irqd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "memcmp",
              "parameters": [
                {
                  "name": "address1",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "address2",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "size",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "memcopy",
              "parameters": [
                {
                  "name": "source",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "target",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "count",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "memset",
              "parameters": [
                {
                  "name": "mem",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "numbytes",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "memsetw",
              "parameters": [
                {
                  "name": "mem",
                  "type": "uword",
                  "register": "@R0"
                },
                {
                  "name": "numwords",
                  "type": "uword",
                  "register": "@R1"
                },
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "pop",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "popl",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "popw",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "progend",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "progstart",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "push",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "push_returnaddress",
              "parameters": [
                {
                  "name": "address",
                  "type": "uword",
                  "register": "@XY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pushl",
              "parameters": [
                {
                  "name": "value",
                  "type": "long",
                  "register": "@R0R1"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "pushw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "read_flags",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "reset_system",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "restore_irq",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "restore_prog8_internals",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "save_prog8_internals",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_carry",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_irq",
              "parameters": [
                {
                  "name": "handler",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "set_irqd",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "set_rasterirq",
              "parameters": [
                {
                  "name": "handler",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "rasterpos",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "set_rasterline",
              "parameters": [
                {
                  "name": "line",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "update_rasterirq",
              "parameters": [
                {
                  "name": "handler",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "rasterpos",
                  "type": "uword",
                  "register": "@R0"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "wait",
              "parameters": [
                {
                  "name": "jiffies",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "waitrastborder",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "waitrasterline",
              "parameters": [
                {
                  "name": "line",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "waitvsync",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            }
          ],
          "variables": [],
          "constants": [
            {
              "name": "MAX_BYTE",
              "type": "byte"
            },
            {
              "name": "MAX_FLOAT",
              "type": "float"
            },
            {
              "name": "MAX_UBYTE",
              "type": "ubyte"
            },
            {
              "name": "MAX_UWORD",
              "type": "uword"
            },
            {
              "name": "MAX_WORD",
              "type": "word"
            },
            {
              "name": "MIN_BYTE",
              "type": "byte"
            },
            {
              "name": "MIN_FLOAT",
              "type": "float"
            },
            {
              "name": "MIN_UBYTE",
              "type": "ubyte"
            },
            {
              "name": "MIN_UWORD",
              "type": "uword"
            },
            {
              "name": "MIN_WORD",
              "type": "word"
            },
            {
              "name": "SIZEOF_BOOL",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_BYTE",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_FLOAT",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_LONG",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_POINTER",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_UBYTE",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_UWORD",
              "type": "ubyte"
            },
            {
              "name": "SIZEOF_WORD",
              "type": "ubyte"
            },
            {
              "name": "target",
              "type": "ubyte"
            }
          ]
        },
        {
          "name": "cx16",
          "subroutines": [
            {
              "name": "restore_virtual_registers",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "save_virtual_registers",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            }
          ],
          "variables": [
            {
              "name": "r0",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0r1sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r0sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10r11sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r10sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r11sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12r13sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r12sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r13sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14r15sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r14sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r15sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r1sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2r3sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r2sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r3sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4r5sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r4sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r5sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6r7sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r6sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r7sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8r9sl",
              "type": "long",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r8sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9",
              "type": "uword",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9H",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9L",
              "type": "ubyte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9bH",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9bL",
              "type": "bool",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9s",
              "type": "word",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9sH",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            },
            {
              "name": "r9sL",
              "type": "byte",
              "isMemoryMapped": true,
              "isShared": false,
              "isZeroPage": false
            }
          ],
          "constants": []
        },
        {
          "name": "p8_sys_startup",
          "subroutines": [
            {
              "name": "cleanup_at_exit",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "disable_runstop_and_charsetswitch",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "enable_runstop_and_charsetswitch",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "init_system",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "init_system_phase2",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "test_stack",
      "blocks": [
        {
          "name": "test_stack",
          "subroutines": [
            {
              "name": "test",
              "parameters": [],
              "returns": [],
              "clobbers": []
            }
          ],
          "variables": [],
          "constants": []
        }
      ]
    },
    {
      "name": "textio",
      "blocks": [
        {
          "name": "txt",
          "subroutines": [
            {
              "name": "bell",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "chrout",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [],
              "address": "$ffd2"
            },
            {
              "name": "clear_screen",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "clear_screenchars",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "clear_screencolors",
              "parameters": [
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "cls",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "color",
              "parameters": [
                {
                  "name": "txtcol",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "column",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "fill_screen",
              "parameters": [
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "get_column",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_cursor",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "get_row",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "getchr",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "getclr",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@Y"
                }
              ],
              "returns": [],
              "clobbers": [
                "Y"
              ]
            },
            {
              "name": "height",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            },
            {
              "name": "home",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "input_chars",
              "parameters": [
                {
                  "name": "buffer",
                  "type": "^^ubyte",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "iso2petscii",
              "parameters": [
                {
                  "name": "iso_char",
                  "type": "ubyte"
                }
              ],
              "returns": [
                {
                  "type": "ubyte"
                }
              ],
              "clobbers": []
            },
            {
              "name": "iso2petscii_str",
              "parameters": [
                {
                  "name": "iso_string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "lowercase",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "nl",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "petscii2scr",
              "parameters": [
                {
                  "name": "petscii_char",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "petscii2scr_str",
              "parameters": [
                {
                  "name": "petscii_string",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "plot",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@X"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "print",
              "parameters": [
                {
                  "name": "text",
                  "type": "str",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "print_b",
              "parameters": [
                {
                  "name": "value",
                  "type": "byte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_bool",
              "parameters": [
                {
                  "name": "value",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "print_f",
              "parameters": [],
              "returns": [],
              "clobbers": [],
              "isAlias": "floats.print"
            },
            {
              "name": "print_l",
              "parameters": [
                {
                  "name": "value",
                  "type": "long"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "print_ub",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_ub0",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_ubbin",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "prefix",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_ubhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "ubyte",
                  "register": "@A"
                },
                {
                  "name": "prefix",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_ulhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "long"
                },
                {
                  "name": "prefix",
                  "type": "bool"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "print_uw",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_uw0",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_uwbin",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "prefix",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_uwhex",
              "parameters": [
                {
                  "name": "value",
                  "type": "uword",
                  "register": "@AY"
                },
                {
                  "name": "prefix",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "print_w",
              "parameters": [
                {
                  "name": "value",
                  "type": "word",
                  "register": "@AY"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "row",
              "parameters": [
                {
                  "name": "rownum",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "rvs_off",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "rvs_on",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "scroll_down",
              "parameters": [
                {
                  "name": "alsocolors",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "scroll_left",
              "parameters": [
                {
                  "name": "alsocolors",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X",
                "Y"
              ]
            },
            {
              "name": "scroll_right",
              "parameters": [
                {
                  "name": "alsocolors",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "scroll_up",
              "parameters": [
                {
                  "name": "alsocolors",
                  "type": "bool",
                  "register": "@Pc"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "X"
              ]
            },
            {
              "name": "setcc",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte"
                },
                {
                  "name": "row",
                  "type": "ubyte"
                },
                {
                  "name": "character",
                  "type": "ubyte"
                },
                {
                  "name": "charcolor",
                  "type": "ubyte"
                }
              ],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "setchr",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "character",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "setclr",
              "parameters": [
                {
                  "name": "col",
                  "type": "ubyte",
                  "register": "@X"
                },
                {
                  "name": "row",
                  "type": "ubyte",
                  "register": "@Y"
                },
                {
                  "name": "color",
                  "type": "ubyte",
                  "register": "@A"
                }
              ],
              "returns": [],
              "clobbers": [
                "A",
                "Y"
              ]
            },
            {
              "name": "size",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "A"
              ]
            },
            {
              "name": "spc",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "uppercase",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "waitkey",
              "parameters": [],
              "returns": [],
              "clobbers": []
            },
            {
              "name": "width",
              "parameters": [],
              "returns": [],
              "clobbers": [
                "X",
                "Y"
              ]
            }
          ],
          "variables": [],
          "constants": [
            {
              "name": "DEFAULT_HEIGHT",
              "type": "ubyte"
            },
            {
              "name": "DEFAULT_WIDTH",
              "type": "ubyte"
            }
          ]
        }
      ]
    }
  ]
};


/**
 * Map of target -> library data
 */
export const libraries: Record<string, LibraryData> = {
    'cx16': library_cx16,
    'c64': library_c64
};

/**
 * Get all subroutines for a given block across all targets
 */
export function getSubroutinesForBlock(blockName: string, target?: string): SubroutineInfo[] {
    const results: SubroutineInfo[] = [];
    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);
    
    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            for (const block of mod.blocks) {
                if (block.name === blockName) {
                    results.push(...block.subroutines);
                }
            }
        }
    }
    
    return results;
}

/**
 * Find a subroutine by fully qualified name (e.g., "txt.print", "sys.memset")
 */
export function findSubroutine(qualifiedName: string, target?: string): SubroutineInfo | undefined {
    const [blockName, subName] = qualifiedName.split('.');
    if (!blockName || !subName) return undefined;
    
    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);
    
    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            for (const block of mod.blocks) {
                if (block.name === blockName) {
                    const sub = block.subroutines.find(s => s.name === subName);
                    if (sub) return sub;
                }
            }
        }
    }
    
    return undefined;
}

/**
 * Get all blocks across all modules for a target
 */
export function getAllBlocks(target?: string): BlockInfo[] {
    const results: BlockInfo[] = [];
    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);
    
    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            results.push(...mod.blocks);
        }
    }
    
    return results;
}

/**
 * Format a subroutine signature for display
 */
export function formatSubroutineSignature(sub: SubroutineInfo): string {
    if (sub.isAlias) {
        return `${sub.name}  (alias for ${sub.isAlias})`;
    }
    
    const params = sub.parameters.map(p => {
        let s = `${p.type} ${p.name}`;
        if (p.register) s += ` ${p.register}`;
        return s;
    }).join(', ');
    
    let sig = `${sub.name}(${params})`;
    
    if (sub.returns.length > 0) {
        const rets = sub.returns.map(r => {
            let s = r.type;
            if (r.register) s += ` ${r.register}`;
            return s;
        }).join(', ');
        sig += ` -> ${rets}`;
    }
    
    if (sub.clobbers.length > 0) {
        sig += `  clobbers (${sub.clobbers.join(',')})`;
    }
    
    if (sub.address) {
        sig += `  = ${sub.address}`;
    }
    
    if (sub.bank !== undefined) {
        sig += `  @bank ${sub.bank}`;
    }
    
    return sig;
}
