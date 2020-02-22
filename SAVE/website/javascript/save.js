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

function deactivateControlButtons() {
    let controlButtons = Array.from(document.getElementsByClassName('controlButton'));

    controlButtons.forEach(function(button) {
        button.disabled = true; 
    });
}

function activateControlButtons() {
    let controlButtons = Array.from(document.getElementsByClassName('controlButton'));

    controlButtons.forEach(function(button) {
        button.disabled = false; 
    });
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
	var arrayDisplay = document.getElementById('arrayDisplay');
    var width = 90/(Number(size)+1);

    for (var i = 0; i < size; i++) {
        var value = Math.floor((Math.random()*5000)+1);
        var height = calcHeight(value);
        if(document.getElementById('arrEl' + value) != null) {
            i--; 
            continue; 
        }
        arrayDisplay.insertAdjacentHTML('beforeEnd', 
            '<div id="arrEl' + value + '" class="arrayElement" value="' + value + '" style="height:' + height + '%; width:' + width + '%";></div>');
    }
}

function deleteArray() {
    var arrayElements = document.getElementsByClassName('arrayElement');

    while(arrayElements[0]) {
        arrayElements[0].parentNode.removeChild(arrayElements[0]);
    }
}

function generateChildForAnimation(arrayElement) {
    let element = document.createElement('div');
    let elementId = document.createAttribute('id');
    elementId.value = arrayElement.id + 'Inner';
    let elementStyle = document.createAttribute('style');
    elementStyle.value='box-sizing: border-box;';
    let elementClass = document.createAttribute('class');
    elementClass.value = 'swap';

    element.setAttributeNode(elementId);
    element.setAttributeNode(elementClass);
    element.setAttributeNode(elementStyle);

    arrayElement.appendChild(element);
    return element; 

}

function swap(leftElement, rightElement) {
    // generate inner divs for animation
    let leftElementInner = generateChildForAnimation(leftElement);
    let rightElementInner = generateChildForAnimation(rightElement);

    // callbacks for end of transition
    rightElementInner.addEventListener('webkitTransitionEnd', function(ev) {
        swapCallback(leftElement, rightElement, leftElementInner, rightElementInner, ev);
    });
    rightElementInner.addEventListener('transitionEnd', function(ev) {
        swapCallback(leftElement, rightElement, leftElementInner, rightElementInner, ev);
    });
    rightElementInner.addEventListener('msTransitionEnd', function(ev) {
        swapCallback(leftElement, rightElement, leftElementInner, rightElementInner, ev);
    });
    rightElementInner.addEventListener('oTransitionEnd', function(ev) {
        swapCallback(leftElement, rightElement, leftElementInner, rightElementInner, ev);
    });
    
    let travelDistanceLeft = rightElement.getBoundingClientRect().left - leftElement.getBoundingClientRect().left  + 'px'; // for left element
    let travelDistanceRight = leftElement.getBoundingClientRect().right - rightElement.getBoundingClientRect().right  + 'px';  // for right element

    // make colors and borders same as background
    leftElement.style.backgroundColor = '#393939'; // maybe don't hard code this
    rightElement.style.backgroundColor = '#393939';
    leftElement.style.borderWidth = '0'; // maybe don't hard code this
    rightElement.style.borderWidth = '0';

    // animate left element
    leftElementInner.style.backgroundColor = 'pink';  // maybe don't hard code this
    leftElementInner.style.height = leftElement.clientHeight + 'px';
    leftElementInner.style.width = leftElement.clientWidth + 'px'; 
    leftElementInner.style.position = 'absolute';
    leftElementInner.style.border = 'solid 1px black'; 
    window.setTimeout(function() { leftElementInner.style.marginLeft = travelDistanceLeft; }, 100);

    // animate right element
    rightElementInner.style.backgroundColor = 'pink'; // maybe don't hard code this
    rightElementInner.style.height = rightElement.clientHeight  + 'px';
    rightElementInner.style.width = rightElement.clientWidth  + 'px'; 
    rightElementInner.style.position = 'absolute';
    rightElementInner.style.border = 'solid 1px black';
    window.setTimeout(function() { rightElementInner.style.marginLeft = travelDistanceRight; }, 100);
    
}

function swapCallback(leftElement, rightElement, leftElementInner, rightElementInner, ev) {
        // TODO remove event listeners    
        // reset the elements
        leftElement.style.backgroundColor = '';
        rightElement.style.backgroundColor = '';
        leftElement.style.border = 'solid 1px black';
        rightElement.style.border = 'solid 1px black';

        // remove inner elements
        leftElement.removeChild(leftElement.childNodes[0]);
        rightElement.removeChild(rightElement.childNodes[0]);

        // actually swap the elements
        leftElement.parentElement.replaceChild(leftElement.cloneNode(), rightElement);
        leftElement.parentElement.replaceChild(rightElement.cloneNode(), leftElement);

        activateControlButtons(); 
}
function generateInvisibleChildForAnimation(arrayElement) {
    let element = document.createElement('div');
    let elementId = document.createAttribute('id');
    elementId.value = arrayElement.id + 'Invisible';
    let elementStyle = document.createAttribute('style');
    elementStyle.value='position: absolute;';
    let elementClass = document.createAttribute('class');
    elementClass.value = 'invisibleSwap';
    element.setAttributeNode(elementId);
    element.setAttributeNode(elementClass);
    element.setAttributeNode(elementStyle);
    arrayElement.appendChild(element);
    return element; 

}
function invisibleSwap(leftElement, rightElement) {
    let invisibleElement = generateInvisibleChildForAnimation(rightElement);

    // callbacks for end of transition
    invisibleElement.addEventListener('webkitTransitionEnd', function(ev) {
        invisibleSwapCallback(leftElement, rightElement, invisibleElement); 
    });
    invisibleElement.addEventListener('transitionEnd', function(ev) {
        invisibleSwapCallback(leftElement, rightElement, invisibleElement); 
    });
    invisibleElement.addEventListener('msTransitionEnd', function(ev) {
        invisibleSwapCallback(leftElement, rightElement, invisibleElement);  
    });
    invisibleElement.addEventListener('oTransitionEnd', function(ev) {
        invisibleSwapCallback(leftElement, rightElement, invisibleElement); 
    });
    window.setTimeout(function() { invisibleElement.style.marginLeft = '250px'; }, 100);
}

function invisibleSwapCallback(leftElement, rightElement, invisibleElement) {
    // TODO remove event listeners
    invisibleElement.parentElement.removeChild(invisibleElement);
    leftElement.classList.remove('swapColor');
    rightElement.classList.remove('swapColor');
    activateControlButtons();
}

/* --------------------------------- Helper --------------------------------- */
function calcHeight(height) {
    return height * 0.0178 + 1; // Map height [1-5000] to [1-90]
}


/* -------------------------------------------------------------------------- */
/*                            Sorting functionality                           */
/* -------------------------------------------------------------------------- */

function stepBack() {
    let arrayElements = document.getElementsByClassName('arrayElement');

    swap(arrayElements[0], arrayElements[4]);
    console.log("stepBack");
    return;
}

function sort() {
    console.log("sort");
    let array = getArray(); 

    if(isSorted(array)) {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        let linenumber = bottomTextDisplay.childNodes.length; 
        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p id="line' + linenumber + '" class="bottomTextDisplayText">Array is sorted... Please reset to start sorting again.</p>');
    } else {
        bubbleSort.sort(array);
    } 
}

function stepForward() {
    let array = getArray(); 
    
    if(isSorted(array)) {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        let linenumber = bottomTextDisplay.childNodes.length; 
        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p id="line' + linenumber + '" class="bottomTextDisplayText">Array is sorted... Please reset to start sorting again.</p>');
    } else {
        bubbleSort.initNextStep(array);
    } 
}

function getArray() {
    let array = [].slice.call(document.getElementsByClassName('arrayElement'));
    return array.map(x => parseInt(x.getAttribute('value')));  
}

function isSorted(array) {
    for(let i = 0; i < array.length-1; i++) {
        if (array[i] > array[i+1]) return false; 
    }
    return true; 
}



/* ------------------------------- Bubble Sort ------------------------------ */
// TODO reset everything if array size changes

let bubbleSort = {
        lastIndex : undefined, 
        initNextStep : function(array) {
            if (bubbleSort.lastIndex == undefined) bubbleSort.lastIndex = -1; 
            bubbleSort.nextStep(array, bubbleSort.lastIndex);
        },
        nextStep : function (array, lastIndex) {
            lastIndex == array.length -2 ? lastIndex = 0 : lastIndex++;

            if (array[lastIndex] > array[lastIndex+1]) {
                bubbleSort.prepareAndExecuteAnimation(array[lastIndex], array[lastIndex+1]);
                // print in console
            } else {
                bubbleSort.prepareAndFakeAnimation(array[lastIndex], array[lastIndex+1]);
                // print in console
            }
            bubbleSort.lastIndex = lastIndex; 
        },
        prepareAndExecuteAnimation : function (valueLeft, valueRight) {
            let left = document.getElementById('arrEl' + valueLeft);
            let right = document.getElementById('arrEl' + valueRight);
            
            deactivateControlButtons(); 
            swap(left, right); 
        },
        prepareAndFakeAnimation : function (valueLeft, valueRight) {
            let left = document.getElementById('arrEl' + valueLeft);
            let right = document.getElementById('arrEl' + valueRight);
            
            left.classList.add('swapColor');
            right.classList.add('swapColor');
            
            deactivateControlButtons(); 
            invisibleSwap(left, right); 
        }
}
/* 
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
*/

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
