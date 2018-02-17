const CANV_MULT_RATIO = 2;

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
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChar() {
    var n = randInt(33, 255);
    var ch = String.fromCharCode(n);
    while (ch.trim().length == 0 || [157,160,150,133,148,131,154,152,157,156,155,144,143,141,147,137,159,149,142,134,140,128,132,153,130,139,135,129,127,145,146].indexOf(n) >= 0) {
        n = randInt(33, 255);
        ch = String.fromCharCode(n);
    }
    return ch;
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

function updateTitleColors() {
    var maxDist = 200;
    var colorStep = 1;
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
        buttonCh.style.color = "rgb(" + (Math.floor(rgb[0]/colorStep)*colorStep) + "," + (Math.floor(rgb[1]/colorStep)*colorStep) + "," + (Math.floor(rgb[2]/colorStep)*colorStep) + ")";
    }
}

function initMenu() {
    menuCharWidth = document.getElementById("home_mb").clientWidth;
    updateAllMenuButtons();
    for (var i = 0; i < sectIDs.length; i++) {
        document.getElementById(sectIDs[i] + "_mb").addEventListener("click",menuButtonClickHandler);
    }
    resizeHandlers.push(updateAllMenuButtons);
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

const MAX_TITLE_SKEW = 10;

var updateTitleSkewsInterval;
var curTitleSkew = 0;
var lastScrollTop = 0;

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

function updateTitleSkews() {
    if (!scrolling) {
        var titles = document.getElementsByClassName("sec_title");
        for (var i = 0; i < titles.length; i++)
            titles[i].style.transform = "skew(0, " + curTitleSkew + "deg)";
        if (curTitleSkew != 0)
            curTitleSkew -= (curTitleSkew/Math.abs(curTitleSkew)) *
                            Math.min(0.5,Math.abs(curTitleSkew));
    }
}

function sectionScrollHandler(ev) {
    scrolling = true;
    if (!updateScroll) return;
    var cont = ev.target;
    var sections = cont.getElementsByTagName("section");

    var i;
    for (i = sections.length-1; i >= 0; i--)
        if (isScrolledIntoView(sections[i])) break;

    activePage = sectIDs.indexOf(sections[i].id.replace("_sec",""));
    updateAllMenuButtons();

    var scrollDiff = this.scrollTop - lastScrollTop;
    var scrollDir;
    if (this.scrollTop != lastScrollTop) {
        scrollDir = scrollDiff / Math.abs(scrollDiff);
        lastScrollTop = this.scrollTop;
    }

    curTitleSkew = Math.max(-MAX_TITLE_SKEW,Math.min(MAX_TITLE_SKEW,curTitleSkew+(scrollDiff/30)));

    if (!updateTitleSkewsInterval)
        updateTitleSkewsInterval = setInterval(updateTitleSkews, 10);

    setTimeout(function () {
        scrolling = false;
    }, 10);
}

function fixSectionHeights() {
    document.getElementsByTagName('main')[0].style.maxHeight = window.innerHeight + "px";
    var sections = document.getElementsByTagName("section");
    sectionHeight = window.innerHeight*(17/20);
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.minHeight = sectionHeight + "px";
        // sections[i].style.height    = sectionHeight + "px";
    }
}

function initSections() {
    document.getElementsByTagName("main")[0].addEventListener("scroll",sectionScrollHandler);
    fixSectionHeights();
}

/******************************************************************************/
/******************************* HOME SECTION *********************************/
/******************************************************************************/

const HOME_TEXT = "-*!+~";

var homeSection;

var homeCanv;
var homeCtx;

var curDrawCharInd = 0;

var homeLastMX;
var homeLastMY;

function clearHomeCanv() {
    homeCtx.clearRect(0,0,homeCanv.width,homeCanv.height);
}

function homeCanvMouseMoveListener(ev) {
    var mx = ev.clientX * CANV_MULT_RATIO;
    var my = (ev.clientY + document.getElementsByTagName("main")[0].scrollTop) * CANV_MULT_RATIO;

    var dist = getDist(homeLastMX,homeLastMY,mx,my);
    if ((!homeLastMX || !homeLastMY) || dist > 5) {
        homeLastMX = mx;
        homeLastMY = my;
        homeCtx.font = ((Math.pow(dist,1.2))*CANV_MULT_RATIO) + "px Roboto Mono";
        var curChar = randChar();
        if (chance.bool({likelihood: 10}))
            homeCtx.fillText(curChar,mx,my);
        homeCtx.strokeText(curChar,mx,my);
        curDrawCharInd = (curDrawCharInd+1)%HOME_TEXT.length;
    }
}

function initHomeCanv() {
    homeCanv = document.getElementById("homeCanv");
    homeCtx = homeCanv.getContext("2d");

    homeCtx.clearRect(0,0,homeCanv.width,homeCanv.height);

    homeCanv.width  = homeSection.clientWidth  * CANV_MULT_RATIO;
    homeCanv.height = homeSection.clientHeight * CANV_MULT_RATIO;


    homeCtx.textAlign = "center";
    homeCtx.stokeStyle = "white";
    homeCtx.fillStyle = "blue";
}

function initHomeSection() {
    homeSection = document.getElementById("home_sec");
    initHomeCanv();
    homeCanv.addEventListener("mousemove",homeCanvMouseMoveListener);
    homeCanv.addEventListener("click",clearHomeCanv);
    resizeHandlers.push(initHomeCanv);
}

/******************************************************************************/
/******************************* ABOUT GL-PH SECTION **************************/
/******************************************************************************/

const ABOUT_TEXT = "This organization is one of the first undergraduate-run literary journals in the nation (if not the first) dedicated exclusively to the publication of digital literature (otherwise known as electronic literature, or e-lit). It is directed and housed by the Rochester Institute of Technology (RIT).\n\nWhy \"gl-ph\"?\n\nWikipedia says that a glyph is “a hieroglyphic character or symbol; a pictograph.” We say that it’s the interface between text and icon, between code and image. In our name, the hyphen, in a way, is a wild card, the space inside square brackets, a space to inhabit in fluid and dynamic ways.";

var nextAboutTextInd = 0;
var lastAboutTextLen = 0;
var aboutTypingNumExtra = 1;

function handleAboutTyping(ev) {
    var inp = document.getElementById("about_input");
    if (inp.value.length < ABOUT_TEXT.length || ev.key == "Backspace" || ev.metaKey || ev.ctrlKey) {
        if (ev.key.length == 1) document.getElementById("aboutBGLetter").innerHTML = ev.key;
        setTimeout(function () {
            var inp = document.getElementById("about_input");
            var len = inp.value.length;
            if (len > 0 && lastAboutTextLen < len) len += randInt(0,aboutTypingNumExtra);
            aboutTypingNumExtra += randInt(0,1);
            lastAboutTextLen = len;
            inp.value = ABOUT_TEXT.slice(0,len);
        }, 100);
    }
    else {
        ev.preventDefault();
        aboutTypingNumExtra--;
    }
}

function initAboutGLPH() {
    document.getElementById("about_input").value = "";
    document.getElementById("about_input").addEventListener("keydown",handleAboutTyping);
}

/******************************************************************************/
/******************************* DIG_LIT SECTION ******************************/
/******************************************************************************/

var startLetters;
var digLitShown = false;
var digLitAnimGradientSpread = 50;
var digLitAnimInterval;

var curDigListAnimDist1 = 0;
var curDigListAnimDist2 = -100;

var digLitOriginialContent;

function digLitAnimStep() {
    var startEl = document.getElementById("digLitStartText");
    var stX = startEl.offsetLeft;
    var stY = startEl.offsetTop;

    var digLitAnimElements = document.getElementsByClassName("digLitAnimElement");
    for (var i = 0; i < digLitAnimElements.length; i++) {
        var elX = digLitAnimElements[i].offsetLeft;
        var elY = digLitAnimElements[i].offsetTop;

        if (getDist(elX,elY,stX,stY) < curDigListAnimDist2 && digLitAnimElements[i].style.color != "black")
            digLitAnimElements[i].style.color = "black";
        else if (getDist(elX,elY,stX,stY) < curDigListAnimDist1 && digLitAnimElements[i].style.color != "red"
                                                                && digLitAnimElements[i].style.color != "black")
            digLitAnimElements[i].style.color = "red";
    }
    curDigListAnimDist1 +=5;
    curDigListAnimDist2 +=5;
    if (curDigListAnimDist2 > Math.max(window.innerWidth, window.innerWidth)) {
        setTimeout(finishDigLitAnim, 500);
    }
}

function finishDigLitAnim() {
    clearInterval(digLitAnimInterval);
    var digLitAnimSections = document.getElementsByClassName("digLitAnimSection");
    for (var i = 0; i < digLitAnimSections.length; i++) {
        digLitAnimSections[i].style.color = "black";
        digLitAnimSections[i].innerHTML = digLitOriginialContent[i];
        if (document.getElementById("digLitStartText")) document.getElementById("digLitStartText").id = null;
    }
}

function startDigLitAnim() {
    if (!digLitShown) {
        digLitShown = true;
        document.getElementById("digLitStartText").className = "done";
        digLitAnimInterval = setInterval(digLitAnimStep, 10);
    }
}

function initDigLitAnim() {
    digLitOriginialContent = [];
    var digLitAnimSections = document.getElementsByClassName("digLitAnimSection");
    for (var i = 0; i < digLitAnimSections.length; i++) {
        digLitOriginialContent.push(digLitAnimSections[i].innerHTML);
        var secContentToks = digLitAnimSections[i].innerHTML.split(" ");
        for (var j = 0; j < secContentToks.length; j++) {
            if (secContentToks[j].startsWith("<span")) {
                j++;
                while (!secContentToks[j].endsWith("</span>")) j++;
                continue;
            }
            secContentToks[j] = "<span class='digLitAnimElement'>" + secContentToks[j] + "</span>";
        }
        digLitAnimSections[i].innerHTML = secContentToks.join(" ");
    }
}

function initDigLit() {
    initDigLitAnim();
    document.getElementById("digLitStartText").addEventListener("click",startDigLitAnim);
}

/******************************************************************************/
/******************************* SUBMIT SECTION *******************************/
/******************************************************************************/

const SUBMIT_ANIM_STEP_TIME = 200;

var numSubmitElements = 25;
var centerSE = 13;
var middleSE = [7,8,9,12,14,17,18,19];
var outerSE  = [1,2,3,4,5,6,10,11,15,16,20,21,22,23,24,25];
var submitButton;

var submitAnimTimeout;
var curSubmitStage;

const SUBMIT_ANIM_STAGES = [
    //outerSE        |middleSE
    //color   stroke |color    stroke
    ["blue", "blue", "blue",  "white"], // 0
    ["blue", "white","blue",  "white"], // 1
    ["blue", "white","white", "white"], // 2
    ["white","white","white", "white"], // 3
    ["white","white","white", "red"],   // 4
    ["white","red",  "white", "red"],   // 5
    ["red",  "red",  "red",   "red"],   // 6
    ["white","red",  "white", "red"],   // 7
];

function updateOuterSE(color,stroke,func) {
    var outerSEElements = document.getElementsByClassName("outerSE");
    for (var i = 0; i < outerSEElements.length; i++) {
        outerSEElements[i].style.color = color;
        outerSEElements[i].style.textStroke = "1px " + stroke;
        outerSEElements[i].style.webkitTextStroke = "1px " + stroke;
        if (func) func(outerSEElements[i]);
    }
}

function updateMiddleSE(color,stroke,func) {
    var middleSEElements = document.getElementsByClassName("middleSE");
    for (var i = 0; i < middleSEElements.length; i++) {
        middleSEElements[i].style.color = color;
        middleSEElements[i].style.textStroke = "1px " + stroke;
        middleSEElements[i].style.webkitTextStroke = "1px " + stroke;
        if (func) func(middleSEElements[i]);
    }
}

function submitStageStep() {
    submitButton.classList.remove("stage" + curSubmitStage);
    curSubmitStage++;
    submitButton.classList.add("stage" + curSubmitStage);
    console.log(SUBMIT_ANIM_STAGES[curSubmitStage]);
    updateOuterSE(SUBMIT_ANIM_STAGES[curSubmitStage][0],SUBMIT_ANIM_STAGES[curSubmitStage][1]);
    updateMiddleSE(SUBMIT_ANIM_STAGES[curSubmitStage][2],SUBMIT_ANIM_STAGES[curSubmitStage][3]);
    if (curSubmitStage+1 == SUBMIT_ANIM_STAGES.length)
        submitAnimTimeout = setTimeout(openSubmitLink, SUBMIT_ANIM_STEP_TIME);
    else submitAnimTimeout = setTimeout(submitStageStep, SUBMIT_ANIM_STEP_TIME);
}

function submitClickHandler() {
    curSubmitStage = 0;
    submitButton.innerHTML = "HOLD";
    submitButton.classList.add("stage" + curSubmitStage);
    console.log(SUBMIT_ANIM_STAGES[curSubmitStage]);
    updateOuterSE(SUBMIT_ANIM_STAGES[curSubmitStage][0],SUBMIT_ANIM_STAGES[curSubmitStage][1]);
    updateMiddleSE(SUBMIT_ANIM_STAGES[curSubmitStage][2],SUBMIT_ANIM_STAGES[curSubmitStage][3]);
    submitAnimTimeout = setTimeout(submitStageStep, SUBMIT_ANIM_STEP_TIME);
}

function submitCancelHandler() {
    updateOuterSE( "blue","blue");
    updateMiddleSE("blue","blue");
    submitButton.innerHTML = "SUBMIT";
    submitButton.className = "submitElement centerSE";
    clearTimeout(submitAnimTimeout);
}

function openSubmitLink() {
    submitButton.innerHTML = "HOORAY";
    setTimeout(function () {
        submitButton.innerHTML = "THANKS";
        setTimeout(function () {
            setTimeout(function () {
                submitCancelHandler();
            }, 10);
            window.open("https://goo.gl/images/iK3BZK","_blank");
        }, 300);
    }, 300);
}

function initSubmitElements() {
    for (var i = 0; i < numSubmitElements; i++) {
        var elID = i+1;
        var submitElement = document.createElement("p");
        submitElement.innerHTML = "SUBMIT";
        submitElement.className = "submitElement";
        if (elID == centerSE) {
            submitElement.classList.add("centerSE");
            submitElement.id = "centerSE";
        }
        else if (middleSE.indexOf(elID) > -1) {
            submitElement.classList.add("middleSE");
        }
        else if (outerSE.indexOf(elID) > -1) {
            submitElement.classList.add("outerSE");
        }
        document.getElementById("submit_sec").appendChild(submitElement);
    }
}

function initSubmit() {
    initSubmitElements();
    submitButton = document.getElementById("centerSE");
    submitButton.addEventListener("mousedown",submitClickHandler);
    submitButton.addEventListener("mouseup",submitCancelHandler);
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
    // var nextChar = randInt(0,loadChs.length-1);
    // while (nextChar == loadChs.indexOf(loadEl.innerHTML))
    //     nextChar = randInt(0,loadChs.length-1);
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
    loaded = true;
}

/******************************************************************************/
/******************************* RESIZE ***************************************/
/******************************************************************************/

var resizeHandlers = [];
var resizeTimeout;

function resize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        for (var i = 0; i < resizeHandlers.length; i++) {
            console.log(resizeHandlers[i]);
            resizeHandlers[i]();
        }
    }, 100);
}

/******************************************************************************/
/******************************* INIT *****************************************/
/******************************************************************************/

function init() {
    startLoad();
    grainOverlay.init();
    initMenu();
    initSections();
    initHomeSection();
    initAboutGLPH();
    initDigLit();
    initSubmit();
    // setTimeout(endLoad, randInt(1000,2000));
    endLoad();
}

window.onload = init;
window.onresize = resize;
