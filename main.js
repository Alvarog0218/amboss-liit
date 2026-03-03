document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.switch-btn');
    const pageWrapper = document.getElementById('page-wrapper');
    const pill = document.querySelector('.switcher-pill');
    const switcher = document.querySelector('.switcher');

    function updatePill(activeBtn) {
        if (!activeBtn || !pill || !switcher) return;

        const btnRect = activeBtn.getBoundingClientRect();
        const switcherRect = switcher.getBoundingClientRect();

        pill.style.width = `${btnRect.width}px`;
        pill.style.transform = `translateX(${btnRect.left - switcherRect.left}px)`;
    }

    // Initialize pill on the active button
    const initialActive = document.querySelector('.switch-btn.active');
    setTimeout(() => {
        updatePill(initialActive);
    }, 100);

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('active')) return;

            // Remove active from all buttons
            buttons.forEach(b => b.classList.remove('active'));
            const targetBtn = e.currentTarget;
            targetBtn.classList.add('active');

            // Move the pill
            updatePill(targetBtn);

            // Change container classes for transitions on the main page wrapper
            const targetState = targetBtn.getAttribute('data-target');

            // Clean up old classes
            pageWrapper.classList.remove('is-liit', 'is-amboss', 'is-split');

            // Force reflow
            void pageWrapper.offsetWidth;

            // Add new state class
            pageWrapper.classList.add(`is-${targetState}`);
        });
    });

    // Handle resize to fix pill placement if window resizes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const activeBtn = document.querySelector('.switch-btn.active');
            updatePill(activeBtn);
        }, 100);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
