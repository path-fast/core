"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPaths = listPaths;
const path_1 = __importDefault(require("path"));
const read_file_1 = require("./shered/read-file");
// Caminho do arquivo JSON
const filePath = path_1.default.resolve(__dirname, '../../paths.json');
function listPaths() {
    const data = (0, read_file_1.readJsonFile)();
    if (data.length === 0) {
        console.log('No paths found.');
        return;
    }
    console.log('List of paths:');
    console.table(data);
}
