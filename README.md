# Fitness app - assignment

### Requirements

- node.js ^16.0.0
- postgres ^16
- favourite IDE
- git

### How to start

- fork or download this repository
- install dependencies with `npm i`
- create fitness_app database (application access `postgresql://localhost:5432/fitness_app`, make sure you use correct
  port and db name )
- create db schema and populate db with `npm run seed`
- run express server with `npm start`

### How submit assignment

- create public bitbucket or github repository
- commit and push changes continuously
- use proper commit messages
- share your solution with us (link or read permissions for miroslava.filcakova@goodrequest.com)

### You can

- change project structure
- change or add any npm module
- change db model (add tables, table columns...)
- change anything if you can say why

***

## Scenario

The goal of this assignement is to modify given REST API written in express.js using typescript. Public API consist of 2
endpoints `[get]` `localhost:8000/exercises` (list of exercises) and `[get]` `localhost:8000/programs` programs (list of
programs).

Structure of API responses

```javascript
{
    data: {
        id: 1
    }
    message: 'You have successfully created program'
}
```

or

```javascript
{
    data: [{
        id: 1,
        name: 'Program 1'
    }]
    message: 'List of programs'
}
```

***

## Task 1

Create authorization layer to enable users to access private API (next Task)

- create new db model User(name:string , surname: string, nickName:string, email: string, age: number,
  role:[ADMIN/USER])
- add authorization layer
- user can register using email, password and role (for purpose of this assignment, user can choose his role in
  registration)
- user can log in with email and password
- use proper way how to store user data
- you can use any authorization approach or npm module (preferred is JWT strategy and passport)

***

## Task 2

Create private API for user with role [ADMIN]

ADMIN can:

- create, update or delete exercises
- edit exercises in program (add or remove)
- get all users and all its data
- get user detail
- update any user (name, surname, nickName, age, nickName, role)

## Task 3

***

Create private API for user with role [USER]

USER can:

- get all users (id, nickName)
- get own profile data (name, surname, age, nickName)
- track exercises he has completed (he can track same exercise multiple times, we want to save datetime of completion
  and duration in seconds)
- see list of completed exercises (with datetime and duration) in profile
- remove tracked exercise from completed exercises list

USER cannot:

- access ADMIN API
- get or update another user profile

***

## Bonus task 1 - pagination, filter, search

Add pagination to exercise list using query => `/exercises?page=1&limit=10` return 1 page of exercises in maximal length
of 10.

Add filter by program => `/exercises?programID=1` return only exercises of program with id = 1

add fultext search on exercise name => `/exercises?search=cis` => return only exercises which name consist of string
`cis`
***

## Bonus task 2 - validation

Create validation service to check request body, query and params to make sure user sends valid request. For example, in
registration, user must send valid email, otherwise return status code 400.
Also you can use validation on query in bonus task 1.

***

## Bonus task 3 - localization

Create localization service to send message attribute in API responses in correct language. Default language is EN,
optional is SK. User can send all requests with HTTP header `language: 'sk'` or `language: 'en'` to receive required
language localization.

example of response for request with `language: 'sk'`

```javascript
{
    data: {
        id: 1
    }
    message: 'Program bol úspešne vytvorený'
}
```

***

## Bonus task 4 - error handling

Create proper way how to handle all errors in application. Use console.error display error in terminal, user can never
see stack trace or real error message. You can write error logs to file.

response status code >= 500

```javascript
{
    data: {
    }
    message: 'Something went wrong'
}
```

***

# Assignment Documentation

## Dependencies

- bcrypt
- express-validator
- jsonwebtoken
- passport
- passport-jwt
- passport-local

---

## Project Structure

```
src/
├── config/
│   └── passport.ts
├── controllers/                # Controllers to handle DB calls
│   ├── exerciseController.ts
│   ├── programController.ts
│   ├── trackerController.ts
│   └── userController.ts
├── db/                         # DB models
│   ├── exercise.ts
│   ├── exerciseTracker.ts
│   ├── index.ts
│   ├── program.ts
│   └── user.ts
├── locales/                    # Localization files
│   ├── en.json
│   └── sk.json
├── middlewares/                # Auth, authorization, errors, validation
│   ├── authRoles.ts
│   ├── errorHandler.ts
│   ├── jwtAuth.ts
│   └── validator.ts
├── routes/                     # Public, Admin, User, Tracker routes
│   ├── admin.ts
│   ├── exercises.ts
│   ├── programs.ts
│   ├── test.ts
│   ├── tracker.ts
│   └── users.ts
├── types/
│   └── sequelize/
│       └── index.d.ts
├── utils/
│   ├── enums.ts
│   ├── localize.ts
│   └── index.ts
├── seed.ts
.env        # Environment variables (ignored in git)
```

---

## Environment Variables

`.env` file shared separately via email.

---

# API Documentation

All API responses support localization via the HTTP header:

```
language: en
```

or

```
language: sk
```

Protected endpoints require JWT:

```
Authorization: Bearer <jwt-token>
```

---

## USER API

### POST `/users/register`

Register a new user.

- **Auth:** No
- **Roles allowed:** All

#### Example Request

```json
{
  "name": "User",
  "surname": "Smith",
  "nickName": "user123",
  "email": "user@example.com",
  "password": "test1234",
  "age": 25,
  "role": "USER"
}
```

#### Example Response

```json
{
  "data": {
    "id": "5",
    "name": "User",
    "surname": "Smith",
    "nickName": "user123",
    "email": "user@example.com",
    "age": 25,
    "role": "USER"
  },
  "message": "User created successfully"
}
```

---

### POST `/users/login`

Login and receive a JWT.

- **Auth:** No
- **Roles allowed:** All

#### Example Request

```json
{
  "email": "user@example.com",
  "password": "test1234"
}
```

#### Example Response

```json
{
  "token": "jwt-token"
}
```

---

### GET `/users/`

Get a list of public user info.

- **Auth:** Yes
- **Roles allowed:** ADMIN, USER

---

### GET `/users/profile`

Get profile info and tracked exercises of the logged-in user.

- **Auth:** Yes
- **Roles allowed:** ADMIN, USER
  
---
## ADMIN API - USERS 
### GET `admin/users/`

Get list of all users detailed info.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### GET `admin/users/:id`

Get user by ID.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### PUT `/admin/users/:id`

Update user by ID.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### DELETE `/admin/delete/:id`

Delete user by ID.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

## ADMIN API - EXERCISES 

### POST `admin/exercises/add`

Create or update exercise.

- **Auth:** Yes
- **Roles allowed:** ADMIN

#### Example Body

```json
{
  "name": "Push-ups",
  "description": "Push-up exercise description",
  "programID": 1
}
```

---

### PUT `admin/exercises/:id`

Update exercise by ID.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### POST `admin/exercises/:id`

Get exercise by ID.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### POST `admin/exercises/delete/:id`

Delete exercise by ID.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

## ADMIN API - PROGRAMS 

### GET `admin/programs`

List all programs.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### GET `admin/programs/:id`

Get program details (and exercises).

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### POST `admin/programs/add`

Create new program.

- **Auth:** Yes
- **Roles allowed:** ADMIN
- 
#### Example Body
```
{
    "name": "New Program"
}
```
#### Example Response
```
{
    "data": {
        "id": "6",
        "name": "New Program",
        "updatedAt": "2025-07-08T21:38:33.689Z",
        "createdAt": "2025-07-08T21:38:33.689Z",
        "deletedAt": null
    },
    "message": "Program created successfully"
}
```
---

### DELETE `admin/programs/delete/:id`

Delete program (and its exercises).

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### POST `admin/programs/:id/add`

Add exercise to program with specific id.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

### DELETE `/programs/:programId/delete/:exerciseId`

Remove specific exercise from program.

- **Auth:** Yes
- **Roles allowed:** ADMIN

---

## TRACKER API

### GET `/tracker/`

List tracked exercises.

- **Auth:** Yes
- **Roles allowed:** ADMIN, USER

---

### POST `/tracker/add`

Add tracked exercise with current time.

- **Auth:** Yes
- **Roles allowed:** ADMIN, USER
- #### Example Body
```
{
    "exerciseID" : 1,
    "durationSeconds": 45
}
```
#### Example response
```
{
    "data": {
        "id": "6",
        "userID": "6",
        "exerciseID": "1",
        "completedAt": "2025-07-08T21:30:09.523Z",
        "durationSeconds": 45,
        "updatedAt": "2025-07-08T21:30:09.531Z",
        "createdAt": "2025-07-08T21:30:09.531Z",
        "deletedAt": null
    },
    "message": "Exercise tracking created successfully"
}
```
---

### DELETE `/tracker/delete/:id`

Delete tracked exercise by ID.

- **Auth:** Yes
- **Roles allowed:** ADMIN, USER

---
### GET `/exercises`

Get paginated list of exercises.

Supports:

- Pagination: `?page=1&limit=10`
- Filter by Program: `?programID=1`
- Search (case-insensitive): `?search=cis`

- **Auth:** Yes
- **Roles allowed:** ADMIN, USER

---

## Validation

Validation logic is handled in `validator.ts` via:

```
validateFunc(type: VALIDATION)
```

| Use Case    | Rules |
|-------------|---------------------------------------------------------|
| Register    | required fields, email format, password length, age range |
| Login       | email, password |
| Exercises   | name required, description, programID |
| Queries     | search, programID, page, limit |
| Params      | id must be positive integer |

---

## Localization

Localization via HTTP header:

```
language: en
```

or

```
language: sk
```

Translations stored in:

- `locales/en.json`
- `locales/sk.json`

---

## Error Handling

Errors >= 500 logged and return:

```json
{
  "data": {},
  "message": "Something went wrong"
}
```
