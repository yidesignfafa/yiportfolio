/* ================================================================
   TRAVEL HEALTHY - JAVASCRIPT INTERACTIVITY
   
   FEATURES:
   1. Carousel Navigation (hero & section carousels)
   2. Auto-play Carousel
   3. Stories Circular Logic (5-card rotating carousel)
   4. Scroll Animation (fade-in images)
   5. Floating Button Visibility (scroll-to-top)
   ================================================================ */

/* ================================================================
   1. CAROUSEL NAVIGATION LOGIC
   
   Each carousel has:
   - A unique ID
   - A current index
   - A number of slides
   
   Function: moveCarousel(id, direction)
   - direction: -1 (previous) or 1 (next)
   - Loops through slides infinitely
   ================================================================ */

   const carousels = {
    'hero-carousel': { index: 0, slides: 3 },
    'carousel-1': { index: 0, slides: 3 }
};

/**
 * Move carousel to next/previous slide
 * @param {string} id - The carousel container ID
 * @param {number} direction - Movement direction (-1 or 1)
 */
function moveCarousel(id, direction) {
    const c = carousels[id];
    const container = document.getElementById(id);
    const slides = container.querySelectorAll('.carousel-slide');
    
    // Remove active class from current slide
    slides[c.index].classList.remove('active');
    
    // Calculate next index (loops back to 0 at the end)
    c.index = (c.index + direction + c.slides) % c.slides;
    
    // Add active class to new slide
    slides[c.index].classList.add('active');
}

/**
 * Auto-play carousels every 4 seconds
 * EDIT: Change 4000 to adjust speed (in milliseconds)
 */
setInterval(() => {
    moveCarousel('hero-carousel', 1);
    moveCarousel('carousel-1', 1);
}, 4000);


/* ================================================================
   2. STORIES SECTION - CIRCULAR CAROUSEL LOGIC
   
   Five story cards that rotate in a circle:
   [left-2] [left-1] [ACTIVE] [right-1] [right-2]
   
   Click any card to center it and update the description.
   Uses modulo arithmetic to calculate relative positions.
   ================================================================ */

/**
 * Story data - EDIT THIS to add/remove/modify stories
 * title: Card heading
 * desc: Description (appears when card is active)
 * bg: Card background color
 * img: Image path for background
 */
 const storiesData = [
    {
        title: "Early Sketches",
        desc: "From early sketches to wireframes, I explored ideas quickly to shape concepts and validate directions before moving into high-fidelity design.",
        bg: "#2A2929",
        img: "./img/morestories/early sketches.png"
    },
    {
        title: "Stakeholder Meetings",
        desc: "I had bi-weekly meetings with cross-functional stakeholders from 2022 to 2024, aligning product direction, documenting decisions, and translating clinical needs into design solutions.",
        bg: "#C8E6C9",
        img: "./img/morestories/Meetings.png"
    },
    {
        title: "System Architecture",
        desc: "To meet strict MGH privacy requirements and support travelers with limited connectivity, I worked closely with engineers to define and design a Local-First architecture.",
        bg: "#BBDEFB",
        img: "./img/morestories/system-architecture-diagram-v3.png"
    },
    {
        title: "Research Synthesis",
        desc: "I synthesized stakeholder requirements and user pain points to define the MVP feature set, prioritizing high-impact functionality under real-world constraints.",
        bg: "#E1BEE7",
        img: "./img/morestories/mapping.png"
    },
    {
        title: "Design Review & Recognition",
        desc: "The project received strong feedback from stakeholders and engineers. I prepared materials and submitted the work for the 2024 UX Design Awards, where it received industry recognition.",
        bg: "#FFE0B2",
        img: "./img/morestories/Team.png"
    }
];


let activeIndex = 2; // Start with center card (Index 2 in 0-4 array)
const stage = document.getElementById('stories-stage');
const descDisplay = document.getElementById('story-desc');

/**
 * Initialize story cards - Creates DOM elements for each story
 */
function initStories() {
    storiesData.forEach((story, i) => {
        const card = document.createElement('div');
        card.classList.add('story-card');
        card.innerText = story.title;
        card.style.backgroundColor = story.bg;
        card.style.backgroundImage = `url('${story.img}')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
        
        // Click to update/center that card
        card.onclick = () => updateStories(i);
        stage.appendChild(card);
    });
    // Initial positioning
    updateStories(activeIndex);
}

/**
 * Update story cards position and description
 * @param {number} newIndex - Index of card to center
 */
function updateStories(newIndex) {
    activeIndex = newIndex;
    const cards = document.querySelectorAll('.story-card');
    const total = cards.length;
    
    // Fade out description, then fade in new one
    descDisplay.style.opacity = 0;
    setTimeout(() => {
        descDisplay.innerText = storiesData[activeIndex].desc;
        descDisplay.style.opacity = 1;
    }, 10);

    // Position each card based on its distance from active index
    cards.forEach((card, i) => {
        card.className = 'story-card'; // Reset all classes
        
        // Calculate circular distance
        let diff = (i - activeIndex) % total;
        if (diff < 0) diff += total;

        // Map diff to CSS classes
        if (diff === 0) {
            card.classList.add('active');
            card.style.zIndex = 10;
        } else if (diff === 1) {
            card.classList.add('right-1');
            card.style.zIndex = 5;
        } else if (diff === 2) {
            card.classList.add('right-2');
            card.style.zIndex = 1;
        } else if (diff === 3) {
            card.classList.add('left-2');
            card.style.zIndex = 1;
        } else if (diff === 4) {
            card.classList.add('left-1');
            card.style.zIndex = 5;
        }
    });
}

// Initialize stories on page load
initStories();


/* ================================================================
   3. SCROLL INTERACTIONS
   
   A. Scroll-triggered image animations
      - Images fade in and slide up when scrolled into view
   
   B. Floating button visibility
      - Scroll-to-top button appears after 800px
   ================================================================ */

document.addEventListener("DOMContentLoaded", function() {

    /* =====================================================
       MOBILE NAVIGATION TOGGLE
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
       A. SCROLL-TRIGGERED IMAGE ANIMATIONS
       Uses Intersection Observer for performance.
       Disabled on mobile (<=768px).
    ===================================================== */

    if (window.innerWidth > 768) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedImages = document.querySelectorAll('.full-span-image');
        animatedImages.forEach(img => {
            observer.observe(img);
        });
    }

    /* =====================================================
       B. SCROLL-TO-TOP BUTTON VISIBILITY
       Uses passive listener for better scroll performance.
    ===================================================== */

    const floatTopBtn = document.querySelector('.float-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 800) {
            floatTopBtn.classList.add('visible');
        } else {
            floatTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    /* =====================================================
       C. CONTENT PROTECTION
       Disable right-click, key shortcuts, drag
    ===================================================== */
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123) { e.preventDefault(); return false; }
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) { e.preventDefault(); return false; }
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) { e.preventDefault(); return false; }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) { e.preventDefault(); return false; }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) { e.preventDefault(); return false; }
    });

    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
});