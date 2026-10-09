/**
 * @file CDDL (RFC 8610, with RFC 9165 and RFC 9682 additions)
 * @license MIT
 */

const sep1 = (rule) => seq(rule, repeat(seq(",", rule)));

export default grammar({
  name: "cddl",

  extras: ($) => [/\s/, $.comment],

  word: ($) => $.identifier,

  conflicts: ($) => [[$.member_key, $._type2]],

  rules: {
    source_file: ($) => repeat($.rule),

    comment: (_) => token(seq(";", /.*/)),

    rule: ($) =>
      seq(
        field("name", $.identifier),
        optional(field("parameters", $.generic_params)),
        field("operator", choice("=", "/=", "//=")),
        field("value", $.group_entry),
      ),

    generic_params: ($) => seq("<", sep1($.identifier), ">"),

    generic_args: ($) => seq("<", sep1($.type1), ">"),

    // A rule's value is one entry; a bare type is an entry with no key.
    group: ($) => seq($.group_choice, repeat(seq("//", $.group_choice))),

    group_choice: ($) => repeat1(seq($.group_entry, optional(","))),

    group_entry: ($) =>
      prec.right(
        seq(
          optional(field("occurrence", $.occurrence)),
          optional(field("key", $.member_key)),
          field("type", $.type),
        ),
      ),

    occurrence: (_) => {
      const uint = /(0x[0-9A-Fa-f]+|0b[01]+|\d+)/.source;
      return token(choice("?", "+", new RegExp(`(${uint})?\\*(${uint})?`)));
    },

    member_key: ($) =>
      choice(
        seq($.type1, optional($.cut), "=>"),
        seq(alias($.identifier, $.bareword), optional($.cut), ":"),
        seq($._value, optional($.cut), ":"),
      ),

    cut: (_) => "^",

    type: ($) => prec.left(seq($.type1, repeat(seq("/", $.type1)))),

    type1: ($) =>
      prec.left(
        seq(
          $._type2,
          optional(seq(choice($.range_operator, $.control_operator), $._type2)),
        ),
      ),

    range_operator: (_) => choice("..", "..."),

    control_operator: (_) => token(seq(".", /[A-Za-z@_$][A-Za-z0-9@_$.-]*/)),

    _type2: ($) =>
      choice(
        $._value,
        $.reference,
        $.parenthesized,
        $.map,
        $.array,
        $.unwrap,
        $.choice_from,
        $.tagged,
      ),

    reference: ($) =>
      prec.right(seq($.identifier, optional($.generic_args))),

    parenthesized: ($) => seq("(", optional($.group), ")"),

    map: ($) => seq("{", optional($.group), "}"),

    array: ($) => seq("[", optional($.group), "]"),

    unwrap: ($) => seq("~", $.reference),

    choice_from: ($) => seq("&", choice($.parenthesized, $.reference)),

    // #6.32(tstr), #6.<uint>(any), #7.25, #1, #
    tagged: ($) =>
      prec.right(
        seq(
          $.tag,
          optional(seq(token.immediate("<"), $.type, ">")),
          optional(seq(token.immediate("("), $.type, ")")),
        ),
      ),

    tag: (_) => token(seq("#", optional(seq(/\d/, optional(/\.\d*/))))),

    _value: ($) => choice($.number, $.text, $.bytes),

    number: (_) =>
      token(
        seq(
          optional("-"),
          choice(
            /0x[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?(p[+-]?\d+)?/,
            /0b[01]+/,
            /\d+(\.\d+)?([eE][+-]?\d+)?/,
          ),
        ),
      ),

    text: (_) => token(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"')),

    bytes: (_) =>
      token(seq(optional(choice("h", "b64")), "'", repeat(choice(/[^'\\]/, /\\./)), "'")),

    identifier: (_) => /[A-Za-z@_$]([-.]*[A-Za-z0-9@_$])*/,
  },
});
