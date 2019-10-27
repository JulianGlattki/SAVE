var currentAlgorithm = "bubbleSort";
var currentArraySize = 2; 

function setUp() {
    document.getElementsByName(currentAlgorithm)[0].style.display = "none";
    initializeEventHandlers(); 
    changeArraySize(2);
    initAlgorithmDropdown();


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
    document.getElementById("arraySizeSlider").addEventListener("change", (e) => {
        changeArraySize(e);
    });
    document.getElementById("arraySizeInput").addEventListener("input", (e) => {
        changeArraySize(e);
    });
}

function setEventHandlersForDropdown() {
    var algorithmDropdownOption = document.getElementsByClassName("algorithmDropdownOption");

    for(var i = 0; i < algorithmDropdownOption.length; i++) {
        algorithmDropdownOption[i].addEventListener("click", (e) => {
            algorithmPicked(e);
        });
    }
}

function initAlgorithmDropdown() {
    var initAlgorithm = document.getElementsByClassName("algorithmDropdownOption")[0].attributes.getNamedItem("name").value;
    var currentAlgorithm = initAlgorithm; 
    algorithmPicked(currentAlgorithm);
}

function algorithmPicked(e) {
    var previousAlgorithm = currentAlgorithm;
    if(typeof e === 'string') currentAlgorithm = e; 
    else currentAlgorithm = e.target.getAttribute("name");
    document.getElementsByName(previousAlgorithm)[0].style.display = "block"; 
    document.getElementsByName(currentAlgorithm)[0].style.display = "none";
    document.getElementById("algorithmSelected").innerHTML = 
        document.getElementsByName(currentAlgorithm)[0].innerHTML; 
}


function changeArraySize(e){
    if (!isNaN(e) && e > 1 && e < 100) {
        currentArraySize = e; 
        document.getElementById("arraySizeInput").value = e;
        document.getElementById("arraySizeSlider").value = e;
    } else {
        if (e.target.id == "arraySizeSlider") {
            currentArraySize = e.target.value; 
            document.getElementById("arraySizeInput").value = currentArraySize ; 
        }  else if (e.target.id == "arraySizeInput") {
            currentArraySize = e.target.value; 
            document.getElementById("arraySizeSlider").value = currentArraySize ;
        }

    }

    deleteArray(); 
    generateNewArray(currentArraySize);
}

function generateNewArray(size) {
	var arrayDisplay = document.getElementById("arrayDisplay");
    var width = 90/(Number(size)+1);

    for(var i = 0; i < size; i++) {
        var value = Math.floor((Math.random()*5000)+1);
        var height = calcHeight(value);

        arrayDisplay.insertAdjacentHTML("beforeEnd", 
            "<div id='arrEl" + value + "' class='arrayElement' style='height:" + height + "%; width:" + width + "%;'></div>");
    }
}

function calcHeight(height) {
    return height * 0.0178 + 1; // Map height [1-5000] to [1-90]
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

