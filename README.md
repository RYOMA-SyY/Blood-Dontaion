# THE BOTTOM FRAGS - Blood Donation Platform

A web-based platform that encourages and tracks blood donations while creating a community of donors.

## Features

- User authentication and profile management
- Blood donation tracking
- Leaderboard system
- Profile picture management
- Blood type information
- Donor levels and points system

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: SQLite
- Authentication: JWT

## Project Structure

```
.
├── back/               # Backend Node.js application
│   ├── routes/        # API routes
│   ├── app.js         # Main application file
│   └── db.js          # Database configuration
└── front/             # Frontend static files
    ├── assets/        # Images and other static assets
    ├── css/          # Stylesheets
    └── js/           # JavaScript files
```

## Setup

1. Clone the repository
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies
```bash
cd back
npm install
```

3. Create .env file
```bash
cp .env.example .env
```

4. Start the server
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 