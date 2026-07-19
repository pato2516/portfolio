document.addEventListener('DOMContentLoaded', () => {

    /* --- Sophisticated Network Mesh Background --- */
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
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
        ctx.lineWidth = 1;

        for(let i = 0; i < points.length; i++) {
            let p1 = points[i];
            p1.x += p1.vx;
            p1.y += p1.vy;
            
            if(p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
            if(p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

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


    /* --- Theme Toggle --- */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if(savedTheme === 'light') {
        document.body.classList.add('theme-light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('theme-light');
        const isLight = document.body.classList.contains('theme-light');
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        showToast(`Theme switched to ${isLight ? 'light' : 'dark'} mode`, 'primary');
    });


    /* --- Back to Top Button --- */
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if(window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* --- Mobile Navigation Drawer --- */
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        icon.classList.toggle('fa-bars-staggered');
        icon.classList.toggle('fa-times');
    });

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


    /* --- Animated Counter --- */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const increment = target / 30;
            
            const updateCounter = () => {
                current += increment;
                if(current < target) {
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, 50);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    // Trigger counter animation when hero is visible
    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting && entry.target.classList.contains('hero')) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const heroSection = document.querySelector('.hero');
    if(heroSection) observer.observe(heroSection);


    /* --- Animated Skill Bars --- */
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar-fill');
        
        skillBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            bar.style.width = percentage + '%';
        });
    }

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting && entry.target.id === 'skills') {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsSection = document.getElementById('skills');
    if(skillsSection) skillsObserver.observe(skillsSection);


    /* --- Repository Filtering --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const repoCards = document.querySelectorAll('.repo-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            repoCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if(filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* --- Repository Search --- */
    const repoSearch = document.getElementById('repo-search');
    if(repoSearch) {
        repoSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            repoCards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                if(title.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    /* --- Sync Button Animation --- */
    const syncBtn = document.getElementById('sync-btn');
    if(syncBtn) {
        syncBtn.addEventListener('click', () => {
            const icon = syncBtn.querySelector('i');
            icon.style.animation = 'spin 1s linear';
            
            setTimeout(() => {
                icon.style.animation = 'none';
                showToast('Repositories synchronized!', 'primary');
            }, 1000);
        });
    }


    /* --- Custom Toast Notification System --- */
    function showToast(message, type = 'primary') {
        const container = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.classList.add('toast');
        if(type) toast.classList.add(`toast-${type}`);

        toast.innerHTML = `
            <i class="fas fa-check-circle toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
        }, 3500);

        setTimeout(() => toast.remove(), 3800);
    }


    /* --- Contact Form Submission --- */
    const contactForm = document.getElementById('connect-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: contactForm.querySelector('input[name="identity"]').value.trim(),
                email: contactForm.querySelector('input[name="endpoint"]').value.trim(),
                message: contactForm.querySelector('textarea[name="payload"]').value.trim()
            };

            console.log('Valid engineering package received:', formData);
            showToast(`Acknowledged, ${formData.name}. Initializing transmission...`, 'primary');
            
            contactForm.reset();
        });
    }


    /* --- Newsletter Signup --- */
    const newsletterForm = document.getElementById('newsletter-form');
    if(newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            showToast(`Welcome aboard! Confirmation sent to ${email}`, 'primary');
            newsletterForm.reset();
        });
    }


    /* --- Keyboard Shortcuts --- */
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus search
        if((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if(repoSearch) repoSearch.focus();
            showToast('Search focused', 'primary');
        }
        
        // Escape: Blur focused element
        if(e.key === 'Escape') {
            document.activeElement.blur();
        }
    });


    /* --- Intersection Observer for Fade-in Animations --- */
    const fadeInElements = document.querySelectorAll('.section');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(el => fadeObserver.observe(el));


    /* --- Add CSS Animation for Spin --- */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);


    /* --- Smooth Scroll for Navigation Links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if(href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if(target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    /* --- Analytics Tracking (Optional) --- */
    function trackEvent(eventName, eventData = {}) {
        console.log(`Event tracked: ${eventName}`, eventData);
        // Send to analytics service here
    }

    // Track page view
    trackEvent('page_view', { 
        page: 'portfolio',
        timestamp: new Date().toISOString()
    });

    // Track section views
    const trackingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                trackEvent('section_viewed', { 
                    section: entry.target.id,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => trackingObserver.observe(section));


    /* --- Prefetch Link Hover --- */
    document.querySelectorAll('a[href^="https://"]').forEach(link => {
        link.addEventListener('mouseenter', () => {
            trackEvent('link_hover', { 
                href: link.href 
            });
        });

        link.addEventListener('click', () => {
            trackEvent('link_click', { 
                href: link.href 
            });
        });
    });


    /* --- Add Scroll Spy Visual Indicator --- */
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if(scrollPos >= sectionTop - 200 && scrollPos < sectionTop + sectionHeight) {
                const sectionId = section.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });


    /* --- Error Handling for API Calls --- */
    function handleApiError(error) {
        console.error('API Error:', error);
        showToast('An error occurred. Please try again.', 'error');
    }

    /* --- Welcome Message on First Visit --- */
    const hasVisited = localStorage.getItem('hasVisited');
    if(!hasVisited) {
        setTimeout(() => {
            showToast('Welcome to my portfolio! Explore my projects and get in touch.', 'primary');
            localStorage.setItem('hasVisited', 'true');
        }, 1000);
    }

});
