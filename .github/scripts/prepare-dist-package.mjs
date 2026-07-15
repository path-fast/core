import { cpSync, existsSync, writeFileSync } from 'node:fs';
import pck from '../../package.json' with { type: 'json' };

const distPackage = {
  ...pck,
  main: 'index.js',
  bin: { 
    pf: 'index.js'
  },
  imports: {
    '#types/*': './types/*',
    '#utils/*': './utils/*',
    '#commands/*': './commands/*',
    '#app/*': './*',
  },
};

writeFileSync('dist/package.json', `${JSON.stringify(distPackage, null, 2)}\n`);

if (existsSync('README.md')) {
  cpSync('README.md', 'dist/README.md');
}

if (existsSync('docs')) {
  cpSync('docs', 'dist/docs', { recursive: true });
}

console.log(`Prepared dist/package.json@${pck.version}`);
