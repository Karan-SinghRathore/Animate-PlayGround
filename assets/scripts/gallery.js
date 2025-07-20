function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast-modern ${type}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  
  const container = document.getElementById("particles");
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.width = particle.style.height = Math.random() * 4 + 2 + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 20 + "s";
    container.appendChild(particle);
  }

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  const theme = localStorage.getItem("theme") || "dark";
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.textContent = "☀️";
  }
  themeToggle.onclick = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    themeToggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    localStorage.setItem("theme", newTheme);
  };

  // Copy functionality
  function copyToClipboard(text, btn) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast("CSS copied!", "success");
          updateButtonFeedback(btn);
        })
        .catch(() => {
          fallbackCopy(text, btn);
        });
    } else {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        showToast("CSS copied!", "success");
        updateButtonFeedback(btn);
      } else {
        showToast("Copy failed", "error");
      }
    } catch (err) {
      showToast("Copy not supported", "error");
    }

    document.body.removeChild(textArea);
  }

  function updateButtonFeedback(btn) {
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">✓</span>Copied!';
    btn.style.background = "linear-gradient(135deg, #4ade80, #22c55e)";
    setTimeout(() => {
      btn.innerHTML = originalHtml;
      btn.style.background = "";
    }, 2000);
  }

  function initCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        const codeElement = document.getElementById(targetId);
        if (!codeElement) {
          showToast("Code element not found", "error");
          return;
        }

        const code = codeElement.textContent.trim();
        copyToClipboard(code, btn);
      });
    });
  }

  initCopyButtons();

  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll(".animation-card").forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? "block" : "none";
    });
    clearSearch.style.display = query ? "block" : "none";
  });

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    document
      .querySelectorAll(".animation-card")
      .forEach((card) => (card.style.display = "block"));
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.category;
      document.querySelectorAll(".animation-card").forEach((card) => {
        card.style.display =
          category === "all" || card.dataset.category === category
            ? "block"
            : "none";
      });
    });
  });

  document.querySelectorAll(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("favorited");
      btn.querySelector(".btn-icon").textContent = btn.classList.contains(
        "favorited",
      )
        ? "❤️"
        : "🤍";
    });
  });

  // Load saved animations
  const saved = JSON.parse(localStorage.getItem("animations") || "[]");
  const container = document.getElementById("savedAnimations");
  document.getElementById("savedCount").textContent = saved.length;

  if (saved.length > 0) {
    container.innerHTML = "";
    saved.forEach((anim, i) => {
      const card = document.createElement("div");
      card.className = "animation-card glass-card";
      card.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${anim.name}</h3>
          <button class="control-btn" onclick="deleteAnimation(${anim.id})">🗑</button>
        </div>
        <div class="preview-area">
          <div class="preview-stage">${anim.html}</div>
        </div>
        <div class="code-section">
          <pre class="code-block" id="saved-${i}">${anim.css}</pre>
        </div>
        <div class="card-actions">
          <button class="copy-btn" data-target="saved-${i}">Copy Code</button>
        </div>
      `;
      const style = document.createElement("style");
      style.textContent = anim.css;
      card.appendChild(style);
      container.appendChild(card);

      const copyBtn = card.querySelector(".copy-btn");
      copyBtn.addEventListener("click", () => {
        copyToClipboard(anim.css, copyBtn);
      });
    });

  
    initCopyButtons();
  }
});

function deleteAnimation(id) {
  if (!confirm("Are you sure you want to delete this animation?")) {
    return;
  }

  let saved = JSON.parse(localStorage.getItem("animations") || "[]");
  const originalLength = saved.length;
  saved = saved.filter((anim) => anim.id !== id);

  if (saved.length < originalLength) {
    localStorage.setItem("animations", JSON.stringify(saved));
    showToast("Animation deleted!", "success");
    setTimeout(() => location.reload(), 1000);
  } else {
    showToast("Animation not found", "error");
  }
}
