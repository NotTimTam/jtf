import JTF from "../dist/index.js";

const data = JTF.parse(`
{
	"createdAt": "2020-01-01T00:00:00.000Z",
	"updatedAt": "${new Date().toISOString()}",
	"metadata": {
		"author": "NotTimTam",
		"title": "JTF v1.1.4 Example Document",
		"jtf": "v1.1.4",
		"css": [".highlighed-row { color: yellow; }"]
	},
	"data": {
		"0": {
			"data": {
				"0": {
					"13": "This is some <b>bold</b> text."
				},
				"1": {},
				"999": {
					"0": "This is the 0th cell in the 999th row."
				}
			},
			"label": "First Table",
			"style": [
				{
					"type": "style",
					"target": [
						"0:10",
						0
					],
					"data": "background-color: red;"
				}
			]
		},
		"1": {
			"data": {
				"0": {
					"0": "This is some <b>bold</b> text in table two."
				}
			},
			"label": "Second Table",
			"style": [
				{
					"type": "style",
					"target": [
						0,
						0
					],
					"data": "background-color: blue;"
				}
			]
		},
		"3": {
			"data": {
				"0": {
					"0": 14,
					"1": 16
				},
				"1": {
					"0": "=[0,0]+[1,0]"
				}
			},
			"label": "Third Table"
		}
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
	]
}
`);

console.log(data);
