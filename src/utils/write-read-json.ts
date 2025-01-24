import fs from "fs";
import { filePath } from "./json-path";
import { PathEntry } from "../dto";


export function readJsonFile(): PathEntry[] {
  
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
}

export function writeToJsonFile(data: PathEntry[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log("Path added successfully!");
}
