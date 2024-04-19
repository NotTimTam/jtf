import functions from "./library/components/functions.js";
import { arrayAsString } from "./library/util/data.js";

/**
 * An object containing several methods for interacting with JTF data.
 *
 * Initialize with `new JTF()`.
 */
export default class JTF {
	static functions = functions;

	constructor() {}

	/**
	 * Parse a string of JTF data and convert it into an object.
	 * @param {string} string A string of JTF data to parse.
	 * @returns {*} A parsed data object.
	 */
	static parse(string) {
		return JSON.parse(string);
	}

	/**
	 * Stringify a JTF data object.
	 * @param {*} data A JTF data object.
	 */
	static stringify(data) {
		return JSON.stringify(data);
	}

	/**
	 * Convert a column's index number to a letter.
	 * @param {number} number The number to convert.
	 * @returns {string} The column's letter.
	 */
	static columnLetter(number) {
		if (isNaN(+number))
			throw new Error(`Invalid number (${number}) provided.`);

		number = +number;

		let column = "";

		while (number > 0) {
			let remainder = (number - 1) % 26;
			column = String.fromCharCode(65 + remainder) + column;
			number = Math.floor((number - 1) / 26);
		}

		return column;
	}

	static validateCell(cell) {
		console.log(cell);

		return "Cell is bad.";
	}

	/**
	 * Validate a string of JTF data.
	 * @param {string} string A string of JTF data.
	 * @param {boolean} returnReason When true, if the string is invalid data, the reason why is returned as a string. This requires you to ensure the result strictly equals `true` when validating. (defaults to `false`)
	 * @returns {boolean|string} Whether or not the data is valid.
	 */
	static validate(string, returnReason = false) {
		const json = JSON.parse(string); // Parse the data.

		/**
		 * When the string is invalid, we determine what we are going to return based on `returnReason`.
		 * @param {string} reason The reason why the string is invalid/.
		 * @returns {string|boolean} The proper return value based on `validate()`'s parameters.
		 */
		const handleReason = (reason) => (returnReason ? reason : false);

		// Confirm the main object has ONLY the valid keys.
		const validMainKeys = ["data", "style"];
		for (const key of Object.keys(json))
			if (!validMainKeys.includes(key))
				return handleReason(
					`"${key}" is an invalid JTF object key. Expected: ${arrayAsString(
						validMainKeys
					)}`
				);

		if (!json.hasOwnProperty("data"))
			return handleReason('Expected "data" key.');

		if (!json.hasOwnProperty("style"))
			return handleReason('Expected "style" key.');

		const { data, style } = json;

		/**
		 * Determine if an "array-like" object's keys are valid.
		 * @param {*} object The object to check.
		 * @param {string} objectName The name of the object for error messages.
		 * @returns {boolean|string} `true` if the array keys are valid, or a string containing the reason why they are invalid.
		 */
		const validArrKeys = (object, objectName = '"data" object') => {
			const invalidKeys = Object.keys(object)
				.map((key) => [key, +key]) // Convert and store the key as a number.
				.filter(([_, value]) => isNaN(value)); // Check if the stored number is valid.

			return invalidKeys.length === 0
				? true // Return true if there where no invalid keys.
				: `Invalid key${
						invalidKeys.length === 1 ? "" : "s"
				  } provided to ${objectName}: ${
						invalidKeys.length === 1
							? `"${invalidKeys[0][0]}"`
							: arrayAsString(invalidKeys.map(([key]) => key))
				  }.`; // Return what keys where invalid.
		};

		// Validate data object.
		const validKeys = validArrKeys(data, '"data" object'); // Check if data's keys are valid.
		if (validKeys !== true) return handleReason(validKeys);

		/**
		 * Determine if a columns cell values are valid.
		 * @param {*} cells The column object to check.
		 * @param {string} rowName The name of the row containing this column.
		 * @returns {boolean|string} `true` if the cell values are valid, or a string containing the reason why they are invalid.
		 */
		const validCells = (cells, rowName) => {
			for (const [column, data] of Object.entries(cells)) {
				const valid = JTF.validateCell(data);

				if (valid !== true)
					return `Invalid cell provided to column "${column}" in row "${rowName}": "${valid}".`;
			}

			return true;
		};

		// Validate each row's cells.
		for (const [row, cells] of Object.entries(data)) {
			const validKeys = validArrKeys(cells, `row "${row}"`); // Check if data's keys are valid.
			if (validKeys !== true) return handleReason(validKeys);

			const cellsValid = validCells(cells, row);
			if (cellsValid !== true) return handleReason(cellsValid);
		}

		// Valid style object.

		return true;
	}
}
