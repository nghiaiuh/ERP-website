# Authentication Setup

## Installation

Install the required dependencies:

```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

## Database Migration

After updating the schema, run the migration:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

Or if you have a migration script:

```bash
npm run db:push
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## API Endpoints

### Register a new user

**POST** `/api/auth/register`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-01T10:00:00.000Z"
  }
}
```

### Login

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-01T10:00:00.000Z"
  }
}
```

## Frontend Usage Example

```typescript
// Register
const registerUser = async () => {
  try {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: "password123",
        name: "John Doe",
      },
    });
    console.log("Registration successful:", response);
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

// Login
const loginUser = async () => {
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: "password123",
      },
    });

    // Store token in localStorage or cookie
    localStorage.setItem("auth_token", response.token);
    console.log("Login successful:", response);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Use token in subsequent requests
const makeAuthenticatedRequest = async () => {
  const token = localStorage.getItem("auth_token");

  const response = await $fetch("/api/protected-endpoint", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
```

## Security Notes

1. **Change JWT_SECRET**: In production, use a strong, random secret key
2. **HTTPS**: Always use HTTPS in production
3. **Password Requirements**: Current minimum is 6 characters, consider stronger requirements
4. **Rate Limiting**: Consider adding rate limiting to prevent brute force attacks
5. **Token Expiration**: Tokens expire after 7 days, adjust as needed
