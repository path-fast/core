"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPath = addPath;
const creat_1 = require("./creat");
const read_file_1 = require("../shered/read-file");
const validations_1 = require("../shered/validations");
const make_additinal_1 = require("../shered/make-additinal");
async function addPath(projectPath, command) {
    const adjustedPath = (0, validations_1.adjustPath)(projectPath);
    const absolutePath = adjustedPath === "." ? process.cwd() : adjustedPath;
    if (!(0, validations_1.validatePathExists)(absolutePath)) {
        return;
    }
    const data = (0, read_file_1.readJsonFile)();
    if ((0, validations_1.checkIfExistsInJson)(data, absolutePath, command)) {
        return;
    }
    const additionalParams = await (0, make_additinal_1.makeAdditional)();
    data.push({ path: absolutePath, command, additional: additionalParams });
    (0, creat_1.writeToJsonFile)(data);
}
