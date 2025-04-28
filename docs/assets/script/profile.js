class ProfileService {
    static async loadProfile() {
        try {
            const user = AuthService.getUser();
            if (!user) {
                window.location.href = 'signin.html';
                return;
            }

            const response = await fetch(`${config.apiUrl}/api/user/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });

            if (!response.ok) throw new Error('Failed to load profile');
            const profileData = await response.json();

            // Update profile information
            document.getElementById('profileName').textContent = profileData.name;
            document.getElementById('profileEmail').textContent = profileData.email;
            document.getElementById('profileBloodType').textContent = profileData.blood_type;
            document.getElementById('profileDonorLevel').textContent = profileData.donor_level || 'Not Set';
            document.getElementById('profilePoints').textContent = profileData.lifePoints;
            document.getElementById('profileDonations').textContent = profileData.donationCount;
            
            // Update avatar
            const avatarImg = document.getElementById('profileAvatar');
            if (profileData.avatar_url) {
                avatarImg.src = profileData.avatar_url;
            }

            // Update donor level theme
            this.updateDonorLevelTheme(profileData.donor_level);

            // Load donation history after profile data
            await this.loadDonationHistory();

            // Update next donation date
            const daysToNext = this.calculateNextDonationDate();
            const nextDonationElement = document.querySelector('.stat-box:nth-child(4) .stat-value');
            if (nextDonationElement) {
                nextDonationElement.textContent = daysToNext;
            }

            // Load rewards after profile data
            await this.loadRewards();

            // Add event listeners for redeem buttons
            document.querySelectorAll('.redeem-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const card = e.target.closest('.reward-card');
                    const pointsCost = parseInt(card.querySelector('.points-cost').textContent);
                    const rewardId = card.dataset.rewardId;
                    this.redeemReward(rewardId, pointsCost);
                });
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Failed to load profile data');
        }
    }

    static async updateProfile(profileData) {
        try {
            const user = AuthService.getUser();
            if (!user) {
                window.location.href = 'signin.html';
                return;
            }

            const response = await fetch(`${config.apiUrl}/api/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) throw new Error('Failed to update profile');
            await this.loadProfile(); // Reload profile data
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    }

    static async uploadAvatar(file) {
        try {
            const user = AuthService.getUser();
            if (!user) {
                window.location.href = 'signin.html';
                return;
            }

            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${config.apiUrl}/api/user/${user.id}/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload avatar');
            const data = await response.json();
            
            // Update avatar in UI
            const avatarImg = document.getElementById('profileAvatar');
            avatarImg.src = data.avatar_url;
            
            // Update avatar in navbar
            const navAvatar = document.getElementById('profileNavAvatar');
            if (navAvatar) navAvatar.src = data.avatar_url;

            alert('Avatar updated successfully');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar');
        }
    }

    static updateDonorLevelTheme(level) {
        const statsContainer = document.querySelector('.stats-container');
        if (!statsContainer) return;

        // Remove existing theme classes
        statsContainer.classList.remove('theme-gold', 'theme-silver', 'theme-bronze', 'theme-iron');

        // Add appropriate theme class
        switch (level?.toLowerCase()) {
            case 'gold':
                statsContainer.classList.add('theme-gold');
                break;
            case 'silver':
                statsContainer.classList.add('theme-silver');
                break;
            case 'bronze':
                statsContainer.classList.add('theme-bronze');
                break;
            case 'iron':
                statsContainer.classList.add('theme-iron');
                break;
        }
    }

    static async loadDonationHistory() {
        try {
            const user = AuthService.getUser();
            if (!user) return;

            const response = await fetch(`${config.apiUrl}/api/donation/my`, {
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });

            if (!response.ok) throw new Error('Failed to load donation history');
            const donations = await response.json();

            // Update donation history timeline
            const timelineWrapper = document.querySelector('#donation-history .timeline-wrapper');
            if (timelineWrapper) {
                timelineWrapper.innerHTML = donations.map(donation => `
                    <div class="timeline-entry">
                        <div class="timeline-date">
                            <div class="date-badge">
                                <span class="month">${new Date(donation.date).toLocaleString('default', {month: 'short'})}</span>
                                <span class="day">${new Date(donation.date).getDate()}</span>
                                <span class="year">${new Date(donation.date).getFullYear()}</span>
                            </div>
                            <span class="time">${new Date(donation.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                        <div class="timeline-content">
                            <div class="donation-info">
                                <div class="donation-type">
                                    <i class='bx bx-donate-blood'></i>
                                    <span>${donation.volume} ml</span>
                                </div>
                                <div class="points-badge">
                                    <i class='bx bxs-coin-stack'></i> +${donation.points_awarded} LP
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            // Calculate and update total statistics
            const totalVolume = donations.reduce((sum, d) => sum + d.volume, 0);
            const totalPoints = donations.reduce((sum, d) => sum + d.points_awarded, 0);
            
            // Update blood volume display
            const bloodVolumeElement = document.querySelector('.blood-volume h4');
            if (bloodVolumeElement) {
                bloodVolumeElement.textContent = (totalVolume / 1000).toFixed(1);
            }

            // Update blood bottle fill
            const bloodFill = document.querySelector('.blood-fill');
            if (bloodFill) {
                const fillPercentage = Math.min((totalVolume / 5000) * 100, 100);
                bloodFill.style.height = `${fillPercentage}%`;
            }
        } catch (error) {
            console.error('Error loading donation history:', error);
        }
    }

    static calculateNextDonationDate() {
        const lastDonation = this.getLastDonation();
        if (!lastDonation) return 0;

        const lastDate = new Date(lastDonation.date);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 90); // 90 days between donations

        const today = new Date();
        const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        return Math.max(0, daysLeft);
    }

    static getLastDonation() {
        const donations = JSON.parse(localStorage.getItem('donations') || '[]');
        return donations[donations.length - 1];
    }

    static async loadRewards() {
        try {
            const user = AuthService.getUser();
            if (!user) return;

            // Update points display
            const pointsDisplay = document.querySelector('.points-display');
            if (pointsDisplay) {
                pointsDisplay.textContent = `${user.lifePoints} Points`;
            }

            // Filter rewards based on category
            const categoryButtons = document.querySelectorAll('.category-btn');
            categoryButtons.forEach(button => {
                button.addEventListener('click', () => {
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const category = button.textContent.trim();
                    this.filterRewards(category);
                });
            });
        } catch (error) {
            console.error('Error loading rewards:', error);
            alert('Failed to load rewards. Please try again.');
        }
    }

    static filterRewards(category) {
        const rewards = document.querySelectorAll('.reward-card');
        rewards.forEach(card => {
            const cardCategory = card.querySelector('.reward-category').textContent.trim();
            if (category === 'All Rewards' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    static async redeemReward(rewardId, pointsCost) {
        try {
            const user = AuthService.getUser();
            if (!user) return;

            if (user.lifePoints < pointsCost) {
                alert('Not enough points to redeem this reward');
                return;
            }

            const response = await fetch(`${config.apiUrl}/api/rewards/redeem`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rewardId, pointsCost })
            });

            if (!response.ok) throw new Error('Failed to redeem reward');
            
            // Update user points
            const updatedUser = { ...user, lifePoints: user.lifePoints - pointsCost };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Update points display
            await this.loadRewards();
            alert('Reward redeemed successfully!');
        } catch (error) {
            console.error('Error redeeming reward:', error);
            alert('Failed to redeem reward');
        }
    }

    updatePointsDisplay() {
        const pointsDisplay = document.querySelector('.points-display');
        if (pointsDisplay) {
            pointsDisplay.textContent = `${AuthService.getUser().lifePoints} Points`;
        }
    }

    showSuccessMessage(message) {
        // Implement success message display
        alert(message); // Replace with your preferred notification system
    }

    showErrorMessage(message) {
        // Implement error message display
        alert(message); // Replace with your preferred notification system
    }
}

// Initialize profile when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load profile data
    ProfileService.loadProfile();

    // Handle avatar upload
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                ProfileService.uploadAvatar(e.target.files[0]);
            }
        });
    }

    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                name: document.getElementById('editName').value,
                blood_type: document.getElementById('editBloodType').value,
                donor_level: document.getElementById('editDonorLevel').value
            };
            ProfileService.updateProfile(formData);
        });
    }

    // Handle logout
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            AuthService.logout();
            window.location.href = 'signin.html';
        });
    }

    // Initialize rewards functionality
    const shopTab = document.querySelector('a[href="#shop"]');
    if (shopTab) {
        shopTab.addEventListener('shown.bs.tab', () => {
            ProfileService.loadRewards();
        });
    }
});

// Make ProfileService available globally
window.ProfileService = ProfileService; 