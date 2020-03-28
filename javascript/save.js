'use strict';
let globalStorage = {
    fullSort : false, // needed so that animation callbacks can initiate the next step
    currAlgorithm : undefined, // needed so that animation callbacks can call correct algorithm
    running : false, // needed so that the algorithm can stop when user presses stop
}




// TODO deactivate dropdown if sorting
// TODO comments
// TODO restructure when done with bubblesort
// TODO scrollbar at bottom
// TODO if algorithm changes reset last index ????
// TODO different event on slider because it resets array twice
/* -------------------------------------------------------------------------- */
/*                                   General                                  */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Init ---------------------------------- */
let init = {
    setUp : function() {
        document.getElementsByName("Bubblesort")[0].style.display = "none";
        init.initializeEventHandlers(); 
        arrayUtils.changeArraySize(2);
        init.initAlgorithmDropdown(); 
    }, 
    initializeEventHandlers : function() {
        init.setEventHandlersForDropdown(); 
        document.getElementById("stepBack").addEventListener("click", buttons.stepBack);
        document.getElementById("sort").addEventListener("click", buttons.sort);
        document.getElementById("stepForward").addEventListener("click", buttons.stepForward);
        document.getElementById("arraySizeSlider").addEventListener("input", arrayUtils.changeArraySize);
        document.getElementById("arraySizeSlider").addEventListener("change", arrayUtils.changeArraySize);
        document.getElementById("arraySizeInput").addEventListener("input", arrayUtils.changeArraySize);
    }, 
    setEventHandlersForDropdown : function () {
        let algorithmDropdownOption = document.getElementsByClassName("algorithmDropdownOption");
    
        for(var i = 0; i < algorithmDropdownOption.length; i++) {
            algorithmDropdownOption[i].addEventListener("click", function(e) {
                dropdown.algorithmPicked(e);
            });
        }
    }, 
    initAlgorithmDropdown : function() {
        var initAlgorithm = document.getElementsByClassName("algorithmDropdownOption")[0].attributes.getNamedItem("name").value;
        dropdown.algorithmPicked(initAlgorithm);
    }
}

document.addEventListener('DOMContentLoaded', init.setUp); 
/* -------------------------------- Dropdown -------------------------------- */
let dropdown = {
    algorithmPicked : function(e) {
        var previousAlgorithm = document.getElementById("algorithmSelected").innerHTML;
        var currentAlgorithm; 
    
        if (typeof e === 'string') currentAlgorithm = e; 
        else currentAlgorithm = e.target.getAttribute('name');
    
        document.getElementsByName(previousAlgorithm)[0].style.display = 'block'; 
        document.getElementsByName(currentAlgorithm)[0].style.display = 'none';
        document.getElementById('algorithmSelected').innerHTML = document.getElementsByName(currentAlgorithm)[0].innerHTML; 
        
        var visisbleDropdownOptions = Array.from(document.getElementsByClassName('algorithmDropdownOptions'));

        textUtils.changeAlgorithm();
    }
}
/* --------------------------------- Buttons -------------------------------- */
let buttons = {
    stepBack : function() {
        let selectedAlgorithm = document.getElementById("algorithmSelected").innerHTML;
        if (selectedAlgorithm === 'Bubblesort') {
            globalStorage.currAlgorithm = bubbleSort;
            bubbleSort.initBackStep(); 
        } else if (selectedAlgorithm === 'Shakersort') {
            globalStorage.currAlgorithm = shakerSort;
            shakerSort.initBackStep(); 
        }
        return;
    }, 
    sort : function() {
        let selectedAlgorithm = document.getElementById("algorithmSelected").innerHTML;
        globalStorage.running = true; 
        globalStorage.fullSort = true;  
        buttons.utils.switchToStopButton(); 
        if (selectedAlgorithm === 'Bubblesort') {
            globalStorage.currAlgorithm = bubbleSort;
            bubbleSort.sort(); 
        } else if (selectedAlgorithm === 'Shakersort') {
            globalStorage.currAlgorithm = shakerSort;
            shakerSort.sort(); 
        }

    },
    stepForward : function() {
        let selectedAlgorithm = document.getElementById("algorithmSelected").innerHTML;
        globalStorage.fullSort = false; 
        if (selectedAlgorithm === 'Bubblesort') {
            globalStorage.currAlgorithm = bubbleSort;
            bubbleSort.initNextStep(); 
        } else if (selectedAlgorithm === 'Shakersort') {
            globalStorage.currAlgorithm = shakerSort;
            shakerSort.initNextStep(); 
        }
    },
    stopButtonClicked : function() {
        buttons.utils.switchToSortButton(); 
        buttons.utils.activateControlButtons(); 
        textUtils.stopped(); 
        globalStorage.running = false; 
    },
    utils : {
        deactivateControlButtons : function() {
            let controlButtons = Array.from(document.getElementsByClassName('controlElement'));
        
            controlButtons.forEach(function(button) {
                button.disabled = true; 
            });
        }, 
        activateControlButtons : function() {
            let controlButtons = Array.from(document.getElementsByClassName('controlElement'));
        
            controlButtons.forEach(function(button) {
                button.disabled = false; 
            });
        }, 
        switchToStopButton : function() {
            
            let sortButton = document.getElementById('sort');
            let parentOfSortButton = sortButton.parentElement; 
            parentOfSortButton.removeChild(sortButton);

            let stopButton = document.createElement('button'); 
            let stopButtonId = document.createAttribute('id');
            stopButtonId.value = 'stop';
            let stopButtonClass = document.createAttribute('class');
            stopButtonClass.value = 'controlButton';
            
            stopButton.setAttributeNode(stopButtonId);
            stopButton.setAttributeNode(stopButtonClass);

            stopButton.innerHTML = 'Stop';
            stopButton.addEventListener('click', buttons.stopButtonClicked);
             
            parentOfSortButton.appendChild(stopButton);
            buttons.utils.deactivateControlButtons();
        }, 
        switchToSortButton : function() {
            let stopButton = document.getElementById('stop');
            let parentOfStopButton = stopButton.parentElement; 
            parentOfStopButton.removeChild(stopButton);

            let sortButton = document.createElement('button'); 
            let sortButtonId = document.createAttribute('id');
            sortButtonId.value = 'sort';
            let sortButtonClass = document.createAttribute('class');
            sortButtonClass.value = 'controlButton controlElement';
            
            sortButton.setAttributeNode(sortButtonId);
            sortButton.setAttributeNode(sortButtonClass);

            sortButton.innerHTML = 'Sort';
            sortButton.addEventListener('click', buttons.sort);

            parentOfStopButton.appendChild(sortButton);
            buttons.utils.activateControlButtons();

        }
    }
}
/* -------------------------------------------------------------------------- */
/* ----------------------------------- END ---------------------------------- */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */
let arrayUtils = {
    changeArraySize : function(e) {
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
        arrayUtils.deleteArray(); 
        arrayUtils.generateNewArray(arraySize);
        generalUtils.resetForArraySizeChange(); 
    },
    generateNewArray : function(size) {
        var arrayDisplay = document.getElementById('arrayDisplay');
        var width = 90/(Number(size)+1);
    
        for (var i = 0; i < size; i++) {
            var value = Math.floor((Math.random()*5000)+1);
            var height = arrayUtils.calcHeight(value);
            if(document.getElementById('arrEl' + value) != null) {
                i--; 
                continue; 
            }
            arrayDisplay.insertAdjacentHTML('beforeEnd', 
                '<div id="arrEl' + value + '" class="arrayElement" value="' + value + '" style="height:' + height + '%; width:' + width + '%";></div>');
        }
    }, 
    deleteArray : function() {
        var arrayElements = document.getElementsByClassName('arrayElement');

        while(arrayElements[0]) {
            arrayElements[0].parentNode.removeChild(arrayElements[0]);
        }
    }, 
    getArray : function() {
        let array = [].slice.call(document.getElementsByClassName('arrayElement'));
        return array.map(x => parseInt(x.getAttribute('value'))); 
    },
    isSorted : function(array) {
        for(let i = 0; i < array.length-1; i++) {
            if (array[i] > array[i+1]) return false; 
        }
        return true; 
    }, 
    calcHeight : function(height) {
        return height * 0.0178 + 1; // Map height [1-5000] to [1-90]
    }, 
    isEqual(array, anotherArray) { // works if arrays do not contain objects
        return JSON.stringify(array)==JSON.stringify(anotherArray);
    }
}
let textUtils = {
    changeAlgorithm : function() {
        var algorithm = document.getElementById("algorithmSelected").innerHTML;
        var bottomTextDisplay = document.getElementById("bottomTextDisplay"); 
        bottomTextDisplay.insertAdjacentHTML("beforeEnd",
        '<p class="bottomTextDisplayText">You picked ' + algorithm +  '. Ready to sort....</p>');
    },
    sorted : function() {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p class="bottomTextDisplayText">Array is sorted... Please reset to start sorting again.</p>');
    }, 
    swapTwoElements : function(valueOne, valueTwo, step) {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p id="' + globalStorage.currAlgorithm.name + '-' + step + '" class="bottomTextDisplayText" value="' + globalStorage.currAlgorithm.name + '-' + valueOne + '-'  + valueTwo + '-' + 'S">Swapping elements [' + valueOne + '] and [' + valueTwo + ']</p>');
    }, 
    notSwapTwoElements : function(valueOne, valueTwo, step) {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p id="' + globalStorage.currAlgorithm.name + '-' + step + '" class="bottomTextDisplayText" value="' + globalStorage.currAlgorithm.name + '-' + valueOne + '-'  + valueTwo + '-' + 'N">Checked elements [' + valueOne + '] and [' + valueTwo + ']. Not swapping...</p>');
    }, 
    reverseTwoElements : function(valueOne, valueTwo, step) {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        let lastStep = document.getElementById(globalStorage.currAlgorithm.name + '-' + globalStorage.currAlgorithm.steps);

        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p class="bottomTextDisplayText">Reverting: { ' + lastStep.innerHTML  + '} </p>');

        lastStep.id += 'REVERSED';
    },
    stopped : function() {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p class="bottomTextDisplayText">Stop button clicked. Stopped sorting...</p>');
    }, 
    originalState : function() {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        let linenumber = bottomTextDisplay.childNodes.length; 
        bottomTextDisplay.insertAdjacentHTML('beforeEnd',
        '<p class="bottomTextDisplayText">Array is in original state. Can\'t step back!</p>');
    }, 
    adjustScroll : function() {
        let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
        bottomTextDisplay.parentElement.scrollTop = bottomTextDisplay.parentElement.scrollHeight;
    }
}
let generalUtils = {
    resetForArraySizeChange : function() {
        bubbleSort.lastIndex = undefined; 
        shakerSort.lastIndex = undefined; 
        shakerSort.forward = undefined; 
        shakerSort.beginIndex = undefined; 
        shakerSort.endIndex = undefined; 
    }
}
/* -------------------------------------------------------------------------- */
/* ----------------------------------- END ---------------------------------- */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                  Animation                                 */
/* -------------------------------------------------------------------------- */
let animation = {
    basicSwap : {
        swap : function(leftElement, rightElement) {
            // generate inner divs for animation
            let leftElementInner = animation.utils.generateChildForAnimation(leftElement);
            let rightElementInner = animation.utils.generateChildForAnimation(rightElement);

            // callbacks for end of transition
            animation.utils.setTransitionEndListeners(rightElementInner, function callback() {
                animation.basicSwap.swapCallback(leftElement, rightElement);
            });
            
            // Calculate margins for animation
            let travelDistanceLeft = rightElement.getBoundingClientRect().left - leftElement.getBoundingClientRect().left  + 'px'; 
            let travelDistanceRight = leftElement.getBoundingClientRect().right - rightElement.getBoundingClientRect().right  + 'px';  

            // make colors and borders same as background
            leftElement.style.backgroundColor = '#393939'; // maybe don't hard code this
            rightElement.style.backgroundColor = '#393939';
            leftElement.style.borderWidth = '0'; // maybe don't hard code this
            rightElement.style.borderWidth = '0';

            // animate left element
            leftElementInner.style.backgroundColor = '#ADFF2F';  // maybe don't hard code this
            leftElementInner.style.height = leftElement.clientHeight + 'px';
            leftElementInner.style.width = leftElement.clientWidth + 'px'; 
            leftElementInner.style.position = 'absolute';
            leftElementInner.style.border = 'solid 1px black'; 
            window.setTimeout(function() { leftElementInner.style.marginLeft = travelDistanceLeft; }, 100);

            // animate right element
            rightElementInner.style.backgroundColor = '#ADFF2F'; // maybe don't hard code this
            rightElementInner.style.height = rightElement.clientHeight  + 'px';
            rightElementInner.style.width = rightElement.clientWidth  + 'px'; 
            rightElementInner.style.position = 'absolute';
            rightElementInner.style.border = 'solid 1px black';
            window.setTimeout(function() { rightElementInner.style.marginLeft = travelDistanceRight; }, 100);
        }, 
        swapCallback : function(leftElement, rightElement) {
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

            buttons.utils.activateControlButtons(); 
            textUtils.adjustScroll(); // in callback because it considers new text
            if (globalStorage.fullSort) globalStorage.currAlgorithm.sort();

            
        }
    },
    invisibleSwap : {
        invisibleSwap : function(leftElement, rightElement) {
            let invisibleElement =  animation.utils.generateInvisibleChildForAnimation(rightElement);

            animation.utils.setTransitionEndListeners(invisibleElement, function() {
                animation.invisibleSwap.invisibleSwapCallback(leftElement, rightElement, invisibleElement);
            }); 
            window.setTimeout(function() { invisibleElement.style.marginLeft = '250px'; }, 100);
        }, 
        invisibleSwapCallback : function(leftElement, rightElement, invisibleElement) {
            invisibleElement.parentElement.removeChild(invisibleElement);
            leftElement.classList.remove('swapColor');
            rightElement.classList.remove('swapColor');
            buttons.utils.activateControlButtons();
            textUtils.adjustScroll(); // in callback because it considers new text
            if (globalStorage.fullSort) globalStorage.currAlgorithm.sort();

            
        }
    },
    utils : {
        generateChildForAnimation : function(arrayElement) {
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
        }, 
        generateInvisibleChildForAnimation : function(arrayElement) {
            let invisibleElement = document.createElement('div');
            let elementId = document.createAttribute('id');
            elementId.value = arrayElement.id + 'Invisible';
            let elementStyle = document.createAttribute('style');
            elementStyle.value='position: absolute;';
            let elementClass = document.createAttribute('class');
            elementClass.value = 'invisibleSwap';
            invisibleElement.setAttributeNode(elementId);
            invisibleElement.setAttributeNode(elementClass);
            invisibleElement.setAttributeNode(elementStyle);
            arrayElement.appendChild(invisibleElement);
            return invisibleElement; 
        }, 
        setTransitionEndListeners : function(element, callback) {
            // callbacks for end of transition
            element.addEventListener('webkitTransitionEnd', callback);
            element.addEventListener('transitionEnd', callback);
            element.addEventListener('msTransitionEnd', callback);
            element.addEventListener('oTransitionEnd', callback);
        },
        removeTransitionEndListeners : function(element) {

        }
    }
}
/* -------------------------------------------------------------------------- */
/* ----------------------------------- END ---------------------------------- */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Sorting algorithms                             */
/* -------------------------------------------------------------------------- */
let bubbleSort = {
        lastIndex : undefined,
        steps : undefined,
        name : 'Bubblesort',
        sort : function() {
            let array = arrayUtils.getArray(); 
            if (arrayUtils.isSorted(array)) {
                globalStorage.running = false; 
                globalStorage.fullSort = false; 
                buttons.utils.switchToSortButton(); 
                textUtils.sorted(); 
            } else if (!globalStorage.running) {  // if stop button is clicked while running
                globalStorage.fullSort = false; 
                return; 
            } else {
                bubbleSort.initNextStep(array);  
            }
        },
        initNextStep : function(array) {
            if (array == undefined) {
                array = arrayUtils.getArray(); 
            }
            if (arrayUtils.isSorted(array)) {
                textUtils.sorted();
                return; 
            }
            if (bubbleSort.lastIndex == undefined) bubbleSort.lastIndex = -1; 
            bubbleSort.steps == undefined ? bubbleSort.steps = 0 : bubbleSort.steps++;
            bubbleSort.nextStep(array, bubbleSort.lastIndex);
        }, 
        nextStep : function (array, lastIndex) {
            lastIndex == array.length -2 ? lastIndex = 0 : lastIndex++;

            if (array[lastIndex] > array[lastIndex+1]) bubbleSort.prepareAndExecuteAnimation(array[lastIndex], array[lastIndex+1], false);
            else bubbleSort.prepareAndFakeAnimation(array[lastIndex], array[lastIndex+1], false);
            
            bubbleSort.lastIndex = lastIndex; 
        },
        initBackStep : function() {
            let array = arrayUtils.getArray();
            // if there is no previous step
            if (bubbleSort.steps == undefined) { 
                textUtils.originalState();  
            } else {
                bubbleSort.backStep(array, bubbleSort.lastIndex); 
                if (bubbleSort.steps === 0) bubbleSort.steps = undefined; 
                else bubbleSort.steps--;
            }
        }, 
        backStep : function(array, lastIndex) {
            let lastStep = document.getElementById(bubbleSort.name + '-' + bubbleSort.steps);
            let lastStepValues = lastStep.getAttribute('value').split('-');
            
            if(lastStepValues[3] === 'S') {
                bubbleSort.prepareAndExecuteAnimation(lastStepValues[1], lastStepValues[2], true);
            } else {
                bubbleSort.prepareAndFakeAnimation(lastStepValues[1], lastStepValues[2], true);
            }
            lastIndex == 0 ? lastIndex = array.length - 2 : lastIndex--;

            bubbleSort.lastIndex = lastIndex; 
        },
        prepareAndExecuteAnimation : function (valueLeft, valueRight, reverse) {
            let left = document.getElementById('arrEl' + valueLeft);
            let right = document.getElementById('arrEl' + valueRight);
            
            if (reverse) textUtils.reverseTwoElements(valueLeft, valueRight, bubbleSort.steps);  
            else textUtils.swapTwoElements(valueLeft, valueRight, bubbleSort.steps);

            buttons.utils.deactivateControlButtons(); 
            animation.basicSwap.swap(left, right); 
        },
        prepareAndFakeAnimation : function (valueLeft, valueRight, reverse) {
            let left = document.getElementById('arrEl' + valueLeft);
            let right = document.getElementById('arrEl' + valueRight);
            
            left.classList.add('swapColor');
            right.classList.add('swapColor');
            
            if (reverse) textUtils.reverseTwoElements(valueLeft, valueRight, bubbleSort.steps); 
            else textUtils.notSwapTwoElements(valueLeft, valueRight, bubbleSort.steps);

            buttons.utils.deactivateControlButtons(); 
            animation.invisibleSwap.invisibleSwap(left, right); 
        }
}

let shakerSort = {
    lastIndex : undefined, 
    beginIndex : undefined,
    endIndex : undefined, 
    steps : undefined, 
    forward : undefined, 
    name : 'Shakersort',

    sort : function() {
        let array = arrayUtils.getArray(); 
        if (arrayUtils.isSorted(array)) {
            globalStorage.running = false; 
            globalStorage.fullSort = false;
            buttons.utils.switchToSortButton(); 
            textUtils.sorted(); 
        } else if (!globalStorage.running) { // if stop button is clicked while running
            globalStorage.fullSort = false; 
        } else {
            shakerSort.initNextStep(array);
        }
    }, 
    initNextStep : function(array) {
        if (array == undefined) {
            array = arrayUtils.getArray(); 
        }
        if (arrayUtils.isSorted(array)) {
            textUtils.sorted();
            return; 
        }
        if (shakerSort.lastIndex == undefined) shakerSort.lastIndex = 0; 
        if (shakerSort.beginIndex == undefined) shakerSort.beginIndex = 0; 
        if (shakerSort.endIndex == undefined) shakerSort.endIndex = array.length -1; 
        if (shakerSort.forward == undefined) shakerSort.forward = true; 
        shakerSort.steps == undefined ? shakerSort.steps = 0 : shakerSort.steps++;
        shakerSort.nextStep(array, shakerSort.lastIndex);
    }, 
    nextStep : function(array, lastIndex) {
        if (shakerSort.forward) {
            if (lastIndex < shakerSort.endIndex) {
                if (array[lastIndex] > array[lastIndex+1]) {
                    shakerSort.prepareAndExecuteAnimation(array[lastIndex], array[lastIndex+1], false); 
                } else {
                    shakerSort.prepareAndFakeAnimation(array[lastIndex], array[lastIndex+1], false); 
                }
                if (lastIndex + 1 == shakerSort.endIndex) {
                    shakerSort.forward = false; 
                    shakerSort.endIndex = lastIndex; 
                } else {
                    lastIndex++; 
                }
            } 
        } else {
            if (lastIndex > shakerSort.beginIndex) {
                if (array[lastIndex - 1] > array[lastIndex]) {
                    shakerSort.prepareAndExecuteAnimation(array[lastIndex], array[lastIndex-1], false); 
                } else {
                    shakerSort.prepareAndFakeAnimation(array[lastIndex], array[lastIndex-1], false);
                }
                if (lastIndex -1 == shakerSort.beginIndex) {
                    shakerSort.forward = true; 
                    shakerSort.beginIndex = lastIndex; 
                } else {
                    lastIndex--;
                }
            }
        }
        shakerSort.lastIndex = lastIndex; 
  
    },
    prepareAndExecuteAnimation : function (valueLeft, valueRight, reverse) {
        let left = document.getElementById('arrEl' + valueLeft);
        let right = document.getElementById('arrEl' + valueRight);
        
        if (reverse) textUtils.reverseTwoElements(valueLeft, valueRight, shakerSort.steps);  
        else textUtils.swapTwoElements(valueLeft, valueRight, shakerSort.steps);

        buttons.utils.deactivateControlButtons(); 
        animation.basicSwap.swap(left, right); 
    },
    prepareAndFakeAnimation : function (valueLeft, valueRight, reverse) {
        let left = document.getElementById('arrEl' + valueLeft);
        let right = document.getElementById('arrEl' + valueRight);
        
        left.classList.add('swapColor');
        right.classList.add('swapColor');
        
        if (reverse) textUtils.reverseTwoElements(valueLeft, valueRight, shakerSort.steps); 
        else textUtils.notSwapTwoElements(valueLeft, valueRight, shakerSort.steps);

        buttons.utils.deactivateControlButtons(); 
        animation.invisibleSwap.invisibleSwap(left, right); 
    },
    initBackStep : function() {
        let array = arrayUtils.getArray();
        // if there is no previous step
        if (shakerSort.steps == undefined) { 
            textUtils.originalState();  
        } else {
            shakerSort.backStep(array, shakerSort.lastIndex); 
            if (shakerSort.steps === 0) shakerSort.steps = undefined; 
            else shakerSort.steps--;
        }
    }, 
    backStep: function(array, lastIndex) {
        let lastStep = document.getElementById(shakerSort.name + '-' + shakerSort.steps);
        let lastStepValues = lastStep.getAttribute('value').split('-');
        
        if (shakerSort.forward) {
            if (lastIndex == shakerSort.beginIndex) {
                shakerSort.forward = false; 
                shakerSort.beginIndex = lastIndex - 1; 
            } else {
                lastIndex--;
            }
        } else {
            if (lastIndex == shakerSort.endIndex) {
                shakerSort.forward = true; 
                shakerSort.endIndex = lastIndex + 1; 
            } else {
                lastIndex++; 
            }
        }
         
        if (lastStepValues[3] === 'S') {
            shakerSort.prepareAndExecuteAnimation(lastStepValues[1], lastStepValues[2], true);
        } else {
            shakerSort.prepareAndFakeAnimation(lastStepValues[1], lastStepValues[2], true);
        }
        
        shakerSort.lastIndex = lastIndex; 
    }
}
/* -------------------------------------------------------------------------- */
/* ----------------------------------- END ---------------------------------- */
/* -------------------------------------------------------------------------- */




