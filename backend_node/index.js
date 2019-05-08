"use strict";
const firebase = require("firebase");

var config = {
  apiKey: "AIzaSyBE6tBWFE30yJFY9uij-2XYUTdDA1pYM2U",
  authDomain: "startupweekend2019-ba4b6.firebaseapp.com",
  databaseURL: "https://startupweekend2019-ba4b6.firebaseio.com",
  projectId: "startupweekend2019-ba4b6",
  storageBucket: "startupweekend2019-ba4b6.appspot.com",
  messagingSenderId: "371557044876"
};
firebase.initializeApp(config);
var database = firebase.database();

exports.fct = async (req, res) => {
  const base64 = req.body.image;
  if (!base64 || !base64.base64) {
    res.status(400);
    res.end("");
    return;
  }
  let key = database.ref("pictures").push().key;
  let dict = {};
  dict[key] = "data:image/jpeg;base64," + base64.base64;
  database.ref("pictures").update(dict);
  let dict2 = {};
  dict2[key] = req.body.questionValue;
  database.ref("metaData").update(dict2);

  res.end("");
  res.status(200);
};
