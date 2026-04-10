document.addEventListener('DOMContentLoaded', () => {

    // 1. Typewriter Effect
    const phrases = [
        "Geospatial Data Scientist",
        "Full Stack Developer (Junior)",
        "AI / Vision Enthusiast"
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

            if(isDeleting && j <= phrases[i].length) {
                currentPhrase.pop(phrases[i][j]);
                j--;
                textDisplay.innerHTML = currentPhrase.join('');
            }

            if (j == phrases[i].length) {
                isEnd = true;
                isDeleting = true;
            }

            if (isDeleting && j === 0) {
                currentPhrase = [];
                isDeleting = false;
                i++;
                if (i === phrases.length) {
                    i = 0; // Loop back to start
                }
            }
        }
        
        const spedUp = Math.random() * (80 -50) + 50;
        const normalSpeed = Math.random() * (200 - 100) + 100;
        const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed;
        setTimeout(loop, time);
    }
    
    // Start typing effect slightly after load
    setTimeout(loop, 500);

    // 2. Scroll Animation Observer (Intersection Observer)
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // 3. Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    // Show item
                    card.style.display = 'flex';
                    // Trigger reflow for animation if needed
                    card.style.animation = 'fadeIn 0.5s ease-in-out forwards';
                } else {
                    // Hide item
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
