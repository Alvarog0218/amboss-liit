import '../styles/main.css'
import { initNav } from './modules/nav.js'
import { initSwitcher } from './modules/switcher.js'
import { initSmoothScroll } from './modules/smooth-scroll.js'

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initSwitcher()
  initSmoothScroll()
})
