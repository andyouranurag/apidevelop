# API Development for Database Protection

## Overview
This is a **REST API** built using **Express.js, Node.js, and MongoDB** with **token-based authentication**. Users can **store and retrieve data** securely, and authorized users can **download the data as a CSV file**.

## Features
✅ **MongoDB Integration** - Connects to a MongoDB database to store user data.  
✅ **Token-Based Authentication** - Secure access using JWT tokens.  
✅ **CSV Download** - Authorized users can download data as a CSV file.  
✅ **Field Selection** - Retrieve specific fields using query parameters.  
✅ **Role-Based Access** - Admins can access all data, while regular users get limited data.  
✅ **Error Handling** - Handles invalid requests and server errors properly.  
✅ **CORS & JSON Support** - Allows cross-origin requests and JSON payloads.

---

## Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/apidevelop
cd apidevelop
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/yourDB
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the Server
```sh
node server.js
```

Server will run on: **http://localhost:5000**

---

## Functionality Overview

### ✅ **Authentication & Security**
- Users must log in with valid credentials to obtain a **JWT token**.
- Only authenticated users can access the data.
- Admins have special privileges to retrieve all data.

### ✅ **Data Retrieval**
- Users can retrieve stored data securely.
- Query parameters allow for selective field retrieval.
- Role-based access ensures different levels of visibility.

### ✅ **Data Storage & Management**
- Users can submit data, which is stored in MongoDB.
- Proper validation ensures data integrity.

### ✅ **CSV File Download**
- Authorized users can download the data as a **CSV file**.
- The file is auto-generated and contains selected fields.

---

## Project Structure
```sh
.
├── server.js        # Main API server
├── package.json     # Dependencies and scripts
├── .env             # Environment variables
├── README.md        # Documentation
```

---

## Dependencies
- **express** - Web framework for Node.js
- **mongoose** - MongoDB object modeling
- **jsonwebtoken** - JWT authentication
- **cors** - Enable cross-origin requests
- **dotenv** - Load environment variables
- **csv-writer** - Generate CSV files

---

## License
This project is **open-source**. Feel free to modify and use it as needed. 🚀

