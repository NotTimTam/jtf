import JTF from "./JTF.js";
import { isValidIndex } from "../util/data.js";
import Document from "./Document.js";

/**
 * A JTF Table.
 */
export default class Table {
	/**
	 * @param {object} data The table's data.
	 * @param {Document} document This table's parent document
	 */
	constructor(data, document) {
		JTF.validateTable(data); // Validate the data before object creation.

		this.source = data;
		this.document = document;
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
				`Provided x-coordinate value "${x}" is not a valid integer.`
			);

		if (!isValidIndex(y))
			throw new Error(
				`Provided y-coordinate value "${y}" is not a valid integer.`
			);

		x = x.toString();
		y = y.toString();

		const {
			source: { data },
		} = this;

		return data[y] && data[y][x];
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
				`Provided x-coordinate value "${x}" is not a valid integer.`
			);

		if (!isValidIndex(y))
			throw new Error(
				`Provided y-coordinate value "${y}" is not a valid integer.`
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
