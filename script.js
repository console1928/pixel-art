var canvas = document.querySelector("canvas"),
    state = [],
    timer = null;

function renderPicture(canvas) {
    var currentPixel = 0,
        cx = canvas.getContext("2d");
    for (var y = 0; y < canvas.height - 3; y += Math.floor((canvas.height - 3) / 4) + 1) {
        for (var x = 0; x < canvas.width - 3; x += Math.floor((canvas.width - 3) / 4) + 1) {
            cx.fillStyle = state[currentPixel];
            cx.fillRect(x, y, Math.floor((canvas.width - 3) / 4), Math.floor((canvas.height - 3) / 4));
            currentPixel++;
        }
    }
}

function colorizePixel(event) {
    var mousePosX = event.clientX - canvas.getBoundingClientRect().left,
        mousePosY = event.clientY - canvas.getBoundingClientRect().top,
        colorizedPixel = Math.floor(1 + (mousePosX / (canvas.width / 4))) + Math.floor(mousePosY / (canvas.height / 4)) * 4 - 1;
    if (state[colorizedPixel] == "#000") state[colorizedPixel] = "#90c4b8";
    else state[colorizedPixel] = "#000";
}

function rotatePicture() {
    var newState = [],
        rowLength = Math.sqrt(state.length);
    newState.length = state.length;
    for (var i = 0; i < state.length; i++) {
        var x = i % rowLength,
            y = Math.floor(i / rowLength),
            newX = rowLength - y - 1,
            newY = x,
            newPosition = newY * rowLength + newX;
        newState[newPosition] = state[i];
    }
    state = newState;
}

function showResult() {
    var pixelCount = 0;
    document.querySelector(".popup").style.display = "block";
    for (var i = 0; i < state.length; i++) {
        if (state[i] === "#000")
            pixelCount++;
    }
    document.querySelector(".popup-info").innerHTML =
        "Пикселей: " + pixelCount + "<br>Время: " + document.querySelector(".time-display").innerHTML.slice(10, 15);
}

function countTime() {
    var secondsCounter = 1;
    timer = setInterval(function () {
        var seconds = (secondsCounter % 60).toString(),
            minutes = (Math.ceil((secondsCounter + 1) / 60) - 1).toString();
        if (seconds.length < 2) seconds = "0" + seconds;
        if (minutes.length < 2) minutes = "0" + minutes;
        document.querySelector(".time-display").innerHTML = "Время:<br>" + minutes + ":" + seconds;
        secondsCounter++;
    }, 1000);
}

function resizeCanvas() {
    if (window.innerWidth <= 403) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth;
    }
}

function init() {
    state.length = 16;
    state.fill("#90c4b8");
    document.querySelector(".popup").style.display = "none";
    document.querySelector(".time-display").innerHTML = "Время:<br>00:00";
    resizeCanvas();
    renderPicture(canvas);
    canvas.addEventListener("click", countTime, {
        once: true
    });
}

window.addEventListener("resize", function () {
    resizeCanvas();
    renderPicture(canvas);
});
canvas.addEventListener("click", function (event) {
    colorizePixel(event);
    renderPicture(canvas);
});
document.querySelector(".rotate-button").addEventListener("click", function () {
    rotatePicture();
    renderPicture(canvas);
});
document.querySelector(".result-button").addEventListener("click", function () {
    showResult();
    renderPicture(document.querySelector(".popup-picture"));
    canvas.removeEventListener("click", countTime);
    clearTimeout(timer);
});
document.querySelector(".popup-close").addEventListener("click", init);
window.addEventListener("DOMContentLoaded", init);
