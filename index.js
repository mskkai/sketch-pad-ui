
//Variable Declaration

var pastCoordinates = null;
var sketchpad = null;
var tool = null;
var parentCanvas = null;
var parentContext = null;
var childCanvas = null;
var colorCanvas = null;
var colorContext = null;
var mup = 0;

var noimage = false;
var startCurve = false;
var creset = false;
var count = 0;
var ccount = 0;
var su = 0;
var sv = 0;
var tu = 0;
var tv = 0;
var csu = 0;
var csv = 0;
var ctu = 0;
var ctv = 0;
var cx1 = 0;
var cy1;
var cx2;
var cy2;
var red = 0;
var blue = 0;
var green = 0;
var strokeColor = "black";
var fillColor = "black";
var color = null;


//On load function that creates the canvas
window.onload = function () {

    // if (navigator.userAgent == "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7") {
    //     document.getElementById('imageTemp').style.top = 74;

    // }
    // else {

    //     document.getElementById('imageTemp').style.top = 74;
    // }

    var isMobileDevice = window.matchMedia("(hover: none),(pointer: coarse)").matches

    if (isMobileDevice) {
        document.getElementById("mobile-info").style.display = "flex";
    } else {

        document.getElementById("sketch-pad").style.display = "flex";
        document.onkeydown = cancelRefresh;

        //Color picker functions
        colorCanvas = document.getElementById("colorpick");
        colorContext = colorCanvas.getContext("2d");
        colorContext.fillText("Stroke color", 30, 137);
        colorContext.fillText("Fill color", 155, 137);
        colorContext.strokeRect(0, 140, 120, 60);
        colorContext.strokeRect(124, 140, 120, 60);

        for (row = 0; row < 8; row += 1) {
            red = 0;
            blue = 0;
            green = 0;
            for (var x = 0; x < 256; x += 1) {

                var imageD = colorContext.createImageData(5, 16);
                var dummy = imageD.data;
                for (var i = 0; i < dummy.length; i += 4) {
                    dummy[i] = red;
                    dummy[i + 1] = green;
                    dummy[i + 2] = blue;
                    dummy[i + 3] = 255;
                }
                if (row == 1) {
                    red += 1;
                }
                if (row == 2) {
                    green += 1;
                }
                if (row == 3) {
                    red += 1;
                    green += 1;
                }
                if (row == 4) {
                    blue += 1;
                }
                if (row == 5) {
                    red += 1;
                    blue += 1;
                }
                if (row == 6) {
                    green += 1;
                    blue += 1;
                }
                if (row == 7) {
                    red += 1;
                    green += 1;
                    blue += 1;
                }
                colorContext.putImageData(imageD, x, row * 16);
            }
        }
        colorCanvas.onmousedown = rgbcolor;

        //Tools functions
        tool = document.createElement('input');
        tool.id = "drawingTool";
        tool.value = "pencil";
        tool.type = "button";

        pastCoordinates = Array();
        parentCanvas = document.getElementById('myCanvas');
        parentContext = parentCanvas.getContext('2d');
        sketchpad = parentCanvas.parentNode;

        childCanvas = document.createElement('canvas');
        childCanvas.id = 'imageTemp';
        childCanvas.width = parentCanvas.width;
        childCanvas.height = parentCanvas.height;
        childCanvas = document.getElementById('imageTemp');
        childContext = childCanvas.getContext("2d");

        sketchpad.appendChild(childCanvas);
        childContext.beginPath();


        childCanvas.onmousedown = beginProcess;
        childCanvas.onmouseup = endProcess;

    }
};


//On mouse click this function resets the values and calls mousemove functionality
function changeToolValue(newvalue) {
    tool.value = newvalue;
}


function beginProcess(e) {
    reset();
    pastCoordinates[0] = getCurrentCoordinates(e);
    childCanvas.onmousemove = draw;
    return false;
}

//Getting coordinates of mouse
function getCurrentCoordinates(e) {

    if (e.offsetX) {
        return { x: e.offsetX, y: e.offsetY };
    }
    else if (e.layerX) {
        return { x: e.layerX, y: e.layerY };
    }
    else {
        return { x: e.pageX - canvas.offsetLeft, y: e.pageY - canvas.offsetTop };
    }
}


//Mouse move function
function draw(e) {

    var currentCoordinates = getCurrentCoordinates(e);
    pastCoordinates[0] = drawtool(pastCoordinates[0].x, pastCoordinates[0].y, currentCoordinates.x, currentCoordinates.y);

    childContext.strokeStyle = strokeColor;
    childContext.fillStyle = fillColor;

    var size = document.getElementById('linewidth');
    if (tool.value == "pencil" && size.value == 5)
        childContext.lineWidth = 2;
    else if (tool.value == "pencil" && size.value == 10)
        childContext.lineWidth = 3;
    else if (tool.value == "brush" && size.value == 5)
        childContext.lineWidth = 15;
    else if (tool.value == "brush" && size.value == 10)
        childContext.lineWidth = 20;
    else if (tool.value == "brush" && size.value == 1)
        childContext.lineWidth = 10;
    else
        childContext.lineWidth = size.value;

    var outLine = document.getElementById('outline');

    if (outLine.value == 1 && (tool.value == "circle" || tool.value == "triangle" || tool.value == "etriangle")) {
        childContext.fill();
        childContext.stroke();
    }
    else
        childContext.stroke();

    childContext.closePath();
    childContext.beginPath();
    return false;

}


//Mouse up function
function endProcess(e) {


    e.preventDefault();
    childCanvas.onmousemove = null;

    if (!noimage)
        saveChildInParent();

}

//Function to save the drawing
function saveChildInParent() {
    parentContext.drawImage(childCanvas, 0, 0);
    childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
    var url = parentCanvas.toDataURL();
    document.getElementById('preview').width = 200;
    document.getElementById('preview').height = 100;
    document.getElementById('preview').src = url;

}

//Reset function to reset the canvas
function reset() {
    if (creset == true) {
        startCurve = 0;
        mup = 0;
        ccount = 0;
        csu = 0;
        csv = 0;
        ctu = 0;
        ctv = 0;
        creset = false;
        noimage = false;
        cx1 = 0;
        cy1 = 0;
        cx2 = 0;
        cy2 = 0;
    }
    count = 0;
    childContext.lineWidth = 1;
    childContext.lineCap = "butt";
    su = 0;
    sv = 0;
    tu = 0;
    tv = 0;

}


//Mouse click event for color picker
function rgbcolor(e) {

    var c = Array();
    c = getCurrentCoordinates(e);
    var asd = colorContext.getImageData(c.x, c.y, 1, 1);


    color = "rgb(" + asd.data[0] + "," + asd.data[1] + "," + asd.data[2] + ")";

    colorContext.lineWidth = 3;
    colorContext.fillStyle = color;

    var outstyl = document.getElementById('outlineStyle');
    if (outstyl.value == 0) {
        colorContext.fillRect(0, 140, 120, 60);
        strokeColor = color;
    }
    if (outstyl.value == 1) {
        colorContext.fillRect(124, 140, 120, 60);
        fillColor = color;
    }
}

//Function to clear canvas
function clearCanvas() {
    parentContext.clearRect(0, 0, parentCanvas.width, parentCanvas.height);
    saveChildInParent();

}

//Function to cancel refresh
function cancelRefresh(e) {
    if (event.keyCode == 116) {

        alert("Refresh option has been disabled!");
        e.keyCode = 0;
        return false;
    }

}

//Function for the various tools and its behavior
function drawtool(startX, startY, endX, endY) {

    /*********************************Pencil******************************************************/
    if (tool.value == "pencil") {

        childContext.moveTo(startX, startY);
        childContext.lineTo(endX, endY);
        return { x: endX, y: endY };
    }


    /*********************************Eraser******************************************************/
    if (tool.value == "eraser") {
        parentContext.clearRect(startX, startY, 50, 50);
        return { x: endX, y: endY };

    }


    /************************************Rectangle***************************************************/
    if (tool.value == "rectangle") {
        if (count == 0) {

            su = startX;
            sv = startY;
            count++;
        }

        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        var o = document.getElementById('outline');
        if (o.value == 0) {
            childContext.strokeRect(su, sv, endX - su, endY - sv);
        }
        else {

            childContext.fillRect(su, sv, endX - su, endY - sv);
            childContext.strokeRect(su, sv, endX - su, endY - sv);
        }
        return { x: endX, y: endY };

    }
    /************************************Square***************************************************/


    if (tool.value == "square") {
        if (count == 0) {
            su = startX;
            sv = startY;
            count++;
        }

        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        var o = document.getElementById('outline');
        if (o.value == 0) {
            if ((endY > sv) && (endX - su) < 0)
                childContext.strokeRect(su, sv, endX - su, -(endX - su));
            else if ((endY < sv) && (endX - su) > 0)
                childContext.strokeRect(su, sv, endX - su, -(endX - su));
            else
                childContext.strokeRect(su, sv, endX - su, endX - su);
        }
        else {

            if ((endY > sv) && (endX - su) < 0) {
                childContext.fillRect(su, sv, endX - su, -(endX - su));
                childContext.strokeRect(su, sv, endX - su, -(endX - su));
            }
            else if ((endY < sv) && (endX - su) > 0) {
                childContext.fillRect(su, sv, endX - su, -(endX - su));
                childContext.strokeRect(su, sv, endX - su, -(endX - su));
            }
            else {
                childContext.fillRect(su, sv, endX - su, endX - su);
                childContext.strokeRect(su, sv, endX - su, endX - su);
            }
        }
        return { x: endX, y: endY };
    }


    /************************************Circle***************************************************/
    if (tool.value == "circle") {

        if (count == 0) {
            su = startX;
            sv = startY;
            count++;
        }
        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        childContext.arc(su, sv, endX - su, 0, Math.PI * 2);


        return { x: endX, y: endY };
    }
    /********************************** right Triangle*****************************************************/

    if (tool.value == "triangle") {

        if (count == 0) {
            su = startX;
            sv = startY;
            count++;
        }

        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        childContext.moveTo(su, sv);
        childContext.lineTo(su, endY);
        childContext.lineTo(endX, endY);
        childContext.lineTo(su, sv);

        childContext.lineCap = "round";
        return { x: endX, y: endY };
    }
    /***********************************triangle****************************************************/
    if (tool.value == "etriangle") {
        if (count == 0) {
            su = startX;
            sv = startY;
            count++;
        }

        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        childContext.moveTo(su, sv);
        childContext.lineTo(endX, endY);
        childContext.lineTo(su + (su - endX), endY);
        childContext.lineTo(su, sv);
        childContext.lineCap = "round";
        return { x: endX, y: endY };
    }

    /***********************************Line****************************************************/
    if (tool.value == "line") {

        if (count == 0) {
            su = startX;
            sv = startY;
            count++;


        }
        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        childContext.moveTo(su, sv);
        childContext.lineTo(endX, endY);
        return { x: endX, y: endY };
    }


    /**********************************Straight line*****************************************************/
    if (tool.value == "sline") {
        if (count == 0) {
            su = startX;
            sv = startY;
            count++;


        }
        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        if ((endY - sv) > 50) {
            childContext.moveTo(su, sv);
            childContext.lineTo(su, endY);
        }
        else if ((endY - sv) < -50) {
            childContext.moveTo(su, sv);
            childContext.lineTo(su, endY);
        }
        else {
            childContext.moveTo(su, sv);
            childContext.lineTo(endX, sv);
        }
        return { x: endX, y: endY };
    }

    /****************************Brush***********************************************************/
    if (tool.value == "brush") {

        childContext.lineWidth = 20;
        childContext.lineCap = "round";
        childContext.moveTo(startX, startY);
        childContext.lineTo(endX, endY);
        return { x: endX, y: endY };
    }



    /***********************************Quadratic curve****************************************************/
    if (tool.value == "qcurve") {

        if (ccount == 0) {

            csu = startX;
            csv = startY;
            ccount++;
            noimage = true;

        }
        onmouseup = function () {
            mup++;
            if (mup >= 2) {
                creset = true;
            }
            if (ccount == 1) {
                ctu = endX;
                ctv = endY;
                noimage = false;
                startCurve = true;
                ccount++;
            }
        }


        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        childContext.moveTo(csu, csv);
        if (startCurve == true) {
            childContext.quadraticCurveTo(endX, endY, ctu, ctv);
        } else
            childContext.lineTo(endX, endY);

        return { x: endX, y: endY };


    }

    /******************************Bezier curve*********************************************************/
    if (tool.value == "bcurve") {
        if (ccount == 0) {
            csu = startX;
            csv = startY;
            ccount++;
            noimage = true;

        }
        if (ccount < 2) {
            cx1 = endX;
            cy1 = endY;
            cx2 = cx1 + 100;
            cy2 = cy1;

        }
        else {
            cx2 = endX;
            cy2 = endY;

        }
        onmouseup = function () {
            mup++;
            if (ccount == 1) {
                ctu = endX;
                ctv = endY;
                startCurve = true;
                ccount++;

            }
            if (mup == 2) {
                noimage = false;
                cx1 = endX;
                cy1 = endY;
                ccount++;
            }
            if (mup == 3) {
                creset = true;
            }

        }
        childContext.clearRect(0, 0, childCanvas.width, childCanvas.height);
        childContext.moveTo(csu, csv);
        if (startCurve == true) {
            if (mup < 2)
                childContext.quadraticCurveTo(endX, endY, ctu, ctv);
            else
                childContext.bezierCurveTo(cx1, cy1, cx2, cy2, ctu, ctv);
        } else
            childContext.lineTo(endX, endY);

        return { x: endX, y: endY };

    }

}
