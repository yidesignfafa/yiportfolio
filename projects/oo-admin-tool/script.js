/* ================================================================
   OO ADMIN TOOL - JAVASCRIPT INTERACTIVITY

   FEATURES:
   1. Mobile navigation toggle
   2. Smooth scroll for anchor links
   3. Floating scroll-to-top button visibility control
   ================================================================ */

document.addEventListener('DOMContentLoaded', function() {

    /* =====================================================
       1. MOBILE NAVIGATION TOGGLE
    ===================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    /* =====================================================
       2. SMOOTH SCROLL FOR ANCHOR LINKS
    ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =====================================================
       3. SCROLL-TO-TOP BUTTON VISIBILITY
       Uses passive listener for better scroll performance.
    ===================================================== */
    const floatTopBtn = document.querySelector('.float-top');

    if (floatTopBtn) {
        if (window.scrollY > 800) {
            floatTopBtn.classList.add('visible');
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 800) {
                floatTopBtn.classList.add('visible');
            } else {
                floatTopBtn.classList.remove('visible');
            }
        }, { passive: true });
    }

    /* =====================================================
       5. CONTENT PROTECTION
       Disable drag
    ===================================================== */
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
});
