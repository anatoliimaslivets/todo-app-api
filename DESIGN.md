# Technical Design Document: Todo App API
## Overview
The Todo App is a web-based application that allows users to create and manage tasks. The application is designed to be simple, intuitive, and easy to use.

## Architecture
The backend is built with NestJS and uses a MySQL database to store and retrieve data.

## Components
The application consists of the following components:

### Backend
The backend is built using NestJS, a Node.js web framework. The backend consists of the following components:

- Controllers: Controllers handle incoming requests from the frontend, perform any necessary validation or data manipulation, and return a response to the frontend.
- Services: Services handle the business logic of the application. They communicate with the database and perform any necessary data manipulation or validation.
- Models: Models represent the data stored in the database.
- Repositories: Repositories handle the interaction between the services and the database. They perform CRUD operations on the data.

### Database
The database is built using MySQL, a powerful relational database system. The database consists of the following components:

- Tables: Tables store the data for the application. There is one tables: one for task, one for users.

### Features
The application includes the following features:

- Create Task: Users can create a new task.
- List Tasks: Users can view a list of all own tasks with status.
- Mark Task as Completed: Users can mark a task as completed, which updates the completion status of the task.
- Delete Task: Users can delete an existing task.

### Data Model
The database has two tables: user, todo. The tasks table has the following fields:

- id: A unique identifier for the task.
- title: The name of the task.
- completed: A boolean value indicating whether the task has been completed.
- userId - A unique identifier for the owner of the task (id of user).

### API Endpoints
The backend provides the following API endpoints:

- POST /todos: Creates a new task.
- GET /todos: Returns a list of all tasks.
- PUT /todos/:id: Updates the task with the specified ID.
- DELETE /todos/:id: Deletes the task with the specified ID.

### Security
The application uses several security measures to protect against common web application attacks:

Authentication: Users are required to log in to the application to access the task management features. Authentication is handled using JWT tokens.
Authorization: Users can only view, edit, and delete their own tasks. Authorization is handled on the backend.
Input Validation: All necessary data transmitted to the server is validated