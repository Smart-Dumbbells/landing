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
})