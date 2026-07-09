import { readJsonFile, writeToJsonFile } from '#utils/write-read-json.js';
import { validatePathExists } from '#utils/validations.js';
import type { EditOptions, PathEntry } from '#types/index.js';

const regex = / /

type EditItem = 'path' | 'command' | 'ideCommand';

export async function editPath(input:string,  options: EditOptions): Promise<void> {
  const data = readJsonFile('path');
  const { extra, code, ide, path  } = options

  console.log(options)
  if(!extra && !code && !ide && !path ) {
    console.warn("Alerta nenhum campo alterado")
    return
  }

  const targetEditing = catchTarget(input, data)

  if (!targetEditing) {
    console.error(`Error: No entry found for "${input}".`);
    return;
  }

  if (options.path) await execEditCommun('path', options.path, targetEditing, callBackPath())
  if (options.code) await execEditCommun('command', options.code, targetEditing)
  if (options.ide) await execEditCommun('ideCommand', options.ide, targetEditing)
  if (options.extra) await execEditAdditional(options.extra, targetEditing)

  writeToJsonFile('path', data);

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

async function execEditCommun(item: EditItem, value: string | undefined, target: PathEntry, callBack?: (edited: string) => string | false) {
  if (typeof value == 'string') {
    const pathAfter = value.replace(regex, '')
    if (pathAfter === '' || pathAfter === 'exit') return

    const callBackResult = callBack ? callBack(value) : true;

    if (value && typeof callBackResult === 'string') target[item] = callBackResult;

    if (value && !callBack && callBackResult) target[item] = value;
  }
}

async function execEditAdditional(value: string | undefined, target: PathEntry) {
  if (typeof value == 'string' && value) {
    const additionalAfter = value.replace(regex, '')
    if (additionalAfter === '' || additionalAfter === 'exit') return

    if (value === 'clear') {
      target.additional = [];
      return;
    }

    target.additional = value.split(',').map((cmd: string) => cmd.trim());
  }
}