const button_animation = document.querySelector('.button-animation');
const walk = 30; // 100px

const shadow = function (e) {
    //the measure differs if we resize the window of the browser -responsive element
    //offsetWidth gives the measurement in pixels of the element's CSS width
    //offsetHeight gives the measurement in pixels of the element's CSS height

    //measures of the hero div
    const width = this.offsetWidth;
    const height = this.offsetHeight;

    //the exact measure pixel in the hero where the mouse is moving (e -mousemove) in x and y
    let x = e.offsetX
    let y = e.offsetY
    //console.log(x,y)

    //we want  to update the values of x and y exaclty near by the text h1 top left, to start there.
    if (this !== e.target) {
        x = x + e.target.offsetLeft;
        y = y + e.target.offsetTop;
    }

    //Math.round() method returns  the value of a number rounder to the neareast integer

    const xWalk = Math.round((x / width * walk) - (walk / 2));
    const yWalk = Math.round((y / height * walk) - (walk / 2));


    // Applies a simple box shadow grey
    this.style.boxShadow = `${xWalk}px ${yWalk}px rgba(0,0,0,0.1)`;
}

button_animation.addEventListener('mousemove', shadow);
button_animation.addEventListener('mouseout', function () {
    this.style.boxShadow = 'none';
});

// On scroll body remove .hidden from #scroll-downs-icon-mouse and add hidden to #scroll-downs-icon

const scrollDownIconMouse = document.querySelector('#scroll-downs-icon-mouse'); // Mouse icon to show on scroll
const scrollDownIcon = document.querySelector('#scroll-downs-icon'); // Arrow icon to hide on scroll and show when still
const scrollDiv = document.querySelector('#scrollPage');

var scrollTimer = -1;

function bodyScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        scrollDiv.classList.add('hidden');
        return;
    } else {
        scrollDiv.classList.remove('hidden');
    }

    scrollDownIconMouse.classList.remove('hidden');
    scrollDownIcon.classList.add('hidden');
    scrollDiv.firstElementChild.classList.remove('custom-bounce');


    if (scrollTimer != -1)
    clearTimeout(scrollTimer);

    scrollTimer = window.setTimeout("scrollFinished()", 500);
}

function scrollFinished() {
    scrollDownIconMouse.classList.add('hidden');
    scrollDownIcon.classList.remove('hidden');
    // Select the first child of scrollDiv
    scrollDiv.firstElementChild.classList.add('custom-bounce');


}

window.addEventListener('scroll', bodyScroll);
AOS.init();

// On document ready
document.addEventListener('DOMContentLoaded', function () {
    const e = document.querySelectorAll('#smart-dumbbells .animate_underline');
    var annotations = [];
    e.forEach(e => {
        const annotation = RoughNotation.annotate(e, {
            type: 'underline',
            color: 'var(--primary-color)',
            animate: false,
            padding: [0, 0, 0, 0],
        });
        annotations.push(annotation);
    });

    RoughNotation.annotationGroup(annotations).show();

});