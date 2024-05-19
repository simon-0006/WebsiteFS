const container = document.querySelector('.circle_container');
const radiusX = 100; // Horizontal radius of the ellipse
const radiusY = 200;  // Vertical radius of the ellipse



function moveInEllipse(circle, centerX, centerY, duration, timestamp) {
    const time = (timestamp % duration) / duration;
    const angle = time * 2 * Math.PI;
    const x = centerX + radiusX * Math.cos(angle) - circle.offsetWidth / 2;
    const y = centerY + radiusY * Math.sin(angle) - circle.offsetHeight / 2;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    requestAnimationFrame((timestamp) => moveInEllipse(circle, centerX, centerY, duration, timestamp));
}

function moveCircles() {
    const circles = document.querySelectorAll('.circle');
    let centerX = container.offsetWidth / 2;
    let centerY = container.offsetHeight / 2;
    let duration = 5000; // Duration of one full loop in milliseconds
    
    circles.forEach(function(circle) {
        let type = 1;
        if (circle && circle.classList.contains('circle1')) {
            type = 1;
        } else if (circle && circle.classList.contains('circle2')) {
            type = 2;
        } else {
            type = 3;
        }
        circle.classList.add(`move${type}`);
        circle.addEventListener('animationend', () => {
            if (circle && circle.classList.contains('circle1')) {
                type = 1;
            } else if (circle && circle.classList.contains('circle2')) {
                type = 2;
            } else {
                type = 3;
            }
            circle.classList.remove(`move${type}`);
            let width = circle.getBoundingClientRect().width;
            circle.classList.add(moveInEllipse(circle, centerX + width/2, centerY + width/2, duration*type, 0));
        });
    });
}