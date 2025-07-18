// Coffee modal functionality
document.addEventListener("DOMContentLoaded", () => {
  const coffeeBtn = document.getElementById("coffeeBtn");
  const coffeeModal = document.getElementById("coffeeModal");
  const coffeeClose = document.getElementById("coffeeClose");

  if (!coffeeBtn || !coffeeModal || !coffeeClose) return;

  coffeeBtn.addEventListener("click", () => {
    coffeeModal.classList.remove("hidden");
    setTimeout(() => coffeeModal.classList.add("show"), 10);

    // Track interaction (you can add analytics here)
    if (typeof gtag !== "undefined") {
      gtag("event", "coffee_modal_opened", {
        event_category: "engagement",
        event_label: "support",
      });
    }
  });

  coffeeClose.addEventListener("click", closeCoffeeModal);

  coffeeModal.addEventListener("click", (e) => {
    if (e.target === coffeeModal) {
      closeCoffeeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !coffeeModal.classList.contains("hidden")) {
      closeCoffeeModal();
    }
  });

  function closeCoffeeModal() {
    coffeeModal.classList.remove("show");
    setTimeout(() => coffeeModal.classList.add("hidden"), 300);
  }

  // Track clicks on support links
  document.querySelectorAll(".coffee-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const platform = e.currentTarget.textContent.trim().toLowerCase();

      // Track conversion (you can add analytics here)
      if (typeof gtag !== "undefined") {
        gtag("event", "support_click", {
          event_category: "conversion",
          event_label: platform,
        });
      }

      // Show thank you message
      setTimeout(() => {
        if (!coffeeModal.classList.contains("hidden")) {
          const thankYouMsg = document.createElement("div");
          thankYouMsg.innerHTML = "🎉 Thank you for your support!";
          thankYouMsg.style.cssText = `
            position: fixed;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #4caf50, #66bb6a);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            z-index: 10001;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
          `;
          document.body.appendChild(thankYouMsg);

          setTimeout(() => {
            thankYouMsg.remove();
            closeCoffeeModal();
          }, 3000);
        }
      }, 1000);
    });
  });

  // Show coffee button after some time (optional - for better conversion)
  setTimeout(() => {
    if (coffeeBtn) {
      coffeeBtn.style.animation =
        "coffeeFloat 3s ease-in-out infinite, coffeePulse 1s ease-in-out 3";
    }
  }, 30000); // Show attention-grabbing animation after 30 seconds
});

// Add pulse animation for attention
const pulseKeyframes = `
  @keyframes coffeePulse {
    0%, 100% { box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4); }
    50% { box-shadow: 0 4px 30px rgba(255, 107, 53, 0.8), 0 0 0 10px rgba(255, 107, 53, 0.1); }
  }
`;

// Inject pulse animation
if (!document.getElementById("coffee-pulse-styles")) {
  const style = document.createElement("style");
  style.id = "coffee-pulse-styles";
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}
