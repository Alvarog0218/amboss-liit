/**
 * Smooth scroll for anchor links
 */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href')
      if (targetId === '#') return

      const targetElement = document.querySelector(targetId)
      if (!targetElement) return

      e.preventDefault()
      targetElement.scrollIntoView({ behavior: 'smooth' })
    })
  })
}
