/* ================================================================
   PORTFOLIO HOMEPAGE - JAVASCRIPT

   FEATURES:
   0. Password Protection
   1. Scroll Animation (image zoom effect)
   2. Window Resize Handling
   3. Performance Optimizations
   ================================================================ */

   /* --- PASSWORD PROTECTION --- */
   (function initPasswordGate() {
       const PASSWORD = 'ydinfo02';
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
           if (input.value === PASSWORD) {
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