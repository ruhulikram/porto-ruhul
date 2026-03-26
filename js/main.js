/* ============================================= */
/*  RUHUL IKRAM — Portfolio v5 Interactivity      */
/*  Custom Asset Folder + Bubble Text             */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.getElementById('scrollIndicator');

    // === NAVBAR SCROLL ===
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 40);
        if (scrollIndicator) scrollIndicator.style.opacity = y > 80 ? '0' : '';
    });

    // === INTERACTIVE FILES + CHAT BUBBLE → CLICK TO SCROLL ===
    const navItems = document.querySelectorAll('.file-interactive, .chat-bubble-3d');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-section');
            if (targetId) {
                const target = document.getElementById(targetId);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
        });
    });

    // === PARALLAX MOUSE on folder ===
    const folder = document.getElementById('mainFolder');
    const heroDesk = document.querySelector('.hero-desk');

    if (folder && heroDesk && window.innerWidth > 768) {
        heroDesk.addEventListener('mousemove', (e) => {
            const rect = heroDesk.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            folder.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 3}deg)`;
        });
        heroDesk.addEventListener('mouseleave', () => {
            folder.style.transform = '';
            folder.style.transition = 'transform 0.5s ease';
            setTimeout(() => { folder.style.transition = ''; }, 500);
        });
    }

    // === SCROLL REVEAL ===
    const revealEls = document.querySelectorAll(
        '.project-card, .work-card, .study-card, .section-header, .contact-wrapper'
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    const style = document.createElement('style');
    style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    revealEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
        observer.observe(el);
    });

    // Stagger grid children
    document.querySelectorAll('.project-grid, .work-cards, .studies-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
        });
    });

    console.log('🚀 Portfolio Ruhul Ikram v5 — Custom Asset Folder loaded!');
});