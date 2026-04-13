/**
 * Simulator — Pricing rates and calculation engine
 */

const RATES = {
  baseCostPerSqm: {
    residencial: 2_500_000, // COP/m²
    comercial:   2_200_000,
    industrial:  1_800_000,
  },
  finishMultipliers: {
    standard: 1.0,   // AMBOSS Core
    premium:  1.35,  // Mixed
    luxury:   1.8,   // LIIT Core
  },
  addons: {
    smart:     15_000_000, // Smart Home
    eco:       25_000_000, // Solar panels
    landscape: 12_000_000, // Landscaping
    interior:  35_000_000, // Interior design
  },
}

const FINISH_LABELS = {
  standard: 'Estándar',
  premium:  'Premium',
  luxury:   'Vanguardista',
}

const formatCOP = (number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)

export function initSimulator() {
  // ── Form inputs ──────────────────────────────────────
  const projectRadios  = document.querySelectorAll('input[name="projectType"]')
  const finishRadios   = document.querySelectorAll('input[name="finishQuality"]')
  const areaSlider     = document.getElementById('areaSlider')
  const areaDisplay    = document.getElementById('areaDisplay')
  const addonToggles   = document.querySelectorAll('input[type="checkbox"]')

  // ── Multi-step navigation ─────────────────────────────
  const steps         = document.querySelectorAll('.step-container')
  const stepIndicator = document.getElementById('step-indicator')
  const progressBar   = document.getElementById('step-progress-bar')
  const btnPrev       = document.getElementById('prev-btn')
  const btnNext       = document.getElementById('next-btn')

  const totalSteps    = steps.length
  let currentStep     = 0

  function renderStep() {
    stepIndicator.textContent = `Paso ${currentStep + 1} de ${totalSteps}`

    // Progress bar width (mobile UX)
    if (progressBar) {
      progressBar.style.width = `${((currentStep + 1) / totalSteps) * 100}%`
    }

    steps.forEach((step, i) => {
      step.classList.toggle('active-step', i === currentStep)
    })

    btnPrev.style.display = currentStep === 0 ? 'none' : 'inline-block'
    btnNext.style.display = currentStep === totalSteps - 1 ? 'none' : 'inline-block'
  }

  btnNext.addEventListener('click', () => {
    if (currentStep < totalSteps - 1) { currentStep++; renderStep() }
  })

  btnPrev.addEventListener('click', () => {
    if (currentStep > 0) { currentStep--; renderStep() }
  })

  renderStep()

  // ── Summary DOM ───────────────────────────────────────
  const elTotal     = document.getElementById('totalPrice')
  const elProjType  = document.getElementById('summary-project-type')
  const elArea      = document.getElementById('summary-area')
  const elFinish    = document.getElementById('summary-finish')
  const elBaseCost  = document.getElementById('summary-base-cost')
  const elAddonCost = document.getElementById('summary-addons-cost')

  // ── Calculation ───────────────────────────────────────
  function calculate() {
    const type   = document.querySelector('input[name="projectType"]:checked').value
    const finish = document.querySelector('input[name="finishQuality"]:checked').value
    const area   = parseInt(areaSlider.value, 10)

    // Update labels
    elProjType.textContent = type.charAt(0).toUpperCase() + type.slice(1)
    elArea.textContent     = `${area} m²`
    elFinish.textContent   = FINISH_LABELS[finish]

    // Base cost
    const baseCost = area * RATES.baseCostPerSqm[type] * RATES.finishMultipliers[finish]

    // Add-ons
    let addonsCost = 0
    addonToggles.forEach(toggle => {
      if (toggle.checked) {
        const key = toggle.id.split('-')[1] // "addon-smart" → "smart"
        if (RATES.addons[key]) addonsCost += RATES.addons[key]
      }
    })

    const total = baseCost + addonsCost

    elTotal.textContent    = formatCOP(total)
    elBaseCost.textContent = formatCOP(baseCost)
    elAddonCost.textContent= formatCOP(addonsCost)
  }

  // ── Event listeners ───────────────────────────────────
  areaSlider.addEventListener('input', (e) => {
    areaDisplay.textContent = e.target.value
    areaSlider.setAttribute('aria-valuenow', e.target.value)
    calculate()
  })

  projectRadios.forEach(r => r.addEventListener('change', calculate))
  finishRadios.forEach(r  => r.addEventListener('change', calculate))
  addonToggles.forEach(t  => t.addEventListener('change', calculate))

  // Initial calculation
  calculate()
}
