document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1; // Current step
  let selectedIssue = ""; // Storing the selection from the second step

  // All steps
  const steps = document.querySelectorAll(".content__step");
  const backButton = document.querySelector(".header__back");
  const nextButtons = document.querySelectorAll(".content__step-button");
  const header = document.querySelector(".header");

  // Show the current step
  function showStep(step) {
    steps.forEach((stepElem) => {
      stepElem.classList.add("hidden");
    });
    document.querySelector(`.content__step-${step}`).classList.remove("hidden");

    // Add the header__start class if it is the first step
    if (step === 1) {
      header.classList.add("header__start");
    } else {
      header.classList.remove("header__start");
    }
  }

  // Handle button clicks
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Check if we are on the last step
      if (currentStep === 8) {
        // Do nothing if we are on the last step
        return;
      }

      // If we are on the second step, save the selection
      if (currentStep === 2) {
        selectedIssue = this.getAttribute("data-value");
      }

      // If we are on step 5 and need to move to step 6, show the corresponding block
      if (currentStep === 5) {
        // Hide the current step 5
        document
          .querySelector(`.content__step-${currentStep}`)
          .classList.add("hidden");

        // First, hide all blocks of step 6
        document.querySelectorAll(".content__step-6").forEach((step) => {
          step.classList.add("hidden");
        });

        // Show the corresponding block for the selected issue (pain, itching, swelling, bleeding)
        if (selectedIssue) {
          document
            .querySelector(`[data-step="${selectedIssue}"]`)
            .classList.remove("hidden");
        }

        currentStep = 6;
        return;
      }

      // If clicking on step 6, move to step 7
      if (currentStep === 6) {
        currentStep = 7;
        showStep(currentStep);
        return;
      }

      // If clicking on step 7
      if (currentStep === 7) {
        // Hide step 7
        document.querySelector(".content__step-7").classList.add("hidden");

        // Show loader for 7 seconds
        document
          .querySelector(".content__step-loader")
          .classList.remove("hidden");
        setTimeout(function () {
          // After 7 seconds, hide the loader and show the final step
          document
            .querySelector(".content__step-loader")
            .classList.add("hidden");
          document
            .querySelector(".content__step-last")
            .classList.remove("hidden");
        }, 5000); // 7000 milliseconds = 7 seconds
        currentStep = 8;
        return;
      }

      // Move to the next step
      currentStep++;
      showStep(currentStep);
    });
  });

  // Handle the back button
  backButton.addEventListener("click", function () {
    if (currentStep > 1) {
      // If we are on step 6, go back to step 5
      if (currentStep === 6) {
        currentStep = 5;
        showStep(currentStep);
      } else if (currentStep === 7) {
        // If we are on step 7 and click "back", go back to step 6
        currentStep = 6;
        document.querySelector(`.content__step-7`).classList.add("hidden");
        // First, hide all blocks of step 6
        document.querySelectorAll(".content__step-6").forEach((step) => {
          step.classList.add("hidden");
        });

        // Show the corresponding block for the selected issue (pain, itching, swelling, bleeding)
        if (selectedIssue) {
          document
            .querySelector(`[data-step="${selectedIssue}"]`)
            .classList.remove("hidden");
        }
      } else {
        currentStep--;
        showStep(currentStep);
      }
    }
  });

  // Initially show the first step
  showStep(currentStep);
});
