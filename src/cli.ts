#!/usr/bin/env node
import path from 'node:path';

import meow from 'meow';

import { createTyproofProject, formatGroupResult, formatSummary } from './test';

const cli = meow(
  `
  Usage
    $ typroof [path]

    The given directory must contain a \`tsconfig.json\`

  Info
    --help           Display help text
    --version        Display version info

  Options
    --files      -f  Glob of files to test         [Default: '/path/proof/**/*.{ts,tsx}' or '/**/*.proof.{ts,tsx}']

  Examples
    $ typroof /path/to/project

    $ typroof --files /test/some/folder/*.ts --files /test/other/folder/*.tsx

    $ typroof

      ❯ proof/string-utils.ts (2)
        ✔ Append
        ❯ Prepend (1)
          ✘ should prepend a string to another
            × 12:12 Expect Prepend<'foo', 'bar'> to equal "foobar", but got "barfoo".
      
       Test Files  1 failed (1)
            Tests  1 failed | 1 passed (2)
         Start at  16:47:54
         Duration  19ms
`,
  {
    flags: {
      files: {
        type: 'string',
        shortFlag: 'f',
        isMultiple: true,
      },
    },
    importMeta: import.meta,
  },
);

const cwd = cli.input.length > 0 ? cli.input[0]! : process.cwd();
const { files: testFiles } = cli.flags;

const project = createTyproofProject({
  tsConfigFilePath: path.join(cwd, 'tsconfig.json'),
  ...(testFiles && testFiles.length > 0 && { testFiles }),
});

const startedAt = new Date();
const results = project.testFiles.map(project.checkTestFile);
const finishedAt = new Date();

for (const result of results) {
  console.log(formatGroupResult(result.rootGroupResult));
  console.log();
}
console.log(
  formatSummary({ groups: results.map((r) => r.rootGroupResult), startedAt, finishedAt }),
);
