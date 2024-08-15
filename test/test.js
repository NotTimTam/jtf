import JTF from "../dist/index.js";

const data = JTF.parse(`
{
	"createdAt": "2020-01-01T00:00:00.000Z",
	"updatedAt": "${new Date().toISOString()}",
	
		"metadata": {
			"author": "NotTimTam",
			"title": "JTF v1.1.7 Example Document",
			"jtf": "v1.1.7",
			"css": ".highlighed-row { color: yellow; }",
			"extra": [
				{
					"processor": "jtf-core",
					"someExtraData": [
						345,
						2345,
						8365,
						21345,
						764
					]
				}
			]
		},
		"data": {
			"0": {
				"data": {
					"0": {
						"13": "This is some <b>bold</b> text."
						"0": "=SUM([0:3, 1:4])",
						"1": "=A1 + B2",
						"2": "=myFunction([1:3], 5)",
						"3": "=A1 + *B2",
						"4": "=A1 + (B2 * 3",
						"5": "=SUM([0,1])"
					},
					"1": {},
					"999": {
						"0": "This is the 0th cell in the 999th row.",
						"1": null
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
				"data": "background-color: #f0f0f0;"
			}
		]
	}
`);

console.log(data);
