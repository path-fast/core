"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAdditional = makeAdditional;
const inquirer_1 = __importDefault(require("inquirer"));
async function makeAdditional() {
    const answers = await inquirer_1.default.prompt([
        {
            type: "confirm",
            name: "addAdditional",
            message: "Do you want to add an additional parameter?",
            default: false,
        },
    ]);
    // Se o usuário quiser adicionar, captura os parâmetros adicionais
    const additionalParams = [];
    while (answers.addAdditional) {
        // Pergunta pelo parâmetro adicional
        const additionalAnswer = await inquirer_1.default.prompt([
            {
                type: "input",
                name: "additional",
                message: "Please provide the additional parameter:",
            },
        ]);
        additionalParams.push(additionalAnswer.additional);
        // Pergunta se ele deseja adicionar outro parâmetro
        const continueAddingAnswer = await inquirer_1.default.prompt([
            {
                type: "confirm",
                name: "addAnother",
                message: "Do you want to add another parameter?",
                default: false,
            },
        ]);
        answers.addAdditional = continueAddingAnswer.addAnother;
    }
    return additionalParams;
}
