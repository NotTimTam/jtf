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

/**
 * Check if an index value is valid.
 * @param {string|number} index The index value to check.
 */
export const isValidIndex = (index) => {
	if (isNaN(+index) || !Number.isInteger(+index)) return false;

	return true;
};
