/**
 * Brand Switcher — LIIT / Split / AMBOSS panel states
 */
export function initSwitcher() {
  const buttons = document.querySelectorAll('.switch-btn')
  const pageWrapper = document.getElementById('page-wrapper')
  const pill = document.querySelector('.switcher-pill')
  const switcher = document.querySelector('.switcher')

  if (!pageWrapper || !switcher) return

  function updatePill(activeBtn) {
    if (!activeBtn || !pill) return

    const btnRect = activeBtn.getBoundingClientRect()
    const switcherRect = switcher.getBoundingClientRect()

    pill.style.width = `${btnRect.width}px`
    pill.style.transform = `translateX(${btnRect.left - switcherRect.left}px)`
  }

  // Initialize pill on the active button
  const initialActive = document.querySelector('.switch-btn.active')
  // Use requestAnimationFrame to ensure layout is calculated
  requestAnimationFrame(() => {
    requestAnimationFrame(() => updatePill(initialActive))
  })

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return

      buttons.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      updatePill(btn)

      const targetState = btn.getAttribute('data-target')
      pageWrapper.classList.remove('is-liit', 'is-amboss', 'is-split')

      // Force reflow for CSS transition to trigger correctly
      void pageWrapper.offsetWidth

      pageWrapper.classList.add(`is-${targetState}`)
    })
  })

  // Reposition pill on resize (debounced)
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const activeBtn = document.querySelector('.switch-btn.active')
      updatePill(activeBtn)
    }, 100)
  })
}
