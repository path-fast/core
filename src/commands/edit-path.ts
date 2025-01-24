import inquirer from 'inquirer';
import { readJsonFile, writeToJsonFile } from '../utils/write-read-json';
import { makePrompt } from '../utils/make-prompt';
import { PathEntry, PronptType } from '../dto';

const regex = / /


export async function editPath(input: string): Promise<void> {
  const data = readJsonFile();

  const target = catchTarget(input, data)

  if (!target) {
    console.error(`Error: No entry found for "${input}".`);
    return;
  }

  let editing = true;
  const promptEdit = makePrompt('list','action', 'What would you like to edit?' )
  promptEdit.choices = ['Path', 'Command', 'Additional', 'Save & Exit', 'Cancel'] 

  while (editing) {
    const { action } = await inquirer.prompt([promptEdit]);

    switch (action) {
      case 'Path': {
        const promptPath = makePrompt('input','newPath',`Current Path: ${target.path}\nEnter new path (Type "exit" or leave blank to exit without editing.):`)   
        await execEditCommun('path', promptPath ,target)     
        break;
      }

      case 'Command': {
        const promptCommand = makePrompt('input','newCommand', `Current Command: ${target.command}\nEnter new command (Type "exit" or leave blank to exit without editing.):` )
        await execEditCommun('command', promptCommand, target)
        break;
      }

      case 'Additional': {
        console.log(`Current Additional Commands: ${target.additional.join(', ')}`);
        const promptAdditional = makePrompt('input', 'newAdditional','Enter additional commands (comma-separated, type "exit" or leave blank to exit without editing.): ')
        await execEditAdditional(promptAdditional, target)
        break;
      }

      case 'Save & Exit': {
        writeToJsonFile(data);
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

function catchTarget(input: string, data: PathEntry[]) {
  return isNaN(Number(input))
    ? data.find((entry) => entry.command === input)
    : data[Number(input)];
}

async function execEditCommun(item: 'path'| 'command', pronpt:  PronptType, target:PathEntry ){

  const { newPath } = await inquirer.prompt([pronpt]);

  if( typeof newPath == 'string' ){
    const pathAfter = newPath.replace(regex, '')
    if(pathAfter === '' || pathAfter === 'exit' ) return

    if (newPath) target[item] = newPath;
  }


}
async function execEditAdditional(pronpt:  PronptType, target:PathEntry ) {
  
  const { newAdditional } = await inquirer.prompt([pronpt]);
        
  if ( typeof newAdditional == 'string' && newAdditional) {
    const additionalAfter = newAdditional.replace(regex, '')
    if(additionalAfter === '' || additionalAfter === 'exit' ) return

    target.additional = newAdditional.split(',').map((cmd: string) => cmd.trim());
  }
}