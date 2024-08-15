import {
	arrayAsString,
	isPlainObject,
	isValidVersionNumber,
} from "./util/data.js";

/**
 * JTF document processing utility.
 */
export default class JTF {
	static supportedVersions = ["v1.1.4"];

	constructor() {}

	/**
	 * Validate a JTF document's data object.
	 * @param {object} data The data object to validate.
	 */
	static __validateData(data) {
		if (!data)
			throw new SyntaxError("No data object provided to document.");

		if (!isPlainObject(data))
			throw new SyntaxError(
				`Expected a plain object but recieved a value of type ${
					data instanceof Array ? '"array"' : `"${typeof data}"`
				}.`
			);
	}

	/**
	 * Validate a JTF document's metadata object.
	 * @param {object} metadata The metadata object to validate.
	 */
	static __validateMetaData(metadata) {
		if (!isPlainObject(metadata))
			throw new SyntaxError(
				`Expected a plain object but recieved a value of type ${
					metadata instanceof Array
						? '"array"'
						: `"${typeof metadata}"`
				}.`
			);

		const { author, title, jtf, css } = metadata;

		if (author && typeof author !== "string")
			throw new SyntaxError(
				`Expected type "string" for metadata "author" parameter. Got: "${typeof author}".`
			);

		if (title && typeof title !== "string")
			throw new SyntaxError(
				`Expected type "string" for metadata "title" parameter. Got: "${typeof title}".`
			);

		if (jtf) {
			if (typeof jtf !== "string")
				throw new SyntaxError(
					`Expected type "string" for metadata "jtf" parameter. Got: "${typeof jtf}".`
				);

			if (!isValidVersionNumber(jtf))
				throw new Error(
					`"jtf" parameter not in valid format. Expected format "v0.0.0", got: "${jtf}".`
				);

			if (!JTF.supportedVersions.includes(jtf))
				throw new Error(
					`Document indicated JTF syntax standard version "${jtf}" is not supported. Supported versions: ${arrayAsString(
						JTF.supportedVersions
					)}`
				);
		} else {
			console.warn(
				`A JTF syntax standard version was not provided in metadata. Document compatibility unknown. To stop this message from appearing, configure a "jtf" version number in document metadata:`,
				{ jtf: JTF.supportedVersions[0] }
			);
		}

		if (css) {
			if (css instanceof Array) {
				for (const path of css)
					if (typeof path !== "string")
						throw new Error(
							`Invalid CSS configuration provided to document metadata. CSS array should contain only strings.`
						);
			} else if (typeof css !== "string")
				throw new Error(
					"Invalid CSS configuration provided to document metadata. Should be a single string, or an array of strings containing CSS data."
				);
		}
	}

	/**
	 * Validate a JTF style array.
	 * @param {Array<object>} style The style array to validate.
	 */
	static validateStyle(style) {
		if (!style)
			throw new SyntaxError("No style array provided to document.");

		if (!(style instanceof Array))
			throw new SyntaxError(
				`Expected an array but recieved a value of type "${typeof style}".`
			);
	}

	/**
	 * Validate a JTF document.
	 * @param {object} document The document to validate.
	 */
	static validate(document) {
		if (!document) throw new SyntaxError("No data provided.");
		if (!isPlainObject(document))
			throw new SyntaxError(
				`Expected a plain object but recieved a value of type ${
					document instanceof Array
						? '"array"'
						: `"${typeof document}"`
				}.`
			);

		const { data, metadata, style, createdAt, updatedAt } = document;

		// Validate data object.
		JTF.__validateData(data);
		JTF.validateStyle(style);

		if (metadata) this.__validateMetaData(metadata);

		if (createdAt) {
			if (typeof createdAt !== "string")
				throw new SyntaxError(
					`"createdAt" parameter expected to be of type string. Got "${typeof createdAt}"`
				);

			if (isNaN(new Date(Date.parse(createdAt))))
				throw new SyntaxError(
					`Invalid date string provided to "createdAt" parameter. An ISO 8601 conforming date string is required. https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format`
				);
		}

		if (updatedAt) {
			if (typeof updatedAt !== "string")
				throw new SyntaxError(
					`"updatedAt" parameter expected to be of type string. Got "${typeof updatedAt}"`
				);

			if (isNaN(new Date(Date.parse(updatedAt))))
				throw new SyntaxError(
					`Invalid date string provided to "updatedAt" parameter. An ISO 8601 conforming date string is required. https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format`
				);
		}
	}

	/**
	 * Parse JTF data into a readable object.
	 * @param {string|object} data The data to parse.
	 */
	static parse(data) {
		if (typeof data === "string") data = JSON.parse(data); // Convert the data into a JavaScript object.

		JTF.validate(data);

		return data;
	}
}

// import { arrayAsString } from "./util/data.js";

// /**
//  * An object containing several methods for interacting with JTF data.
//  *
//  * Initialize with `new JTF()`.
//  */
// export default class JTF {
// 	constructor() {}

// 	/**
// 	 * **JTF methods that begin with "__" are intended for internal use only.**
// 	 *
// 	 * When the string is invalid, we determine what we are going to return based on `returnReason`.
// 	 * @param {string} reason The reason why the string is invalid/.
// 	 * @param {boolean} returnReason Whether or not to return the reason for data being invalid, rather than `false`.
// 	 * @returns {string|boolean} The proper return value based on `validate()`'s parameters.
// 	 */
// 	static __handleReason = (reason, returnReason) =>
// 		returnReason ? reason : false;

// 	/**
// 	 * Parse a string of JTF data and convert it into an object.
// 	 * @param {string} string A string of JTF data to parse.
// 	 * @returns {*} A parsed data object.
// 	 */
// 	static parse(string) {
// 		return JSON.parse(string);
// 	}

// 	/**
// 	 * Stringify a JTF data object.
// 	 * @param {*} data A JTF data object.
// 	 */
// 	static stringify(data) {
// 		return JSON.stringify(data);
// 	}

// 	/**
// 	 * Convert a column's index number to a letter.
// 	 * @param {number} number The number to convert.
// 	 * @returns {string} The column's letter.
// 	 */
// 	static columnLetter(number) {
// 		if (isNaN(+number))
// 			throw new Error(`Invalid number (${number}) provided.`);

// 		number = +number;

// 		let column = "";

// 		while (number > 0) {
// 			let remainder = (number - 1) % 26;
// 			column = String.fromCharCode(65 + remainder) + column;
// 			number = Math.floor((number - 1) / 26);
// 		}

// 		return column;
// 	}

// 	/**
// 	 *
// 	 * @param {*} cell The cell to validate.
// 	 * @param {boolean} returnReason When true, if the value of the cell is invalid data, the reason why is returned as a string. This requires you to ensure the result strictly equals `true` when validating. (defaults to `false`)
// 	 * @returns {boolean|string} Whether or not the data is valid.
// 	 */
// 	static validateCell(cell, returnReason = false) {
// 		// Validate cell type.
// 		const validTypes = ["string", "number", "boolean", "null"];
// 		const cellType = cell === null ? "null" : typeof cell;
// 		if (!validTypes.includes(cellType))
// 			return JTF.__handleReason(
// 				`Invalid cell type "${typeof cell}" provided.`,
// 				returnReason
// 			);

// 		// Validate string content. Other content, like booleans and numbers, does not need to be validated.
// 		if (cellType === "string") {
// 			// Determine if cell is a formula or not.
// 			const isFormula = cell[0] === "=";
// 			if (isFormula) {
// 				// Validate formula.
// 			} else {
// 				// Validate static strings as HTML elements to ensure no bad HTML is passed through.
// 				const simulatedDOM = document.createElement("div");

// 				simulatedDOM.innerHTML = cell;

// 				if (simulatedDOM.children.length > 0)
// 					for (const child of simulatedDOM.children) {
// 						// Validate tag names.
// 						const validTags = [
// 							"A",
// 							"SPAN",
// 							"DIV",
// 							"B",
// 							"EM",
// 							"STRONG",
// 							"U",
// 							"SUP",
// 							"SUB",
// 							"BR",
// 						];

// 						if (!validTags.includes(child.tagName))
// 							return JTF.__handleReason(
// 								`Invalid tag name: '${child.tagName}'.`,
// 								returnReason
// 							);

// 						// Validate attributes.
// 						const attributes = child.getAttributeNames();
// 						const validAttributes = [
// 							"class",
// 							"id",
// 							"style",
// 							"href",
// 							"target",
// 							"rel",
// 						];

// 						for (const attribute of attributes)
// 							if (!validAttributes.includes(attribute))
// 								return JTF.__handleReason(
// 									`Disallowed HTML attribute provided: '${attribute}'.`,
// 									returnReason
// 								);
// 					}
// 			}
// 		}

// 		return true; // The cell has passed all checks and is valid.
// 	}

// 	/**
// 	 * Validate a string of JTF data.
// 	 * @param {string} string A string of JTF data.
// 	 * @param {boolean} returnReason When true, if the string is invalid data, the reason why is returned as a string. This requires you to ensure the result strictly equals `true` when validating. (defaults to `false`)
// 	 * @returns {boolean|string} Whether or not the data is valid.
// 	 */
// 	static validate(string, returnReason = false) {
// 		if (typeof string !== "string") throw new Error();

// 		const json = JSON.parse(string); // Parse the data.

// 		// Confirm the main object has ONLY the valid keys.
// 		const validMainKeys = ["data", "style"];
// 		for (const key of Object.keys(json))
// 			if (!validMainKeys.includes(key))
// 				return JTF.__handleReason(
// 					`"${key}" is an invalid JTF object key. Expected: ${arrayAsString(
// 						validMainKeys
// 					)}`,
// 					returnReason
// 				);

// 		if (!json.hasOwnProperty("data"))
// 			return JTF.__handleReason('Expected "data" key.', returnReason);

// 		if (!json.hasOwnProperty("style"))
// 			return JTF.__handleReason('Expected "style" key.', returnReason);

// 		const { data, style } = json;

// 		/**
// 		 * Determine if an "array-like" object's keys are valid.
// 		 * @param {*} object The object to check.
// 		 * @param {string} objectName The name of the object for error messages.
// 		 * @returns {boolean|string} `true` if the array keys are valid, or a string containing the reason why they are invalid.
// 		 */
// 		const validArrKeys = (object, objectName = '"data" object') => {
// 			const keys = Object.keys(object);

// 			const invalidKeys = keys
// 				.map((key) => [key, +key]) // Convert and store the key as a number.
// 				.filter(([_, value]) => isNaN(value)); // Check if the stored number is valid.

// 			return invalidKeys.length === 0
// 				? true // Return true if there where no invalid keys.
// 				: `Invalid key${
// 						invalidKeys.length === 1 ? "" : "s"
// 				  } provided to ${objectName}: ${
// 						invalidKeys.length === 1
// 							? `"${invalidKeys[0][0]}"`
// 							: arrayAsString(invalidKeys.map(([key]) => key))
// 				  }.`; // Return what keys where invalid.
// 		};

// 		// Validate data object.
// 		const validKeys = validArrKeys(data, '"data" object'); // Check if data's keys are valid.

// 		if (validKeys !== true)
// 			return JTF.__handleReason(validKeys, returnReason);

// 		/**
// 		 * Determine if a columns cell values are valid.
// 		 * @param {*} cells The column object to check.
// 		 * @param {string} rowName The name of the row containing this column.
// 		 * @returns {boolean|string} `true` if the cell values are valid, or a string containing the reason why they are invalid.
// 		 */
// 		const validCells = (cells, rowName) => {
// 			for (const [column, data] of Object.entries(cells)) {
// 				const valid = JTF.validateCell(data, true);

// 				if (valid !== true)
// 					return `Invalid cell provided to column "${column}" in row "${rowName}": "${valid}".`;
// 			}

// 			return true;
// 		};

// 		// Validate each row's cells.
// 		for (const [row, cells] of Object.entries(data)) {
// 			const validKeys = validArrKeys(cells, `row "${row}"`); // Check if data's keys are valid.
// 			if (validKeys !== true)
// 				return JTF.__handleReason(validKeys, returnReason);

// 			const cellsValid = validCells(cells, row);
// 			if (cellsValid !== true)
// 				return JTF.__handleReason(cellsValid, returnReason);
// 		}

// 		// Valid style object.

// 		return true;
// 	}
// }
