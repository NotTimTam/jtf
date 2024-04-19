import JTF from "../index.js";

const jtf = new JTF();

const data = `
{
	"data": {
		"0": {
			"13": "**This is some bold text.**"
		},
		"1": {},
		"999": {
			"0": "This is the 0th cell in the 999th row."
		},
		"14": {
			"12": "egg",
			"12": "egg2"
		},
		"14": {}
	},
	"style": [
		{
			"type": "class",
			"target": [
				null,
				2
			],
			"data": "highlighted-row"
		},
		{
			"type": "style",
			"target": [
				[
					2
				],
				1
			],
			"data": "font-weight: bold;"
		},
		{
			"type": "style",
			"target": [
				[],
				3
			],
			"condition": "=SUM(3E, 12D) >= 12F",
			"data": "background-color: #f0f0f0;"
		}
	]}
`;

console.log(JTF.validate(data, true));
