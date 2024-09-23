document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1; // Current step
  let totalSteps = 8; // Total number of steps (including all steps)
  let selectedIssue = ""; // To save the selection from the second step

  let step1Answer = "";
  let step2Answer = "";
  let step3Answer = "";
  let step4Answer = "";
  let step5Answer = "";
  let step6Answer = "";

  // All steps
  const steps = document.querySelectorAll(".content__step");
  const backButton = document.querySelector(".header__back");
  const nextButtons = document.querySelectorAll(".content__step-button");
  const header = document.querySelector(".header");
  const progressBar = document.querySelector(".header__progress");

  // Function to update the progress bar
  function updateProgress() {
    const progressPercent = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  // Function to show the current step
  function showStep(step) {
    steps.forEach((stepElem) => {
      stepElem.classList.add("hidden");
    });
    document.querySelector(`.content__step-${step}`).classList.remove("hidden");

    // Add the header__start class if this is the first step
    if (step === 1) {
      header.classList.add("header__start");
    } else {
      header.classList.remove("header__start");
    }

    // Update progress
    updateProgress();
  }

  // Button click handling
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Do nothing if on the last step
      if (currentStep === totalSteps) {
        return;
      }
      if (currentStep === 1) {
        step1Answer = this.textContent;
      } else if (currentStep === 2) {
        selectedIssue = this.getAttribute("data-value");
        step2Answer = this.textContent;
      } else if (currentStep === 3) {
        step3Answer = this.textContent;
      } else if (currentStep === 4) {
        step4Answer = this.textContent;
      } else if (currentStep === 5) {
        step5Answer = this.textContent;
      } else if (currentStep === 6) {
        step6Answer = this.textContent;
      }

      // If it's the fifth step, move to the sixth, according to the selection
      if (currentStep === 5) {
        document
          .querySelector(`.content__step-${currentStep}`)
          .classList.add("hidden");

        // Hide all blocks of step 6
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
        updateProgress();
        return;
      }

      // Transition from step 6 to 7
      if (currentStep === 6) {
        currentStep = 7;
        showStep(currentStep);
        return;
      }

      // Transition from step 7
      if (currentStep === 7) {
        document.querySelector(".content__step-7").classList.add("hidden");

        // Show loader for 7 seconds
        document
          .querySelector(".content__step-loader")
          .classList.remove("hidden");
        setTimeout(function () {
          document
            .querySelector(".content__step-loader")
            .classList.add("hidden");
          document
            .querySelector(".content__step-last")
            .classList.remove("hidden");
        }, 3000); // 3000 ms = 3 seconds (it was 7000 ms = 7 seconds)
        sendDataToGoogleSheets();
        currentStep = 8;
        updateProgress();
        return;
      }

      // Move to the next step
      currentStep++;
      showStep(currentStep);
    });
  });

  // Handling the "Back" button
  backButton.addEventListener("click", function () {
    if (currentStep > 1) {
      if (currentStep === 6) {
        currentStep = 5;
        showStep(currentStep);
      } else if (currentStep === 7) {
        currentStep = 6;
        updateProgress();

        document.querySelector(`.content__step-7`).classList.add("hidden");
        document.querySelectorAll(".content__step-6").forEach((step) => {
          step.classList.add("hidden");
        });

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

  function sendDataToGoogleSheets() {
    const data = {
      step1: step1Answer,
      step2: step2Answer,
      step3: step3Answer,
      step4: step4Answer,
      step5: step5Answer,
      step6: step6Answer,
    };

    fetch(
      "https://script.google.com/macros/s/AKfycbyrKRW1nlbnrc3pchvGSFdR6LB--g9oECR6iWlcKrQ-ymvcye7H0pVIp0pn_Nork4eR/exec",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Data sent successfully:", result);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  }

  const testimonialDates = document.querySelectorAll(
    ".content__offer-testimonials-dynamic"
  );

  // Function to format the date in DD.MM.YYYY format
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Get today's date
  let currentDate = new Date();

  // Initial index for the testimonial counter
  let commentIndex = 0;

  // Loop through all testimonials and assign them dates
  while (commentIndex < testimonialDates.length) {
    // Random number of comments for the same date (from 2 to 4)
    const commentsForSameDay = Math.floor(Math.random() * 3) + 2; // from 2 to 4

    // Assign the same date for each comment
    for (let i = 0; i < commentsForSameDay; i++) {
      if (commentIndex < testimonialDates.length) {
        testimonialDates[commentIndex].textContent = formatDate(currentDate);
        commentIndex++;
      }
    }

    // Reduce the date by 1 day for the next cycle
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Select all the elements that should contain stars
  const starContainers = document.querySelectorAll(
    ".content__offer-testimonials-stars"
  );

  // SVG star templates
  const filledStar = `
      <svg viewBox="0 0 24 24">
        <path
          fill="#D69E2E"
          d="M23.555,8.729a1.505,1.505,0,0,0-1.406-.98H16.062a.5.5,0,0,1-.472-.334L13.405,1.222a1.5,1.5,0,0,0-2.81,0l-.005.016L8.41,7.415a.5.5,0,0,1-.471.334H1.85A1.5,1.5,0,0,0,.887,10.4l5.184,4.3a.5.5,0,0,1,.155.543L4.048,21.774a1.5,1.5,0,0,0,2.31,1.684l5.346-3.92a.5.5,0,0,1,.591,0l5.344,3.919a1.5,1.5,0,0,0,2.312-1.683l-2.178-6.535a.5.5,0,0,1,.155-.543l5.194-4.306A1.5,1.5,0,0,0,23.555,8.729Z"
        ></path>
      </svg>
    `;

  const emptyStar = `
      <svg viewBox="0 0 24 24">
        <path
          fill="#CBD5E0"
          d="M23.555,8.729a1.505,1.505,0,0,0-1.406-.98H16.062a.5.5,0,0,1-.472-.334L13.405,1.222a1.5,1.5,0,0,0-2.81,0l-.005.016L8.41,7.415a.5.5,0,0,1-.471.334H1.85A1.5,1.5,0,0,0,.887,10.4l5.184,4.3a.5.5,0,0,1,.155.543L4.048,21.774a1.5,1.5,0,0,0,2.31,1.684l5.346-3.92a.5.5,0,0,1,.591,0l5.344,3.919a1.5,1.5,0,0,0,2.312-1.683l-2.178-6.535a.5.5,0,0,1,.155-.543l5.194-4.306A1.5,1.5,0,0,0,23.555,8.729Z"
        ></path>
      </svg>
    `;

  // Function to generate stars
  function generateStars(starCount) {
    let starHTML = "<ul class='content__offer-testimonials-stars'>";

    // Loop through to generate filled stars
    for (let i = 0; i < starCount; i++) {
      starHTML += `<li>${filledStar}</li>`;
    }

    // Loop through to generate empty stars (5 - starCount)
    for (let i = starCount; i < 5; i++) {
      starHTML += `<li>${emptyStar}</li>`;
    }

    starHTML += "</ul>";
    return starHTML;
  }

  // Go through all star containers and insert the correct number of stars
  starContainers.forEach((container) => {
    const starCount = parseInt(container.getAttribute("data-stars"), 10);
    container.innerHTML = generateStars(starCount);
  });

  // Initially show the first step
  showStep(currentStep);
});
