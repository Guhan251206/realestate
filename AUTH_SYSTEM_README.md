# Full-Stack Authentication (Node + Express + MongoDB + HTML/CSS/JS)

## Structure
- `server/` Express backend + MongoDB + JWT
- `client/` Frontend pages (Register, Login, Profile)

## Backend Features
- `POST /api/auth/register` (name, email, password, optional profile picture)
- `POST /api/auth/login`
- `GET /api/auth/profile` (JWT protected)
- Password hashing with `bcryptjs`
- JWT auth middleware
- Profile picture upload with `multer` (`server/uploads/`)

## Run Backend
```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Backend URL: `http://127.0.0.1:5000`

## Run Frontend
From project root:
```bash
python -m http.server 5500
```

Open:
- `http://127.0.0.1:5500/client/register.html`
- `http://127.0.0.1:5500/client/login.html`
- `http://127.0.0.1:5500/client/profile.html`

## Notes
- Ensure MongoDB is running locally at the URI in `server/.env`.
- Token is stored in `localStorage` key: `auth_token`.
- Logout clears token and redirects to login page.
