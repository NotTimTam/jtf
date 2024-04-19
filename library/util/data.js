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
