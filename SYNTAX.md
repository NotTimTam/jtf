# JTF Syntax Standard (`v1.1.8`)

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
    -   "data": An [object](#data-object) representing the tabular data.
    -   "style": A [style array](#style-array) containing CSS style definitions that apply to every table in the document.
-   The top-most object in the document **can** contain the following keys, but will be considered valid without them:
    -   "createdAt": An ISO 8601 conforming [date-time string](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format) indicating the date/time the file was created on.
    -   "updatedAt": An ISO 8601 conforming [date-time string](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format) indicating the date/time the file was last updated on.
    -   "metadata": An object containing several details about the origin/ownership of the document:
        -   "author": A string indicating the name of the document's author.
        -   "title": A string indicating the title of the document, which can differ from the file name.
        -   "jtf": A [string representing the JTF standard version](#version-indication) being implemented in the file.
        -   "css": Either:
            -   A string containing CSS data, or
            -   An array of strings containing CSS data.
        -   "extra": An array that allows conforming processors to include additional data for extending their functionality. Each entry in the array should be an object containing:
            -   "processor": A unique string identifier for the processor that generated the data. This key helps distinguish between different processors' extensions.
            -   Additional key/value pairs: These can be used to include processor-specific information or features not defined by the JTF syntax standard, as long as this additional data conforms to all specifications within the standard.

## Version Indication

-   The `"jtf"` string within a document's metadata object is used to indicate the version of the JTF standard that the document conforms to. JTF processors can use this information to indicate whether the file can be edited with their implementation of the JTF standard.
-   The format of the string is the letter "v" followed by the full version number of the JTF standard used. I.e., `{ "jtf": "v1.1.2" }`

## Data Object

-   The top-level "data" object is used to store individual data tables. Each key in the object is an integer represents the (0-based) index of the table. The indeces do not need to be in order. Due to the nature of JSON/JS Objects, when more than one of the same key are present, the latter-most overwrites the rest.
-   Each value in the object is a "table" object containing the data of that table.
-   Each table object **must** contain the following keys:
    -   "label": A string representing an identifying label for the table. It is not necessary for this label to be unique, but processors may enforce label uniqueness if desired.
    -   "data": An object that functions as an array-like structure, where each key represents the (0-based) index of a row. The indeces do not need to be in order. Due to the nature of JSON/JS Objects, when more than one of the same key are present, the latter-most overwrites the rest.
        -   Each value within the table's "data" object is an object representing a row of data.
        -   Within each row object, keys represent the (0-based) indices of each column, and values represent the content of the column. (i.e., the cell) The indeces function similarly to the row indeces mentioned above.
        -   Column content (cells) can be a string, number, or boolean. Both empty strings `""`, and `null` are considered "empty" cells.
-   Each table object **can** contain the following keys, but will be considered valid without them:
    -   "style": A [style array](#style-array) that applies only to this table.

## Style Array

-   The "style" array contains CSS style definitions for styling cells, rows, or columns.
-   Each style definition is an object with the following fields:
    -   "type": Either "class" or "style", indicating whether the style should be applied as a class or directly as inline CSS when rendered in an HTML dom structure.
    -   "target": An array representing the targeted cells, rows, or columns. See [the target array info](#target-array-standard) for more info.
    -   "data": Contains the content of the CSS style attribute or class attribute.
-   A top-level "style" array applies to every table. "style" cascade, meaning table level styles will overwrite styles set at the top-level, unless overrides, such as the `!important` rule are used.

# Target Array Standard

Target Arrays are used by the `"style"`, and `"ruleset"` data to indicate targeted cells, rows, and columns. All indeces are 0-based.

They function as such:

-   The first item represents the x-coordinate (column index), and the second item represents the y-coordinate (row index).
    -   If the row coordinate is not provided, or `null`, the style targets all rows in the corresponding column.
    -   If the column coordinate is not provided, or `null`, the style targets all columns in the corresponding row.
    -   If neither the row or column is provided, the style targets all rows and columns.
-   Coordinates can be a single integer, indicating a single row or column, or an array of integers, indicating several rows or columns.
-   If a coordinate, (`[x, y]`) or an item in a coordinate array (`[[x, x, x, x], y]`) is a string, it is handled as a delimiter:
    -   A string containing an integer is treated as an integer.
    -   A string containing two integers, separated by a colon (`":"`) will be treated as a span of values, from the first, to (but not including) the last. I.e. `"2:6"` resolves to `[2, 3, 4, 5]`.
    -   A string containing an integer preceded by a colon will resolve to indeces 0 to the strings value. (`":4"` is treated as `[0, 1, 2, 3]`)
    -   Likewise, a colon following an integer indicates the integer and every index after it are targeted. (`"4:"` is treated as `[4, 5, 6, ...]`)
    -   A string contain just a colon targets all indeces. (`":"`)
    -   All other strings are invalid.
