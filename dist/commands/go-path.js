"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goPath = goPath;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const jsonpath_1 = require("./shered/jsonpath");
function goPath(command, option) {
    if (!fs_1.default.existsSync(jsonpath_1.filePath)) {
        console.error('Path file does not exist. Add a path first using path-fast add <project-path> <your-command>');
        return;
    }
    const data = JSON.parse(fs_1.default.readFileSync(jsonpath_1.filePath, 'utf-8'));
    const entry = data.find(item => item.command === command);
    if (!entry) {
        console.error(`No path found for command "${command}"`);
        return;
    }
    const { path: targetPath } = entry;
    process.chdir(changeToHomeAndTarget(targetPath));
    (0, child_process_1.exec)('code .', { cwd: targetPath }, (err) => {
        if (err) {
            console.error('Error opening VS Code:', err.message);
        }
        else {
            console.log(`Opened ${targetPath} in VS Code`);
        }
    });
    if (!option.Nc) {
        entry.additional.forEach((additional) => {
            console.log(`Executing command: ${additional}`);
            const additionalProcess = (0, child_process_1.spawn)(additional, { cwd: targetPath, shell: true });
            additionalProcess.stdout.on('data', (data) => {
                console.log(`[Output]: ${data}`);
            });
            additionalProcess.stderr.on('data', (data) => {
                console.info(`[Info]: ${data}`);
            });
            additionalProcess.on('close', (code) => {
                if (code === 0) {
                    console.log(`The command "${additional}" executed successfully.`);
                }
                else {
                    console.error(`The command "${additional}" exited with code: ${code}`);
                }
            });
        });
    }
    else {
        console.log('Skipped the additional commands');
    }
}
function changeToHomeAndTarget(targetPath) {
    const homeDir = os_1.default.homedir();
    process.chdir(homeDir);
    const absoluteTargetPath = path_1.default.isAbsolute(targetPath) ? targetPath : path_1.default.resolve(homeDir, targetPath);
    return absoluteTargetPath;
}
