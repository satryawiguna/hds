// Global test setup
beforeAll(() => {
  // Setup code that runs before all tests
});

afterAll(() => {
  // Cleanup code that runs after all tests
});

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "3306";
process.env.DB_NAME = "test_db";
process.env.DB_USER = "test_user";
process.env.DB_PASSWORD = "test_password";
