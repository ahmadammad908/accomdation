
const carousel = document.getElementById('carousel');
const dotsEl = document.getElementById('dots');
const cards = carousel.querySelectorAll('.card-item');
const total = cards.length;
let current = 0;
let autoTimer = null;

function isMobile() {
    return window.innerWidth <= 768;
}

function getVisibleDotsCount() {
    return isMobile() ? 4 : 2;
}

function getStartIndex() {
    const visibleCount = getVisibleDotsCount();
    const halfVisible = Math.floor(visibleCount / 2);

    if (total <= visibleCount) return 0;

    let start = current - halfVisible;
    if (start < 0) start = 0;
    if (start + visibleCount > total) start = total - visibleCount;

    return start;
}

function buildDots() {
    dotsEl.innerHTML = '';
    const visibleCount = getVisibleDotsCount();
    const startIndex = getStartIndex();
    const endIndex = Math.min(startIndex + visibleCount, total);

    for (let i = startIndex; i < endIndex; i++) {
        const btn = document.createElement('button');
        btn.setAttribute('aria-label', 'Go to card ' + (i + 1));
        btn.style.cssText = 'border:none;cursor:pointer;padding:0;transition:all 0.3s;background:' + (i === current ? '#8b5cf6' : '#cbd5e1');
        btn.style.borderRadius = i === current ? '20px' : '50%';
        btn.style.width = i === current ? '26px' : '8px';
        btn.style.height = '8px';
        btn.style.opacity = i === current ? '1' : '0.6';
        btn.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsEl.appendChild(btn);
    }
}

function updateDots(idx) {
    const btns = dotsEl.querySelectorAll('button');
    const visibleCount = getVisibleDotsCount();
    const startIndex = getStartIndex();

    if (idx < startIndex || idx >= startIndex + visibleCount) {
        buildDots();
        return;
    }

    btns.forEach((b, i) => {
        const actualIndex = startIndex + i;
        if (actualIndex === idx) {
            b.style.background = '#8b5cf6';
            b.style.width = '26px';
            b.style.borderRadius = '20px';
            b.style.opacity = '1';
        } else {
            b.style.background = '#cbd5e1';
            b.style.width = '8px';
            b.style.borderRadius = '50%';
            b.style.opacity = '0.6';
        }
    });
}

function goTo(idx) {
    current = idx;
    const card = cards[idx];
    carousel.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
    updateDots(idx);
}

function next() {
    goTo((current + 1) % total);
}

function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 2000);
}

function handleResize() {
    buildDots();
}

function getClosestCard() {
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft - carousel.scrollLeft - 20);
        if (dist < minDist) { minDist = dist; closest = i; }
    });
    return closest;
}

buildDots();
resetAuto();

// Real-time dot update during scroll
carousel.addEventListener('scroll', () => {
    const closest = getClosestCard();
    if (closest !== current) {
        current = closest;
        updateDots(current);
    }
});

// Final accurate update when scroll stops
carousel.addEventListener('scrollend', () => {
    current = getClosestCard();
    updateDots(current);
});

carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
carousel.addEventListener('mouseleave', resetAuto);
carousel.addEventListener('touchstart', () => clearInterval(autoTimer), { passive: true });
carousel.addEventListener('touchend', resetAuto, { passive: true });

window.addEventListener('resize', handleResize);










document.addEventListener('DOMContentLoaded', function () {

    // ═══ 1. MOBILE MENU ═══
    var mobileToggle = document.getElementById('mobile-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileClose = document.getElementById('mobile-close');

    function openMobileMenu() {
        if (mobileMenu) { mobileMenu.classList.add('active'); document.body.style.overflow = 'hidden'; }
    }
    function closeMobileMenu() {
        if (mobileMenu) { mobileMenu.classList.remove('active'); document.body.style.overflow = ''; }
    }
    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a[href]').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobileMenu(); });


    // ═══ 2. MOBILE ACCORDION ═══
    document.querySelectorAll('.mobile-accordion > button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = this.getAttribute('data-target');
            var target = document.getElementById(targetId);
            var icon = this.querySelector('i');
            if (target) {
                var isOpen = target.classList.contains('open');
                document.querySelectorAll('.mobile-dropdown-content').forEach(function (el) { el.classList.remove('open'); });
                document.querySelectorAll('.mobile-accordion > button i').forEach(function (ic) { ic.style.transform = 'rotate(0deg)'; });
                if (!isOpen) { target.classList.add('open'); if (icon) icon.style.transform = 'rotate(180deg)'; }
            }
        });
    });


    // ═══ 3. NAV SCROLL EFFECT ═══
    var mainNav = document.getElementById('main-nav');
    if (mainNav) {
        function updateNavState() {
            if (window.pageYOffset > 60) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        }
        updateNavState();
        window.addEventListener('scroll', updateNavState, { passive: true });
    }


    // ═══ 4. SMOOTH SCROLL ═══
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var top = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });


    // ═══ 5. FAQ ACCORDION ═══
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = this.closest('.faq-item');
            if (!item) return;
            var isActive = item.classList.contains('active');
            var container = item.parentElement;
            if (container) {
                container.querySelectorAll('.faq-item.active').forEach(function (ai) { ai.classList.remove('active'); });
            }
            if (!isActive) item.classList.add('active');
        });
    });


    // ═══ 6. COUNTER ANIMATION ═══
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var duration = 2000;
        var startTime = performance.now();

        function update(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(target * eased);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    var counterElements = document.querySelectorAll('[data-count]');
    if (counterElements.length > 0) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        counterElements.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            el.textContent = target.toLocaleString() + suffix;
            counterObserver.observe(el);
        });
    }


    // ═══ 7. SCROLL ENHANCE ═══
    var revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.01 });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    }


    // ═══ 8. DROPDOWN MENU ═══
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown-parent')) {
            document.querySelectorAll('.dropdown-parent.open').forEach(function (dd) { dd.classList.remove('open'); });
        }
    });
    document.querySelectorAll('.dropdown-parent > a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            if (window.innerWidth < 1024) {
                e.preventDefault();
                var parent = this.closest('.dropdown-parent');
                if (parent) {
                    document.querySelectorAll('.dropdown-parent.open').forEach(function (dd) {
                        if (dd !== parent) dd.classList.remove('open');
                    });
                    parent.classList.toggle('open');
                }
            }
        });
    });


    // ═══ 9. LEAD CAPTURE FORM ═══
    var leadForm = document.getElementById('lead-capture-form');
    var leadSuccess = document.getElementById('lead-capture-success');
    if (leadForm && leadSuccess) {
        leadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var formData = new FormData(this);
            var submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Sending...';
            fetch(leadForm.action, { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' }, body: formData })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data && data.success) { leadForm.classList.add('hidden'); leadSuccess.classList.remove('hidden'); }
                    else { alert(data.message || 'Something went wrong.'); submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> Send Message'; }
                })
                .catch(function () { alert('Network error.'); submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> Send Message'; });
        });
    }


    // ═══ 10. SERVICE CATEGORY TABS ═══
    window.showSvcCategory = function (category) {
        document.querySelectorAll('.svc-cat-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab.getAttribute('data-svc-cat') === category);
        });
        document.querySelectorAll('.svc-cat-panel').forEach(function (panel) {
            var isTarget = panel.getAttribute('data-svc-panel') === category;
            panel.classList.toggle('hidden', !isTarget);
        });
    };

});
