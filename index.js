#!/usr/bin/env node

const fs = require(`fs-extra`);
const path = require(`path`);

const args = process.argv.slice(2);

let directive;
let files = [];

for (const arg of args) {
  const [key, value] = arg.split(`=`);

  switch (key) {
    case `--directive`:
      directive = value;
      break;
    case `--files`:
      files = value.split(`,`);
      break;
  }
}

for (const file of files) {
  try {
    const filePath = path.resolve(process.cwd(), file);
    const fileContent = fs.readFileSync(filePath).toString();

    fs.writeFileSync(filePath, `"${directive}"\n${fileContent}`);

    console.info(
      `\x1b[32m`,
      `Prepended directive "${directive}" to file ${file}`,
      `\x1b[0m`
    );
  } catch (error) {
    console.error(
      `\x1b[31m`,
      `Failed to prepend directive "${directive}" to file "${file}"\n`,
      `\x1b[0m`,
      error
    );
    break;
  }
}
