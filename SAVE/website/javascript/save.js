'use strict';
let globalStorage = {
    fullSort : false, 
    currAlgorithm : undefined
}
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
            algorithmDropdownOption[i].addEventListener("click", (e) => {
                algorithmPicked(e);
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
        else currentAlgorithm = e.target.getAttribute("name");
    
        document.getElementsByName(previousAlgorithm)[0].style.display = "block"; 
        document.getElementsByName(currentAlgorithm)[0].style.display = "none";
        document.getElementById("algorithmSelected").innerHTML = 
            document.getElementsByName(currentAlgorithm)[0].innerHTML; 
    
        textUtils.changeAlgorithmTextDisplay();
    }
}
/* --------------------------------- Buttons -------------------------------- */
let buttons = {
    stepBack : function() {
        let arrayElements = document.getElementsByClassName('arrayElement');

        swap(arrayElements[0], arrayElements[4]);
        console.log("stepBack");
        return;
    }, 
    sort : function() {
        console.log("sort");
        bubbleSort.sort();
    },
    stepForward : function() {
        bubbleSort.initNextStep();
    },
    utils : {
        deactivateControlButtons : function() {
            let controlButtons = Array.from(document.getElementsByClassName('controlButton'));
        
            controlButtons.forEach(function(button) {
                button.disabled = true; 
            });
        }, 
        activateControlButtons : function() {
            let controlButtons = Array.from(document.getElementsByClassName('controlButton'));
        
            controlButtons.forEach(function(button) {
                button.disabled = false; 
            });
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
    }
}
let textUtils = {
    changeAlgorithmTextDisplay : function() {
        var algorithm = document.getElementById("algorithmSelected").innerHTML;
        var bottomTextDisplay = document.getElementById("bottomTextDisplay");
    
        var linenumber = bottomTextDisplay.childNodes.length; 
    
        bottomTextDisplay.insertAdjacentHTML("beforeEnd",
        '<p id="line' + linenumber + '" class="bottomTextDisplayText">You picked ' + algorithm +  '. Ready to sort....</p>'
        );
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
                animation.basicSwap.swapCallback(leftElement, rightElement, leftElementInner, rightElementInner);
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
        swapCallback : function(leftElement, rightElement, leftElementInner, rightElementInner, fullSort, currAlgorithm) {
            // reset the elements
            leftElement.style.backgroundColor = '';
            rightElement.style.backgroundColor = '';
            leftElement.style.border = 'solid 1px black';
            rightElement.style.border = 'solid 1px black';

            // remove inner elements
            leftElement.removeChild(leftElement.childNodes[0]);
            rightElement.removeChild(rightElement.childNodes[0]);

            // actually swap the elements
            leftElement.parentElement.replaceChild(leftElement.cloneNode(), rightElement, currAlgorithm);
            leftElement.parentElement.replaceChild(rightElement.cloneNode(), leftElement, currAlgorithm);

            buttons.utils.activateControlButtons(); 

            if (fullSort) currAlgorithm.sort();
        }
    },
    invisibleSwap : {
        invisibleSwap : function(leftElement, rightElement, fullSort, currAlgorithm) {
            let invisibleElement =  animation.utils.generateInvisibleChildForAnimation(rightElement);

            animation.utils.setTransitionEndListeners(invisibleElement, function() {
                animation.invisibleSwap.invisibleSwapCallback(leftElement, rightElement, invisibleElement, fullSort, currAlgorithm);
            }); 
            window.setTimeout(function() { invisibleElement.style.marginLeft = '250px'; }, 100);
        }, 
        invisibleSwapCallback : function(leftElement, rightElement, invisibleElement, fullSort, currAlgorithm) {
            invisibleElement.parentElement.removeChild(invisibleElement);
            leftElement.classList.remove('swapColor');
            rightElement.classList.remove('swapColor');
            buttons.utils.activateControlButtons();

            if (fullSort) currAlgorithm.sort();
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
            element.removeEventListener('webkitTransitionEnd', function(ev) {
                swapCallback(leftElement, rightElement, leftElementInner, rightElementInner, fullSort, currAlgorithm, ev);
            });
            element.removeEventListener('transitionEnd', function(ev) {
                swapCallback(leftElement, rightElement, leftElementInner, rightElementInner, fullSort, currAlgorithm, ev);
            });
            element.removeEventListener('msTransitionEnd', function(ev) {
                return callback; 
            });
            element.removeEventListener('oTransitionEnd', function(ev) {
                callback()
            });
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
        sort : function() {
            let array = arrayUtils.getArray(); 
            if(arrayUtils.isSorted(array)) {
                let bottomTextDisplay = document.getElementById('bottomTextDisplay'); 
                let linenumber = bottomTextDisplay.childNodes.length; 
                bottomTextDisplay.insertAdjacentHTML('beforeEnd',
                '<p id="line' + linenumber + '" class="bottomTextDisplayText">Array is sorted... Please reset to start sorting again.</p>');
            } else {
                this.initNextStep(array, true)
            }
        },
        initNextStep : function(array, fullSort) {
            if (bubbleSort.lastIndex == undefined) bubbleSort.lastIndex = -1; 
            if (array == undefined) array = arrayUtils.getArray(); 
            bubbleSort.nextStep(array, bubbleSort.lastIndex, fullSort);
        },
        nextStep : function (array, lastIndex, fullSort) {
            lastIndex == array.length -2 ? lastIndex = 0 : lastIndex++;

            if (array[lastIndex] > array[lastIndex+1]) {
                bubbleSort.prepareAndExecuteAnimation(array[lastIndex], array[lastIndex+1], fullSort);
                // print in console
            } else {
                bubbleSort.prepareAndFakeAnimation(array[lastIndex], array[lastIndex+1], fullSort);
                // print in console
            }
            bubbleSort.lastIndex = lastIndex; 
        },
        prepareAndExecuteAnimation : function (valueLeft, valueRight, fullSort) {
            let left = document.getElementById('arrEl' + valueLeft);
            let right = document.getElementById('arrEl' + valueRight);
            
            buttons.utils.deactivateControlButtons(); 
            animation.basicSwap.swap(left, right, fullSort, bubbleSort); 
        },
        prepareAndFakeAnimation : function (valueLeft, valueRight, fullSort) {
            let left = document.getElementById('arrEl' + valueLeft);
            let right = document.getElementById('arrEl' + valueRight);
            
            left.classList.add('swapColor');
            right.classList.add('swapColor');
            
            buttons.utils.deactivateControlButtons(); 
            animation.invisibleSwap.invisibleSwap(left, right, fullSort, bubbleSort); 
        }
}
/* -------------------------------------------------------------------------- */
/* ----------------------------------- END ---------------------------------- */
/* -------------------------------------------------------------------------- */




