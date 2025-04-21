const AUTH_KEY = 'user_auth';

class AuthService {
    // Mock user data for testing
    mockUser = {
        name: "John Doe",
        email: "test@test.com",
        password: "test123", // In real app, never store passwords like this!
        profilePicture: "assets/img/unknown_profile.png",
        lifePoints: 750
    };

    // Check if user is logged in
    static isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    // Get current user object
    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Mock login - just for frontend testing
    static async login(credentials) {
        try {
            const response = await fetch(`${config.apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    }

    // Mock register - just for frontend testing
    static async register(userData) {
        try {
            const response = await fetch(`${config.apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    }

    // Logout
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

    static getToken() {
        return localStorage.getItem('token');
    }
}

// Export for use in other files
window.AuthService = AuthService;
