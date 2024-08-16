import JTF from "./index.js";
import fs from "fs";

try {
	const data = fs.readFileSync("./example.jtf", "utf-8");

	const document = JTF.parse(data);

	console.log("Test successful!");
} catch (err) {
	console.error(err);
}
