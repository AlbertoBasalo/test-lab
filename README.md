# Lab Testing

Lab for testing courses.

Repository: [AlbertoBasalo / test-lab](https://github.com/AlbertoBasalo/test-lab)

## Overview

This archetype provides a standardized template and structure for creating unit tests with node.

## Installation

```bash
# git hub clone (TBD)
```

## Usage

```bash
npm i -D  jest@latest
npm i -D  ts-jest@latest
```

```bash
npm install
npm test
npm start
```

### Development

```bash
npm run dev
npm run lint
```

### Linting

```bash
npm init @eslint/config@latest
npm i -D prettier@latest
npm i -D eslint-config-prettier eslint-plugin-prettier
npm i -D @commitlint/cli @commitlint/config-conventional
npm i -D commit-and-tag-version
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
npx husky init
npm i -D @stryker-mutator/jest-runner
```

## Credits

- [Alberto Basalo](https://albertobasalo.dev)
- [AI code Academy](https://aicode.academy)
