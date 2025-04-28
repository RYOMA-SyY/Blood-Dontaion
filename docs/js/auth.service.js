class AuthService {
    static isLoggedIn() {
        try {
            const token = localStorage.getItem('token');
            return !!token;
        } catch (error) {
            console.error('Error checking login status:', error);
            return false;
        }
    }

    static getUser() {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    static setUser(user) {
        try {
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    static logout() {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'signin.html';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
}

// Make AuthService available globally
window.AuthService = AuthService; 