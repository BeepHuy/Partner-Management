// Login Dropdown Logic
const loginBtn = document.getElementById("loginBtn");
const loginDropdown = document.getElementById("loginDropdown");
const loginIcon = document.getElementById("loginIcon");

loginBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isActive = loginDropdown.classList.toggle("active");
  loginIcon.style.transform = isActive ? "rotate(180deg)" : "rotate(0deg)";
});

document.addEventListener("click", (e) => {
  if (!loginBtn.contains(e.target) && !loginDropdown.contains(e.target)) {
    loginDropdown.classList.remove("active");
    loginIcon.style.transform = "rotate(0deg)";
  }
});

// FORM VALIDATION ENGINE

// Quy tắc validation
const ValidationRules = {
  email: {
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Invalid email address",
  },
  url: {
    test: (value) =>
      value.startsWith("http://") || value.startsWith("https://"),
    message: "The URL must start with http:// or https://",
  },
  phone: {
    test: (value) => {
      if (!/^[0-9+\-\s()]+$/.test(value)) return false;
      return value.replace(/[^0-9]/g, "").length >= 10;
    },
    message:
      "The phone number must contain at least 10 digits and only include numbers, +, -, (, )",
  },
  password: {
    test: (value) => value.length >= 6,
    message: "The password must be at least 6 characters long",
  },
  zipCode: {
    test: (value) => /^[0-9]{4,10}$/.test(value),
    message: "ZIP code must be 4–10 digits long",
  },
};

// Validate một input đơn lẻ
function validateInput(input) {
  const value = input.value.trim();
  const fieldName = getFieldName(input);

  clearInputError(input);

  // Check checkbox
  if (input.type === "checkbox") {
    if (!input.checked) {
      setInputError(input);
      return { valid: false, message: `You must agree to the terms and conditions` };
    }
    return { valid: true };
  }

  // Check required
  if (!value) {
    setInputError(input);
    return { valid: false, message: `${fieldName} is required` };
  }

  // Check email
  if (
    input.type === "email" ||
    input.name === "email" ||
    input.name === "emailConfirm" ||
    input.name === "billingEmail"
  ) {
    if (!ValidationRules.email.test(value)) {
      setInputError(input);
      return {
        valid: false,
        message: `${fieldName}: ${ValidationRules.email.message}`,
      };
    }
  }

  // Check URL
  if (
    input.type === "url" ||
    input.name === "website" ||
    input.name === "landingPage"
  ) {
    if (!ValidationRules.url.test(value)) {
      setInputError(input);
      return {
        valid: false,
        message: `${fieldName}: ${ValidationRules.url.message}`,
      };
    }
  }

  // Check phone
  if (
    input.type === "tel" ||
    input.name === "phone" ||
    input.name === "billingPhone"
  ) {
    if (!ValidationRules.phone.test(value)) {
      setInputError(input);
      return {
        valid: false,
        message: `${fieldName}: ${ValidationRules.phone.message}`,
      };
    }
  }

  // Check password
  if (input.type === "password") {
    if (!ValidationRules.password.test(value)) {
      setInputError(input);
      return {
        valid: false,
        message: `${fieldName}: ${ValidationRules.password.message}`,
      };
    }
  }

  // Check zipCode
  if (input.name === "zipCode") {
    if (!ValidationRules.zipCode.test(value)) {
      setInputError(input);
      return {
        valid: false,
        message: `${fieldName}: ${ValidationRules.zipCode.message}`,
      };
    }
  }

  // Check match fields
  const stepElement = input.closest(".form-step");

  if (input.name === "emailConfirm") {
    const email = stepElement.querySelector('[name="email"]').value;
    if (value !== email) {
      setInputError(input);
      return { valid: false, message: `${fieldName}: Email confirmation does not match` };
    }
  }

  if (input.name === "passwordConfirm") {
    const password = stepElement.querySelector('[name="password"]').value;
    if (value !== password) {
      setInputError(input);
      return { valid: false, message: `Password confirmation does not match` };
    }
  }

  return { valid: true };
}

// Validate step hiện tại
function validateCurrentStep() {
  const currentStepElement = document.querySelector(`#step${currentStep}`);
  const requiredInputs = currentStepElement.querySelectorAll(
    '[data-required="true"]',
  );
  const errors = [];

  requiredInputs.forEach((input) => {
    const result = validateInput(input);
    if (!result.valid) {
      errors.push({
        field: getFieldName(input),
        message: result.message,
        step: stepNames[currentStep],
        stepNum: currentStep,
      });
    }
  });

  return errors;
}

// Validate toàn bộ form
function validateAllSteps() {
  const allErrors = [];

  // Clear tất cả error states
  document.querySelectorAll('[data-required="true"]').forEach((el) => {
    clearInputError(el);
  });

  for (let stepNum = 1; stepNum <= totalSteps; stepNum++) {
    const stepElement = document.querySelector(`#step${stepNum}`);
    const requiredInputs = stepElement.querySelectorAll(
      '[data-required="true"]',
    );

    requiredInputs.forEach((input) => {
      const result = validateInput(input);
      if (!result.valid) {
        allErrors.push({
          field: getFieldName(input),
          message: result.message,
          step: stepNames[stepNum],
          stepNum: stepNum,
        });
      }
    });
  }

  return allErrors;
}

// Helper functions
function getFieldName(input) {
  const label = input.closest(".form-group")?.querySelector("label");
  return label ? label.textContent.replace("*", "").trim() : "Trường này";
}

function setInputError(input) {
  input.classList.add("border-red-500", "shadow-[0_0_6px_rgba(255,77,79,0.6)]");
}

function clearInputError(input) {
  input.classList.remove(
    "border-red-500",
    "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
  );
}

// Attach listeners để clear error khi user nhập
function attachInputListeners() {
  const allInputs = document.querySelectorAll('[data-required="true"]');

  allInputs.forEach((input) => {
    const eventType = input.type === "checkbox" ? "change" : "input";

    input.addEventListener(eventType, function () {
      if (this.type === "checkbox") {
        if (this.checked) clearInputError(this);
      } else {
        if (this.value.trim() !== "") clearInputError(this);
      }
    });
  });
}

// FORM STEP MANAGEMENT

let currentStep = 1;
const totalSteps = 4;

const stepNames = {
  1: "General",
  2: "Company",
  3: "Billing",
  4: "Campaign",
};

const stepCompleted = {
  1: false,
  2: false,
  3: false,
  4: false,
};

// DOM Elements
const steps = document.querySelectorAll(".form-step");
const sidebarSteps = document.querySelectorAll(".sidebar-step");
const stepPills = document.querySelectorAll(".step-pill");
const stepNumbers = document.querySelectorAll(".step-number");
const background = document.getElementById("stepBackground");
const progressFill = document.getElementById("progressFill");
const currentStepText = document.getElementById("currentStepText");
const currentStepName = document.getElementById("currentStepName");

// Navigation Functions
function nextStep() {
  const errors = validateCurrentStep();

  if (errors.length > 0) {
    NotifyHelper.showErrors(errors, 800);
    return;
  }

  stepCompleted[currentStep] = true;

  if (currentStep < totalSteps) {
    currentStep++;
    updateSteps();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateSteps();
  }
}

function submitForm() {
  const errors = validateAllSteps();

  if (errors.length > 0) {
    // Jump to first error step
    currentStep = errors[0].stepNum;
    updateSteps();
    NotifyHelper.showErrors(errors, 800);
    return;
  }

  stepCompleted[currentStep] = true;
  NotifyHelper.registrationSuccess();
}

// Step Click Handler
function handleStepClick(targetStep) {
  if (targetStep === currentStep) return;

  // Allow backward navigation
  if (targetStep < currentStep) {
    currentStep = targetStep;
    updateSteps();
    return;
  }

  // Forward navigation - validate current step first
  const errors = validateCurrentStep();
  if (errors.length > 0) {
    NotifyHelper.showErrors(errors, 800);
    return;
  }

  // Check if intermediate steps are completed
  for (let i = currentStep + 1; i < targetStep; i++) {
    if (!stepCompleted[i]) {
      NotifyHelper.error(
        `Please complete Step ${i}: ${stepNames[i]} before proceeding`,
      );
      return;
    }
  }

  stepCompleted[currentStep] = true;
  currentStep = targetStep;
  updateSteps();
}

// Update UI
function updateSteps() {
  // Update form steps visibility
  steps.forEach((step, index) => {
    const stepNum = index + 1;
    if (stepNum === currentStep) {
      step.classList.remove("absolute", "opacity-0", "pointer-events-none");
      step.classList.add("opacity-100", "pointer-events-auto");
    } else {
      step.classList.add("absolute", "opacity-0", "pointer-events-none");
      step.classList.remove("opacity-100", "pointer-events-auto");
    }
  });

  // Update sidebar steps
  sidebarSteps.forEach((step, index) => {
    const stepNum = index + 1;
    const indicator = step.querySelector(".step-indicator");

    if (stepNum === currentStep) {
      step.classList.remove("text-black");
      step.classList.add("text-white");
      indicator.classList.remove("bg-[#D9D9D9]");
      indicator.classList.add(
        "bg-bgictich",
        "shadow-[0_0_10px_rgba(0,38,93,0.3)]",
      );
    } else if (stepCompleted[stepNum]) {
      step.classList.add("text-black");
      step.classList.remove("text-white");
      indicator.classList.remove("bg-[#D9D9D9]");
      indicator.classList.add("bg-bgictich");
      indicator.innerHTML = "✓";
    } else {
      step.classList.add("text-black");
      step.classList.remove("text-white");
      indicator.classList.add("bg-[#D9D9D9]");
      indicator.classList.remove(
        "bg-primary",
        "shadow-[0_0_10px_rgba(0,38,93,0.3)]",
      );
      indicator.innerHTML = "";
    }
  });

  // Update step pills
  stepPills.forEach((pill, index) => {
    const stepNum = index + 1;
    const indicator = pill.querySelector(".pill-indicator");
    const text = pill.querySelector(".pill-text");

    text.classList.remove("text-white", "text-primary");

    if (stepNum === currentStep) {
      pill.classList.remove("bg-inputtb", "border-primary/30");
      pill.classList.add("bg-primary", "border-primary");
      text.classList.add("text-white");
      indicator.classList.remove("bg-inputBg", "text-primary");
      indicator.classList.add("bg-white", "text-primary");
      indicator.textContent = stepNum;
    } else if (stepCompleted[stepNum]) {
      pill.classList.remove("bg-primary");
      pill.classList.add("bg-inputtb");
      indicator.classList.remove("bg-inputBg");
      indicator.classList.add("bg-bgictich", "text-white");
      indicator.textContent = "✓";
    } else {
      pill.classList.remove("bg-primary", "border-primary");
      pill.classList.add("bg-inputtb", "border-primary/30");
      indicator.classList.add("bg-inputBg", "text-primary");
      indicator.classList.remove("bg-primary", "bg-white");
      indicator.textContent = stepNum;
    }
  });

  // Update step numbers
  stepNumbers.forEach((num, index) => {
    const stepNum = index + 1;

    if (stepNum === currentStep) {
      num.classList.remove(
        "bg-transparent",
        "border-primary/30",
        "text-primary",
      );
      num.classList.add("bg-primary", "border-primary", "text-white");
      num.textContent = stepNum;
    } else if (stepCompleted[stepNum]) {
      num.classList.remove("bg-primary", "text-white");
      num.classList.add("bg-transparent", "border-primary", "text-primary");
      num.textContent = "✓";
    } else {
      num.classList.remove("bg-primary", "border-primary", "text-white");
      num.classList.add("bg-transparent", "border-primary/30", "text-primary");
      num.textContent = stepNum;
    }
  });

  // Update progress bar
  const progress = (currentStep / totalSteps) * 100;
  progressFill.style.width = `${progress}%`;

  // Update step text
  currentStepText.textContent = currentStep;
  currentStepName.textContent = stepNames[currentStep];

  // Move background
  moveBackground();
}

function moveBackground() {
  const currentStepElement = document.querySelector(
    `.sidebar-step[data-step="${currentStep}"]`,
  );
  if (currentStepElement && background) {
    background.style.transform = `translateY(${currentStepElement.offsetTop}px)`;
  }
}

// Progress Visibility Management
function updateProgressVisibility() {
  const progressSection = document.getElementById("progressSection");
  const stepPillsContainer = document.getElementById("stepPills");
  const stepNumbersContainer = document.getElementById("stepNumbers");

  if (window.innerWidth < 1024) {
    progressSection.classList.remove("hidden");
    progressSection.classList.add("block");

    if (window.innerWidth < 768) {
      stepPillsContainer.classList.add("hidden");
      stepNumbersContainer.classList.remove("hidden");
      stepNumbersContainer.classList.add("flex");
    } else {
      stepPillsContainer.classList.remove("hidden");
      stepPillsContainer.classList.add("flex");
      stepNumbersContainer.classList.add("hidden");
      stepNumbersContainer.classList.remove("flex");
    }
  } else {
    progressSection.classList.add("hidden");
    progressSection.classList.remove("block");
  }
}

// Event Listeners
sidebarSteps.forEach((step) => {
  step.addEventListener("click", () => {
    const targetStep = parseInt(step.dataset.step, 10);
    handleStepClick(targetStep);
  });
});

stepPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const targetStep = parseInt(pill.dataset.step, 10);
    handleStepClick(targetStep);
  });
});

stepNumbers.forEach((num) => {
  num.addEventListener("click", () => {
    const targetStep = parseInt(num.dataset.step, 10);
    handleStepClick(targetStep);
  });
});

// Initialize
attachInputListeners();
updateSteps();
updateProgressVisibility();

window.addEventListener("resize", () => {
  moveBackground();
  updateProgressVisibility();
});
