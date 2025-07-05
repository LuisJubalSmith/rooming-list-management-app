Rooming List Management App

The **Rooming List Management App** is a full-stack application designed to help event planners and hotels manage rooming lists and bookings for events efficiently. It provides functionality to create, import, and associate bookings with specific rooming lists, as well as view and filter them using an intuitive user interface.

---

## 📦 Tech Stack

- **Frontend**: React (Next.js), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **State Management**: Zustand
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose

---

## 🚀 Features

- Create and manage Rooming Lists and Bookings.
- Import data from JSON files.
- View bookings grouped by Rooming List.
- Filter rooming lists by status, search text, or event ID.
- Secure routes using JWT-based authentication.
- Dockerized setup for consistent and easy deployment.

---

## 📁 Project Structure

Rooming-List-Management-App/
├── client/ # Frontend (Next.js)
├── server/ # Backend (Node.js + Express)
├── data/ # JSON data files for import
├── scripts/
│ └── init.sql # SQL file to initialize the database schema
├── .env # Environment variables
├── docker-compose.yml # Docker orchestration
└── README.md

## 🛠️ Running the Project

The first thing we have to do is install the node_modules: we start with server, move to the server file, cd server.
Luis@MacBook-Pro-5 server %
inside the server directory, use the yarn install or npm install command. This will create the node_modules folder with all the necessary packages for the server to work.

Now go to the client directory. From the project root, move to the client directory, open a new terminal, and type cd client.
Luis@MacBook-Pro-5 client %
Inside the directory, use the yarn install or npm install command to download the node_modules directory.

### ✅ Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)

---

## 🐳 Running with Docker (Recommended)

This method sets up PostgreSQL, Backend, and Frontend automatically using Docker.

### 1. ⚙️ Create the Docker Image & Containers

In the project root:

```bash
docker-compose up --build

A. This will:
- Build backend and frontend images.
- Start PostgreSQL with a persistent volume
- Export ports: Backend API: http://localhost:3001 and Frontend App: http://localhost:3000.

B. Initialize the Database
Once the containers are running, in a separate terminal, run:
docker cp ./scripts/init.sql postgres_rooming:/init.sql;
docker exec -it postgres_rooming psql -U postgres RoomingListManagementApp -f /init.sql;
This will create the tables rooming_lists, bookings, and rooming_list_bookings.

C. Import Sample Data(optional)
Run the import route with authentication:
curl -X POST http://localhost:3001/api/import/data -H "x-auth-token: <your_jwt_token>"


🧑‍💻 Running Locally (Without Docker)

A. 🐘 Start PostgreSQL locally
Ensure PostgreSQL is installed and running on your machine(I used pgAdmin 4 as a tool to work with PostgreSQL and it was quite easy to use.).
Create a database: CREATE DATABASE "RoomingListManagementApp";
Run the init.sql manually or via CLI: psql -U postgres -d RoomingListManagementApp -f scripts/init.sql

B. 🔧 Configure .env File
Create a .env file in the server/ folder with the following variables:
PORT=3001
JWT_SECRET=your_secret_key
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_db_password
PGDATABASE=RoomingListManagementApp
PGPORT=5432

C. 🚀 Start the Backend Server
In the server/ directory: nodemon index
D. 🎨 Start the Frontend
In the client/ directory:
yarn install
yarn dev
App will be available at: http://localhost:3000

To run the project both locally and from Docker we have to modify the default.json file To run the project both locally and from Docker, we need to modify the default.json file, located at server/config/default.json To run the project both locally and from Docker, we need to modify the default.json file located in server/config/default.json. Here we will modify the following line of code: "host": "localhost". This is used for local mode: "host": "localhost", and for Docker mode: "host": "postgres_rooming".


🧪 Testing API Routes
Use tools like Postman or cURL to interact with the API:
POST /api/import/data – Imports rooming lists and bookings.
GET /api/rooming-lists – Fetch all rooming lists.
GET /api/bookings/bookings-for-rooming – Bookings grouped by rooming list.
POST /api/bookings/:rooming_list_id/create – Add booking to a rooming list.

👥 Contributing
Feel free to fork the repo, improve it, and open a pull request!
📄 License
This project is licensed under the MIT License.
🌐 Author
Luis Smith – LinkedIn – GitHub
```
