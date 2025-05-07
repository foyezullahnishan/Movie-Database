# Movie Database API

A full-stack MERN application for managing a movie database with admin and user functionalities.

## Features

- User authentication (register, login, profile)
- Admin dashboard for user management
- Movie catalog with search and filtering
- Add, edit, and delete movies (admin only)
- Responsive design using Material UI

## Tech Stack

- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/foyezullahnishan/Movie_Database.git
cd Movie_Database
```

2. Install server dependencies
```
npm install
```

3. Install client dependencies
```
cd client
npm install
```

4. Create a .env file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

5. Run the database seeder to populate initial data
```
npm run seed
```

### Running the Application

1. Start the backend server
```
npm run dev
```

2. Start the frontend client (in a separate terminal)
```
cd client
npm start
```

3. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (protected)

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create a new movie (admin only)
- `PUT /api/movies/:id` - Update a movie (admin only)
- `DELETE /api/movies/:id` - Delete a movie (admin only)

### Admin
- Admin users can create other admin users
- Admin dashboard for managing users and content

## License

This project is licensed under the MIT License 