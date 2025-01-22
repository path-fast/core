import fs from "fs";
import { filePath } from "../utils/json-path";

export function writeToJsonFile(data: PathEntry[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log("Path added successfully!");
}
