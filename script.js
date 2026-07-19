document.addEventListener('DOMContentLoaded', () => {

    /* --- Sophisticated Network Mesh Background (UI Element) --- */
    const canvas = document.getElementById('mesh-background');
    const ctx = canvas.getContext('2d');
    let points = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initPoints();
    }
    
    function initPoints() {
        points = [];
        for(let i = 0; i < 50; i++) {
            points.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    function drawMesh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)'; //Emerald with low opacity
        ctx.lineWidth = 1;

        for(let i = 0; i < points.length; i++) {
            let p1 = points[i];
            p1.x += p1.vx;
            p1.y += p1.vy;
            
            // Boundary checks
            if(p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
            if(p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

            // Draw lines
            for(let j = i + 1; j < points.length; j++) {
                let p2 = points[j];
                const dist = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
                if(dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawMesh);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawMesh();


    /* --- Mobile Navigation Drawer --- */
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        icon.classList.toggle('fa-bars-staggered');
        icon.classList.toggle('fa-times');
    });

    // Close mobile drawer on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.add('fa-bars-staggered');
                icon.classList.remove('fa-times');
            }
        });
    });


    /* --- Smooth Navigation Highlight Tracking --- */
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });


    /* --- AJAX Integration: Dynamic GitHub Stats (UI Element) --- */
    // Demonstrating the core pattern of asynchronously fetching repository data.
    const gitRepoCards = document.querySelectorAll('.repo-card[data-github]');
    
    gitRepoCards.forEach(card => {
        const repoPath = card.getAttribute('data-github');
        const dynamicInfo = card.querySelector('.dynamic-repo-info');

        // Hypothetical API endpoint, replacing the real GitHub API (which requires an OAuth token for high limit)
        // This simulates the data structure.
        function simulateFetchRepoData(path) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ stargazers: Math.floor(Math.random() * 100) });
                }, 1500 + Math.random() * 1000); // Simulate network latency
            });
        }

        // The 'AJAX' core pattern
        simulateFetchRepoData(repoPath)
            .then(data => {
                dynamicInfo.innerHTML = `Stargazers: <span class="stargazers">${data.stargazers}</span>`;
            })
            .catch(err => {
                dynamicInfo.innerHTML = 'Stats N/A';
            });
    });


    /* --- Custom Sophisticated Toast Notification System (Replacement for Alert) --- */
    function showToast(message, type = 'primary') {
        const container = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.classList.add('toast');
        if(type) toast.classList.add(`toast-${type}`); // primary, error

        toast.innerHTML = `
            <i class="fas fa-check-circle toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Entry Animation (add class 'show')
        setTimeout(() => toast.classList.add('show'), 10);

        // Fade Out Sequence
        // 1. Add class 'hide' (start fade transition)
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
        }, 3500);

        // 2. Remove element entirely after transition completes
        setTimeout(() => {
            toast.remove();
        }, 3800);
    }


    /* --- Contact Form Submission & Feedback --- */
    const contactForm = document.getElementById('connect-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data efficiently
            const formData = {
                name: contactForm.name.value.trim(),
                email: contactForm.email.value.trim(),
                message: contactForm.message.value.trim()
            };

            // Developer Hook: Wire up server submission here (e.g., Formspree, custom API)
            console.log('Valid engineering package received:', formData);

            // Replace Windows Alert with Custom Toast
            showToast(`Acknowledged, ${formData.name}. Initializing transmission...`, 'primary');
            
            contactForm.reset();
        });
    }
});