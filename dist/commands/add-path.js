"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPath = addPath;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.resolve(__dirname, '../../paths.json');
function addPath(projectPath, command) {
    const absolutePath = projectPath === '.' ? process.cwd() : projectPath;
    let data = [];
    if (fs_1.default.existsSync(filePath)) {
        data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    }
    data.push({ path: absolutePath, command, additional: '' });
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Path added successfully! (${absolutePath} as ${command})`);
}
