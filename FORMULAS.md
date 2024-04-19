# JTF Formula Standard

Formulas are statements that run on/within `.jtf` cells. They are used to perform calculations, manipulate data, and automate tasks

## Formula Rules

-   All formulas must start with an equals sign (`"="`). This indicates that what follows is a formula and not just text.
-   Formulas often involve referencing other cells. You can refer to a cell by its column letter and row number, such as A1 or B2.
-   The `.jtf` format supports various mathematical operators, including addition (+), subtraction (-), multiplication (\*), division (/), exponentiation (^), and concatenation (&).
-   `.jtf` supports a wide range of built-in functions for performing specific tasks. Functions are usually followed by parentheses () and may require one or more arguments. Common functions include SUM, AVERAGE, IF, VLOOKUP, and many more.
-   Just like in mathematics, formulas follows the order of operations (PEMDAS/BODMAS): Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). You can use parentheses to override the default order.
-   By default, cell references in formulas are relative, meaning they adjust when the formula is copied to other cells. You can use absolute references ($) to keep a reference fixed when copying a formula.
-   Array formulas allow you to perform calculations on multiple cells at once. They are enclosed in curly braces {} and can be created using special functions like SUMPRODUCT.
