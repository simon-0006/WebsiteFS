// Mousescroll auch horizontal beim runterscrollen

document.addEventListener("wheel", function (event) {
  const scrollerContainer = document.querySelector(".scroller-container");
  if (event.deltaY !== 0) {
    scrollerContainer.scrollLeft += event.deltaY;
    event.preventDefault();
  }
});
