# JTF Syntax Standard (`v1.0`)

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

-   The top-most object in the document **must** contain the following keys:
    -   "jtf": A string representing the JTF standard version being implemented in the file.
    -   "data": An object representing the tabular data.
    -   "style": An array containing CSS style definitions.

## `jtf` String

-   The `"jtf"` string at the top-level of the document is used to indicate the version of the JTF standard that the document conforms to. JTF processors can use this information to indicate whether the file can be edited with their implementation of the JTF standard.
-   The format of the string is the letter "v" followed by the full version number of the JTF standard used. I.e., `{ "jtf": "v1.0" }`

## Data Object

-   The "data" object functions as an array-like structure, where each key represents the index of a row. The indeces do not need to be in order. Due to the nature of JSON/JS Objects, when more than one of the same key are present, the latter-most overwrites the rest.
-   Each value within the "data" object is an object representing a row of data.
-   Within each row object, keys represent the indices of each column, and values represent the content of the column. (i.e., the cell) The indeces function similarly to the row indeces mentioned above.
-   Column content (cells) can be a string, number, or boolean. Both empty strings `""`, and `null` are considered "empty" cells.
    -   Strings may contain these html elements:
        -   `span`
        -   `b`
        -   `em`
        -   `strong`
        -   `u`
        -   `sup`
        -   `sub`
        -   `br`
        -   and `a` elements.
    -   Any other HTML elements should be removed, (with their contents left behind) and any attributes other than:
        -   `"class"`
        -   `"style"`
        -   `"id"`
        -   `"href"`
        -   `"target"`
        -   `"rel"`
    -   should be removed.
    -   Strings may contain [formulas](FORMULAS.md).

## Style Array

-   The "style" array contains CSS style definitions for styling cells, rows, or columns.
-   Each style definition is an object with the following fields:
    -   "type": Either "class" or "style", indicating whether the style should be applied as a class or directly as inline CSS when rendered in an HTML dom structure.
    -   "target": An array representing the targeted cells, rows, or columns. See [the target array info](#target-array-standard) for more info.
    -   "data": Contains the content of the CSS style attribute or class attribute.
    -   "condition": `(optional)` Contains a [formula](FORMULAS.md), the result of which determines whether or not the style will be applied.

# Target Array Standard

Target Arrays are used by the `"style"` data and the `"ruleset"` data to indicate targeted cells, rows, and columns.

They function as such:

-   The first item represents the x-coordinate (column index), and the second item represents the y-coordinate (row index).
    -   If the row coordinate is not provided, or `null`, the style targets all rows in the corresponding column.
    -   If the column coordinate is not provided, or `null`, the style targets all columns in the corresponding row.
    -   If neither the row or column is provided, the style targets all rows and columns.
-   Coordinates can be a single integer, indicating a single row or column, or an array of integers, indicating several rows or columns.
-   If a coordinate, (`[x, y]`) or an item in a coordinate array (`[[x, x, x, x], y]`) is a string, it is handled as a delimiter:
    -   A string containing an integer is treated as an integer.
    -   A string containing two integers, separated by a colon (`":"`) will be treated as a span of values, from the first, to (but not including) the last. I.e. `"2:6"` resolves to `[2, 3, 4, 5]`.
    -   A string containing an integer proceeded by a colon will resolve to indeces 0 to the strings value. (`":4"` is treated as `[0, 1, 2, 3]`)
    -   Likewise, a colon following an integer indicates the integer and every index after it are targeted. (`"4:"` is treated as `[4, 5, 6, ...]`)
    -   A string contain just a colon targets all indeces. (`":"`)
    -   All other strings are invalid.
