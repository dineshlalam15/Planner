## Task Manager Application - API 

This repository contains the API code for entired end to end task managing features

### Features

* User registration (with optional display picture upload)
* User login (user can login using Google OAuth2)
* User logout
* Refresh access token
* Get user details
* Update user details (including display picture)
* Change password
* Delete user account
* Delete user display picture
* Create task (with assigned users)
* Get task details
* Update task details (including assigned users)
* Delete task
* Create subtask

### Installation

**Prerequisites:**

* Node.js and npm (or yarn) installed on your machine.
* A MongoDB database instance.
* A Cloudinary account for storing display pictures (optional).

**Steps:**

1. Clone the repository:

```bash
git clone https://github.com/your-username/Planner.git
```

2. Navigate to the project directory:

```bash
cd Planner
```

3. Install the dependencies (check package.json file):

```bash
npm install
```

4. Create a `.env` file in the root directory of the project and add the required environment variables.

5. (Optional) Create a Google Cloud Platform project and configure the Google OAuth2 client ID and secret for user login.

**Running the API:**

1. Start the server:

```bash
npm start
```

This will start the API server on the port specified in the `.env` file (default: 3000). You can access the API documentation and endpoints using tools like Postman.


### API Endpoints

**User Management:**

* **Register User (POST /api/v1/users/register):** Creates a new user. You can upload a display picture for the user along with other details.
* **Login User (POST /api/v1/users/login):** Authenticates a user using Google OAuth2 and returns access and refresh tokens.
* **Refresh Access Token (GET /api/v1/users/refresh-accesstoken):** Refreshes an expired access token. Requires a valid refresh token.
* **Get User Details (GET /api/v1/users/user):** Retrieves the details of the currently logged-in user. Requires a valid access token.
* **Logout User (GET /api/v1/users/logout):** Logs out the currently logged-in user. Requires a valid access token.
* **Change Password (PATCH /api/v1/users/changepassword):** Changes the password of the currently logged-in user. Requires a valid access token.
* **Update User Details (PATCH /api/v1/users/updatedetails):** Updates the details of the currently logged-in user (including display picture). Requires a valid access token.
* **Delete User Account (DELETE /api/v1/users/deleteuser):** Deletes the account of the currently logged-in user. Requires a valid access token.
* **Delete User Display Picture (DELETE /api/v1/users/deletedp):** Deletes the display picture of the currently logged-in user. Requires a valid access token.

**Task Management:**

* **Create Task (POST /api/v1/tasks/createtask):** Creates a new task with assigned users. Requires a valid access token.
* **Get Task Details (GET /api/v1/tasks/:id):** Retrieves the details of a specific task. Requires a valid access token.
* **Update Task Details (PATCH /api/v1/tasks/:id):** Updates the details of a specific task (including assigned users). Requires a valid access token.
* **Delete Task (DELETE /api/v1/tasks/:id):** Deletes a specific task. Requires a valid access token.
* **Create Subtask (POST /api/v1/tasks/:id/createsubtask):** Creates a new subtask for a