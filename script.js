document.addEventListener("DOMContentLoaded", () => {
  const artPieces = document.querySelectorAll(".art-piece");
  const modal = document.getElementById("story-modal");
  const storyText = document.getElementById("story-text");
  const closeButton = document.querySelector(".close-button");

  // Function to show modal
  function showModal(story) {
    storyText.textContent = story;
    modal.classList.add("active");
    closeButton.focus();

    // Trap focus within modal
    const focusableElements = modal.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    modal.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Function to hide modal
  function hideModal() {
    modal.classList.remove("active");
    // Return focus to the last focused art piece
    if (lastFocusedArtPiece) {
      lastFocusedArtPiece.focus();
    }
  }

  let lastFocusedArtPiece = null;

  // Function to handle block deactivation
  function deactivateBlock(piece) {
    piece.classList.remove("active");
    piece.blur(); // Remove focus
  }

  // Event listeners for art pieces
  artPieces.forEach((piece, index) => {
    // Click handler for first block only
    if (index === 0) {
      piece.addEventListener("click", () => {
        lastFocusedArtPiece = piece;
        const story = piece.getAttribute("data-story");
        piece.classList.toggle("active");
        if (piece.classList.contains("active")) {
          showModal(story);
        } else {
          hideModal();
        }
      });
    }
    // Space/Enter handler for second block only
    else if (index === 1) {
      piece.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          lastFocusedArtPiece = piece;
          const story = piece.getAttribute("data-story");
          piece.classList.toggle("active");
          if (piece.classList.contains("active")) {
            showModal(story);
          } else {
            hideModal();
          }
        }
      });
    }
    // Block 3: Tab + 'o' key to reveal with horizontal slide
    else if (index === 2) {
      piece.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "o") {
          e.preventDefault();
          lastFocusedArtPiece = piece;
          const story = piece.getAttribute("data-story");
          piece.classList.add("active");
          showModal(story);
        }
      });

      // Handle closing for block 3
      piece.addEventListener("click", () => {
        if (piece.classList.contains("active")) {
          piece.classList.remove("active");
          hideModal();
        }
      });
    }
    // Block 4: Double click to reveal with vertical slide
    else if (index === 3) {
      let clickTimeout;
      let isDoubleClick = false;

      piece.addEventListener("click", () => {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          if (!isDoubleClick) {
            // Single click - do nothing
            isDoubleClick = false;
          }
        }, 250);
      });

      piece.addEventListener("dblclick", () => {
        isDoubleClick = true;
        lastFocusedArtPiece = piece;
        const story = piece.getAttribute("data-story");
        piece.classList.toggle("active");
        if (piece.classList.contains("active")) {
          showModal(story);
        } else {
          hideModal();
        }
      });

      // Handle closing for block 4
      piece.addEventListener("click", () => {
        if (piece.classList.contains("active") && !isDoubleClick) {
          piece.classList.remove("active");
          hideModal();
        }
      });
    }

    // Handle mouse leave for all blocks
    piece.addEventListener("mouseleave", () => {
      if (!piece.classList.contains("active")) {
        piece.blur();
      }
    });
  });

  // Close modal with button
  closeButton.addEventListener("click", () => {
    hideModal();
    if (lastFocusedArtPiece) {
      deactivateBlock(lastFocusedArtPiece);
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      hideModal();
      if (lastFocusedArtPiece) {
        deactivateBlock(lastFocusedArtPiece);
      }
    }
  });

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
      if (lastFocusedArtPiece) {
        deactivateBlock(lastFocusedArtPiece);
      }
    }
  });
});
