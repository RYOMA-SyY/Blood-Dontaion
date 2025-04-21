document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Back button functionality
    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', function() {
        window.history.back();
    });

    // Scope toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Here you would typically fetch and update the leaderboard data
            updateLeaderboard(this.textContent);
        });
    });

    // Function to update timestamp
    function updateTimestamp() {
        const timestamp = document.getElementById('timestamp');
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit'
        };
        timestamp.textContent = now.toLocaleString('en-US', options);
    }

    // Function to update leaderboard (placeholder)
    function updateLeaderboard(filter) {
        // This would typically make an API call to fetch new data
        console.log('Updating leaderboard with filter:', filter);
    }

    // Update timestamp on load
    updateTimestamp();
});





// Points animation function
function animatePointsChange(element, newValue) {
    const currentValue = parseInt(element.textContent.replace(',', ''));
    const difference = newValue - currentValue;
    const duration = 1000; // 1 second
    const frames = 60;
    const increment = difference / frames;
    let frame = 0;

    element.classList.add('changing');

    const animation = setInterval(() => {
        frame++;
        const current = currentValue + (increment * frame);
        element.textContent = Math.round(current).toLocaleString();

        if (frame === frames) {
            clearInterval(animation);
            element.classList.remove('changing');
        }
    }, duration / frames);
}

// Example usage for point updates
document.querySelectorAll('.points-number').forEach(element => {
    element.addEventListener('click', () => {
        // This is just for demonstration - in real app, would be triggered by actual point changes
        const newValue = Math.floor(Math.random() * 2000) + 1000;
        animatePointsChange(element, newValue);
    });
});

// Tooltip initialization if you're using Bootstrap
const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltips.forEach(tooltip => {
    new bootstrap.Tooltip(tooltip);
});

// Statistics Animation
function animateStatValue(element, targetValue) {
    const start = 0;
    const duration = 2000;
    const startTimestamp = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(progress * targetValue);
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
}

// Animate statistics on page load
document.addEventListener('DOMContentLoaded', () => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const targetValue = parseInt(stat.textContent.replace(/,/g, ''));
        stat.textContent = '0';
        animateStatValue(stat, targetValue);
    });
});

// Animate achievement progress bars on scroll
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = targetWidth;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    animateProgressBars();
});

// Add click handlers for CTA buttons
document.querySelector('.btn-schedule').addEventListener('click', () => {
    // Add scheduling functionality
    console.log('Schedule donation clicked');
});

document.querySelector('.btn-learn-more').addEventListener('click', () => {
    // Add learn more functionality
    console.log('Learn more clicked');
});

// Handle event registration
document.querySelectorAll('.btn-register').forEach(button => {
    button.addEventListener('click', function(e) {
        const eventCard = e.target.closest('.event-card');
        const eventName = eventCard.querySelector('h3').textContent;
        const spotsLeft = eventCard.querySelector('.spots-left');
        const currentSpots = parseInt(spotsLeft.textContent);
        
        // Simulate registration
        if (currentSpots > 0) {
            button.textContent = 'Registered';
            button.disabled = true;
            button.style.background = '#808080';
            
            // Update spots left
            spotsLeft.innerHTML = `
                <i class='bx bxs-user-plus'></i>
                ${currentSpots - 1} spots left
            `;
            
            // Show success message (you can replace this with your preferred notification system)
            alert(`Successfully registered for ${eventName}`);
        }
    });
});
