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

## ASSIGNMENT DOCUMENTATION

### Dependencies

- bcrypt
- express-validator
- jsonwebtoken
- passport
- passport-jwt
- passport-local

### Structure
```
src/
├──config/
│ └── passport.ts
├── controllers/ - Cotrollers used to handle calls to dtb
│ ├── exerciseController.ts
│ ├── programController.ts
│ ├── trackerController.ts
│ └── userController.ts
├── db/ - Dtbs models
│ ├── exercise.ts
│ ├── exerciseTracker.ts
│ ├── index.ts
│ ├── program.ts
│ └── user.ts
├── locales/ - Localization translations
│ ├── en.json
│ └── sk.json
├── middlewares/ - Middlewares to handle authentification, authorization, error messages and validation
│ ├── authRoles.ts
│ ├── errorHandler.ts
│ ├── jwtAuth.ts
│ └── validator.ts
├── routes/ - Routes for USERS - public, Admin - private API and tracker to track users exercises 
│ ├── admin.ts
│ ├── exercises.ts
│ ├── programs.ts
│ ├── test.ts
│ ├── tracker.ts
│ └── users.ts
├── types/
│ └── sequelize/
│ └── index.d.ts
├── utils/
│ ├── enums.ts
│ ├── localize.ts - Localization func
│──index.ts 
│──seed.ts 
│──.env (.gitignore) 
```
---
### Pagination
Pagination to exercise list using query `/exercises?page=1&limit=10`

### Filter
Filter by program id `/exercises?programID=1`

### Search
Fulltext search on exercise name `/exercises?search=cis` made with case-insensitive using `Op.iLike` from `"sequelize"`.

---
### Validation
Validation service to check request body, query and params to make sure user sends valid request.
Validation is handled by function `validateFunc(type: VALIDATION)` inside `validator.ts`.
Possible cases: **ID validation, Register/Login, Exercise Query, Exercise Creating.**

**Validation Rules**:
REGISTRATION:

- Required fields validation
- email
- password (length)
- age (min 3 / max 110)

LOGIN:

- email
- password

EXERCISES:

- name required
- description
- programID

QUERIES:

- search
- programID
- page
- limit

PARAMS:
For id validation:

- id (positive int)

---

### Localization

Localization service to send message attribute in API responses in correct language. Default language is EN, optional is
SK. User can send all requests with HTTP header language: 'sk' or language: 'en' to receive required language
localization.
Currently supported languages:
**eng** - English
**sk** - Slovak

Set `Header` to `language` with value `eng` or `sk`

Localization translation are stored in `locale/eng.json` or `locale/sk.json` files.

---
### Error handling
Error handling for errors with code >= 500.
Using `middlewares/errorHandler.ts` with `errorHandler`,
Printing errors to **console.error()** and writing file to **error.log**.
With final message sand to user:
` res.status(500).json({
        data: {},
        message: "Something went wrong",
    });`




