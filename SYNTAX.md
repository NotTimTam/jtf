# JTF Syntax Standard

## Scope

JTF is a language-independent syntax for defining spreadsheet tables. It is derived from, and entirely dependent upon [JSON](https://www.json.org).

The goal of this specification is only to define the syntax of valid JTF texts. It does not define how JTF text might be interpreted or interacted with.

## Conformance

> A conforming JTF text is a sequence of Unicode code points that strictly conforms to the JTF grammar defined by this specification.
>
> A conforming processor of JTF text should not accept any inputs that are not conforming JTF texts. A conforming processor may impose semantic restrictions that limit the set of conforming JTF texts that it will process.
>
> _Loosely based on the [JSON specification document](https://ecma-international.org/wp-content/uploads/ECMA-404_2nd_edition_december_2017.pdf)._

## File Format

-   `.jtf` data must be written in valid [JSON](https://www.json.org/) syntax.

## Top-Level Object

-   The top-most object in the document must contain the following keys:
    -   "data": An object representing the tabular data.
    -   "style": An array containing CSS style definitions.

## Data Object

-   The "data" object functions as an array-like structure, where each key represents the index of a row. The indeces do not need to be in order. Due to the nature of JSON/JS Objects, when more than one of the same key are present, all but latter-most are ignored.
-   Each value within the "data" object is an object representing a row of data.
-   Within each row object, keys represent the indices of each column, and values represent the content of the column. (i.e., the cell) The indeces function similarly to the row indeces mentioned above.
-   Column content (cells) can be a string, number, or boolean. Both an empty string `""` and `null` are considered "empty" cells.
    -   Strings may contain [inline "markdown"](#inline-markdown-standard) for formatting (italic, bold, underline, strikethrough, etc.).
    -   Strings may contain HTML `<span></span>` elements. Any other HTML elements will be ignored, (treated as strings) and any attributes other than `"class"` and `"style"` will be ignored.
    -   Strings may contain [formulas](FORMULAS.md).

## Style Array

-   The "style" array contains CSS style definitions for styling cells, rows, or columns.
-   Each style definition is an object with the following fields:
    -   "type": Either "class" or "style", indicating whether the style should be applied as a class or directly as inline CSS when rendered in an HTML dom structure.
    -   "target": An array representing the targeted cells, rows, or columns. See [the target array info](#target-array-standard) for more info.
    -   "data": Contains the content of the CSS style attribute or class attribute.
    -   "condition": `(optional)` Contains a [formula](FORMULAS.md), the result of which determines whether or not the style will be applied.

# Inline Markdown Standard

Almost every markdown interpreter handles different cases in different ways, but in general:

-   One `*` italicizes text.
-   Two `*` make text bold.
-   Three `*` make text bold and italic.
-   `*` and `_` can be used interchangeably, and there should be an equal amount of each on either side of the string.

The following are valid inline markdown configurations for cell data:

## Italic

```markdown
_This is some italic text._
```

## Bold Text

```markdown
**This is some bold text.**
```

## Bold & Italic Text

```markdown
**_This is some bold, italic text._**
```

## Line-Through Text

```markdown
~~This is some text with a line through it.~~
```

# Target Array Standard

Target Arrays are used by the `"style"` data and the `"ruleset"` data to indicate targeted cells, rows, and columns.

They function as such:

-   The first item represents the x-coordinate (column index), and the second item represents the y-coordinate (row index).
    -   If the row coordinate is not provided, or `null`, the style targets all rows in the corresponding column.
    -   If the column coordinate is not provided, or `null`, the style targets all columns in the corresponding row.
    -   If neither the row or column is provided, the style targets all rows and columns.
-   Coordinates can be a single integer, indicating a single row or column, or an array of integers, indicating several rows or columns.
-   If a coordinate, (`[x, y]`) or an item in a coordinate array (`[[x, x, x, x], y]`) is a string, it is handled differently:
    -   A string containing an integer is treated as an integer.
    -   A string containing two integers, separated by a colon (`":"`) will be treated as a span of values. I.e. `"2:6"` resolves to `[2, 3, 4, 5, 6]`.
    -   All other strings are invalid.
