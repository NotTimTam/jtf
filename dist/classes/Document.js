import JTF from "../index.js";
import { isValidIndex } from "../util/data.js";

/**
 * A JTF Document.
 */
export default class Document {
	/**
	 * @param {object} data The document's data.
	 */
	constructor(data) {
		JTF.validate(data); // Validate the data before object creation.

		for (const [key, value] of Object.entries(data)) this[key] = value; // Parse the data into the object.

		if (!this.createdAt) this.createdAt = new Date().toISOString();
		if (!this.updatedAt) this.updatedAt = new Date().toISOString();

		if (!this.metadata) this.metadata = {};
		if (!this.metadata.jtf) this.metadata.jtf = "v1.1.18";
	}

	/**
	 * @returns {string} The data object represented by a JTF string.
	 */
	stringify() {
		return JSON.stringify(this.data);
	}

	/**
	 * Convert a table into a 2D array.
	 * @param {number|string} table The index of the table to convert.
	 * @returns {string} The table as a 2D array.
	 */
	tableToArray(table = 0) {
		if (!isValidIndex(table))
			throw new Error(
				`Provided "table" value "${table}" is not a valid integer.`
			);

		table = table.toString();

		table = this.data[table];

		if (!table) throw new Error(`No table in document at index "${table}"`);

		const { data } = table;

		let array = [];

		for (const [y, row] of Object.entries(data)) {
			if (!array[y]) array[y] = [];

			for (const [x, cell] of Object.entries(row)) {
				array[y][x] = cell;
			}
		}

		return array;
	}

	/**
	 * @returns {string} The data object in CSV format.
	 */
	tableToCSV(table = 0) {
		table = this.tableToArray(table);

		// Determine the widest the CSV should be.
		let widestRow = 0;
		for (let y = 0; y < table.length; y++)
			if (table[y] && table[y].length > widestRow)
				widestRow = table[y].length;

		let csv = "";

		for (let y = 0; y < table.length; y++) {
			if (!table[y]) csv += ",".repeat(widestRow) + "\n";
			else {
				for (let x = 0; x < table[y].length; x++) {
					if (!table[y][x]) csv += ",";
					else csv += table[y][x] + ",";
				}
				if (y < table.length - 1) csv += "\n";
			}
		}

		return csv;
	}

	/**
	 * Get the content of a cell.
	 * @param {number|string} table The index of the table to convert.
	 * @param {string|number} x The x-coordinate of the cell.
	 * @param {string|number} y The y-coordinate of the cell.
	 * @returns {string|number|boolean|null} The content of the cell or `undefined` if the cell does not exist.
	 */
	getCell(table, x, y) {
		if (!isValidIndex(table))
			throw new Error(
				`Provided "table" value "${table}" is not a valid integer.`
			);

		if (!isValidIndex(x))
			throw new Error(
				`Provided x-coordinate value "${x}" is not a valid integer.`
			);

		if (!isValidIndex(y))
			throw new Error(
				`Provided y-coordinate value "${y}" is not a valid integer.`
			);

		x = x.toString();
		y = y.toString();
		table = table.toString();

		table = this.data[table];

		if (!table) throw new Error(`No table in document at index "${table}"`);

		const { data } = table;

		return data[y] && data[y][x];
	}
}
