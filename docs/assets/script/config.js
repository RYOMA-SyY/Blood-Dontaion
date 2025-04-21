const config = {
    apiUrl: window.location.hostname.includes('netlify.app')
        ? 'https://bottom-frags-production-cff9.up.railway.app'
        : 'http://localhost:3001'
};

// Make config available globally
window.config = config; 