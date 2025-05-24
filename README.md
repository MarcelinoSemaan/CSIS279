
# Midterm Project

## Project Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Midterm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file based on `.env.example` and set your database credentials and other configs.

4. **Run database migrations (if any):**
   ```bash
   npm run migrate
   ```

5. **Start the application:**
   ```bash
   npm start
   ```

## API Endpoints and Usage

| Method | Endpoint           | Description                | Request Body / Params         |
|--------|--------------------|----------------------------|------------------------------|
| GET    | `/api/users`       | Get all users              | None                         |
| GET    | `/api/users/:id`   | Get user by ID             | URL param: `id`              |
| POST   | `/api/users`       | Create a new user          | JSON: `{ name, email, ... }` |
| PUT    | `/api/users/:id`   | Update user by ID          | URL param: `id`, JSON body   |
| DELETE | `/api/users/:id`   | Delete user by ID          | URL param: `id`              |

_Replace `/api/users` with your actual endpoints if different._

## Database Schema Description

**Table: users**

| Column    | Type         | Description         |
|-----------|--------------|---------------------|
| id        | INTEGER (PK) | Unique user ID      |
| name      | VARCHAR      | User's name         |
| email     | VARCHAR      | User's email        |
| password  | VARCHAR      | Hashed password     |
| createdAt | TIMESTAMP    | Creation timestamp  |
| updatedAt | TIMESTAMP    | Update timestamp    |

_Adapt this table to your actual schema if different._

## Third-Party Libraries or Tools Used

- **Express**: Web framework for Node.js
- **Sequelize / Mongoose**: ORM/ODM for database interaction
- **dotenv**: Environment variable management
- **bcrypt**: Password hashing
- **Jest / Mocha**: Testing framework
- **Other**: (List any additional libraries used)

## How to Run and Test the Application

- **Run the application:**  
  `npm start`
- **Run tests:**  
  `npm test`
- **API testing:**  
  Use [Postman](https://www.postman.com/) or `curl` to interact with the endpoints.

## Technical Documentation

### Methods

#### `getAllUsers()`
- **Description:** Fetches all users from the database.
- **Parameters:** None
- **Returns:** `Promise<Array<User>>` — Array of user objects.

#### `getUserById(id)`
- **Description:** Fetches a user by their unique ID.
- **Parameters:**  
  - `id` (`string` or `number`): The user's ID.
- **Returns:** `Promise<User | null>` — User object or null if not found.

#### `createUser(userData)`
- **Description:** Creates a new user.
- **Parameters:**  
  - `userData` (`object`): `{ name, email, password }`
- **Returns:** `Promise<User>` — The created user object.

#### `updateUser(id, updateData)`
- **Description:** Updates an existing user.
- **Parameters:**  
  - `id` (`string` or `number`): The user's ID.
  - `updateData` (`object`): Fields to update.
- **Returns:** `Promise<User | null>` — Updated user object or null if not found.

#### `deleteUser(id)`
- **Description:** Deletes a user by ID.
- **Parameters:**  
  - `id` (`string` or `number`): The user's ID.
- **Returns:** `Promise<boolean>` — `true` if deleted, `false` otherwise.

---

_Replace method names and signatures with your actual implementations as needed._

