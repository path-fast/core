import fs from 'fs';
import inquirer from 'inquirer';
import { filePath } from '../../utils/jsonpath';

function loadPaths(): PathEntry[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function savePaths(data: PathEntry[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function editPath(input: string): Promise<void> {
  const data = loadPaths();

  // Identifica o item com base no índice ou comando
  const target =
    isNaN(Number(input)) 
      ? data.find((entry) => entry.command === input) 
      : data[Number(input)];

  if (!target) {
    console.error(`Error: No entry found for "${input}".`);
    return;
  }

  let editing = true;

  while (editing) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to edit?',
        choices: ['Path', 'Command', 'Additional', 'Save & Exit', 'Cancel'],
      },
    ]);

    switch (action) {
      case 'Path': {
        const { newPath } = await inquirer.prompt([
          {
            type: 'input',
            name: 'newPath',
            message: `Current Path: ${target.path}\nEnter new path (leave blank to keep current):`,
          },
        ]);
        if (newPath) target.path = newPath;
        break;
      }

      case 'Command': {
        const { newCommand } = await inquirer.prompt([
          {
            type: 'input',
            name: 'newCommand',
            message: `Current Command: ${target.command}\nEnter new command (leave blank to keep current):`,
          },
        ]);
        if (newCommand) target.command = newCommand;
        break;
      }

      case 'Additional': {
        console.log(`Current Additional Commands: ${target.additional.join(', ')}`);
        const { newAdditional } = await inquirer.prompt([
          {
            type: 'input',
            name: 'newAdditional',
            message: 'Enter additional commands (comma-separated, leave blank to keep current):',
          },
        ]);
        if (newAdditional) {
          target.additional = newAdditional.split(',').map((cmd: string) => cmd.trim());
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

