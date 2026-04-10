document.addEventListener('DOMContentLoaded', () => {

    // ================================================================
    // 1. TYPEWRITER EFFECT
    // ================================================================
    const phrases = [
        "MSc Remote Sensing · Geomatics Eng.",
        "Modern Physics Explorer",
        "Geospatial Data Scientist",
        "Computer Vision Researcher",
        "Full Stack Developer",
    ];
    let i = 0;
    let j = 0;
    let currentPhrase = [];
    let isDeleting = false;
    let isEnd = false;
    const textDisplay = document.getElementById('typewriter');

    function loop() {
        isEnd = false;
        textDisplay.innerHTML = currentPhrase.join('');

        if (i < phrases.length) {
            if (!isDeleting && j <= phrases[i].length) {
                currentPhrase.push(phrases[i][j]);
                j++;
                textDisplay.innerHTML = currentPhrase.join('');
            }
            if (isDeleting && j <= phrases[i].length) {
                currentPhrase.pop();
                j--;
                textDisplay.innerHTML = currentPhrase.join('');
            }
            if (j === phrases[i].length) {
                isEnd = true;
                isDeleting = true;
            }
            if (isDeleting && j === 0) {
                currentPhrase = [];
                isDeleting = false;
                i++;
                if (i === phrases.length) i = 0;
            }
        }

        const speedUp  = Math.random() * (70 - 40) + 40;
        const normal   = Math.random() * (130 - 80) + 80;
        const time     = isEnd ? 2200 : isDeleting ? speedUp : normal;
        setTimeout(loop, time);
    }

    setTimeout(loop, 600);


    // ================================================================
    // 2. SCROLL PROGRESS BAR
    // ================================================================
    const progressBar = document.getElementById('scrollProgressBar');

    window.addEventListener('scroll', () => {
        const totalScroll   = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress      = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });


    // ================================================================
    // 3. NAVBAR SCROLL STATE + ACTIVE LINK HIGHLIGHT
    // ================================================================
    const navbar   = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.nav-links a.nav-item');

    function updateNavbar() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop    = section.offsetTop - 120;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();


    // ================================================================
    // 4. HAMBURGER MENU
    // ================================================================
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu(open) {
        hamburger.classList.toggle('open', open);
        mobileMenu.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
        mobileMenu.setAttribute('aria-hidden', !open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('open');
        toggleMenu(!isOpen);
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (
            mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            toggleMenu(false);
        }
    });


    // ================================================================
    // 5. SCROLL ANIMATION OBSERVER (FADE-UP)
    // ================================================================
    const fadeUpElements = document.querySelectorAll('.fade-up');

    const observerOptions = {
        root:       null,
        rootMargin: '0px',
        threshold:  0.12,
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Stagger delay for groups of elements
                const delay = entry.target.closest('.stats-grid')   ? idx * 80 :
                              entry.target.closest('.skills-grid')   ? idx * 60 :
                              entry.target.closest('.project-grid')  ? idx * 60 :
                              entry.target.closest('.about-cards')   ? idx * 100 :
                              entry.target.closest('.timeline')      ? idx * 120 : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => scrollObserver.observe(el));


    // ================================================================
    // 6. ANIMATED STAT COUNTERS
    // ================================================================
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(element) {
        const target   = parseInt(element.getAttribute('data-target'), 10);
        const duration = 1600;
        const step     = 16;
        const steps    = duration / step;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, step);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach(el => counterObserver.observe(el));


    // ================================================================
    // 7. PROJECT FILTERING
    // ================================================================
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category').split(' ');
                const show = filterValue === 'all' || categories.includes(filterValue);

                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

                if (show) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 400);
                }
            });
        });
    });


    // ================================================================
    // 8. SCROLLSPY & SMOOTH SCROLLING
    // ================================================================
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let currentId = entry.target.getAttribute('id');
                if (entry.target.tagName.toLowerCase() === 'header') currentId = '';
                
                navItems.forEach(link => {
                    link.classList.remove('active-link');
                    if (currentId && link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active-link');
                    } else if (!currentId && link.getAttribute('href') === '#') {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: "-10% 0px -50% 0px" });

    sections.forEach(section => scrollSpyObserver.observe(section));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset     = navbar.offsetHeight + 20;
                const targetTop  = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
        });
    });

});
