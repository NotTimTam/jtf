import JTF from "./JTF.js";
import { isValidIndex } from "../util/data.js";
import Table from "./Table.js";

/**
 * A JTF Document.
 */
export default class Document {
	/**
	 * @param {object} data The document's data.
	 */
	constructor(data) {
		JTF.validate(data); // Validate the data before object creation.

		this.source = data;

		if (!this.source.createdAt)
			this.source.createdAt = new Date().toISOString();
		if (!this.source.updatedAt)
			this.source.updatedAt = new Date().toISOString();

		if (!this.source.metadata) this.source.metadata = {};
		if (!this.source.metadata.jtf) this.source.metadata.jtf = "v1.1.18";

		this.tables = Object.fromEntries(
			Object.entries(this.source.data).map(([index, table]) => [
				index,
				new Table(table, this),
			])
		);
	}

	/**
	 * @returns {string} The data object represented by a JTF string.
	 */
	stringify() {
		const { data } = this.source;
		return JSON.stringify(data);
	}

	/**
	 * Get arrays of each table in the document.
	 */
	toArray() {
		return Object.fromEntries(
			Object.entries(this.tables).map(([index, table]) => [
				index,
				table.toArray(),
			])
		);
	}

	/**
	 * Get csv strings of each table in the document.
	 */
	toCSV() {
		return Object.fromEntries(
			Object.entries(this.tables).map(([index, table]) => [
				index,
				table.toCSV(),
			])
		);
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

		if (!this.tables[table])
			throw new Error(`No table in document at index "${table}"`);

		return this.tables[table].getCell(x, y);
	}

	/**
	 * Get the styles that must be applied to a cell.
	 * @param {number|string} table The index of the table to convert.
	 * @param {string|number} x The x-coordinate of the cell.
	 * @param {string|number} y The y-coordinate of the cell.
	 * @returns {Object<*>} An object containing the classes and styles to apply to this cell.
	 */
	getCellStyles(table, x, y) {
		if (!isValidIndex(table))
			throw new Error(
				`Provided "table" value "${table}" is not a valid integer.`
			);

		if (!this.tables[table])
			throw new Error(`No table in document at index "${table}"`);

		return this.tables[table].getCellStyles(x, y);
	}
}
