const MODEL_PATH = "https://23098-code.github.io/corn/";

let model;
let webcam;
let currentImage = null;

window.addEventListener("DOMContentLoaded", init);

async function init() {
    try {

        const modelURL = MODEL_PATH + "model.json";
        const metadataURL = MODEL_PATH + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);

        webcam = new tmImage.Webcam(340, 340, true);
        await webcam.setup({ facingMode: "environment" });
        await webcam.play();

        document.getElementById("webcam-container").appendChild(webcam.canvas);

        requestAnimationFrame(loop);

        console.log("โหลดโมเดลสำเร็จ");

    } catch (error) {
        console.error("โหลดโมเดลไม่สำเร็จ", error);
        alert("โหลดโมเดลไม่สำเร็จ กรุณาตรวจสอบไฟล์ model.json และ weights.bin");
    }
}

async function loop() {
    webcam.update();
    requestAnimationFrame(loop);
}

async function predict(imageElement) {

    if (!model) {
        alert("โมเดลยังโหลดไม่เสร็จ");
        return;
    }

    const prediction = await model.predict(imageElement);

    let result = "";

    for (let i = 0; i < prediction.length; i++) {
        const p = prediction[i];
        result += `${p.className} : ${(p.probability * 100).toFixed(2)}%<br>`;
    }

    document.getElementById("result").innerHTML = result;
}

function capture() {
    currentImage = webcam.canvas;
    predict(currentImage);
}

function uploadImage(event) {

    const img = document.getElementById("uploaded-image");

    img.src = URL.createObjectURL(event.target.files[0]);

    img.onload = () => {
        currentImage = img;
    };
}

function classifyUpload() {

    if (!currentImage) {
        alert("กรุณาอัปโหลดรูปก่อน");
        return;
    }

    predict(currentImage);
}

