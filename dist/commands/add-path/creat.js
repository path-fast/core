"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToJsonFile = writeToJsonFile;
const fs_1 = __importDefault(require("fs"));
const jsonpath_1 = require("../shered/jsonpath");
function writeToJsonFile(data) {
    fs_1.default.writeFileSync(jsonpath_1.filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("Path added successfully!");
}
