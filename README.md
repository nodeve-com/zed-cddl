# CDDL for Zed

Syntax highlighting, bracket matching, indentation, and outline for [CDDL](https://www.rfc-editor.org/rfc/rfc8610) (`.cddl`) files.

`grammar/` is a tree-sitter grammar for RFC 8610, plus RFC 9165 control operators and RFC 9682 tag forms. After editing `grammar.js`, run `npx tree-sitter-cli generate && npx tree-sitter-cli test` in `grammar/`, then commit and point `rev` in `extension.toml` at that commit.

Install locally: Zed → `zed: install dev extension` → this directory.
