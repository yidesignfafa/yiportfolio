/* ================================================================
   PORTFOLIO HOMEPAGE - JAVASCRIPT

   FEATURES:
   0. Password Protection
   1. Scroll Animation (image zoom effect)
   2. Window Resize Handling
   3. Performance Optimizations
   ================================================================ */

   /* --- PASSWORD PROTECTION (Hashed) --- */
   (function initPasswordGate() {

       const cyrb53 = (str, seed = 0) => {
           let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
           for (let i = 0, ch; i < str.length; i++) {
               ch = str.charCodeAt(i);
               h1 = Math.imul(h1 ^ ch, 2654435761);
               h2 = Math.imul(h2 ^ ch, 1597334677);
           }
           h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
           h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
           h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
           h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
           return 4294967296 * (2097151 & h2) + (h1 >>> 0);
       };

       // Pre-computed hash of the password (no plaintext stored)
       const PASSWORD_HASH = 5049523805025423;
       const SESSION_KEY = 'portfolio_auth';

       // Check if already authenticated this session
       if (sessionStorage.getItem(SESSION_KEY) === 'true') {
           const overlay = document.getElementById('password-overlay');
           if (overlay) overlay.remove();
           return;
       }

       // Lock scroll
       document.body.classList.add('pw-locked');

       // Init canvas background on desktop
       if (window.innerWidth > 768) {
           initPwCanvas();
       }

       const input = document.getElementById('pw-input');
       const btn = document.getElementById('pw-submit');
       const error = document.getElementById('pw-error');

       function attemptLogin() {
           if (!input) return;
           if (cyrb53(input.value) === PASSWORD_HASH) {
               sessionStorage.setItem(SESSION_KEY, 'true');
               const overlay = document.getElementById('password-overlay');
               overlay.classList.add('hidden');
               document.body.classList.remove('pw-locked');
               // Remove overlay from DOM after transition
               setTimeout(() => overlay.remove(), 700);
           } else {
               error.textContent = 'Incorrect password';
               input.value = '';
               input.focus();
               // Shake animation
               const form = document.querySelector('.pw-form');
               form.style.animation = 'shake 0.4s ease';
               setTimeout(() => form.style.animation = '', 400);
           }
       }

       if (btn) btn.addEventListener('click', attemptLogin);
       if (input) {
           input.addEventListener('keydown', (e) => {
               if (e.key === 'Enter') {
                   attemptLogin();
                   return;
               }
               // Clear error on typing (but not on Enter)
               if (error) error.textContent = '';
           });
           // Auto-focus
           setTimeout(() => input.focus(), 100);
       }

       function initPwCanvas() {
           const pwCanvas = document.getElementById('pw-canvas');
           if (!pwCanvas) return;
           const pwCtx = pwCanvas.getContext('2d');
           let w = pwCanvas.width = window.innerWidth;
           let h = pwCanvas.height = window.innerHeight;
           const blobs = [];

           for (let i = 0; i < 18; i++) {
               blobs.push({
                   x: Math.random() * w,
                   y: Math.random() * h,
                   vx: 0.4 + Math.random() * 0.8,
                   vy: (Math.random() - 0.5) * 0.3,
                   radius: 220 + Math.random() * 320,
                   opacity: 0.08 + Math.random() * 0.5,
                   pulseSpeed: 0.008 + Math.random() * 0.009,
                   pulseOffset: Math.random() * Math.PI * 2
               });
           }

           function drawPw() {
               // Stop if overlay is gone
               if (!document.getElementById('password-overlay') ||
                   document.getElementById('password-overlay').classList.contains('hidden')) return;
               pwCtx.clearRect(0, 0, w, h);
               blobs.forEach(b => {
                   const r = b.radius + Math.sin(Date.now() * b.pulseSpeed + b.pulseOffset) * 40;
                   b.x += b.vx;
                   b.y += b.vy;
                   if (b.x < -500) b.x = w + 500;
                   if (b.x > w + 500) b.x = -500;
                   if (b.y < -500) b.y = h + 500;
                   if (b.y > h + 500) b.y = -500;
                   const g = pwCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
                   g.addColorStop(0, `rgba(160, 210, 255, ${b.opacity * 0.3})`);
                   g.addColorStop(0.4, `rgba(180, 225, 255, ${b.opacity * 0.9})`);
                   g.addColorStop(1, 'rgba(255, 255, 255, 0)');
                   pwCtx.fillStyle = g;
                   pwCtx.beginPath();
                   pwCtx.arc(b.x, b.y, r, 0, Math.PI * 2);
                   pwCtx.fill();
               });
               requestAnimationFrame(drawPw);
           }
           drawPw();

           window.addEventListener('resize', () => {
               w = pwCanvas.width = window.innerWidth;
               h = pwCanvas.height = window.innerHeight;
           }, { passive: true });
       }
   })();

   let ticking = false;
   let resizeTicking = false;

   // Cache target width for performance
   let targetWidth = 0;

   /* --- BLUE SKY CANVAS BACKGROUND --- */
   let canvas, ctx, canvasWidth, canvasHeight;
   let particles = [];
   
   class SkyParticle {
       constructor() { this.reset(); }
       reset() {
           this.x = Math.random() * canvasWidth;
           this.y = Math.random() * canvasHeight;
           this.vx = 0.4 + Math.random() * 0.8;
           this.vy = (Math.random() - 0.5) * 0.3;
           this.baseRadius = 220 + Math.random() * 320;
           this.radius = this.baseRadius;
           this.opacity = 0.08 + Math.random() * 0.5;
           this.pulseSpeed = 0.008 + Math.random() * 0.009;
           this.pulseOffset = Math.random() * Math.PI * 2;
       }
       update() {
           this.x += this.vx;
           this.y += this.vy;
           this.radius = this.baseRadius + (Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 40);
           const p = 500;
           if (this.x < -p) this.x = canvasWidth + p;
           if (this.x > canvasWidth + p) this.x = -p;
           if (this.y < -p) this.y = canvasHeight + p;
           if (this.y > canvasHeight + p) this.y = -p;
       }
       draw() {
           const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
           g.addColorStop(0, `rgba(160, 210, 255, ${this.opacity* 0.9})`); // blue (0, `rgba(160, 210, 255, ${this.opacity* 0.3})`)  purple (0, `rgba(180, 160, 255, ${this.opacity* 0.9})`)
           g.addColorStop(0.4, `rgba(180, 225, 255, ${this.opacity * 0.4})`);//blue (0.4, `rgba(180, 225, 255, ${this.opacity * 0.9})`) purple  (0.4, `rgba(200, 180, 255, ${this.opacity * 0.3})`)
           g.addColorStop(1, 'rgba(255, 255, 255, 0)');
           ctx.fillStyle = g;
           ctx.beginPath();
           ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
           ctx.fill();
       }
   }
   
   let skyAnimationRunning = false;

   function initSky() {
       // Skip canvas on mobile for performance
       if (window.innerWidth <= 768) return;

       canvas = document.getElementById('hero-canvas');
       if (!canvas) return;
       ctx = canvas.getContext('2d');
       resizeCanvas();
       for (let i = 0; i < 18; i++) particles.push(new SkyParticle());
       skyAnimationRunning = true;
       requestAnimationFrame(animateSky);
   }

   function animateSky() {
       if (!skyAnimationRunning) return;
       // Pause (don't kill) animation on mobile
       if (window.innerWidth <= 768) {
           requestAnimationFrame(animateSky);
           return;
       }
       ctx.clearRect(0, 0, canvasWidth, canvasHeight);
       particles.forEach(p => { p.update(); p.draw(); });
       requestAnimationFrame(animateSky);
   }
   
   function resizeCanvas() {
       if (!canvas) return;
       const hero = document.querySelector('.hero');
       canvasWidth = canvas.width = window.innerWidth;
       canvasHeight = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
   }
   
   /* --- HERO KEYWORD IMAGE POP-UPS --- */
   (function initHeroImagePop() {
       // Skip on mobile / touch devices
       if (window.innerWidth <= 768 || 'ontouchstart' in window) return;

       const keywords = document.querySelectorAll('.hero-keyword');
       const heroContainer = document.getElementById('hero-images');
       if (!keywords.length || !heroContainer) return;

       // Responsive scale factor: offsets shrink on smaller viewports
       // 768px → 0.5, 1440px+ → 1.0
       const vwScale = Math.min(1, Math.max(0.5, (window.innerWidth - 768) / (1440 - 768)));

       // Multi-image map: each keyword can trigger 1 or 2 images
       // sel = data-index on the <img>, dx/dy = offset from keyword center in px
       const imageMap = {
           0: [ // UX — A right-above, B left-below
               { sel: '0',  dx: 160,  dy: -160 },
               { sel: '0b', dx: -180, dy: 30 },
           ],
           1: [ // data visualization — A left-above, B right-below
               { sel: '1',  dx: -200, dy: -120 },
               { sel: '1b', dx: 180,  dy: 50 },
           ],
           2: [ // real-time systems — A right-above, B left-below
               { sel: '2',  dx: 200,  dy: -20 },
               { sel: '2b', dx: -180, dy: 60 },
           ],
           3: [ // insight
               { sel: '3',  dx: -160, dy: 30 },
           ],
           4: [ // action
               { sel: '4',  dx: 80,   dy: -120 },
           ],
           5: [ // delight — A right-below, B left-above
               { sel: '5',  dx: 180,  dy: 80 },
               { sel: '5b', dx: -180, dy: -80 },
           ],
       };

       keywords.forEach(kw => {
           const idx = parseInt(kw.dataset.img);
           const entries = imageMap[idx];
           if (!entries) return;

           // Resolve image elements once
           const imgs = entries.map(e => ({
               el: document.querySelector('.hero-pop-img[data-index="' + e.sel + '"]'),
               dx: e.dx,
               dy: e.dy,
           })).filter(e => e.el);

           if (!imgs.length) return;

           kw.addEventListener('mouseenter', () => {
               const kwRect = kw.getBoundingClientRect();
               const heroRect = heroContainer.getBoundingClientRect();

               imgs.forEach(({ el, dx, dy }) => {
                   const imgW = el.offsetWidth || 240;
                   let x = kwRect.left - heroRect.left + kwRect.width / 2 + (dx * vwScale);
                   let y = kwRect.top - heroRect.top + kwRect.height / 2 + (dy * vwScale);

                   // Clamp within container bounds
                   x = Math.max(0, Math.min(x, heroRect.width - imgW));
                   y = Math.max(0, y);

                   el.style.left = x + 'px';
                   el.style.top = y + 'px';
                   el.classList.add('visible');
               });
           });

           kw.addEventListener('mouseleave', () => {
               imgs.forEach(({ el }) => el.classList.remove('visible'));
           });
       });
   })();

   /**
    * Calculate and cache target width
    */
   function updateTargetWidth() {
       const container = document.querySelector('.container');
       
       if (!container) {
           console.warn('Container not found');
           return;
       }
   
       const containerStyle = window.getComputedStyle(container);
       const paddingX = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
       targetWidth = container.getBoundingClientRect().width - paddingX;
   }
   
   /**
    * Main scroll animation function
    */
   function updateOnScroll() {
       const imageBoxes = document.querySelectorAll('.js-anim-target');
       const windowHeight = window.innerHeight;
       const windowWidth = window.innerWidth;
   
       // Skip scroll animation on mobile
       if (windowWidth <= 768) {
           ticking = false;
           return;
       }
   
       if (!imageBoxes.length) {
           ticking = false;
           return;
       }
   
       // Ensure targetWidth is calculated
       if (!targetWidth) {
           updateTargetWidth();
       }
   
       imageBoxes.forEach(box => {
           const rect = box.getBoundingClientRect();
           const media = box.querySelector('img, video');
           
           const startY = windowHeight;
           const endY = windowHeight * 0.25; 
           const currentY = rect.top;
   
           // Calculate progress (0 to 1)
           let progress;
           if (currentY >= startY) {
               progress = 0;
           } else if (currentY <= endY) {
               progress = 1;
           } else {
               progress = (startY - currentY) / (startY - endY);
           }
   
           // Calculate width with smooth interpolation
           const calculatedWidth = windowWidth + (targetWidth - windowWidth) * progress;
           box.style.width = `${calculatedWidth}px`;
   
           // Calculate and apply scale to media element
           if (media) {
               const calculatedScale = 1.1 - (0.1 * progress);
               media.style.transform = `scale(${calculatedScale})`;
           }
       });
   
       ticking = false;
   }
   
   /**
    * Request scroll animation update
    */
   function requestScrollUpdate() {
       if (!ticking) {
           window.requestAnimationFrame(updateOnScroll);
           ticking = true;
       }
   }
   
   /**
    * Handle window resize with RAF debouncing
    */
   function handleResize() {
       if (!resizeTicking) {
           window.requestAnimationFrame(() => {
               updateTargetWidth();
               resizeCanvas(); 
               updateOnScroll(); // Recalculate positions after resize
               resizeTicking = false;
           });
           resizeTicking = true;
       }
   }
   
   /**
    * Handle scroll-to-top button visibility
    */
   function updateScrollTopButton() {
       const scrollTopBtn = document.querySelector('.scroll-top');
       
       if (!scrollTopBtn) return;
       
       // Calculate halfway point of total page height
       const pageHeight = document.documentElement.scrollHeight;
       const viewportHeight = window.innerHeight;
       const scrollableHeight = pageHeight - viewportHeight;
       const halfwayPoint = scrollableHeight / 2;
       
       // Get current scroll position
       const scrolled = window.pageYOffset || document.documentElement.scrollTop;
       
       // Show button when scrolled past halfway
       if (scrolled > halfwayPoint) {
           scrollTopBtn.classList.add('visible');
       } else {
           scrollTopBtn.classList.remove('visible');
       }
   }
   
   /**
    * Initialize all animations
    */
   function init() {
       // Calculate initial target width
       initSky();  
       updateTargetWidth();
       
       // Initial scroll update
       updateOnScroll();
       
       // Initial scroll-top button check
       updateScrollTopButton();
       
       // Add event listeners with passive flag for better scroll performance
       window.addEventListener('scroll', () => {
           requestScrollUpdate();
           updateScrollTopButton();
       }, { passive: true });
       
       window.addEventListener('resize', handleResize, { passive: true });
   }
   
   // Start when DOM is ready
   if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', init);
   } else {
       init();
   }
   
   // Also run on window load to ensure everything is ready
   window.addEventListener('load', () => {
       updateTargetWidth();
       updateOnScroll();
   });
   
   
   // Disable right-click
   document.addEventListener('contextmenu', function(e) {
       e.preventDefault();
       return false;
   });
   
   // Disable key shortcuts
   document.addEventListener('keydown', function(e) {
       // F12 - DevTools
       if (e.keyCode === 123) {
           e.preventDefault();
           return false;
       }
       
       // Ctrl+S - Save
       if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
           e.preventDefault();
           return false;
       }
       
       // Ctrl+U - View Source
       if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
           e.preventDefault();
           return false;
       }
       
       // Ctrl+Shift+I - DevTools
       if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) {
           e.preventDefault();
           return false;
       }
       
       // Ctrl+Shift+C - Inspect Element
       if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) {
           e.preventDefault();
           return false;
       }
   });
   
   // Disable drag and drop
   document.addEventListener('dragstart', function(e) {
       e.preventDefault();
       return false;
   });

   /* --- CUSTOM CURSOR --- */
   (function initCustomCursor() {
       // Skip on mobile / touch devices
       if (window.innerWidth <= 768 || 'ontouchstart' in window) return;

       const dot = document.getElementById('cursor-dot');
       const trail = document.getElementById('cursor-dot-trail');
       if (!dot || !trail) return;

       let mouseX = 0, mouseY = 0;
       let trailX = 0, trailY = 0;
       let dotVisible = false;
       let rafId = null;

       // Clickable selectors for hover enlargement
       const hoverSelectors = 'a, button, input, .scroll-top, .hero-menu a, .nav-links a, .nav-logo, .text-col-main h2 a, .meta-list a, #pw-submit, #pw-input, .hero-keyword';

       document.addEventListener('mousemove', (e) => {
           mouseX = e.clientX;
           mouseY = e.clientY;

           // Show cursor on first move
           if (!dotVisible) {
               dotVisible = true;
               dot.classList.add('visible');
               trail.classList.add('visible');
               document.body.classList.add('custom-cursor');
               startAnimation();
           }

           // Position main dot immediately (no lag)
           dot.style.left = mouseX + 'px';
           dot.style.top = mouseY + 'px';
       });

       // Trail follows with smooth lerp
       function startAnimation() {
           function animate() {
               // Lerp trail toward mouse position
               trailX += (mouseX - trailX) * 0.06;
               trailY += (mouseY - trailY) * 0.06;

               trail.style.left = trailX + 'px';
               trail.style.top = trailY + 'px';

               rafId = requestAnimationFrame(animate);
           }
           animate();
       }

       // Hover detection for clickable elements
       document.addEventListener('mouseover', (e) => {
           if (e.target.closest(hoverSelectors)) {
               dot.classList.add('hover');
           }
       });

       document.addEventListener('mouseout', (e) => {
           if (e.target.closest(hoverSelectors)) {
               dot.classList.remove('hover');
           }
       });

       // Hide cursor when mouse leaves the window
       document.addEventListener('mouseleave', () => {
           dot.classList.remove('visible');
           trail.classList.remove('visible');
           dotVisible = false;
       });

       document.addEventListener('mouseenter', () => {
           dot.classList.add('visible');
           trail.classList.add('visible');
           dotVisible = true;
           startAnimation();
       });
   })();