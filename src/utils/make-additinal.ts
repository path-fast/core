import inquirer from "inquirer";

export async function makeAdditional (): Promise<string[]>{
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "addAdditional",
      message: "Do you want to add an additional parameter?",
      default: false,
    },
  ]);

  // Se o usuário quiser adicionar, captura os parâmetros adicionais
  const additionalParams: string[] = [];

  while (answers.addAdditional) {
    // Pergunta pelo parâmetro adicional
    const additionalAnswer = await inquirer.prompt([
      {
        type: "input",
        name: "additional",
        message: "Please provide the additional parameter:",
      },
    ]);

    additionalParams.push(additionalAnswer.additional);

    // Pergunta se ele deseja adicionar outro parâmetro
    const continueAddingAnswer = await inquirer.prompt([
      {
        type: "confirm",
        name: "addAnother",
        message: "Do you want to add another parameter?",
        default: false,
      },
    ]);

    answers.addAdditional = continueAddingAnswer.addAnother;
  }

  return additionalParams
}