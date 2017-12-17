const sectIDs      = ["home","about","dig_lit","submit","faq"];
// const buttonColors = [ "F0433A", "C9283E", "820333", "540032", "2E112D"];
const buttonColors = [ "ff1f00", "ff1f00", "ff1f00", "ff1f00", "ff1f00"];
var activePage = 0;
var menuCharWidth;
var updateScroll = true;
var sectionHeight;

/******************************************************************************/
/******************************* HELPERS **************************************/
/******************************************************************************/

function getDist(x1,y1,x2,y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt((a*a)+(b*b));
}

function hexToRgb(hex) {
    var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return [
        parseInt(parseInt(m[1], 16).toFixed(1)),
        parseInt(parseInt(m[2], 16).toFixed(1)),
        parseInt(parseInt(m[3], 16).toFixed(1))
    ];
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChar() {
    var n = r_in_r(33, 255);
    var ch = String.fromCharCode(n);
    while (ch.trim().length == 0 || [157,160,150,133,148,131,154,152,157,156,155,144,143,141,147,137,159,149,142,134,140,128,132,153,130,139,135,129,127,145,146].indexOf(n) >= 0) {
        n = r_in_r(33, 255);
        ch = String.fromCharCode(n);
    }
    return ch;
}

function getDist(x1,y1,x2,y2) {
    var a = x1 - x2
    var b = y1 - y2

    return Math.sqrt((a*a)+(b*b));
}

/******************************************************************************/
/******************************* MENU *****************************************/
/******************************************************************************/

function updateMenuButtonPos(sID) {
    var el = document.getElementById(sID + "_mb");
    if (sectIDs.indexOf(sID) < activePage) {       // left
        el.style.left = ((sectIDs.indexOf(sID) * menuCharWidth) + el.parentElement.offsetLeft) + "px";
    }
    else if (sectIDs.indexOf(sID) == activePage) { // center
        el.style.left = (((el.parentElement.clientWidth / 2) - (menuCharWidth/2)) + el.parentElement.offsetLeft) + "px";
    }
    else {                                         // right
        el.style.left = ((el.parentElement.clientWidth - (((sectIDs.length)-sectIDs.indexOf(sID)) * menuCharWidth)) + el.parentElement.offsetLeft) + "px";
    }
}

function updateAllMenuButtons() {
    for (var i = 0; i < sectIDs.length; i++) {
        updateMenuButtonPos(sectIDs[i]);
    }
}

function menuButtonClickHandler(ev) {
    updateScroll = false;
    var sID = ev.target.id.replace("_mb","");
    scrollToSection(sID);
    activePage = sectIDs.indexOf(sID);
    updateAllMenuButtons();

    setTimeout(function () {
        updateScroll = true;
    }, 1000);
}

function initMenu() {
    menuCharWidth = document.getElementById("home_mb").clientWidth;
    updateAllMenuButtons();
    for (var i = 0; i < sectIDs.length; i++) {
        document.getElementById(sectIDs[i] + "_mb").addEventListener("click",menuButtonClickHandler);
    }
}

function updateTitleColors() {
    var maxDist = 200;
    // UNCOMMENT TO FADE TITLE ON HOVER
    // for (var i = 0; i < 4; i++) {
    //     var titleCh = document.getElementById("title_ch_" + i);
    //     var elX = titleCh.offsetLeft + (titleCh.clientWidth/2);
    //     var elY = titleCh.offsetTop  + (titleCh.clientHeight/2);
    //     var dist = getDist(mouseX,mouseY,elX,elY);
    //     titleCh.style.opacity = ((dist / maxDist)-0.2).toFixed(2);
    // }
    // ////////////////////////////////
    for (var i = 0; i < sectIDs.length; i++) {
        var buttonCh = document.getElementById(sectIDs[i] + "_mb");
        var elX = buttonCh.offsetLeft + (buttonCh.clientWidth/2);
        var elY = buttonCh.offsetTop  + (buttonCh.clientHeight/2);
        var dist = getDist(mouseX,mouseY,elX,elY);
        var mult = 1-(dist / maxDist);
        var rgb = hexToRgb(buttonColors[Math.abs(i - activePage)]);
        for (var r = 0; r < rgb.length; r++) rgb[r] = (rgb[r] * mult).toFixed(0);
        buttonCh.style.color = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    }
}

/******************************************************************************/
/******************************* GENERAL HANDLERS *****************************/
/******************************************************************************/

var mouseX;
var mouseY;

var checkMousePosInterval;

function checkMousePos() {
    updateTitleColors();
}

function handlePageMouseMove(ev) {
    mouseX = ev.clientX;
    mouseY = ev.clientY;
    if (!checkMousePosInterval) {
        checkMousePosInterval = setInterval(checkMousePos, 10);
    }
}

/******************************************************************************/
/******************************* SECTIONS *************************************/
/******************************************************************************/

function scrollToSection(sID) {
    var scrollEl = document.getElementById(sID + "_sec");
    scrollEl.scrollIntoView({behavior: "smooth",block: "end", inline: "nearest"});
}

function isScrolledIntoView(el) {
    var headerHeight = document.getElementsByTagName("header")[0].clientHeight;
    var elemTop = el.getBoundingClientRect().top;
    var isVisible = (elemTop-1 <= headerHeight);
    return isVisible;
}

function sectionScrollHandler(ev) {
    if (!updateScroll) return;
    var cont = ev.target;
    var sections = cont.getElementsByTagName("section");
    var i;
    for (i = sections.length-1; i >= 0; i--) {
        if (isScrolledIntoView(sections[i])) {
            break;
        }
    }
    activePage = sectIDs.indexOf(sections[i].id.replace("_sec",""));
    updateAllMenuButtons();
}

function fixSectionHeights() {
    document.getElementsByTagName('main')[0].style.maxHeight = window.innerHeight + "px";
    var sections = document.getElementsByTagName("section");
    sectionHeight = window.innerHeight*(17/20);
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.minHeight = sectionHeight + "px";
        sections[i].style.height    = sectionHeight + "px";
    }
}

function initSections() {
    document.getElementsByTagName("main")[0].addEventListener("scroll",sectionScrollHandler);
    fixSectionHeights();
}

/******************************************************************************/
/******************************* SUBMIT SECTION *******************************/
/******************************************************************************/

var updateSubmitMovePosInterval;
var clickPointX;
var clickPointY;

var finalized = false;

function openSubmitLink() {
    window.open("https://www.lawctopus.com/wp-content/uploads/2017/10/submit-a-new-post.png","_self");
    // submit link here ^
}

function finalizeSubmit() {
    var drag = document.getElementById("drag");
    var drop = document.getElementById("drop");
    document.getElementById("drag").removeEventListener("mousedown",submitMoveMouseDownHandler);
    document.getElementById("drag").removeEventListener("mouseup",submitMoveMouseUpHandler);
    if (updateSubmitMovePosInterval) clearInterval(updateSubmitMovePosInterval);
    drag.className = "submit_text active_submit";
    drop.className = "submit_text";
    drag.style.top  = drop.style.top;
    drag.style.left = (window.innerWidth/2) - (drag.clientWidth/2) + "px";
    drop.style.left = (window.innerWidth/2) - (drop.clientWidth/2) + "px";
    document.getElementById("drag_home").style.backgroundColor = "blue";
    document.getElementById("drag").addEventListener("click",openSubmitLink);
}

function getSubmitDist() {
    var drag = document.getElementById('drag');
    var drop = document.getElementById('drop');
    dragY = drag.offsetTop  + (drag.clientHeight/2);
    dragX = drag.offsetLeft + (drag.clientWidth/2);
    dropY = drop.offsetTop  + (drop.clientHeight/2);
    dropX = drop.offsetLeft + (drop.clientWidth/2);
    return getDist(dragX,dragY,dropX,dropY);
}

function updateSubmitMovePos() {
    var drag = document.getElementById("drag");
    var scH = document.getElementById("section_scroll").scrollHeight;
    var curX = mouseX - clickPointX;
    var curY = mouseY - clickPointY
    var dist = getSubmitDist();
    var maxJitter = Math.pow(Math.max(dist,0),0.3);

    var newTop  = Math.max(document.getElementById("submit_sec").offsetTop-37,Math.min(curY + r_in_r(-maxJitter,maxJitter),
                document.getElementById("submit_sec").offsetTop + document.getElementById("submit_sec").clientHeight - drag.clientHeight + 30));
    var newLeft = Math.max(-5,Math.min(curX + r_in_r(-maxJitter,maxJitter),
                window.innerWidth - drag.clientWidth));
    drag.style.top  = newTop  + "px";
    drag.style.left = newLeft + "px";
    if (dist < 10) {
        finalized = true;
        finalizeSubmit();
    }
}

function submitMoveMouseDownHandler(ev) {
    clickPointX = ev.clientX - ev.target.offsetLeft;
    clickPointY = ev.clientY - ev.target.offsetTop;
    document.getElementById("drop").className = "drop submit_text";
    updateSubmitMovePosInterval = setInterval(updateSubmitMovePos, 10);
}

function submitMoveMouseUpHandler(ev) {
    document.getElementById("drop").className = "submit_text";
    if (updateSubmitMovePosInterval) clearInterval(updateSubmitMovePosInterval);
}

function resetDrag() {
    var drag = document.getElementById("drag");
    drag.addEventListener("mousedown",submitMoveMouseDownHandler);
    drag.addEventListener("mouseup",submitMoveMouseUpHandler);
    drag.addEventListener("mouseout",submitMoveMouseUpHandler);
    drag.removeEventListener("click",openSubmitLink);
    drag.className = "submit_text grab";
    drag.style = null;
    var pNode = document.getElementById("drag_home");
    pNode.style = null;
}

function placeSubmits() {
    var drag = document.getElementById("drag");
    var texts = document.getElementsByClassName("submit_text");
    var pNode = document.getElementById("drag_home");
    var tnum = 1;
    texts[tnum].style.left = (window.innerWidth/4) - (texts[tnum].clientWidth/2) + "px";
    texts[tnum].style.top  = (pNode.offsetTop) + (sectionHeight/2) - (texts[tnum].clientHeight/2) + "px";
    var tnum = 0;
    pNode = texts[tnum].parentNode;
    texts[tnum].style.left = (pNode.offsetLeft) + (window.innerWidth/4)  - (texts[tnum].clientWidth/2)  + "px";
    texts[tnum].style.top  = (pNode.offsetTop)  + (sectionHeight/2) - (texts[tnum].clientHeight/2) + "px";
}

var curWindowWidth;
var curWindowHeight;

function resizeUpdateSubmitTexts() {
    var drag = document.getElementById("drag");
    var drop = document.getElementById("drop");

    if (!finalized) {
        resetDrag();
        placeSubmits();
        if (window.innerWidth/window.innerHeight < 1.12)
            finalizeSubmit();
    }
    else finalizeSubmit();

}

function initSubmit() {
    resetDrag();
    placeSubmits();
    if (window.innerWidth/window.innerHeight < 1.12)
        finalizeSubmit();
}

/******************************************************************************/
/******************************* LOADING **************************************/
/******************************************************************************/

var loadingInterval;

// var loadChs = "-+×*~.,\\|".split("");
var loadChs = "\\|/-".split("");
var curLoadCh = 0;

function loadStep() {
    // var loadEl = document.getElementById('title_sp');
    // var nextChar = r_in_r(0,loadChs.length-1);
    // while (nextChar == loadChs.indexOf(loadEl.innerHTML))
    //     nextChar = r_in_r(0,loadChs.length-1);
    // loadEl.innerHTML = loadChs[nextChar];
    // loadEl.innerHTML = randChar();

    var loadEl = document.getElementById('title_sp');
    loadEl.innerHTML = loadChs[curLoadCh];
    curLoadCh++;
    if (curLoadCh > loadChs.length-1) curLoadCh = 0;
}

function startLoad() {
    var headerEl = document.getElementsByTagName("header")[0];
    headerEl.style.top = (window.innerHeight/2) - (headerEl.clientHeight/2) + "px";
    loadingInterval = setInterval(loadStep, 100);
}

function endLoad() {
    if (loadingInterval) clearInterval(loadingInterval);
    document.getElementById('title_sp').innerHTML = "-";
    setTimeout(function () {
        document.body.addEventListener("mousemove", handlePageMouseMove);
        var headerEl = document.getElementsByTagName("header")[0];
        headerEl.style.top = 0;
        document.getElementById('loading_overlay').style.opacity = 0;
        setTimeout(function () {
            document.getElementById("mb_cont").style.opacity = 1;
            document.getElementById('loading_overlay').style.display = "none";
            setTimeout(function () {
                document.getElementById('title_sp').innerHTML = "&nbsp;";
            }, 1000);
        }, 1100);
    }, 200);
}

/******************************************************************************/
/******************************* INIT *****************************************/
/******************************************************************************/

function init() {
    startLoad();
    initMenu();
    initSections();
    initSubmit();
    // setTimeout(endLoad, r_in_r(1000,2000));
    endLoad();
}

var resizeTimeout;

function resize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        updateAllMenuButtons();
        resizeUpdateSubmitTexts();
    }, 100);
}

window.onload = init;
window.onresize = resize;
