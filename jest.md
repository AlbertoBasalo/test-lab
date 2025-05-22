# Add Jest to node project

## Install Jest
```bash
npm install --save-dev jest
npm install --save-dev @types/jest
npm install --save-dev ts-jest
```

## Create Jest config file
`jest.config.mjs`
```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  roots: ['<rootDir>/src'], 
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json'
    }]
  }
};
```

## Configure TypeScript
`tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
} 
```

## Add Jest to package.json
`package.json`
```json 
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```







