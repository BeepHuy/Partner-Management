// Login Dropdown Logic
const loginBtn = document.getElementById("loginBtn");
const loginDropdown = document.getElementById("loginDropdown");
const loginIcon = document.getElementById("loginIcon");

loginBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isActive = loginDropdown.classList.toggle("active");

  // Rotate icon
  if (isActive) {
    loginIcon.style.transform = "rotate(180deg)";
  } else {
    loginIcon.style.transform = "rotate(0deg)";
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!loginBtn.contains(e.target) && !loginDropdown.contains(e.target)) {
    loginDropdown.classList.remove("active");
    loginIcon.style.transform = "rotate(0deg)";
  }
});

// Form Step Management
let currentStep = 1;
const totalSteps = 5;

const stepNames = {
  1: "Account",
  2: "User",
  3: "Traffic",
  4: "Additional",
  5: "Terms",
};

const stepCompleted = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
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

// Validation Functions
function validateCurrentStep() {
  const currentStepElement = document.querySelector(`#step${currentStep}`);
  const requiredInputs = currentStepElement.querySelectorAll(
    '[data-required="true"]',
  );
  let isValid = true;

  requiredInputs.forEach((input) => {
    const value = input.value.trim();
    input.classList.remove(
      "border-red-500",
      "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
    );

    if (input.type === "checkbox") {
      if (!input.checked) {
        input.classList.add(
          "border-red-500",
          "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
        );
        isValid = false;
      }
    } else if (!value || value === "") {
      input.classList.add(
        "border-red-500",
        "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
      );
      isValid = false;
    }
  });

  return isValid;
}

function validateAllStepsForSubmit() {
  let allErrors = [];

  document.querySelectorAll('[data-required="true"]').forEach((el) => {
    el.classList.remove(
      "border-red-500",
      "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
    );
  });

  for (let stepNum = 1; stepNum <= totalSteps; stepNum++) {
    const stepElement = document.querySelector(`#step${stepNum}`);
    const requiredInputs = stepElement.querySelectorAll(
      '[data-required="true"]',
    );

    requiredInputs.forEach((input) => {
      const value = input.value.trim();
      let errorMessage = null;

      const label = input.closest(".form-group")?.querySelector("label");
      const fieldName = label
        ? label.textContent.replace("*", "").trim()
        : "Field";
      const stepName = stepNames[stepNum];

      if (input.type === "checkbox") {
        if (!input.checked) {
          input.classList.add(
            "border-red-500",
            "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
          );
          errorMessage = {
            field: fieldName,
            message: `You have not agreed to the terms.`,
            step: stepName,
            stepNum: stepNum,
          };
        }
      } else if (!value || value === "") {
        input.classList.add(
          "border-red-500",
          "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
        );
        errorMessage = {
          field: fieldName,
          message: `${fieldName} This field is required.`,
          step: stepName,
          stepNum: stepNum,
        };
      } else {
        if (input.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            input.classList.add(
              "border-red-500",
              "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
            );
            errorMessage = {
              field: fieldName,
              message: `${fieldName} Invalid email format.`,
              step: stepName,
              stepNum: stepNum,
            };
          }
        } else if (
          input.type === "url" ||
          input.name === "companyWebsite" ||
          input.name === "url"
        ) {
          if (!value.startsWith("http://") && !value.startsWith("https://")) {
            input.classList.add(
              "border-red-500",
              "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
            );
            errorMessage = {
              field: fieldName,
              message: `${fieldName} Must start with http:// or https://`,
              step: stepName,
              stepNum: stepNum,
            };
          }
        } else if (input.type === "tel" || input.name === "phone") {
          const phoneRegex = /^[0-9+\-\s()]+$/;
          if (!phoneRegex.test(value)) {
            input.classList.add(
              "border-red-500",
              "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
            );
            errorMessage = {
              field: fieldName,
              message: `${fieldName} This field may contain only numbers and +, -, (, ).`,
              step: stepName,
              stepNum: stepNum,
            };
          } else if (value.replace(/[^0-9]/g, "").length < 10) {
            input.classList.add(
              "border-red-500",
              "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
            );
            errorMessage = {
              field: fieldName,
              message: `${fieldName} Must contain at least 10 digits.`,
              step: stepName,
              stepNum: stepNum,
            };
          }
        } else if (input.type === "password") {
          if (value.length < 6) {
            input.classList.add(
              "border-red-500",
              "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
            );
            errorMessage = {
              field: fieldName,
              message: `${fieldName} Must be at least 6 characters long.`,
              step: stepName,
              stepNum: stepNum,
            };
          }
          if (input.name === "passwordConfirm") {
            const password =
              stepElement.querySelector('[name="password"]').value;
            if (value !== password) {
              input.classList.add(
                "border-red-500",
                "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
              );
              errorMessage = {
                field: fieldName,
                message: `${fieldName} Passwords do not match.`,
                step: stepName,
                stepNum: stepNum,
              };
            }
          }
        } else if (input.name === "emailConfirm") {
          const email = stepElement.querySelector('[name="email"]').value;
          if (value !== email) {
            input.classList.add(
              "border-red-500",
              "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
            );
            errorMessage = {
              field: fieldName,
              message: `${fieldName} Email addresses do not match.`,
              step: stepName,
              stepNum: stepNum,
            };
          }
        } else if (input.name === "zipCode") {
          const zipRegex = /^[0-9]{4,10}$/;
          if (!zipRegex.test(value)) {
            input.classList.add(
              "border-red-500",
              "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
            );
            errorMessage = {
              field: fieldName,
              message: `${fieldName} Only numbers are allowed (4–10 characters).`,
              step: stepName,
              stepNum: stepNum,
            };
          }
        }
      }

      if (errorMessage) {
        allErrors.push(errorMessage);
      }
    });
  }

  return allErrors;
}

function showErrorToasts(errors) {
  NotifyHelper.showErrors(errors, 800);
}

function attachInputListeners() {
  const allInputs = document.querySelectorAll('[data-required="true"]');

  allInputs.forEach((input) => {
    if (input.type === "checkbox") {
      input.addEventListener("change", function () {
        if (this.checked) {
          this.classList.remove(
            "border-red-500",
            "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
          );
        }
      });
    } else {
      input.addEventListener("input", function () {
        if (this.value.trim() !== "") {
          this.classList.remove(
            "border-red-500",
            "shadow-[0_0_6px_rgba(255,77,79,0.6)]",
          );
        }
      });
    }
  });
}

// Navigation Functions
function canNavigateToStep(targetStep) {
  if (targetStep === currentStep) {
    return { allowed: true };
  }

  if (targetStep < currentStep) {
    return { allowed: true, isBackward: true };
  }

  if (!validateCurrentStep()) {
    return { allowed: false, reason: "current" };
  }

  if (targetStep > currentStep + 1) {
    for (let i = currentStep + 1; i < targetStep; i++) {
      if (!stepCompleted[i]) {
        return {
          allowed: false,
          reason: "intermediate",
          incompleteStep: i,
        };
      }
    }
  }

  return { allowed: true, isBackward: false };
}

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

    text.classList.remove("text-white", "text-primary",);

    if (stepNum === currentStep) {
      pill.classList.remove("bg-inputtb", "border-primary/30");
      pill.classList.add("bg-primary", "border-primary");
      text.classList.add("text-white");
      indicator.classList.remove("bg-inputBg", "text-primary");
      indicator.classList.add("bg-white", "text-primary");
      indicator.textContent = stepNum;
    } else if (stepCompleted[stepNum]) {
      pill.classList.remove("bg-primary",);
      pill.classList.add("bg-inputtb",);
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

function nextStep() {
  if (!validateCurrentStep()) {
    return;
  }

  stepCompleted[currentStep] = true;

  const nextStepNum = currentStep + 1;
  if (nextStepNum <= totalSteps) {
    const nextSidebarStep = document.querySelector(
      `.sidebar-step[data-step="${nextStepNum}"]`,
    );
    const nextPill = document.querySelector(
      `.step-pill[data-step="${nextStepNum}"]`,
    );
    const nextNumber = document.querySelector(
      `.step-number[data-step="${nextStepNum}"]`,
    );

    if (nextSidebarStep) nextSidebarStep.classList.remove("warning");
    if (nextPill) nextPill.classList.remove("warning");
    if (nextNumber) nextNumber.classList.remove("warning");
  }

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
  const errors = validateAllStepsForSubmit();

  if (errors.length > 0) {
    currentStep = errors[0].stepNum;
    updateSteps();
    NotifyHelper.showErrors(errors, 800);
    return;
  }

  stepCompleted[currentStep] = true;
  NotifyHelper.registrationSuccess();
}

function handleStepClick(targetStep) {
  if (targetStep === currentStep) return;

  const navCheck = canNavigateToStep(targetStep);

  if (!navCheck.allowed) {
    if (navCheck.reason === "current") {
      return;
    } else if (navCheck.reason === "intermediate") {
      sidebarSteps.forEach((s) => s.classList.remove("warning"));
      stepPills.forEach((p) => p.classList.remove("warning"));
      stepNumbers.forEach((n) => n.classList.remove("warning"));

      const warningSidebarStep = document.querySelector(
        `.sidebar-step[data-step="${navCheck.incompleteStep}"]`,
      );
      const warningPill = document.querySelector(
        `.step-pill[data-step="${navCheck.incompleteStep}"]`,
      );
      const warningNumber = document.querySelector(
        `.step-number[data-step="${navCheck.incompleteStep}"]`,
      );

      if (warningSidebarStep) warningSidebarStep.classList.add("warning");
      if (warningPill) warningPill.classList.add("warning");
      if (warningNumber) warningNumber.classList.add("warning");

      return;
    }
  }

  if (!navCheck.isBackward) {
    stepCompleted[currentStep] = true;
  }

  const targetSidebarStep = document.querySelector(
    `.sidebar-step[data-step="${targetStep}"]`,
  );
  const targetPill = document.querySelector(
    `.step-pill[data-step="${targetStep}"]`,
  );
  const targetNumber = document.querySelector(
    `.step-number[data-step="${targetStep}"]`,
  );

  if (targetSidebarStep) targetSidebarStep.classList.remove("warning");
  if (targetPill) targetPill.classList.remove("warning");
  if (targetNumber) targetNumber.classList.remove("warning");

  currentStep = targetStep;
  updateSteps();
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