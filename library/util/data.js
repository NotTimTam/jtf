/**
 * Check if a string is only capital letters.
 * @param {string} string The string to check.
 * @returns {boolean} Whether the string is all capital letters or not.
 */
export const isOnlyCapitals = (string) => {
	const regex = /^[A-Z]+$/;

	if (!regex.test(string)) return false;

	return true;
};

/**
 * Formats an array string for console display.
 * @param {Array<*>} array The array to convert.
 * @returns {string} A nicely formatted array string.
 */
export const arrayAsString = (array) =>
	`[${array
		.map((item) => (typeof item === "string" ? `"${item}"` : item))
		.join(", ")}]`;
