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

		this.__cleanMetadata();
		this.__cleanDates();
	}

	/**
	 * Update the `updatedAt` value of the document.
	 */
	updateUpdatedAt() {
		if (!this.source.updatedAt)
			this.source.updatedAt = new Date().toISOString();
	}

	/**
	 * Clean up the document's `createdAt`/`updatedAt` dates.
	 */
	__cleanDates() {
		if (!this.source.createdAt)
			this.source.createdAt = new Date().toISOString();

		this.updateUpdatedAt();
	}

	/**
	 * Clean up the document's metadata.
	 */
	__cleanMetadata() {
		if (!this.source.metadata) this.source.metadata = {};
		if (!this.source.metadata.jtf) this.source.metadata.jtf = "v1.1.9";
	}

	get tables() {
		return Object.fromEntries(
			Object.keys(this.source.data).map((index) => [
				index,
				new Table(this, index),
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
				`Provided "table" value "${table}" is not a valid integer string.`
			);

		if (!this.tables[table])
			throw new Error(`No table in document at index "${table}"`);

		return this.tables[table].getCell(x, y);
	}

	/**
	 * Set the content of a cell.
	 * @param {number|string} table The index of the table to convert.
	 * @param {string|number} x The x-coordinate of the cell.
	 * @param {string|number} y The y-coordinate of the cell.
	 * @param {string|number|null|boolean} value The value to set.
	 */
	setCell(table, x, y, value) {
		if (!isValidIndex(table))
			throw new Error(
				`Provided "table" value "${table}" is not a valid integer string.`
			);

		if (!this.tables[table])
			throw new Error(`No table in document at index "${table}"`);

		this.tables[table].setCell(x, y, value);

		this.document.updateUpdatedAt();
	}

	/**
	 * Set a table to a value. **Will overwrite existing tables.**
	 * @param {number|string} index The index of the table to set.
	 * @param {*} data The table data to set.
	 */
	setTable(index, data) {
		if (!isValidIndex(index))
			throw new Error(
				`Provided "index" value "${index}" is not a valid integer string.`
			);

		JTF.validateTable(data);

		this.source.data[index] = data;
	}

	/**
	 * Get a processor's data from the document's `metadata.extra` object.
	 * @param {string} processor The processor's unique ID.
	 * @returns {object|undefined} Returns a data object if found, or `undefined` if no object was found.
	 */
	getExtraProcessorData(processor) {
		return (
			this.source.metadata.extra && this.source.metadata.extra[processor]
		);
	}

	/**
	 * Set extra data in the document's `metadata.extra` object for use in processor feature extension.
	 * @param {string} processor The processor's unique identifier.
	 * @param {object} data An object of extra data to set.
	 * @param {boolean} extend If `true`, destructures the new data object into existing data instead of overwriting it. (default `false`)
	 */
	setExtraProcessorData(processor, data, extend = false) {
		const existingData = this.getExtraProcessorData(processor);

		if (extend && existingData) data = { ...existingData, ...data }; // Destructure into existing data.

		this.source.metadata.extra[processor] = data;
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
				`Provided "table" value "${table}" is not a valid integer string.`
			);

		if (!this.tables[table])
			throw new Error(`No table in document at index "${table}"`);

		return this.tables[table].getCellStyles(x, y);
	}
}
