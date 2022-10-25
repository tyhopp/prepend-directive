const { test } = require(`uvu`);
const assert = require(`uvu/assert`);
const path = require(`path`);
const { execSync } = require(`child_process`);
const fs = require(`fs-extra`);
const prependDirective = require(`../index`);

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

const directive = `use strict`;

test.after.each(() => {
  for (const { path, originalContent } of fixtures) {
    fs.writeFileSync(path, originalContent);
  }
});

test(`CLI interface`, () => {
  const files = fixtures.map((fixture) => fixture.path).join(`,`);

  execSync(`node index.js --files=${files} --directive=\"${directive}\"`, {
    stdio: `inherit`,
  });

  for (const { path, originalContent } of fixtures) {
    const modifiedContent = fs.readFileSync(path, `utf8`);

    assert.is(
      modifiedContent.trim(),
      `"${directive}"\n${originalContent}`.trim()
    );
  }
});

test(`CLI interface with current working directory declared`, () => {
  const files = fixtures
    .map((fixture) => fixture.path.replace(`tests/`, ``))
    .join(`,`);

  execSync(
    `node index.js --files=${files} --directive=\"${directive}\" --cwd=${__dirname}`,
    {
      stdio: `inherit`,
    }
  );

  for (const { path, originalContent } of fixtures) {
    const modifiedContent = fs.readFileSync(path, `utf8`);

    assert.is(
      modifiedContent.trim(),
      `"${directive}"\n${originalContent}`.trim()
    );
  }
});

test(`CJS interface`, () => {
  prependDirective({
    directive,
    files: fixtures.map((fixture) => fixture.path),
  });

  for (const { path, originalContent } of fixtures) {
    const modifiedContent = fs.readFileSync(path, `utf8`);

    assert.is(
      modifiedContent.trim(),
      `"${directive}"\n${originalContent}`.trim()
    );
  }
});

test(`CJS interface with current working directory declared`, () => {
  prependDirective({
    directive,
    files: fixtures.map((fixture) => fixture.path.replace(`tests/`, ``)),
    cwd: path.resolve(__dirname),
  });

  for (const { path, originalContent } of fixtures) {
    const modifiedContent = fs.readFileSync(path, `utf8`);

    assert.is(
      modifiedContent.trim(),
      `"${directive}"\n${originalContent}`.trim()
    );
  }
});

test.run();
