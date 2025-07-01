import { ApiClient } from './api.js';
import { NotificationManager } from './notifications.js';
import { LoadingManager } from './loading.js';

// Initialize managers
const api = new ApiClient();
const notifications = new NotificationManager();
const loading = new LoadingManager();

// DOM Elements
const nav = document.querySelector('nav');
const heroSection = document.querySelector('.hero-section');
const shapes = document.querySelectorAll('.shape');
const statNumbers = document.querySelectorAll('.stat-number');

// Initialize AOS
AOS.init({
    duration: 900,
    once: true,
    offset: 100,
    mirror: true
});

// Initialize Particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    },
    retina_detect: true
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate mouse position relative to center
    const x = (clientX - innerWidth / 2) / 50;
    const y = (clientY - innerHeight / 2) / 50;
    
    // Apply parallax effect to shapes
    shapes.forEach((shape, index) => {
        const speed = 0.1 + (index * 0.05);
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Animate numbers when they come into view
const animateNumber = (element) => {
    const target = parseInt(element.getAttribute('data-value'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let count = 0;
    
    const updateCount = () => {
        count += increment;
        if (count < target) {
            element.textContent = Math.floor(count);
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    };
    
    updateCount();
};

// Observe stat numbers
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(number => {
    observer.observe(number);
});

// Add hover effect to cards
document.querySelectorAll('.feature-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Handle form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            loading.show();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Handle different form types
            if (form.id === 'login-form') {
                const response = await api.login(data);
                if (response.token) {
                    notifications.success('Login successful!');
                    setTimeout(() => window.location.href = '/dashboard.html', 1000);
                }
            } else if (form.id === 'signup-form') {
                const response = await api.signup(data);
                if (response.success) {
                    notifications.success('Account created successfully!');
                    setTimeout(() => window.location.href = '/login.html', 1000);
                }
            }
        } catch (error) {
            notifications.error(error.message || 'An error occurred');
        } finally {
            loading.hide();
        }
    });
}); 