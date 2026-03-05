const MODEL_PATH = "https://23098-code.github.io/corn/";

let model;
let webcam;

window.addEventListener("DOMContentLoaded", init);

async function init() {

    const modelURL = MODEL_PATH + "model.json";
    const metadataURL = MODEL_PATH + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    webcam = new tmImage.Webcam(340, 340, true);
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    requestAnimationFrame(loop);
}

async function loop() {
    webcam.update();
    requestAnimationFrame(loop);
}

async function predict() {

    const prediction = await model.predict(webcam.canvas);

    let result = "";

    for (let i = 0; i < prediction.length; i++) {
        result += prediction[i].className + " : " +
        (prediction[i].probability * 100).toFixed(2) + "%<br>";
    }

    document.getElementById("result").innerHTML = result;
}
