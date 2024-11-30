# Conference Management Portal

The **Conference Management Portal** is a web application built using the MERN stack, providing a platform for users to register, manage, and attend conferences. It features secure **JWT-based authentication** and **role-based authorization**, ensuring robust access control for admins and attendees.

---

## Features

### Role-Based Access Control (RBAC)
- **Admin**:
  - Add, update, and delete conferences.
  - View all registered attendees and conference details.
- **Attendee**:
  - View available conferences.
  - Register for conferences.
  - Access a personalized list of their registered conferences (`My Conferences`).

### Authentication & Authorization
- **JWT Authentication**:
  - Ensures secure user login by generating a token upon successful login/registration.
  - Tokens are validated on every request to protected endpoints.
- **Role-Based Authorization**:
  - Middleware restricts access to specific actions based on user roles (`admin` or `attendee`).
  - Ensures only authorized users can perform sensitive operations.

---

## Tech Stack
- **Frontend**: React.js  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication & Authorization**: JWT (JSON Web Tokens)  

---

## Authentication and Role-Based Authorization

### 1. **JWT Authentication Workflow**
- **Token Generation**:  
  - On login, a JWT is generated with user details (`userId` and `role`) and a secret key.
- **Token Validation**:  
  - Tokens are validated using middleware that checks the token's signature, expiration, and validity.
- **Secure Storage**:  
  - Tokens are stored in `localStorage` or HTTP-only cookies to prevent unauthorized access.

### 2. **Role-Based Authorization**
- Middleware checks the user's role after validating the JWT.
- Example:
  ```javascript
  const authorizeRoles = (roles) => (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: "Access denied" });
      }
      next();
  };
  ```

## API Endpoints

### Public Endpoints
#### Authentication
- **POST** `/api/auth/register`  
  - Register a new user.  
- **POST** `/api/auth/login`  
  - Log in an existing user.  
- **POST** `/api/auth/logout`  
  - Log out the user.

#### Conferences
- **GET** `/api/conferences`  
  - Retrieve a list of all available conferences.  
  - Accessible to both admins and attendees.  

- **GET** `/api/conferences/:id`  
  - Retrieve detailed information about a specific conference.  

### Protected Endpoints (JWT Required)
#### Conferences
- **POST** `/api/conferences`  
  - Add a new conference (admin-only).  
  - Requires the `verifyToken` middleware to ensure user authentication.  

- **PUT** `/api/conferences/:id`  
  - Update details of a specific conference (admin-only).  
  - Requires the `verifyToken` middleware.  

- **DELETE** `/api/conferences/:id`  
  - Delete a specific conference (admin-only).  
  - Requires the `verifyToken` middleware.

#### Registrations
- **POST** `/api/registrations`  
  - Register for a conference (attendee-only).  
  - Handles file uploads (e.g., payment proof) using the `multer` middleware.  

- **GET** `/api/registrations/user/:userId`  
  - View registrations by a specific user (admin-only).  

- **GET** `/api/registrations/conference/:conferenceId`  
  - View registrations for a specific conference (admin-only).  

- **PUT** `/api/registrations/:id/approve`  
  - Approve a specific registration (admin-only).  

- **DELETE** `/api/registrations/:id`  
  - Delete a specific registration (admin-only).
