import * as fs from "fs";
import * as path from "path";

const INPUT_PATH = path.join("src", "data", "websites.csv");
const OUTPUT_PATH = path.join("src", "data", "websites.json");

async function csvToJson() {
  try {
    const csvData = await fs.promises.readFile(INPUT_PATH, "utf-8");
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");

    const result = lines
      .slice(1)
      .map((line) => {
        if (!line.trim()) return null; // Skip empty lines
        const values = line.split(",");
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() ?? "";
          return obj;
        }, {});
      })
      .filter(Boolean);

    await fs.promises.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await fs.promises.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2));

    console.log(`Successfully converted CSV to JSON at ${OUTPUT_PATH}`);
  } catch (error) {
    console.error("Error converting CSV to JSON:", error);
    process.exit(1);
  }
}

csvToJson();
