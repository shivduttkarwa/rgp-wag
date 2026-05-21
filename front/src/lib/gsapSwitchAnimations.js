// @ts-nocheck
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

class GSAPAnimations {
  constructor(root) {
    this.root = root || document;
    // Default configuration - customize these values as needed
    this.defaults = {
      delay: 0,
      duration: 1.25,
      start: 'top 80%',
      ease: {
        fade: 'power2.out',
        zoom: 'power2.out',
        zoomIn: 'back.out(1.05)',
        slide: 'power2.out',
        clip: 'power3.out',
        chars: 'expo.out'
      }
    };

  }

  init() {
    if (typeof window === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.setupAnimations();
  }

  setupAnimations() {
    // Find all elements with data-gsap attribute
    const scope = this.root || document;
    const elements = scope.querySelectorAll('[data-gsap], [data-gsap-mobile]');
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 991px)').matches;

    elements.forEach(el => {
      // Check for mobile-specific animation override
      const mobileAnimation = el.getAttribute('data-gsap-mobile');
      const desktopAnimation = el.getAttribute('data-gsap');
      const animationType = (isMobile && mobileAnimation) ? mobileAnimation : desktopAnimation;

      // Get values from attributes or use defaults
      const staggerAttr = el.getAttribute('data-gsap-stagger');
      const config = {
        delay: parseFloat(el.getAttribute('data-gsap-delay')) || this.defaults.delay,
        duration: parseFloat(el.getAttribute('data-gsap-duration')) || this.defaults.duration,
        stagger: staggerAttr ? parseFloat(staggerAttr) : null, // Only use stagger if explicitly set
        start: el.getAttribute('data-gsap-start') || this.defaults.start,
        cardsStart: el.getAttribute('data-gsap-cards-start') || null,
        mobileCardsStart: el.getAttribute('data-gsap-mobile-cards-start') || null,
        ease: el.getAttribute('data-gsap-ease') || null
      };

      try {
        switch (animationType) {
          case 'fade-up':
            this.fadeUp(el, config);
            break;
          case 'fade-down':
            this.fadeDown(el, config);
            break;
          case 'fade-left':
            this.fadeLeft(el, config);
            break;
          case 'fade-right':
            this.fadeRight(el, config);
            break;
          case 'fade-in':
            this.fadeIn(el, config);
            break;
          case 'zoom-in':
            this.zoomIn(el, config);
            break;
          case 'zoom-out':
            this.zoomOut(el, config);
            break;
          case 'clip-reveal':
            this.clipReveal(el, config);
            break;
          case 'clip-reveal-center':
            this.clipRevealCenter(el, config);
            break;
          case 'clip-reveal-rtl':
            this.clipRevealRightToLeft(el, config);
            break;
          case 'clip-reveal-top':
            this.clipRevealTop(el, config);
            break;
          case 'clip-reveal-left':
            this.clipRevealLeft(el, config);
            break;
          case 'clip-reveal-right':
            this.clipRevealRight(el, config);
            break;
          case 'word-reveal':
            this.wordReveal(el, config);
            break;
          case 'writing-text':
            this.writingText(el, config);
            break;
          case 'chars':
            this.charsAnimation(el, config);
            break;
          case 'lines':
            this.linesAnimation(el, config);
            break;
          case 'slide-left':
            this.slideLeft(el, config);
            break;
          case 'slide-right':
            this.slideRight(el, config);
            break;
          case 'slide-up':
            this.slideUp(el, config);
            break;
          case 'slide-down':
            this.slideDown(el, config);
            break;
          case 'scale-up':
            this.scaleUp(el, config);
            break;
          case 'what-we-do-header':
            this.whatWeDoHeader(el, config);
            break;
          case 'what-we-do-cards':
            this.whatWeDoCards(el, config);
            break;
          case 'core-values':
            this.coreValues(el, config);
            break;
          case 'core-values-timeline':
            this.coreValuesTimeline(el, config);
            break;
          case 'hero-about':
            this.heroAbout(el, config);
            break;
          case 'hero-home':
            this.heroHome(el, config);
            break;
          case 'section-title':
            this.sectionTitle(el, config);
            break;
          case 'tilt-card':
            this.tiltCard(el, config);
            break;
          case 'hero-learning':
            this.heroLearning(el, config);
            break;
          case 'hero-preschool':
            this.heroPreschool(el, config);
            break;
          case 'hero-wellbeing':
            this.heroWellbeing(el, config);
            break;
          case 'masked-image-content':
            this.maskedImageContent(el, config);
            break;
          case 'three-campuses':
            this.threeCampuses(el, config);
            break;
          case 'news-card':
            this.newsCard(el, config);
            break;
          case 'news-cards-clip':
            this.newsCardsClip(el, config);
            break;
          case 'btn-clip-reveal':
            this.btnClipReveal(el, config);
            break;
          case 'btn-clip-bottom':
            this.btnClipBottom(el, config);
            break;
          case 'wellbeing-timeline':
            this.wellbeingTimeline(el, config);
            break;
          case 'three-stages-timeline':
            this.threeStagesTimeline(el, config);
            break;
          case 'stagger-content':
            this.staggerContent(el, config);
            break;
          case 'scroll-lines':
            this.scrollLines(el, config);
            break;
          case 'animate-hero':
            this.animateHero(el, config);
            break;
          case 'scroll-text-reveal':
            this.scrollTextReveal(el, config);
            break;
          case 'parallax-bg':
            this.parallaxBg(el, config);
            break;
          case 'word-write':
            this.wordWrite(el, config);
            break;
          case 'clip-smooth':
            this.clipSmooth(el, config);
            break;
          case 'clip-smooth-down':
            this.clipSmoothDown(el, config);
            break;
          case 'char-reveal':
            this.charReveal(el, config);
            break;
          default:
            console.warn(`Unknown animation type: ${animationType}`);
        }
      } catch (error) {
        console.error(`Error initializing animation "${animationType}" on element:`, el, error);
        // Continue with other animations even if one fails
      }
    });
  }

  // Helper to build ScrollTrigger config for one-time animations
  buildScrollTrigger(el, config) {
    return {
      trigger: el,
      start: config.start,
      toggleActions: 'play none none none'
    };
  }

  // Stagger content - animates all paragraphs within container on scroll
  staggerContent(el, config) {
    if (!el) return;

    // Find all paragraphs within the container (regardless of nesting)
    const paragraphs = el.querySelectorAll('p');
    if (!paragraphs.length) return;

    const stagger = config.stagger || 0.15;
    const duration = config.duration || 0.8;
    const delay = config.delay || 0;

    // Set initial state
    gsap.set(paragraphs, {
      opacity: 0,
      y: 30
    });

    // Animate on scroll
    gsap.to(paragraphs, {
      opacity: 1,
      y: 0,
      duration: duration,
      stagger: stagger,
      delay: delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: config.start || 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Scroll lines - each line reveals as you scroll through the section
  scrollLines(el, config) {
    if (!el) return;

    // Check if element itself is a paragraph, or find paragraphs within it
    const paragraphs = el.tagName === 'P' ? [el] : el.querySelectorAll('p');
    if (!paragraphs.length) return;

    // Collect all lines from all paragraphs
    const allLines = [];

    paragraphs.forEach(p => {
      const lines = this.splitLines(p);
      allLines.push(...lines);
    });

    if (!allLines.length) return;

    // Set initial state for all lines
    gsap.set(allLines, {
      opacity: 0,
      y: 25
    });

    // Create scroll-driven timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: config.start || 'top 80%',
        end: 'bottom 60%',
        scrub: 1,
        once: true // Play forward once, stay complete
      }
    });

    // Animate each line
    allLines.forEach((line, index) => {
      const start = index / allLines.length;
      const duration = 1 / allLines.length;

      tl.to(line, {
        opacity: 1,
        y: 0,
        duration: duration,
        ease: 'none'
      }, start);
    });
  }

  // Scroll text reveal - words fade in one by one as you scroll
  scrollTextReveal(el, config) {
    if (!el) return;

    // Split text into words
    const words = this.splitWords(el);
    if (!words.length) return;

    // Animate words from opacity 0 as element scrolls through viewport
    gsap.from(words, {
      opacity: 0,
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: {
        trigger: el,
        start: config.start || 'top 80%',
        end: 'bottom 20%',
        scrub: true
      }
    });
  }

  // Helper to split text into word spans
  splitWords(el) {
    if (!el) return [];

    // If already split, return existing words
    if (el.dataset.wordsSplit === 'true') {
      return Array.from(el.querySelectorAll('.scroll-word'));
    }

    // Get the raw text content
    const text = el.textContent;
    if (!text.trim()) return [];

    // Clear the element and rebuild with word spans
    el.innerHTML = '';

    const words = text.split(/(\s+)/);
    const wordElements = [];

    words.forEach(word => {
      if (word.trim()) {
        const span = document.createElement('span');
        span.className = 'scroll-word';
        span.textContent = word;
        el.appendChild(span);
        wordElements.push(span);
      } else if (word) {
        // Preserve whitespace
        el.appendChild(document.createTextNode(word));
      }
    });

    el.dataset.wordsSplit = 'true';
    return wordElements;
  }

  // Fade animations
  fadeUp(el, config) {
    // Check if stagger is defined and has children
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;


    gsap.set(target, { y: 50, autoAlpha: 0 });

    gsap.to(target,
      {
        y: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  fadeDown(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { y: -50, autoAlpha: 0 });

    gsap.to(target,
      {
        y: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  fadeLeft(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { x: -50, autoAlpha: 0 });

    gsap.to(target,
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  fadeRight(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { x: 50, autoAlpha: 0 });

    gsap.to(target,
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  fadeIn(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { autoAlpha: 0 });

    gsap.to(target,
      {
        autoAlpha: 1,
        duration: 2,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  // Zoom animations
  zoomIn(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { scale: 0.7, autoAlpha: 0 });

    gsap.to(target,
      {
        scale: 1,
        autoAlpha: 1,
        duration: 1.9,
        ease: config.ease || this.defaults.ease.zoomIn,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  zoomOut(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { scale: 1.3 });

    gsap.to(target,
      {
        scale: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.zoom,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  // Slide animations
  slideLeft(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { x: -300, autoAlpha: 0 });

    gsap.to(target,
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.slide,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  slideRight(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { x: 300, autoAlpha: 0 });

    gsap.to(target,
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.slide,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  slideUp(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { y: 100, autoAlpha: 0 });

    gsap.to(target,
      {
        y: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.slide,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  slideDown(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { y: -100, autoAlpha: 0 });

    gsap.to(target,
      {
        y: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.slide,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  // Scale animation
  scaleUp(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { scale: 0, transformOrigin: 'center center' });

    gsap.to(target,
      {
        scale: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.zoom,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  // Clip reveal animation
  clipReveal(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    if (children && config.stagger) {
      children.forEach(child => child.classList.add('card-clip-reveal'));
    } else {
      el.classList.add('card-clip-reveal');
    }

    gsap.set(target, { '--clip-value': '100%' });

    gsap.to(target,
      {
        '--clip-value': '0%',
        duration: config.duration,
        ease: config.ease || this.defaults.ease.clip,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config),
        onComplete: () => {
          if (children && config.stagger) {
            children.forEach(child => child.classList.add('clip-animation-complete'));
          } else {
            el.classList.add('clip-animation-complete');
          }
        }
      }
    );
  }

  // Clip reveal animation from center to both sides
  clipRevealCenter(el, config) {
    if (!el) return;

    const targets = el.querySelectorAll(`
.three-campuses-section__card-image-wrapper img,
.three-campuses-section .masked-image-content-block-wrap .image-wrap img
`);

    const isImageElement = el.tagName === 'IMG';
    const fallbackImages = !isImageElement ? el.querySelectorAll('img') : [];
    const elements = targets.length
      ? Array.from(targets)
      : fallbackImages.length
        ? Array.from(fallbackImages)
        : [el];

    const hasStartAttr = el.hasAttribute('data-gsap-start');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const start = hasStartAttr ? config.start : 'top 55%';
    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 0.9;
    const ease = hasEaseAttr ? config.ease : 'none';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;

    elements.forEach((img) => {
      if (img.dataset.clipRevealInit === 'true') return;
      img.dataset.clipRevealInit = 'true';

      const triggerElement =
        img.closest('.three-campuses-section__card') ||
        img.closest('.col-lg-4') ||
        el ||
        img;
      gsap.set(img, { willChange: 'transform, clip-path' });

      gsap.fromTo(img,
        {
          clipPath: 'inset(50% 0 50% 0)',
          y: 30,
          opacity: 1
        },
        {
          clipPath: 'inset(0% 0 0% 0)',
          y: 0,
          opacity: 1,
          duration,
          ease,
          delay,
          scrollTrigger: {
            trigger: triggerElement,
            start,
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    });
  }

  // Clip reveal animation from right to left
  clipRevealRightToLeft(el, config) {
    if (!el) return;

    const targetMode = el.getAttribute('data-gsap-target');
    const isImageElement = el.tagName === 'IMG';
    const fallbackImages = !isImageElement ? el.querySelectorAll('img') : [];
    const maskTarget = el.querySelector('.essence-image-mask');
    const elements = targetMode === 'self'
      ? [maskTarget || el]
      : targetMode === 'img'
        ? Array.from(fallbackImages)
        : fallbackImages.length
          ? Array.from(fallbackImages)
          : [el];

    if (!elements.length) return;

    const hasStartAttr = el.hasAttribute('data-gsap-start');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const start = hasStartAttr ? config.start : 'top 65%';
    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 1.1;
    const ease = hasEaseAttr ? config.ease : 'power3.out';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;

    elements.forEach((img) => {
      if (img.dataset.clipRevealRtlInit === 'true') return;
      img.dataset.clipRevealRtlInit = 'true';

      const triggerElement = el;
      gsap.set(img, {
        willChange: 'width',
        opacity: 1,
        width: 0,
        display: 'block',
        overflow: 'hidden',
      });

      const prefersReducedMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

      if (prefersReducedMotion) {
        gsap.set(img, { clipPath: 'inset(0 0 0 0)', webkitClipPath: 'inset(0 0 0 0)' });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
      });

      tl.to(img, {
        width: '100%',
        duration,
        ease,
        delay,
      });
    });
  }

  // Writing text animation (clip reveal)
  writingText(el, config) {
    if (!el) return;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const scriptWrite = this.prepareHeroScriptWriting(el);
    const target = scriptWrite && scriptWrite.text
      ? scriptWrite.text
      : el.querySelector('.hero-script-text') || el;

    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 1.1;
    const ease = hasEaseAttr ? config.ease : 'power2.out';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;

    const clipStart = 'inset(-0.4em 100% -0.4em 0)';
    const clipEnd = 'inset(-0.4em 0% -0.4em 0)';

    gsap.set(target, {
      clipPath: clipStart,
      webkitClipPath: clipStart,
      opacity: 0,
      y: 6,
      willChange: 'clip-path, transform, opacity'
    });

    if (prefersReducedMotion) {
      gsap.set(target, {
        opacity: 1,
        y: 0,
        clearProps: 'clip-path,webkitClipPath,transform,opacity'
      });
      return;
    }

    gsap.to(target, {
      clipPath: clipEnd,
      webkitClipPath: clipEnd,
      opacity: 1,
      y: 0,
      duration: 1.6,
      ease,
      delay,
      scrollTrigger: this.buildScrollTrigger(el, config),
      onComplete: () => {
        gsap.set(target, { clearProps: 'will-change' });
      }
    });
  }

  // Character animation for titles
  charsAnimation(el, config) {
    const chars = this.splitChars(el);
    if (chars.length === 0) return;

    const hasStartAttr = el.hasAttribute('data-gsap-start');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasStaggerAttr = el.hasAttribute('data-gsap-stagger');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');

    const start = hasStartAttr ? config.start : 'top 75%';
    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 0.9;
    const stagger = hasStaggerAttr && Number.isFinite(config.stagger) ? config.stagger : 0.02;
    const ease = hasEaseAttr ? config.ease : this.defaults.ease.chars;

    gsap.set(chars, {
      opacity: 0,
      yPercent: 90,
      rotateX: 70,
      transformOrigin: '50% 100%'
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end: 'bottom 50%',
        scrub: 1,
        toggleActions: 'play none none reverse'
      }
    });

    timeline.to(chars, {
      opacity: 1,
      yPercent: 0,
      rotateX: 0,
      ease,
      duration,
      stagger,
      delay: config.delay
    });
  }

  // Line-by-line animation - auto-detects lines on any device
  linesAnimation(el, config) {
    const lines = this.splitLines(el);
    if (lines.length === 0) return;

    // Set initial state for all lines - hidden and slightly down
    gsap.set(lines, {
      y: 30,
      autoAlpha: 0
    });

    const timeline = gsap.timeline({
      scrollTrigger: this.buildScrollTrigger(el, config)
    });

    timeline.to(lines, {
      y: 0,
      autoAlpha: 1,
      ease: config.ease || this.defaults.ease.fade,
      duration: config.duration,
      stagger: config.stagger || 0.15, // Default 0.15s between lines
      delay: config.delay
    });
  }


  // What we do section header animation (titles + logo)
  whatWeDoHeader(el, config) {
    if (!el) return;

    const leftTitle = el.querySelector('.section-title-left');
    const rightTitle = el.querySelector('.section-title-right');
    const logo = el.querySelector('.masked-logo-group img');

    if (!leftTitle || !rightTitle || !logo) return;

    gsap.set(leftTitle, { x: -100, opacity: 0 });
    gsap.set(rightTitle, { x: 100, opacity: 0 });
    gsap.set(logo, { scale: 0.7, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        toggleActions: 'play none none none',
        once: true
      }
    });

    tl.to(leftTitle, {
      x: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out'
    }, 0.6);

    tl.to(rightTitle, {
      x: 0,
      opacity: 0.5,
      duration: 0.7,
      ease: 'power2.out'
    }, 1);

    tl.to(logo, {
      scale: 1.2,
      opacity: 1,
      duration: 0.7,
      ease: 'none'
    }, 0);
  }

  // What we do feature card circle + content reveal animation
  whatWeDoCards(el, config) {
    if (!el) return;

    const cards = el.classList.contains('feature-card')
      ? [el]
      : Array.from(el.querySelectorAll('.feature-card'));

    if (!cards.length) return;

    cards.forEach((card, index) => {
      const outerFrame = card.querySelector('.five-as-section__image-outer-circle img');
      const innerCircle = card.querySelector('.five-as-section__image-inner-circle img');

      if (outerFrame && innerCircle) {
        gsap.set([outerFrame, innerCircle], {
          scale: 0.4,
          opacity: 0
        });

        gsap.to([outerFrame, innerCircle], {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            once: true
          },
          delay: index * 0.15
        });
      }

      const contentElements = card.querySelectorAll('.feature-card-title, .feature-card-description');
      if (contentElements.length > 0) {
        gsap.set(contentElements, {
          y: 20,
          autoAlpha: 0
        });

        gsap.to(contentElements, {
          y: 0,
          autoAlpha: 1,
          duration: 1.25,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            once: true
          },
          delay: (index * 0.15) + 0.3
        });
      }
    });
  }

  // Core values list animation (icon zoom-in + text slide-up with stagger)
  coreValues(el, config) {
    if (!el) return;

    const items = Array.from(el.querySelectorAll('.core-value-item'));
    if (!items.length) return;

    const stagger = Number.isFinite(config.stagger) ? config.stagger : 0.2;
    const duration = Number.isFinite(config.duration) ? config.duration : 1.25;
    const delay = Number.isFinite(config.delay) ? config.delay : 0;
    const iconEase = config.ease || this.defaults.ease.zoomIn;
    const textEase = config.ease || this.defaults.ease.slide;

    items.forEach(item => {
      const icon = item.querySelector('.core-value-icon-wrapper');
      const text = item.querySelector('.core-value-text');

      if (icon) {
        gsap.set(icon, { scale: 0.4, autoAlpha: 0 });
      }

      if (text) {
        gsap.set(text, { y: 30, autoAlpha: 0 });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: this.buildScrollTrigger(el, config)
    });

    items.forEach((item, index) => {
      const icon = item.querySelector('.core-value-icon-wrapper');
      const text = item.querySelector('.core-value-text');
      const start = delay + (index * stagger);

      if (icon) {
        tl.to(icon, {
          scale: 1,
          autoAlpha: 1,
          duration,
          ease: iconEase
        }, start);
      }

      if (text) {
        tl.to(text, {
          y: 0,
          autoAlpha: 1,
          duration,
          ease: textEase
        }, start + 0.05);
      }
    });
  }

  // Core values timeline animation - scroll-driven elegant reveal
  coreValuesTimeline(el, config) {
    if (!el) return;

    // Get all elements to animate
    const titleScript = el.querySelector('.core-values-title-script');
    const titleBold = el.querySelector('.core-values-title-bold');
    const subtitle = el.querySelector('.core-values-subtitle');
    const description = el.querySelector('.core-values-description');
    const items = Array.from(el.querySelectorAll('.core-value-item'));

    // Right side elements
    const maskedImageBlock = el.querySelector('.masked-image-content-block');

    // Set initial states - Left content
    if (titleScript) {
      gsap.set(titleScript, {
        opacity: 0,
        y: 50,
        rotationX: 15,
        transformOrigin: 'left center'
      });
    }

    if (titleBold) {
      gsap.set(titleBold, {
        opacity: 0,
        y: 60,
        rotationX: 15,
        transformOrigin: 'left center'
      });
    }

    if (subtitle) {
      gsap.set(subtitle, {
        opacity: 0,
        y: 30
      });
    }

    if (description) {
      gsap.set(description, {
        opacity: 0,
        y: 25
      });
    }

    // Set initial states - Value items
    items.forEach(item => {
      const icon = item.querySelector('.core-value-icon-wrapper');
      const title = item.querySelector('.core-value-title');
      const desc = item.querySelector('.core-value-description');

      if (icon) {
        gsap.set(icon, {
          scale: 0.7,
          opacity: 0,

        });
      }

      if (title) {
        gsap.set(title, {
          opacity: 0,
          y: 50,

        });
      }

      if (desc) {
        gsap.set(desc, {
          opacity: 0,
          y: 50
        });
      }
    });

    // Set initial states - Right side masked image block
    if (maskedImageBlock) {
      gsap.set(maskedImageBlock, {
        scale: 0.7,
        opacity: 0,


      });
    }

    // Get elements for triggers
    const valuesList = el.querySelector('.core-values-list');
    const titleGroup = el.querySelector('.core-values-title-group');
    const isMobile = window.matchMedia('(max-width: 991px)').matches;

    if (isMobile) {
      // === MOBILE: 3 separate timelines ===

      // Timeline 1: Image first (triggered by section)
      const tlImage = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      if (maskedImageBlock) {
        tlImage.to(maskedImageBlock, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }, 0);
      }

      // Timeline 2: Title & Description (triggered by title group)
      const tlTitle = gsap.timeline({
        scrollTrigger: {
          trigger: titleGroup || el,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (titleScript) {
        tlTitle.to(titleScript, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, 0);
      }

      if (titleBold) {
        tlTitle.to(titleBold, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.1);
      }

      if (subtitle) {
        tlTitle.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, 0.25);
      }

      if (description) {
        tlTitle.to(description, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, 0.4);
      }

      // Timeline 3: Each value item triggered individually on scroll
      const itemTimelines = items.map((item) => {
        const icon = item.querySelector('.core-value-icon-wrapper');
        const title = item.querySelector('.core-value-title');
        const desc = item.querySelector('.core-value-description');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        if (icon) {
          tl.to(icon, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.4)'
          }, 0);
        }

        if (title) {
          tl.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out'
          }, 0);
        }

        if (desc) {
          tl.to(desc, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          }, 0.05);
        }

        return tl;
      });

      return { tlImage, tlTitle, itemTimelines };

    } else {
      // === DESKTOP: 2 timelines (original behavior) ===

      // Timeline 1: Title & Description (triggered by section)
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 55%',
          toggleActions: 'play none none none'
        }
      });

      if (titleScript) {
        tl1.to(titleScript, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, 0);
      }

      if (titleBold) {
        tl1.to(titleBold, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.02);
      }

      if (subtitle) {
        tl1.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, 0.3);
      }

      if (description) {
        tl1.to(description, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, 0.45);
      }

      // Timeline 2: Image & Value Items (triggered by values list)
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: valuesList || el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      if (maskedImageBlock) {
        tl2.to(maskedImageBlock, {
          scale: 1,
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 1.2,
          ease: 'back.out(0.5)'
        }, 0);
      }

      const itemStagger = 0.25;
      items.forEach((item, index) => {
        const icon = item.querySelector('.core-value-icon-wrapper');
        const title = item.querySelector('.core-value-title');
        const desc = item.querySelector('.core-value-description');
        const start = 0.2 + (index * itemStagger);

        if (icon) {
          tl2.to(icon, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.7,
            ease: 'back.out(1.4)'
          }, start);
        }

        if (title) {
          tl2.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
          }, start);
        }

        if (desc) {
          tl2.to(desc, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
          }, start);
        }
      });

      return { tl1, tl2 };
    }
  }

  // Hero text animations
  heroAbout(el, config) {
    if (!el) return;

    const lines = [
      el.querySelector('.about-hero__line--handwritten'),
      el.querySelector('.about-hero__line--creative'),
      el.querySelector('.about-hero__line--individuals')
    ].filter(Boolean);

    if (!lines.length) return;

    const waitForLoaded = el.hasAttribute('data-gsap-wait-loaded');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasStaggerAttr = el.hasAttribute('data-gsap-stagger');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 0.8;
    const stagger = hasStaggerAttr && Number.isFinite(config.stagger) ? config.stagger : 0.55;
    const ease = hasEaseAttr ? config.ease : 'circ.inOut';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;
    const offsets = [-100, 100, -100];

    const setInitialState = () => {
      gsap.set(lines, {
        opacity: 0,
        xPercent: index => offsets[index % offsets.length],
        willChange: 'transform, opacity'
      });
    };

    const play = () => {
      if (el.dataset.heroAnimated === 'true') return;

      const tl = gsap.timeline({
        defaults: { ease },
        delay
      });

      tl.to(lines, {
        opacity: 1,
        xPercent: 0,
        duration,
        stagger
      }, 0);

      tl.eventCallback('onComplete', () => {
        el.dataset.heroAnimated = 'true';
      });
    };

    setInitialState();

    if (waitForLoaded && document.body && !document.body.classList.contains('loaded')) {
      const observer = new MutationObserver(() => {
        if (document.body.classList.contains('loaded')) {
          observer.disconnect();
          play();
        }
      });

      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return;
    }

    play();
  }

  heroHome(el, config) {
    if (!el) return;

    const slide = this.getActiveHeroSlide(el);
    if (!slide) return;

    // Knobs - customize these values
    const SCRIPT = { duration: 1.9, ease: 'power2.out' };
    const BOLD = { duration: 1.1, stagger: 0.07, ease: 'back.out(1.7)', yPercent: 100 };

    const script = slide.querySelector('.hero__title-script');
    const main = slide.querySelector('.hero__title-main');

    // Keep elements hidden until ready
    if (script) script.style.cssText = 'display:block;overflow:visible;opacity:0';
    if (main) main.style.cssText = 'display:block;overflow:visible;opacity:0';

    const setup = () => {
      const scriptWrite = script ? this.prepareHeroScriptWriting(script) : null;
      const boldChars = main ? this.splitHeroChars(main, { includeInner: true, includeSrOnly: true }) : [];

      // Set initial states (children hidden)
      if (scriptWrite?.text) {
        gsap.set(scriptWrite.text, { clipPath: 'inset(-0.4em 100% -0.4em 0)', opacity: 0 });
      }
      if (boldChars.length) {
        gsap.set(boldChars, { yPercent: BOLD.yPercent, opacity: 0 });
      }

      // NOW show parents - children are already hidden, so no flash
      if (script) script.style.opacity = '1';
      if (main) main.style.opacity = '1';

      const play = () => {
        if (el.dataset.heroAnimated === 'true') return;
        el.dataset.heroAnimated = 'true';

        const delay = el.hasAttribute('data-gsap-delay') ? config.delay : 0;
        const tl = gsap.timeline({ delay });

        if (scriptWrite?.text) {
          tl.to(scriptWrite.text, {
            duration: SCRIPT.duration,
            ease: SCRIPT.ease,
            opacity: 1,
            clipPath: 'inset(-0.4em 0% -0.4em 0)'
          }, 0);
        }

        if (boldChars.length) {
          tl.to(boldChars, {
            duration: BOLD.duration,
            ease: BOLD.ease,
            opacity: 1,
            yPercent: 0,
            stagger: BOLD.stagger
          }, SCRIPT.duration * 0.8);
        }
      };

      // Wait for preloader if needed
      if (el.hasAttribute('data-gsap-wait-loaded') && !document.body.classList.contains('loaded')) {
        const obs = new MutationObserver(() => {
          if (document.body.classList.contains('loaded')) { obs.disconnect(); play(); }
        });
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return;
      }

      play();
    };

    // Wait for fonts to load before setting up animation
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setup);
    } else {
      // Fallback for browsers without Font Loading API
      setup();
    }
  }

  // Section title animation: script (clip reveal) + bold (chars rise)
  // Looks for elements with "script" in class for script text, "bold" in class for bold text
  sectionTitle(el, config) {
    if (!el) return;

    // Knobs - customize these values
    const SCRIPT = { duration: 1.1, ease: 'power2.out' };
    const BOLD = { duration: 1.2, stagger: 0.02, ease: 'expo.out', yPercent: 90, rotateX: 70 };

    // Find script element (class contains "script") and bold element (class contains "bold")
    const script = el.querySelector('[class*="script"]');
    const bold = el.querySelector('[class*="bold"]');

    // Prepare script text (clip-path animation)
    const scriptWrite = script ? this.prepareHeroScriptWriting(script) : null;

    // Split bold text into chars
    const chars = bold ? this.splitChars(bold) : [];

    // Set initial states
    if (scriptWrite?.text) {
      gsap.set(scriptWrite.text, { clipPath: 'inset(-0.4em 100% -0.4em 0)', opacity: 0 });
    }
    if (chars.length) {
      gsap.set(chars, { opacity: 0, yPercent: BOLD.yPercent, rotateX: BOLD.rotateX, transformOrigin: '50% 100%' });
    }

    // Build timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: config.start || 'top 80%',
        toggleActions: 'play none none none'
      },
      delay: config.delay
    });

    // Script animation (clip reveal)
    if (scriptWrite?.text) {
      tl.to(scriptWrite.text, {
        duration: SCRIPT.duration,
        ease: SCRIPT.ease,
        opacity: 1,
        clipPath: 'inset(-0.4em 0% -0.4em 0)'
      }, 0);
    }

    // Bold chars animation (rise up)
    if (chars.length) {
      tl.to(chars, {
        duration: BOLD.duration,
        ease: BOLD.ease,
        opacity: 1,
        yPercent: 0,
        rotateX: 0,
        stagger: BOLD.stagger
      }, scriptWrite ? SCRIPT.duration * 0.9 : 0);
    }
  }

  // Wellbeing timeline animation
  // Desktop: At top 60%, image zoom-in and title section-title happen simultaneously, then content fade-up
  // Mobile: On scroll (only once), sequential: image zoom-in → title section-title → content fade-up
  wellbeingTimeline(el, config) {
    if (!el) return;

    try {
      const isMobile = window.matchMedia('(max-width: 991px)').matches;

      // Find elements - search within the row and its parent container
      const section = el.closest('.wellbeing-section');
      const container = el.closest('.container-fluid') || section;
      const imageWrapper = el.querySelector('.five-as-section__image-wrapper') || container?.querySelector('.five-as-section__image-wrapper');
      const titleGroup = el.querySelector('.wellbeing-title-group') || container?.querySelector('.wellbeing-title-group');
      const content = el.querySelector('.wellbeing-content') || container?.querySelector('.wellbeing-content');

      // Use section as trigger if row is too small or not suitable
      const triggerElement = section && section.getBoundingClientRect().height > 100 ? section : el;
      // Find all fade-up elements (text headings and text body content)
      // Handle both .wellbeing-text-body as <p> (left block) and <div> containing <p> elements (right block)
      const headings = content ? content.querySelectorAll('.wellbeing-text-heading') : [];
      const textBodies = content ? content.querySelectorAll('.wellbeing-text-body') : [];
      const fadeUpElements = [];

      // Add headings
      headings.forEach(el => fadeUpElements.push(el));

      // Add text bodies - if it's a <p>, add it directly; if it's a <div>, add its <p> children
      textBodies.forEach(el => {
        if (el.tagName === 'P') {
          fadeUpElements.push(el);
        } else {
          // Use :scope > p for direct children, or get children and filter
          const paragraphs = Array.from(el.children).filter(child => child.tagName === 'P');
          paragraphs.forEach(p => fadeUpElements.push(p));
        }
      });

      // Animation settings
      const ZOOM_IN = { duration: 1.9, ease: 'back.out(1.05)', scaleFrom: 0.7 };
      const SCRIPT = { duration: 1.1, ease: 'power2.out' };
      const BOLD = { duration: 1.2, stagger: 0.02, ease: 'expo.out', yPercent: 90, rotateX: 70 };
      const FADE_UP = { duration: 1.25, ease: 'power2.out', yFrom: 50 };

      // Set initial states for image
      if (imageWrapper) {
        gsap.set(imageWrapper, { scale: ZOOM_IN.scaleFrom, autoAlpha: 0, visibility: 'hidden' });
      } else {
        console.warn('wellbeingTimeline: Image wrapper not found');
      }

      // Set initial states for title (section-title animation)
      let scriptWrite = null;
      let chars = [];
      if (titleGroup) {
        try {
          const script = titleGroup.querySelector('[class*="script"]');
          const bold = titleGroup.querySelector('[class*="bold"]');
          if (script) {
            scriptWrite = this.prepareHeroScriptWriting(script);
          }
          if (bold) {
            chars = this.splitChars(bold) || [];
          }

          if (scriptWrite?.text) {
            gsap.set(scriptWrite.text, { clipPath: 'inset(-0.4em 100% -0.4em 0)', opacity: 0 });
          }
          if (chars && chars.length) {
            gsap.set(chars, { opacity: 0, yPercent: BOLD.yPercent, rotateX: BOLD.rotateX, transformOrigin: '50% 100%' });
          }
        } catch (err) {
          console.warn('Error setting up title animation:', err);
        }
      }

      // Set initial states for content (fade-up)
      if (fadeUpElements && fadeUpElements.length > 0) {
        try {
          gsap.set(fadeUpElements, { y: FADE_UP.yFrom, autoAlpha: 0 });
        } catch (err) {
          console.warn('Error setting initial states for fade-up elements:', err);
        }
      }

      // Only create timeline if we have at least one element to animate
      if (!imageWrapper && !titleGroup && (!fadeUpElements || fadeUpElements.length === 0)) {
        console.warn('wellbeingTimeline: No elements found to animate');
        return;
      }

      if (isMobile) {
        // Mobile: Sequential animation on scroll (only once)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: config.start || 'top 80%',
            toggleActions: 'play none none none',
            once: true
          },
          delay: config.delay
        });

        // Step 1: Image zoom-in
        if (imageWrapper) {
          tl.to(imageWrapper, {
            scale: 1,
            autoAlpha: 1,
            duration: ZOOM_IN.duration,
            ease: ZOOM_IN.ease
          });
        }

        // Step 2: Title section-title animation
        if (titleGroup) {
          const titleStart = imageWrapper ? ZOOM_IN.duration * 0.5 : 0; // Start title when image is 50% done

          // Script animation
          if (scriptWrite?.text) {
            tl.to(scriptWrite.text, {
              duration: SCRIPT.duration,
              ease: SCRIPT.ease,
              opacity: 1,
              clipPath: 'inset(-0.4em 0% -0.4em 0)'
            }, titleStart);
          }

          // Bold chars animation
          if (chars.length) {
            tl.to(chars, {
              duration: BOLD.duration,
              ease: BOLD.ease,
              opacity: 1,
              yPercent: 0,
              rotateX: 0,
              stagger: BOLD.stagger
            }, scriptWrite ? titleStart + SCRIPT.duration * 0.9 : titleStart);
          }
        }

        // Step 3: Content fade-up
        if (fadeUpElements && fadeUpElements.length) {
          const contentStart = titleGroup
            ? (scriptWrite ? ZOOM_IN.duration * 0.5 + SCRIPT.duration * 0.9 + BOLD.duration * 0.5 : ZOOM_IN.duration * 0.5 + SCRIPT.duration * 0.5)
            : (imageWrapper ? ZOOM_IN.duration * 0.5 : 0);

          tl.to(fadeUpElements, {
            y: 0,
            autoAlpha: 1,
            duration: FADE_UP.duration,
            ease: FADE_UP.ease,
            stagger: 0.1
          }, contentStart);
        }

        // Ensure timeline has at least one animation
        if (tl.duration() === 0) {
          console.warn('wellbeingTimeline (mobile): Timeline created but no animations added');
        }
      } else {
        // Desktop: At top 60%, image zoom-in and title section-title happen simultaneously, then content fade-up
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: config.start || 'top 60%',
            toggleActions: 'play none none none',
            once: true
          },
          delay: config.delay
        });

        // Step 1: Image zoom-in and title section-title simultaneously (at position 0)
        if (imageWrapper) {
          tl.to(imageWrapper, {
            scale: 1,
            autoAlpha: 1,
            duration: ZOOM_IN.duration,
            ease: ZOOM_IN.ease
          }, 0);
        }

        if (titleGroup) {
          // Script animation
          if (scriptWrite?.text) {
            tl.to(scriptWrite.text, {
              duration: SCRIPT.duration,
              ease: SCRIPT.ease,
              opacity: 1,
              clipPath: 'inset(-0.4em 0% -0.4em 0)'
            }, 0);
          }

          // Bold chars animation
          if (chars.length) {
            tl.to(chars, {
              duration: BOLD.duration,
              ease: BOLD.ease,
              opacity: 1,
              yPercent: 0,
              rotateX: 0,
              stagger: BOLD.stagger
            }, scriptWrite ? SCRIPT.duration * 0.9 : 0);
          }
        }

        // Step 2: Content fade-up (after image and title)
        if (fadeUpElements && fadeUpElements.length) {
          const contentStart = Math.max(
            imageWrapper ? ZOOM_IN.duration * 0.5 : 0,
            titleGroup ? (scriptWrite ? SCRIPT.duration * 0.9 + BOLD.duration * 0.5 : SCRIPT.duration * 0.5) : 0
          );

          tl.to(fadeUpElements, {
            y: 0,
            autoAlpha: 1,
            duration: FADE_UP.duration,
            ease: FADE_UP.ease,
            stagger: 0.1
          }, contentStart);
        }

        // Ensure timeline has at least one animation
        if (tl.duration() === 0) {
          console.warn('wellbeingTimeline (desktop): Timeline created but no animations added');
        }
      }
    } catch (error) {
      console.error('Error in wellbeingTimeline animation:', error);
      // Don't break other animations - just return
      return;
    }
  }

  // Three stages timeline animation
  // Title (section-title animation) runs first, then content (fade-up) runs in sequence
  threeStagesTimeline(el, config) {
    if (!el) return;

    try {
      // Find elements
      const title = el.querySelector('.title');
      const content = el.querySelector('.three-stages-content');

      // Find all fade-up elements in content
      // Get description paragraphs and the list element
      const descriptionParagraphs = content ? content.querySelectorAll('.three-stages-description p') : [];
      const listElement = content ? content.querySelector('.three-stages-list') : null;
      const fadeUpElements = [];

      // Add description paragraphs
      descriptionParagraphs.forEach(p => fadeUpElements.push(p));

      // Add list element if it exists
      if (listElement) {
        fadeUpElements.push(listElement);
      }

      // Animation settings
      const SCRIPT = { duration: 1.1, ease: 'power2.out' };
      const BOLD = { duration: 1.2, stagger: 0.02, ease: 'expo.out', yPercent: 90, rotateX: 70 };
      const FADE_UP = { duration: 1.25, ease: 'power2.out', yFrom: 50 };

      // Set initial states for title (section-title animation)
      let scriptWrite = null;
      let chars = [];
      if (title) {
        try {
          const script = title.querySelector('[class*="script"]');
          const bold = title.querySelector('[class*="bold"]');
          if (script) {
            scriptWrite = this.prepareHeroScriptWriting(script);
          }
          if (bold) {
            chars = this.splitChars(bold) || [];
          }

          if (scriptWrite?.text) {
            gsap.set(scriptWrite.text, { clipPath: 'inset(-0.4em 100% -0.4em 0)', opacity: 0 });
          }
          if (chars && chars.length) {
            gsap.set(chars, { opacity: 0, yPercent: BOLD.yPercent, rotateX: BOLD.rotateX, transformOrigin: '50% 100%' });
          }
        } catch (err) {
          console.warn('Error setting up title animation:', err);
        }
      }

      // Set initial states for content (fade-up)
      if (fadeUpElements && fadeUpElements.length > 0) {
        try {
          gsap.set(fadeUpElements, { y: FADE_UP.yFrom, autoAlpha: 0 });
        } catch (err) {
          console.warn('Error setting initial states for fade-up elements:', err);
        }
      }

      // Only create timeline if we have at least one element to animate
      if (!title && (!fadeUpElements || fadeUpElements.length === 0)) {
        console.warn('threeStagesTimeline: No elements found to animate');
        return;
      }

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: config.start || 'top 80%',
          toggleActions: 'play none none none',
          once: true
        },
        delay: config.delay
      });

      // Step 1: Title section-title animation
      if (title) {
        // Script animation
        if (scriptWrite?.text) {
          tl.to(scriptWrite.text, {
            duration: SCRIPT.duration,
            ease: SCRIPT.ease,
            opacity: 1,
            clipPath: 'inset(-0.4em 0% -0.4em 0)'
          });
        }

        // Bold chars animation
        if (chars && chars.length) {
          tl.to(chars, {
            duration: BOLD.duration,
            ease: BOLD.ease,
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            stagger: BOLD.stagger
          }, scriptWrite ? SCRIPT.duration * 0.9 : 0);
        }
      }

      // Step 2: Content fade-up (after title)
      if (fadeUpElements && fadeUpElements.length) {
        const contentStart = title
          ? (scriptWrite ? SCRIPT.duration * 0.9 + BOLD.duration * 0.5 : SCRIPT.duration * 0.5)
          : 0;

        // Check if there's a stagger attribute on the list
        const listElement = content?.querySelector('.three-stages-list');
        const staggerValue = listElement?.getAttribute('data-gsap-stagger')
          ? parseFloat(listElement.getAttribute('data-gsap-stagger'))
          : 0.1;

        tl.to(fadeUpElements, {
          y: 0,
          autoAlpha: 1,
          duration: FADE_UP.duration,
          ease: FADE_UP.ease,
          stagger: staggerValue
        }, contentStart);
      }

      // Ensure timeline has at least one animation
      if (tl.duration() === 0) {
        console.warn('threeStagesTimeline: Timeline created but no animations added');
      }
    } catch (error) {
      console.error('Error in threeStagesTimeline animation:', error);
      return;
    }
  }

  // Tilt card animation: cards fly in from top-left and stack at original position
  // Usage: <div data-gsap="tilt-card"> with direct children as cards
  // Mobile: cards slide in alternating from right/left on scroll
  tiltCard(el, config) {
    if (!el) return;

    const isMobile = window.matchMedia('(max-width: 991px)').matches;
    const cards = Array.from(el.children);
    if (!cards.length) return;

    if (isMobile) {
      this.tiltCardMobile(el, cards, config);
    } else {
      this.tiltCardDesktop(el, cards, config);
    }
  }

  // Desktop: cards fly in from top-left, stack together
  tiltCardDesktop(el, cards, config) {
    // Knobs - customize these values
    const CARD = {
      offsetX: 700,
      offsetY: -300,
      rotation: 85,
      duration: 2.7,
      stagger: 1,
      ease: 'power3.out'
    };
    const CONTENT = {
      y: 40,
      duration: 0.4,
      ease: 'power2.out',
      delay: 0
    };

    // Set initial state - cards start from top-left with rotation
    cards.forEach((card) => {
      gsap.set(card, {
        x: CARD.offsetX,
        y: CARD.offsetY,
        rotation: CARD.rotation,
        autoAlpha: 0,
        transformOrigin: '50% 50%'
      });

      const content = card.querySelector('[class*="content"]');
      if (content) {
        gsap.set(content, { y: CONTENT.y, autoAlpha: 0 });
      }
    });

    // Build timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: config.start || 'top 40%',
        toggleActions: 'play none none none'
      },
      delay: config.delay
    });


    const firstCardStart = (cards.length - 1) * CARD.stagger;
    const contentStartTime = firstCardStart + CARD.duration * 0.6;

    cards.forEach((card, index) => {
      const reverseIndex = cards.length - 1 - index;
      const cardStartTime = index * CARD.stagger;

      tl.to(card, {
        x: 0,
        y: 0,
        rotation: 0,
        autoAlpha: 1,
        duration: CARD.duration,
        ease: CARD.ease
      }, cardStartTime);

      const content = card.querySelector('[class*="content"]');
      if (content) {
        tl.to(content, {
          y: 0,
          autoAlpha: 1,
          duration: CONTENT.duration,
          ease: CONTENT.ease
        }, contentStartTime + CONTENT.delay + index * 0.15);
      }
    });
  }


  tiltCardMobile(el, cards, config) {
    gsap.registerPlugin(ScrollTrigger);

    const CARD = {
      duration: 1.1,
      ease: "power3.out",
      fromScale: 1.02
    };

    const CONTENT = {
      y: 30,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.15
    };

    const supportsClip = CSS && CSS.supports && CSS.supports("clip-path", "inset(0% 0% 0% 0%)");

    (cards || []).forEach((card, index) => {
      if (!card || !card.parentNode) return;

      const wrapper = document.createElement("div");
      wrapper.style.cssText = "position:relative;width:100%;height:100%;";
      card.parentNode.insertBefore(wrapper, card);
      wrapper.appendChild(card);

      const revealFromRight = index % 2 === 0;

      const clipFromLeftStart = "inset(0% 100% 0% 0%)";
      const clipFromRightStart = "inset(0% 0% 0% 100%)";
      const clipEnd = "inset(0% 0% 0% 0%)";
      const clipStart = revealFromRight ? clipFromRightStart : clipFromLeftStart;

      const content = card.querySelector('[class*="content"]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 55%",
          toggleActions: "play none none none"
        }
      });

      if (supportsClip) {
        gsap.set(card, {
          autoAlpha: 1,
          opacity: 1,
          scale: CARD.fromScale,
          clipPath: clipStart,
          WebkitClipPath: clipStart,
          willChange: "clip-path, transform"
        });

        tl.to(card, {
          clipPath: clipEnd,
          WebkitClipPath: clipEnd,
          scale: 1,
          duration: CARD.duration,
          ease: CARD.ease
        }, 0);
      } else {
        // fallback
        gsap.set(card, { autoAlpha: 0, y: 30 });
        tl.to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0);
      }

      if (content) {
        gsap.set(content, { y: CONTENT.y, autoAlpha: 0 });
        tl.to(content, {
          y: 0,
          autoAlpha: 1,
          duration: CONTENT.duration,
          ease: CONTENT.ease
        }, CONTENT.delay);
      }
    });
  }
  heroPreschool(el, config) {
    if (!el || el.dataset.heroAnimated === 'true') return;

    const slide = this.getActiveHeroSlide(el);
    if (!slide) return;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const script = slide.querySelector('.hero__title-script');
    const main = slide.querySelector('.hero__title-main');
    const scriptLine = script ? script.querySelector('.preschool-hero-line') : null;
    const mainLine = main ? main.querySelector('.preschool-hero-line') : null;

    const scriptTarget = scriptLine || script;
    const mainTarget = mainLine || main;

    const description = slide.querySelector('.hero__description');
    const playButton = el.querySelector('.play-button');

    const HERO_TEXT_KNOBS = {
      scriptDuration: 1.4,
      scriptGap: 0,
      scriptEase: 'power3.out',
      scriptTrackingFrom: '0.22em',
      scriptTrackingTo: '-0.009em',
      boldStartRatio: 0.5,
      boldDuration: 0.9,
      boldStagger: 0.06,
      boldEase: 'back.inOut(2.7)',
      boldFromY: 100,
      descriptionDuration: 0.8,
      descriptionGap: 0.3,
      descriptionEase: 'power3.out',
      descriptionFromY: 34,
      playButtonDuration: 0.7,
      playButtonGap: 0.1,
      playButtonEase: 'power2.out',
      playButtonScaleFrom: 0.08,
      playButtonOpacityFrom: 0
    };

    const boldChars = mainTarget ? this.splitHeroChars(mainTarget) : [];
    if (!scriptTarget && !boldChars.length && !description && !playButton) {
      el.dataset.heroAnimated = 'true';
      return;
    }

    if (script && scriptTarget !== script) {
      gsap.set(script, { opacity: 1 });
    }
    if (main) {
      gsap.set(main, { opacity: 1 });
    }

    if (prefersReducedMotion) {
      if (scriptTarget) {
        gsap.set(scriptTarget, { opacity: 1, clearProps: 'letter-spacing' });
      }
      if (boldChars.length) {
        gsap.set(boldChars, { yPercent: 0, opacity: 1, clearProps: 'will-change' });
      }
      if (description) {
        gsap.set(description, { opacity: 1, clearProps: 'transform' });
      }
      if (playButton) {
        gsap.set(playButton, { opacity: 1, scale: 1, clearProps: 'transform' });
      }
      el.dataset.heroAnimated = 'true';
      return;
    }

    const delay = el.hasAttribute('data-gsap-delay') ? config.delay : 0;
    const tl = gsap.timeline({ delay });

    const boldStart = scriptTarget
      ? (HERO_TEXT_KNOBS.scriptDuration * HERO_TEXT_KNOBS.boldStartRatio) + HERO_TEXT_KNOBS.scriptGap
      : 0;

    if (scriptTarget) {
      gsap.set(scriptTarget, {
        opacity: 0,
        letterSpacing: HERO_TEXT_KNOBS.scriptTrackingFrom,
        willChange: 'letter-spacing, opacity'
      });

      tl.to(scriptTarget, {
        duration: HERO_TEXT_KNOBS.scriptDuration,
        opacity: 1,
        letterSpacing: HERO_TEXT_KNOBS.scriptTrackingTo,
        ease: HERO_TEXT_KNOBS.scriptEase
      }, 0);
    }

    if (boldChars.length) {
      gsap.set(boldChars, {
        yPercent: HERO_TEXT_KNOBS.boldFromY,
        opacity: 0,
        willChange: 'transform, opacity'
      });

      tl.to(boldChars, {
        duration: HERO_TEXT_KNOBS.boldDuration,
        opacity: 1,
        yPercent: 0,
        stagger: HERO_TEXT_KNOBS.boldStagger,
        ease: HERO_TEXT_KNOBS.boldEase
      }, boldStart);
    }

    if (description) {
      gsap.set(description, {
        opacity: 0,
        y: HERO_TEXT_KNOBS.descriptionFromY,
        willChange: 'transform, opacity'
      });

      tl.to(description, {
        duration: HERO_TEXT_KNOBS.descriptionDuration,
        opacity: 1,
        y: 0,
        ease: HERO_TEXT_KNOBS.descriptionEase
      }, `-=${HERO_TEXT_KNOBS.descriptionGap}`);
    }

    if (playButton) {
      gsap.set(playButton, {
        opacity: HERO_TEXT_KNOBS.playButtonOpacityFrom,
        scale: HERO_TEXT_KNOBS.playButtonScaleFrom,
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity'
      });

      tl.to(playButton, {
        duration: HERO_TEXT_KNOBS.playButtonDuration,
        opacity: 1,
        scale: 1,
        ease: HERO_TEXT_KNOBS.playButtonEase
      }, `>+${HERO_TEXT_KNOBS.playButtonGap}`);
    }

    tl.eventCallback('onComplete', () => {
      if (scriptTarget) {
        gsap.set(scriptTarget, { clearProps: 'will-change' });
      }
      if (boldChars.length) {
        gsap.set(boldChars, { clearProps: 'will-change' });
      }
      if (description) {
        gsap.set(description, { clearProps: 'will-change' });
      }
      if (playButton) {
        gsap.set(playButton, { clearProps: 'will-change' });
      }
      el.dataset.heroAnimated = 'true';
    });
  }

  // Animate Hero - uses heroHome text animation with timeline for description, buttons, and navigation
  // Desktop: hero text → (description + play/audio button + navigation) together
  // Mobile: hero text → description → mobile action buttons
  animateHero(el, config) {
    if (!el) return;

    const slide = this.getActiveHeroSlide(el);
    if (!slide) return;

    // ========== KNOBS - Adjust these values ==========
    // Hero text
    const SCRIPT = { duration: 1.9, ease: 'power2.out' };
    const BOLD = { duration: 1.1, stagger: 0.07, ease: 'back.out(1.7)', yPercent: 100 };

    // Desktop secondary elements (animate together)
    const DESKTOP_GAP = 0.3;  // overlap with hero text end (negative = overlap, positive = gap)
    const DESCRIPTION = { duration: 0.8, ease: 'none', fromY: 50 };
    const BUTTON = { duration: 0.8, ease: 'back.out(1.3)', scaleFrom: 0.7 };
    const NAVIGATION = { duration: 1.1, ease: 'back.out(1.3)', stagger: 0.2, fromX: 50 };

    // Mobile
    const MOBILE_DESC_GAP = 0.3;  // overlap with hero text end
    const MOBILE_ACTIONS = { duration: 0.8, ease: 'power1.out', fromY: 50, stagger: 0.3, gap: 0.1 };
    // ================================================

    // Gather all elements IMMEDIATELY
    const script = slide.querySelector('.hero__title-script');
    const main = slide.querySelector('.hero__title-main');
    const description = slide.querySelector('.hero__description');
    const playButton = el.querySelector('.play-button');
    const audioButton = el.querySelector('.audio-btn');
    const navigation = el.querySelector('.arrow-navigation');
    const mobileActions = el.querySelector('.hero__mobile-actions');

    // IMMEDIATELY hide ALL elements (before fonts load) to prevent flash
    if (script) script.style.cssText = 'display:block;overflow:visible;opacity:0';
    if (main) main.style.cssText = 'display:block;overflow:visible;opacity:0';
    if (description) description.style.opacity = '0';
    if (playButton) playButton.style.opacity = '0';
    if (audioButton) audioButton.style.opacity = '0';
    if (navigation) navigation.style.opacity = '0';
    if (mobileActions) mobileActions.style.opacity = '0';

    const setup = () => {
      const scriptWrite = script ? this.prepareHeroScriptWriting(script) : null;
      const boldChars = main ? this.splitHeroChars(main, { includeInner: true, includeSrOnly: true }) : [];

      // Set initial states for text children
      if (scriptWrite?.text) {
        gsap.set(scriptWrite.text, { clipPath: 'inset(-0.4em 100% -0.4em 0)', opacity: 0 });
      }
      if (boldChars.length) {
        gsap.set(boldChars, { yPercent: BOLD.yPercent, opacity: 0 });
      }

      // Set initial states for other elements (transform values)
      if (description) {
        gsap.set(description, { y: DESCRIPTION.fromY });
      }
      if (playButton) {
        gsap.set(playButton, { scale: BUTTON.scaleFrom, transformOrigin: '50% 50%' });
      }
      if (audioButton) {
        gsap.set(audioButton, { scale: BUTTON.scaleFrom, transformOrigin: '50% 50%' });
      }
      if (navigation) {
        gsap.set(navigation.querySelectorAll('.arrow-navigation__arrow'), { x: NAVIGATION.fromX });
      }
      // mobileActions initial state set inside play() with autoAlpha

      // Show text parents now (children are hidden)
      if (script) script.style.opacity = '1';
      if (main) main.style.opacity = '1';

      const play = () => {
        if (el.dataset.heroAnimated === 'true') return;
        el.dataset.heroAnimated = 'true';

        const delay = el.hasAttribute('data-gsap-delay') ? config.delay : 0;
        const tl = gsap.timeline({ delay });
        const isMobile = window.matchMedia('(max-width: 991px)').matches;

        // 1. HERO TEXT (same as heroHome)
        if (scriptWrite?.text) {
          tl.to(scriptWrite.text, {
            duration: SCRIPT.duration,
            ease: SCRIPT.ease,
            opacity: 1,
            clipPath: 'inset(-0.4em 0% -0.4em 0)'
          }, 0);
        }

        if (boldChars.length) {
          tl.to(boldChars, {
            duration: BOLD.duration,
            ease: BOLD.ease,
            opacity: 1,
            yPercent: 0,
            stagger: BOLD.stagger
          }, SCRIPT.duration * 0.8);
        }

        // 2. DESKTOP: Description, button, navigation animate TOGETHER
        // 3. MOBILE: Description first, then mobile actions
        if (isMobile) {
          // Description first (same as fade-up)
          if (description) {
            tl.to(description, {
              duration: DESCRIPTION.duration,
              autoAlpha: 1,
              y: 0,
              ease: DESCRIPTION.ease
            }, `-=${MOBILE_DESC_GAP}`);
          }

          // Then mobile actions (same as fade-up animation)
          if (mobileActions) {
            const children = Array.from(mobileActions.children);
            // Set initial state like fade-up
            gsap.set(children, { y: MOBILE_ACTIONS.fromY, autoAlpha: 0 });
            tl.to(mobileActions, { autoAlpha: 1, duration: 0.01 }, `>+${MOBILE_ACTIONS.gap}`);
            tl.to(children, {
              duration: MOBILE_ACTIONS.duration,
              autoAlpha: 1,
              y: 0,
              ease: MOBILE_ACTIONS.ease,
              stagger: MOBILE_ACTIONS.stagger
            }, '<');
          }
        } else {
          // DESKTOP: All three animate together - use label so they start at SAME time
          tl.addLabel('secondary', `-=${DESKTOP_GAP}`);

          // Description (same as fade-up)
          if (description) {
            tl.to(description, {
              duration: DESCRIPTION.duration,
              autoAlpha: 1,
              y: 0,
              ease: DESCRIPTION.ease
            }, 'secondary');
          }

          // Play button or audio button
          const actionButton = playButton || audioButton;
          if (actionButton) {
            tl.to(actionButton, {
              duration: BUTTON.duration,
              opacity: 1,
              scale: 1,
              ease: BUTTON.ease
            }, 'secondary');
          }

          // Navigation arrows
          if (navigation) {
            const navButtons = navigation.querySelectorAll('.arrow-navigation__arrow');
            if (navButtons.length) {
              tl.to(navigation, { opacity: 1, duration: 0.01 }, 'secondary');
              tl.to(navButtons, {
                duration: NAVIGATION.duration,
                opacity: 1,
                x: 0,
                ease: NAVIGATION.ease,
                stagger: NAVIGATION.stagger
              }, 'secondary');
            }
          }
        }
      };

      // Wait for preloader if needed
      if (el.hasAttribute('data-gsap-wait-loaded') && !document.body.classList.contains('loaded')) {
        const obs = new MutationObserver(() => {
          if (document.body.classList.contains('loaded')) { obs.disconnect(); play(); }
        });
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return;
      }

      play();
    };

    // Wait for fonts before setup (prevents text measurement issues)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setup);
    } else {
      setup();
    }
  }

  heroLearning(el, config) {
    if (!el || el.dataset.heroAnimated === 'true') return;

    const slide = this.getActiveHeroSlide(el);
    if (!slide) return;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const elements = {
      title: slide.querySelector('.hero__title-line'),
      script: slide.querySelector('.hero__title-script'),
      main: slide.querySelector('.hero__title-main'),
      description: slide.querySelector('.hero__description')
    };

    if (elements.title) {
      elements.title.style.opacity = '1';
    }
    if (elements.script) {
      elements.script.style.display = 'block';
      elements.script.style.overflow = 'visible';
    }
    if (elements.main) {
      elements.main.style.display = 'block';
      elements.main.style.overflow = 'visible';
    }

    const HERO_BOLD_ANIM = {
      yFromPercent: 100,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out'
    };

    const scriptWrite = elements.script ? this.prepareHeroScriptWriting(elements.script) : null;
    const boldChars = elements.main
      ? this.splitHeroChars(elements.main, { includeInner: true, includeSrOnly: true })
      : [];

    if (elements.title) {
      gsap.set(elements.title, { perspective: 800 });
    }

    if (scriptWrite && scriptWrite.text) {
      const clipStart = 'inset(-0.4em 100% -0.4em 0)';
      gsap.set(scriptWrite.text, {
        clipPath: clipStart,
        webkitClipPath: clipStart,
        opacity: 0,
        y: 6,
        willChange: 'clip-path, transform, opacity'
      });
    }

    if (boldChars.length) {
      gsap.set(boldChars, {
        yPercent: HERO_BOLD_ANIM.yFromPercent,
        opacity: 0,
        willChange: 'transform, opacity'
      });
    }

    if (elements.description) {
      gsap.set(elements.description, {
        opacity: 0,
        y: 14,
        scale: 0.98,
        transformOrigin: 'left top',
        willChange: 'transform, opacity'
      });
    }

    if (prefersReducedMotion) {
      const reducedTargets = [elements.title, elements.description].filter(Boolean);
      if (reducedTargets.length) {
        gsap.set(reducedTargets, { opacity: 1, clearProps: 'transform' });
      }
      if (scriptWrite && scriptWrite.text) {
        gsap.set(scriptWrite.text, {
          opacity: 1,
          y: 0,
          clearProps: 'clip-path,webkitClipPath,transform,opacity'
        });
      }
      if (boldChars.length) {
        gsap.set(boldChars, {
          yPercent: 0,
          opacity: 1,
          clearProps: 'will-change'
        });
      }
      el.dataset.heroAnimated = 'true';
      return;
    }

    if (!scriptWrite && !boldChars.length && !elements.description) {
      el.dataset.heroAnimated = 'true';
      return;
    }

    const delay = el.hasAttribute('data-gsap-delay') ? config.delay : 0;
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      delay
    });

    const scriptDuration = 1.1;
    const scriptGap = 0.2;
    const scriptEnd = scriptWrite ? scriptDuration + scriptGap : 0;

    if (scriptWrite && scriptWrite.text) {
      const clipEnd = 'inset(-0.4em 0% -0.4em 0)';
      tl.to(scriptWrite.text, {
        duration: scriptDuration,
        ease: 'power2.out',
        opacity: 1,
        y: 0,
        clipPath: clipEnd,
        webkitClipPath: clipEnd
      }, 0);
    }

    if (boldChars.length) {
      tl.add(() => {
        gsap.killTweensOf(boldChars);
        gsap.to(boldChars, {
          duration: HERO_BOLD_ANIM.duration,
          opacity: 1,
          ease: HERO_BOLD_ANIM.ease,
          yPercent: 0,
          stagger: HERO_BOLD_ANIM.stagger,
          onComplete: () => {
            gsap.set(boldChars, { clearProps: 'will-change' });
          }
        });
      }, scriptEnd);
    }

    if (elements.description) {
      tl.to(elements.description, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out'
      }, scriptEnd ? scriptEnd + 0.25 : 0.2);
    }

    const clearTargets = [];
    if (scriptWrite && scriptWrite.text) {
      clearTargets.push(scriptWrite.text);
    }
    if (elements.description) {
      clearTargets.push(elements.description);
    }
    if (clearTargets.length) {
      tl.set(clearTargets, { clearProps: 'will-change' });
    }

    gsap.delayedCall(4, () => {
      if (el.dataset.heroAnimated === 'true') return;

      if (scriptWrite && scriptWrite.text) {
        gsap.set(scriptWrite.text, {
          opacity: 1,
          y: 0,
          clearProps: 'clip-path,webkitClipPath,transform,opacity'
        });
      }
      if (boldChars.length) {
        gsap.set(boldChars, {
          yPercent: 0,
          opacity: 1,
          clearProps: 'will-change'
        });
      }
      if (elements.description) {
        gsap.set(elements.description, { opacity: 1, clearProps: 'transform' });
      }
      el.dataset.heroAnimated = 'true';
    });

    tl.eventCallback('onComplete', () => {
      el.dataset.heroAnimated = 'true';
    });
  }

  heroWellbeing(el, config) {
    if (!el) return;

    const textBlocks = el.querySelectorAll('.wellbeing-hero-text');
    if (!textBlocks.length) return;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const allChars = [];

    textBlocks.forEach((block) => {
      const chars = this.splitWellbeingChars(block);
      block.style.opacity = '1';
      if (chars.length) {
        allChars.push(...chars);
      }
    });

    if (!allChars.length) return;

    if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') {
      allChars.forEach((char) => {
        char.style.opacity = '1';
        char.style.transform = 'none';
      });
      return;
    }

    const hasStartAttr = el.hasAttribute('data-gsap-start');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasStaggerAttr = el.hasAttribute('data-gsap-stagger');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const start = hasStartAttr ? config.start : 'top 80%';
    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 0.6;
    const stagger = hasStaggerAttr && Number.isFinite(config.stagger) ? config.stagger : 0.05;
    const ease = hasEaseAttr ? config.ease : 'power2.out';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;

    gsap.set(allChars, { opacity: 0, y: 20 });

    gsap.to(allChars, {
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play reverse play reverse'
      },
      opacity: 1,
      y: 0,
      stagger,
      duration,
      ease,
      delay
    });
  }

  // Masked image content block animation
  maskedImageContent(el, config) {
    if (!el) return;


    const TRIGGER_START = 'top 50%';
    const TRIGGER_START_MOBILE = 'top 80%';


    // Find all elements
    const imageWrap = el.querySelector('.masked-image-content-block-wrap');
    const contentBlock = el.querySelector('.masked-image-content-block__content');
    const scriptText = el.querySelector('.masked-image-content-block__title-script');
    const boldText = el.querySelector('.masked-image-content-block__title-bold');
    const description = el.querySelector('.masked-image-content-block__description');
    const cta = el.querySelector('.masked-image-content-block__cta');

    // Set initial states
    if (imageWrap) {
      gsap.set(imageWrap, { scale: 0.7, autoAlpha: 0 });
    }
    if (scriptText) {
      gsap.set(scriptText, { y: 50, autoAlpha: 0 });
    }
    if (boldText) {
      gsap.set(boldText, { y: 50, autoAlpha: 0 });
    }
    if (description) {
      gsap.set(description, { y: 50, autoAlpha: 0 });
    }
    if (cta) {

      gsap.set(cta, {
        autoAlpha: 1, // Keep visible for clip-path to work
        clipPath: 'inset(0 100% 0 0)', // Start with all clipped from right (no fill visible)
        webkitClipPath: 'inset(0 100% 0 0)', // Safari support
        willChange: 'clip-path' // Optimize for animation
      });

      // Wrap text in span if it doesn't exist for zoom animation
      let ctaText = cta.querySelector('span');
      if (!ctaText && cta.textContent) {
        const text = cta.textContent.trim();
        cta.innerHTML = `<span>${text}</span>`;
        ctaText = cta.querySelector('span');
      }

      // Set initial clip reveal state for text only
      if (ctaText) {
        gsap.set(ctaText, {
          clipPath: 'inset(0 100% 0 0)', // Hidden from right (reveals left to right)
          webkitClipPath: 'inset(0 100% 0 0)', // Safari support
          display: 'inline-block',
          willChange: 'clip-path'
        });
      }
    }

    // Detect mobile
    const isMobile = window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(pointer: coarse)').matches;
    const mobileStart = TRIGGER_START_MOBILE;

    if (isMobile) {
      // Mobile: Separate ScrollTriggers for image and content

      // Image animation - triggers when image comes into view
      if (imageWrap) {
        gsap.to(imageWrap, {
          scale: 1,
          autoAlpha: 1,
          duration: 1.3,
          ease: 'back.out(1.1)',
          scrollTrigger: {
            trigger: imageWrap,
            start: mobileStart,
            toggleActions: 'play none none none'
          },
          delay: config.delay || 0
        });
      }

      // Content animation - triggers when content comes into view (next scroll)
      if (contentBlock) {
        const textDuration = 1;
        const stagger = 0.2;
        const textEase = 'power2.out';

        const contentTl = gsap.timeline({
          scrollTrigger: {
            trigger: contentBlock,
            start: mobileStart,
            toggleActions: 'play none none none'
          },
          delay: config.delay || 0
        });

        // Script text fade-up (starts immediately)
        if (scriptText) {
          contentTl.to(scriptText, {
            y: 0,
            autoAlpha: 1,
            duration: textDuration,
            ease: textEase
          }, 0);
        }

        // Bold text fade-up
        if (boldText) {
          contentTl.to(boldText, {
            y: 0,
            autoAlpha: 1,
            duration: textDuration,
            ease: textEase
          }, stagger);
        }

        // Description fade-up
        if (description) {
          contentTl.to(description, {
            y: 0,
            autoAlpha: 1,
            duration: textDuration,
            ease: textEase
          }, stagger * 2);
        }

        // CTA animation: color fill from right to left, then text zoom in (matching btnClipReveal)
        if (cta) {
          const ctaText = cta.querySelector('span');

          // Step 1: Fill color from right to left (smooth, constant speed)
          contentTl.to(cta, {
            clipPath: 'inset(0 0% 0 0)', // Fill completely from right to left (no clip)
            webkitClipPath: 'inset(0 0% 0 0)', // Safari support
            duration: 0.6, // Matching btnClipReveal fillDuration (smoother, consistent speed)
            ease: 'none', // Linear easing for constant speed
            force3D: true, // GPU acceleration for smoother animation
            autoRound: false // Prevent sub-pixel rounding jitter
          }, stagger * 3);

          // Step 2: Clip reveal text (left to right)
          if (ctaText) {
            contentTl.to(ctaText, {
              clipPath: 'inset(0 0% 0 0)', // Fully revealed from left to right
              webkitClipPath: 'inset(0 0% 0 0)', // Safari support
              duration: 0.9,
              ease: 'none', // Linear easing for constant speed
              force3D: true, // GPU acceleration for smoother animation
              autoRound: false // Prevent sub-pixel rounding jitter
            }, stagger * 3 + 0.65); // Start 0.65s after fill begins (matching btnClipReveal textDelay - reduced gap)
          }
        }
      }
    } else {
      // Desktop: Single timeline with all animations
      const startPosition = TRIGGER_START;
      const desktopDelay = config.delay || 0;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: startPosition,
          toggleActions: 'play none none none'
        },
        delay: desktopDelay
      });

      const imageDuration = 1.3;
      const textDuration = 1;
      const stagger = 0.3;
      const textEase = 'power2.out';

      // Image zoom-in first
      if (imageWrap) {
        tl.to(imageWrap, {
          scale: 1,
          autoAlpha: 1,
          duration: imageDuration,
          ease: 'back.out(1.1)'
        }, 0);
      }

      // Calculate start times for each text element
      const scriptStart = imageDuration * 0.3;
      const boldStart = scriptStart + stagger;
      const descStart = boldStart + stagger;
      const ctaStart = descStart + stagger;

      // Script text fade-up
      if (scriptText) {
        tl.to(scriptText, {
          y: 0,
          autoAlpha: 1,
          duration: textDuration,
          ease: textEase
        }, scriptStart);
      }

      // Bold text fade-up
      if (boldText) {
        tl.to(boldText, {
          y: 0,
          autoAlpha: 1,
          duration: textDuration,
          ease: textEase
        }, boldStart);
      }

      // Description fade-up
      if (description) {
        tl.to(description, {
          y: 0,
          autoAlpha: 1,
          duration: textDuration,
          ease: textEase
        }, descStart);
      }

      // CTA animation: color fill from right to left, then text zoom in (matching btnClipReveal)
      if (cta) {
        const ctaText = cta.querySelector('span');

        // Step 1: Fill color from right to left (smooth, constant speed)
        tl.to(cta, {
          clipPath: 'inset(0 0% 0 0)', // Fill completely from right to left (no clip)
          webkitClipPath: 'inset(0 0% 0 0)', // Safari support
          duration: 0.6, // Matching btnClipReveal fillDuration (smoother, consistent speed)
          ease: 'none', // Linear easing for constant speed
          force3D: true, // GPU acceleration for smoother animation
          autoRound: false // Prevent sub-pixel rounding jitter
        }, ctaStart);

        // Step 2: Clip reveal text (left to right)
        if (ctaText) {
          tl.to(ctaText, {
            clipPath: 'inset(0 0% 0 0)', // Fully revealed from left to right
            webkitClipPath: 'inset(0 0% 0 0)', // Safari support
            duration: 0.9, // Matching btnClipReveal textDuration
            ease: 'none', // Linear easing for constant speed
            force3D: true, // GPU acceleration for smoother animation
            autoRound: false // Prevent sub-pixel rounding jitter
          }, ctaStart + 0.65); // Start 0.65s after fill begins (matching btnClipReveal textDelay - reduced gap)
        }
      }
    }
  }

  // Three leafy campuses animation
  threeCampuses(el, config) {
    if (!el) return;
    const T = {
      titleStart: config.start || 'top 55%',
      cardsStart: config.cardsStart || 'top 55%',
      mobileCardStart: config.mobileCardsStart || 'top 45%',
      titleScriptDuration: 0.7,
      titleBold: { duration: 0.9, stagger: 0.02, start: 0.3, ease: 'expo.out' },
      description: { start: 1.2, duration: 0.8, y: 50, ease: 'power2.out' },
      cardIn: { x: 700, y: -300, rotation: 85, duration: 2.0, ease: 'power3.out' },
      cardInMobile: { xEven: 400, xOdd: -400, y: -200, rotationEven: 45, rotationOdd: -45, duration: 1.1, ease: 'power3.out' },
      contentIn: { scaleFromDesktop: 0.5, scaleFromMobile: 0.2, duration: 0.5, ease: 'power2.out' },
      contentStartOffset: -1.3,
      desktopGapAfterContent: -0.2
    };
    const mobileContentStartOffset = Math.max(T.contentStartOffset, -0.25);
    const contentPos = T.contentStartOffset >= 0
      ? `>+=${T.contentStartOffset}`
      : `>-${Math.abs(T.contentStartOffset)}`;
    const mobileContentPos = mobileContentStartOffset >= 0
      ? `>+=${mobileContentStartOffset}`
      : `>-${Math.abs(mobileContentStartOffset)}`;

    const titleWrapper = el.querySelector('.three-campuses-section__title-wrapper');
    const description = titleWrapper?.querySelector('.lead') || el.querySelector('.lead, .three-campuses-section__description');
    const cards = Array.from(el.querySelectorAll('.three-campuses-section__card')) || [];
    const isMobile = window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(pointer: coarse)').matches;

    if (description) gsap.set(description, { y: T.description.y, autoAlpha: 0, willChange: 'transform,opacity' });

    cards.forEach((card, i) => {
      const content = card.querySelector('.three-campuses-section__card-content');
      if (isMobile) {
        const isEven = i % 2 === 0;
        gsap.set(card, {
          x: isEven ? T.cardInMobile.xEven : T.cardInMobile.xOdd,
          y: T.cardInMobile.y,
          rotation: isEven ? T.cardInMobile.rotationEven : T.cardInMobile.rotationOdd,
          autoAlpha: 0,
          transformOrigin: '50% 50%',
          willChange: 'transform,opacity'
        });
        if (content) {
          gsap.set(content, {
            scale: T.contentIn.scaleFromMobile,
            autoAlpha: 0,
            transformOrigin: '50% 50%',
            willChange: 'transform,opacity'
          });
        }
      } else {
        gsap.set(card, {
          x: T.cardIn.x,
          y: T.cardIn.y,
          rotation: T.cardIn.rotation,
          autoAlpha: 0,
          transformOrigin: '50% 50%',
          willChange: 'transform,opacity'
        });
        if (content) {
          gsap.set(content, {
            scale: T.contentIn.scaleFromDesktop,
            autoAlpha: 0,
            transformOrigin: '50% 50%',
            willChange: 'transform,opacity'
          });
        }
      }
    });
    const titleTl = gsap.timeline({
      scrollTrigger: { trigger: el, start: T.titleStart, toggleActions: 'play none none none' },
      delay: config.delay || 0
    });
    if (titleWrapper) {
      const script = titleWrapper.querySelector('[class*="script"]');
      const bold = titleWrapper.querySelector('[class*="bold"]');
      if (script) {
        const scriptWrite = this.prepareHeroScriptWriting(script);
        if (scriptWrite?.text) {
          gsap.set(scriptWrite.text, { clipPath: 'inset(-0.4em 100% -0.4em 0)', opacity: 0 });
          titleTl.to(scriptWrite.text, { duration: T.titleScriptDuration, ease: 'power2.out', opacity: 1, clipPath: 'inset(-0.4em 0% -0.4em 0)' }, 0);
        }
      }
      if (bold) {
        const chars = this.splitChars(bold);
        if (chars.length) {
          gsap.set(chars, { opacity: 0, yPercent: 90, rotateX: 70, transformOrigin: '50% 100%' });
          titleTl.to(chars, { duration: T.titleBold.duration, ease: T.titleBold.ease, opacity: 1, yPercent: 0, rotateX: 0, stagger: T.titleBold.stagger }, T.titleBold.start);
        }
      }
    }
    if (description) {
      titleTl.to(description, { y: 0, autoAlpha: 1, duration: T.description.duration, ease: T.description.ease }, T.description.start);
    }

    if (isMobile) {
      cards.forEach((card, i) => {
        const content = card.querySelector('.three-campuses-section__card-content');
        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: T.mobileCardStart,
            toggleActions: 'play none none none',
            id: `mobile-campus-card-${i}`
          }
        });
        cardTl.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          autoAlpha: 1,
          duration: T.cardInMobile.duration,
          ease: T.cardInMobile.ease
        });
        if (content) {
          cardTl.to(content, {
            scale: 1,
            autoAlpha: 1,
            duration: T.contentIn.duration,
            ease: T.contentIn.ease
          }, mobileContentPos);
        }
      });
    } else {
      const cardsTrigger = el.querySelector('.image-cards-row') || cards[0] || el;
      const cardsTl = gsap.timeline({
        scrollTrigger: { trigger: cardsTrigger, start: T.cardsStart, toggleActions: 'play none none none' }
      });
      let t = 0;
      cards.forEach((card) => {
        const content = card.querySelector('.three-campuses-section__card-content');
        cardsTl.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          autoAlpha: 1,
          duration: T.cardIn.duration,
          ease: T.cardIn.ease
        }, t);
        t += Math.max(0, T.cardIn.duration + T.contentStartOffset);
        if (content) {
          cardsTl.to(content, {
            scale: 1,
            autoAlpha: 1,
            duration: T.contentIn.duration,
            ease: T.contentIn.ease
          }, t);
          t += T.contentIn.duration + T.desktopGapAfterContent;
        }
      });
    }
  }



  // Hero text helpers
  normalizeWhitespace(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  getActiveHeroSlide(el) {
    if (!el) return null;
    const heroSlider = el.querySelector('.hero__slider');
    if (!heroSlider) return null;
    return heroSlider.querySelector('.swiper-slide-active') || heroSlider.querySelector('.swiper-slide');
  }

  splitHeroChars(element, options = {}) {
    if (!element) return [];
    if (element.dataset.split === 'true' && Array.isArray(element.__heroChars)) {
      return element.__heroChars;
    }

    const text = this.normalizeWhitespace(element.textContent || '');
    if (!text) return [];

    element.textContent = '';
    element.dataset.split = 'true';
    element.classList.add('hero-anim-text');
    element.setAttribute('role', 'text');
    element.setAttribute('aria-label', text);

    if (options.includeSrOnly) {
      const srText = document.createElement('span');
      srText.className = options.srClass || 'visually-hidden';
      srText.textContent = text;
      element.appendChild(srText);
    }

    const container = options.includeInner ? document.createElement('span') : element;
    if (options.includeInner) {
      container.className = 'hero-anim-text__inner';
      container.setAttribute('aria-hidden', 'true');
      element.appendChild(container);
    }

    const chars = [];
    const words = text.split(' ');

    words.forEach((word, index) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'hero-anim-text__word';
      wordEl.setAttribute('aria-hidden', 'true');

      Array.from(word).forEach((char) => {
        const charEl = document.createElement('span');
        charEl.className = 'hero-anim-text__char';
        charEl.textContent = char;
        charEl.setAttribute('aria-hidden', 'true');
        wordEl.appendChild(charEl);
        chars.push(charEl);
      });

      container.appendChild(wordEl);
      if (index < words.length - 1) {
        container.appendChild(document.createTextNode(' '));
      }
    });

    element.__heroChars = chars;
    return chars;
  }

  prepareHeroScriptWriting(element) {
    if (!element || element.dataset.scriptWrite === 'true') return null;

    const text = this.normalizeWhitespace(element.textContent || '');
    if (!text) return null;

    element.textContent = '';
    element.dataset.scriptWrite = 'true';
    element.setAttribute('aria-label', text);
    element.setAttribute('role', 'text');

    const textSpan = document.createElement('span');
    textSpan.className = 'hero-script-text';
    textSpan.textContent = text;
    textSpan.setAttribute('aria-hidden', 'true');
    element.appendChild(textSpan);

    return { container: element, text: textSpan };
  }

  splitWellbeingChars(element) {
    if (!element) return [];

    if (element.querySelector('.wellbeing-hero-char')) {
      return Array.from(element.querySelectorAll('.wellbeing-hero-char'));
    }

    const text = element.textContent || '';
    const tokens = text.split(/(\s+)/);
    const fragment = document.createDocumentFragment();

    tokens.forEach((token) => {
      if (!token) return;

      if (/^\s+$/.test(token)) {
        fragment.appendChild(document.createTextNode(token));
        return;
      }

      const word = document.createElement('span');
      word.className = 'wellbeing-hero-word';

      for (let i = 0; i < token.length; i += 1) {
        const span = document.createElement('span');
        span.className = 'wellbeing-hero-char';
        span.textContent = token[i];
        word.appendChild(span);
      }

      fragment.appendChild(word);
    });

    element.textContent = '';
    element.appendChild(fragment);

    return Array.from(element.querySelectorAll('.wellbeing-hero-char'));
  }

  // News cards clip reveal center (scroll-triggered row by row)
  newsCardsClip(el, config) {
    if (!el) return;

    // TIMING KNOBS - Adjust these values directly
    const T = {
      duration: 0.5,           // Animation duration per card
      stagger: 0.2,            // Stagger delay between cards in same row
      ease: 'none',             // Easing function
      start: 'top 60%',         // ScrollTrigger start position
      yOffset: 30               // Initial y offset
    };

    // Check if element is an image wrapper
    const isImageWrapper = el.classList.contains('news-detail-content-section__image-wrapper');

    // Get all news card items
    const cardItems = Array.from(el.querySelectorAll('.latest-news-item'));

    // Get image-frame elements (for CTA blocks)
    const imageFrames = Array.from(el.querySelectorAll('.image-frame'));

    // Handle image wrapper case
    if (isImageWrapper && cardItems.length === 0 && imageFrames.length === 0) {
      // Set initial state
      gsap.set(el, {
        clipPath: 'inset(0 0 100% 0)', // Hidden from bottom (reveals top to bottom)
        webkitClipPath: 'inset(0 0 100% 0)', // Safari support
        y: T.yOffset,
        willChange: 'transform, clip-path'
      });

      // Animate image wrapper
      gsap.to(el, {
        clipPath: 'inset(0% 0 0% 0)', // Fully revealed
        webkitClipPath: 'inset(0% 0 0% 0)', // Safari support
        y: 0,
        duration: T.duration,
        ease: T.ease,
        scrollTrigger: {
          trigger: el,
          start: T.start,
          toggleActions: 'play none none none'
        },
        onComplete: () => {
          gsap.set(el, { clearProps: 'will-change' });
        }
      });
      return;
    }

    // Handle image-frame case (for CTA blocks)
    if (imageFrames.length > 0 && cardItems.length === 0) {
      // Set initial states for all image frames
      imageFrames.forEach(frame => {
        gsap.set(frame, {
          clipPath: 'inset(0 0 100% 0)', // Hidden from bottom (reveals top to bottom)
          webkitClipPath: 'inset(0 0 100% 0)', // Safari support
          y: T.yOffset,
          willChange: 'transform, clip-path'
        });
      });

      // Group image frames into rows based on their actual positions
      const groupFramesByRow = (frames) => {
        if (frames.length === 0) return [];

        const tolerance = 10; // pixels tolerance for same row detection
        const rows = [];
        let currentRow = [frames[0]];
        let currentTop = frames[0].getBoundingClientRect().top;

        for (let i = 1; i < frames.length; i++) {
          const frameTop = frames[i].getBoundingClientRect().top;

          if (Math.abs(frameTop - currentTop) <= tolerance) {
            // Same row
            currentRow.push(frames[i]);
          } else {
            // New row
            rows.push(currentRow);
            currentRow = [frames[i]];
            currentTop = frameTop;
          }
        }

        // Push the last row
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }

        return rows;
      };

      const rows = groupFramesByRow(imageFrames);

      // Animate each row separately with ScrollTrigger
      rows.forEach((row, rowIndex) => {
        // Create a trigger element for this row (use first frame in row)
        const triggerElement = row[0];

        // Animate frames in this row with stagger
        gsap.to(row, {
          clipPath: 'inset(0% 0 0% 0)', // Fully revealed
          webkitClipPath: 'inset(0% 0 0% 0)', // Safari support
          y: 0,
          duration: T.duration,
          ease: T.ease,
          stagger: T.stagger,
          scrollTrigger: {
            trigger: triggerElement,
            start: T.start,
            toggleActions: 'play none none none'
          },
          onComplete: () => {
            // Clean up will-change for performance after all rows are done
            if (rowIndex === rows.length - 1) {
              imageFrames.forEach(frame => {
                gsap.set(frame, { clearProps: 'will-change' });
              });
            }
          }
        });
      });
      return;
    }

    // Handle cards case
    if (cardItems.length === 0) return;

    // Auto-detect rows based on actual card positions
    // Cards on the same row will have the same offsetTop (with small tolerance for subpixel differences)
    const groupCardsByRow = (cards) => {
      if (cards.length === 0) return [];

      const tolerance = 10; // pixels tolerance for same row detection
      const rows = [];
      let currentRow = [cards[0]];
      let currentTop = cards[0].getBoundingClientRect().top;

      for (let i = 1; i < cards.length; i++) {
        const cardTop = cards[i].getBoundingClientRect().top;

        if (Math.abs(cardTop - currentTop) <= tolerance) {
          // Same row
          currentRow.push(cards[i]);
        } else {
          // New row
          rows.push(currentRow);
          currentRow = [cards[i]];
          currentTop = cardTop;
        }
      }

      // Push the last row
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }

      return rows;
    };

    // Group cards into rows based on their actual positions
    const rows = groupCardsByRow(cardItems);

    // Set initial states for all cards
    cardItems.forEach(card => {
      // Find the card element (the container to animate)
      const cardElement = card.querySelector('.latest-news-grid-section__card') || card;

      gsap.set(cardElement, {
        clipPath: 'inset(0 0 100% 0)', // Hidden from bottom (reveals top to bottom)
        webkitClipPath: 'inset(0 0 100% 0)', // Safari support
        y: T.yOffset,
        willChange: 'transform, clip-path'
      });
    });

    // Animate each row separately with ScrollTrigger
    rows.forEach((row, rowIndex) => {
      // Create a trigger element for this row (use first card in row)
      const triggerElement = row[0];

      // Get card elements for this row
      const rowCardElements = row.map(card => card.querySelector('.latest-news-grid-section__card') || card);

      // Animate cards in this row with stagger
      gsap.to(rowCardElements, {
        clipPath: 'inset(0% 0 0% 0)', // Fully revealed
        webkitClipPath: 'inset(0% 0 0% 0)', // Safari support
        y: 0,
        duration: T.duration,
        ease: T.ease,
        stagger: T.stagger,
        scrollTrigger: {
          trigger: triggerElement,
          start: T.start,
          toggleActions: 'play none none none'
        },
        onComplete: () => {
          // Clean up will-change for performance after all rows are done
          if (rowIndex === rows.length - 1) {
            cardItems.forEach(card => {
              const cardElement = card.querySelector('.latest-news-grid-section__card') || card;
              gsap.set(cardElement, { clearProps: 'will-change' });
            });
          }
        }
      });
    });
  }

  // Button clip reveal animation (same as masked-image-content-block CTA)
  btnClipReveal(el, config) {
    if (!el) return;

    // TIMING KNOBS - Adjust these values directly
    const T = {
      fillDuration: 0.45,        // Faster fill to avoid slow start
      textDuration: 0.55,        // Match fill speed for smoother feel
      textDelay: 0.15,           // Reduce delay to avoid late snap
      ease: 'power2.out',        // Slightly stronger ease, smoother finish
      start: config.start || 'top 80%' // ScrollTrigger start position
    };

    const btn = el.tagName === 'A' || el.tagName === 'BUTTON' ? el : el.querySelector('a, button');
    if (!btn) return;
    const prevBtnTransition = btn.style.transition;

    // Set initial state for button fill (hidden from right)
    gsap.set(btn, {
      autoAlpha: 1, // Keep visible for clip-path to work
      clipPath: 'inset(0 100% 0 0)', // Start with all clipped from right (no fill visible)
      webkitClipPath: 'inset(0 100% 0 0)', // Safari support
      willChange: 'clip-path', // Optimize for animation
      transition: 'none' // Prevent CSS transitions from fighting GSAP
    });

    // Wrap text in span if it doesn't exist for clip reveal animation
    let btnText = btn.querySelector('span');
    if (!btnText && btn.textContent) {
      const text = btn.textContent.trim();
      btn.innerHTML = `<span>${text}</span>`;
      btnText = btn.querySelector('span');
    }
    const prevTextTransition = btnText ? btnText.style.transition : '';

    // Set initial clip reveal state for text only (hidden from right, reveals left to right)
    if (btnText) {
      gsap.set(btnText, {
        clipPath: 'inset(0 100% 0 0)', // Hidden from right (reveals left to right)
        webkitClipPath: 'inset(0 100% 0 0)', // Safari support
        display: 'inline-block',
        willChange: 'clip-path',
        transition: 'none'
      });
    }

    // Create timeline for button animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: btn,
        start: T.start,
        toggleActions: 'play none none none'
      },
      delay: config.delay || 0
    });

    // Step 1: Fill color from right to left (smooth, constant speed)
    tl.to(btn, {
      clipPath: 'inset(0 0% 0 0)', // Fill completely from right to left (no clip)
      webkitClipPath: 'inset(0 0% 0 0)', // Safari support
      duration: T.fillDuration,
      ease: 'none', // Linear easing for constant speed
      force3D: true, // GPU acceleration for smoother animation
      autoRound: false // Prevent sub-pixel rounding jitter
    });

    // Step 2: Clip reveal text (left to right)
    if (btnText) {
      tl.to(btnText, {
        clipPath: 'inset(0 0% 0 0)', // Fully revealed from left to right
        webkitClipPath: 'inset(0 0% 0 0)', // Safari support
        duration: T.textDuration,
        ease: 'none', // Linear easing for constant speed
        force3D: true, // GPU acceleration for smoother animation
        autoRound: false // Prevent sub-pixel rounding jitter
      }, T.textDelay); // Start text reveal T.textDelay seconds after fill begins
    }

    tl.eventCallback('onComplete', () => {
      btn.style.transition = prevBtnTransition;
      if (btnText) btnText.style.transition = prevTextTransition;
      gsap.set(btn, { clearProps: 'will-change,clip-path' });
      if (btnText) gsap.set(btnText, { clearProps: 'will-change,clip-path' });
    });
  }

  // Button clip reveal from bottom to top (same technique as writingText)
  btnClipBottom(el, config) {
    if (!el) return;

    const btn = el.tagName === 'A' || el.tagName === 'BUTTON' ? el : el.querySelector('a, button');
    if (!btn) return;

    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const hasStartAttr = el.hasAttribute('data-gsap-start');
    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 1.2;
    const ease = hasEaseAttr ? config.ease : 'power2.out';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;
    const start = hasStartAttr ? config.start : 'top 105%';

    // Clip from bottom to top (reverse of writingText which goes left to right)
    // Negative values on left/right extend clip area to avoid rendering issues
    const clipStart = 'inset(100% -0.2em -0.4em -0.2em)'; // Hidden from top (reveals bottom to top)
    const clipEnd = 'inset(-0.4em -0.2em -0.4em -0.2em)'; // Fully revealed

    // Set initial state (same pattern as writingText)
    gsap.set(btn, {
      clipPath: clipStart,
      webkitClipPath: clipStart,
      opacity: 0,
      y: 10,
      willChange: 'clip-path, transform, opacity'
    });

    // Animate button (same pattern as writingText)
    gsap.to(btn, {
      clipPath: clipEnd,
      webkitClipPath: clipEnd,
      opacity: 1,
      y: 0,
      duration: duration,
      ease: ease,
      delay: delay,
      scrollTrigger: {
        trigger: btn,
        start: start,
        toggleActions: 'play none none none'
      },
      onComplete: () => {
        gsap.set(btn, { clearProps: 'will-change' });
      }
    });
  }


  // Helper: Split text into characters
  splitChars(el) {
    if (!el) return [];
    if (el.querySelector('.gsap-char')) {
      return Array.from(el.querySelectorAll('.gsap-char'));
    }

    const text = el.textContent || '';
    el.textContent = '';
    const chars = [];
    let wordWrapper = null;

    [...text].forEach((char) => {
      const isSpace = /\s/.test(char);
      if (isSpace) {
        wordWrapper = null;
        el.appendChild(document.createTextNode(' '));
        return;
      }

      if (!wordWrapper) {
        wordWrapper = document.createElement('span');
        wordWrapper.className = 'gsap-word';
        wordWrapper.style.display = 'inline-block';
        wordWrapper.style.whiteSpace = 'nowrap';
        wordWrapper.style.transformOrigin = '50% 100%';
        el.appendChild(wordWrapper);
      }

      const span = document.createElement('span');
      span.className = 'gsap-char';
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.transformOrigin = '50% 100%';
      wordWrapper.appendChild(span);
      chars.push(span);
    });

    return chars;
  }

  // Helper: Split text into lines (auto-detects based on layout)
  splitLines(el) {
    if (!el) return [];

    // Check if already split
    if (el.querySelector('.gsap-line')) {
      return Array.from(el.querySelectorAll('.gsap-line'));
    }

    const text = el.textContent || '';
    const words = text.split(/\s+/).filter(word => word.length > 0);

    // Clear element and add words as spans to detect their positions
    el.textContent = '';
    const wordElements = [];

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      wordElements.push(span);
      el.appendChild(span);

      // Add space after word (except last word)
      if (index < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });

    // Detect lines by comparing offsetTop positions
    const lines = [];
    let currentLine = [];
    let currentTop = null;

    wordElements.forEach((wordEl) => {
      const top = wordEl.offsetTop;

      if (currentTop === null || top === currentTop) {
        // Same line
        currentLine.push(wordEl);
        currentTop = top;
      } else {
        // New line detected
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [wordEl];
        currentTop = top;
      }
    });

    // Push the last line
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // Clear element and rebuild with line wrappers
    el.textContent = '';
    const lineElements = [];

    lines.forEach((lineWords, lineIndex) => {
      const lineWrapper = document.createElement('span');
      lineWrapper.className = 'gsap-line';
      lineWrapper.style.display = 'block';
      lineWrapper.style.overflow = 'hidden';

      lineWords.forEach((wordEl, wordIndex) => {
        lineWrapper.appendChild(wordEl);

        // Add space between words (except after last word)
        if (wordIndex < lineWords.length - 1) {
          lineWrapper.appendChild(document.createTextNode(' '));
        }
      });

      el.appendChild(lineWrapper);
      lineElements.push(lineWrapper);
    });

    return lineElements;
  }

  // ── Clip Reveal Top: reveals image/element top-to-bottom ──
  clipRevealTop(el, config) {
    if (!el) return;
    if (el.dataset.clipRevealTopInit === 'true') return;
    el.dataset.clipRevealTopInit = 'true';

    const isImg = el.tagName === 'IMG';
    const imgs = !isImg ? Array.from(el.querySelectorAll('img')) : [];
    const elements = imgs.length ? imgs : [el];

    const start = el.hasAttribute('data-gsap-start') ? config.start : 'top 62%';
    const duration = el.hasAttribute('data-gsap-duration') && Number.isFinite(config.duration) ? config.duration : 1.0;
    const ease = el.hasAttribute('data-gsap-ease') ? config.ease : 'power3.out';
    const delay = el.hasAttribute('data-gsap-delay') && Number.isFinite(config.delay) ? config.delay : 0;

    elements.forEach((target) => {
      gsap.set(target, { clipPath: 'inset(0 0 100% 0)', willChange: 'clip-path' });
      gsap.to(target, {
        clipPath: 'inset(0 0 0% 0)',
        duration, ease, delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
        onComplete: () => gsap.set(target, { clearProps: 'will-change,clip-path' }),
      });
    });
  }

  // ── Clip Reveal Left: reveals image/element left-to-right ──
  clipRevealLeft(el, config) {
    if (!el) return;
    if (el.dataset.clipRevealLeftInit === 'true') return;
    el.dataset.clipRevealLeftInit = 'true';

    const isImg = el.tagName === 'IMG';
    const imgs = !isImg ? Array.from(el.querySelectorAll('img')) : [];
    const elements = imgs.length ? imgs : [el];

    const start = el.hasAttribute('data-gsap-start') ? config.start : 'top 62%';
    const duration = el.hasAttribute('data-gsap-duration') && Number.isFinite(config.duration) ? config.duration : 1.0;
    const ease = el.hasAttribute('data-gsap-ease') ? config.ease : 'power3.out';
    const delay = el.hasAttribute('data-gsap-delay') && Number.isFinite(config.delay) ? config.delay : 0;

    elements.forEach((target) => {
      gsap.set(target, { clipPath: 'inset(0 100% 0 0)', willChange: 'clip-path' });
      gsap.to(target, {
        clipPath: 'inset(0 0% 0 0)',
        duration, ease, delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
        onComplete: () => gsap.set(target, { clearProps: 'will-change,clip-path' }),
      });
    });
  }

  // ── Clip Reveal Right: reveals image/element right-to-left ──
  clipRevealRight(el, config) {
    if (!el) return;
    if (el.dataset.clipRevealRightInit === 'true') return;
    el.dataset.clipRevealRightInit = 'true';

    const isImg = el.tagName === 'IMG';
    const imgs = !isImg ? Array.from(el.querySelectorAll('img')) : [];
    const elements = imgs.length ? imgs : [el];

    const start = el.hasAttribute('data-gsap-start') ? config.start : 'top 62%';
    const duration = el.hasAttribute('data-gsap-duration') && Number.isFinite(config.duration) ? config.duration : 1.0;
    const ease = el.hasAttribute('data-gsap-ease') ? config.ease : 'power3.out';
    const delay = el.hasAttribute('data-gsap-delay') && Number.isFinite(config.delay) ? config.delay : 0;

    elements.forEach((target) => {
      gsap.set(target, { clipPath: 'inset(0 0 0 100%)', willChange: 'clip-path' });
      gsap.to(target, {
        clipPath: 'inset(0 0 0 0%)',
        duration, ease, delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
        onComplete: () => gsap.set(target, { clearProps: 'will-change,clip-path' }),
      });
    });
  }

  // ── Word Reveal: each word slides up from behind a clip mask ──
  wordReveal(el, config) {
    if (!el) return;
    if (el.dataset.wordRevealInit === 'true') return;
    el.dataset.wordRevealInit = 'true';

    const text = el.textContent || '';
    if (!text.trim()) return;

    const words = text.trim().split(/\s+/);
    el.innerHTML = words
      .map(w => `<span class="gsap-word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:inherit"><span class="gsap-word-inner" style="display:inline-block">${w}</span></span>`)
      .join('\u00A0');

    const wordInners = Array.from(el.querySelectorAll('.gsap-word-inner'));
    const start = el.hasAttribute('data-gsap-start') ? config.start : 'top 78%';
    const duration = el.hasAttribute('data-gsap-duration') && Number.isFinite(config.duration) ? config.duration : 0.65;
    const ease = el.hasAttribute('data-gsap-ease') ? config.ease : 'power2.out';
    const delay = el.hasAttribute('data-gsap-delay') && Number.isFinite(config.delay) ? config.delay : 0;
    const stagger = config.stagger !== null ? config.stagger : 0.06;

    gsap.set(wordInners, { y: '110%', autoAlpha: 0 });
    gsap.to(wordInners, {
      y: '0%',
      autoAlpha: 1,
      duration,
      ease,
      delay,
      stagger,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
    });
  }

  // ── Clip Smooth: clips the container itself + scales inner img for GPU-composited butter reveal ──
  clipSmooth(el, config) {
    if (!el) return;
    if (el.dataset.clipSmoothInit === 'true') return;
    el.dataset.clipSmoothInit = 'true';

    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    const start = el.hasAttribute('data-gsap-start') ? config.start : 'top 85%';
    const duration = el.hasAttribute('data-gsap-duration') && Number.isFinite(config.duration) ? config.duration : 1.8;
    const delay = el.hasAttribute('data-gsap-delay') && Number.isFinite(config.delay) ? config.delay : 0;

    // Clip the container (or img if standalone) — compositor-friendly
    gsap.set(el, { clipPath: 'inset(100% 0 0 0)', willChange: 'clip-path' });
    if (img && img !== el) gsap.set(img, { scale: 1.1, willChange: 'transform' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
      delay,
      onComplete: () => {
        gsap.set(el, { clearProps: 'will-change,clip-path' });
        if (img && img !== el) gsap.set(img, { clearProps: 'will-change' });
      },
    });

    tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration, ease: 'power3.inOut' }, 0);
    if (img && img !== el) {
      tl.to(img, { scale: 1, duration: duration * 1.1, ease: 'power3.inOut' }, 0);
    }
  }

  // ── Clip Smooth Down: reveals top-to-bottom, GPU-composited ──
  // When data-gsap-stagger is set, clips each child element individually with stagger
  clipSmoothDown(el, config) {
    if (!el) return;
    if (el.dataset.clipSmoothDownInit === 'true') return;
    el.dataset.clipSmoothDownInit = 'true';

    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(max-width: 991px)').matches;
    const baseStart = el.hasAttribute('data-gsap-start') ? config.start : 'top 85%';
    const duration = el.hasAttribute('data-gsap-duration') && Number.isFinite(config.duration) ? config.duration : 1.1;
    const delay = el.hasAttribute('data-gsap-delay') && Number.isFinite(config.delay) ? config.delay : 0;
    const stagger = config.stagger !== null ? config.stagger : 0;

    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const targets = children && stagger ? children : [el];
    const cardsStart = isMobile && config.mobileCardsStart
      ? config.mobileCardsStart
      : (config.cardsStart || null);
    const start = cardsStart && children && stagger ? cardsStart : baseStart;

    targets.forEach(target => {
      const img = target.tagName === 'IMG' ? target : target.querySelector('img');
      if (img && img !== target) gsap.set(img, { scale: 1.1, willChange: 'transform' });
    });

    gsap.set(targets, { clipPath: 'inset(0 0 100% 0)', willChange: 'clip-path' });

    gsap.to(targets, {
      clipPath: 'inset(0 0 0% 0)',
      duration,
      ease: 'power3.inOut',
      delay,
      stagger,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
      onComplete: () => {
        gsap.set(targets, { clearProps: 'will-change,clip-path' });
      },
    });

    // Animate image scale back to 1 in sync with the clip — prevents the
    // GPU layer snap (visible as a shift) when clearProps fires on the container.
    targets.forEach(target => {
      const img = target.tagName === 'IMG' ? target : target.querySelector('img');
      if (img && img !== target) {
        gsap.to(img, {
          scale: 1,
          duration,
          ease: 'power3.inOut',
          delay,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none none',
            once: true,
          },
          onComplete: () => gsap.set(img, { clearProps: 'willChange,transform' }),
        });
      }
    });
  }

  // ── Char Reveal: each character slides up from behind a word-level clip mask ──
  // Preserves child elements (colored spans, em, etc.) and real whitespace between words
  charReveal(el, config) {
    if (!el) return;
    if (el.dataset.charRevealInit === 'true') return;
    el.dataset.charRevealInit = 'true';

    if (!el.textContent?.trim()) return;

    const allChars = [];

    // Process a text string into word-wrapped char spans, appended to a container
    const processText = (text, container) => {
      // Split on whitespace boundaries, keeping the whitespace tokens
      const parts = text.split(/(\s+)/);
      parts.forEach(part => {
        if (/^\s+$/.test(part)) {
          // Real whitespace — preserve it as a text node so line-wrapping works naturally
          container.appendChild(document.createTextNode(part));
        } else if (part) {
          const wordWrap = document.createElement('span');
          wordWrap.className = 'gsap-cr-word';
          wordWrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top';
          part.split('').forEach(ch => {
            const charSpan = document.createElement('span');
            charSpan.className = 'gsap-cr-char';
            charSpan.style.display = 'inline-block';
            charSpan.textContent = ch;
            wordWrap.appendChild(charSpan);
            allChars.push(charSpan);
          });
          container.appendChild(wordWrap);
        }
      });
    };

    // Walk top-level child nodes so styled wrappers (span.rg-gold, em, etc.) are preserved
    const originalNodes = Array.from(el.childNodes);
    el.innerHTML = '';

    originalNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        processText(node.textContent || '', el);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recreate the wrapper element preserving tag + attributes
        const wrapper = document.createElement(node.nodeName.toLowerCase());
        Array.from(node.attributes).forEach(attr => wrapper.setAttribute(attr.name, attr.value));
        processText(node.textContent || '', wrapper);
        el.appendChild(wrapper);
      }
    });

    if (!allChars.length) return;

    const start = el.hasAttribute('data-gsap-start') ? config.start : 'top 80%';
    const duration = el.hasAttribute('data-gsap-duration') && Number.isFinite(config.duration) ? config.duration : 0.7;
    const delay = el.hasAttribute('data-gsap-delay') && Number.isFinite(config.delay) ? config.delay : 0;
    const stagger = config.stagger !== null ? config.stagger : 0.022;

    gsap.set(allChars, { y: '115%', opacity: 0 });
    gsap.to(allChars, {
      y: '0%',
      opacity: 1,
      duration,
      ease: 'power4.out',
      stagger,
      delay,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
    });
  }

  // ── Word Write: words appear one-by-one as if being written ──
  wordWrite(el, config) {
    if (!el) return;
    if (el.dataset.wordWriteInit === 'true') return;
    el.dataset.wordWriteInit = 'true';

    const text = el.textContent || '';
    if (!text.trim()) return;

    const words = text.trim().split(/\s+/);
    el.innerHTML = words
      .map(w => `<span class="gsap-ww" style="display:inline-block;opacity:0;filter:blur(6px);white-space:nowrap">${w}</span>`)
      .join('\u00A0');

    const spans = Array.from(el.querySelectorAll('.gsap-ww'));
    const start = el.hasAttribute('data-gsap-start') ? config.start : 'top 82%';
    const delay = el.hasAttribute('data-gsap-delay') && Number.isFinite(config.delay) ? config.delay : 0;
    const stagger = config.stagger !== null ? config.stagger : 0.08;

    gsap.to(spans, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.45,
      ease: 'power2.out',
      delay,
      stagger,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
    });
  }
}

export const initGsapSwitchAnimations = (root) => {
  if (typeof window === 'undefined') return () => { };

  const scope = root || document;
  const ctx = gsap.context(() => {
    const animator = new GSAPAnimations(scope);
    animator.init();
  }, scope instanceof Element ? scope : undefined);

  return () => ctx.revert();
};

export { GSAPAnimations };
