import Function, {
	FunctionConfig,
	FunctionParameter,
} from "../Classes/Function.js";

const functions = [
	new Function(
		"TEXT",
		(value, format_text) => {
			return value.toString();
		},
		new FunctionConfig([
			new FunctionParameter(
				"value",
				"number",
				"Numeric value you want to convert to text."
			),
			new FunctionParameter(
				"format_text",
				"string",
				"The desired format."
			),
		])
	),
];

const functionsAsObject = Object.fromEntries(
	functions.map((func) => [func.name, func])
);

export default functionsAsObject;
