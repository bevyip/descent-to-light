document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("top-layer");
  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let totalPixels = 0;
  let erasedPixels = 0;

  // Set canvas size and draw initial image
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    totalPixels = canvas.width * canvas.height;
    loadAndDrawImage();
  }

  function loadAndDrawImage() {
    const excavationImg = new Image();
    excavationImg.onload = () => {
      ctx.drawImage(excavationImg, 0, 0, canvas.width, canvas.height);
    };
    excavationImg.src = "img/excavation.jpg";
  }

  function checkErasedPercentage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    // Count fully or mostly transparent pixels (alpha < 10)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 10) transparent++;
    }

    erasedPixels = transparent;
    const percentageErased = (erasedPixels / totalPixels) * 100;

    if (percentageErased > 50) {
      window.location.href = "cave.html";
    }
  }

  // Drawing functions
  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  }

  function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set composite operation to erase
    ctx.globalCompositeOperation = "destination-out";

    // Draw eraser circle
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw connecting line for smooth erasing
    ctx.beginPath();
    ctx.lineWidth = 40;
    ctx.lineCap = "round";
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;

    // Check erased percentage after each stroke
    checkErasedPercentage();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  // Initial setup
  setCanvasSize();

  // Handle window resize
  window.addEventListener("resize", () => {
    setCanvasSize();
  });

  // Mouse event listeners
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // Touch events for mobile
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  });
});
