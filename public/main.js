/*************************** CONSTANTS ****************************************/
const TITLE_UNIT_BLOCK_PX = 50;
const TITLE_UNIT_KERN_PX = TITLE_UNIT_BLOCK_PX / 5;

/*************************** INTERVALS/TIMOUTS ********************************/
var resizeTimeout;

/*************************** UPDATING CONSTANTS *******************************/
var screenWidth;
var screenHeight;

var titleBoxWidth;
var titleBoxHeight;
var titleLeft;
var titleRight;

/******************************************************************************/
/*************************** HELPER FUNCTIONS *********************************/
/******************************************************************************/

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/******************************************************************************/
/*************************** LOADING ANIMATION ********************************/
/******************************************************************************/

const titlePositions = [
    // G //////////////////////////////////
    {
        type: "title_unit_top_semicircle",
        left: {blocks: 0, kerns: 0},
        top:  {blocks: 0, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 0, kerns: 0},
        top:  {blocks: 2, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 0, kerns: 0},
        top:  {blocks: 3, kerns: 0}
    },
    {
        type: "title_unit_bottom_semicircle",
        left: {blocks: 0, kerns: 0},
        top:  {blocks: 4, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 2, kerns: 0},
        top:  {blocks: 3, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 3, kerns: 0},
        top:  {blocks: 3, kerns: 0}
    },
    // L //////////////////////////////////
    {
        type: "title_unit_box",
        left: {blocks: 4, kerns: 1},
        top:  {blocks: 0, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 4, kerns: 1},
        top:  {blocks: 1, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 4, kerns: 1},
        top:  {blocks: 2, kerns: 0}
    },
    {
        type: "title_unit_bottom_left_semicircle",
        left: {blocks: 4, kerns: 1},
        top:  {blocks: 4, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 6, kerns: 1},
        top:  {blocks: 5, kerns: 0}
    },
    // P //////////////////////////////////
    {
        type: "title_unit_box",
        left: {blocks: 7, kerns: 2},
        top:  {blocks: 0, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 8, kerns: 2},
        top:  {blocks: 0, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 7, kerns: 2},
        top:  {blocks: 1, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 7, kerns: 2},
        top:  {blocks: 2, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 8, kerns: 2},
        top:  {blocks: 3, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 7, kerns: 2},
        top:  {blocks: 4, kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 7, kerns: 2},
        top:  {blocks: 5, kerns: 0}
    },
    {
        type: "title_unit_right_semicircle",
        left: {blocks: 9, kerns: 2},
        top:  {blocks: 0, kerns: 0}
    },
    // H //////////////////////////////////
    {
        type: "title_unit_box",
        left: {blocks: 11, kerns: 3},
        top:  {blocks: 0,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 11, kerns: 3},
        top:  {blocks: 1,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 11, kerns: 3},
        top:  {blocks: 2,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 11, kerns: 3},
        top:  {blocks: 3,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 11, kerns: 3},
        top:  {blocks: 4,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 11, kerns: 3},
        top:  {blocks: 5,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 12, kerns: 3},
        top:  {blocks: 3,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 13, kerns: 3},
        top:  {blocks: 3,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 14, kerns: 3},
        top:  {blocks: 0,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 14, kerns: 3},
        top:  {blocks: 1,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 14, kerns: 3},
        top:  {blocks: 2,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 14, kerns: 3},
        top:  {blocks: 3,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 14, kerns: 3},
        top:  {blocks: 4,  kerns: 0}
    },
    {
        type: "title_unit_box",
        left: {blocks: 14, kerns: 3},
        top:  {blocks: 5,  kerns: 0}
    },
]

function placeTitle() {
    document.getElementById('title_cont').style.left = titleLeft + "px";
    document.getElementById('title_cont').style.top  = titleTop  + "px";
    // place title elements randomly
    for (var i = 0; i < titlePositions.length; i++) {
        var el = titlePositions[i];
        var docEl = document.createElement('div');
        docEl.className  = "title_unit_hidden " + el.type;
        docEl.id         = "titleEl_" + i;
        docEl.style.left = (-titleLeft + r_in_r(0,screenWidth - (TITLE_UNIT_BLOCK_PX * 4))) + "px";
        docEl.style.top  = (-titleTop  + r_in_r(0,screenHeight - (TITLE_UNIT_BLOCK_PX * 4))) + "px";
        document.getElementById('title_cont').appendChild(docEl);
    }
    // place loading bar
    var loadingBar = document.createElement('div');
    loadingBar.className  = "title_unit title_loading_bar";
    loadingBar.id         = "title_loading_bar";
    loadingBar.style.left = ((4 * TITLE_UNIT_BLOCK_PX)
                                + TITLE_UNIT_KERN_PX ) + "px";
    loadingBar.style.top  =  (3 * TITLE_UNIT_BLOCK_PX) + "px";
    document.getElementById('title_cont').appendChild(loadingBar);

    loadingBarProgress();
    loadingBarInterval = setInterval(loadingBarProgress, 700);

    setTimeout(showTitle, r_in_r(2000,4000));
}

var loaderColors = ["red","blue","green","yellow","orange","purple"];
var curLoaderColor;

var loadingBarInterval;

function loadingBarProgress() {
    var nextColor;
    do {
        nextColor = loaderColors[r_in_r(0,loaderColors.length-1)];
    } while (curLoaderColor == nextColor);
    curLoaderColor = nextColor;
    document.getElementById('title_loading_bar').style.backgroundColor = nextColor;
}

function showTitle() {
    for (var i = 0; i < titlePositions.length; i++) {
        var el = titlePositions[i];
        document.getElementById("titleEl_" + i).className  = "title_unit " + el.type;
        document.getElementById("titleEl_" + i).style.left =
            ((el.left.blocks * TITLE_UNIT_BLOCK_PX) +
             (el.left.kerns  * TITLE_UNIT_KERN_PX)) + "px";
        document.getElementById("titleEl_" + i).style.top =
             (el.top.blocks  * TITLE_UNIT_BLOCK_PX) + "px";
    }
    setTimeout(function () {
        clearInterval(loadingBarInterval);
        document.getElementById('title_loading_bar').className = "title_unit_hidden title_loading_bar";
    }, 1000);
}

/******************************************************************************/
/*************************** MENU BUTTON HANDLERS *****************************/
/******************************************************************************/

/******************************************************************************/
/*************************** INITIALIZATION ***********************************/
/******************************************************************************/

function initVars() {
    screenWidth  = window.innerWidth;
    screenHeight = window.innerHeight;

                   // 15   Blocks                  3   Breaks between letters
    titleBoxWidth  = (15 * TITLE_UNIT_BLOCK_PX) + (3 * TITLE_UNIT_KERN_PX);
                   // 6    Blocks
    titleBoxHeight = (6  * TITLE_UNIT_BLOCK_PX);
    titleLeft      = (screenWidth  / 2) - (titleBoxWidth  / 2);
    titleTop       = (screenHeight / 2) - (titleBoxHeight / 2);
}

function init() {
    initVars();
    placeTitle();
}

function resizeHandler() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        console.log("resized...");
        initVars();
        placeTitle();
    }, 50);
}

window.onload = init;
window.onresize = resizeHandler;
