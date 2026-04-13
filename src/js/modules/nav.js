/**
 * Mobile Navigation — Hamburger menu toggle
 */
export function initNav() {
  const toggle = document.querySelector('.nav-toggle')
  const menu = document.querySelector('.nav-mobile')
  const closeBtn = document.querySelector('.nav-close')
  const menuLinks = document.querySelectorAll('.nav-mobile-links a')

  if (!toggle || !menu) return

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true')
    menu.setAttribute('aria-hidden', 'false')
    menu.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false')
    menu.setAttribute('aria-hidden', 'true')
    menu.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('is-open')
    isOpen ? closeMenu() : openMenu()
  })

  closeBtn?.addEventListener('click', closeMenu)

  // Close menu when a link is clicked
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu)
  })

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu()
      toggle.focus()
    }
  })

  // Close when clicking outside the menu content
  menu.addEventListener('click', (e) => {
    if (e.target === menu) closeMenu()
  })
}
