(function () {
  'use strict';

  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const fadeElements = document.querySelectorAll('.fade-in');
  const yearSpan = document.getElementById('year');
  const heroName = document.querySelector('.hero-name');
  const cards = document.querySelectorAll('.experience-card, .project-card, .education-primary');
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselPrev = document.querySelector('.carousel-btn.prev');
  const carouselNext = document.querySelector('.carousel-btn.next');

  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  cursorGlow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    opacity: 0;
  `;
  document.body.appendChild(cursorGlow);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.5s ease, transform 0.1s linear';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      card.style.transform = `
        perspective(1000px)
        rotateX(${-y / 20}deg)
        rotateY(${x / 20}deg)
        translateY(-5px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'all 0.5s ease';
      card.style.transform = '';
    });
  });

  class TextScramble {
    constructor(el, accentColor = 'var(--neon-cyan)') {
      this.el = el;
      this.accentColor = accentColor;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise(resolve => this.resolve = resolve);
      this.queue = [];
      
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    
    update() {
      let output = '';
      let complete = 0;
      
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span style="color: ${this.accentColor}">${char}</span>`;
        } else {
          output += from;
        }
      }
      
      this.el.innerHTML = output;
      
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  if (heroName) {
    const originalText = heroName.innerText;
    heroName.innerText = ''; 
    const fx = new TextScramble(heroName);
    setTimeout(() => fx.setText(originalText), 200);
  }

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.innerText;
    heroTitle.innerText = '';
    const fx = new TextScramble(heroTitle, 'var(--text-secondary)');
    setTimeout(() => fx.setText(originalText), 200);
  }

  const heroTagline = document.querySelector('.hero-tagline');
  if (heroTagline) {
    const originalText = heroTagline.innerText;
    heroTagline.innerText = '';
    const fx = new TextScramble(heroTagline, 'var(--text-muted)');
    setTimeout(() => fx.setText(originalText), 200);
  }

  const heroSection = document.getElementById('hero');
  
  function parallaxEffect() {
    if (heroSection) {
      const scrolled = window.pageYOffset;
      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 2.5;
      }
    }
  }

  function setupInfiniteCarousel() {
    if (!carouselTrack) return;
    
    const originalCards = Array.from(carouselTrack.children);
    if (originalCards.length === 0) return;

    const cloneCount = 3; 
    
    const clonesStart = originalCards.slice(-cloneCount).map(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('clone');
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });

    const clonesEnd = originalCards.slice(0, cloneCount).map(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('clone');
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });

    clonesStart.forEach(clone => carouselTrack.insertBefore(clone, carouselTrack.firstChild));
    clonesEnd.forEach(clone => carouselTrack.appendChild(clone));

    const getCardWidth = () => {
      const card = originalCards[0];
      const style = window.getComputedStyle(carouselTrack);
      const gap = parseFloat(style.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    setTimeout(() => {
      const cardWidth = getCardWidth();
      carouselTrack.scrollLeft = cardWidth * cloneCount;
    }, 50);

    let isScrollingTimer;

    carouselTrack.addEventListener('scroll', () => {
      clearTimeout(isScrollingTimer);

      isScrollingTimer = setTimeout(() => {
        const cardWidth = getCardWidth();
        const totalOriginalWidth = cardWidth * originalCards.length;
        const currentScroll = carouselTrack.scrollLeft;
        
        const leftThreshold = (cloneCount - 0.5) * cardWidth; 
        const rightThreshold = (cloneCount + originalCards.length - 0.5) * cardWidth; 

        if (currentScroll < leftThreshold) {
          carouselTrack.scrollLeft = currentScroll + totalOriginalWidth;
        } else if (currentScroll > rightThreshold) {
           carouselTrack.scrollLeft = currentScroll - totalOriginalWidth;
        }
      }, 150);
    });

    const scrollAmount = () => getCardWidth();

    if (carouselPrev) {
      carouselPrev.onclick = () => {
        carouselTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      };
    }

    if (carouselNext) {
      carouselNext.onclick = () => {
        carouselTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      };
    }
  }

  if (carouselTrack) {
    if (!carouselTrack.querySelector('.clone')) {
      setupInfiniteCarousel();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight + 80;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  function updateHeaderState() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const cleanupFade = (el) => {
    setTimeout(() => {
      el.classList.remove('fade-in', 'visible');
      el.style.transitionDelay = '';
      el.style.transform = '';
      el.style.opacity = '';
      el.style.transition = '';
    }, 1000);
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cleanupFade(entry.target);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        updateHeaderState();
        parallaxEffect();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  updateActiveNav();
  updateHeaderState();

  fadeElements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
  });

  const scrambleElements = document.querySelectorAll('.section-title, .section-label, .certifications-label');
  
  const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const originalText = el.dataset.originalText;
        
        el.style.opacity = '1';
        
        const isSectionTitle = el.classList.contains('section-title');
        const accentColor = isSectionTitle ? 'var(--text-primary)' : 'var(--neon-cyan)';

        const fx = new TextScramble(el, accentColor);
        fx.setText(originalText);
        
        scrambleObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  scrambleElements.forEach(el => {
    el.dataset.originalText = el.innerText.trim();
    if (el.dataset.originalText) {
      el.innerText = '';
      el.style.opacity = '1';
      scrambleObserver.observe(el);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    setTimeout(() => {
      const heroFades = document.querySelectorAll('#hero .fade-in');
      heroFades.forEach(el => {
        el.classList.add('visible');
        cleanupFade(el);
      });

      document.querySelectorAll('.fade-in:not(#hero .fade-in)').forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('visible');
          cleanupFade(el);
        }, i * 100);
      });
    }, 200);
  });

  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  (function initShootingStars() {
    const particleContainer = document.getElementById('particle-container');
    if (!particleContainer) return;

    const particlePool = [];
    const POOL_SIZE = 30;

    const cosmicColors = [
      '255, 255, 255',
      '168, 85, 247',
      '59, 130, 246',
      '34, 211, 238',
      '236, 72, 153'
    ];

    function getRandomCosmicColor() {
      return cosmicColors[Math.floor(Math.random() * cosmicColors.length)];
    }

    function getSpanFromPool() {
      if (particlePool.length > 0) return particlePool.pop();
      const span = document.createElement("span");
      span.classList.add("spanParticle");
      return span;
    }

    function returnSpanToPool(span) {
      if (particlePool.length < POOL_SIZE) {
        span.style.animation = 'none';
        span.style.opacity = '0';
        particlePool.push(span);
      } else {
        span.remove();
      }
    }

    function createSpan() {
      const span = getSpanFromPool();
      const color = getRandomCosmicColor();

      const minPosition = -Math.floor(Math.random() * 36) - 40;
      const maxHeight = Math.floor(Math.random() * 36) + 5;
      const randomTop = Math.min(
          maxHeight,
          Math.random() * (100 - minPosition) + minPosition
      );
      const randomRight = Math.random() * (100 - minPosition) + minPosition;

      span.style.top = `${randomTop}%`;
      span.style.right = `${randomRight}%`;

      span.style.backgroundColor = `rgb(${color})`;
      span.style.color = `rgb(${color})`; 
      
      span.style.boxShadow = `0 0 0 4px rgba(${color}, 0.1), 0 0 0 8px rgba(${color}, 0.1), 0 0 20px rgba(${color}, 1)`;

      const duration = Math.random() * 7 + 2; 
      span.style.animation = `animateParticle ${duration - 1}s linear`;

      if (!span.parentNode) {
        particleContainer.appendChild(span);
      }

      setTimeout(() => {
        if (span.parentNode) {
          span.parentNode.removeChild(span);
        }
        returnSpanToPool(span);
      }, duration * 1000);
    }

    setInterval(() => {
        createSpan();
    }, 150);

    createSpan();
  })();

})();
