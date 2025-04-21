const config = {
    apiUrl: window.location.hostname === 'ryoma-syy.github.io'
        ? 'https://bottom-frags-production-cff9.up.railway.app'
        : 'http://localhost:3001'
};

// Make config available globally
window.config = config; 