const AUTH_KEY = 'user_auth';
const USERS_KEY = 'registered_users';

class AuthService {
    static get users() {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (!storedUsers) {
            const defaultUsers = [{
                id: 1,
                name: "Admin",
                email: "admin@example.com",
                password: "admin123",
                blood_type: "O+",
                points: 1000,
                avatar_url: "assets/img/unknown_profile.png"
            }];
            localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
            return defaultUsers;
        }
        return JSON.parse(storedUsers);
    }

    static set users(value) {
        localStorage.setItem(USERS_KEY, JSON.stringify(value));
    }

    // Check if user is logged in
    static isLoggedIn() {
        return !!localStorage.getItem('user');
    }

    // Get current user object
    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Local login
    static async login(credentials) {
        try {
            // Find user
            const user = this.users.find(u => u.email === credentials.email && u.password === credentials.password);
            
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Create a simple token
            const token = btoa(user.email + ':' + Date.now());
            
            // Store user data
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                blood_type: user.blood_type,
                points: user.points,
                avatar_url: user.avatar_url
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            return { token, user: userData };
        } catch (error) {
            throw error;
        }
    }

    // Local register
    static async register(userData) {
        try {
            const currentUsers = this.users;
            
            // Check if user already exists
            if (currentUsers.some(u => u.email === userData.email)) {
                throw new Error('Email already registered');
            }

            // Create new user
            const newUser = {
                id: currentUsers.length + 1,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                blood_type: userData.blood_type,
                points: 0,
                avatar_url: "assets/img/unknown_profile.png"
            };

            // Add to users array and persist
            currentUsers.push(newUser);
            this.users = currentUsers;

            // Create token
            const token = btoa(newUser.email + ':' + Date.now());
            
            // Store user data
            const userDataToStore = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                blood_type: newUser.blood_type,
                points: newUser.points,
                avatar_url: newUser.avatar_url
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userDataToStore));

            return { token, user: userDataToStore };
        } catch (error) {
            throw error;
        }
    }

    // Logout
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'home.html';
    }

    // Get user name
    static getUserName() {
        const user = this.getUser();
        return user ? user.name : '';
    }

    // Get user avatar URL
    static getUserAvatar() {
        const user = this.getUser();
        return user && user.avatar_url ? user.avatar_url : 'assets/img/unknown_profile.png';
    }

    // Get user points
    static getUserPoints() {
        const user = this.getUser();
        return user ? user.points : 0;
    }

    // Update user points
    static updateUserPoints(points) {
        const user = this.getUser();
        if (user) {
            user.points = points;
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update points in users array
            const users = this.users;
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                users[userIndex].points = points;
                this.users = users;
            }
        }
    }

    // Update user profile
    static updateUserProfile(userData) {
        const user = this.getUser();
        if (user) {
            const updatedUser = { ...user, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Update user in users array
            const users = this.users;
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...userData };
                this.users = users;
            }
            
            return updatedUser;
        }
        return null;
    }
}

// Export for use in other files
window.AuthService = AuthService;
