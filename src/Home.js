// Mousescroll auch horizontal beim runterscrollen

document.addEventListener("wheel", function (event) {
  const scrollerContainer = document.querySelector(".scroller-container");
  if (event.deltaY !== 0) {
    scrollerContainer.scrollLeft += event.deltaY;
    event.preventDefault();
  }
});

// cursor

const cursor = document.querySelector(".cursor");
const dot = document.querySelector(".dot");

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let isFirstMove = true;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX - cursor.offsetWidth / 2;
  mouseY = e.clientY - cursor.offsetHeight / 2;

  // On the first move, set both cursor and dot to the same position
  if (isFirstMove) {
    cursorX = mouseX;
    cursorY = mouseY;
    dot.style.left = `${e.clientX - dot.offsetWidth / 2}px`;
    dot.style.top = `${e.clientY - dot.offsetHeight / 2}px`;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    isFirstMove = false;
  }

  dot.style.left = `${e.clientX - dot.offsetWidth / 2}px`;
  dot.style.top = `${e.clientY - dot.offsetHeight / 2}px`;
});

const animateCursor = () => {
  cursorX += (mouseX - cursorX) * 0.1; // Smooth follow effect
  cursorY += (mouseY - cursorY) * 0.1;

  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

  requestAnimationFrame(animateCursor);
};

animateCursor();

const links = document.querySelectorAll("a");

links.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    cursor.style.borderColor = "#FFA500"; // Change to the desired border color
    dot.style.backgroundColor = "#FFA500"; // Change to the desired dot color
  });

  link.addEventListener("mouseleave", () => {
    cursor.style.borderColor = "#3700ff";
    dot.style.backgroundColor = "#3700ff";
  });
});
