"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goPath = goPath;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const filePath = path_1.default.resolve(__dirname, '../../paths.json');
function goPath(command) {
    if (!fs_1.default.existsSync(filePath)) {
        console.error('Path file does not exist. Add a path first using add-path.');
        return;
    }
    const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    const entry = data.find(item => item.command === command);
    if (!entry) {
        console.error(`No path found for command "${command}"`);
        return;
    }
    const { path: targetPath } = entry;
    process.chdir(targetPath);
    (0, child_process_1.exec)('code .', (err) => {
        if (err) {
            console.error('Error opening VS Code:', err.message);
        }
        else {
            console.log(`Opened ${targetPath} in VS Code`);
        }
    });
}
