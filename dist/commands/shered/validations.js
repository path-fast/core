"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePathExists = validatePathExists;
exports.checkIfExistsInJson = checkIfExistsInJson;
exports.adjustPath = adjustPath;
const fs_1 = __importDefault(require("fs"));
function validatePathExists(projectPath) {
    if (!fs_1.default.existsSync(projectPath)) {
        console.error(`Error: The path "${projectPath}" does not exist.`);
        return false;
    }
    return true;
}
function checkIfExistsInJson(data, absolutePath, command) {
    const existingEntry = data.find((entry) => entry.path === absolutePath || entry.command === command);
    if (existingEntry) {
        console.error(`Error: The command "${command}" or the path "${absolutePath}" already exists in the registry.`);
        return true;
    }
    return false;
}
function adjustPath(projectPath) {
    if (projectPath.startsWith("/")) {
        console.warn('Relative paths should not start with "/". Adjusting automatically.');
        projectPath = projectPath.slice(1);
    }
    return projectPath;
}
