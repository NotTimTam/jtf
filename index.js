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

		const validArrKeys = (object) => {
			const invalidKeys = Object.keys(data)
				.map((key) => [key, +key]) // Convert and store the key as a number.
				.filter(([_, value]) => isNaN(value)); // Check if the stored number is valid.

			return invalidKeys.length === 0
				? true // Return true if there where no invalid keys.
				: `Invalid key${
						invalidKeys.length === 1 ? "" : "s"
				  } provided to "data" object: ${
						invalidKeys.length === 1
							? `"${invalidKeys[0][0]}"`
							: arrayAsString(invalidKeys.map(([key]) => key))
				  }`; // Return what keys where invalid.
		};

		// Validate data object.
		const validKeys = validArrKeys(data); // Check if data's keys are valid.
		if (validKeys !== true) return handleReason(validKeys);

		// Validate

		// Valid style object.

		return true;
	}
}
