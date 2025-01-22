"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPaths = listPaths;
exports.deletePath = deletePath;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
// Caminho do arquivo JSON
const filePath = path_1.default.resolve(__dirname, '../../paths.json');
// Função para ler o arquivo JSON e retornar os dados
function readJsonFile() {
    if (fs_1.default.existsSync(filePath)) {
        return JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    }
    return [];
}
// Função para escrever os dados no arquivo JSON
function writeToJsonFile(data) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Operation completed successfully!');
}
// Comando de listar os itens
function listPaths() {
    const data = readJsonFile();
    if (data.length === 0) {
        console.log('No paths found.');
        return;
    }
    console.log('List of paths:');
    data.forEach((entry, index) => {
        console.log(`${index + 1}. Command: ${entry.command}, Path: ${entry.path}, Additional: ${entry.additional.join(', ')}`);
    });
}
// Comando de deletar um item
async function deletePath(command) {
    const data = readJsonFile();
    const entryIndex = data.findIndex(entry => entry.command === command);
    if (entryIndex === -1) {
        console.error(`Error: No entry found for the command "${command}".`);
        return;
    }
    // Pergunta de confirmação antes de deletar
    const confirmation = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirmDelete',
            message: `Are you sure you want to delete the command "${command}"?`,
            default: false,
        },
    ]);
    if (confirmation.confirmDelete) {
        // Remove o item do array
        data.splice(entryIndex, 1);
        // Escreve novamente no arquivo JSON
        writeToJsonFile(data);
        console.log(`Successfully deleted the command "${command}".`);
    }
    else {
        console.log('Deletion canceled.');
    }
}
