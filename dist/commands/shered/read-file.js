"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonFile = readJsonFile;
const fs_1 = __importDefault(require("fs"));
const jsonpath_1 = require("./jsonpath");
function readJsonFile() {
    if (fs_1.default.existsSync(jsonpath_1.filePath)) {
        return JSON.parse(fs_1.default.readFileSync(jsonpath_1.filePath, "utf-8"));
    }
    return [];
}
