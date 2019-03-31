
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';


const labels = {
  0: "Aucunement",
  1: "Moyennement",
  2: "Beaucoup"
}

var x = document.getElementById("pictures");

var ref = database.ref('pictures');

ref.on('child_added', function(snapshot) {
  var url = snapshot.val();
  
    var elem = document.createElement("img");
    var elem2 = document.createElement("div");
    elem2.innerText = labels[url.metaData];
    elem.setAttribute("src", url.pic);
    elem2.setAttribute("style", "text-align:center")
    // elem.setAttribute("height", "768");
    // elem.setAttribute("width", "1024");
    // elem.setAttribute("alt", "Flower");
    elem.setAttribute("style", "width: 80%; padding:10px;");
    document.getElementById("pictures").prepend(elem2);
    document.getElementById("pictures").prepend(elem);
    
});

