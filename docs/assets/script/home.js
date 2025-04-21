// Add this JavaScript code
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        // Change icon based on theme
        if (theme === 'light') {
            icon.className = 'bx bx-sun';
        } else {
            icon.className = 'bx bx-moon';
        }
    }

    const authButtons = document.getElementById('authButtons');
    const profileDropdown = document.getElementById('profileDropdown');
    const userAvatar = document.getElementById('userAvatar');
    const profileName = document.getElementById('profileName');
    const logoutBtn = document.getElementById('logoutButton');
    
    // Update auth UI
    if (AuthService.isLoggedIn()) {
        authButtons.style.display = 'none';
        profileDropdown.style.display = 'block';
        userAvatar.src = AuthService.getUserAvatar();
        profileName.textContent = AuthService.getUserName();
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            AuthService.logout();
            window.location.href = 'signin.html';
        });
    }

    // Toggle dropdown menu
    window.toggleDropdown = function() {
        document.getElementById('dropdownMenu').classList.toggle('show');
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('dropdownMenu');
        const profileButton = document.querySelector('.profile-button');
        if (!profileButton.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
});

// Add these style updates for light theme
document.documentElement.addEventListener('data-theme-change', function() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
        // Update specific elements for light theme
        document.querySelectorAll('.container').forEach(container => {
            container.style.backgroundColor = 'var(--bg-secondary)';
        });
        
        document.querySelectorAll('.form-box').forEach(box => {
            box.style.backgroundColor = 'var(--bg-secondary)';
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.color = 'var(--text-primary)';
        });
    }
});
