const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;
console.log(`Page width: ${pageWidth}, Page height: ${pageHeight}`);

const container = document.querySelector('.circle_container');
const circleTemp = document.querySelector('.circle1');
let centerX = container.offsetWidth / 2 + circleTemp.offsetWidth/2;
let centerY = container.offsetHeight / 2 + circleTemp.offsetHeight/2;
let radiusX = 100; // Horizontal radius of the ellipse
let radiusY = 200;  // Vertical radius of the ellipse

// MOUSE CONTROL
let mouseX, mouseY;

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    radiusX = (e.clientX/pageWidth)*200;
    radiusY = (e.clientY/pageHeight)*300;
});


function moveInEllipse(circle, duration, timestamp) {
    centerX = 0.99*(centerX) + 0.01*(mouseX + circleTemp.offsetWidth/2);
    centerY = 0.99*(centerY) + 0.01*(mouseY + circleTemp.offsetHeight/2);

    const time = (timestamp % duration) / duration;
    const angle = time * 2 * Math.PI;
    const x = centerX + radiusX * Math.cos(angle) - circle.offsetWidth / 2;
    const y = centerY + radiusY * Math.sin(angle) - circle.offsetHeight / 2;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    requestAnimationFrame((timestamp) => moveInEllipse(circle, duration, timestamp));
}

function moveCircles() {
    const circles = document.querySelectorAll('.circle');
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
            circle.classList.add(moveInEllipse(circle, duration*type, performance.now()));
        });
    });
}