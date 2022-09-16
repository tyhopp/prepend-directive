const { test } = require(`uvu`);
const assert = require(`uvu/assert`);
const { execSync } = require(`child_process`);
const fs = require(`fs-extra`);
const sysPath = require(`path`);

const fixtures = [
  {
    path: `tests/fixtures/a.js`,
    originalContent: `const a = () => \`a\`;`,
  },
  {
    path: `tests/fixtures/b.js`,
    originalContent: `const b = () => \`b\`;`,
  },
];

const files = fixtures.map((fixture) => fixture.path).join(`,`);
const directive = `\"use strict\"`;

const command = `npx prepend-directive@latest --files=${files} --directive=${directive}`;

test.after(() => {
  for (const { path, originalContent } of fixtures) {
    fs.writeFileSync(path, originalContent);
  }
});

test(`should prepend a directive to files`, () => {
  execSync(command, {
    stdio: [0, 1, 2],
    cwd: sysPath.resolve(``),
  });

  for (const { path, originalContent } of fixtures) {
    const modifiedContent = fs.readFileSync(path, `utf8`);

    assert.is(
      modifiedContent.trim(),
      `${directive}\n${originalContent}`.trim()
    );
  }
});

test.run();
