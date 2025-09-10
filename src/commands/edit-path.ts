import { readJsonFile, writeToJsonFile } from '../utils/write-read-json.js';
import { makePrompt } from '../utils/make-prompt.js';
import { spawnPrompt } from '../utils/spawn-prompt.js';
import { validatePathExists } from '../utils/validations.js';
import type { PathEntry, PromptType } from '../@types/index.js';

const regex = / /

export async function editPath(input: string): Promise<void> {
  const data = readJsonFile();

  const targetEditing = catchTarget(input, data)

  if (!targetEditing) {
    console.error(`Error: No entry found for "${input}".`);
    return;
  }

  let editing = true;
  const promptEdit = makePrompt('list', 'action', 'What would you like to edit?')
  promptEdit.choices = ['Path', 'Command', 'Additional', 'Save & Exit', 'Cancel']

  const makeText = (name: string, context: string) => `Current ${name}: ${context}\nEnter new path (Type "exit" or leave blank to exit without editing.):`

  while (editing) {
    const { action } = await spawnPrompt(promptEdit);

    switch (action) {
      case 'Path': {
        const promptPath = makePrompt('input', 'edited', makeText('Path', targetEditing.path))
        await execEditCommun('path', promptPath, targetEditing, callBackPath())
        break;
      }

      case 'Command': {
        const promptCommand = makePrompt('input', 'edited', makeText('Command', targetEditing.command))
        await execEditCommun('command', promptCommand, targetEditing)
        break;
      }

      case 'Additional': {
        console.log(`Current Additional Commands: ${targetEditing.additional.join(', ')}`);
        const promptAdditional = makePrompt('input', 'newAdditional', 'Enter additional commands (comma-separated, type "exit" or leave blank to exit without editing, or type "clear" to clear): ')
        await execEditAdditional(promptAdditional, targetEditing)
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

function callBackPath(): (edited: string) => string | false {
  return (edited: string) => {
    try {
      return validatePathExists(edited);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        return false
      }
      console.error('An unexpected error occurred while validating the path.', error);
      return false

    };
  }
}

async function execEditCommun(item: 'path' | 'command', pronpt: PromptType, target: PathEntry, callBack?: (edited: string) => string | false) {

  const { edited } = await spawnPrompt(pronpt);

  if (typeof edited == 'string') {
    const pathAfter = edited.replace(regex, '')
    if (pathAfter === '' || pathAfter === 'exit') return

    const callBackResult = callBack ? callBack(edited) : true;

    if (edited && typeof callBackResult === 'string') target[item] = callBackResult;

    if (edited && !callBack && callBackResult) target[item] = edited;
  }
}

async function execEditAdditional(pronpt: PromptType, target: PathEntry) {

  const { newAdditional } = await spawnPrompt(pronpt);

  if (typeof newAdditional == 'string' && newAdditional) {
    const additionalAfter = newAdditional.replace(regex, '')
    if (additionalAfter === '' || additionalAfter === 'exit') return

    if (newAdditional === 'clear') {
      target.additional = [];
      return;
    }

    target.additional = newAdditional.split(',').map((cmd: string) => cmd.trim());
  }
}