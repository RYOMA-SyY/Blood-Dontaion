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

## Ranking and LifePoints System

### Overview
The platform implements a gamified ranking system to encourage and reward blood donations. Users earn LifePoints through donations, which determine their donor rank and unlock various features.

### Donor Ranks
The system features 8 distinct donor ranks based on accumulated LifePoints:

| Rank | LifePoints Range | Description |
|------|-----------------|-------------|
| Iron Donor | 0-49 | Just getting started. Every drop makes a difference. |
| Bronze Donor | 50-99 | New but committed. Thank you for joining the cause. |
| Silver Donor | 100-199 | You're on your way to becoming a lifesaver. |
| Gold Donor | 200-349 | Reliable, steady, and saving lives. |
| Platinum Donor | 350-499 | A trusted hero in the donation community. |
| Diamond Donor | 500-749 | Rare, consistent, and deeply valued. |
| Crimson Donor | 750-999 | Symbol of passion and power. A true life warrior. |
| Immortal Donor | 1000+ | Legendary impact. Your donations echo forever. |

### LifePoints System
- **Earning Points**: Users earn LifePoints through blood donations
- **Point Tracking**: System maintains:
  - Total LifePoints balance
  - Number of donations
  - Days until next donation
  - Current rank
- **Visual Feedback**: Animated point changes and rank updates

### Leaderboard Features
The platform includes a dynamic leaderboard that:
- Ranks donors by total LifePoints
- Displays key metrics:
  - Rank number
  - Donor avatar
  - Donor name
  - Donation count
  - Total points
- Offers two view modes:
  - All Time (default)
  - Event (for specific donation events)
- Highlights current user
- Features animated point changes

### Profile Integration
User profiles showcase:
- Current LifePoints balance
- Donation history
- Current rank
- Days until next donation
- Total lives saved
- Rank-specific styling and themes

### Technical Implementation
#### Database Structure
- **Users Table**:
  - Basic info (name, email, blood type)
  - Donor level
  - Avatar
- **Donations Table**:
  - Points awarded
  - Donation volume
  - Date
  - User ID

#### API Endpoints
- `/api/leaderboard` - Retrieves top donors
- `/api/user/:id` - Gets user profile with stats
- Points calculation handled server-side

### Visual Features
- Animated point changes
- Rank-specific styling
- Responsive design
- Loading states
- Interactive elements
- Online status indicators

### Gamification Elements
The system encourages regular donations through:
- Visible progression
- Competitive elements
- Achievement recognition
- Social comparison
- Visual rewards

### Getting Started
1. Register an account
2. Complete your profile
3. Schedule your first donation
4. Earn LifePoints and climb the ranks
5. Track your progress on the leaderboard

### Support
For questions or assistance with the ranking system, please contact support@thebottomfrags.com 