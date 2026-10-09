(comment) @comment

(rule name: (identifier) @type)
(generic_params (identifier) @type.parameter)

(reference (identifier) @type)

; RFC 8610 Appendix D prelude
((reference (identifier) @type.builtin)
  (#any-of? @type.builtin
    "any" "uint" "nint" "int" "bstr" "bytes" "tstr" "text"
    "tdate" "time" "number" "biguint" "bignint" "bigint" "integer"
    "unsigned" "decfrac" "bigfloat" "eb64url" "eb64legacy" "eb16"
    "encoded-cbor" "uri" "b64url" "b64legacy" "regexp" "mime-message"
    "cbor-any" "float16" "float32" "float64" "float16-32" "float32-64"
    "float" "bool" "nil" "null" "undefined"))

((reference (identifier) @boolean)
  (#any-of? @boolean "true" "false"))

((reference (identifier) @constant.builtin)
  (#any-of? @constant.builtin "null" "nil" "undefined"))

(bareword) @property

(number) @number
(text) @string
(bytes) @string.special

(tag) @attribute
(control_operator) @keyword
(occurrence) @operator
(range_operator) @operator
(cut) @operator

["=" "/=" "//=" "=>" "/" "//" "~" "&"] @operator

["{" "}" "[" "]" "(" ")" "<" ">"] @punctuation.bracket
["," ":"] @punctuation.delimiter
