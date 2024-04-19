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
	 * **JTF methods that begin with "__" are intended for internal use only.**
	 *
	 * When the string is invalid, we determine what we are going to return based on `returnReason`.
	 * @param {string} reason The reason why the string is invalid/.
	 * @param {boolean} returnReason Whether or not to return the reason for data being invalid, rather than `false`.
	 * @returns {string|boolean} The proper return value based on `validate()`'s parameters.
	 */
	static __handleReason = (reason, returnReason) =>
		returnReason ? reason : false;

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

	/**
	 *
	 * @param {*} cell The cell to validate.
	 * @param {boolean} returnReason When true, if the value of the cell is invalid data, the reason why is returned as a string. This requires you to ensure the result strictly equals `true` when validating. (defaults to `false`)
	 * @returns {boolean|string} Whether or not the data is valid.
	 */
	static validateCell(cell, returnReason = false) {
		// Validate cell type.
		const validTypes = ["string", "number", "boolean", "null"];
		const cellType = cell === null ? "null" : typeof cell;
		if (!validTypes.includes(cellType))
			return JTF.__handleReason(
				`Invalid cell type "${typeof cell}" provided.`,
				returnReason
			);

		// Validate string content. Other content, like booleans and numbers, does not need to be validated.
		if (cellType === "string") {
			// Determine if cell is a formula or not.
			const isFormula = cell[0] === "=";
			if (isFormula) {
				// Validate formula.
			} else {
				// Validate static strings as HTML elements to ensure no bad HTML is passed through.
				const simulatedDOM = document.createElement("div");

				simulatedDOM.innerHTML = cell;

				if (simulatedDOM.children.length > 0)
					for (const child of simulatedDOM.children) {
						// Validate tag names.
						const validTags = [
							"A",
							"SPAN",
							"DIV",
							"B",
							"EM",
							"STRONG",
							"U",
							"SUP",
							"SUB",
							"BR",
						];

						if (!validTags.includes(child.tagName))
							return JTF.__handleReason(
								`Invalid tag name: '${child.tagName}'.`,
								returnReason
							);

						// Validate attributes.
						const attributes = child.getAttributeNames();
						const validAttributes = [
							"class",
							"id",
							"style",
							"href",
							"target",
							"rel",
						];

						for (const attribute of attributes)
							if (!validAttributes.includes(attribute))
								return JTF.__handleReason(
									`Disallowed HTML attribute provided: '${attribute}'.`,
									returnReason
								);
					}
			}
		}

		return true; // The cell has passed all checks and is valid.
	}

	/**
	 * Validate a string of JTF data.
	 * @param {string} string A string of JTF data.
	 * @param {boolean} returnReason When true, if the string is invalid data, the reason why is returned as a string. This requires you to ensure the result strictly equals `true` when validating. (defaults to `false`)
	 * @returns {boolean|string} Whether or not the data is valid.
	 */
	static validate(string, returnReason = false) {
		if (typeof string !== "string") throw new Error();

		const json = JSON.parse(string); // Parse the data.

		// Confirm the main object has ONLY the valid keys.
		const validMainKeys = ["data", "style"];
		for (const key of Object.keys(json))
			if (!validMainKeys.includes(key))
				return JTF.__handleReason(
					`"${key}" is an invalid JTF object key. Expected: ${arrayAsString(
						validMainKeys
					)}`,
					returnReason
				);

		if (!json.hasOwnProperty("data"))
			return JTF.__handleReason('Expected "data" key.', returnReason);

		if (!json.hasOwnProperty("style"))
			return JTF.__handleReason('Expected "style" key.', returnReason);

		const { data, style } = json;

		/**
		 * Determine if an "array-like" object's keys are valid.
		 * @param {*} object The object to check.
		 * @param {string} objectName The name of the object for error messages.
		 * @returns {boolean|string} `true` if the array keys are valid, or a string containing the reason why they are invalid.
		 */
		const validArrKeys = (object, objectName = '"data" object') => {
			const keys = Object.keys(object);

			const invalidKeys = keys
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

		if (validKeys !== true)
			return JTF.__handleReason(validKeys, returnReason);

		/**
		 * Determine if a columns cell values are valid.
		 * @param {*} cells The column object to check.
		 * @param {string} rowName The name of the row containing this column.
		 * @returns {boolean|string} `true` if the cell values are valid, or a string containing the reason why they are invalid.
		 */
		const validCells = (cells, rowName) => {
			for (const [column, data] of Object.entries(cells)) {
				const valid = JTF.validateCell(data, true);

				if (valid !== true)
					return `Invalid cell provided to column "${column}" in row "${rowName}": "${valid}".`;
			}

			return true;
		};

		// Validate each row's cells.
		for (const [row, cells] of Object.entries(data)) {
			const validKeys = validArrKeys(cells, `row "${row}"`); // Check if data's keys are valid.
			if (validKeys !== true)
				return JTF.__handleReason(validKeys, returnReason);

			const cellsValid = validCells(cells, row);
			if (cellsValid !== true)
				return JTF.__handleReason(cellsValid, returnReason);
		}

		// Valid style object.

		return true;
	}
}
