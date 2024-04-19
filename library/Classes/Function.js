import { isOnlyCapitals } from "../util/data.js";

/**
 * A parameter definition for functions.
 */
export class FunctionParameter {
	/**
	 * @param {string} name The display name of the parameter.
	 * @param {string} type The type requirement for the parameter. Leave nullish for no type restriction.
	 * @param {string} description The (*optional*) Description of this parameter.
	 */
	constructor(name, type, description) {
		const typeEnum = [
			"string",
			"number",
			"undefined",
			"object",
			"boolean",
			"bigint",
			"symbol",
			"function",
		];

		if (!name || typeof name !== "string")
			throw new Error(
				"Invalid name provided to FunctionConfig constructor."
			);
		if (!description || typeof description !== "string")
			throw new Error(
				"Invalid description provided to FunctionConfig constructor."
			);

		type = type.trim().toLowerCase();
		if (!type || !typeEnum.includes(type))
			throw new Error(
				`Invalid type provided to FunctionParameter constructor. Expected one of: ${typeEnum}`
			);

		this.name = name.trim();

		this.type = type;
		this.description = description.trim();
	}
}

/**
 * A configuration object for the Function constructor.
 */
export class FunctionConfig {
	/**
	 *
	 * @param {Array<FunctionParameter>} parameters An array of (*optional*) function parameters.
	 * @param {string} category The (*optional*) function category.
	 * @param {string} description The (*optional*) function description.
	 */
	constructor(
		parameters,
		category = "uncategorized",
		description = "No description given."
	) {
		for (const parameter of parameters)
			if (!(parameter instanceof FunctionParameter))
				throw new Error(
					'Parameter provided to FunctionConfig constructor not of type "FunctionParameter".'
				);

		if (!category || typeof category !== "string")
			throw new Error(
				"Invalid category provided to FunctionConfig constructor."
			);

		if (!description || typeof description !== "string")
			throw new Error(
				"Invalid description provided to FunctionConfig constructor."
			);

		this.parameters = parameters;

		this.category = category.trim();

		this.description = description.trim();
	}
}

/**
 * An executable function that runs as part of a formula.
 */
export default class Function {
	/**
	 * @param {string} name The name of the formula. Must be all caps and letters only.
	 * @param {function} callback The callback function to run when this function is executed.
	 * @param {FunctionConfig} config The configuration object for this Function.
	 */
	constructor(name, callback, config) {
		if (!name) throw new Error("No name provided to Function constructor.");

		if (!isOnlyCapitals(name))
			throw new Error(
				`Name provided to Function constructor, "${name}" is not valid. Names must be all caps and only characters A-Z.`
			);
		if (typeof callback !== "function")
			throw new Error(
				'Callback value provided to Function constructor is not of type "function".'
			);
		if (!config)
			throw new Error(
				"No config object provided to Function constructor."
			);
		if (!(config instanceof FunctionConfig))
			throw new Error(
				'Config object provided to function constructor is not an instance of "FunctionConfig".'
			);

		this.name = name.trim();

		this.callback = callback;

		// Destructure the config object into the function.
		for (const [key, value] of Object.entries(config)) this[key] = value;
	}
}
