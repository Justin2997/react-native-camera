const express = require('express');
const axios = require('axios');
const app = express()
const port = 8080

getLocation = function(){
  return "45.4042,71.8929";
};

getPollution = function(){
  var token = "c55459d61198d607260a661297f813e60e3ba0e5";
  var url = "http://api.waqi.info/feed/sherbrooke/?token=" + token;
  
  return axios.get(url)
    .then(response => {
  		console.log(response.data.data);
    	var pollution = {};
    	pollution.co = response.data.data.iaqi.co.v;
    	pollution.o3 = response.data.data.iaqi.o3.v;	
    	pollution.pressure = response.data.data.iaqi.p.v;	
    	pollution.pm25 = response.data.data.iaqi.pm25.v;
    
    	console.log(pollution);
      return pollution;
    })
    .catch(error => {
      console.log(error);
    });
};

getForecast = async function() {
  var token = "6a02c628b2b8cf8925487037d2235953";
  var url = "https://api.darksky.net/forecast/" + token + "/" + getLocation();

  return axios.get(url)
  .then(async response => {
    var currently = response.data.currently;
    var forcast = {};

    forcast.humidity = currently.humidity;
    forcast.temperature = currently.temperature;
    forcast.time = currently.time;
    forcast.icon = currently.icon;
    forcast.pressure = currently.pressure;
    forcast.uvIndex = currently.uvIndex;
    await getPollution();
  })
  .catch(error => {
    console.log(error);
  });
};

app.get('/info', function (req, res) {
    var forcast = getForecast().then(response => {
      console.log(forcast);
      res.send(forcast);
    })
    .catch(error => {
      res.send(500);
    })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));