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
npm install --save-dev  jest@latest
npm install --save-dev  ts-jest@latest
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
npm install --save-dev  prettier@latest
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
npm install -D @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
npx husky init
```

## Credits

- [Alberto Basalo](https://albertobasalo.dev)
- [AI code Academy](https://aicode.academy)
