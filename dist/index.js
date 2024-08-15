import Document from "./classes/Document.js";
import {
	arrayAsString,
	isPlainObject,
	isValidIndex,
	isValidVersionNumber,
} from "./util/data.js";

/**
 * JTF document processing utility.
 */
export default class JTF {
	static supportedVersions = ["v1.1.8"];

	/**
	 * Validate the key indeces of an object.
	 * @param {Array<string>} keys The array of keys returned by `Object.keys(<object>)`
	 */
	static __validateKeys(keys) {
		if (!(keys instanceof Array))
			throw new SyntaxError(
				'Provided keys object is not of type "array".'
			);

		keys.forEach((key) => {
			if (!isValidIndex(key))
				throw new SyntaxError(
					`Each object key-index must be a string containing an integer. "${key}" is invalid.`
				);
		});
	}

	/**
	 * Validate the contents of a table's cell.
	 * @param {Object} cell The cell to validate.
	 */
	static validateCell(cell) {
		switch (typeof cell) {
			case "string":
			case "number":
			case "boolean":
				break;
			case "object":
				if (cell === null) break;
			case "undefined":
			case "bigint":
			case "symbol":
			case "function":
				throw new SyntaxError(
					`Cell data of invalid type provided. Must be one of: ["string", "number", "boolean", null]`
				);
		}
	}

	/**
	 * Validate a table's data object.
	 * @param {Object} data The data to validate.
	 */
	static __validateTableData(data) {
		// Validate keys.
		JTF.__validateKeys(Object.keys(data));

		// Validate cells.
		Object.values(data).forEach((cell) => JTF.validateCell(cell));
	}

	/**
	 * Validate a table within a JTF document's data object.
	 * @param {Object} table The table to validate.
	 */
	static __validateTable(table) {
		const { data, label, style } = table;

		// Validate label.
		if (!label || typeof label !== "string")
			throw new SyntaxError(
				'Each table in the document must have a "label" string value.'
			);

		// Validate data.
		if (!isPlainObject(data))
			throw new SyntaxError(
				`Expected a plain object but recieved a value of type ${
					data instanceof Array ? '"array"' : `"${typeof data}"`
				}.`
			);

		JTF.__validateKeys(Object.keys(data));
		Object.values(data).forEach((tableData) =>
			JTF.__validateTableData(tableData)
		);

		// Validate styles.
		if (style) JTF.validateStyle(style);
	}

	/**
	 * Validate a JTF document's data object.
	 * @param {object} data The data object to validate.
	 */
	static __validateData(data) {
		if (!data)
			throw new SyntaxError("No data object provided to document.");

		if (!isPlainObject(data))
			throw new SyntaxError(
				`Expected a plain object but recieved a value of type ${
					data instanceof Array ? '"array"' : `"${typeof data}"`
				}.`
			);

		// Validate the index keys of the object.
		JTF.__validateKeys(Object.keys(data));

		// Validate tables.
		const tables = Object.values(data);

		tables.forEach((table) => JTF.__validateTable(table));
	}

	/**
	 * Validate a JTF document's metadata object.
	 * @param {object} metadata The metadata object to validate.
	 */
	static __validateMetaData(metadata) {
		if (!isPlainObject(metadata))
			throw new SyntaxError(
				`Expected a plain object but recieved a value of type ${
					metadata instanceof Array
						? '"array"'
						: `"${typeof metadata}"`
				}.`
			);

		const validKeys = ["author", "title", "jtf", "extra", "css"];

		Object.keys(metadata).forEach((key) => {
			if (!validKeys.includes(key))
				throw new SyntaxError(
					`Invalid key "${key}" provided to metadata.`
				);
		});

		const { author, title, jtf, css, extra } = metadata;

		if (author && typeof author !== "string")
			throw new SyntaxError(
				`Expected type "string" for metadata "author" parameter. Got: "${typeof author}".`
			);

		if (title && typeof title !== "string")
			throw new SyntaxError(
				`Expected type "string" for metadata "title" parameter. Got: "${typeof title}".`
			);

		if (jtf) {
			if (typeof jtf !== "string")
				throw new SyntaxError(
					`Expected type "string" for metadata "jtf" parameter. Got: "${typeof jtf}".`
				);

			if (!isValidVersionNumber(jtf))
				throw new SyntaxError(
					`"jtf" parameter not in valid format. Expected format "v0.0.0", got: "${jtf}".`
				);

			if (!JTF.supportedVersions.includes(jtf))
				throw new SyntaxError(
					`Document indicated JTF syntax standard version "${jtf}" is not supported. Supported versions: ${arrayAsString(
						JTF.supportedVersions
					)}`
				);
		} else {
			console.warn(
				`A JTF syntax standard version was not provided in metadata. Document compatibility unknown. To stop this message from appearing, configure a "jtf" version number in document metadata:`,
				{ jtf: JTF.supportedVersions[0] }
			);
		}

		if (css) {
			if (css instanceof Array) {
				for (const path of css)
					if (typeof path !== "string")
						throw new SyntaxError(
							`Invalid CSS configuration provided to document metadata. CSS array should contain only strings.`
						);
			} else if (typeof css !== "string")
				throw new SyntaxError(
					"Invalid CSS configuration provided to document metadata. Should be a single string, or an array of strings containing CSS data."
				);
		}

		if (extra) {
			if (!(extra instanceof Array))
				throw new SyntaxError(
					'Invalid "extra" object provided to document metadata. Expected array.'
				);

			for (const processorData of extra) {
				if (!isPlainObject(processorData))
					throw new SyntaxError(
						`Invalid processor data provided to "extra" metadata configuration. Expected plain object but recieved a value of type ${
							processorData instanceof Array
								? '"array"'
								: `"${typeof processorData}"`
						}.`
					);

				const { processor } = processorData;

				if (!processor || typeof processor !== "string")
					throw new SyntaxError(
						`Invalid processor data provided to "extra" metadata configuration. Expected a "processor" key with a string value.`
					);
			}

			console.debug(
				`During parsing, extra data for ${extra.length} processor${
					extra.length === 1 ? "" : "s"
				} was detected within JTF document. No action is required.`
			);
		}
	}

	/**
	 * @param {Array<string|number>} targetingArray The targetting array to validate.
	 */
	static validateTargetingArray(targetingArray) {
		if (!(targetingArray instanceof Array))
			throw new SyntaxError(
				'Invalid targeting array provided. Proper format: "[x, y]".'
			);

		if (targetingArray.length > 2)
			throw new SyntaxError(
				'Targeting array provided too many parameters. Proper format: "[x, y]".'
			);

		if (targetingArray.length === 0) return;

		for (let parameter of targetingArray) {
			// Empty parameters are valid.
			if (parameter === null || !parameter) continue;

			// Integers are valid.
			if (typeof parameter === "number" && !Number.isInteger(parameter))
				throw new SyntaxError(
					`Invalid parameter "${parameter}" provided. Number parameters in targeting arrays must be integers.`
				);

			if (typeof parameter === "string") {
				parameter = parameter.trim();

				if (!/^[0-9:]+$/.test(parameter))
					throw new SyntaxError(
						`Invalid parameter "${parameter}" provided. String parameters must contain either an integer, or a colon-delimited target.`
					);

				// Validate colon delimited parameters.
				if (parameter.includes(":")) {
					const parts = parameter
						.split(":")
						.map((part) => part.trim());

					for (const part of parts) {
						if (part === "") continue;

						if (isNaN(+part) || !Number.isInteger(+part))
							throw new SyntaxError(
								`Invalid parameter "${part}" provided. Colon-delimited parameters can only use integers.`
							);
					}
				}

				// Integers that are stored in a string are valid.
				if (!isNaN(+parameter) && Number.isInteger(+parameter))
					continue;
			}
		}
	}

	/**
	 * Validate a JTF style array.
	 * @param {Array<object>} style The style array to validate.
	 */
	static validateStyle(style) {
		if (!style)
			throw new SyntaxError("No style array provided to document.");

		if (!(style instanceof Array))
			throw new SyntaxError(
				`Expected an array but recieved a value of type "${typeof style}".`
			);

		for (const definition of style) {
			const validKeys = ["type", "target", "data"];

			Object.keys(definition).forEach((key) => {
				if (!validKeys.includes(key))
					throw new SyntaxError(
						`Invalid key "${key}" provided to style definition.`
					);
			});

			const { type, target, data } = definition;

			// Validate the style definition's type.
			const typeEnum = ["class", "style"];

			if (!type || !typeEnum.includes(type))
				throw new SyntaxError(
					`Invalid style definition type provided. Must be one of: ${arrayAsString(
						typeEnum
					)}`
				);

			JTF.validateTargetingArray(target); // Validate the targeting array.

			if (!data || typeof data !== "string")
				throw new SyntaxError(
					`Style definition "data" value must be of type string.`
				);
		}
	}

	/**
	 * Validate a JTF document.
	 * @param {object} document The document to validate.
	 */
	static validate(document) {
		if (!document) throw new SyntaxError("No data provided.");
		if (!isPlainObject(document))
			throw new SyntaxError(
				`Expected a plain object but recieved a value of type ${
					document instanceof Array
						? '"array"'
						: `"${typeof document}"`
				}.`
			);

		const { data, metadata, style, createdAt, updatedAt } = document;

		const validKeys = [
			"data",
			"metadata",
			"style",
			"createdAt",
			"updatedAt",
		];

		Object.keys(document).forEach((key) => {
			if (!validKeys.includes(key))
				throw new SyntaxError(
					`Invalid key "${key}" provided to document.`
				);
		});

		// Validate data object.
		JTF.__validateData(data);
		JTF.validateStyle(style);

		if (metadata) this.__validateMetaData(metadata);

		if (createdAt) {
			if (typeof createdAt !== "string")
				throw new SyntaxError(
					`"createdAt" parameter expected to be of type string. Got "${typeof createdAt}"`
				);

			if (isNaN(new Date(Date.parse(createdAt))))
				throw new SyntaxError(
					`Invalid date string provided to "createdAt" parameter. An ISO 8601 conforming date string is required. https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format`
				);
		}

		if (updatedAt) {
			if (typeof updatedAt !== "string")
				throw new SyntaxError(
					`"updatedAt" parameter expected to be of type string. Got "${typeof updatedAt}"`
				);

			if (isNaN(new Date(Date.parse(updatedAt))))
				throw new SyntaxError(
					`Invalid date string provided to "updatedAt" parameter. An ISO 8601 conforming date string is required. https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format`
				);
		}
	}

	/**
	 * Parse JTF data into a readable object.
	 * @param {string|object} data The data to parse.
	 */
	static parse(data) {
		if (typeof data === "string") data = JSON.parse(data); // Convert the data into a JavaScript object.

		return new Document(data);
	}
}
