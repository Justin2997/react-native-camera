
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';




var x = document.getElementById("pictures");

var ref = database.ref('pictures');

ref.on('child_added', function(snapshot) {
  var url = snapshot.val();
  
    var elem = document.createElement("img");
    var elem2 = document.createElement("br");
    elem.setAttribute("src", url);
    // elem.setAttribute("height", "768");
    // elem.setAttribute("width", "1024");
    // elem.setAttribute("alt", "Flower");
    elem.setAttribute("style", "width: 70%;")
    document.getElementById("pictures").appendChild(elem);
    document.getElementById("pictures").appendChild(elem2);
    
});