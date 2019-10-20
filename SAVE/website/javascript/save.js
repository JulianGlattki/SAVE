var currentAlgorithm = "bubbleSort";
var currentArraySize = 2; 

function setUp() {
    document.getElementsByName(currentAlgorithm)[0].style.display = "none";
    initializeEventHandlers(); 
}
function initializeEventHandlers() {
    setEventHandlersForDropdown(); 
    document.getElementById("stepBack").addEventListener("click", () =>  {
        stepBack();
    });
    document.getElementById("sort").addEventListener("click", () =>  {
        sort();
    });
    document.getElementById("stepForward").addEventListener("click", () =>  {
        stepForward();
    });
    document.getElementById("arraySizeSlider").addEventListener("input", (e) => {
        changeArraySize(e);
    });
    /*document.getElementById("arraySizeSlider").addEventListener("change", (e) => {
        changeArraySize(e);
    });*/
    document.getElementById("arraySizeInput").addEventListener("input", (e) => {
        changeArraySize(e);
    });
}

function setEventHandlersForDropdown() {
    var algorithmDropdownOptions = document.getElementsByClassName("algorithmDropdownOptions");

    for(var i = 0; i < algorithmDropdownOptions.length; i++) {
        algorithmDropdownOptions[i].addEventListener("click", (e) => {
            algorithmPicked(e);
        });
    }
}

function algorithmPicked(e) {
    var previousAlgorithm = currentAlgorithm;
    currentAlgorithm = e.target.getAttribute("name");
    document.getElementsByName(previousAlgorithm)[0].style.display = "block"; 
    document.getElementsByName(currentAlgorithm)[0].style.display = "none";
    document.getElementById("algorithmSelected").innerHTML = 
        document.getElementsByName(currentAlgorithm)[0].innerHTML; 
}


function changeArraySize(e){
    if (e.target.id == "arraySizeSlider") {
        currentArraySize = e.target.value; 
        document.getElementById("arraySizeInput").value = currentArraySize ; 
        deleteArray(); 
        generateNewArray(currentArraySize);
    }
    else if(e.target.id == "arraySizeInput") {
        currentArraySize = e.target.value; 
        document.getElementById("arraySizeSlider").value = currentArraySize ;
        deleteArray(); 
        generateNewArray(currentArraySize);
    }
}

function generateNewArray(size) {
    var arrayDisplay = document.getElementById("arrayDisplay");
    var width = 90/(size+1);
    var padding = width/(size*2);
    for(var i = 0; i < size; i++) {
        var value = Math.floor((Math.random()*5000)+1);
        var height = calcHeight(value);

        arrayDisplay.insertAdjacentHTML("beforeEnd", 
            "<div id='arrEl" + value + "' class='arrayElement' style='height:" + height + "%; width:" + width + "%;'>" + value +"</div>");
    }

    Array.from("document.getElementsByClassName('arrayElement')".forEach(function(item) {
        item.setAttribute("padding", "0" + padding + "0" + padding);
    }));


}

function calcHeight(height) {
    return height * 0.0178 + 1; // Map height [1-5000] to [1-999]
}
function deleteArray() {
    var arrayElements = document.getElementsByClassName("arrayElement");

    while(arrayElements[0]) {
        arrayElements[0].parentNode.removeChild(arrayElements[0]);
    }
}

function stepBack() {
    console.log("stepBack");
    return;
}

function sort() {
    console.log("sort");
}

function stepForward() {
    console.log("stepForward");
}

