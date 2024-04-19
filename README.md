# JTF

JSON Table Format. An open-source file format for spreadsheets stored in JSON.

[Read the syntax standard.](SYNTAX.md)

## Why JTF?

The `.jtf` format is an attempt at bridging the gap between popular spreadsheet file formats and JavaScript. Complex libraries are generally required to parse `.xlsx` files and their equivalents for use in JavaScript. It is even harder to export content back in to those formats. Formats like `.csv` are far too rudimentary and do not support things like styling and formulas.

`.jtf` data is stored in a familiar and readily accessible structure, **JSON!** Making it somewhat readable in its raw state, and requiring only a small amount of code to properly compile it into a table. `.jtf` data can be stored interchangably within JavaScript objects, `.json` files, and `.jtf` files.

It employs an `.xlsx` equivalent formula system and advanced, yet simplistic cell targeting system.

This library contains methods for validating, reading, and writing `.jtf` format files **with zero dependencies!**

For custom applications, developers looking to support `.jtf` files in their projects are encouraged to write their own code for interacting with the format. Contributions to the format and codebase are also welcome. See [CONTRIBUTIONS.md](CONTRIBUTIONS.md) for more.

## Example JTF file.

```json
{
	"data": {
		"0": {
			"13": "**This is some bold text.**"
		},
		"1": {},
		"999": {
			"0": "This is the =COLUMN cell."
		}
	},
	"style": [
		{ "type": "class", "target": [, 2], "data": "highlighted-row" },
		{ "type": "style", "target": [[2], 1], "data": "font-weight: bold;" },
		{
			"type": "style",
			"target": [[], 3],
			"condition": "=SUM(3E, 12D) >= 12F",
			"data": "background-color: #f0f0f0;"
		}
	]
}
```
