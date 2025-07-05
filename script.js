document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 2000);

    initializeCache();
    fetchJobs();
    setupEventListeners();
    setupCanvasAnimation();
    setupDarkMode();
    setupNotifications();
    setupJobAlerts();
    setupBookmarks();
    setupJobComparison();
    setupAccessibility();
    setupPerformanceMetrics();
    setupOfflineSupport();
    setupShareFunctionality();
    setupFeedbackSystem();
    setupUserProfile();
    setupJobHistory();
    setupGeolocation();
    setupVoiceSearch();
    setupAdvancedFilters();
    setupJobRecommendations();
    setupSocialLogin();
    setupMultiLanguage();
    setupAnalytics();
    setupSecurity();
    setupErrorHandling();
    setupJobCountdown();
    setupResumeBuilder();
    setupInterviewPrep();
    setupSalaryCalculator();
    setupGovtSchemes();
    setupExamCalendar();
    setupAdmitCard();
    setupResultChecker();
    setupNewsUpdates();
    setupBlogSection();
    setupFAQSystem();
    setupChatSupport();
    setupVideoTutorials();
    setupUserDashboard();
    setupMobileAppPromo();
    setupReferralSystem();
    setupGamification();
    setupSubscription();
    setupPaymentGateway();
    setupAdminPanel();
    setupMaintenanceMode();
    setupCustomThemes();
    setupKeyboardShortcuts();
    setupBrowserExtensions();
});

const jobsPerPage = 12;
let currentPage = 1;
let jobsData = [];
let filteredJobs = [];
const CACHE_KEY = 'govt_jobs_cache';
const CACHE_EXPIRY = 1000 * 60 * 60;
const BOOKMARKS_KEY = 'job_bookmarks';
const ALERTS_KEY = 'job_alerts';
const USER_KEY = 'job_user_data';

function initializeCache() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
            jobsData = data;
            filteredJobs = data;
            displayJobs(data);
            setupPagination();
        }
    }
}

function saveToCache(data) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
}

function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });
    
    if (localStorage.getItem('darkMode') === 'true') {
        darkModeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }
}

function setupNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            localStorage.setItem('notifications', permission);
        });
    }
}

function setupJobAlerts() {
    const alertsForm = document.getElementById('jobAlertForm');
    alertsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('alertEmail').value;
        const criteria = document.getElementById('alertCriteria').value;
        const alerts = JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]');
        alerts.push({ email, criteria, active: true });
        localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
        alert('Job alert created successfully!');
        e.target.reset();
    });
}

function setupBookmarks() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('bookmark-btn')) {
            const jobId = e.target.dataset.jobId;
            const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
            if (bookmarks.includes(jobId)) {
                bookmarks.splice(bookmarks.indexOf(jobId), 1);
                e.target.textContent = '♡';
            } else {
                bookmarks.push(jobId);
                e.target.textContent = '♥';
            }
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        }
    });
}

function setupJobComparison() {
    const compareBtn = document.getElementById('compareJobsBtn');
    compareBtn.addEventListener('click', () => {
        const selected = document.querySelectorAll('.job-card input[type="checkbox"]:checked');
        if (selected.length >= 2 && selected.length <= 4) {
            showComparisonModal(Array.from(selected).map(el => el.value));
        } else {
            alert('Please select 2-4 jobs to compare');
        }
    });
}

function setupAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
    
    const fontSizeControls = document.querySelectorAll('.font-size-control');
    fontSizeControls.forEach(control => {
        control.addEventListener('click', () => {
            document.body.style.fontSize = control.dataset.size;
        });
    });
}

function setupPerformanceMetrics() {
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        localStorage.setItem('perfMetrics', JSON.stringify({
            loadTime,
            lastVisit: new Date().toISOString()
        }));
    });
}

function setupOfflineSupport() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
    
    window.addEventListener('online', () => {
        showToast('You are back online');
        fetchJobs();
    });
    
    window.addEventListener('offline', () => {
        showToast('You are offline. Showing cached content');
    });
}

function setupShareFunctionality() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('share-btn')) {
            const jobId = e.target.dataset.jobId;
            const job = jobsData.find(j => j.id === jobId);
            if (navigator.share) {
                navigator.share({
                    title: job.title,
                    text: job.description,
                    url: job.applyLink
                }).catch(err => {
                    console.log('Error sharing:', err);
                });
            } else {
                prompt('Copy this link to share:', job.applyLink);
            }
        }
    });
}

function setupFeedbackSystem() {
    const feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = document.getElementById('feedbackText').value;
        const rating = document.querySelector('input[name="rating"]:checked').value;
        saveFeedback({ feedback, rating });
        showToast('Thank you for your feedback!');
        e.target.reset();
    });
}

function setupUserProfile() {
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            education: document.getElementById('profileEducation').value,
            skills: document.getElementById('profileSkills').value
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        showToast('Profile updated successfully!');
    });
}

function setupJobHistory() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.job-card')) {
            const jobId = e.target.closest('.job-card').dataset.jobId;
            const history = JSON.parse(localStorage.getItem('job_history') || '[]');
            if (!history.includes(jobId)) {
                history.unshift(jobId);
                localStorage.setItem('job_history', JSON.stringify(history.slice(0, 20)));
            }
        }
    });
}

function setupGeolocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            localStorage.setItem('userLocation', JSON.stringify({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }));
        });
    }
}

function setupVoiceSearch() {
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        voiceSearchBtn.addEventListener('click', () => {
            recognition.start();
            voiceSearchBtn.classList.add('active');
        });
        
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            document.getElementById('searchInput').value = transcript;
            filterJobs();
            voiceSearchBtn.classList.remove('active');
        };
        
        recognition.onerror = () => {
            voiceSearchBtn.classList.remove('active');
        };
    } else {
        voiceSearchBtn.style.display = 'none';
    }
}

function setupAdvancedFilters() {
    const advancedFilters = document.getElementById('advancedFilters');
    advancedFilters.addEventListener('change', () => {
        const experience = document.getElementById('experienceFilter').value;
        const salary = document.getElementById('salaryFilter').value;
        const location = document.getElementById('locationFilter').value;
        
        filteredJobs = jobsData.filter(job => {
            const matchesExperience = experience === 'all' || 
                (job.experience && job.experience.includes(experience));
            const matchesSalary = salary === 'all' || 
                (job.salary && compareSalary(job.salary, salary));
            const matchesLocation = location === 'all' || 
                (job.location && job.location.toLowerCase().includes(location.toLowerCase()));
            
            return matchesExperience && matchesSalary && matchesLocation;
        });
        
        displayJobs(filteredJobs);
        setupPagination();
    });
}

function setupJobRecommendations() {
    const userData = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    if (userData.education) {
        const recommended = jobsData.filter(job => 
            job.education.toLowerCase().includes(userData.education.toLowerCase())
        );
        if (recommended.length > 0) {
            const recContainer = document.getElementById('recommendedJobs');
            recContainer.innerHTML = '<h3>Recommended For You</h3>';
            recommended.slice(0, 5).forEach(job => {
                recContainer.appendChild(createJobCard(job));
            });
        }
    }
}

function setupSocialLogin() {
    document.querySelectorAll('.social-login').forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.dataset.provider;
            alert(`Redirecting to ${provider} login...`);
        });
    });
}

function setupMultiLanguage() {
    document.getElementById('languageSelector').addEventListener('change', (e) => {
        const lang = e.target.value;
        localStorage.setItem('preferredLanguage', lang);
        alert('Language preference saved. Page will refresh.');
        location.reload();
    });
}

function setupAnalytics() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
}

function setupSecurity() {
    document.addEventListener('contextmenu', (e) => {
        if (e.target.nodeName === 'IMG') {
            e.preventDefault();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
        }
    });
}

function setupErrorHandling() {
    window.onerror = (msg, url, line) => {
        console.error(`Error: ${msg} at ${url}:${line}`);
        return true;
    };
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled rejection:', e.reason);
    });
}

function setupJobCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(el => {
        const endDate = new Date(el.dataset.endDate).getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate - now;
            
            if (distance < 0) {
                clearInterval(timer);
                el.innerHTML = 'EXPIRED';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            el.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    });
}

function setupResumeBuilder() {
    const resumeForm = document.getElementById('resumeForm');
    resumeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(resumeForm);
        const resumeData = Object.fromEntries(formData.entries());
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        generateResumePDF(resumeData);
    });
}

function setupInterviewPrep() {
    document.getElementById('interviewTipsBtn').addEventListener('click', () => {
        const tips = [
            "Research the company thoroughly",
            "Practice common interview questions",
            "Dress professionally",
            "Arrive 10-15 minutes early",
            "Bring copies of your resume",
            "Prepare questions to ask the interviewer"
        ];
        
        const tipsContainer = document.getElementById('interviewTips');
        tipsContainer.innerHTML = '<h3>Interview Tips</h3><ul>' + 
            tips.map(tip => `<li>${tip}</li>`).join('') + '</ul>';
    });
}

function setupSalaryCalculator() {
    document.getElementById('calculateSalary').addEventListener('click', () => {
        const basic = parseFloat(document.getElementById('basicPay').value) || 0;
        const hra = parseFloat(document.getElementById('hra').value) || 0;
        const da = parseFloat(document.getElementById('da').value) || 0;
        const tax = parseFloat(document.getElementById('tax').value) || 0;
        
        const gross = basic + hra + da;
        const net = gross - (gross * (tax / 100));
        
        document.getElementById('salaryResult').innerHTML = `
            <p>Gross Salary: ₹${gross.toFixed(2)}</p>
            <p>Net Salary: ₹${net.toFixed(2)}</p>
        `;
    });
}

function setupGovtSchemes() {
    const schemes = [
        { name: "PMEGP", desc: "Prime Minister's Employment Generation Programme" },
        { name: "NREGA", desc: "National Rural Employment Guarantee Act" },
        { name: "SSC", desc: "Staff Selection Commission Recruitment" },
        { name: "UPSC", desc: "Union Public Service Commission Exams" }
    ];
    
    const schemesContainer = document.getElementById('govtSchemes');
    schemesContainer.innerHTML = '<h3>Government Schemes</h3><ul>' + 
        schemes.map(scheme => `<li><strong>${scheme.name}:</strong> ${scheme.desc}</li>`).join('') + '</ul>';
}

function setupExamCalendar() {
    const exams = [
        { name: "UPSC CSE", date: "2023-06-15" },
        { name: "SSC CGL", date: "2023-07-20" },
        { name: "IBPS PO", date: "2023-08-10" },
        { name: "RRB NTPC", date: "2023-09-05" }
    ];
    
    const calendarContainer = document.getElementById('examCalendar');
    calendarContainer.innerHTML = '<h3>Upcoming Exams</h3><ul>' + 
        exams.map(exam => `<li><strong>${exam.name}:</strong> ${new Date(exam.date).toLocaleDateString()}</li>`).join('') + '</ul>';
}

function setupAdmitCard() {
    document.getElementById('checkAdmitCard').addEventListener('click', () => {
        const examId = document.getElementById('examId').value;
        const dob = document.getElementById('examDob').value;
        
        if (examId && dob) {
            alert(`Admit card for Exam ID: ${examId} will be displayed if available`);
        } else {
            alert('Please enter both Exam ID and Date of Birth');
        }
    });
}

function setupResultChecker() {
    document.getElementById('checkResult').addEventListener('click', () => {
        const rollNo = document.getElementById('rollNumber').value;
        const dob = document.getElementById('resultDob').value;
        
        if (rollNo && dob) {
            alert(`Result for Roll No: ${rollNo} will be displayed if available`);
        } else {
            alert('Please enter both Roll Number and Date of Birth');
        }
    });
}

function setupNewsUpdates() {
    fetch('https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=YOUR_API_KEY')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('newsUpdates');
            newsContainer.innerHTML = '<h3>Latest News</h3>';
            data.articles.slice(0, 3).forEach(article => {
                newsContainer.innerHTML += `
                    <div class="news-item">
                        <h4>${article.title}</h4>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank">Read more</a>
                    </div>
                `;
            });
        });
}

function setupBlogSection() {
    const blogPosts = [
        { title: "How to Prepare for Government Exams", author: "Expert" },
        { title: "Tips for Writing Competitive Exams", author: "Topper" },
        { title: "Interview Preparation Guide", author: "HR Professional" }
    ];
    
    const blogContainer = document.getElementById('blogSection');
    blogContainer.innerHTML = '<h3>Blog Posts</h3>';
    blogPosts.forEach(post => {
        blogContainer.innerHTML += `
            <div class="blog-post">
                <h4>${post.title}</h4>
                <p>By ${post.author}</p>
            </div>
        `;
    });
}

function setupFAQSystem() {
    const faqs = [
        { question: "How to apply for jobs?", answer: "Click on Apply Now button" },
        { question: "Is registration required?", answer: "Only for some features" },
        { question: "Are these jobs genuine?", answer: "Yes, we verify all listings" }
    ];
    
    const faqContainer = document.getElementById('faqSection');
    faqContainer.innerHTML = '<h3>FAQs</h3>';
    faqs.forEach(faq => {
        faqContainer.innerHTML += `
            <div class="faq-item">
                <button class="faq-question">${faq.question}</button>
                <div class="faq-answer">${faq.answer}</div>
            </div>
        `;
    });
    
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            question.nextElementSibling.classList.toggle('show');
        });
    });
}

function setupChatSupport() {
    const chatBtn = document.getElementById('chatButton');
    const chatBox = document.getElementById('chatBox');
    
    chatBtn.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'block' ? 'none' : 'block';
    });
    
    document.getElementById('sendMessage').addEventListener('click', () => {
        const message = document.getElementById('chatInput').value;
        if (message) {
            addChatMessage('user', message);
            document.getElementById('chatInput').value = '';
            
            setTimeout(() => {
                addChatMessage('bot', 'Thanks for your message. We will respond soon.');
            }, 1000);
        }
    });
}

function setupVideoTutorials() {
    const tutorials = [
        { title: "How to Apply Online", id: "abc123" },
        { title: "Exam Preparation Tips", id: "def456" },
        { title: "Interview Techniques", id: "ghi789" }
    ];
    
    const videosContainer = document.getElementById('videoTutorials');
    videosContainer.innerHTML = '<h3>Video Tutorials</h3>';
    tutorials.forEach(video => {
        videosContainer.innerHTML += `
            <div class="video-item">
                <h4>${video.title}</h4>
                <div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        `;
    });
}

function setupUserDashboard() {
    const userData = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    if (userData.name) {
        document.getElementById('userGreeting').textContent = `Welcome, ${userData.name}`;
        document.getElementById('profileName').value = userData.name;
        document.getElementById('profileEmail').value = userData.email || '';
        document.getElementById('profileEducation').value = userData.education || '';
        document.getElementById('profileSkills').value = userData.skills || '';
    }
    
    const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || [];
    if (bookmarks.length > 0) {
        const bookmarkedJobs = jobsData.filter(job => bookmarks.includes(job.id));
        const bookmarksContainer = document.getElementById('bookmarkedJobs');
        bookmarksContainer.innerHTML = '<h3>Your Bookmarked Jobs</h3>';
        bookmarkedJobs.slice(0, 3).forEach(job => {
            bookmarksContainer.appendChild(createJobCard(job));
        });
    }
}

function setupMobileAppPromo() {
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        document.getElementById('mobileAppPromo').style.display = 'block';
        document.getElementById('closePromo').addEventListener('click', () => {
            document.getElementById('mobileAppPromo').style.display = 'none';
        });
    }
}

function setupReferralSystem() {
    document.getElementById('generateReferral').addEventListener('click', () => {
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        document.getElementById('referralCode').textContent = referralCode;
        localStorage.setItem('referralCode', referralCode);
    });
}

function setupGamification() {
    const points = parseInt(localStorage.getItem('userPoints') || '0');
    document.getElementById('userPoints').textContent = points;
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.job-card') || e.target.closest('.bookmark-btn')) {
            const newPoints = points + 5;
            localStorage.setItem('userPoints', newPoints.toString());
            document.getElementById('userPoints').textContent = newPoints;
        }
    });
}

function setupSubscription() {
    document.getElementById('subscribeBtn').addEventListener('click', () => {
        const email = document.getElementById('subscribeEmail').value;
        if (email) {
            localStorage.setItem('subscribed', 'true');
            showToast('Thank you for subscribing!');
            document.getElementById('subscribeEmail').value = '';
        }
    });
}

function setupPaymentGateway() {
    document.getElementById('premiumUpgrade').addEventListener('click', () => {
        alert('Redirecting to secure payment gateway...');
    });
}

function setupAdminPanel() {
    if (localStorage.getItem('admin') === 'true') {
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('addJobBtn').addEventListener('click', () => {
            const jobData = {
                title: document.getElementById('jobTitle').value,
                organization: document.getElementById('jobOrg').value,
                description: document.getElementById('jobDesc').value
            };
            jobsData.unshift(jobData);
            saveToCache(jobsData);
            showToast('Job added successfully!');
        });
    }
}

function setupMaintenanceMode() {
    const maintenance = false;
    if (maintenance) {
        document.body.innerHTML = '<h1>Site Under Maintenance</h1><p>We'll be back soon</p>';
    }
}

function setupCustomThemes() {
    document.getElementById('themeSelector').addEventListener('change', (e) => {
        document.body.className = e.target.value;
        localStorage.setItem('selectedTheme', e.target.value);
    });
    
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.body.className = savedTheme;
        document.getElementById('themeSelector').value = savedTheme;
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            document.getElementById('bookmarksTab').click();
        }
    });
}

function setupBrowserExtensions() {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        document.getElementById('extensionPromo').style.display = 'block';
    }
}

function filterJobs() {
    currentPage = 1;
    const searchTerm = document.querySelector('#searchInput').value.toLowerCase();
    const category = document.querySelector('#categoryFilter').value;
    const education = document.querySelector('#educationFilter').value.toLowerCase();

    filteredJobs = jobsData.filter(job => {
        const jobEducation = (job.education || '').toLowerCase();
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                             job.organization.toLowerCase().includes(searchTerm) ||
                             job.description.toLowerCase().includes(searchTerm) ||
                             (job.details && job.details.toLowerCase().includes(searchTerm));
        const matchesCategory = category === 'all' || job.category === category;
        const matchesEducation = education === 'all' || jobEducation === education || jobEducation.includes('10th');
        return matchesSearch && matchesCategory && matchesEducation;
    });

    displayJobs(filteredJobs);
    setupPagination();
}

function sortJobs(sortBy) {
    if (sortBy === 'date-desc') {
        filteredJobs.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    } else {
        filteredJobs.sort((a, b) => new Date(a.postDate) - new Date(b.postDate));
    }
    displayJobs(filteredJobs);
}

function displayJobs(jobs) {
    const jobContainer = document.querySelector('#jobContainer');
    const start = (currentPage - 1) * jobsPerPage;
    const end = start + jobsPerPage;
    const paginatedJobs = jobs.slice(start, end);

    jobContainer.innerHTML = '';
    if (paginatedJobs.length === 0) {
        jobContainer.innerHTML = '<p>No jobs found matching your criteria. Try adjusting your filters or search terms.</p>';
        return;
    }

    paginatedJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card lazy-loading';
        jobCard.dataset.jobId = job.id || Math.random().toString(36).substring(7);
        jobCard.innerHTML = `
            <div class="job-header">
                <h3>${job.title}</h3>
                <button class="bookmark-btn" data-job-id="${jobCard.dataset.jobId}">♡</button>
            </div>
            <p><strong>Organization:</strong> ${job.organization}</p>
            <p><strong>Posted:</strong> ${job.postDate}</p>
            <p><strong>Expires:</strong> <span class="countdown" data-end-date="${job.expiryDate}"></span></p>
            <p><strong>Category:</strong> ${job.category}</p>
            <p><strong>Education:</strong> ${job.education}</p>
            <p>${job.description}</p>
            ${job.details ? `<p><strong>Details:</strong> ${job.details}</p>` : ''}
            <div class="job-footer">
                <a href="${job.applyLink}" target="_blank">Apply Now <i class="fas fa-arrow-right"></i></a>
                <button class="share-btn" data-job-id="${jobCard.dataset.jobId}">Share</button>
            </div>
        `;
        jobContainer.appendChild(jobCard);
    });

    setupJobCountdown();
    setupBookmarks();
    setupShareFunctionality();
}

function setupPagination() {
    const pagination = document.querySelector('#pagination');
    const pageCount = Math.ceil(filteredJobs.length / jobsPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = i === currentPage;
        button.addEventListener('click', () => {
            currentPage = i;
            displayJobs(filteredJobs);
            setupPagination();
        });
        pagination.appendChild(button);
    }
}

async function fetchJobs() {
    const mockJobs = [
        {
            id: 'job1',
            title: 'Assistant Loco Pilot',
            organization: 'Indian Railways',
            postDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            description: 'Recruitment for Assistant Loco Pilot positions across Indian Railways.',
            category: 'Railways',
            education: '10th',
            applyLink: 'https://www.indianrailways.gov.in',
            details: 'Requires 10th pass with ITI certification. Technical role in railway operations.',
            eligibility: '10th + ITI',
            location: 'Pan India',
            salary: '₹20,000 - ₹40,000'
        },
        {
            id: 'job2',
            title: 'Multi-Tasking Staff',
            organization: 'India Post',
            postDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            description: 'Hiring for Multi-Tasking Staff roles in postal services.',
            category: 'Admin',
            education: '10th',
            applyLink: 'https://www.indiapost.gov.in',
            details: 'Basic administrative tasks. 10th pass required.',
            eligibility: '10th',
            location: 'Delhi',
            salary: '₹18,000 - ₹30,000'
        }
    ];

    const rssFeeds = [
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.upsc.gov.in/rss/notifications.xml', org: 'UPSC', category: 'Admin', education: 'Graduate' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://ssc.nic.in/rss/latest.xml', org: 'SSC', category: 'Admin', education: '12th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://dsssb.delhi.gov.in/rss/jobs.xml', org: 'DSSSB', category: 'Teaching', education: 'Graduate' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=http://www.rrbcdg.gov.in/rss/rrb_jobs.xml', org: 'RRB', category: 'Railways', education: '10th' }
    ];

    try {
        const responses = await Promise.allSettled(rssFeeds.map(async feed => {
            try {
                const response = await axios.get(feed.url, { timeout: 5000 });
                const items = response.data.items || [];
                return items.map(item => ({
                    id: `job_${Math.random().toString(36).substring(2, 9)}`,
                    title: item.title || 'N/A',
                    organization: feed.org,
                    postDate: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    expiryDate: item.expiryDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                    description: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 250) + '...' : 'No description available',
                    category: item.categories && item.categories.length > 0 ? item.categories[0] : feed.category,
                    education: item.education || feed.education,
                    applyLink: item.link || '#',
                    details: item.content ? item.content.replace(/<[^>]+>/g, '').substring(0, 350) + '...' : item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 350) + '...' : '',
                    eligibility: item.eligibility || ['10th', '12th', 'Graduate', 'Post Graduate', 'Diploma'][Math.floor(Math.random() * 5)],
                    location: item.location || ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'][Math.floor(Math.random() * 5)],
                    salary: item.salary || '₹25,000 - ₹80,000'
                }));
            } catch (error) {
                console.error(`Failed to fetch feed: ${feed.url}`, error);
                return [];
            }
        }));

        jobsData = [...mockJobs, ...responses.flatMap(result => result.value || [])];
        jobsData = [...new Map(jobsData.map(job => [`${job.title}-${job.organization}`, job])).values()];
        filteredJobs = jobsData;

        saveToCache(jobsData);
        displayJobs(jobsData);
        setupPagination();
        setupJobRecommendations();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        document.querySelector('#jobContainer').innerHTML = '<p>Unable to load jobs at this time. Please try again later.</p>';
    }
}

function setupCanvasAnimation() {
    const canvas = document.getElementById('shapesCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const shapes = [
        { type: 'circle', x: 100, y: 100, r: 25, vx: 1.5, vy: 1, color: 'rgba(0, 123, 255, 0.4)' },
        { type: 'square', x: 200, y: 200, s: 30, vx: -1, vy: 1.5, color: 'rgba(40, 167, 69, 0.3)' },
        { type: 'triangle', x: 300, y: 150, s: 35, vx: 1, vy: -1.5, color: 'rgba(255, 111, 97, 0.3)' }
    ];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach(shape => {
            ctx.beginPath();
            ctx.fillStyle = shape.color;
            if (shape.type === 'circle') {
                ctx.arc(shape.x, shape.y, shape.r, 0, 2 * Math.PI);
            } else if (shape.type === 'square') {
                ctx.rect(shape.x - shape.s / 2, shape.y - shape.s / 2, shape.s, shape.s);
            } else if (shape.type === 'triangle') {
                ctx.moveTo(shape.x, shape.y - shape.s / 2);
                ctx.lineTo(shape.x - shape.s / 2, shape.y + shape.s / 2);
                ctx.lineTo(shape.x + shape.s / 2, shape.y + shape.s / 2);
                ctx.closePath();
            }
            ctx.fill();

            shape.x += shape.vx;
            shape.y += shape.vy;

            if (shape.x + shape.r > canvas.width || shape.x - shape.r < 0) shape.vx = -shape.vx;
            if (shape.y + shape.r > canvas.height || shape.y - shape.r < 0) shape.vy = -shape.vy;
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    animate();
}

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.dataset.jobId = job.id;
    card.innerHTML = `
        <h3>${job.title}</h3>
        <p><strong>Organization:</strong> ${job.organization}</p>
        <p><strong>Posted:</strong> ${job.postDate}</p>
        <p><strong>Expires:</strong> ${job.expiryDate}</p>
        <a href="${job.applyLink}" target="_blank">Apply Now</a>
    `;
    return card;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showComparisonModal(jobIds) {
    const modal = document.getElementById('comparisonModal');
    const jobs = jobIds.map(id => jobsData.find(job => job.id === id));
    
    let comparisonHTML = '<div class="comparison-grid"><div class="comparison-header"></div>';
    
    ['title', 'organization', 'salary', 'location', 'education'].forEach(field => {
        comparisonHTML += `<div class="comparison-row">
            <div class="comparison-label">${field.charAt(0).toUpperCase() + field.slice(1)}</div>
            ${jobs.map(job => `<div class="comparison-value">${job[field] || '-'}</div>`).join('')}
        </div>`;
    });
    
    comparisonHTML += '</div>';
    document.getElementById('comparisonContent').innerHTML = comparisonHTML;
    modal.style.display = 'block';
    
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function compareSalary(jobSalary, range) {
    const ranges = {
        'low': [0, 30000],
        'medium': [30001, 60000],
        'high': [60001, Infinity]
    };
    
    const [min, max] = ranges[range];
    const salaryMatch = jobSalary.match(/\d+/g);
    if (salaryMatch) {
        const salary = parseInt(salaryMatch[0]);
        return salary >= min && salary <= max;
    }
    return false;
}

function generateResumePDF(data) {
    alert('Resume PDF generation would happen here with data:\n' + JSON.stringify(data, null, 2));
}
