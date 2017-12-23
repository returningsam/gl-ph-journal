const sectIDs      = ["home","about","elit","submit","faq"]; // TODO deprecate
var sections = [
    {   id: "home",
        char: "-", color: "ff1f00",
        getMB: function() { return document.getElementById( this.id + "_mb" ); },
        getSec: function() { return document.getElementById( this.id + "_sec" ); }
    },
    {   id: "about",
        char: "*", color: "ff1f00",
        getMB: function() { return document.getElementById( this.id + "_mb" ); },
        getSec: function() { return document.getElementById( this.id + "_sec" ); }
    },
    {   id: "elit",
        char: "!", color: "ff1f00",
        getMB: function() { return document.getElementById( this.id + "_mb" ); },
        getSec: function() { return document.getElementById( this.id + "_sec" ); }
    },
    {   id: "submit",
        char: "+", color: "ff1f00",
        getMB: function() { return document.getElementById( this.id + "_mb" ); },
        getSec: function() { return document.getElementById( this.id + "_sec" ); }
    },
    {   id: "faq",
        char: "~", color: "ff1f00",
        getMB: function() { return document.getElementById( this.id + "_mb" ); },
        getSec: function() { return document.getElementById( this.id + "_sec" ); }
    },
];
// const buttonColors = [ "F0433A", "C9283E", "820333", "540032", "2E112D"];
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

function getSectIndByKeyVal( key, val ) {
    for (var i = 0; i < sections.length; i++) {
        if (sections[i][key] === val) return i;
    }
    return -1;
}

// get the index of a section in `sections` by its ID
function getSectIndByID( sID ) {
    return getSectIndByKeyVal( "id", sID );
}

function getSectByID( sID ) {
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].id === sID) return sections[i];
    }
    return null;
}

function mouseInEle(ele) {
    var x1, x2, y1, y2;
    x1 = ele.offsetLeft; x2 = x1 + ele.clientWidth;
    y1 = ele.offsetTop;  y2 = y1 + ele.clientHeight;
    if (mouseX >= x1 && mouseX <= x2) {
        if (mouseY >= y1 && mouseY <= y2) {
            return true;
        }
    }
    return false;
}

/******************************************************************************/
/************************** CONTROL PANEL *************************************/
/******************************************************************************/

/* FONT CONTROL */

var fonts = ["Inconsolata", "Roboto Mono"];

function setFont( font ) {
    document.getElementsByTagName( "body" )[0].style["font-family"] = font;
    initMenu();
}

function initFontFamControl() {
    var fontbutts = document.getElementById( "FontButtons" );
    for (var i = 0; i < fonts.length; i++) {
        fontbutts.innerHTML += "<button onclick=\"setFont('" + fonts[i] + "')\">" + fonts[i] + "</button>";
    }
}

/* CASE CONTROL */

function setTitleCase( case_type ) {
    titleChars = document.getElementsByClassName( "t_char" );
    switch ( case_type ) {
        case "lower":
            for (var i = 0; i < titleChars.length; i++) {
                var ch = titleChars[i].innerHTML;
                titleChars[i].innerHTML = ch.toLowerCase();
            }
            break;
        case "upper":
            for (var i = 0; i < titleChars.length; i++) {
                var ch = titleChars[i].innerHTML;
                titleChars[i].innerHTML = ch.toUpperCase();
            }
            break;
        case "random":
            for (var i = 0; i < titleChars.length; i++) {
                var ch = titleChars[i].innerHTML;
                titleChars[i].innerHTML = Math.round( Math.random() ) ? ch.toUpperCase() : ch.toLowerCase() ;
            }
            break;
    }
}

function initFontCaseControl() {
    var casebutts = document.getElementById( "CaseButtons" ).children;
    for (var i = 0; i < casebutts.length; i++) {
        casebutts[i].onclick = function() { setTitleCase( this.dataset.case ); };
    }
}

/* GLYPH PICKING */

function updateGlyph( sID, char ) {
    console.log( sID + " -> " + char );
    var sect = getSectByID( sID );
    sect.char = char;
    sect.getMB().innerHTML = char;
}

function buildGlyphInput( sect ) {
    var input = "";
    input += "<div class=\"ginput_div\" id=\"" + sect.id + "_ginput\">";
    input += "<input ";
    input +=   "type=\"text\" ";
    input +=   "value=\"" + sect.char + "\" ";
    input +=   "maxlength=\"" + 1 + "\" ";
    input +=   "data-sect=\"" + sect.id + "\" ";
    input +=   "oninput=\"updateGlyph('" + sect.id + "', this.value)\">";
    input += "</input>";
    input += "</div>"
    return input;
}

function initMenuGlyphControl() {
    var mbGlyphPickers = document.getElementById( "MBGlyphPickers" );
    var sect, input;
    for (var i = 0; i < sections.length; i++) {
        sect = sections[i];
        // add the color picker div to the color picker collection
        mbGlyphPickers.innerHTML += buildGlyphInput( sect );
        mbGlyphPickers.lastChild.lastChild.style.width = menuCharWidth + "px";
    }
}

/* COLOR PICKING */

function colorControlStyle() {
    var elist = document.querySelectorAll( ".picker_preview" );
    var e;
    for (var i = 0; i < elist.length; i++) {
        e = elist[i];
        e.style["background-color"] = mouseInEle( e ) ? "rgba(191, 191, 191, 0.8)" : "rgba(191, 191, 191, 0.2)";
    }
}

// builds an HTML string for a color-picker div corresponding to a section
function buildColorPicker( sect ) {
    var picker = "";
    picker += "<div class=\"picker_div\" id=\"" + sect.id + "_picker\">";
    picker += "<button class=\"picker_preview\">" + sect.char + "</button>";
    picker += "<input ";
    picker +=   "type=\"color\" ";
    picker +=   "value=\"#" + sect.color + "\" ";
    picker +=   "data-sect=\"" + sect.id + "\" ";
    picker +=   "oninput=\"updateGlyphColor('" + sect.id + "')\">";
    picker += "</input>";
    picker += "</div>"
    return picker;
}

function updateGlyphColor( sID ) {
    var sect = getSectByID( sID );
    var picker = document.querySelector( "#" + sect.id + "_picker > input" );
    var preview = document.querySelector( "#" + sect.id + "_picker > button" );
    sect.color = picker.value;
    preview.style.color = sect.color;
}

function initMenuColorControl() {
    var mbColorPickers = document.getElementById( "MBColorPickers" );
    var sect, picker, preview;
    for (var i = 0; i < sections.length; i++) {
        sect = sections[i];
        // add the color picker div to the color picker collection
        mbColorPickers.innerHTML += buildColorPicker( sect );
        picker = document.querySelector( "#" + sect.id + "_picker > input" );
        preview = document.querySelector( "#" + sect.id + "_picker > button" );
        // match the widths of the elements so the
        // invisible color picker is over the preview char
        picker.style.width = preview.clientWidth + "px";
        preview.parentNode.style.height = preview.clientHeight + "px";
        updateGlyphColor( sect.id );
    }
}

/* COLOR-STEP CONTROL */

function initColorStepControl() {
    var stepSlide = document.getElementById( "ColorStepSlide" );
    var stepVal = document.getElementById( "ColorStepVal" );
    stepVal.innerHTML = stepSlide.value;
    stepSlide.oninput = function() {
        stepVal.innerHTML = stepSlide.value;
        tColorStep = stepSlide.value;
    };
}

function initControlPanel() {
    initFontFamControl();
    initFontCaseControl();
    initMenuGlyphControl();
    initMenuColorControl();
    initColorStepControl();
}

/******************************************************************************/
/******************************* MENU *****************************************/
/******************************************************************************/

function updateMenuButtonPos(sID) {
    var idx = getSectIndByID(sID);
    var el  = sections[idx].getMB();
    el.innerHTML = sections[idx].char;
    if ( idx < activePage ) {       // left
        el.style.left = ((idx * menuCharWidth) + el.parentElement.offsetLeft) + "px";
    }
    else if ( idx === activePage ) { // center
        el.style.left = (((el.parentElement.clientWidth / 2) - (menuCharWidth/2)) + el.parentElement.offsetLeft) + "px";
    }
    else {                           // right
        el.style.left = ((el.parentElement.clientWidth - (((sections.length)-idx) * menuCharWidth)) + el.parentElement.offsetLeft) + "px";
    }
}

function updateAllMenuButtons() {
    for (var i = 0; i < sections.length; i++) {
        updateMenuButtonPos(sections[i].id);
    }
}

function menuButtonClickHandler(ev) {
    updateScroll = false;
    var sID = ev.target.id.replace("_mb","");
    scrollToSection(sID);
    activePage = getSectIndByID(sID);
    updateAllMenuButtons();

    setTimeout(function () {
        updateScroll = true;
    }, 1000);
}

function initMenu() {
    menuCharWidth = document.getElementById("home_mb").clientWidth;
    updateAllMenuButtons();
    for (var i = 0; i < sections.length; i++) {
        sections[i].getMB().addEventListener("click",menuButtonClickHandler);
    }
}

var tColorMaxDist = 200;
var tColorStep = 35;

function updateTitleColors() {
    // UNCOMMENT TO FADE TITLE ON HOVER
    // for (var i = 0; i < 4; i++) {
    //     var titleCh = document.getElementById("title_ch_" + i);
    //     var elX = titleCh.offsetLeft + (titleCh.clientWidth/2);
    //     var elY = titleCh.offsetTop  + (titleCh.clientHeight/2);
    //     var dist = getDist(mouseX,mouseY,elX,elY);
    //     titleCh.style.opacity = ((dist / maxDist)-0.2).toFixed(2);
    // }
    // ////////////////////////////////
    for (var i = 0; i < sections.length; i++) {
        var buttonCh = sections[i].getMB();
        // x-pos of center of element
        var elX = buttonCh.offsetLeft + (buttonCh.clientWidth/2);
        // y-pos of center of element
        var elY = buttonCh.offsetTop  + (buttonCh.clientHeight/2);
        // distance from mouse to element
        var dist = getDist(mouseX,mouseY,elX,elY);
        // multiplier for color intensity
        var mult = 1-(dist / tColorMaxDist);
        // do not step-calculate if the mouse is in the button
        // in this case, the element should be full-intensity
        var step = mouseInEle( buttonCh ) ? 1 : tColorStep;
        // set the button's color based on these factors
        buttonCh.style.color = calcButtonColor(sections[i].color, mult, step);
    }
}

function calcButtonColor( hex, mult, step ) {
    // var rgb = hexToRgb(buttonColors[Math.abs(i - activePage)]);
    var rgb = hexToRgb( hex );
    // multiply the rgb vals by intensity multiplier
    for (var i = 0; i < rgb.length; i++) rgb[i] = (rgb[i] * mult).toFixed(0);

    var res = "rgb(";
    res += (Math.floor(rgb[0]/step)*step) + ","; // determine the R-val step
    res += (Math.floor(rgb[1]/step)*step) + ","; // determine the G-val step
    res += (Math.floor(rgb[2]/step)*step) + ")"; // determine the B-val step
    return res;
}

/******************************************************************************/
/******************************* GENERAL HANDLERS *****************************/
/******************************************************************************/

var mouseX;
var mouseY;

var checkMousePosInterval;

function checkMousePos() {
    updateTitleColors();
    colorControlStyle();
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
    var sects = cont.getElementsByTagName("section");
    var i;
    for (i = sects.length-1; i >= 0; i--) {
        if (isScrolledIntoView(sects[i])) {
            break;
        }
    }
    activePage = sectIDs.indexOf(sects[i].id.replace("_sec",""));
    updateAllMenuButtons();
}

function fixSectionHeights() {
    document.getElementsByTagName('main')[0].style.maxHeight = window.innerHeight + "px";
    var sects = document.getElementsByTagName("section");
    sectionHeight = window.innerHeight*(17/20);
    for (var i = 0; i < sects.length; i++) {
        sects[i].style.minHeight = sectionHeight + "px";
        sects[i].style.height    = sectionHeight + "px";
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
    setTimeout(function () {
        document.getElementById("drag").addEventListener("mousedown",openSubmitLink);
    }, 10);

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
var loadStepMs = 100;

// var loadChs = "-+×*~.,\\|".split("");
var loadChs = "\\|/-".split("");
// var curLoadCh = 0;

function loadStep() {
    // var loadEl = document.getElementById('title_sp');
    // var nextChar = r_in_r(0,loadChs.length-1);
    // while (nextChar == loadChs.indexOf(loadEl.innerHTML))
    //     nextChar = r_in_r(0,loadChs.length-1);
    // loadEl.innerHTML = loadChs[nextChar];
    // loadEl.innerHTML = randChar();

    var loadEl = document.getElementById('title_sp');
    // loadEl.innerHTML = loadChs[curLoadCh];
    // curLoadCh++;
    // if (curLoadCh > loadChs.length-1) curLoadCh = 0;

    // TODO more elegant approach (imo)
    loadEl.innerHTML = loadChs[0];
    loadChs.push( loadChs.shift() );
}

function startLoad() {
    var headerEl = document.getElementsByTagName("header")[0];
    headerEl.style.top = (window.innerHeight/2) - (headerEl.clientHeight/2) + "px";
    loadingInterval = setInterval(loadStep, loadStepMs);
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
    initControlPanel();
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
