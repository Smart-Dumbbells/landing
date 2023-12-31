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


function STLViewer(model, elementID) {
    // If mobile 
    if (window.innerWidth < 768) {
        document.querySelector('#model').classList.add('hidden');
        document.querySelector('#image-no3d').classList.remove('hidden');
        return;
    } else {
        document.querySelector('#model').classList.remove('hidden');
        document.querySelector('#image-no3d').classList.add('hidden');
    }
    const elem = document.getElementById(elementID);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const camera = new THREE.PerspectiveCamera(70, elem.clientWidth / elem.clientHeight, 1, 1000);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    const scene = new THREE.Scene();

    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.appendChild(renderer.domElement);

    window.addEventListener('resize', function () {
        if (window.innerWidth < 768) {
            document.querySelector('#model').classList.add('hidden');
            document.querySelector('#image-no3d').classList.remove('hidden');
            return;
        } else {
            document.querySelector('#model').classList.remove('hidden');
            document.querySelector('#image-no3d').classList.add('hidden');
        }
        renderer.setSize(elem.clientWidth, elem.clientHeight);
        camera.aspect = elem.clientWidth / elem.clientHeight;
        camera.updateProjectionMatrix();
    }, false);

    controls.enableDamping = true;
    controls.rotateSpeed = 0.2;
    controls.dampingFactor = 0.2;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = .75;

    scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

    const loader = new THREE.STLLoader();
    loader.load(model, function (geometry) {
        const material = new THREE.MeshPhongMaterial({
            color: 0x969696,
            specular: 100,
            shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
        const middle = new THREE.Vector3();
        geometry.boundingBox.getCenter(middle);
        mesh.geometry.translate(-middle.x, -middle.y, -middle.z);

        const largestDimension = Math.max(geometry.boundingBox.max.x, geometry.boundingBox.max.y, geometry.boundingBox.max.z);
        camera.position.z = largestDimension * 1.2;

        scene.add(mesh);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        animate();
    });
}

function webgl_support() {
    try {
        var canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
        return false;
    }
};

function browserLocales(languageCodeOnly = false) {
    return navigator.languages.map((locale) =>
        languageCodeOnly ? locale.split("-")[0] : locale,
    );
}

const defaultLocale = 'it';
const supportedLocales = ["en", "it"];

function getLocale() {
    const locales = browserLocales();
    const locale = locales.find((locale) => supportedLocales.includes(locale)) || defaultLocale;
    return locale;
}

const locale = getLocale();

// Get the corrisponding json file
let translations = {};
async function getTranslations(lang = locale) {
    return fetch(`./assets/langs/${lang}.json`)
        .then((response) => response.json())
        .then((responseJson) => { return responseJson });
}


function translatePage() {
    const elements = document.querySelectorAll('[data-i18n-key]');
    elements.forEach(translateElement);
}

async function changeLanguage(lang) {
    console.log(lang);
    translations =
        await getTranslations(lang);
    translatePage();
    return translations;
}


$("#changeLanguageBtn").click(function () {
    if ($("#changeLanguageBtn").text() === "EN") {
        $("#changeLanguageBtn").text("IT");
        changeLanguage("en").then((responseJson) => {
            reloadAnnotations();
        });
    } else {
        $("#changeLanguageBtn").text("EN");
        changeLanguage("it").then((responseJson) => {
            reloadAnnotations();
        });
    }
});


function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");
    const type = element.getAttribute("data-i18n-type");
    const translation = translations[type][key];
    
    // Replace with <span class="font-bold text-gray-800 animate_underline">${text}</span>
    const boldMatches = /\{([^{}]+)\}/g;
    // Replace with <span class="primary-color">${text}</span>
    const primaryColorMatches = /\[([^\[\]]+)\]/g;
    // replace with <span class="font-bold text-gray-800">${text}</span>
    const onlyBoldMatches = /\(([^\(\)]+)\)/g;

    const text = translation.replace(boldMatches, '<span class="font-bold text-gray-800 animate_underline">$1</span>')
        .replace(primaryColorMatches, '<span class="primary-color">$1</span>')
        .replace(onlyBoldMatches, '<span class="font-bold text-gray-800">$1</span>');

    element.innerHTML = text;
}

function reloadAnnotations() {
    const e = document.querySelectorAll('.animate_underline');
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

}

// On document ready
document.addEventListener('DOMContentLoaded', function () {
    changeLanguage(locale).then((responseJson) => {
        reloadAnnotations();
    });

    // Get query params
    const urlParams = new URLSearchParams(window.location.search);
    // If navBar is set to true, show the navBar
    if (urlParams.get('navBar') === 'true') {
        document.querySelector('#navbar').classList.remove('hidden');
        document.querySelector('#footer').classList.remove('hidden');
        $("#homelogo").addClass("hidden");
    } else {
        $("#home").removeClass("mt-14");
        $("#home").removeClass("py-12");
        $("#home").removeClass("sm:py-24");
    }


    // check WebGl support
    if (webgl_support()) {
        STLViewer('assets/Manubrio.stl', 'model');
    } else {
        document.querySelector('#model').classList.add('hidden');
        document.querySelector('#image-no3d').classList.remove('hidden');
    }



    const mpu = document.querySelectorAll('#mpu');
    const arduino = document.querySelectorAll('#arduino');
    const bluetooth = document.querySelectorAll('#bluetooth');
    const battery1 = document.querySelectorAll('#battery1');
    const battery2 = document.querySelectorAll('#battery2');

    const mpuCallout = document.querySelector('#mpu-callout');
    const arduinoCallout = document.querySelector('#arduino-callout');
    const bluetoothCallout = document.querySelector('#bluetooth-callout');
    const batteryCallout = document.querySelector('#battery-callout');

    $(mpu).on('touchstart mouseover', function () {
        $(mpuCallout).fadeIn("fast");
    });

    $(mpu).on('mouseout', function () {
        $(mpuCallout).fadeOut("fast");
    });

    $(arduino).on('mouseover', function () {
        $(arduinoCallout).fadeIn("fast");
    });

    $(arduino).on('mouseout', function () {
        $(arduinoCallout).fadeOut("fast");
    });

    $(bluetooth).on('mouseover', function () {
        $(bluetoothCallout).fadeIn("fast");
    });

    $(bluetooth).on('mouseout', function () {
        $(bluetoothCallout).fadeOut("fast");
    });

    $(battery1).on('mouseover', function () {
        $(battery1).css("fill", "#febf00");
        $(battery1).css("opacity", "0.2");
        $(battery2).css("fill", "#febf00");
        $(battery2).css("opacity", "0.2");
        $(batteryCallout).fadeIn("fast");
    });

    $(battery1).on('mouseout', function () {
        $(battery1).css("fill", "transparent");
        $(battery1).css("opacity", "1");
        $(battery2).css("fill", "transparent");
        $(battery2).css("opacity", "1");
        $(batteryCallout).fadeOut("fast");
    });

    $(battery2).on('mouseover', function () {
        $(battery1).css("fill", "#febf00");
        $(battery1).css("opacity", "0.2");
        $(battery2).css("fill", "#febf00");
        $(battery2).css("opacity", "0.2");
        $(batteryCallout).fadeIn("fast");
    });

    $(battery2).on('mouseout', function () {
        $(battery1).css("fill", "transparent");
        $(battery1).css("opacity", "1");
        $(battery2).css("fill", "transparent");
        $(battery2).css("opacity", "1");
        $(batteryCallout).fadeOut("fast");
    });

    
    const gabriele = document.querySelectorAll('#gabriele');
    const lorenzo = document.querySelectorAll('#lorenzo');
    const matteo = document.querySelectorAll('#matteo');
    const paolo = document.querySelectorAll('#paolo');

    const gabrieleCallout = document.querySelector('#gabriele-callout');
    const lorenzoCallout = document.querySelector('#lorenzo-callout');
    const matteoCallout = document.querySelector('#matteo-callout');
    const paoloCallout = document.querySelector('#paolo-callout');

    $(gabriele).on('mouseover', function () {
        $(gabrieleCallout).fadeIn("fast");
    });

    $(gabriele).on('mouseout', function () {
        $(gabrieleCallout).fadeOut("fast");
    });

    $(lorenzo).on('mouseover', function () {
        $(lorenzoCallout).fadeIn("fast");
    });

    $(lorenzo).on('mouseout', function () {
        $(lorenzoCallout).fadeOut("fast");
    });

    $(matteo).on('mouseover', function () {
        $(matteoCallout).fadeIn("fast");
    });

    $(matteo).on('mouseout', function () {
        $(matteoCallout).fadeOut("fast");
    });

    $(paolo).on('mouseover', function () {
        $(paoloCallout).fadeIn("fast");
    });

    $(paolo).on('mouseout', function () {
        $(paoloCallout).fadeOut("fast");
    });

    AOS.init();
    $("#loader").fadeOut("slow");
});