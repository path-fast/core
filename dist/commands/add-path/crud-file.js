"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToJsonFile = writeToJsonFile;
exports.readJsonFile = readJsonFile;
exports.adjustPath = adjustPath;
exports.checkIfExistsInJson = checkIfExistsInJson;
exports.validatePathExists = validatePathExists;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Caminho do arquivo JSON
const filePath = path_1.default.resolve(__dirname, "../../paths.json");
// Função para validar se o caminho existe
function validatePathExists(projectPath) {
    if (!fs_1.default.existsSync(projectPath)) {
        console.error(`Error: The path "${projectPath}" does not exist.`);
        return false;
    }
    return true;
}
// Função para verificar se o comando ou caminho já existem
function checkIfExistsInJson(data, absolutePath, command) {
    const existingEntry = data.find((entry) => entry.path === absolutePath || entry.command === command);
    if (existingEntry) {
        console.error(`Error: The command "${command}" or the path "${absolutePath}" already exists in the registry.`);
        return true;
    }
    return false;
}
// Função para ajustar o caminho, caso necessário
function adjustPath(projectPath) {
    if (projectPath.startsWith("/")) {
        console.warn('Relative paths should not start with "/". Adjusting automatically.');
        projectPath = projectPath.slice(1);
    }
    return projectPath;
}
// Função para ler o arquivo JSON e retornar os dados
function readJsonFile() {
    if (fs_1.default.existsSync(filePath)) {
        return JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
    }
    return [];
}
// Função para escrever os dados no arquivo JSON
function writeToJsonFile(data) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("Path added successfully!");
}
function deleteCommand() {
}
