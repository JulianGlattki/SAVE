"use strict";

var lastIndex; 

/* -------------------------------------------------------------------------- */
/*                               Init functions                               */
/* -------------------------------------------------------------------------- */
function setUp() {
    document.getElementsByName("Bubblesort")[0].style.display = "none";
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
    let algorithmDropdownOption = document.getElementsByClassName("algorithmDropdownOption");

    for(var i = 0; i < algorithmDropdownOption.length; i++) {
        algorithmDropdownOption[i].addEventListener("click", (e) => {
            algorithmPicked(e);
        });
    }
}

function initAlgorithmDropdown() {
    var initAlgorithm = document.getElementsByClassName("algorithmDropdownOption")[0].attributes.getNamedItem("name").value;
    algorithmPicked(initAlgorithm);
}

/* -------------------------------------------------------------------------- */
/*                             Dropdown functions                             */
/* -------------------------------------------------------------------------- */
function algorithmPicked(e) {
    var previousAlgorithm = document.getElementById("algorithmSelected").innerHTML;
    var currentAlgorithm; 

    if (typeof e === 'string') currentAlgorithm = e; 
    else currentAlgorithm = e.target.getAttribute("name");

    document.getElementsByName(previousAlgorithm)[0].style.display = "block"; 
    document.getElementsByName(currentAlgorithm)[0].style.display = "none";
    document.getElementById("algorithmSelected").innerHTML = 
        document.getElementsByName(currentAlgorithm)[0].innerHTML; 

    changeAlgorithmTextDisplay();
}

/* -------------------------------------------------------------------------- */
/*                               Array functions                              */
/* -------------------------------------------------------------------------- */
function changeArraySize(e){
    var arraySize;
    if (!isNaN(e) && e > 1 && e < 100) {
        arraySize = e; 
        document.getElementById("arraySizeInput").value = e;
        document.getElementById("arraySizeSlider").value = e;
    } else {
        if (e.target.id == "arraySizeSlider") {
            arraySize = e.target.value; 
            document.getElementById("arraySizeInput").value = arraySize ; 
        }  else if (e.target.id == "arraySizeInput") {
            arraySize = e.target.value; 
            document.getElementById("arraySizeSlider").value = arraySize ;
        }

    }
    deleteArray(); 
    generateNewArray(arraySize);
}

function generateNewArray(size) {
	var arrayDisplay = document.getElementById("arrayDisplay");
    var width = 90/(Number(size)+1);

    for (var i = 0; i < size; i++) {
        var value = Math.floor((Math.random()*5000)+1);
        var height = calcHeight(value);
        if(document.getElementById('arrEl' + value) != null) {
            i--; 
            continue; 
        }
        arrayDisplay.insertAdjacentHTML("beforeEnd", 
            "<div id='arrEl" + value + "' class='arrayElement' value='" + value + "' style='height:" + height + "%; width:" + width + "%;'></div>");
    }
}

function deleteArray() {
    var arrayElements = document.getElementsByClassName("arrayElement");

    while(arrayElements[0]) {
        arrayElements[0].parentNode.removeChild(arrayElements[0]);
    }
}


/* --------------------------------- Helper --------------------------------- */
function calcHeight(height) {
    return height * 0.0178 + 1; // Map height [1-5000] to [1-90]
}


/* -------------------------------------------------------------------------- */
/*                            Sorting functionality                           */
/* -------------------------------------------------------------------------- */

function stepBack() {
    console.log("stepBack");
    return;
}

function sort() {
    console.log("sort");
}

function stepForward() {
    let array = getArray(); 

    if(isSorted(array)) {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        let linenumber = bottomTextDisplay.childNodes.length; 
        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p id="line' + linenumber + '" class="bottomTextDisplayText">Array is sorted... Please reset to start sorting again.</p>');
    } else {
        stepForwardBubbleSort(array);
    }
}

function getArray() {
    let array = [].slice.call(document.getElementsByClassName('arrayElement'));
    return array.map(x => parseInt(x.getAttribute('value')));  
}

function isSorted(array) {
    for(let i = 0; i < array.length-1; i++) {
        if(array[i] > array[i+1]) return false; 
    }
    return true; 
}

function insertBeforeElement(elementValue, anotherElementValue) {
    let element = document.getElementById('arrEl' + elementValue);
    let anotherElement = document.getElementById('arrEl' + anotherElementValue);
    element.parentNode.insertBefore(anotherElement, element);
    let clone1 = element.cloneNode();
    let clone2 = anotherElement.cloneNode();
    anotherElement.replaceWith(clone1);
    element.replaceWith(clone2);

}






/* ------------------------------- Bubble Sort ------------------------------ */
// TODO reset everything if array size changes

var lastStepHolder; 

class BubbleSortHolder {
    constructor(array, lastIndex, firstElement, secondElement, swap) {
        this.array = array; 
        this.lastIndex = lastIndex; 
        this.firstElement = firstElement;
        this.secondElement = secondElement; 
        this.swap = swap; 
    }
}

function stepForwardBubbleSort(array) {
    if(!isSorted(array)) {

        if(!lastStepHolder) {
            lastStepHolder = new BubbleSortHolder(array, 0, -1, -1, false);
        } else {
            let prevElement = document.getElementById('arrEl' + lastStepHolder.firstElement);
            let prevAnotherElement = document.getElementById('arrEl' + lastStepHolder.secondElement);
        
            prevElement.style.backgroundColor = '#F3D516';
            prevAnotherElement.style.backgroundColor = '#F3D516';
        }

        lastStepHolder = nextStepBubbleSort(array, lastStepHolder.lastIndex);
        console.log(lastStepHolder);
        let element = document.getElementById('arrEl' + lastStepHolder.firstElement);
        let anotherElement = document.getElementById('arrEl' + lastStepHolder.secondElement);
        
        if (lastStepHolder.swap) {

            element.style.backgroundColor = 'coral';
            anotherElement.style.backgroundColor = 'red';
            element.parentNode.insertBefore(anotherElement, element);
        }
        else {
            element.style.backgroundColor = 'blue';
            anotherElement.style.backgroundColor = 'lightblue';
        }
    }   
}
function bubbleSort(fromIndex) {

}
function nextStepBubbleSort(array, lastIndex) {
    if (!Array.isArray(array) || lastIndex < 0 || lastIndex >= array.length) {
        console.log("Input parameters are invalid");
        return; 
    }

    var swap = false; 
    if (array[lastIndex] > array[lastIndex + 1]) {
        var temp = array[lastIndex+1];
        array[lastIndex+1] = array[lastIndex];
        array[lastIndex] = temp; 
        swap = true; 
    }

    let bubbleSortHolder = new BubbleSortHolder(array, lastIndex, array[lastIndex+1], 
        array[lastIndex], swap);

    bubbleSortHolder.lastIndex++;  
    if(bubbleSortHolder.lastIndex + 1 == array.length) bubbleSortHolder.lastIndex = 0; 

    return bubbleSortHolder;
}


/* -------------------------------------------------------------------------- */
/*                                Text display                                */
/* -------------------------------------------------------------------------- */

function changeAlgorithmTextDisplay() {
    var algorithm = document.getElementById("algorithmSelected").innerHTML;
    var bottomTextDisplay = document.getElementById("bottomTextDisplay");

    var linenumber = bottomTextDisplay.childNodes.length; 

    bottomTextDisplay.insertAdjacentHTML("beforeEnd",
    '<p id="line' + linenumber + '" class="bottomTextDisplayText">You picked ' + algorithm +  '. Ready to sort....</p>'
    );
}
