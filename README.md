# BlaBlaBook

> A modern book-sharing platform where readers can discover, track, and share their reading journeys.

## Overview

**BlaBlaBook** 
 is a comprehensive web application that allows users to manage their personal library, discover new books, and see what their friends are reading. Built with modern web technologies, it offers a clear separation between the frontend and backend, containerized deployment with Docker, and a robust authentication system.

## Tech Stack

### Backend (API)
- **[Express.js 5](https://expressjs.com/)** - Fast, unopinionated web framework
- **[Sequelize](https://sequelize.org/)** - Promise-based ORM for PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Reliable relational database
- **[Argon2](https://www.npmjs.com/package/argon2)** - Industry-standard password hashing
- **[JWT](https://jwt.io/)** - Secure token-based authentication
- **[Joi](https://joi.dev/)** - Schema validation for user inputs
- **[http-status-codes](https://www.npmjs.com/package/http-status-codes)** - Standardized HTTP response codes
- **[express-xss-sanitizer](https://www.npmjs.com/package/express-xss-sanitizer)** - Protection against XSS attacks
- **[CORS](https://www.npmjs.com/package/cors)** - Configured cross-origin resource sharing
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment variable management

### Frontend (Client)
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[SvelteKit](https://kit.svelte.dev/)** - Framework for building web applications
- **[Iconify](https://iconify.design/)** - Icon framework for Svelte

### DevOps & Tools
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration
- **[ESLint](https://eslint.org/)** - Code linting and quality


## Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Book Discovery** - Search books by title or author with accent-insensitive search
- **Personal Library** - Track your reading progress with custom statuses
- **Reading Statuses** - Organize books: "to read", "reading", "finished", etc.
- **Admin Dashboard** - Manage books, authors, categories, and users
- **Random Recommendations** - Discover new books on the homepage
- **Responsive Design** - Works seamlessly on desktop and mobile

## Getting Started

### Prerequisites

- **Docker** & **Docker Compose** installed ([Get Docker](https://docs.docker.com/get-docker/))
- **Node.js 18+** (if running without Docker)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/O-clock-Dundee/dwwm-blablabook.git
   cd dwwm-blablabook
   ```

2. **Set up environment variables**

   Copy the example environment files:
   ```bash
   cp .database.docker.env.example .database.docker.env
   cp client/.env.example client/.env
   ```

   Edit `.database.docker.env` with your database credentials:
   ```env
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_DB=blablabook
   ```

   The `client/.env` is pre-configured for Docker networking:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Launch the application**
   ```bash
   docker-compose up
   ```

   This will start three containers:
   - **PostgreSQL** database on port `5433` (to avoid conflicts with local PostgreSQL)
   - **API** backend on port `3000`
   - **Client** frontend on port `5173`

4. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:3000](http://localhost:3000)

### Database Setup

The PostgreSQL container automatically runs initialization scripts on first launch:
- **`00_enable_unaccent.sql`** - Enables the `unaccent` extension for accent-insensitive searches
- **`01_create_tables.sql`** - Creates all database tables and relationships
- **`02_seed_tables.sql`** - Populates initial data (books, authors, categories)

The database uses a **persistent volume** (`pg-blablabook`), so your data survives container restarts.


## Project Structure

```
dwwm-blablabook/
├── api/                          # Backend Express.js application
│   ├── app.js                    # Main entry point with middleware setup
│   ├── controllers/              # Request handlers (auth, book, admin)
│   ├── routes/                   # API endpoint definitions
│   ├── models/                   # Sequelize database models
│   ├── middlewares/              # Authentication and authorization
│   ├── data/                     # Database initialization scripts
│   ├── Dockerfile.api            # Docker configuration for API
│   └── package.json              # Backend dependencies
│
├── client/                       # Frontend SvelteKit application
│   ├── src/
│   │   ├── routes/               # SvelteKit pages and server endpoints
│   │   ├── lib/                  # Utilities, components, stores
│   │   └── app.html              # HTML template
│   ├── Dockerfile.cli            # Docker configuration for client
│   └── package.json              # Frontend dependencies
│
├── docker-compose.yml            # Docker orchestration configuration
├── .database.docker.env.example  # Example database environment variables
└── package.json                  # Root scripts for monorepo
```

## Key Dependencies Explained

### Security & Authentication

- **Argon2**: A memory-hard password hashing algorithm that won the Password Hashing Competition. It's resistant to GPU cracking attacks and provides excellent security for user passwords.

- **JWT (jsonwebtoken)**: Enables stateless authentication. Tokens are signed with a secret key and stored in HTTP-only cookies to prevent XSS attacks.

- **express-xss-sanitizer**: Automatically sanitizes user inputs to prevent Cross-Site Scripting (XSS) attacks by removing dangerous HTML/JS from request bodies.

### Validation & Standards

- **Joi**: Powerful schema validation library that ensures user inputs meet expected formats (email structure, password strength, required fields). Provides clear error messages in French for better UX.

- **http-status-codes**: Provides named constants for HTTP status codes (`StatusCodes.OK`, `StatusCodes.UNAUTHORIZED`), making responses more readable and maintainable.

### Database & ORM

- **Sequelize**: ORM that translates JavaScript objects into SQL queries. Handles relationships between models (Users, Books, Authors, Categories) and provides migration-like capabilities.

- **PostgreSQL with `unaccent`**: The `unaccent` extension allows searches to match "José" when searching for "Jose", perfect for international book titles and author names.

### Development Tools

- **Node.js --watch**: Built-in file watcher (Node 18+) that automatically restarts the server when files change, replacing the need for `nodemon`.

- **Vite**: Modern build tool that provides instant hot module replacement (HMR) during development, making the development experience incredibly fast.

- **concurrently**: Runs multiple npm scripts in parallel (frontend + backend) from a single terminal command.

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/add` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT token | No |

### Book Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/books/random` | Get 3 random books | No |
| GET | `/books/title/:titleSearched` | Search books by title | Yes |
| GET | `/books/author/:authorSearched` | Search books by author | Yes |
| GET | `/books/:userId` | Get user's book library | Yes |
| GET | `/books/:bookId/:userId` | Get book details with user status | Yes |
| POST | `/books/:userId/:bookId` | Add book to user's library | Yes |
| PATCH | `/books/:userId/:bookId` | Update book reading status | Yes |
| DELETE | `/books/:userId/:bookId` | Remove book from library | Yes |

### Admin Endpoints

All admin endpoints require authentication with `is_admin = true`:

- **Categories**: `GET`, `POST`, `PATCH`, `DELETE` `/admin/categories`
- **Authors**: `GET`, `POST`, `PATCH`, `DELETE` `/admin/authors`
- **Users**: `GET`, `POST`, `PATCH`, `DELETE` `/admin/users`
- **Books**: `GET`, `POST`, `PATCH`, `DELETE` `/admin/books`


## Docker Architecture

The application uses **Docker Compose** to orchestrate three services:

### 1. Database Service (`db`)
- **Image**: Official PostgreSQL image
- **Port**: `5433:5432` (external:internal)
- **Volume**: Persistent storage for data (`pg-blablabook`)
- **Initialization**: Automatically runs SQL scripts from `api/data/`
- **Environment**: Configured via `.database.docker.env`

### 2. API Service (`api`)
- **Build**: Custom Dockerfile (`Dockerfile.api`)
- **Port**: `3000:3000`
- **Depends on**: Database service (waits for it to start)
- **Volume**: Bind mount for live code reloading
- **Node modules**: Separate anonymous volume to prevent conflicts

### 3. Client Service (`client`)
- **Build**: Custom Dockerfile (`Dockerfile.cli`)
- **Port**: `5173:5173`
- **Depends on**: API service
- **Volume**: Bind mount for hot module replacement
- **Environment**: Configured via `client/.env`

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL container is running: `docker ps`
- Check database logs: `docker logs blablabook-database`
- Verify credentials in `.database.docker.env`

### Frontend Can't Connect to API

- Check that `VITE_API_BASE_URL` in `client/.env` matches your API URL
- Ensure CORS is properly configured in `api/app.js`

### Fresh Start

To completely reset the project:
```bash
docker-compose down -v  # Stop containers and remove volumes
docker-compose up       # Rebuild and start fresh
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test thoroughly
3. Commit with clear messages: `git commit -m "Add: new feature description"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request on GitHub


## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/O-clock-Dundee/dwwm-blablabook/issues)
- Contact the development team : 
    - Federica ZUCCHINI [GitHub](https://github.com/FedericaZucchini)
    - Sylvain ZIGONI [GitHub](https://github.com/SylvainZigoni)
    - Cédric CAMPAGNE [GitHub](https://github.com/CedricCampagne)
    - Valentin COLOMBAT [GitHub](https://github.com/ValentinColombat)


---

**Happy Reading!**
