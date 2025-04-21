const AUTH_KEY = 'user_auth';

const AuthService = {
    // Mock user data for testing
    mockUser: {
        name: "John Doe",
        email: "test@test.com",
        password: "test123", // In real app, never store passwords like this!
        profilePicture: "assets/img/unknown_profile.png",
        lifePoints: 750
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem(AUTH_KEY);
    },

    // Get current user object
    getCurrentUser() {
        const userData = localStorage.getItem(AUTH_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    // Mock login - just for frontend testing
    login(email, password) {
        // For testing: accept any email/password combination
        const userData = { name: this.mockUser.name, profilePicture: this.mockUser.profilePicture };
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        return true;
    },

    // Mock register - just for frontend testing
    register(userData) {
        const data = { name: userData.name, profilePicture: this.mockUser.profilePicture };
        localStorage.setItem(AUTH_KEY, JSON.stringify(data));
        return true;
    },

    // Logout
    logout() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem('token');
    },

    // Get user name
    getUserName() {
        const user = this.getCurrentUser();
        return user ? user.name : '';
    },

    // Get user avatar URL
    getUserAvatar() {
        const user = this.getCurrentUser();
        return user && user.profilePicture ? user.profilePicture : 'assets/img/unknown_profile.png';
    }
};

// Export for use in other files
window.AuthService = AuthService;
