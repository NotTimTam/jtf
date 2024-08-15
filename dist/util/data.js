/**
 * Check if a value is a plain JavaScript object. (an object that is not an array)
 * @param {*} obj The value to check.
 * @returns {boolean} Whether the value is a plain object.
 */
export const isPlainObject = (obj) =>
	obj && typeof obj === "object" && !(obj instanceof Array);

/**
 * Check if a version number string is valid.
 * @param {string} ver The version text to check.
 * @returns {boolean} Whether or not the version text is valid.
 */
export const isValidVersionNumber = (ver) =>
	ver && typeof ver === "string" && /^v\d+(\.\d+)+$/.test(ver);

/**
 * Formats an array string for console display.
 * @param {Array<*>} array The array to convert.
 * @returns {string} A nicely formatted array string.
 */
export const arrayAsString = (array) =>
	`[${array
		.map((item) => (typeof item === "string" ? `"${item}"` : item))
		.join(", ")}]`;

// /**
//  * Check if a string is only capital letters.
//  * @param {string} string The string to check.
//  * @returns {boolean} Whether the string is all capital letters or not.
//  */
// export const isOnlyCapitals = (string) => {
// 	const regex = /^[A-Z]+$/;

// 	if (!regex.test(string)) return false;

// 	return true;
// };
