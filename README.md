🏨 Rooming List Management App
The Rooming List Management App is a full-stack web application that allows event planners and hotels to efficiently manage rooming lists and guest bookings for events. It supports the creation, import, and association of bookings with specific rooming lists, and offers a user-friendly interface for filtering, viewing, and managing this data.

---

## 🛠️ Tech Stack

• Frontend: Next.js, Tailwind CSS
• Backend: Node.js, Express
• Database: PostgreSQL
• State Management: Zustand
• Authentication: JWT (JSON Web Tokens)
• Containerization: Docker & Docker Compose

---

## 🚀 Features

• Create and manage rooming lists and bookings.
• Import data from JSON files.
• View bookings grouped by rooming list.
• Filter rooming lists by status, event ID, or search term.
• Secure routes with JWT-based authentication.
• Dockerized environment for simplified deployment and consistency.

---

## 📁 Project Structure

Rooming-List-Management-App/
├── client/ # Frontend (Next.js)
├── server/ # Backend (Node.js + Express)
├── scripts/
│ └── init.sql # SQL file to initialize the database schema
├── .env # Environment variables
├── docker-compose.yml # Docker orchestration
└── README.md

## ✅ Prerequisites

Before running the project, make sure you have the following installed:
• [Node.js](https://nodejs.org/)
• [Yarn or npm](https://yarnpkg.com/)
• PostgreSQL (for local setup)
• [Docker & Docker Compose](https://docs.docker.com/get-docker/)

## 🛠️ Running the Project

The first thing we have to do is install the node_modules: we start with server, move to the server file, cd server.
Luis@MacBook-Pro-5 server %
inside the server directory, use the yarn install or npm install command. This will create the node_modules folder with all the necessary packages for the server to work.

Now go to the client directory. From the project root, move to the client directory, open a new terminal, and type cd client.
Luis@MacBook-Pro-5 client %
Inside the directory, use the yarn install or npm install command to download the node_modules directory.

## 🛠️ Configuration Note

The backend uses a default.json configuration file (/server/config/). Be sure to adjust the "host" property according to the environment:
• For local development:
"host": "localhost"
• For Docker:
"host": "postgres_rooming"

## 🐳 Running the Project with Docker (Recommended)

This is the easiest way to set up the project with PostgreSQL, backend, and frontend fully configured.

## 1. Start the Docker Environment

From the root of the project:
docker-compose up --build
This will:
• Build the backend and frontend images.
• Start the PostgreSQL service (postgres_rooming) with a persistent volume.
• Expose:
o Backend: http://localhost:3001
o Frontend: http://localhost:3000

If the Docker container has already been created, use the following command:
docker-compose up

View existing containers (even stopped ones):
docker ps -a

Stop containers:
docker-compose down

## 2. Initialize the Database Schema

In a separate terminal:
docker cp ./scripts/init.sql postgres_rooming:/init.sql
docker exec -it postgres_rooming psql -U postgres RoomingListManagementApp -f /init.sql
This creates the necessary tables: rooming_lists, bookings, and rooming_list_bookings.

## 3. Import Sample Data (Optional)

To import example data:
curl -X POST http://localhost:3001/api/import/data -H "x-auth-token: <your_jwt_token>"
Replace <your_jwt_token> with a valid token from the login endpoint.

## 🧑‍💻 Running the Project Locally (Without Docker)

## A. Start PostgreSQL

    Make sure PostgreSQL is installed and running locally. You can use tools like pgAdmin 4 to simplify database management.
    Create the database:
    CREATE DATABASE "RoomingListManagementApp";
    Then run the SQL initialization script:
    psql -U postgres -d RoomingListManagementApp -f scripts/init.sql

## B. Install Dependencies

    1.	Backend
    cd server
    yarn install    # or npm install
    2.	Frontend
    cd ../client
    yarn install    # or npm install

## C. Configure Environment Variables

    1.	In .env:
        PGHOST=localhost
        PGUSER=postgres
        PGPASSWORD=your_db_password
        PGDATABASE=RoomingListManagementApp
        PGPORT=5432
    2.	In project root .env:
        PORT=3001
    3.	In .env:
        NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/

## E. Start the Application

    1.	Backend
        cd server
        yarn dev   # or use nodemon index
    2.	Frontend
        cd client
        yarn dev

Visit http://localhost:3000 to access the app.

## 📬 API Endpoints

Use tools like Postman or curl to test API routes:
Method Endpoint Description
POST /api/import/data Import sample rooming lists and bookings
GET /api/rooming-lists Fetch all rooming lists
GET /api/bookings/bookings-for-rooming Bookings grouped by rooming list
POST /api/bookings/:rooming_list_id/create Add booking to a rooming list

## 🔧 Running Tests

## 🧪 Backend API Tests

Tests for backend endpoints are written using Jest and Supertest.
To run backend tests:
cd server
yarn test # or npm test
Example tests include:
• User authentication (/api/auth/login)
• Rooming list routes (/api/rooming-lists)
• Booking creation and association

## 🧪 Frontend Component Tests

Frontend components are tested using Jest and React Testing Library.
To run frontend tests:
cd client
yarn test # or npm test
Components covered:
• Home – renders rooming list grid correctly.
• RoomingForm – creates a new rooming list via form.
• Search – filters and updates Zustand store.
• BookingForm – submits a new booking for a selected rooming list.
You can find tests in the /client/src/test/ directory.

## 👥 Contributing

Contributions are welcome! Feel free to fork the repository, open an issue, or submit a pull request with improvements or bug fixes.

## 📄 License

This project is licensed under the MIT License.

## 🌐 Author

Luis Smith – LinkedIn – GitHub

```

```
