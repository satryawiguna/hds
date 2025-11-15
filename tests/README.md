# Testing Documentation

This document provides an overview of the testing structure and best practices for the HDS project.

## Test Structure

The project follows a clean architecture pattern with tests organized by layer:

```
├── apps/api/src/__tests__/
│   └── unit/
│       └── modules/
│           ├── auth/controllers/
│           ├── task/controllers/
│           └── user/controllers/
├── packages/core/src/__tests__/
│   └── unit/
│       ├── entities/
│       └── use-cases/
│           ├── auth/
│           ├── task/
│           └── user/
├── packages/infrastructure/src/__tests__/
│   └── unit/
│       ├── repositories/
│       └── services/
└── tests/
    ├── helpers/
    │   ├── builders/
    │   └── mocks/
    └── setup/
```

## Running Tests

### Run all tests

```bash
pnpm test
```

### Run tests for specific package

```bash
# Core package
cd packages/core && pnpm test

# Infrastructure package
cd packages/infrastructure && pnpm test

# API app
cd apps/api && pnpm test
```

### Run tests with coverage

```bash
pnpm test:coverage
```

### Run tests in watch mode

```bash
pnpm test:watch
```

### Run only unit tests

```bash
pnpm test:unit
```

## Test Organization

### Unit Tests

#### Entities

- Test entity creation and factory methods
- Test business logic methods
- Test state transitions
- Test validation rules

#### Use Cases

- Test successful execution paths
- Test error handling
- Test business rule enforcement
- Mock all external dependencies (repositories, services)

#### Repositories

- Test CRUD operations
- Test query methods with filters
- Test pagination
- Mock database connections

#### Services

- Test service methods
- Test integrations with external libraries
- Mock external dependencies

#### Controllers

- Test request handling
- Test response formatting
- Test validation
- Test error handling
- Mock use cases and services

## Testing Best Practices

### 1. Test Naming Convention

```typescript
describe("ClassName", () => {
  describe("methodName", () => {
    it("should do something when condition", () => {
      // Test implementation
    });
  });
});
```

### 2. AAA Pattern (Arrange, Act, Assert)

```typescript
it("should create user successfully", async () => {
  // Arrange
  const userData = { email: "test@example.com", password: "password" };
  mockRepository.findByEmail.mockResolvedValue(null);

  // Act
  const result = await useCase.execute(userData);

  // Assert
  expect(result).toBeDefined();
  expect(mockRepository.create).toHaveBeenCalled();
});
```

### 3. Use Test Builders

```typescript
import { UserBuilder } from "@tests/helpers";

const user = new UserBuilder().withEmail("test@example.com").verified().build();
```

### 4. Mock External Dependencies

```typescript
import { createMockUserRepository } from "@tests/helpers";

const mockRepository = createMockUserRepository();
mockRepository.findById.mockResolvedValue(mockUser);
```

### 5. Test Edge Cases

- Empty inputs
- Null/undefined values
- Large datasets
- Error conditions
- Boundary values

### 6. Keep Tests Independent

- Each test should run independently
- Use `beforeEach` to reset state
- Don't rely on test execution order

### 7. Test One Thing at a Time

- Focus each test on a single behavior
- Use descriptive test names
- Break complex scenarios into multiple tests

## Coverage Goals

- **Entities**: 90%+ coverage
- **Use Cases**: 85%+ coverage
- **Repositories**: 80%+ coverage
- **Services**: 80%+ coverage
- **Controllers**: 70%+ coverage

## Continuous Integration

Tests are automatically run on:

- Every commit
- Pull requests
- Before deployment

## Tools and Libraries

- **Jest**: Test framework and runner
- **ts-jest**: TypeScript preprocessor for Jest
- **@types/jest**: TypeScript definitions for Jest

## Helper Utilities

### Builders

- `UserBuilder`: Build test user entities
- `TaskBuilder`: Build test task entities

### Mocks

- `createMockUserRepository()`: Mock user repository
- `createMockTaskRepository()`: Mock task repository
- `createMockPasswordHashService()`: Mock password hashing
- `createMockTokenService()`: Mock token generation
- `createMockRequest()`: Mock Express request
- `createMockResponse()`: Mock Express response

## Writing New Tests

1. Identify the layer (entity, use case, repository, service, controller)
2. Create test file following naming convention: `*.test.ts`
3. Use appropriate helpers and mocks
4. Follow AAA pattern
5. Test happy path first, then edge cases
6. Ensure good coverage but focus on meaningful tests

## Debugging Tests

### Run specific test file

```bash
pnpm test path/to/test.file.test.ts
```

### Run with verbose output

```bash
pnpm test:verbose
```

### Debug in VS Code

Add breakpoints and use the Jest debug configuration in `.vscode/launch.json`.

## Common Issues

### Module resolution errors

- Check `moduleNameMapper` in `jest.config.ts`
- Ensure path aliases match `tsconfig.json`

### Timeout errors

- Increase timeout for async operations
- Check for unresolved promises

### Mock not working

- Ensure mocks are cleared between tests
- Use `jest.clearAllMocks()` in `beforeEach`

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Clean Architecture Testing Patterns](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
