"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePath = deletePath;
const inquirer_1 = __importDefault(require("inquirer"));
const read_file_1 = require("../shered/read-file");
const creat_1 = require("./creat");
async function deletePath(command) {
    const data = (0, read_file_1.readJsonFile)();
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
        (0, creat_1.writeToJsonFile)(data);
        console.log(`Successfully deleted the command "${command}".`);
    }
    else {
        console.log('Deletion canceled.');
    }
}
