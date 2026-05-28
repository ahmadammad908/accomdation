(function () {
    const video = document.getElementById('introVideo');
    const loader = document.getElementById('videoLoader');
    const controlsBar = document.getElementById('controlsBar');
    const muteBadge = document.getElementById('muteBadge');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const timeDisplay = document.getElementById('timeDisplay');
    const skipBtn = document.getElementById('skipBtn');
    const container = document.getElementById('videoContainer');
    let previousVolume = 0.5;
    let controlsVisible = false;

    // --- FIX: Start with muted to allow autoplay ---
    video.muted = true;      // MUST be true for autoplay to work
    video.volume = 0.5;      // Default volume will apply when unmuted

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateTime() {
        if (video.duration) {
            timeDisplay.textContent =
                `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
    }

    function hideLoader() {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 400);
        if (!controlsVisible) {
            controlsBar.classList.add('visible');
            controlsVisible = true;
        }
    }

    video.addEventListener('canplaythrough', hideLoader);
    video.addEventListener('playing', hideLoader);
    setTimeout(() => { if (video.currentTime > 0) hideLoader(); }, 2000);
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);

    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // --- Mute button logic (video starts muted, so show badge) ---
    muteBtn.addEventListener('click', () => {
        if (video.muted) {
            // Unmute: restore previous volume
            video.muted = false;
            video.volume = previousVolume;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteBadge.style.display = "none";
        } else {
            // Mute: save current volume, set to 0
            previousVolume = video.volume || 0.5;
            video.muted = true;
            video.volume = 0;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteBadge.style.display = "flex";
        }
    });

    // --- Initial state: muted, show badge, mute button icon ---
    muteBadge.style.display = "flex";      // Show because video starts muted
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';  // Show mute icon

    function endIntro() {
        container.style.transition = "opacity 0.6s ease";
        container.style.opacity = "0";
        document.body.classList.remove("video-playing");
        document.body.classList.add("video-finished");
        setTimeout(() => {
            container.style.display = "none";
            document.body.style.overflow = "auto";
        }, 600);
    }

    skipBtn.addEventListener('click', endIntro);
    video.addEventListener('ended', endIntro);

    // Attempt to play - now it WILL work because video is muted
    video.play().catch(e => console.log("Autoplay prevented:", e));
})();

    // Carousel logic
    const carousel = document.getElementById('carousel');
    const dotsEl = document.getElementById('dots');
    const cards = Array.from(carousel.querySelectorAll('.snap-start'));
    let current = 0, autoTimer = null;

    carousel.style.scrollSnapType = 'x mandatory';
    carousel.style.scrollBehavior = 'smooth';

    function buildDots() {
        dotsEl.innerHTML = '';

        const isMobile = window.innerWidth <= 768;
        const maxDots = isMobile ? 4 : 2;
        const step = Math.ceil(cards.length / maxDots);

        const limitedCards = [];

        for (let i = 0; i < cards.length; i += step) {
            limitedCards.push(i);
            if (limitedCards.length === maxDots) break;
        }

        limitedCards.forEach((cardIndex, i) => {
            const btn = document.createElement('button');

            btn.style.cssText = `
                border:none;
                cursor:pointer;
                transition:all 0.3s;
                background:${i === 0 ? '#8b5cf6' : '#cbd5e1'};
                border-radius:${i === 0 ? '20px' : '50%'};
                width:${i === 0 ? '26px' : '8px'};
                height:8px;
                opacity:${i === 0 ? '1' : '0.6'};
            `;

            btn.addEventListener('click', () => {
                goTo(cardIndex);
                resetAuto();
            });

            dotsEl.appendChild(btn);
        });
    }

    function updateDots(idx) {
        const btns = dotsEl.querySelectorAll('button');
        btns.forEach((btn, i) => {
            if (i === idx) {
                btn.style.background = '#8b5cf6';
                btn.style.width = '26px';
                btn.style.borderRadius = '20px';
                btn.style.opacity = '1';
            } else {
                btn.style.background = '#cbd5e1';
                btn.style.width = '8px';
                btn.style.borderRadius = '50%';
                btn.style.opacity = '0.6';
            }
        });
    }

    function goTo(idx) {
        current = idx;
        const paddingLeft = parseInt(getComputedStyle(carousel).paddingLeft) || 0;
        carousel.scrollTo({
            left: cards[idx].offsetLeft - paddingLeft,
            behavior: 'smooth'
        });
        updateDots(idx);
    }

    function next() {
        goTo((current + 1) % cards.length);
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => next(), 3500);
    }

    buildDots();
    resetAuto();

    let scrollTimeout;

    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let closest = 0, minDist = Infinity;
            const paddingLeft = parseInt(getComputedStyle(carousel).paddingLeft) || 0;

            cards.forEach((card, idx) => {
                const dist = Math.abs((card.offsetLeft - paddingLeft) - carousel.scrollLeft);
                if (dist < minDist) {
                    minDist = dist;
                    closest = idx;
                }
            });

            if (closest !== current) {
                current = closest;
                updateDots(current);
            }
        }, 100);
    });

    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', resetAuto);
    window.addEventListener('resize', () => buildDots());

    // Mobile menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');

    function openMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);

    mobileMenu.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', closeMenu)
    );

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });

    // Accordion
    document.querySelectorAll('.mobile-accordion > button').forEach(btn => {
        btn.addEventListener('click', function () {
            const target = document.getElementById(this.getAttribute('data-target'));
            const icon = this.querySelector('i');

            if (target) {
                const isOpen = target.classList.contains('open');

                document.querySelectorAll('.mobile-dropdown-content')
                    .forEach(el => el.classList.remove('open'));

                document.querySelectorAll('.mobile-accordion > button i')
                    .forEach(ic => ic.style.transform = 'rotate(0deg)');

                if (!isOpen) {
                    target.classList.add('open');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    });

    // Nav scroll effect
    const mainNav = document.getElementById('main-nav');

    function updateNav() {
        if (window.pageYOffset > 60) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNav);
    updateNav();