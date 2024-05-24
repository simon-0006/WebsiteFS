
function visibility(rectangle, triggerPoint, scrollPosition, direction) {
    if (scrollPosition > triggerPoint) {
        if (!rectangle.classList.contains(`visible${direction}`)) {
            rectangle.classList.add(`visible${direction}`);
        }
    } else {
        if (rectangle.classList.contains(`visible${direction}`)) {
            rectangle.classList.remove(`visible${direction}`);
        }
    }
};


document.addEventListener("scroll", function() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const triggerPoint1 = windowHeight * 0.5; // Trigger when scrolled down 50% of viewport height
    const triggerPoint2 = windowHeight * 1.5;
    const triggerPoint3 = windowHeight * 2.2;

    const rectangle1 = document.getElementById('rectangle1');
    const rectangle2 = document.getElementById('rectangle2');
    const rectangle3 = document.getElementById('rectangle3');

    visibility(rectangle1, triggerPoint1, scrollPosition, 'Left');
    visibility(rectangle2, triggerPoint2, scrollPosition, 'Right');
    visibility(rectangle3, triggerPoint3, scrollPosition, 'Left');
});