# Recipe Backend Scaffold

Minimal runnable backend for the Recipe Management project.

**Features included (minimal):**
- User registration & login (JWT)
- Profile (get current user)
- Recipes: create, list, get, update, delete (owner-only)
- Image upload (local `/uploads` via multer)
- SQLite by default (no extra setup). Optionally use Postgres by setting DATABASE_URL in `.env`.

## Quick start (local)
1. unzip and `cd recipe-backend-scaffold`
2. copy `.env.example` to `.env` and edit if needed
3. `npm install`
4. `npm start`
5. Server listens on `http://localhost:4000` (or PORT in .env)

## Notes
- Sequelize sync is used (no migrations) for simplicity.
- To use PostgreSQL, set `DATABASE_URL` in `.env` and install `pg` package (replace sqlite3).

