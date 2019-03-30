"use strict";
const { loadImage, createCanvas } = require("canvas");
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node"); // Use '@tensorflow/tfjs-node-gpu' if running with GPU.

const SKIN_CLASSES = {
  0: 'akiec, Actinic Keratoses (Solar Keratoses) or intraepithelial Carcinoma (Bowenâ€™s disease)',
  1: 'bcc, Basal Cell Carcinoma',
  2: 'bkl, Benign Keratosis',
  3: 'df, Dermatofibroma',
  4: 'mel, Melanoma',
  5: 'nv, Melanocytic Nevi',
  6: 'vasc, Vascular skin lesion'
};

loadImage("./samplepic.jpg").then(async function(image) {
  const model = await tf.loadLayersModel(
    "http://skin.test.woza.work/final_model_kaggle_version1/model.json"
  );

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  let tensor = tf.browser
    .fromPixels(canvas)
    .resizeNearestNeighbor([224, 224])
    .toFloat();

  let offset = tf.scalar(127.5);
  tensor = tensor
    .sub(offset)
    .div(offset)
    .expandDims();

    let predictions = await model.predict(tensor).data();

    let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: SKIN_CLASSES[i] // we are selecting the value from the obj
			};
			
		}).sort(function (a, b) {
			return b.probability - a.probability;
				
    }).slice(0, 7);
    
    console.log(top5);
});

//let test = fs.readFileSync("./samplepic.jpg");

//console.log(tf.browser.fromPixels(test));
//tf.tensor2d()

//console.log(tf.image.resizeNearestNeighbor.toString())
//tf.image(test).resizeNearestNeighbor([224, 224]).toFloat();
