const SIMULATOR_RATES = {
    baseCostPerSqm: {
        residencial: 2500000, // COP por m2
        comercial: 2200000,
        industrial: 1800000
    },
    finishMultipliers: {
        standard: 1.0,  // Base AMBOSS
        premium: 1.35,  // Mezcla
        luxury: 1.8     // High-end LIIT
    },
    addons: {
        smart: 15000000,      // Costo fijo base estimado
        eco: 25000000,        // Paneles solares
        landscape: 12000000,  // Paisajismo
        interior: 35000000    // Diseño Interior completo
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Select Elements
    const projectRadios = document.querySelectorAll('input[name="projectType"]');
    const finishRadios = document.querySelectorAll('input[name="finishQuality"]');
    const areaSlider = document.getElementById('areaSlider');
    const areaDisplay = document.getElementById('areaDisplay');
    const addonToggles = document.querySelectorAll('input[type="checkbox"]');

    // Multi-Step Navigation Elements
    const steps = document.querySelectorAll('.step-container');
    const stepIndicator = document.getElementById('step-indicator');
    const btnPrev = document.getElementById('prev-btn');
    const btnNext = document.getElementById('next-btn');

    let currentStep = 0; // Index based, 0 relates to step 1
    const totalSteps = steps.length;

    // Render Step Function
    function renderStep() {
        // Update Indicator
        stepIndicator.textContent = `Paso ${currentStep + 1} de ${totalSteps}`;

        // Toggle Step Visibility
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active-step');
            } else {
                step.classList.remove('active-step');
            }
        });

        // Toggle Buttons
        btnPrev.style.display = currentStep === 0 ? 'none' : 'inline-block';

        if (currentStep === totalSteps - 1) {
            btnNext.style.display = 'none'; // Reached the end
        } else {
            btnNext.style.display = 'inline-block';
        }
    }

    // Binding Navigations
    btnNext.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            renderStep();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderStep();
        }
    });

    // Init rendering specifically for Navigation
    renderStep();

    // Summary Elements
    const elTotalPrice = document.getElementById('totalPrice');
    const elSumProjectType = document.getElementById('summary-project-type');
    const elSumArea = document.getElementById('summary-area');
    const elSumFinish = document.getElementById('summary-finish');
    const elSumBaseCost = document.getElementById('summary-base-cost');
    const elSumAddonsCost = document.getElementById('summary-addons-cost');

    // Utility Format Currency (COP)
    const formatCOP = (number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    // Calculate Function
    function calculateEstimate() {
        // 1. Get Values
        const selectedType = document.querySelector('input[name="projectType"]:checked').value;
        const selectedFinish = document.querySelector('input[name="finishQuality"]:checked').value;
        const areaStr = areaSlider.value;
        const area = parseInt(areaStr, 10);

        // Update Labels (Capitalized)
        elSumProjectType.textContent = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
        elSumArea.textContent = `${areaStr} m²`;

        switch (selectedFinish) {
            case 'standard': elSumFinish.textContent = 'Estándar'; break;
            case 'premium': elSumFinish.textContent = 'Premium'; break;
            case 'luxury': elSumFinish.textContent = 'Vanguardista'; break;
        }

        // 2. Base Construction Cost Calculation
        const rateSqm = SIMULATOR_RATES.baseCostPerSqm[selectedType];
        const finishMultiplier = SIMULATOR_RATES.finishMultipliers[selectedFinish];

        const baseConstructionCost = area * rateSqm * finishMultiplier;

        // 3. Add-ons Calculation
        let addonsCost = 0;
        addonToggles.forEach(toggle => {
            if (toggle.checked) {
                // Determine which addon it is by ID
                const id = toggle.id.split('-')[1]; // e.g. "addon-smart" -> "smart"
                if (SIMULATOR_RATES.addons[id]) {
                    addonsCost += SIMULATOR_RATES.addons[id];
                }
            }
        });

        // 4. Total and DOM Updates
        const totalCost = baseConstructionCost + addonsCost;

        elTotalPrice.textContent = formatCOP(totalCost);
        elSumBaseCost.textContent = formatCOP(baseConstructionCost);
        elSumAddonsCost.textContent = formatCOP(addonsCost);
    }

    // Event Listeners
    areaSlider.addEventListener('input', (e) => {
        areaDisplay.textContent = e.target.value;
        calculateEstimate();
    });

    projectRadios.forEach(radio => radio.addEventListener('change', calculateEstimate));
    finishRadios.forEach(radio => radio.addEventListener('change', calculateEstimate));
    addonToggles.forEach(toggle => toggle.addEventListener('change', calculateEstimate));

    // Initial Calculation Build
    calculateEstimate();
});
