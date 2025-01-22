"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPath = editPath;
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const jsonpath_1 = require("../shered/jsonpath");
function loadPaths() {
    if (!fs_1.default.existsSync(jsonpath_1.filePath)) {
        return [];
    }
    return JSON.parse(fs_1.default.readFileSync(jsonpath_1.filePath, 'utf-8'));
}
function savePaths(data) {
    fs_1.default.writeFileSync(jsonpath_1.filePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function editPath(input) {
    const data = loadPaths();
    // Identifica o item com base no índice ou comando
    const target = isNaN(Number(input))
        ? data.find((entry) => entry.command === input)
        : data[Number(input)];
    if (!target) {
        console.error(`Error: No entry found for "${input}".`);
        return;
    }
    let editing = true;
    while (editing) {
        // Menu interativo com as opções de edição
        const { action } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to edit?',
                choices: ['Path', 'Command', 'Additional', 'Save & Exit', 'Cancel'],
            },
        ]);
        switch (action) {
            case 'Path': {
                const { newPath } = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'newPath',
                        message: `Current Path: ${target.path}\nEnter new path (leave blank to keep current):`,
                    },
                ]);
                if (newPath)
                    target.path = newPath;
                break;
            }
            case 'Command': {
                const { newCommand } = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'newCommand',
                        message: `Current Command: ${target.command}\nEnter new command (leave blank to keep current):`,
                    },
                ]);
                if (newCommand)
                    target.command = newCommand;
                break;
            }
            case 'Additional': {
                console.log(`Current Additional Commands: ${target.additional.join(', ')}`);
                const { newAdditional } = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'newAdditional',
                        message: 'Enter additional commands (comma-separated, leave blank to keep current):',
                    },
                ]);
                if (newAdditional) {
                    target.additional = newAdditional.split(',').map((cmd) => cmd.trim());
                }
                break;
            }
            case 'Save & Exit': {
                savePaths(data);
                console.log('Changes saved successfully!');
                editing = false;
                break;
            }
            case 'Cancel': {
                console.log('Edit canceled.');
                editing = false;
                break;
            }
        }
    }
}
