"use strict";
const { loadImage, createCanvas, Image } = require("canvas");
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node"); // Use '@tensorflow/tfjs-node-gpu' if running with GPU.

const SKIN_CLASSES = {
  0: "akiec, Actinic Keratoses (Solar Keratoses) or intraepithelial Carcinoma (Bowenâ€™s disease)",
  1: "bcc, Basal Cell Carcinoma",
  2: "bkl, Benign Keratosis",
  3: "df, Dermatofibroma",
  4: "mel, Melanoma",
  5: "nv, Melanocytic Nevi",
  6: "vasc, Vascular skin lesion"
};

let _model = null;
async function getModel() {
  if (!_model) {
    _model = await tf.loadLayersModel(
      "http://skin.test.woza.work/final_model_kaggle_version1/model.json"
    );
  }
  return _model;
}

exports.fct = async (req, res) => {
  const base64 = req.body.image;
  if (!base64) {
    return []
  }
  const model = await getModel();
  loadImage('data:image/jpg;base64,' + base64).then(async image => {
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

    let sorted = Array.from(predictions)
      .map(function(p, i) {
        return {
          probability: p,
          className: SKIN_CLASSES[i]
        };
      })
      .sort(function(a, b) {
        return b.probability - a.probability;
      });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(sorted));
  });
};
