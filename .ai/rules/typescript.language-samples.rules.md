# Typescript Language samples rules 

Generate consistent, readable, and maintainable TypeScript code.

## 1. Case Conventions

- Variables, methods, and functions: `camelCase`
- Classes, interfaces, enums, and type aliases: `PascalCase`
- Constants (especially for immutable primitive values or enum-like objects): `UPPER_SNAKE_CASE`

> **Why for LLM:** Strict case conventions improve code readability and make it easier for the LLM to understand the nature of an identifier. It helps in differentiating between constructs like classes and instances or simple functions.

**Examples:**

    ```typescript
    // Do
    const itemCount: number = 0;
    function calculateTotal(price: number, quantity: number): number {
      return price * quantity;
    }

    class ProductService {
      getProductById(id: string): Product | undefined { /* ... */ }
    }

    interface UserProfile {
      userId: string;
      displayName: string;
    }

    type ProductId = string;

    enum OrderStatus {
      Pending = 'PENDING',
      Shipped = 'SHIPPED',
      Delivered = 'DELIVERED',
    }

    const MAX_RETRIES: number = 3;
    const DEFAULT_TIMEOUT_MS: number = 5000;

    // Don't
    // const Item_Count: number = 0; // Incorrect variable case
    // function CalculateTotal(Price: number, Quantity: number): number { return Price * Quantity; } // Incorrect function case

    // class productService { // Incorrect class case
    //   getproductbyid(id: string): product | undefined { /* ... */ }
    // }

    // interface userProfile { /* ... */ } // Incorrect interface case
    // type product_id = string; // Incorrect type alias case
    // const maxRetries: number = 3; // Okay, but less clear for a global constant
    ```

## 2. Types

### 2.1. Always define explicit types

Do it for variables, function parameters, and function return values.

> **Why for LLM:** 
> - Explicit types provide clear contracts for the LLM, reducing ambiguity and enabling it to generate more accurate and type-safe code. It also helps the LLM understand the expected data structures.
> - It helps the LLM to generate more accurate and type-safe code.
> - It helps the LLM to understand the expected data structures.

**Examples:**

```typescript
  // Do
  let userName: string = "guest";
  function greetUser(name: string): string {
    return `Hello, ${name}!`;
  }
  async function fetchData(url: string): Promise<ResponseData> {
    // ... fetch logic
    return {} as ResponseData; // Placeholder
  }
  interface ResponseData {
      success: boolean;
      data?: any;
      error?: string;
  }

// Don't
// let userCount = 10; // Implicit type (number), prefer explicit
// function add(a, b) { // Missing parameter types and return type
//   return a + b;
// }
```

#### 2.2. Type Declarations

- Avoid primitive obsession: Define type aliases for domain-specific primitives in their own `*.type.ts` files.
- Leverage generics for reusable components/functions/types.
- Use `type` for defining custom data types (unions, intersections, complex object shapes not intended for extension via `implements`).
- Use `interface` for defining the behavior and shape of objects, especially if they are expected to be implemented by classes or extended by other interfaces.
- Prefer union types over `enum` where appropriate (especially for simple, finite sets of string or number literals).
- Use `===` and `!==` for all equality checks.
- Define logic functions for runtime validation and formatting of data based on its type.

> **Why for LLM:**
> - Type aliases help the LLM understand domain concepts.
> - Generics instruct the LLM to create flexible and reusable code.
> - Clear distinction between `type` and `interface` guides the LLM on the intended use of the type definition.
> - Union types can be more straightforward for LLMs to generate and use than enums in some contexts.
> - Strict equality prevents common JavaScript pitfalls, leading to more robust LLM-generated code.
> - Runtime validation functions are essential for ensuring data integrity, which the LLM can also be instructed to generate.

**Examples:**

```typescript
  // Do
  // currency.type.ts
  export type CurrencyCode = 'USD' | 'EUR' | 'GBP';
  // Could be an object { amount: number, currency: CurrencyCode } for more robustness
  export type Price = number; 

  // item.type.ts
  import type { Price, CurrencyCode } from './currency.type.ts';
  export type ItemId = string;
  export type Item = {
    id: ItemId;
    name: string;
    price: Price;
    currency: CurrencyCode;
    };

  function getItem<T>(id: string): T | undefined { /* ... */ return undefined;}
  const specificItem: Item | undefined = getItem<Item>("item-123");

  type UserRole = "admin" | "editor" | "viewer";
  const currentUserRole: UserRole = "editor";

  interface Product {
    id: string;
    name: string;
    getDescription(): string;
  }

  class Book implements Product {
    constructor(public id: string, public name: string, public author: string) {}
    getDescription(): string {
      return `${this.name} by ${this.author}`;
    }
  }

    const value: number = 10;
    if (value === 10) {
      console.log("Value is ten");
    }

    type Email = string;
    function isValidEmail(email: string): email is Email {
        // Basic validation for example purposes
        return email.includes('@') && email.includes('.');
    }
    function formatEmailForDisplay(email: Email): string {
        return email.toLowerCase();
    }


    // Don't
    // function processPayment(amount: number, currency: string) { /* ... */ } // Primitives used directly for domain concepts

    // function getFirstElement(arr: any[]): any { return arr[0]; } // Not using generics

    // enum Status { Active = "ACTIVE", Inactive = "INACTIVE" } // Prefer union for simple cases
    // const currentStatus: Status = Status.Active;

    // const inputValue: any = "5";
    // if (inputValue == 5) { /* ... */ } // Loose equality
```

#### 2.3. Dealing with Unknown or Optional Values

- Use `unknown` for values whose type is not known at the time of writing code and requires type checking before use.
- Use `never` for values that should logically never occur (e.g., a function that always throws or an exhaustive check).
- Use `void` for functions that do not return a value.
- Declare constants with default values to avoid checks for `undefined` or `null` where appropriate.
- Accept `undefined` for optional function parameters or object properties when the value may genuinely not exist.
- Do NOT use `null` (except when interacting with external APIs that explicitly use it).
- Do NOT use `any` (except as an absolute last resort when type information is impossible to obtain, and always document its usage).

> **Why for LLM:** These rules guide the LLM to produce more type-safe code. `unknown` forces explicit type checks. `never` helps with exhaustive checks. Avoiding `null` and `any` pushes the LLM towards stronger typing, which is a primary benefit of TypeScript.

**Examples:**

```typescript
  // Do
  function processData(input: unknown): void {
    if (typeof input === 'string') {
      console.log(input.toUpperCase());
    } else if (typeof input === 'number') {
      console.log(input.toFixed(2));
    }
  }

  function exhaustiveCheck(param: never): never {
    throw new Error("This should never be reached!");
  }

  function logMessage(message: string): void {
    console.log(message);
  }

  type UserConfig = {
    theme: string;
    notificationsEnabled: boolean;
    language?: string; // Optional property
  }
  const DEFAULT_LANGUAGE = "en";
  const DEFAULT_USER_CONFIG: UserConfig = {
    theme: "light",
    notificationsEnabled: true,
  }
  function applyConfig(config: UserConfig): void {
    // Use default if undefined
    const lang = config.language ?? DEFAULT_LANGUAGE; /
    console.log(`Applying theme: ${config.theme}, language: ${lang}`);
  }

  // Don't
  // function processUnsafe(input: any): void {
  //   console.log(input.somePropertyThatMightNotExist); // Unsafe
  // }

  // function createResource(): string | null { // Prefer undefined or handle potential absence differently
  //   if (Math.random() > 0.5) return "resourceId";
  //   return null;
  // }
```

## 3. Modules

(In this context, a module is a TypeScript file that exports one or more entities.)

### 3.1. Export Rules

- Export objects with methods rather than many standalone functions if they represent a cohesive set of capabilities (e.g., a service).
- Use named exports over default exports for clarity, better IDE support (auto-imports, refactoring), and to avoid naming collisions.
- Strive to export only one primary component (class, main service object, or a set of related types/constants) per file. This aligns with the idea of a file being a module for a single "intention.artifact".

> **Why for LLM:**
> - Named exports make it easier for the LLM to find and import specific functionalities.
> - "One primary component per file" helps the LLM understand the module's focus.
> - Exporting objects with methods helps the LLM structure related logic together.

**Examples:**

```typescript
// Do

// user-formatter.util.ts
export function formatUserName(name: string): string { /* ... */ return '';}
export function normalizeUserEmail(email: string): string { /* ... */ return ''; }

// OR, if more cohesive:

// user-formatter.util.ts
const userFormatter = {
  formatName(name: string): string { /* ... */ return ''; },
  normalizeEmail(email: string): string { /* ... */ return ''; }
};
export { userFormatter };

// user.service.ts
export class UserService {
  getUser(id: string) { /* ... */ }
  createUser(data: any) { /* ... */ }
}
export interface User { id: string; name: string; }

// Don't

// helper.util.ts
// export default function someHelper() { /* ... */ } // Avoid default export
// export function anotherHelper() { /* ... */ }
// export class YetAnotherThing {} // Multiple unrelated exports in one file
```

### 3.2. Naming Conventions for Modules/Files

- The primary exported object (if applicable) should follow `<intention><artifact>` naming in `camelCase` or `PascalCase` (for classes/types).
- File names should be `<intention>.<artifact>.ts` in `kebab-case`.
- `intention`: Represents features or domain concepts (e.g., `auth`, `user`, `product-details`, `order-processing`).
- `artifact`: Represents architectural building blocks (e.g., `service`, `controller`, `repository`, `type`, `util`, `validator`, `config`).

> **Why for LLM:** Consistent naming helps the LLM understand the role and scope of a file and its contents, aiding in generating new files or importing existing ones correctly.

**Examples:**

```typescript
// File: src/features/user/user.service.ts
export class UserService {
  findUserById(userId: string): User | undefined { /* ... */ }
}

// File: src/features/order/order.validator.ts
export const orderValidator = {
  isValidForSubmission(order: Order): boolean { /* ... */ }
};

// File: src/shared/logger/logger.config.ts
export const loggerConfig: LoggerConfig = {
  level: 'info',
};

// File: src/features/product/product.type.ts
export type ProductId = string;
export interface ProductDetails {
  id: ProductId;
  name: string;
  description: string;
  price: number;
}
```

### 3.3. Import Rules

- Use ES modules (`import`/`export`) syntax, not CommonJS (`require`).
- When importing, use the full file name including the extension `.ts`.
- Destructure imports when importing multiple specific named exports.
- Import types specifically using `import type { ... } from './module.ts';`.

> **Why for LLM:**
> - ES modules are the standard.
> - Explicit extensions (if consistently used and configured) can reduce ambiguity for the LLM and build tools.
> - Destructuring improves readability.
> - `import type` allows build tools to optimize away type-only imports, which is good practice and informs the LLM about the nature of the import.

**Examples:**

```typescript
// Do
import { UserService } from '../user/user.service.ts';
import { calculatePrice, type OrderItem } from './order-calculation.util.ts';
import type { UserProfile } from '../user/user.type.ts';

const userService = new UserService();
const item: OrderItem = { productId: '123', quantity: 2, unitPrice: 10.99 };
const price = calculatePrice(item);

// Don't
// const userService = require('../user/user.service'); // Avoid CommonJS
// import UserStuff from '../user/user.service.ts'; // Avoid default imports if named are available
// import * as OrderUtils from './order-calculation.util.ts'; // Use if truly namespacing many things, else prefer destructuring
// import { Product } from './product.model'; // Missing extension if rule is to include it.
```

## 4. Functions and Methods

### 4.1. Naming and Abstraction

- Name functions and methods with a verb (action) and optionally a noun (target/context). E.g., `getUserById`, `calculateTotalPrice`, `validateInput`.
- Strive for a single level of abstraction within a function/method. If a function does too many things at different levels of detail, break it down.

> **Why for LLM:** Clear, action-oriented names help the LLM understand the function's purpose. Single level of abstraction makes the function's logic simpler for the LLM to generate and reason about.

**Examples:**

```typescript
// Do
function processPayment(paymentDetails: PaymentDetails, userId: string): Promise<PaymentResult> {
  // High-level steps
  const isValid = validatePaymentDetails(paymentDetails);
  if (!isValid) throw new Error("Invalid details");
  const transactionId = await initiateBankTransaction(paymentDetails, userId);
  return recordTransaction(transactionId, paymentDetails);
  return {} as Promise<PaymentResult>; // Placeholder
}

// Don't
// function data(input: any) { /* ... */ } // Vague name

// function handleOrder(order: Order) { // Potentially too many levels of abstraction
//   // 1. Validate order items (low level)
//   // 2. Check inventory (mid level)
//   // 3. Authorize payment (mid level)
//   // 4. Send confirmation email (high level)
//   // 5. Update order status in DB (low level)
// }
```

### 4.2. Pure Functions and Side Effects

- Prefer pure functions (output depends only on input, no side effects) over functions with side effects.
- Isolate side effects (e.g., network requests, DOM manipulation, logging, database writes) into separate functions that are clearly identifiable and easier to mock for testing.

> **Why for LLM:** Pure functions are easier for LLMs to reason about, test, and compose. Isolating side effects helps the LLM generate more predictable and testable units of code.

**Examples:**

```typescript
// Do
function calculateDiscount(price: number, percentage: number): number { // Pure
  return price * (percentage / 100);
}

async function saveUserData(user: User): Promise<void> { // Side effect (e.g., DB write)
  console.log(`Saving user ${user.id}...`); // Actual DB call would be here
  // await database.users.update({ where: { id: user.id }, data: user });
}

// Don't
let total = 0;
// Not pure (modifies external state 'total')
function addToTotal(value: number): number {
  total += value;
  // Also has a side effect of logging AND modifies external state
  console.log(`Current total: ${total}`);
  return total;
}
```

### 4.3. Function  Declarations vs. Expressions (Arrow Functions)

- Prefer `function` declarations for top-level or module-level functions.
- Use arrow functions (`=>`) primarily for:
    - Callbacks.
    - Short, one-liner functions.
    - When needing to preserve the lexical `this` from the surrounding scope (e.g., in class methods that are used as callbacks).

> **Why for LLM:** This provides a consistent style. `function` declarations have hoisting, which can be a factor, but the primary driver here is often stylistic preference and clarity for specific use cases of arrow functions. For an LLM, consistency reduces ambiguity.

**Examples:**

```typescript
// Do
function greet(name: string): string {
  return `Hello, ${name}`;
}

const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2); // Arrow for callback

const add = (a: number, b: number): number => a + b; // Arrow for one-liner

class MyClass {
  private value: number = 10;
  process(): void {
    setTimeout(() => {
      console.log(this.value); // 'this' correctly refers to MyClass instance
    }, 100);
  }
}

// Don't
// const greetUser = function(name: string): string { // Prefer function declaration for top-level
//   return `Hello, ${name}`;
// };
```

### 4.4. Array Methods

- Prefer functional array methods (`.map()`, `.filter()`, `.reduce()`, `.find()`, `.some()`, `.every()`, etc.) over traditional `for` loops for common array transformations and iterations.
- Use array destructuring and the spread operator (`...`) for cleaner array manipulations.
- Implement early returns in array method callbacks (e.g., in `.find()`, `.some()`, `.every()`) for better performance where applicable.
- Consider composing array functions for complex transformations.
- Use `for...of` loops when you need to iterate and potentially `break` or `continue` based on conditions, or when dealing with iterables that are not arrays.
- Resort to traditional `for` loops (with an index) only for complex control flow scenarios not easily handled by other methods, or in performance-critical sections after profiling.

> **Why for LLM:** Functional array methods often lead to more declarative and readable code, which can be easier for an LLM to generate correctly. They also reduce the chances of off-by-one errors common with manual `for` loops.

**Examples:**

```typescript
// Do
interface Product { id: string; name: string; price: number; category: string }
const products: Product[] = [
  { id: '1', name: 'Laptop', price: 1200, category: 'Electronics' },
  { id: '2', name: 'Book', price: 20, category: 'Books' },
  { id: '3', name: 'Mouse', price: 25, category: 'Electronics' },
];

const productNames: string[] = products.map(product => product.name);
const electronics: Product[] = products.filter(product => product.category === 'Electronics');
const totalPrice: number = products.reduce((sum, product) => sum + product.price, 0);
const expensiveBook: Product | undefined = products.find(p => p.category === 'Books' && p.price > 50);


const firstThree = [1, 2, 3];
const allNumbers = [...firstThree, 4, 5, 6];
const [first, second, ...rest] = allNumbers;

// Early return in .some()
const hasElectronics = products.some(product => {
  if (product.category === 'Electronics') return true; // Early exit
  // other logic if needed
  return false;
});

for (const product of products) {
  if (product.price > 1000) {
    console.log(`Expensive product found: ${product.name}`);
    break; // Exit loop early
  }
}

// Don't
// const productNamesManual = [];
// for (let i = 0; i < products.length; i++) { // Prefer .map
//   productNamesManual.push(products[i].name);
// }
```

### 4.5. Async/Await

- Use `async`/`await` for managing asynchronous code (Promises).
- Mark functions that inherently return a Promise (even if just wrapping a value) as `async`.
- Use `await` when calling a function that returns a Promise if you need its resolved value before proceeding.
- Use `try...catch` blocks for error handling in `async` functions.
- Use `Promise.all()` or `Promise.allSettled()` for running multiple asynchronous operations concurrently when appropriate.

> **Why for LLM:** `async`/`await` makes asynchronous code look and behave a bit more like synchronous code, which can be simpler for an LLM to generate and manage, especially regarding error handling and control flow.

**Examples:**

```typescript
// Do
async function fetchUserData(userId: string): Promise<User> { // Marked async
  try {
    const response = await fetch(`/api/users/${userId}`); // await Promise
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    const userData: User = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw or handle appropriately
  }
}

async function fetchInitialData(userId: string, orderId: string): Promise<[User, Order]> {
  try {
    const [user, order] = await Promise.all([ // Concurrent operations
      fetchUserData(userId),
      fetchOrderData(orderId) // Assuming fetchOrderData is another async function
    ]);
    return [user, order];
    //return {} as Promise<[User,Order]>; // Placeholder
  } catch (error) {
    console.error("Error fetching initial data:", error);
    throw error;
  }
}

// Don't
// function getUserProfile(userId: string): Promise<UserProfile> { // Not marked async, but returns Promise
//   return fetch(`/api/profiles/${userId}`)
//     .then(res => res.json())
//     .catch(err => { console.error(err); throw err; }); // Harder to read than async/await
// }
```

## 5. Classes

- Prefer functional modules (objects with methods, pure functions) over classes where appropriate.
- Use classes when:
    - Data (state) and behavior (methods operating on that state) are tightly coupled (classic object-oriented scenarios).
    - Implementing certain design patterns that inherently rely on classes (e.g., Factory, Builder in some forms, or when creating instances with `new`).
    - Working with frameworks that expect class-based components (though the goal here is framework-agnostic).
    - Be explicit with member visibility: `public`, `private`, or `protected`. Default is `public`, but be explicit.
    - Use `readonly` for properties that should not be changed after object instantiation.
    - Declare and use an `interface` for the public API of a class to facilitate dependency inversion and testing.

> **Why for LLM:** Guiding the LLM on when to use classes versus functional approaches helps in generating idiomatic code. Explicit visibility and `readonly` improve the clarity and robustness of class definitions. Interfaces for public APIs are crucial for testability and decoupling, which the LLM should be encouraged to produce.

**Examples:**

```typescript
// Do

interface Logger {
  log(message: string): void;
  error(message: string, error?: Error): void;
}

class ConsoleLogger implements Logger {
  public log(message: string): void { // Explicit public
    console.log(`[LOG] ${message}`);
  }

  public error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error || '');
  }
}

class UserAccount {
  public readonly userId: string; // Readonly after construction
  private balance: number; // Private state

  constructor(userId: string, initialBalance: number = 0) {
    this.userId = userId;
    this.balance = initialBalance;
  }

  public deposit(amount: number): void {
    if (amount <= 0) throw new Error("Deposit amount must be positive.");
    this.balance += amount;
  }

  public getBalance(): number {
    return this.balance;
  }
}

// Don't
// class DataProcessor { // Could potentially be a functional module if stateless
//   process(data: any) { /* ... */ }
//   validate(data: any) { /* ... */ }
// }

// class Config {
//   apiKey: string; // Implicit public, no readonly
//   constructor(key: string) { this.apiKey = key; }
// }
```

## 6. Error Handling

- Use `try...catch` blocks at the top level of an operation (e.g., an API request handler, an event handler) to catch and handle errors gracefully.
- In lower-level functions, use `try...catch` only if it adds specific value, such as:
    - Attempting to fix or recover from a specific, known error.
    - Adding more context to an error before re-throwing it.
    - Performing cleanup actions in a `finally` block.
    - Otherwise, let errors propagate up to be handled by a higher-level handler.
    - Define and use a dedicated logger service/module for reporting errors, rather than just `console.error` everywhere. (Example assumes a `logger` object is available).
    - Consider creating custom error classes (extending `Error`) for domain-specific error conditions to allow for more precise error handling.

> **Why for LLM:** Clear error handling strategies help the LLM generate robust code that doesn't crash unexpectedly. Centralized logging and custom errors improve debuggability. Guiding when to catch vs. let propagate prevents overly verbose or error-swallowing code.

**Examples:**

```typescript
// Assume a logger is available:
import { logger } from '../../shared/logger/logger.service.ts';

// Do
class CustomValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "CustomValidationError";
  }
}

async function handleUserRequest(request: Request): Promise<Response> {
  try {
    const userId = request.params.id;
    const userData = await fetchUserData(userId); // fetchUserData might throw
    return Response.json(userData);
    // return {} as Response; // placeholder
  } catch (error) {
    // logger.error('Failed to handle user request', error);
    if (error instanceof CustomValidationError) {
      return Response.json({ message: error.message, field: error.field }, { status: 400 });
    }
    return Response.json({ message: 'An unexpected error occurred' }, { status: 500 });
    // return {} as Response; // placeholder for actual response
  }
}

function parseConfiguration(configText: string): ConfigObject {
  try {
    return JSON.parse(configText);
  } catch (error) {
    logger.error('Configuration parsing error', error);
    // Add context before re-throwing a more specific error
    throw new Error(`Invalid configuration format: ${(error as Error).message}`);
  }
}

// Don't
// function readFile(filePath: string): string {
//   try {
//     const content = fs.readFileSync(filePath, 'utf-8');
//     return content;
//   } catch (error) {
//     console.error("File read failed"); // Swallows the error, loses details
//     return ""; //  Potentially problematic to return empty string on error
//   }
// }
```
