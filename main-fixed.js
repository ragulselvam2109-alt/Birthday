// Birthday Website Advanced Features Manager
const BirthdayManager = {
    config: {
        siteName: 'Happy Birthday Hariharan',
        theme: localStorage.getItem('birthdayTheme') || 'dark',
        autoSaveInterval: 5000,
        performanceTracking: true
    },

    // Advanced State Management
    state: {
        userInteractions: 0,
        visitStartTime: Date.now(),
        lastActivityTime: Date.now(),
        isPageVisible: true,
        sessionData: {}
    },

    // Initialize Advanced Features
    init() {
        this.setupPerformanceMonitoring();
        this.setupVisibilityTracking();
        this.setupServiceWorker();
        this.setupAdvancedScrollDetection();
        this.restoreUserState();
    },

    // Advanced Performance Monitoring
    setupPerformanceMonitoring() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`✨ Page Load Time: ${pageLoadTime}ms`);

                    if (this.config.performanceTracking) {
                        console.log('Performance Metrics:');
                        console.log(`- DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`);
                        console.log(`- Resources Loaded: ${perfData.loadEventEnd - perfData.domContentLoadedEventEnd}ms`);
                    }
                }, 0);
            });
        }
    },

    // Advanced Visibility Tracking
    setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            this.state.isPageVisible = !document.hidden;
            if (!document.hidden) {
                this.state.lastActivityTime = Date.now();
                this.logActivity('Page Visible');
            } else {
                this.logActivity('Page Hidden');
            }
        });
    },

    // Service Worker Registration (for PWA support)
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.log('ServiceWorker not available:', err);
            });
        }
    },

    // Advanced Scroll Detection with Parallax
    setupAdvancedScrollDetection() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    const parallaxElements = document.querySelectorAll('.parallax-element');

                    parallaxElements.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        const speed = el.dataset.speed || 0.5;
                        el.style.transform = `translateY(${scrollY * speed}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    // Save User State
    saveUserState() {
        const userState = {
            theme: document.documentElement.style.colorScheme,
            wishes: localStorage.getItem('birthdayWishes'),
            lastVisit: Date.now(),
            visitCount: (parseInt(localStorage.getItem('visitCount')) || 0) + 1
        };
        localStorage.setItem('userState', JSON.stringify(userState));
    },

    // Restore User State
    restoreUserState() {
        try {
            const userState = JSON.parse(localStorage.getItem('userState') || '{}');
            if (userState.theme) {
                document.documentElement.style.colorScheme = userState.theme;
            }
            this.logActivity(`Visit #${userState.visitCount || 1}`);
        } catch (e) {
            console.warn('Could not restore user state:', e);
        }
    },

    // Advanced Activity Logging
    logActivity(activity) {
        this.state.userInteractions++;
        this.state.lastActivityTime = Date.now();
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] Activity: ${activity}`);
    },

    // Get Session Duration
    getSessionDuration() {
        return ((Date.now() - this.state.visitStartTime) / 1000).toFixed(2);
    }
};

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Advanced Features
    BirthdayManager.init();

    // ===== MOBILE RESPONSIVE ENHANCEMENTS =====

    // Detect Device Type
    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.innerWidth <= 768);
    };

    const isTablet = () => {
        return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 481;
    };

    // Store device info
    window.deviceInfo = {
        isMobile: isMobileDevice(),
        isTablet: isTablet(),
        isTouch: () => {
            return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
        },
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        dpi: window.devicePixelRatio || 1
    };

    // Handle Orientation Change
    window.addEventListener('orientationchange', () => {
        window.deviceInfo.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        console.log('📱 Orientation changed to:', window.deviceInfo.orientation);

        // Adjust viewport on orientation change
        const viewport = document.querySelector('meta[name=\"viewport\"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
        }
    });

    // Touch Event Handling
    if (window.deviceInfo.isTouch()) {
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            BirthdayManager.state.userInteractions++;
            console.log('📱 Touch detected - Interaction count:', BirthdayManager.state.userInteractions);
        }, { passive: true });

        // Add active state feedback on touch
        document.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('glass-btn') || e.target.classList.contains('floating-btn')) {
                e.target.style.transform = 'scale(0.95)';
            }
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (e.target.classList.contains('glass-btn') || e.target.classList.contains('floating-btn')) {
                e.target.style.transform = '';
            }
        }, { passive: true });
    }

    // Mobile Viewport Height Fix (prevents address bar layout shifts)
    const handleViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    handleViewportHeight();
    window.addEventListener('resize', handleViewportHeight);

    // Safe Area Support for Notches
    if (CSS.supports('padding-top', 'env(safe-area-inset-top)')) {
        document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
        console.log('✨ Safe area (notch) support enabled');
    }

    // Disable Cursor Glow on Touch Devices
    if (window.deviceInfo.isTouch()) {
        const cursorGlow = document.querySelector('.cursor-glow');
        if (cursorGlow) {
            cursorGlow.style.display = 'none';
        }
    }

    // Mobile Optimized Font Loading
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            console.log('✨ Fonts loaded optimally');
        });
    }

    // Prevent Zoom on Double Tap (but allow user zoom)
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });

    // Optimize 3D Canvas for Mobile
    try {
        const canvas = document.getElementById('bg-canvas');
        if (canvas && window.deviceInfo.isMobile) {
            // Reduce particle count on mobile for better performance
            window.mobileOptimization = {
                particleCount: 800,
                renderScale: 0.75
            };
            console.log('📱 Mobile optimization: Particle count reduced to 800');
        }
    } catch (e) {
        console.warn('Canvas optimization error:', e);
    }

    // Request Persistent Storage on Mobile
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then((persistent) => {
            console.log('💾 Persistent storage:', persistent ? 'enabled' : 'not available');
        });
    }

    // Mobile-specific Console Info
    if (window.deviceInfo.isMobile) {
        console.log('%c📱 MOBILE OPTIMIZED VERSION LOADED', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
        console.log('Device Info:', JSON.stringify(window.deviceInfo, null, 2));
    }

    // --- Ensure Loader Disappears (Safety Net) ---
    try {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    if (loader && loader.parentNode) {
                        loader.remove();
                    }
                }, 1000);
            }

            // Start animations
            if (window.gsap) {
                try {
                    gsap.from(".hero .glass-panel", { y: 50, opacity: 0, duration: 1.5, ease: "power3.out" });
                } catch (e) {
                    console.warn('GSAP hero animation error:', e);
                }
            }
        }, 2000);
    } catch (e) {
        console.warn('Loader error:', e);
    }

    // --- Custom Cursor ---
    try {
        const cursor = document.querySelector('.cursor-glow');
        if (cursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        }
    } catch (e) {
        console.warn('Cursor error:', e);
    }

    // --- Theme Toggle (Dark/Light Mode) ---
    try {
        const themeToggle = document.getElementById('themeToggle');
        let isDarkMode = true;

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                isDarkMode = !isDarkMode;
                document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
                themeToggle.innerHTML = isDarkMode ? '🌙' : '☀️';

                // Animated theme change
                if (window.gsap) {
                    try {
                        gsap.to('body', {
                            duration: 0.5,
                            backgroundColor: isDarkMode ? '#0f1016' : '#f8fafc',
                            color: isDarkMode ? '#f8fafc' : '#0f1016'
                        });
                    } catch (e) {
                        console.warn('Theme GSAP error:', e);
                    }
                }
            });
        }
    } catch (e) {
        console.warn('Theme toggle error:', e);
    }

    // --- Background Music (with error handling) ---
    try {
        const musicBtn = document.getElementById('musicToggle');
        const bgMusic = document.getElementById('bgMusic');
        let isPlaying = false;

        if (musicBtn && bgMusic) {
            musicBtn.addEventListener('click', () => {
                try {
                    if (isPlaying) {
                        bgMusic.pause();
                        musicBtn.innerHTML = '🎵';
                        isPlaying = false;
                    } else {
                        const playPromise = bgMusic.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(err => {
                                console.log('Music play failed:', err);
                                musicBtn.innerHTML = '📍';
                            });
                        }
                        musicBtn.innerHTML = '🔊';
                        isPlaying = true;
                    }
                } catch (e) {
                    console.warn('Music control error:', e);
                }
            });
        }
    } catch (e) {
        console.warn('Music setup error:', e);
    }

    // --- Quotes Slider ---
    try {
        const quotes = [
            "Happy birthday to a true legend!",
            "May your day be as awesome as you are.",
            "Age is just a number, but yours is getting high!",
            "Here's to another year of great adventures.",
            "Wishing you all the happiness in the universe.",
            "Keep shining brightly, Hariharan!",
            "Have a spectacular and wonderful birthday.",
            "You deserve all the happiness in the world today!",
            "Another year older, still absolutely amazing!",
            "To the most wonderful person - Happy Birthday!"
        ];
        let quoteIndex = 0;
        const quoteText = document.getElementById('quoteText');

        if (quoteText && window.gsap) {
            setInterval(() => {
                try {
                    gsap.to(quoteText, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            quoteIndex = (quoteIndex + 1) % quotes.length;
                            quoteText.innerText = `"${quotes[quoteIndex]}"`;
                            gsap.to(quoteText, { opacity: 1, duration: 0.5 });
                        }
                    });
                } catch (e) {
                    console.warn('Quote animation error:', e);
                }
            }, 4000);
        }
    } catch (e) {
        console.warn('Quotes slider error:', e);
    }

    // --- Typewriter Effect ---
    try {
        const message = "Dear Hariharan,\n\nMay this special day bring you endless joy, peace, and success. You truly deserve the very best in life. Here's to making amazing memories this year!\n\nWith all our love,\nFrom Your Well-Wishers 💜";
        const typewriterEl = document.getElementById('typewriterText');

        if (typewriterEl) {
            let typeIdx = 0;

            const msgSection = document.getElementById('message');
            if (msgSection) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting && typeIdx === 0) {
                        typeText();
                    }
                }, { threshold: 0.5 });

                observer.observe(msgSection);
            }

            function typeText() {
                if (typeIdx < message.length) {
                    typewriterEl.innerHTML += message.charAt(typeIdx) === '\n' ? '<br>' : message.charAt(typeIdx);
                    typeIdx++;
                    setTimeout(typeText, 40);
                }
            }
        }
    } catch (e) {
        console.warn('Typewriter error:', e);
    }

    // --- Interactive Cake & Confetti ---
    try {
        const cakeContainer = document.getElementById('cakeContainer');
        const surpriseBtn = document.getElementById('surpriseBtn');
        let cakeClicked = false;

        if (cakeContainer) {
            cakeContainer.addEventListener('click', () => {
                if (!cakeClicked) {
                    cakeClicked = true;
                    const candles = cakeContainer.querySelectorAll('.candle');

                    if (window.gsap && candles.length > 0) {
                        try {
                            candles.forEach(candle => {
                                gsap.to(candle, { opacity: 0, duration: 0.5 });
                            });
                        } catch (e) {
                            console.warn('Candle animation error:', e);
                        }
                    }

                    cakeContainer.innerHTML = '🍰<p class="mt-2 text-sm">✨ Wishes made! ✨</p>';
                    if (window.confetti) fireConfetti(0.5, 0.4);

                    setTimeout(() => {
                        if (window.confetti) {
                            fireConfetti(0.2, 0.3);
                            fireConfetti(0.8, 0.3);
                        }
                    }, 300);
                }
            });
        }

        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', () => {
                try {
                    const modal = document.getElementById('modal');
                    if (modal) {
                        modal.style.display = 'block';
                    }

                    if (window.confetti) {
                        fireConfetti(0.2, 0.8);
                        fireConfetti(0.8, 0.8);
                        fireConfetti(0.5, 0.2);

                        setTimeout(() => {
                            fireConfetti(0.3, 0.5);
                            fireConfetti(0.7, 0.5);
                        }, 200);
                    }
                } catch (e) {
                    console.warn('Surprise button error:', e);
                }
            });
        }

        function fireConfetti(x, y) {
            if (window.confetti) {
                try {
                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { x, y },
                        gravity: 0.8
                    });
                } catch (e) {
                    console.warn('Confetti error:', e);
                }
            }
        }
    } catch (e) {
        console.warn('Cake interaction error:', e);
    }

    // --- Guest Book Functionality ---
    try {
        const wishForm = document.getElementById('wishForm');
        const wishesDisplay = document.getElementById('wishesDisplay');

        if (wishForm && wishesDisplay) {
            function loadWishes() {
                try {
                    const wishes = JSON.parse(localStorage.getItem('birthdayWishes') || '[]');
                    wishesDisplay.innerHTML = '';
                    wishes.forEach(wish => {
                        displayWish(wish.name, wish.text);
                    });
                } catch (e) {
                    console.warn('Load wishes error:', e);
                }
            }

            function displayWish(name, text) {
                try {
                    const wishCard = document.createElement('div');
                    wishCard.className = 'wish-card glass-card';
                    wishCard.innerHTML = `
                        <h4>✨ ${name}</h4>
                        <p>"${text}"</p>
                    `;
                    wishesDisplay.appendChild(wishCard);
                } catch (e) {
                    console.warn('Display wish error:', e);
                }
            }

            wishForm.addEventListener('submit', (e) => {
                try {
                    e.preventDefault();
                    const nameInput = document.getElementById('wishName');
                    const textInput = document.getElementById('wishText');

                    if (nameInput && textInput) {
                        const name = nameInput.value;
                        const text = textInput.value;

                        const wishes = JSON.parse(localStorage.getItem('birthdayWishes') || '[]');
                        wishes.push({ name, text });
                        localStorage.setItem('birthdayWishes', JSON.stringify(wishes));

                        displayWish(name, text);
                        wishForm.reset();

                        if (window.gsap) {
                            try {
                                gsap.fromTo(wishForm, { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
                            } catch (e) {
                                console.warn('Form animation error:', e);
                            }
                        }
                    }
                } catch (e) {
                    console.warn('Wish form submit error:', e);
                }
            });

            loadWishes();
        }
    } catch (e) {
        console.warn('Guest book error:', e);
    }

    // --- Social Share Buttons ---
    try {
        const shareLink = document.getElementById('shareLink');
        if (shareLink) {
            shareLink.addEventListener('click', () => {
                try {
                    const url = window.location.href;
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(url).then(() => {
                            alert('✨ Birthday link copied to clipboard! Share it with your friends! 🎉');
                        }).catch(() => {
                            alert('Birthday link: ' + url);
                        });
                    } else {
                        alert('Birthday link: ' + url);
                    }
                } catch (e) {
                    console.warn('Share error:', e);
                }
            });
        }
    } catch (e) {
        console.warn('Share button error:', e);
    }

    // --- Modal Close ---
    try {
        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.close');

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    } catch (e) {
        console.warn('Modal error:', e);
    }

    // --- Scroll Animations with GSAP ScrollTrigger ---
    try {
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);

            const galleryItems = document.querySelectorAll('.gallery-item');
            if (galleryItems.length > 0) {
                try {
                    gsap.to('.gallery-item', {
                        scrollTrigger: {
                            trigger: '#gallery',
                            start: 'top 80%',
                            end: 'top 20%',
                            scrub: 1
                        },
                        opacity: 1,
                        y: 0,
                        stagger: 0.2
                    });
                } catch (e) {
                    console.warn('Gallery scroll animation error:', e);
                }
            }

            const timelineItems = document.querySelectorAll('.timeline-item');
            if (timelineItems.length > 0) {
                try {
                    gsap.from('.timeline-item', {
                        scrollTrigger: {
                            trigger: '#timeline',
                            start: 'top center',
                            end: 'center center',
                            scrub: 1
                        },
                        opacity: 0,
                        x: (i) => i % 2 === 0 ? -100 : 100,
                        stagger: 0.3
                    });
                } catch (e) {
                    console.warn('Timeline scroll animation error:', e);
                }
            }
        }
    } catch (e) {
        console.warn('Scroll animations error:', e);
    }

    // --- Three.js Background (Stars/Particles) ---
    try {
        if (window.THREE) {
            const canvas = document.getElementById('bg-canvas');
            if (canvas) {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(window.devicePixelRatio);

                const particlesGeometry = new THREE.BufferGeometry();
                const particlesCount = 1500;
                const posArray = new Float32Array(particlesCount * 3);

                for (let i = 0; i < particlesCount * 3; i++) {
                    posArray[i] = (Math.random() - 0.5) * 50;
                }

                particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

                const material = new THREE.PointsMaterial({
                    size: 0.05,
                    color: 0x8b5cf6,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending
                });

                const particlesMesh = new THREE.Points(particlesGeometry, material);
                scene.add(particlesMesh);

                camera.position.z = 5;

                let mouseX = 0;
                let mouseY = 0;
                document.addEventListener('mousemove', (event) => {
                    mouseX = (event.clientX / window.innerWidth) - 0.5;
                    mouseY = (event.clientY / window.innerHeight) - 0.5;
                });

                const animate = () => {
                    try {
                        requestAnimationFrame(animate);
                        particlesMesh.rotation.y += 0.001;
                        particlesMesh.rotation.x += 0.0005;

                        particlesMesh.rotation.y += mouseX * 0.01;
                        particlesMesh.rotation.x += mouseY * 0.01;

                        renderer.render(scene, camera);
                    } catch (e) {
                        console.warn('Animation loop error:', e);
                    }
                };
                animate();

                window.addEventListener('resize', () => {
                    try {
                        camera.aspect = window.innerWidth / window.innerHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(window.innerWidth, window.innerHeight);
                    } catch (e) {
                        console.warn('Resize error:', e);
                    }
                });
            }
        }
    } catch (e) {
        console.warn('Three.js background error:', e);
    }

    // --- Smooth Scroll ---
    try {
        if (window.gsap) {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    try {
                        e.preventDefault();
                        const target = document.querySelector(this.getAttribute('href'));
                        if (target) {
                            gsap.to(window, {
                                duration: 1,
                                scrollTo: target,
                                ease: "power3.inOut"
                            });
                        }
                    } catch (e) {
                        console.warn('Smooth scroll error:', e);
                    }
                });
            });
        }
    } catch (e) {
        console.warn('Smooth scroll setup error:', e);
    }

    console.log('✨ Birthday website loaded successfully!');

    // === ADVANCED FEATURES ===

    // Advanced Voice Recognition Support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        window.voiceSupported = true;
        console.log('✨ Voice Recognition Supported!');
    }

    // Advanced Analytics Event Tracking
    window.addEventListener('beforeunload', () => {
        BirthdayManager.saveUserState();
        const sessionTime = BirthdayManager.getSessionDuration();
        console.log(`Session Duration: ${sessionTime}s | Interactions: ${BirthdayManager.state.userInteractions}`);
    });

    // Advanced Network Status Detection
    if (navigator.onLine !== undefined) {
        window.addEventListener('online', () => {
            console.log('✨ Connection Restored');
        });
        window.addEventListener('offline', () => {
            console.log('⚠️ Connection Lost');
        });
    }

    // Advanced Memory and Performance Monitoring
    if (performance && performance.memory) {
        setInterval(() => {
            const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            const limit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
            // console.log(`Memory Usage: ${used}MB / ${limit}MB`);
        }, 5000);
    }

    // Advanced Data Export Feature
    window.exportSessionData = function() {
        const data = {
            session: BirthdayManager.state,
            wishes: JSON.parse(localStorage.getItem('birthdayWishes') || '[]'),
            pageData: {
                title: document.title,
                url: window.location.href,
                timestamp: new Date().toISOString()
            }
        };
        return JSON.stringify(data, null, 2);
    };

    // Advanced Accessibility Enhancements
    document.addEventListener('keydown', (e) => {
        // Alt+S for surprise button
        if (e.altKey && e.code === 'KeyS') {
            const surpriseBtn = document.getElementById('surpriseBtn');
            if (surpriseBtn) surpriseBtn.click();
        }
        // Alt+W for wish form focus
        if (e.altKey && e.code === 'KeyW') {
            const wishName = document.getElementById('wishName');
            if (wishName) wishName.focus();
        }
    });

    // Advanced Animations Performance Optimization
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        document.body.style.animationDuration = '0.01ms !important';
        console.log('Reduced Motion Detected - Optimized');
    }

    // Advanced Page Visibility API Integration
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('✨ Welcome back!');
        }
    });

    console.log(`%c🎉 Birthday Celebration Website Active 🎉`, 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
    console.log('%cSession Info:', 'color: #3b82f6; font-weight: bold;');
    console.log(`- Duration: ${BirthdayManager.getSessionDuration()}s`);
    console.log(`- Interactions: ${BirthdayManager.state.userInteractions}`);
    console.log(`- Memory: ${(performance.memory?.usedJSHeapSize / 1048576).toFixed(2)}MB`);
});