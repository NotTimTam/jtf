import JTF from "./JTF.js";
import { isValidIndex } from "../util/data.js";
import Document from "./Document.js";

/**
 * A JTF Table.
 */
export default class Table {
	/**
	 * @param {Document} document This table's parent document
	 * @param {object} index The table's index in the document..
	 */
	constructor(document, index) {
		if (!isValidIndex(index))
			throw new Error(
				`Provided index value "${index}" is not a valid integer string.`
			);

		this.document = document;
		this.index = index;
	}

	/**
	 * Get the source data for this table.
	 */
	get source() {
		return this.document.source.data[this.index];
	}

	/**
	 * Set the source data for this table.
	 */
	set source(value) {
		this.document.source.data[this.index] = value;
	}

	/**
	 * Get the table's label.
	 */
	get label() {
		return this.source.label;
	}

	/**
	 * Set the table's label.
	 */
	set label(value) {
		if (!value || typeof value !== "string")
			throw new SyntaxError(
				'Each table in the document must have a "label" string value.'
			);

		this.source.label = value;
	}

	/**
	 * Convert a table into a 2D array.
	 * @returns {string} The table as a 2D array.
	 */
	toArray() {
		const {
			source: { data },
		} = this;

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
	toCSV() {
		const table = this.toArray();

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
	 * @param {string|number} x The x-coordinate of the cell.
	 * @param {string|number} y The y-coordinate of the cell.
	 * @returns {string|number|boolean|null} The content of the cell or `undefined` if the cell does not exist.
	 */
	getCell(x, y) {
		if (!isValidIndex(x))
			throw new Error(
				`Provided x-coordinate value "${x}" is not a valid integer string.`
			);

		if (!isValidIndex(y))
			throw new Error(
				`Provided y-coordinate value "${y}" is not a valid integer string.`
			);

		x = x.toString();
		y = y.toString();

		const {
			source: { data },
		} = this;

		return data[y] && data[y][x];
	}

	/**
	 * Set the content of a cell.
	 * @param {string|number} x The x-coordinate of the cell.
	 * @param {string|number} y The y-coordinate of the cell.
	 * @param {string|number|null|boolean} value The value to set.
	 */
	setCell(x, y, value) {
		JTF.validateCell(value);

		if (!isValidIndex(x))
			throw new Error(
				`Provided x-coordinate value "${x}" is not a valid integer string.`
			);

		if (!isValidIndex(y))
			throw new Error(
				`Provided y-coordinate value "${y}" is not a valid integer string.`
			);

		x = x.toString();
		y = y.toString();

		const {
			source: { data },
		} = this;

		if (!data[y]) data[y] = {};

		data[y][x] = value;

		this.document.updateUpdatedAt();
	}

	/**
	 * Get the styles that must be applied to a cell.
	 * @param {string|number} x The x-coordinate of the cell.
	 * @param {string|number} y The y-coordinate of the cell.
	 * @returns {Object<*>} An object containing the classes and styles to apply to this cell.
	 */
	getCellStyles(x, y) {
		if (!isValidIndex(x))
			throw new Error(
				`Provided x-coordinate value "${x}" is not a valid integer string.`
			);

		if (!isValidIndex(y))
			throw new Error(
				`Provided y-coordinate value "${y}" is not a valid integer string.`
			);

		const stylesToCheck = [
			...(this.document.source.style || []),
			...(this.source.style || []),
		];

		const styles = {
			style: [],
			class: [],
		};

		for (const definition of stylesToCheck) {
			const { target, type, data } = definition;

			if (JTF.targetArrayIncludesCell(target, x, y)) {
				if (type === "class") styles.class.push(data.trim());
				else if (type === "style") styles.style.push(data.trim());
			}
		}

		styles.class = styles.class.join(" ");
		styles.style = styles.style
			.map((style) =>
				style[style.length - 1] === ";" ? style : `${style};`
			)
			.join(" ");

		return styles;
	}
}
