-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS rewards;
DROP TABLE IF EXISTS redemptions;

-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cin TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    blood_type TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    avatar_url TEXT DEFAULT 'assets/img/unknown_profile.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create donations table
CREATE TABLE donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    points INTEGER DEFAULT 10,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create rewards table
CREATE TABLE rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    points_cost INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create redemptions table
CREATE TABLE redemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reward_id INTEGER NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
);

-- Insert initial rewards
INSERT INTO rewards (name, description, points_cost) VALUES
('Free Coffee', 'Get a free coffee at any participating cafe', 50),
('Movie Ticket', 'Free movie ticket for any show', 100),
('Restaurant Voucher', '20% discount at selected restaurants', 150),
('Gym Membership', '1 month free gym membership', 200),
('Shopping Voucher', '500 Dhs shopping voucher', 500);

-- Create admin user (password: admin123)
INSERT INTO users (name, email, cin, password_hash, blood_type, points)
VALUES ('Admin', 'admin@example.com', 'A123456', '$2b$10$X7Q5Q5Q5Q5Q5Q5Q5Q5Q5O', 'O+', 1000); 