# Movie Database Web App

A web application for managing a movie database, built with React and Material UI. This project interfaces with the Movie Database API to provide authentication and CRUD operations.

## Features

- **User Authentication**
  - Login and registration
  - Token-based authentication
  - Role-based access control (admin/user)

- **Movie Management**
  - Browse all movies with pagination
  - Search movies by title
  - View movie details including directors, actors, and genres
  - Create, edit, and delete movies (admin only)

- **UI Features**
  - Responsive design using Material UI
  - Form validation
  - Error handling
  - Loading states
  - Protected routes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Movie Database API running on http://localhost:5000

### Installation

1. Clone the repository
2. Install dependencies:

```
cd movie-database-api/client
npm install
```

3. Start the development server:

```
npm start
```

The application will be available at http://localhost:3000.

## Usage

### Authentication

- Use the registration page to create a new account
- Login with your credentials
- Admin users have additional privileges to create, update, and delete movies

### Movies

- Browse the movie list on the home page
- Use the search box to filter movies by title
- Click on a movie to view its details
- Admins can add new movies via the "Add Movie" button
- Admins can edit or delete existing movies

## API Integration

The web app connects to the Movie Database API with the following endpoints:

- Authentication: `/api/auth/*`
- Movies: `/api/movies/*`
- Directors: `/api/directors/*`
- Actors: `/api/actors/*`
- Genres: `/api/genres/*`

## Technologies Used

- React.js
- React Router
- Material UI
- Axios
- JWT Authentication 