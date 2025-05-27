# Test rules

- We will use Jest for testing, with TypeScript support.
- Tests are located at the `/src/test` directory.
- Test files should be named with the pattern `*.test.ts`.
- Source code is imported with relative paths from the test location.
- The script `npm test` should run all tests in the `/src/test` directory.
- Do not change the source code to make the tests pass.

## Test Structure

- Use nested `describe` blocks to organize test suites:
  - Main `describe` block for the feature/component being tested
  - Nested `describe` blocks for specific behaviors/actions
  - `it` blocks for individual test cases
- Use `beforeAll` and `beforeEach` for setup:
  - `beforeAll` for one-time setup (mocks, fakes)
  - `beforeEach` for test-specific setup and cleanup
- Follow the AAA pattern with clear comments:
  - **Arrange**: Setup test data and mocks
  - **Act**: Execute the function under test
  - **Assert**: Verify the results

## Test Doubles and Mocks

- Use Jest's mocking capabilities:
  - `jest.fn()` for function mocks
  - `jest.spyOn()` for spy functions
  - `jest.mock()` for module mocks
- Name test doubles with descriptive suffixes:
  - `Fake` for complete implementations (e.g., `ratesGatewayFake`)
  - `Spy` for function spies (e.g., `getSeedSpy`)
  - `Mock` for function mocks (e.g., `saveMock`)
- Use `jest.clearAllMocks()` in `beforeEach` to reset mock state

## Test Naming and Variables

- Use descriptive names that explain the test scenario
- Prefix variables with their purpose:
  - `dummy` for test data (e.g., `dummyUserId`)
  - `fake` for test doubles (e.g., `fakeRatesResult`)
  - `actual` and `expected` for assertions
  - `input` for test inputs (e.g., `inputQuantity`)
- Use `Sut` (System Under Test) suffix for the main test subject

## Assertions

- Use Jest's expect API for assertions
- Group related assertions together
- Use specific matchers:
  - `toEqual` for object comparisons
  - `toBe` for primitive values
  - `toHaveBeenCalled` for mock verifications
  - `expect.any()` for type checking

## Best Practices

- Keep test coverage focused on feature requirements
- Include both happy path and error cases
- Consider edge cases and boundary conditions
- Group related tests logically
- Use TypeScript types for better type safety
- Mock external dependencies consistently
- Clean up test state between runs 