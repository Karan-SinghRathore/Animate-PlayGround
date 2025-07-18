function applyAnimation() {
  const css = document.getElementById("cssEditor").value;
  document.getElementById("dynamic-style").innerHTML = css;
}

function resetAnimation() {
  document.getElementById("cssEditor").value = `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

.animated-box {
  width: 100px;
  height: 100px;
  background: #00bcd4;
  animation: bounce 1s infinite;
}`;
  applyAnimation();
}

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast-modern ${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function copyCSS() {
  const css = document.getElementById("cssEditor").value.trim();
  if (!css) return showToast("No CSS to copy!", "warning");

  // Try modern clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(css)
      .then(() => {
        showToast("CSS copied!", "success");
        updateCopyButton();
      })
      .catch(() => {
        fallbackCopyTextToClipboard(css);
      });
  } else {
    // Fallback for older browsers or non-secure contexts
    fallbackCopyTextToClipboard(css);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showToast("CSS copied!", "success");
      updateCopyButton();
    } else {
      showToast("Copy failed", "error");
    }
  } catch (err) {
    showToast("Copy not supported", "error");
  }

  document.body.removeChild(textArea);
}

function updateCopyButton() {
  const copyBtn = document.querySelector(".btn-tertiary");
  if (copyBtn) {
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<span class="btn-icon">✓</span>Copied!';
    copyBtn.style.background = "linear-gradient(135deg, #4ade80, #22c55e)";
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.background = "";
    }, 2000);
  }
}

function saveAnimation() {
  document.getElementById("saveModal").style.display = "flex";
  document.getElementById("saveModal").classList.remove("hidden");
  setTimeout(() => document.getElementById("animationNameInput").focus(), 200);
}

function closeModal() {
  const modal = document.getElementById("saveModal");
  modal.classList.add("hidden");
  modal.style.display = "none";
  document.getElementById("animationNameInput").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  applyAnimation();

  document.getElementById("confirmSave").addEventListener("click", () => {
    const name = document.getElementById("animationNameInput").value.trim();
    const css = document.getElementById("cssEditor").value.trim();

    if (!name) return showToast("Please enter a name!", "warning");
    if (!css) return showToast("Write some CSS first!", "warning");

    const animation = {
      id: Date.now(),
      name,
      css,
      html: '<div class="animated-box"></div>',
      createdAt: new Date().toISOString(),
    };

    const saved = JSON.parse(localStorage.getItem("animations") || "[]");
    saved.push(animation);
    localStorage.setItem("animations", JSON.stringify(saved));

    closeModal();
    showToast(`"${name}" saved!`, "success");
  });

  document.getElementById("cancelSave").addEventListener("click", closeModal);
  document.getElementById("closeModal").addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      !document.getElementById("saveModal").classList.contains("hidden")
    ) {
      closeModal();
    }
  });
});
