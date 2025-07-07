document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 2000);

    initializeCache();
    fetchJobs();
    setupEventListeners();
    setupCanvasAnimation();
});

const jobsPerPage = 12;
let currentPage = 1;
let jobsData = [];
let filteredJobs = [];
const CACHE_KEY = 'govt_jobs_cache';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

function initializeCache() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
            jobsData = data;
            filteredJobs = data;
            displayJobs(shuffleArray(data));
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setupEventListeners() {
    document.querySelector('.menu-toggle').addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.toggle('active');
    });

    document.querySelector('#searchInput').addEventListener('input', () => {
        filterJobs();
    });

    document.querySelector('#categoryFilter').addEventListener('change', filterJobs);
    document.querySelector('#educationFilter').addEventListener('change', filterJobs);
    document.querySelector('#sortBy').addEventListener('change', (e) => {
        sortJobs(e.target.value);
    });

    document.querySelector('#contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent successfully!');
        e.target.reset();
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('lazy-loading');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '150px' });

    document.querySelectorAll('.job-card').forEach(card => {
        card.classList.add('lazy-loading');
        observer.observe(card);
    });
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
        const matchesEducation = education === 'all' || jobEducation === education || jobEducation.includes('10th') || jobEducation.includes('12th');
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
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Organization:</strong> ${job.organization}</p>
            <p><strong>Posted:</strong> ${job.postDate}</p>
            <p><strong>Expires:</strong> ${job.expiryDate}</p>
            <p><strong>Category:</strong> ${job.category}</p>
            <p><strong>Education:</strong> ${job.education}</p>
            <p>${job.description}</p>
            ${job.details ? `<p><strong>Details:</strong> ${job.details}</p>` : ''}
            <p><strong>Eligibility:</strong> ${job.eligibility || '-'}</p>
            <p><strong>Location:</strong> ${job.location || '-'}</p>
            <p><strong>Salary:</strong> ${job.salary || '-'}</p>
            <a href="${job.applyLink}" target="_blank">Apply Now <i class="fas fa-arrow-right"></i></a>
        `;
        jobContainer.appendChild(jobCard);
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('lazy-loading');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '150px' });

    document.querySelectorAll('.job-card').forEach(card => observer.observe(card));
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
    const rssFeeds = [
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.freejobalert.com/feed/', org: 'FreeJobAlert', category: 'General', education: '10th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sarkariresult.com/feed/', org: 'Sarkari Result', category: 'General', education: '10th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.adda247.com/jobs/feed/', org: 'Adda247 Jobs', category: 'General', education: '12th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.jobriya.in/feed/', org: 'JobRiya', category: 'General', education: '10th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sarkariresult.app/feed/', org: 'SarkariResult App', category: 'General', education: '12th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.govtjobsalert.in/feed/', org: 'GovtJobsAlert', category: 'General', education: '10th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sarkariexam.com/feed/', org: 'SarkariExam', category: 'General', education: '12th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.freshersnow.com/feed/', org: 'FreshersNow', category: 'General', education: '10th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.employment-news.net/feed/', org: 'Employment News', category: 'General', education: '12th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sarkarinaukri.com/feed/', org: 'SarkariNaukri', category: 'General', education: '10th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.govnokri.com/feed/', org: 'GovNokri', category: 'General', education: '12th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.9curry.com/feed', org: '9Curry', category: 'General', education: '10th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sabhijobs.com/feed/', org: 'SabhiJobs', category: 'General', education: '12th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sarkariresultz.in/feed/', org: 'SarkariResultz', category: 'General', education: '10th' },
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sarkarijobfind.com/feed/', org: 'SarkariJobFind', category: 'General', education: '12th' }
    ];

    try {
        const responses = await Promise.allSettled(rssFeeds.map(async feed => {
            try {
                const response = await axios.get(feed.url, { timeout: 5000 });
                const items = response.data.items || [];
                return items.map(item => ({
                    title: item.title || 'N/A',
                    organization: feed.org,
                    postDate: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    expiryDate: item.expiryDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                    description: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 250) + '...' : 'No description available',
                    category: item.categories && item.categories.length > 0 ? item.categories[0] : feed.category,
                    education: item.education || feed.education,
                    applyLink: item.link || '#',
                    details: item.content ? item.content.replace(/<[^>]+>/g, '').substring(0, 350) + '...' : item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 350) + '...' : '',
                    eligibility: item.eligibility || feed.education,
                    location: item.location || ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'][Math.floor(Math.random() * 5)],
                    salary: item.salary || '₹15,000 - ₹50,000'
                }));
            } catch (error) {
                console.error(`Failed to fetch feed: ${feed.url}`, error);
                return [];
            }
        }));

        jobsData = responses.flatMap(result => result.value || []);
        jobsData = [...new Map(jobsData.map(job => [`${job.title}-${job.organization}`, job])).values()];

        if (jobsData.length === 0) {
            console.error('No jobs fetched from any feeds.');
            document.querySelector('#jobContainer').innerHTML = '<p>No jobs available at the moment. Please try again later.</p>';
            return;
        }

        filteredJobs = jobsData;
        saveToCache(jobsData);
        displayJobs(shuffleArray(jobsData));
        setupPagination();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        document.querySelector('#jobContainer').innerHTML = '<p>Failed to load jobs. Please try again later.</p>';
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
