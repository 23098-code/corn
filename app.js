const URL = "https://23098-code.github.io/corn/";

let model, webcam;

async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    webcam = new tmImage.Webcam(340, 340, true);
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    window.requestAnimationFrame(loop);
}

async function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

async function predict() {

    if(!model){
        document.getElementById("result").innerHTML="โมเดลยังโหลดไม่เสร็จ";
        return;
    }

    const prediction = await model.predict(webcam.canvas);

    let text = "";

    for (let i = 0; i < prediction.length; i++) {

        text += prediction[i].className + " : " +
        (prediction[i].probability * 100).toFixed(2) + "%<br>";

    }

    document.getElementById("result").innerHTML = text;
}

window.onload = init;
