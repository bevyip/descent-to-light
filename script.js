// Initialize variables
let body, dood, forest;
let lastFocusedArtPiece = null;
let bgSound = new Audio("sound/nature.mp3");

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize element references for nature scene
  body = document.querySelector("body");
  dood = document.getElementById("dood");
  forest = document.querySelector("div#forest");

  // Initialize nature scene if elements exist
  if (dood && forest) {
    init();
    // Add event listeners
    window.addEventListener("resize", init, false);

    // Add scroll event listener
    window.addEventListener("wheel", (e) => {
      // Check if scrolling down (positive deltaY means scrolling down)
      if (e.deltaY > 0) {
        updateForest();
        dood.update(getCss(15, false));
      }
    });

    window.addEventListener("mousemove", (e) => {
      if(bgSound.paused) {
        bgSound.play();
      }
    });
  }

  // bgSound.play();

  // Initialize art pieces and modal if they exist
  const artPieces = document.querySelectorAll(".art-piece");
  const modal = document.getElementById("story-modal");
  const storyText = document.getElementById("story-text");
  const closeButton = document.querySelector(".close-button");

  if (artPieces.length && modal && storyText && closeButton) {
    initializeArtPieces(artPieces, modal, storyText, closeButton);
  }
});

// Function to initialize art pieces and modal
function initializeArtPieces(artPieces, modal, storyText, closeButton) {
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
}

// Helper functions for nature scene
function init() {
  if (dood) dood.update(getCss(15, false));
  if (forest) updateForest();
}

function updateForest() {
  let wid = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  let density = Math.floor(wid / 10);

  // If forest is empty, create initial trees
  if (forest.children.length === 0) {
    createInitialForest(density);
  } else {
    // Update existing trees with new positions and heights
    updateExistingTrees(density);
  }
}

function createInitialForest(density) {
  forest.innerHTML = "";
  let min = -20;
  let max = 120;

  for (let i = 0; i < density; i++) {
    let pos = Math.random() * (max - min + 1) + min;
    let hei = getRandomIntInclusive(5, 250);
    forest.appendChild(generateTree(hei, pos));
  }
}

function updateExistingTrees(targetDensity) {
  let min = -20;
  let max = 120;
  let currentTrees = Array.from(forest.children);

  // Update existing trees with new positions and heights
  currentTrees.forEach((tree) => {
    let newPos = Math.random() * (max - min + 1) + min;
    let newHeight = getRandomIntInclusive(5, 250);

    // Apply smooth transitions
    tree.style.transition = "all 0.7s ease";
    tree.style.left = `${newPos}%`;
    tree.querySelector(".tree__4").style.height = `${newHeight}px`;

    // Randomly adjust tree parts sizes
    let parts = tree.querySelectorAll('[class^="tree__"]');
    parts.forEach((part) => {
      if (part.className !== "tree__4") {
        let scale = 0.8 + Math.random() * 0.4; // Random scale between 0.8 and 1.2
        part.style.transform = `scale(${scale})`;
        part.style.transition = "all 0.7s ease";
      }
    });
  });

  // Adjust forest density if needed
  if (currentTrees.length < targetDensity) {
    // Add new trees
    for (let i = currentTrees.length; i < targetDensity; i++) {
      let pos = Math.random() * (max - min + 1) + min;
      let hei = getRandomIntInclusive(5, 250);
      forest.appendChild(generateTree(hei, pos));
    }
  } else if (currentTrees.length > targetDensity) {
    // Remove excess trees
    for (let i = currentTrees.length - 1; i >= targetDensity; i--) {
      forest.removeChild(currentTrees[i]);
    }
  }
}

function generateTree(height, position) {
  let template = `
        <div class="tree__5"></div>
        <div class="tree__1"></div>
        <div class="tree__2"></div>
        <div class="tree__3"></div>
        <div class="tree__4" style="height:${height}px"></div>
    `;
  let el = document.createElement("div");
  el.setAttribute("class", "tree");
  el.style.left = `${position}%`;
  el.innerHTML = template;
  el.style.zIndex = Math.random() > 0.5 ? -10 : 10;
  return el;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCss(gridSize, is3d) {
  var doodl = `:doodle {
        @grid:${gridSize}/ 100%;
        width:100vw;
        height:100vh;
    }
    :container {
        transform-style:${is3d ? "preserve-3d" : "flat"};
    }
    :after {
        content:@p(🦋);
    } 
    @random(.15) {
        filter:hue-rotate(@r(-180deg, 180deg));
    }
    
    animation: fly @r(10s, 20s) infinite linear;
    will-change:transform;
    position:absolute;
    left:@r(100%);
    bottom:@r(75px, 250px);
    
    @keyframes fly {
        0% {
            transform:
            translateX(@r(-20px, 20px))
            translateY(@r(-20px, 20px));
        }
        33% {
            transform:
            translateX(calc(@p(-1,1)*@r(20)*@p(1vmax)))
            translateY(calc(-1*@r(40)*1vmax))
            rotateY(@r(15turn, 25turn))
            rotateZ(@r(-.05turn, .05turn));
        }
        66% {
            transform:
            translateX(calc(@p(-1,1)*@r(20)*@p(1vmax)))
            translateY(calc(-1*@r(30,60)*1vmax))
            rotateY(@r(35turn, 45turn))
            rotateZ(@r(-.05turn, .05turn));
        }
        100% {
            transform:
            translateX(calc(@p(-1,1,1)*@r(40)*1vmax))
            translateY(calc(-100*1vmax))
            rotateY(@r(55turn, 70turn))
            rotateZ(@r(-.05turn, .05turn));
        }
    }
`;
  return doodl;
}

document.addEventListener('keydown', (event) => {
    if (currentPosition < targetText.length) {
        event.preventDefault();
        typedText += targetText[currentPosition];
        typedTextElement.textContent = typedText;
        currentPosition++;
    }
});
