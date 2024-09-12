# Online-Learning-Platform-backend

# Project Setup Instructions

Follow these steps to set up the project on your local machine.

## Prerequisites

Make sure you have the following software installed:

- **Node.js** (version 14.x or higher) – [Download Node.js](https://nodejs.org/)
- **MongoDB** (for the database) – [Download MongoDB](https://www.mongodb.com/try/download/community)
- **Git** (optional, for version control) – [Download Git](https://git-scm.com/downloads)

## Setup Instructions

### 1. Clone the Repository

First, clone the project repository from GitHub or any other repository hosting service:

```bash
git clone <repository-url> 
```

### 2. Navigate to the Project Directory

```bash
cd your-project-folder-name
```
### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

The project uses environment variables to store sensitive information like the API key for OpenAI and database credentials.

#### 1. Create a .env file in the root directory of your project

#### 2. Add the following environment variables to the .env file
```bash
PORT=5000
JWT_SECRET= your_JWT_Secret_string 
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
```
  - **OPENAI_API_KEY**: Replace `your_openai_api_key` with your OpenAI API key.
  - **JWT_SECRET**: Replace `your_JWT_Secret_string` with your JWT Secret key.
  - **MONGODB_URI**: Replace `your_mongodb_connection_string` with your MongoDB connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.ibszb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).

#### 3. **Save the `.env` file**.

### 5. Start the MongoDB Server

If MongoDB is installed locally, start the MongoDB service by running the following command

``` bash
mongod
```

### 6. Run the Application

Now that everything is set up, you can start the Node.js server.

```bash
npm run start
```

The server will start at `http://localhost:5000` by default.
