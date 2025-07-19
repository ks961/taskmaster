# TaskMaster: A Collaborative Task Tracking System

The project involves building a collaborative task management platform using Node.js and Express.js, featuring a RESTful API and real-time updates via Socket.io. It supports user authentication and profile management, team creation with invitation and join workflows, and project grouping under teams with their own invitation and join mechanisms. Tasks can be created, listed (with optional status filtering), updated, searched by text, commented on, and have file attachments. Realtime notifications inform users of task assignments and updates. Additionally, the system integrates with a generative AI service to automatically generate descriptions for newly created tasks, enhancing productivity and consistency.

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/ks961/taskmaster
   ```

2. Navigate to the project directory:
   ```bash
   cd taskmaster
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the root of your project.
   - Add the following environment variables to the `.env` file:
     ```bash
     PORT=3000
     NODE_ENV=production
     REDIS_URI=your_redis_uri or redis://localhost:6379
     MONGO_URI=your_mongo_uri
     JWT_SEC=your_jwt_secret
     OPENAI_KEY=your_openai_api_key
     ```

5. Start the application:
   - For local development:
     ```bash
     npm run tsc
     ```
     and
     ```bash
     npm run dev
     ```
   - To Run Tests:
     ```bash
     npm run test
     ```
   - To Build:
     ```bash
     npm run build
     ```
   - For deployment (using pm2):
     ```bash
     pm2 start dist/app.js --name taskmaster
     ```

---

## API Documentation

### POST `/v1/users/signup`

**Description:**
Handles user signup by creating a new user account.

**Route:**

```js
usersRouter.post("/signup", [
    validate(vSignupCreds, "body"),
    UserController.signup
]);
```

**Request Body Parameters:**

* **username** (required): The username of the user.

  * **Type**: `string`
  * **Validation**: Must be provided and non-empty.

* **email** (required): The email address of the user.

  * **Type**: `string`
  * **Validation**: Must be a valid email format and non-empty.

* **password** (required): The password for the user account.

  * **Type**: `string`
  * **Validation**: Must be at least 8 characters long.

**Response:**

* **201 Created**: Returns a success message indicating the user has been created successfully.

* **400 Bad Request**: Returns an error if the provided data is invalid (e.g., missing required fields or invalid format).

**Middleware:**

* `validate`: Validates the request body using the `vSignupCreds` schema.

**Controller:**

* `UserController.signup`: Handles the logic for registering the user.

---

### POST `/v1/users/login`

**Description:**
Handles user login by verifying credentials and issuing a token.

**Route:**

```js
usersRouter.post("/login", [
    validate(vLoginCreds, "body"),
    UserController.login
]);
```

**Request Body Parameters:**

* **email** (required)

  * **Type**: `string`

* **password** (required)

  * **Type**: `string`

**Response:**

* **200 OK**: Returns a success message and authentication token.

* **400 Bad Request**: Returns an error if the provided credentials are invalid.

**Middleware:**

* `validate`: Validates the request body using the `vLoginCreds` schema.

**Controller:**

* `UserController.login`: Authenticates the user and returns a token.

---

### GET `/v1/users/`

**Description:**
Fetches the authenticated user's profile information.

**Route:**

```js
usersRouter.get("/", [
    isAuthenticated,
    UserController.profile
]);
```

**Request Query Parameters:**
*None*

**Response:**

* **200 OK**: Returns the user profile data.

* **401 Unauthorized**: Returned if the request is made without valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated before accessing the route.

**Controller:**

* `UserController.profile`: Retrieves and returns the user's profile.

---

### PATCH `/v1/users/`

**Description:**
Updates the authenticated user's profile information.

**Route:**

```js
usersRouter.patch("/", [
    isAuthenticated,
    validate(vUpdateUser, "body"),
    UserController.updateProfile
]);
```

**Request Body Parameters:**

* **name** (optional)

  * **Type**: `string`

* **email** (optional)

  * **Type**: `string`

**Response:**

* **200 OK**: Returns a success message and updated user profile.

* **400 Bad Request**: Returns an error if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates the request body using the `vUpdateUser` schema.

**Controller:**

* `UserController.updateProfile`: Handles updating user profile details.

---

### GET `/v1/users/logout`

**Description:**
Logs out the authenticated user.

**Route:**

```js
usersRouter.get("/logout", [
    isAuthenticated,
    UserController.logout
]);
```

**Request Query Parameters:**
*None*

**Response:**

* **200 OK**: Returns a success message confirming logout.

* **401 Unauthorized**: Returned if the request is made without valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

**Controller:**

* `UserController.logout`: Handles user logout.

---

### POST `/v1/teams/`

**Description:**
Creates a new team.

**Route:**

```js
teamsRouter.post("/", [
    isAuthenticated,
    validate(vCreateTeam, "body"),
    TeamsController.create
]);
```

**Request Body Parameters:**

* **name** (required)

  * **Type**: `string`

**Response:**

* **201 Created**: Returns the newly created team details.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates the request body using the `vCreateTeam` schema.

**Controller:**

* `TeamsController.create`: Handles team creation logic.

---

### GET `/v1/teams/invites`

**Description:**
Retrieves pending team invitations for the authenticated user.

**Route:**

```js
teamsRouter.get("/invites", [
    isAuthenticated,
    TeamsController.pendingInvitation
]);
```

**Request Query Parameters:**
*None*

**Response:**

* **200 OK**: Returns a list of pending invitations.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

**Controller:**

* `TeamsController.pendingInvitation`: Fetches pending team invitations for the user.

---

### GET `/v1/teams/:teamId`

**Description:**
Fetches members of the specified team.

**Route:**

```js
teamsRouter.get("/:teamId", [
    isAuthenticated,
    validate(vTeamId, "params"),
    TeamsController.members
]);
```

**Path Parameters:**

* **teamId** (required)

  * **Type**: `string`

**Response:**

* **200 OK**: Returns the list of team members.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates the route parameters using the `vTeamId` schema.

**Controller:**

* `TeamsController.members`: Fetches and returns team members.

---

### POST `/v1/teams/:teamId/invite`

**Description:**
Invites members to a specified team.

**Route:**

```js
teamsRouter.post("/:teamId/invite", [
    isAuthenticated,
    validate(vTeamId, "params"),
    validate(vInviteMembers, "body"),
    TeamsController.invite
]);
```

**Path Parameters:**

* **teamId** (required)

  * **Type**: `string`

**Request Body Parameters:**

* **members** (required)

  * **Type**: `array`
  * **Validation**: Must have at least 1 member.

**Response:**

* **200 OK**: Returns a success message confirming invitations.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `teamId` using `vTeamId` and `members` using `vInviteMembers`.

**Controller:**

* `TeamsController.invite`: Handles inviting users to the team.

---

### POST `/v1/teams/:teamId/join`

**Description:**
Allows an authenticated user to join the specified team.

**Route:**

```js
teamsRouter.post("/:teamId/join", [
    isAuthenticated,
    validate(vTeamId, "params"),
    TeamsController.join
]);
```

**Path Parameters:**

* **teamId** (required)

  * **Type**: `string`

**Response:**

* **200 OK**: Returns a success message confirming the user has joined the team.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates the route parameters using the `vTeamId` schema.

**Controller:**

* `TeamsController.join`: Handles team joining logic for the authenticated user.

---

### GET `/v1/teams/invites`

**Description:**
Retrieves the list of pending team invitations for the authenticated user.

**Route:**

```js
teamsRouter.get("/invites", [
    isAuthenticated,
    TeamsController.pendingInvitation
]);
```

**Request Query Parameters:**
*None*

**Response:**

* **200 OK**: Returns a list of pending invitations.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

**Controller:**

* `TeamsController.pendingInvitation`: Fetches pending invitations for the user.

---

### POST `/v1/projects/:teamId`

**Description:**
Creates a new project under the specified team.

**Route:**

```js
projectsRouter.post("/:teamId", [
    isAuthenticated,
    validate(vTeamId, "params"),
    validate(vCreateProject, "body"),
    ProjectsController.create
]);
```

**Path Parameters:**

* **teamId** (required)

  * **Type**: `string`

**Request Body Parameters:**

* **name** (required)

  * **Type**: `string`

**Response:**

* **201 Created**: Returns the created project details.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `teamId` using `vTeamId` and `name` using `vCreateProject`.

**Controller:**

* `ProjectsController.create`: Handles project creation under the specified team.

---

### GET `/v1/projects/:teamId`

**Description:**
Retrieves all projects under the specified team.

**Route:**

```js
projectsRouter.get("/:teamId", [
    isAuthenticated,
    validate(vTeamId, "params"),
    ProjectsController.projects
]);
```

**Path Parameters:**

* **teamId** (required)

  * **Type**: `string`

**Response:**

* **200 OK**: Returns a list of projects under the team.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates the route parameters using the `vTeamId` schema.

**Controller:**

* `ProjectsController.projects`: Fetches projects under the specified team.

---

### POST `/v1/projects/:projectId/invite`

**Description:**
Invites users to collaborate on the specified project.

**Route:**

```js
projectsRouter.post("/:projectId/invite", [
    isAuthenticated,
    validate(vProjectId, "params"),
    validate(vProjectInviteBody, "body"),
    ProjectsController.invite
]);
```

**Path Parameters:**

* **projectId** (required)

  * **Type**: `string`

**Request Body Parameters:**

* **userIds** (required)

  * **Type**: `string[]`
  * **Validation**: Must contain at least one user ID.

**Response:**

* **200 OK**: Returns a success message confirming invitations.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `projectId` using `vProjectId` and `userIds` using `vProjectInviteBody`.

**Controller:**

* `ProjectsController.invite`: Handles inviting users to the project.

---

### POST `/v1/projects/:projectId/join`

**Description:**
Allows an authenticated user to join the specified project.

**Route:**

```js
projectsRouter.post("/:projectId/join", [
    isAuthenticated,
    validate(vProjectId, "params"),
    ProjectsController.join
]);
```

**Path Parameters:**

* **projectId** (required)

  * **Type**: `string`

**Response:**

* **200 OK**: Returns a success message confirming the user has joined the project.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates the route parameters using the `vProjectId` schema.

**Controller:**

* `ProjectsController.join`: Handles joining the project for the authenticated user.

---

### POST `/v1/tasks/:projectId`

**Description:**
Creates a new task under the specified project.

**Route:**

```js
tasksRouter.post("/:projectId", [
    isAuthenticated,
    validate(vProjectId, "params"),
    validate(vCreateTaskGenQuery, "query"),
    validate(vCreateTask, "body"),
    TasksController.create
]);
```

**Path Parameters:**

* **projectId** (required)

  * **Type**: `string`

**Query Parameters:**

* **generateDescription** (optional)

  * **Type**: `boolean`

**Request Body Parameters:**

* **title** (required)

  * **Type**: `string`

* **dueDate** (required)

  * **Type**: `string`

* **description** (required)

  * **Type**: `string`

* **assignedTo** (optional)

  * **Type**: `string`

**Response:**

* **201 Created**: Returns the created task details.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `projectId` using `vProjectId` and request body using `vCreateTask`.

**Controller:**

* `TasksController.create`: Handles task creation under the specified project.

---

### GET `/v1/tasks/:projectId`

**Description:**
Retrieves tasks under the specified project, optionally filtered by status.

**Route:**

```js
tasksRouter.get("/:projectId", [
    isAuthenticated,
    validate(vProjectId, "params"),
    validate(vTaskStatus, "query"),
    TasksController.list
]);
```

**Path Parameters:**

* **projectId** (required)

  * **Type**: `string`

**Query Parameters:**

* **status** (optional)

  * **Type**: `string`
  * **Validation**: Must be either `"pending"` or `"completed"` if provided.

**Response:**

* **200 OK**: Returns the list of tasks, filtered if applicable.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `projectId` using `vProjectId` and `status` using `vTaskStatus`.

**Controller:**

* `TasksController.list`: Fetches tasks for the given project, with optional status filtering.

---

### PATCH `/v1/tasks/:taskId`

**Description:**
Updates the specified task with the provided fields.

**Route:**

```js
tasksRouter.patch("/:taskId", [
    isAuthenticated,
    validate(vTaskId, "params"),
    validate(vTaskUpdate, "body"),
    TasksController.update
]);
```

**Path Parameters:**

* **taskId** (required)

  * **Type**: `string`

**Request Body Parameters:**

* **title** (optional)

  * **Type**: `string`

* **dueDate** (optional)

  * **Type**: `string`

* **description** (optional)

  * **Type**: `string`

* **status** (optional)

  * **Type**: `string`

* **assignedTo** (optional)

  * **Type**: `string`

**Response:**

* **200 OK**: Returns the updated task details.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `taskId` using `vTaskId` and request body using `vTaskUpdate`.

**Controller:**

* `TasksController.update`: Handles task update logic.

---

### POST `/v1/tasks/:projectId/search`

**Description:**
Searches for tasks under the specified project based on text content.

**Route:**

```js
tasksRouter.post("/:projectId/search", [
    isAuthenticated,
    validate(vProjectId, "params"),
    validate(vTaskText, "body"),
    TasksController.search
]);
```

**Path Parameters:**

* **projectId** (required)

  * **Type**: `string`

**Request Body Parameters:**

* **text** (required)

  * **Type**: `string`
  * **Validation**: Minimum length of 3 characters.

**Response:**

* **200 OK**: Returns the list of matching tasks.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `projectId` using `vProjectId` and `text` using `vTaskText`.

**Controller:**

* `TasksController.search`: Handles task search logic within the project.

---

### POST `/v1/tasks/:taskId/comment`

**Description:**
Adds a comment to the specified task.

**Route:**

```js
tasksRouter.post("/:taskId/comment", [
    isAuthenticated,
    validate(vTaskId, "params"),
    validate(vTaskComment, "body"),
    TasksController.addComment
]);
```

**Path Parameters:**

* **taskId** (required)

  * **Type**: `string`

**Request Body Parameters:**

* **comment** (required)

  * **Type**: `string`
  * **Validation**: Minimum length of 5 characters.

**Response:**

* **201 Created**: Returns the added comment.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `taskId` using `vTaskId` and `comment` using `vTaskComment`.

**Controller:**

* `TasksController.addComment`: Handles adding a comment to the task.

---

### POST `/v1/tasks/:taskId/attachment`

**Description:**
Uploads an attachment to the specified task.

**Route:**

```js
tasksRouter.post("/:taskId/attachment", [
    isAuthenticated,
    validate(vTaskId, "params"),
    multerService.middleware(),
    TasksController.addAttachment
]);
```

**Path Parameters:**

* **taskId** (required)

  * **Type**: `string`

**Request Body:**

* **Multipart/Form-Data** containing a file upload.

**Response:**

* **201 Created**: Returns the uploaded attachment's metadata.

* **400 Bad Request**: Returned if validation fails or no file is uploaded.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `taskId` using `vTaskId`.

* `multerService.middleware()`: Handles file upload via multipart/form-data.

**Controller:**

* `TasksController.addAttachment`: Processes and stores the uploaded attachment.

---

### GET `/v1/tasks/:taskId/:attachment`

**Description:**
Fetches a specific attachment for the given task.

**Route:**

```js
tasksRouter.get("/:taskId/:attachment", [
    isAuthenticated,
    validate(vTaskId, "params"),
    validate(vTaskAttachment, "params"),
    TasksController.attachment
]);
```

**Path Parameters:**

* **taskId** (required)

  * **Type**: `string`

* **attachment** (required)

  * **Type**: `string`
  * **Validation**: Minimum length of 3 characters.

**Response:**

* **200 OK**: Returns the attachment file.

* **400 Bad Request**: Returned if validation fails.

* **401 Unauthorized**: Returned if the request lacks valid authentication.

* **404 Not Found**: Returned if the attachment is not found.

**Middleware:**

* `isAuthenticated`: Ensures the user is authenticated.

* `validate`: Validates `taskId` and `attachment` using `vTaskId` and `vTaskAttachment`.

**Controller:**

* `TasksController.attachment`: Handles fetching and returning the specified attachment.

Perfect. Based on your setup, here's how the documentation would look under your new section:

---

## Realtime notification with Socket.io

### Event `init:userid`

**Description:**
Important: Should be Sent by the client immediately after establishing a connection to register their `userId` with the server.

**Client should emit:**

```js
socket.emit("init:userid", JSON.stringify({ userId: "abc123" }));
```

**Payload:**

```ts
{
    userId: string;
}
```

**Server-side behavior:**

* Registers the socket with the userId in `SockMap`.
* Emits a `error:client` event if the payload is invalid or malformed.

---

### Event `error:client`

**Description:**
Emitted by the server when the client sends an invalid or malformed event payload.

**Client should listen with:**

```js
socket.on("error:client", (message) => {
    console.error("Socket error:", message);
});
```

**Payload:**

```ts
string  // Error message describing the issue
```

**Emitted by:**

* Server, in response to bad input (e.g. malformed `init:userid` payload).

---

### Event `task:assigned`

**Description:**
Emitted by the server when a task is assigned to a specific user.

**Client should listen with:**

```js
socket.on("task:assigned", (payload) => {
    // handle assigned task
});
```

**Payload:**

```ts
{
    title: string,
    taskId: string,
    projectId: string,
    taskCreator: string,
    assignedTo: string,
    status: "pending" | "completed",
    dueDate: string,
    description: string,
    comments: any[],
    attachments: any[],
}
```

**Emitted by:**

* Server, **to the specific user** via `socket.emit` after they are assigned a task.

---

### Event `task:updated`

**Description:**
Emitted by the server when a task assigned to the user is updated.

**Client should listen with:**

```js
socket.on("task:updated", (payload) => {
    // handle task update
});
```

**Payload:**

```ts
{
    title?: string,
    dueDate?: string,
    description?: string,
    status?: string,
    assignedTo?: string
}
```

**Emitted by:**

* Server, **to the specific user** whose assigned task has been updated.
