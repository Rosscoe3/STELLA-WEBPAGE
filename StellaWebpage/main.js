import "./style.css";

const ctx = document.getElementById("graph").getContext("2d");
const ctx2 = document.getElementById("graph2").getContext("2d");
const ctx3 = document.getElementById("graph3").getContext("2d");
const ctx4 = document.getElementById("graph_NIRv").getContext("2d");
const ctx5 = document.getElementById("graph_SR").getContext("2d");
const ctx6 = document.getElementById("graph_DSWI").getContext("2d");
const ctx7 = document.getElementById("graph_reflectance").getContext("2d");
const ctxTemp = document.getElementById("graph_temp").getContext("2d");
const ctxRawOverTime = document.getElementById("graph_rawOverTime").getContext("2d");

setTimeout(() => {
  alert(
    "Thank you for using the STELLA Dataviewer.\nSome functionality is not compatible with certain browsers.\n\n*Please use Google Chrome for the most optimized experience.*"
  );
}, 1000);

//** GRADIENT FILL */
let visibleGradient = ctx.createLinearGradient(0, 0, 500, 0);
visibleGradient.addColorStop(0.1, "rgba(0, 0, 255, 0.75)");
visibleGradient.addColorStop(0.25, "rgba(0, 255, 0, 0.75)");
visibleGradient.addColorStop(0.5, "rgba(255, 255, 0, 0.75)");
visibleGradient.addColorStop(0.75, "rgba(255, 102, 0, 0.75)");
visibleGradient.addColorStop(1, "rgba(255, 0, 0, 0.75)");

var graph = document.getElementById("graph");

var viewMode = 0;

Chart.defaults.set("plugins.datalabels", {
  color: "black",
});

ctx.fillStyle = "green";
ctx.fillRect(0, 0, graph.width, graph.height);

let infraredGradient = ctx.createLinearGradient(0, 0, 800, 0);
infraredGradient.addColorStop(0, "rgba(255, 0, 0, 1)");
infraredGradient.addColorStop(1, "rgba(173, 173, 173, 0.75)");

let ndviGradient = ctx2.createLinearGradient(0, 0, 0, 700);
ndviGradient.addColorStop(0, "rgba(3, 252, 49, 1)");
ndviGradient.addColorStop(1, "rgba(194, 155, 0)");

let nirvGradient = ctx4.createLinearGradient(0, 0, 0, 700);
nirvGradient.addColorStop(0, "rgb(252, 187, 5)");
nirvGradient.addColorStop(1, "rgb(194, 85, 2)");

let srGradient = ctx5.createLinearGradient(0, 0, 0, 700);
srGradient.addColorStop(0, "rgb(250, 171, 2)");
srGradient.addColorStop(1, "rgb(4, 185, 217)");

let dswiGradient = ctx6.createLinearGradient(0, 0, 0, 700);
dswiGradient.addColorStop(0, "rgb(0, 213, 255)");
dswiGradient.addColorStop(1, "rgb(0, 34, 255)");

//** LIVE DATA */
//** FILE DROP JS */
let dropArea = document.getElementById("drop-area");
let dataArray = [];
let newDataArray = [];
let dataArrayBatches = [[]];
let currentBatchArray = [[]];
let dataTimeIndex = 0;
let animationTime = 1500;
let currentDataBatchIndex = 0;

//** HTML ELEMENTS */
let menuContainer = document.getElementById("menuContainer");
let menuElement = document.getElementById("menu");
let helpButton = document.getElementById("help");

let upload_file = document.getElementById("upload_file");
let upload_additional = document.getElementById("upload_additional");
let landing = document.getElementById("landing");

let speedSlider = document.getElementById("myRange");
let frameNumber = document.getElementById("frameNumber");
let rawData_element = document.getElementById("rawData");
let visible_filter_element = document.getElementById("visible_filter");
let infrared_filter_element = document.getElementById("infrared_filter");
let ndvi_element = document.getElementById("graphs_ndvi");
let reflectance_element = document.getElementById("graphs_reflectance");
let raw_element = document.getElementById("graphs_raw");
let airSurface_element = document.getElementById("graphs_temps");
let rawOverTime_element = document.getElementById("graphs_rawOverTime");
let nirv_element = document.getElementById("graphs_nirv");
let sr_element = document.getElementById("graphs_SR");
let dswi_element = document.getElementById("graphs_DSWI");
let lastGraphed;

//** SR GRAPH RATIO SELECTORS */
let srGraph_numerator = document.getElementById("SR_Selector_1");
let srGraph_denominator = document.getElementById("SR_Selector_2");
let srGraph_numerator_value, srGraph_denominator_value;

//** HELP BUTTONS FOR PICKING GRAPHS */
let raw_element_live = document.getElementById("graphs_raw_live");
let duplicate_element_live = document.getElementById("graphs_duplicate_live");

let connectDevice = document.getElementById("plugInDevice");
let recordButton = document.getElementById("recordButton");
let recordContainer = document.getElementById("recordContainer");
let recordingText = document.getElementById("recordingText");

//let fileName_download = document.getElementById("fileName_download");

let snapShotIcon = document.getElementById("snapshot");
let snapShotIcon_2 = document.getElementById("snapshot_2");
let snapShotIcon_3 = document.getElementById("snapshot_3");
let snapShotIcon_4 = document.getElementById("snapshot_4");
let snapShotIcon_5 = document.getElementById("snapshot_5");
let snapShotIcon_6 = document.getElementById("snapshot_6");
let snapShotIcon_7 = document.getElementById("snapshot_7");
let snapShotIcon_8 = document.getElementById("snapshot_8");

let sidebar = document.getElementById("sidebar");
let sidebar_live = document.getElementById("sidebar_live");
let sidebarButton = document.getElementById("openSidebarIcon");

let readDeviceBtn = document.getElementById("read");
let recording_live_label = document.getElementById("recording_label");
let controlSidebar = document.getElementById("controlSidebar");
let controlSidebarHeader = document.getElementById("controlSidebarheader");

// let controlSidebar_live = document.getElementById("controlSidebar_live");
let controlSidebarHeader_live = document.getElementById(
  "controlSidebarheader_live"
);

let batchesContainer = document.getElementById("batchGrid");
let about_button = document.getElementById("about");
let live_chartCard = document.getElementById("chartCardLive");

//** UNDER GRAPH BUTTONS */
let download_label = document.getElementById("downloadBtn");
let raw_visibility_icon = document.getElementById("visibility_raw");
let raw_visibility_live_icon = document.getElementById("visible_raw_live");

let toggleUnitLabels_icon = document.getElementById("unitsToggle");
let toggleUnitLabels_live_icon = document.getElementById("units_live_toggle");

let raw_labels_visible = true;
let ndvi_visibility_icon = document.getElementById("visibility_ndvi");
let ndvi_labels_visible = true;

let nirv_visibility_icon = document.getElementById("visibility_nirv");
let nirv_labels_visible = true;

let reflectance_visibility_icon = document.getElementById(
  "visibility_reflectance"
);
let reflectance_labels_visible = true;

let sr_visibility_icon = document.getElementById("visibility_sr");
let sr_labels_visible = true;

let dswi_visibility_icon = document.getElementById("visibility_dswi");
let dswi_labels_visible = true;

let airSurface_visibility_icon = document.getElementById("visibility_temp");
let rawOverTime_visibility_icon = document.getElementById("visibility_rawOverTime");
let temp_labels_visible = true;
let rawOverTime_labels_visible = false;

//** EDIT RANGE */
let trim_icon = document.getElementById("trimIcon");
let done_trim = document.getElementById("done_trim");

let editRange = document.getElementById("slider-distance");
let editRange_start = document.getElementById("editRange_start");
let editRange_end = document.getElementById("editRange_end");
let editRange_thumb_start = document.getElementById("editRange_thumb_start");
let editRange_thumb_end = document.getElementById("editRange_thumb_end");

let dateHeader_label = document.getElementById("dateHeader");
let uid_label = document.getElementById("UID");
let time_label = document.getElementById("Time");
let airTemp_label = document.getElementById("air_temp");
let surfaceTemp_label = document.getElementById("surface_temp");
let relativeHumidity_label = document.getElementById("relative_humidity");
let batteryVoltage_label = document.getElementById("battery_voltage");

let air_temp_Gauge = document.getElementById("air_temp_Gauge");
let surfaceTemp_Gauge = document.getElementById("surface_temp_Gauge");
let relative_humidity_Gauge = document.getElementById("relative_humidity_Gauge");
let battery_voltage_Gauge = document.getElementById("battery_voltage_Gauge");

var surface_temp_Gradient = [
  { pct: 0.0, color: { r: 57, g: 71, b: 116 } },
  { pct: 0.166, color: { r: 57, g: 132, b: 174 } },
  { pct: 0.332, color: { r: 18, g: 149, b: 169 } },
  { pct: 0.498, color: { r: 55, g: 175, b: 174 } },
  { pct: 0.664, color: { r: 55, g: 161, b: 60 } },
  { pct: 0.83, color: { r: 199, g: 64, b: 17 } },
  { pct: 1.0, color: { r: 241, g: 1, b: 0 } }, ];

var battery_voltage_Gradient = [
  { pct: 0.0, color: { r: 252, g: 248, b: 3 } },
  { pct: 0.5, color: { r: 255, g: 179, b: 75 } },
  { pct: 1.0, color: { r: 252, g: 77, b: 39 } }, ];

  // rgb(241,1,0)
  // rgb(199,64,17)  
  // rgb(55,161,60)
  // rgb(55,175,174)
  // rgb(18,149,169)  
  // rgb(57,132,174)  
  // rgb(57,71,116)

var relative_humidity_Gradient = [
{ pct: 0.0, color: { r: 255, g: 255, b: 205 } },
{ pct: 0.166, color: { r: 199, g: 233, b: 181 } },
{ pct: 0.332, color: { r: 127, g: 205, b: 187 } },
{ pct: 0.498, color: { r: 63, g: 184, b: 197 } },
{ pct: 0.664, color: { r: 23, g: 146, b: 192 } },
{ pct: 0.83, color: { r: 28, g: 94, b: 170 } },
{ pct: 1.0, color: { r: 4, g: 40, b: 134 } }, ];

let visible_filter_range = document.getElementById("visibleFilter_range");
let duplicateScreen = document.getElementById("duplicateScreen");
let distanceInput = document.getElementById("distanceInput");

//** TUTORIAL HTML ELEMENTS */
let tut_btn_prev = document.getElementById("tut-prev");
let tut_btn_next = document.getElementById("tut-next");
let tut_btn_skip = document.getElementById("tut-skip");
let tut_text = document.getElementById("tut_text");
let tut_wrap = document.getElementById("tutorial-wrap");
let tutorialTextList = [
  "The <b>#batch</b> section of the sidebar allows you to select which batch you are currently viewing.",
  "The <b>timeline</b> below allows you to scrub through data you have captured over time.",
  "To add additional graphs, select a <b>calibration #batch</b> to base your calculations off of.",
  "Once you select a calibration batch, multiple <b>graphs</b> will become accessible. Click on each to view multiple on screen at once.",
  "While scrubbing through the timeline you can view the <b>‘Extra Info’</b> tab to see data that isn’t represented on the graph.",
];
let tutorialIndex = 0;
let tutorial = true;

//** PLAY PAUSE HTML ELEMENTS */
const box = document.querySelector(".box");
const arrowRight = document.getElementById("arrowRight");
const arrowLeft = document.getElementById("arrowLeft");
const playPauseContainer = document.getElementById("timelineContainer");

//** HELP SCREEN - ACCORDIAN FUNCTIONALITY */
var acc = document.getElementsByClassName("accordion");
let help_closeBtn = document.getElementById("help_closeBtn");
let menu_help = document.getElementById("help");
let helpScreen = document.getElementById("helpContainer");
let helpHeader = document.getElementById("helpHeader");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

//** SERIAL PORTS */
class SerialScaleController {
  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }
  async init() {
    if ("serial" in navigator) {
      try {
        if (!deviceConnected) {
          const usbVendorId = 0x239a;
          const port = await navigator.serial.requestPort({
            filters: [{ usbVendorId }],
          });
          await port.open({ baudRate: 9600 });
          this.reader = port.readable.getReader();
          let signals = await port.getSignals();
        }

        console.log("DEVICE PAIRED");
        deviceConnected = true;
        viewMode = 2;
        getSerialMessage();

        //controlSidebar_live.classList.toggle("active");
        menuElement.classList.toggle("active");
        menuContainer.classList.toggle("disable");
        helpButton.classList.toggle("active");
        sidebar_live.classList.toggle("active");
        sidebarButton.classList.toggle("active");
        if (sidebar_live.classList.contains("active")) {
          sidebarButton.innerHTML = "<";
        }

        landing.classList.toggle("active");
        duplicateScreen.classList.toggle("active");
        readDeviceBtn.classList.toggle("active");

        if (
          !document.getElementById("liveGraph").classList.contains("active")
        ) {
          document.getElementById("liveGraph").classList.toggle("active");
          updateGraphGrid();
        }
      } catch (err) {
        console.error("There was an error opening the serial port:", err);

        console.log(err == "DOMException: No port selected by the user.");
        if ("The port is already open." in err) {
          console.log("Port is already open");
          viewMode = 2;
          getSerialMessage();
          menuElement.classList.toggle("active");
          menuContainer.classList.toggle("disable");
          helpButton.classList.toggle("active");
          sidebar.classList.toggle("active");
          sidebarButton.classList.toggle("active");
          if (sidebar.classList.contains("active")) {
            sidebarButton.innerHTML = "<";
          }

          landing.classList.toggle("active");
          duplicateScreen.classList.toggle("active");
          readDeviceBtn.classList.toggle("active");
          if (
            !document.getElementById("liveGraph").classList.contains("active")
          ) {
            document.getElementById("liveGraph").classList.toggle("active");
          }
        }
      }
    } else {
      console.error(
        "Web serial doesn't seem to be enabled in your browser. Try enabling it by visiting:"
      );
      console.error(
        "chrome://flags/#enable-experimental-web-platform-features"
      );
      console.error("opera://flags/#enable-experimental-web-platform-features");
      console.error("edge://flags/#enable-experimental-web-platform-features");
    }
  }
  async read() {
    while (deviceConnected) {
      try {
        const readerData = await this.reader.read();
        //console.log(readerData);
        return this.decoder.decode(readerData.value);
      } catch (err) {
        const errorMessage = `error reading data: ${err}`;
        console.error(errorMessage);
        deviceConnected = false;
        return errorMessage;
      }
    }
  }
}
var serialTimeout;
const serialScaleController = new SerialScaleController();
var deviceConnected = false;
var paused = false;
var calibrationBatchSelected = false;
var readTime = 500;

//** VARIOUS VARIABLES */
var RESOURCE_LOADED = false;
var animPlay = true;
var animWaitFunc;
let excludeLabelList = [];
let visible_filter_array = ["V", "B", "G", "Y", "O", "R"];
let infrared_filter_array = [
  "610nm",
  "680nm",
  "730nm",
  "760nm",
  "810nm",
  "860nm",
];
let rawData_array = ["Visible", "Infrared"];
let averageData_array = ["Standard Deviation"];
let dataIsAverage = false;
let standardDeviation_array = [[]];
let delayed;
var calibrationData, calibrationData_Infrared;
var calibrationArray_Visible, calibrationArray_Infrared;

let batchIndex = 0;
let numFiles = 0;

//** VARIABLES FOR RECORDING */
var recording;
var timePassed = 0;
let timerInterval = null;

excludeLabelList = excludeLabelList.concat(
  visible_filter_array,
  infrared_filter_array,
  "Standard Deviation"
);

//** VARIABLES FOR CONTROLLING DATA */
let step = 5;
let cut = 0;
var visibleStartData = [2.4, 2.6, 2.2, 1.9, 2.0, 1.8];
var infraredStartData = [5.4, 5.0, 5.4, 6.5, 5.0, 4.3];
var visible = [...Array(1)].map((e) => Array(1));
var infrared = [...Array(1)].map((e) => Array(1));
var calibration_array = [];

//** RECORD VIDEO */
let recordedElement = document.getElementById("graph");
let videoStream = recordedElement.captureStream(30);
let mediaRecorder = new MediaRecorder(videoStream);

let chunks = [];
mediaRecorder.ondataavailable = function (e) {
  chunks.push(e.data);
};
mediaRecorder.onstop = function (e) {
  var blob = new Blob(chunks, { type: "video/mp4" });
  chunks = [];
  var videoURL = URL.createObjectURL(blob);
  window.open(videoURL, "_blank");
  // video.src = videoURL;
};
mediaRecorder.ondataavailable = function (e) {
  chunks.push(e.data);
};

const initCanvas = () => {
  const canvas = document.getElementById("graph");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Hello World", 10, 50);
};

initCanvas();

window.onload = function () {
  var canvas = document.getElementById("graph");
  var ctx = canvas.getContext("2d");
  var img = document.getElementById("spin");
  ctx.drawImage(img, 10, 10);
};

const plugin = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#99ffff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

//** DATA SETUP FOR FIRST CHART */
var data = {
  datasets: [
    //** 610 */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "610nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(212.5,0,0)",
      borderColor: "rgb(212.5,0,0)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** 680 */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "680nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 40, 40)",
      borderColor: "rgb(200, 40, 40)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** 730 */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "730nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 80, 80)",
      borderColor: "rgb(200, 80, 80)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** 760 */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "760nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 120, 120)",
      borderColor: "rgb(200, 120, 120)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** 810 */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "810nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 160, 160)",
      borderColor: "rgb(200, 160, 160)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** 860 */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "860nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 200, 200)",
      borderColor: "rgb(200, 200, 200)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** V */
    {
      data: [
        {
          x: 450,
          y: 1,
        },
      ],
      showLine: true,
      label: "V",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(147,112,219)",
      borderColor: "rgb(147,112,219)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** B */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "B",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(0,0,255)",
      borderColor: "rgb(0,0,255)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** G */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "G",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(0,255,0)",
      borderColor: "rgb(0,255,0)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** Y */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "Y",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(255,255,0)",
      borderColor: "rgb(255,255,0)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** O */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "O",
      hidden: true,
      fill: false,
      backgroundColor: "rgb(255,140,0)",
      borderColor: "rgb(255,140,0)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** R */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "R",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(255,0,0)",
      borderColor: "rgb(255,0,0)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** INFRARED */
    {
      data: [
        {
          x: 610,
          y: infraredStartData[0],
        },
        {
          x: 680,
          y: infraredStartData[1],
        },
        {
          x: 730,
          y: infraredStartData[2],
        },
        {
          x: 760,
          y: infraredStartData[3],
        },
        {
          x: 810,
          y: infraredStartData[4],
        },
        {
          x: 860,
          y: infraredStartData[5],
        },
      ],
      showLine: true,
      label: "Infrared",
      fill: true,
      backgroundColor: infraredGradient,
      borderColor: "rgb(255, 255, 255)",
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** VISIBLE dataset 13*/
    {
      data: [
        {
          x: 450,
          y: visibleStartData[0],
        },
        {
          x: 500,
          y: visibleStartData[1],
        },
        {
          x: 550,
          y: visibleStartData[2],
        },
        {
          x: 570,
          y: visibleStartData[3],
        },
        {
          x: 600,
          y: visibleStartData[4],
        },
        {
          x: 650,
          y: visibleStartData[5],
        },
      ],
      showLine: true,
      label: "Visible",
      fill: true,
      backgroundColor: visibleGradient,
      borderColor: "rgb(255, 255, 255)",
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** STANDARD DEVIATION *14*/
    {
      data: [
        {
          x: 450,
          y: 0,
        },
        {
          x: 500,
          y: visibleStartData[1],
        },
        {
          x: 550,
          y: 0,
        },
        {
          x: 570,
          y: 0,
        },
        {
          x: 600,
          y: 0,
        },
        {
          x: 610,
          y: 0,
        },
        {
          x: 650,
          y: 0,
        },
        {
          x: 680,
          y: 0,
        },
        {
          x: 730,
          y: 0,
        },
        {
          x: 760,
          y: 0,
        },
        {
          x: 810,
          y: 0,
        },
        {
          x: 860,
          y: 0,
        },
      ],
      showLine: false,
      label: "Standard Deviation",
      hidden: true,
      fill: false,
      backgroundColor: "rgb(3,140,252)",
      borderColor: "rgb(3,140,252)",
      pointBackgroundColor: "rgb(189, 195, 199)",
      order: -100,
    },
  ],
};

//** DATA SETUP FOR SECOND CHART */
var data2 = {
  datasets: [
    //** NDVI */
    {
      data: [],
      showLine: true,
      label: "NDVI",
      fill: false,
      hidden: false,
      backgroundColor: ndviGradient,
      borderColor: ndviGradient,
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
  ],
};

//** DATA SETUP FOR NIRv CHART */
var data_NIRv = {
  datasets: [
    //** NIRv */
    {
      data: [],
      showLine: true,
      label: "NIRv",
      fill: false,
      hidden: false,
      backgroundColor: nirvGradient,
      borderColor: nirvGradient,
      lineTension: 0.25,
      pointBackgroundColor: nirvGradient,
    },
  ],
};

//** DATA SETUP FOR Reflectance CHART */
var data_Reflectance = {
  datasets: [
    //** Reflectance */
    {
      data: [],
      showLine: true,
      label: "Reflectance",
      fill: false,
      hidden: false,
      backgroundColor: nirvGradient,
      borderColor: nirvGradient,
      lineTension: 0.25,
      pointBackgroundColor: nirvGradient,
    },
  ],
};

//** DATA SETUP FOR SIMPLE RATIO CHART */
var data_SR = {
  datasets: [
    {
      data: [],
      showLine: true,
      label: "SR",
      fill: false,
      hidden: false,
      backgroundColor: srGradient,
      borderColor: srGradient,
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
  ],
};

//** DATA SETUP FOR SIMPLE RATIO CHART */
var data_DSWI = {
  datasets: [
    {
      data: [],
      showLine: true,
      label: "DSWI 4",
      fill: false,
      hidden: false,
      backgroundColor: dswiGradient,
      borderColor: dswiGradient,
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
  ],
};

//** DATA SETUP FOR AIR / SURFACE TEMP CHART */
var data_Temp = {
  datasets: [
    {
      data: [],
      showLine: true,
      label: "Air Temp",
      fill: false,
      hidden: false,
      backgroundColor: dswiGradient,
      borderColor: dswiGradient,
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "Surface Temp",
      fill: false,
      hidden: false,
      backgroundColor: ndviGradient,
      borderColor: ndviGradient,
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
  ],
};

//** DATA SETUP FOR RAW - OVER TIME CHART */
var data_rawOverTime = {
  datasets: [
    {
      data: [],
      showLine: true,
      label: "450nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(198, 99, 255)",
      borderColor: "rgb(198, 99, 255)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "500nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(79, 144, 255)",
      borderColor: "rgb(79, 144, 255)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "550nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(89, 222, 115)",
      borderColor: "rgb(89, 222, 115)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "570nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(252, 247, 96)",
      borderColor: "rgb(252, 247, 96)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "600nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(252, 184, 96)",
      borderColor: "rgb(252, 184, 96)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "610nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(255, 71, 71)",
      borderColor: "rgb(255, 71, 71)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "680nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(255, 90, 90)",
      borderColor: "rgb(255, 90, 90)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "730nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(245, 110, 110)",
      borderColor: "rgb(245, 110, 110)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "760nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(240, 130, 130)",
      borderColor: "rgb(240, 130, 130)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "810nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(235, 150, 150)",
      borderColor: "rgb(235, 150, 150)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    {
      data: [],
      showLine: true,
      label: "860nm",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(230, 170, 170)",
      borderColor: "rgb(230, 170, 170)",
      lineTension: 0.25,
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
  ],
};

//** DATA SETUP FOR LIVE CHART */
var data3 = {
  datasets: [
    //** VISIBLE dataset 13*/
    {
      data: [
        {
          x: 450,
          y: visibleStartData[0],
        },
        {
          x: 500,
          y: visibleStartData[1],
        },
        {
          x: 550,
          y: visibleStartData[2],
        },
        {
          x: 570,
          y: visibleStartData[3],
        },
        {
          x: 600,
          y: visibleStartData[4],
        },
        {
          x: 650,
          y: visibleStartData[5],
        },
      ],
      showLine: true,
      label: "Visible",
      fill: true,
      backgroundColor: visibleGradient,
      borderColor: "rgb(255, 255, 255)",
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
    //** INFRARED */
    {
      data: [
        {
          x: 610,
          y: infraredStartData[0],
        },
        {
          x: 680,
          y: infraredStartData[1],
        },
        {
          x: 730,
          y: infraredStartData[2],
        },
        {
          x: 760,
          y: infraredStartData[3],
        },
        {
          x: 810,
          y: infraredStartData[4],
        },
        {
          x: 860,
          y: infraredStartData[5],
        },
      ],
      showLine: true,
      label: "Infrared",
      fill: true,
      backgroundColor: infraredGradient,
      borderColor: "rgb(255, 255, 255)",
      pointBackgroundColor: "rgb(189, 195, 199)",
    },
  ],
};

//** CONFIG SETUP FOR FIRST CHART */
const config = {
  type: "scatter",
  data: data,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: true,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "  UID: 8888",
        align: "start",
        font: {
          weight: "bold",
          family: "'Inter', sans-serif",
          size: 14,
        },
      },
      background: {
        color: "white",
      },
      legend: {
        display: true,
        labels: {
          filter: function (item, chart) {
            //** Function for filtering out legends. Chooses which Labels to exclude depending on the dataMode*/
            if (excludeLabelList.includes(item.text)) {
              return false;
            } else {
              return item;
            }
          },
        },
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value, context) => {
          if (
            (context.datasetIndex === 12 && raw_labels_visible) ||
            (context.datasetIndex === 13 && raw_labels_visible)
          ) {
            var output;

            if (toggleUnitLabels_icon.classList.contains("selected")) {
              output = value.y;
            } else {
              output = value.y + "μW/cm²";
            }

            return output;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (
            (context.datasetIndex === 12 && raw_labels_visible) ||
            (context.datasetIndex === 13 && raw_labels_visible)
          ) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        // ticks: {
        //   callback: function (value){
        //     return value + "μW/cm²";
        //   }
        // },
        title: {
          display: true,
          text: "μW/cm²",
          font: {
            size: 15,
          },
        },
      },
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Wavelength (nm)",
          align: "center",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CONFIG SETUP FOR NDVI CHART */
const config2 = {
  type: "scatter",
  data: data2,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: false,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "NDVI",
      },
      legend: {
        display: false,
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value) => {
          if (ndvi_labels_visible) {
            return Math.round((value.y + Number.EPSILON) * 100) / 100;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (ndvi_labels_visible) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        max: 1,
        min: -1,
        title: {
          display: true,
          text: "NDVI",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
      x: {
        position: "bottom",
        ticks: {
          maxTicksLimit: 5,
        },
        title: {
          display: false,
          text: "Time",
          align: "center",
          font: {
            size: 15,
          },
        },
        time: {
          displayFormats: {
            millisecond: "HH:mm:ss",
            second: "HH:mm:ss",
            minute: "HH:mm:ss",
            hour: "HH:mm:ss",
            day: "HH:mm:ss",
            week: "HH:mm:ss",
            month: "HH:mm:ss",
            quarter: "HH:mm:ss",
            year: "HH:mm:ss",
          },
        },
        type: "time",
        min: "20211017T143405Z",
        max: "20221117T143405Z",
        parsing: false,
        offset: true,
      },
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CONFIG SETUP FOR NIRv CHART */
const config_NIRv = {
  type: "scatter",
  data: data_NIRv,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: false,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "NIRv",
      },
      legend: {
        display: false,
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value) => {
          if (nirv_labels_visible) {
            return Math.round((value.y + Number.EPSILON) * 100) / 100;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (nirv_labels_visible) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        // ticks: {
        //   callback: function (value){
        //     return value + "μW/cm²";
        //   }
        // },
        // max : 1,
        // min : -1,
        title: {
          display: true,
          text: "NIRv",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
      x: {
        position: "bottom",
        ticks: {
          maxTicksLimit: 5,
        },
        title: {
          display: false,
          text: "Time",
          align: "center",
          font: {
            size: 15,
          },
        },
        time: {
          displayFormats: {
            millisecond: "HH:mm:ss",
            second: "HH:mm:ss",
            minute: "HH:mm:ss",
            hour: "HH:mm:ss",
            day: "HH:mm:ss",
            week: "HH:mm:ss",
            month: "HH:mm:ss",
            quarter: "HH:mm:ss",
            year: "HH:mm:ss",
          },
        },
        type: "time",
        min: "20211017T143405Z",
        max: "20221117T143405Z",
        parsing: false,
        offset: true,
      },
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CONFIG SETUP FOR NIRv CHART */
const config_reflectance = {
  type: "scatter",
  data: data_Reflectance,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: false,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "Reflectance",
      },
      legend: {
        display: false,
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value) => {
          if (reflectance_labels_visible) {
            return Math.round((value.y + Number.EPSILON) * 100) / 100;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (reflectance_labels_visible) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        // ticks: {
        //   callback: function (value){
        //     return value + "μW/cm²";
        //   }
        // },
        // max : 1,
        // min : -1,
        title: {
          display: true,
          text: "Reflectance",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
      x: {
        position: "bottom",
        ticks: {
          maxTicksLimit: 5,
        },
        title: {
          display: false,
          text: "Time",
          align: "center",
          font: {
            size: 15,
          },
        },
        // time: {
        //   displayFormats: {
        //     millisecond: "HH:mm:ss",
        //     second: "HH:mm:ss",
        //     minute: "HH:mm:ss",
        //     hour: "HH:mm:ss",
        //     day: "HH:mm:ss",
        //     week: "HH:mm:ss",
        //     month: "HH:mm:ss",
        //     quarter: "HH:mm:ss",
        //     year: "HH:mm:ss",
        //   },
        // },
        // type: "time",
        // min: "20211017T143405Z",
        // max: "20221117T143405Z",
        // parsing: false,
      },
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CONFIG SETUP FOR SIMPLE RATIO CHART */
const config_SR = {
  type: "scatter",
  data: data_SR,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: false,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "SR",
      },
      legend: {
        display: false,
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value) => {
          if (sr_labels_visible) {
            return Math.round((value.y + Number.EPSILON) * 100) / 100;
            //return value.y;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (sr_labels_visible) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        // ticks: {
        //   callback: function (value){
        //     return value + "μW/cm²";
        //   }
        // },
        // max : 1,
        // min : -1,
        title: {
          display: true,
          text: "Simple Ratio",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
      x: {
        position: "bottom",
        ticks: {
          maxTicksLimit: 5,
        },
        title: {
          display: false,
          text: "Time",
          align: "center",
          font: {
            size: 15,
          },
        },
        time: {
          displayFormats: {
            millisecond: "HH:mm:ss",
            second: "HH:mm:ss",
            minute: "HH:mm:ss",
            hour: "HH:mm:ss",
            day: "HH:mm:ss",
            week: "HH:mm:ss",
            month: "HH:mm:ss",
            quarter: "HH:mm:ss",
            year: "HH:mm:ss",
          },
        },
        type: "time",
        min: "20211017T143405Z",
        max: "20221117T143405Z",
        parsing: false,
        offset: true,
      },
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CONFIG SETUP FOR DSWI 4 CHART */
const config_DSWI = {
  type: "scatter",
  data: data_DSWI,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: false,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "DSWI 4",
      },
      legend: {
        display: false,
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value) => {
          if (dswi_labels_visible) {
            return Math.round((value.y + Number.EPSILON) * 100) / 100;
            //return value.y;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (dswi_labels_visible) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "DSWI 4",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
      x: {
        position: "bottom",
        ticks: {
          maxTicksLimit: 5,
        },
        title: {
          display: false,
          text: "Time",
          align: "center",
          font: {
            size: 15,
          },
        },
        time: {
          displayFormats: {
            millisecond: "HH:mm:ss",
            second: "HH:mm:ss",
            minute: "HH:mm:ss",
            hour: "HH:mm:ss",
            day: "HH:mm:ss",
            week: "HH:mm:ss",
            month: "HH:mm:ss",
            quarter: "HH:mm:ss",
            year: "HH:mm:ss",
          },
        },
        type: "time",
        min: "20211017T143405Z",
        max: "20221117T143405Z",
        parsing: false,
        offset: true,
      },
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CONFIG SETUP FOR TEMP CHART */
const configTemp = {
  type: "scatter",
  data: data_Temp,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: false,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "Air / Surface Temperature",
      },
      legend: {
        display: true,
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value) => {
          if (temp_labels_visible) {
            return Math.round((value.y + Number.EPSILON) * 100) / 100;
            //return value.y;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (temp_labels_visible) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Celsius°",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
      x: {
        offset: true,
        position: "bottom",
        ticks: {
          maxTicksLimit: 5,
          offset: true,
        },
        title: {
          display: false,
          text: "Time",
          align: "center",
          font: {
            size: 15,
          },
        },
        time: {
          displayFormats: {
            millisecond: "HH:mm:ss",
            second: "HH:mm:ss",
            minute: "HH:mm:ss",
            hour: "HH:mm:ss",
            day: "HH:mm:ss",
            week: "HH:mm:ss",
            month: "HH:mm:ss",
            quarter: "HH:mm:ss",
            year: "HH:mm:ss",
          },
        },
        type: "time",
        min: "20211017T143405Z",
        max: "20221117T143405Z",
        parsing: false,
        offset: true,
      },
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CONFIG SETUP FOR TEMP CHART */
const configRawOverTime = {
  type: "scatter",
  data: data_rawOverTime,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: false,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "RAW - Over Time",
      },
      legend: {
        display: true,
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value) => {
          if (rawOverTime_labels_visible) {
            return Math.round((value.y + Number.EPSILON) * 100) / 100;
            //return value.y;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (rawOverTime_labels_visible) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          size: 10,
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        // ticks: {
        //   callback: function (value){
        //     return value + "μW/cm²";
        //   }
        // },
        title: {
          display: true,
          text: "μW/cm²",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
      x: {
        offset: true,
        position: "bottom",
        ticks: {
          maxTicksLimit: 5,
          offset: true,
        },
        title: {
          display: false,
          text: "Time",
          align: "center",
          font: {
            size: 15,
          },
        },
        time: {
          displayFormats: {
            millisecond: "HH:mm:ss",
            second: "HH:mm:ss",
            minute: "HH:mm:ss",
            hour: "HH:mm:ss",
            day: "HH:mm:ss",
            week: "HH:mm:ss",
            month: "HH:mm:ss",
            quarter: "HH:mm:ss",
            year: "HH:mm:ss",
          },
        },
        type: "time",
        // min: "20211017T143405Z",
        // max: "20221117T143405Z",
        parsing: false,
        offset: true,
      },
    },
    layout: {
      padding: 20
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CONFIG SETUP FOR LIVE CHART */
const config3 = {
  type: "scatter",
  data: data3,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: true,
    responsive: false,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "Live Graph",
      },
      legend: {
        display: true,
      },
      //** DATA LABEL STYLING */
      datalabels: {
        //** USED TO FORMAT DATA */
        formatter: (value, context) => {
          var output;

          if (!raw_visibility_live_icon.classList.contains("selected")) {
            if (toggleUnitLabels_live_icon.classList.contains("selected")) {
              output = value.y;
            } else {
              output = value.y + "μW/cm²";
            }

            return output;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (!raw_visibility_live_icon.classList.contains("selected")) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        // ticks: {
        //   callback: function (value){
        //     return value + "μW/cm²";
        //   }
        // },
        title: {
          display: true,
          text: "μW/cm²",
          font: {
            size: 15,
          },
        },
        grace: '10%',
      },
      x: {
        type: "linear",
        position: "bottom",
        // ticks: {
        //   callback: function (value){
        //     return value + " nm";
        //   }
        // },
        title: {
          display: true,
          text: "Wavelength (nm)",
          align: "center",
          font: {
            size: 15,
          },
        },
      },
    },
  },
  plugins: [ChartDataLabels, plugin],
};

//** CHART INSTANTIATION */
const mainChart = new Chart(ctx, config);
const chart2 = new Chart(ctx2, config2);
const NIRv_chart = new Chart(ctx4, config_NIRv);
const reflectance_chart = new Chart(ctx7, config_reflectance);
const SR_chart = new Chart(ctx5, config_SR);
const DSWI_chart = new Chart(ctx6, config_DSWI);
const liveChart = new Chart(ctx3, config3);
const tempChart = new Chart (ctxTemp, configTemp);
const rawOverTime_Chart = new Chart (ctxRawOverTime, configRawOverTime);

init();
function init() {
  calibrationData = readTextFile("/files/Calibration-visible.csv", true);
  calibrationData_Infrared = readTextFile(
    "/files/calibration-infrared.csv",
    false
  );

  graphGradients();
}

//** GRABS THE DATA FROM THE DROP AND SENDS IT TO BE CONVERTED INTO A CSV */
function readTextFile(file, visible) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        var csvdata = allText;

        if (visible) {
          calibrationArray_Visible = csvToArray(csvdata);
        } else {
          calibrationArray_Infrared = csvToArray(csvdata);
        }

        //console.log(array);
        //console.log(parseFloat(calibrationArray_Visible[0].wavelength));
      }
    }
  };
  rawFile.send(null);
}

upload_file.addEventListener("input", function () {
  // if (!RESOURCE_LOADED) {
  //   var reader = new FileReader();
  //   document.getElementById("mainGraph").classList.toggle("active");
  //   //controlSidebar.classList.toggle("active");
  //   rawData_element.classList.toggle("active");
  //   visible_filter_element.classList.toggle("active");
  //   infrared_filter_element.classList.toggle("active");
  //   recordContainer.classList.toggle("active");
  //   menuElement.classList.toggle("active");
  //   menuContainer.classList.toggle("disable");
  //   helpButton.classList.toggle("active");
  //   sidebar.classList.toggle("active");
  //   sidebarButton.classList.toggle("active");
    
  //   if(sidebar.classList.contains("active"))
  //   {
  //     sidebarButton.innerHTML = "<";
  //   }

  //   landing.classList.toggle("active");

  //   graphGradients();

  //   //** WHEN THE DATA FILE IS LOADED */
  //   reader.onload = function (event) {
  //     if (reader.result.includes("average")) {
  //       console.log(reader.result.replace("average", ""));
  //       console.log("INCLUDES AVERAGE");
  //       dataIsAverage = true;
  //     } else {
  //       dataIsAverage = false;
  //     }

  //     var graphLabels = document.getElementById('graphs').getElementsByTagName("div");
  //     for(var i=0; i<graphLabels.length; i++) {
  //       if(!graphLabels[i].classList.contains('selected') && graphLabels[i].classList.contains('active'))
  //       {
  //         graphLabels[i].classList.toggle('active');
  //       }
  //     }
      
  //     // this is the first time
  //     if (! localStorage.noFirstVisit) {
  //       // check this flag for escaping this if block next time
  //       localStorage.noFirstVisit = "1";
  //     }

  //     //** IF THIS IS THE TUTORIAL */
  //     if(tutorial)
  //     {
  //       setTimeout(() => {
  //         tut_wrap.classList.toggle('active');
  //         var distance = document.getElementById('batches').offsetTop;
  //         tut_wrap.style.top = distance + 'px';
  //         tut_wrap.style.left = '17.5%';
  //       }, 1000);
  //     }

  //     newDataArray = csvToArray(reader.result);
  //     let currentBatchNmb = newDataArray[0].batch_number;
  //     //dataArrayBatches = [[]];

  //     console.log(dataArrayBatches);

  //     //** IF YOU UPLAOD AN AVERAGE FILE */
  //     if (dataIsAverage) {
  //       newDataArray[newDataArray.length - 2].timestamp =
  //         newDataArray[0].timestamp;
  //       standardDeviation_array[0] = newDataArray[newDataArray.length - 1];
  //       standardDeviation_array[0].timestamp = newDataArray[0].timestamp;
  //       var tempArray = newDataArray[newDataArray.length - 2];
  //       newDataArray = [[]];
  //       newDataArray[0] = tempArray;
  //     }

  //     let batchIndex = 0;
  //     for (let i = 0; i < newDataArray.length; i++) {
  //       //** MAKE SURE NONE OF THE DATA IS EMPTY */
  //       if (
  //         newDataArray[i].batch_number != "" &&
  //         typeof newDataArray[i].batch_number !== "undefined"
  //       ) {
  //         //** SORT THE DATA INTO DISTINCT BATCHES */
  //         if (currentBatchNmb != newDataArray[i].batch_number) {
  //           batchIndex++;
  //           currentBatchNmb = newDataArray[i].batch_number;
  //           dataArrayBatches.push(new Array());
  //         } else {
  //         }

  //         dataArrayBatches[batchIndex].push(newDataArray[i]);
  //       }
  //     }

  //     batchesContainer.innerHTML = "";
  //     document.getElementById("calibration_batch_grid").innerHTML = "";
  //     addBatches(dataArrayBatches);

  //     //** CLEAR THE ARRAY IF IT IS FULL */
  //     if (dataArray) {
  //       dataArray = [];
  //     }

  //     //console.log(event.target);
  //     const lineSplit = reader.result.split(/\r?\n/);
  //     //console.log(lineSplit);

  //     for (var i = 0; i < lineSplit.length; i++) {
  //       dataArray.push(lineSplit[i].split(","));
  //     }
  //     if (!raw_element.classList.contains("selected")) {
  //       raw_element.classList.toggle("selected");
  //     }
  //     if (ndvi_element.classList.contains("selected")) {
  //       ndvi_element.classList.toggle("selected");
  //     }

  //     RESOURCE_LOADED = true;
  //     viewMode = 1;
  //     updateChart();
  //     updateChartLabels();
  //     batchChangeUpdate();
  //   };

  //   //console.log(this.files);

  //   reader.readAsText(this.files[0]);
  // }

  // uploadFile(upload_file.files[0]);

  processFiles(upload_file.files, false);
});

upload_additional.addEventListener("input", function () {
  
  console.log("ADDITIONAL");

  processFiles(upload_additional.files, true);
});


function uploadFile(file)
{
  //** IF A FILE HAS ALREADY BEEN UPLOADED */
  if (!RESOURCE_LOADED) {
    var reader = new FileReader();
    
    //** TOGGLES FOR LANDING UI ELEMENTS */
    if(sidebar.classList.contains("active"))
    {
      sidebarButton.innerHTML = "<";
    }
    if(landing.classList.contains("active"))
    {
      document.getElementById("mainGraph").classList.toggle("active");
      //controlSidebar.classList.toggle("active");
      rawData_element.classList.toggle("active");
      //airSurface_element.classList.toggle("active");
      visible_filter_element.classList.toggle("active");
      infrared_filter_element.classList.toggle("active");
      recordContainer.classList.toggle("active");
      menuElement.classList.toggle("active");
      menuContainer.classList.toggle("disable");
      helpButton.classList.toggle("active");
      sidebar.classList.toggle("active");
      sidebarButton.classList.toggle("active");
      landing.classList.toggle("active");
    }
    graphGradients();

    //** WHEN THE DATA FILE IS LOADED */
    reader.onload = function (event) 
    {
      if (reader.result.includes("average") || reader.result.includes("standard_deviation")) 
      {
        console.log(reader.result.replace("average", ""));
        console.log("INCLUDES AVERAGE");
        dataIsAverage = true;
      } 
      else 
      {
        dataIsAverage = false;
      }

      //** UNACTIVATE GRAPH LABELS IF THEY ARE SELECTED OR ACTIVE */
      var graphLabels = document.getElementById('graphs').getElementsByTagName("div");
      
      for(var i=0; i<graphLabels.length; i++) {
        if(!graphLabels[i].classList.contains('selected') && graphLabels[i].classList.contains('active'))
        {
          if(graphLabels[i].id == "graphs_temps" || graphLabels[i].id == "graphs_rawOverTime")
          {
            if(!graphLabels[i].classList.contains('active'))
            {
              graphLabels[i].classList.toggle('active');
            }
          }
          else
          {
            graphLabels[i].classList.toggle('active');
          }
        }
      }

      // this is the first time
      if (! localStorage.noFirstVisit) 
      {
        // check this flag for escaping this if block next time
        localStorage.noFirstVisit = "1";
      }

      //** IF THIS IS THE TUTORIAL */
      if(tutorial)
      {
        setTimeout(() => {
          tut_wrap.classList.toggle("active");
          var distance = document.getElementById("batches").offsetTop;
          tut_wrap.style.top = distance + "px";
          tut_wrap.style.left = "17.5%";
        }, 1000);
      }


      //** TAKE RESULT AND GRAPH */
      newDataArray = csvToArray(reader.result);
      // for(var y = 0; y < newDataArray.length; y++)
      // {
      //   newDataArray[y].batch_number == newDataArray[y].batch_number + "(1)"
      // }
      
      let currentBatchNmb = newDataArray[0].batch_number;
      //dataArrayBatches = [[]];

      //** IF YOU UPLAOD AN AVERAGE FILE */
      if (dataIsAverage)
      {
        console.log(newDataArray);
        newDataArray[newDataArray.length - 2].timestamp = newDataArray[0].timestamp;
        standardDeviation_array[0] = newDataArray[newDataArray.length - 1];
        standardDeviation_array[0].timestamp = newDataArray[0].timestamp;
        var tempArray = newDataArray[newDataArray.length - 2];
        newDataArray = [[]];
        newDataArray[0] = tempArray;
      }

      console.log(newDataArray);

      for (let i = 0; i < newDataArray.length; i++) {
        //** MAKE SURE NONE OF THE DATA IS EMPTY */
        if (newDataArray[i].batch_number != "" &&
          typeof newDataArray[i].batch_number !== "undefined") 
        {
          //** SORT THE DATA INTO DISTINCT BATCHES */
          if (currentBatchNmb != newDataArray[i].batch_number) 
          {
            batchIndex++;
            currentBatchNmb = newDataArray[i].batch_number;
            dataArrayBatches.push(new Array());
          }

          dataArrayBatches[batchIndex].push(newDataArray[i]);
        }
      }

      batchesContainer.innerHTML = "";
      document.getElementById("calibration_batch_grid").innerHTML = "";
      addBatches(dataArrayBatches);

      //** CLEAR THE ARRAY IF IT IS FULL */
      if (dataArray) {
        dataArray = [];
      }

      //console.log(event.target);
      const lineSplit = reader.result.split(/\r?\n/);
      //console.log(lineSplit);

      for (var i = 0; i < lineSplit.length; i++) {
        dataArray.push(lineSplit[i].split(","));
      }
      if (!raw_element.classList.contains("selected")) {
        raw_element.classList.toggle("selected");
      }
      if (ndvi_element.classList.contains("selected")) 
      {
        ndvi_element.classList.toggle("selected");
      }

      RESOURCE_LOADED = true;
      viewMode = 1;
      updateChart();
      updateChartLabels();
      batchChangeUpdate();
    };

    //** THIS RUNS BEFORE CODE ABOVE, READS TEXT */
    reader.readAsText(file);
  }
}

function processFiles(files, calibration)
{
    batchIndex = 0;
    numFiles = files.length;  
    for(var i=0; i<files.length; i++)
    {
        writefiles(files[i], calibration);
        //uploadFile(files[i]);
    }
}

function writefiles(file, calibration)
{
    var reader = new FileReader();
    reader.onload = function()
    {
      if(!calibration)
      {
        uploadFile(file);
      }
      else
      {
        uploadCalibration(file);
      }
    }
    reader.readAsText(file, "UTF-8");
}

function uploadCalibration(file)
{
  var reader = new FileReader();
  reader.onload = function (event)
  {
    //** CREATE CALLIBRATION BATCH DIV ELEMENT */
    var dataArray = csvToArray(reader.result);


    if(typeof dataArray[0].timestamp == 'undefined')
    {
      alert("The file you have tried to import is corrupt. Please try another .csv or edit the one you are trying to upload");
      //return;
    }

    //** CHECK IF IT IS AN AVERAGE FILE OR NOT */
    var isAverage = false;
    if(dataArray[0].sample_number)
    {
      isAverage = true;
    }
    else
    {
      isAverage = false;
    }
    
    //** INCLUDES DIV CREATION AND CLICK EVENT */
    if(isAverage)
    {
      console.log("INCLUDES AVERAGE IN CALIBRATION");
      var divExtra = document.createElement("div");
      divExtra.id = "batchNmb";
      divExtra.innerHTML = dataArray[0].batch_number + "_(" + dataArray[0].UID + ")";
      divExtra.classList.add("active");
  
      document.getElementById("calibration_batch_grid").prepend(divExtra);
      dataArrayBatches.unshift(dataArray);
  
      var batchGrid = document
        .getElementById("calibration_batch_grid")
        .querySelectorAll("[id=batchNmb]");
  
      for(var i = 0; i < batchGrid.length; i++)
      {
        batchGrid[i].index = i;
      }
      divExtra.addEventListener('click', function() 
      {  
        var batchGrid2 = document
        .getElementById("calibration_batch_grid")
        .querySelectorAll("[id=batchNmb]");
        
        //** TOGGLE OFF ALL SELECTED ELEMENTS*/
        batchGrid2.forEach((item) => {
          if (item.classList.contains("selected")) {
            item.classList.toggle("selected");
          }
        });
  
        //** SELECT THIS BATCH AS CALLIBRATION */
        this.classList.toggle("selected");
        let calibrationArray = dataArrayBatches[this.index];
        currentDataBatchIndex = this.index;
        console.log("index: " + currentDataBatchIndex);
  
        //** TOGGLE ON ALL OTHER GRAPHS IF NOT ALREADY ON */
        if (!ndvi_element.classList.contains("active")) {
          ndvi_element.classList.toggle("active");
        }
        if (!reflectance_element.classList.contains("active")) {
          reflectance_element.classList.toggle("active");
        }
        if (!sr_element.classList.contains("active")) {
          sr_element.classList.toggle("active");
        }
        if (!dswi_element.classList.contains("active")) {
          dswi_element.classList.toggle("active");
        }
        if (!nirv_element.classList.contains("active")) {
          nirv_element.classList.toggle("active");
        }
        if(!airSurface_element.classList.contains("active")) {
          airSurface_element.classList.toggle("active");
        }
        if(!rawOverTime_element.classList.contains("active")) {
          rawOverTime_element.classList.toggle("active");
        }
  
        calibrationBatchSelected = true;
        averageCalibrationArray(calibrationArray);
      }, false);
    }
    else
    {
      console.log("DOESN'T INCLUDE AVERAGE IN CALIBRATIOn");
      alert("this is not an average or sample file");
    }
  }
  reader.readAsText(file);
}

//** USED TO UPDATE THE CHART WITH THE CONTROLS */
function updateChart(backward, index, exactIndex) {
  if (RESOURCE_LOADED) {
    speedSlider.max = currentBatchArray.length;
    speedSlider.min = 1;

    //** UPDATE TIMELINE */
    if (!index) {
      if (currentBatchArray.length >= 2) {
        if (animPlay) {
          if (dataTimeIndex < currentBatchArray.length - 1) {
            dataTimeIndex++;
          } else {
            dataTimeIndex = 0;
          }
        } else {
          //** BACKWARDS IN TIMELINE */
          if (backward) {
            if (
              dataTimeIndex < currentBatchArray.length - 1 &&
              dataTimeIndex > 0
            ) {
              dataTimeIndex--;
            } else if (dataTimeIndex == currentBatchArray.length - 1) {
              dataTimeIndex--;
            } else {
              dataTimeIndex = currentBatchArray.length - 1;
            }
          }
          //** FORWARDS IN TIMELINE */
          else if (!backward) {
            if (dataTimeIndex < currentBatchArray.length - 1) {
              dataTimeIndex++;
            } else {
              dataTimeIndex = 0;
            }
          }
        }
      } else {
        dataTimeIndex = 0;
      }

      speedSlider.value = dataTimeIndex + 1;
    } else {
      if (exactIndex) {
      } else {
        dataTimeIndex = parseInt(index) - 1;
      }
      console.log("UPDATE WITH AN INDEX: " + index);
    }

    var progress = (dataTimeIndex / (currentBatchArray.length - 1)) * 100;
    //console.log("PROGRESS: " + progress + " DATA INDEX: " + dataTimeIndex);
    frameNumber.innerHTML = dataTimeIndex + 1 + "/" + currentBatchArray.length;

    //** VISIBLE LIGHT RAW */
    mainChart.data.datasets[13].data = [
      {
        x: 450,
        y: currentBatchArray[dataTimeIndex].V450_irradiance_uW_per_cm_squared,
      },
      {
        x: 500,
        y: currentBatchArray[dataTimeIndex].B500_irradiance_uW_per_cm_squared,
      },
      {
        x: 550,
        y: currentBatchArray[dataTimeIndex].G550_irradiance_uW_per_cm_squared,
      },
      {
        x: 570,
        y: currentBatchArray[dataTimeIndex].Y570_irradiance_uW_per_cm_squared,
      },
      {
        x: 600,
        y: currentBatchArray[dataTimeIndex].O600_irradiance_uW_per_cm_squared,
      },
      {
        x: 650,
        y: currentBatchArray[dataTimeIndex].R650_irradiance_uW_per_cm_squared,
      },
    ];

    //** INFRARED RAW */
    mainChart.data.datasets[12].data = [
      {
        x: 610,
        y: currentBatchArray[dataTimeIndex].nir610_irradiance_uW_per_cm_squared,
      },
      {
        x: 680,
        y: currentBatchArray[dataTimeIndex].nir680_irradiance_uW_per_cm_squared,
      },
      {
        x: 730,
        y: currentBatchArray[dataTimeIndex].nir730_irradiance_uW_per_cm_squared,
      },
      {
        x: 760,
        y: currentBatchArray[dataTimeIndex].nir760_irradiance_uW_per_cm_squared,
      },
      {
        x: 810,
        y: currentBatchArray[dataTimeIndex].nir810_irradiance_uW_per_cm_squared,
      },
      {
        x: 860,
        y: currentBatchArray[dataTimeIndex].nir860_irradiance_uW_per_cm_squared,
      },
    ];

    //** USED FOR GRAPHING STANDARD DEVIATION */
    if (dataIsAverage) {
      mainChart.data.datasets[14].data = [
        {
          x: 450,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].V450_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].V450_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 450,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].V450_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].V450_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 500,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].B500_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].B500_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 500,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].B500_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].B500_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 550,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].G550_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].G550_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 550,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].G550_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].G550_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 570,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].Y570_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].Y570_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 570,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].Y570_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].Y570_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 600,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].O600_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].O600_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 600,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].O600_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].O600_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 610,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir610_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].nir610_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 610,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir610_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].nir610_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 650,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].R650_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].R650_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 650,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex].R650_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].R650_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 680,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir680_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].nir680_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 680,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir680_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].nir680_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 730,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir730_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].nir730_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 730,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir730_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].nir730_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 760,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir760_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].nir760_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 760,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir760_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].nir760_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 810,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir810_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].nir810_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 810,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir810_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].nir810_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 860,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir860_irradiance_uW_per_cm_squared
            ) +
            parseFloat(
              standardDeviation_array[0].nir860_irradiance_uW_per_cm_squared
            ),
        },
        {
          x: 860,
          y:
            parseFloat(
              currentBatchArray[dataTimeIndex]
                .nir860_irradiance_uW_per_cm_squared
            ) -
            parseFloat(
              standardDeviation_array[0].nir860_irradiance_uW_per_cm_squared
            ),
        },
      ];
    }

    //** ADD ALL NORMALIZED VALUES TO CURVE, START AT ONE TO AVOID LABELS*/
    //** NORMALIZED VISIBLE */
    for (let i = 0; i < (calibrationArray_Visible.length - cut) / step; i++) {
      mainChart.data.datasets[6].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          currentBatchArray[dataTimeIndex].V450_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Visible[i * step].V450_power),
      };
      mainChart.data.datasets[7].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          currentBatchArray[dataTimeIndex].B500_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Visible[i * step].B500_power),
      };
      mainChart.data.datasets[8].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          currentBatchArray[dataTimeIndex].G550_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Visible[i * step].G550_power),
      };
      mainChart.data.datasets[9].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          currentBatchArray[dataTimeIndex].Y570_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Visible[i * step].Y570_power),
      };
      mainChart.data.datasets[10].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          currentBatchArray[dataTimeIndex].O600_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Visible[i * step].O600_power),
      };
      mainChart.data.datasets[11].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          currentBatchArray[dataTimeIndex].R650_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Visible[i * step].R650_power),
      };
    }
    //** NORMALIZED INFRARED */
    for (let i = 0; i < (calibrationArray_Infrared.length - cut) / step; i++) {
      mainChart.data.datasets[0].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          currentBatchArray[dataTimeIndex].nir610_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Infrared[i * step].nir610_power),
      };
      mainChart.data.datasets[1].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          currentBatchArray[dataTimeIndex].nir680_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Infrared[i * step].nir680_power),
      };
      mainChart.data.datasets[2].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          currentBatchArray[dataTimeIndex].nir730_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Infrared[i * step].nir730_power),
      };
      mainChart.data.datasets[3].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          currentBatchArray[dataTimeIndex].nir760_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Infrared[i * step].nir760_power),
      };
      mainChart.data.datasets[4].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          currentBatchArray[dataTimeIndex].nir810_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Infrared[i * step].nir810_power),
      };
      mainChart.data.datasets[5].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          currentBatchArray[dataTimeIndex].nir860_irradiance_uW_per_cm_squared *
          parseFloat(calibrationArray_Infrared[i * step].nir860_power),
      };
    }

    //** UPDATE AIR / SURFACE TEMP */
    for (let i = 0; i < currentBatchArray.length; i++) {
      
      //** GRAB LAST VALUE OF ARRAY TO SET THE MAX TIMESTAMP OF CHART */
      if (i == currentBatchArray.length - 1) {
        tempChart.options.scales.x.max = currentBatchArray[i].timestamp.replace(
          /\s/g,
          ""
        );
      }
      //** GRAB FIRST VALUE OF ARRAY TO SET THE MIN TIMESTAMP OF CHART */
      else if (i == 0) {
        tempChart.options.scales.x.min = currentBatchArray[i].timestamp.replace(
          /\s/g,
          ""
        );
      }

      tempChart.data.datasets[0].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].air_temperature_C),
      };
      tempChart.data.datasets[1].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].surface_temperature_C),
      };
    }

    //** UPDATE RAW - OVER TIME */
    for (let i = 0; i < currentBatchArray.length; i++) {
      //** GRAB LAST VALUE OF ARRAY TO SET THE MAX TIMESTAMP OF CHART */
      if (i == currentBatchArray.length - 1) {
        rawOverTime_Chart.options.scales.x.max = currentBatchArray[i].timestamp.replace(
          /\s/g,
          ""
        );
      }
      //** GRAB FIRST VALUE OF ARRAY TO SET THE MIN TIMESTAMP OF CHART */
      else if (i == 0) {
        rawOverTime_Chart.options.scales.x.min = currentBatchArray[i].timestamp.replace(
          /\s/g,
          ""
        );
      }

      //** 450 NM */
      rawOverTime_Chart.data.datasets[0].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].V450_irradiance_uW_per_cm_squared),
      };
      //** 500 NM */
      rawOverTime_Chart.data.datasets[1].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].B500_irradiance_uW_per_cm_squared),
      };
      //** 550 NM */
      rawOverTime_Chart.data.datasets[2].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].G550_irradiance_uW_per_cm_squared),
      };
      //** 570 NM */
      rawOverTime_Chart.data.datasets[3].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].Y570_irradiance_uW_per_cm_squared),
      };
      //** 600 NM */
      rawOverTime_Chart.data.datasets[4].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].O600_irradiance_uW_per_cm_squared),
      };
      //** 610 NM */
      rawOverTime_Chart.data.datasets[5].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].nir610_irradiance_uW_per_cm_squared),
      };
      //** 680 NM */
      rawOverTime_Chart.data.datasets[6].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].nir680_irradiance_uW_per_cm_squared),
      };
      //** 730 NM */
      rawOverTime_Chart.data.datasets[7].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].nir730_irradiance_uW_per_cm_squared),
      };
      //** 760 NM */
      rawOverTime_Chart.data.datasets[8].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].nir760_irradiance_uW_per_cm_squared),
      };
      //** 810 NM */
      rawOverTime_Chart.data.datasets[9].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].nir810_irradiance_uW_per_cm_squared),
      };
      //** 860 NM */
      rawOverTime_Chart.data.datasets[10].data[i] = {
        x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
        // x: parseFloat(currentBatchArray[i].decimal_hour),
        y: parseFloat(currentBatchArray[i].nir860_irradiance_uW_per_cm_squared),
      };
    }

    //** UPDATE NDVI */
    if (ndvi_element.classList.contains("selected")) {
      for (let i = 0; i < currentBatchArray.length; i++) {
        //** GRAB LAST VALUE OF ARRAY TO SET THE MAX TIMESTAMP OF CHART */
        if (i == currentBatchArray.length - 1) {
          chart2.options.scales.x.max = currentBatchArray[i].timestamp.replace(
            /\s/g,
            ""
          );
        }
        //** GRAB FIRST VALUE OF ARRAY TO SET THE MIN TIMESTAMP OF CHART */
        else if (i == 0) {
          chart2.options.scales.x.min = currentBatchArray[i].timestamp.replace(
            /\s/g,
            ""
          );
        }

        chart2.data.datasets[0].data[i] = {
          x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
          // x: parseFloat(currentBatchArray[i].decimal_hour),
          y: calculateNDVI(i),
        };
      }
    }

    //** UPDATE REFLECTANCE */
    if (reflectance_element.classList.contains("selected")) {
      console.log("V450: " + currentBatchArray[dataTimeIndex].V450_reflectance);
      console.log("B500: " + currentBatchArray[dataTimeIndex].B500_reflectance);
      console.log("G550: " + currentBatchArray[dataTimeIndex].G550_reflectance);
      console.log("Y570: " + currentBatchArray[dataTimeIndex].Y570_reflectance);
      console.log("O600: " + currentBatchArray[dataTimeIndex].O600_reflectance);
      console.log("R650: " + currentBatchArray[dataTimeIndex].R650_reflectance);
      console.log(
        "nir610: " + currentBatchArray[dataTimeIndex].nir610_reflectance
      );
      console.log(
        "nir680: " + currentBatchArray[dataTimeIndex].nir680_reflectance
      );
      console.log(
        "nir730: " + currentBatchArray[dataTimeIndex].nir730_reflectance
      );
      console.log(
        "nir760: " + currentBatchArray[dataTimeIndex].nir760_reflectance
      );
      console.log(
        "nir810: " + currentBatchArray[dataTimeIndex].nir810_reflectance
      );
      console.log(
        "nir860: " + currentBatchArray[dataTimeIndex].nir860_reflectance
      );
      console.log("DATA TIME INDEX: " + dataTimeIndex);

      reflectance_chart.data.datasets[0].data = [
        {
          x: 450,
          y: currentBatchArray[dataTimeIndex].V450_reflectance,
        },
        {
          x: 500,
          y: currentBatchArray[dataTimeIndex].B500_reflectance,
        },
        {
          x: 550,
          y: currentBatchArray[dataTimeIndex].G550_reflectance,
        },
        {
          x: 570,
          y: currentBatchArray[dataTimeIndex].Y570_reflectance,
        },
        {
          x: 600,
          y: currentBatchArray[dataTimeIndex].O600_reflectance,
        },
        {
          x: 610,
          y: currentBatchArray[dataTimeIndex].nir610_reflectance,
        },
        {
          x: 650,
          y: currentBatchArray[dataTimeIndex].R650_reflectance,
        },
        {
          x: 680,
          y: currentBatchArray[dataTimeIndex].nir680_reflectance,
        },
        {
          x: 730,
          y: currentBatchArray[dataTimeIndex].nir730_reflectance,
        },
        {
          x: 760,
          y: currentBatchArray[dataTimeIndex].nir760_reflectance,
        },
        {
          x: 810,
          y: currentBatchArray[dataTimeIndex].nir810_reflectance,
        },
        {
          x: 860,
          y: currentBatchArray[dataTimeIndex].nir860_reflectance,
        },
      ];
      //console.log(currentBatchArray[dataTimeIndex]);
    }

    //** UPDATE NIRv */
    if (calibrationBatchSelected) {
      for (let i = 0; i < currentBatchArray.length; i++) {
        //** GRAB LAST VALUE OF ARRAY TO SET THE MAX TIMESTAMP OF CHART */
        if (i == currentBatchArray.length - 1) {
          NIRv_chart.options.scales.x.max = currentBatchArray[
            i
          ].timestamp.replace(/\s/g, "");
          //console.log(currentBatchArray[i].timestamp.replace(/\s/g, ""));
        }
        //** GRAB FIRST VALUE OF ARRAY TO SET THE MIN TIMESTAMP OF CHART */
        else if (i == 0) {
          NIRv_chart.options.scales.x.min = currentBatchArray[
            i
          ].timestamp.replace(/\s/g, "");
        }

        NIRv_chart.data.datasets[0].data[i] = {
          x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
          // x: parseFloat(currentBatchArray[i].decimal_hour),
          y: currentBatchArray[i].NIRv,
        };
      }
      //console.log("GRAPHED NIRv");
    }

    //** UPDATE SR or SIMPLE RATIO **//
    if (sr_element.classList.contains("selected")) {
      for (let i = 0; i < currentBatchArray.length; i++) {
        //** GRAB LAST VALUE OF ARRAY TO SET THE MAX TIMESTAMP OF CHART */
        if (i == currentBatchArray.length - 1) {
          SR_chart.options.scales.x.max = currentBatchArray[
            i
          ].timestamp.replace(/\s/g, "");
        }
        //** GRAB FIRST VALUE OF ARRAY TO SET THE MIN TIMESTAMP OF CHART */
        else if (i == 0) {
          SR_chart.options.scales.x.min = currentBatchArray[
            i
          ].timestamp.replace(/\s/g, "");
        }

        //** SELECT NUMERATOR BASED ON SELECTOR VALUE */
        if (srGraph_numerator.value == "450nm") {
          srGraph_numerator_value =
            currentBatchArray[i].V450_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "500nm") {
          srGraph_numerator_value =
            currentBatchArray[i].B500_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "550nm") {
          srGraph_numerator_value =
            currentBatchArray[i].G550_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "570nm") {
          srGraph_numerator_value =
            currentBatchArray[i].Y570_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "600nm") {
          srGraph_numerator_value =
            currentBatchArray[i].O600_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "650nm") {
          srGraph_numerator_value =
            currentBatchArray[i].R650_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "610nm") {
          srGraph_numerator_value =
            currentBatchArray[i].nir610_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "680nm") {
          srGraph_numerator_value =
            currentBatchArray[i].nir680_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "730nm") {
          srGraph_numerator_value =
            currentBatchArray[i].nir730_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "760nm") {
          srGraph_numerator_value =
            currentBatchArray[i].nir760_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "810nm") {
          srGraph_numerator_value =
            currentBatchArray[i].nir810_irradiance_uW_per_cm_squared;
        } else if (srGraph_numerator.value == "860nm") {
          srGraph_numerator_value =
            currentBatchArray[i].nir860_irradiance_uW_per_cm_squared;
        }
        //** DENOMINATOR */
        if (srGraph_denominator.value == "450nm") {
          srGraph_denominator_value =
            currentBatchArray[i].V450_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "500nm") {
          srGraph_denominator_value =
            currentBatchArray[i].B500_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "550nm") {
          srGraph_denominator_value =
            currentBatchArray[i].G550_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "570nm") {
          srGraph_denominator_value =
            currentBatchArray[i].Y570_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "600nm") {
          srGraph_denominator_value =
            currentBatchArray[i].O600_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "650nm") {
          srGraph_denominator_value =
            currentBatchArray[i].R650_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "610nm") {
          srGraph_denominator_value =
            currentBatchArray[i].nir610_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "680nm") {
          srGraph_denominator_value =
            currentBatchArray[i].nir680_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "730nm") {
          srGraph_denominator_value =
            currentBatchArray[i].nir730_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "760nm") {
          srGraph_denominator_value =
            currentBatchArray[i].nir760_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "810nm") {
          srGraph_denominator_value =
            currentBatchArray[i].nir810_irradiance_uW_per_cm_squared;
        } else if (srGraph_denominator.value == "860nm") {
          srGraph_denominator_value =
            currentBatchArray[i].nir860_irradiance_uW_per_cm_squared;
        }

        currentBatchArray[i].simpleRatio =
          srGraph_numerator_value / srGraph_denominator_value;
        // currentBatchArray[i].simpleRatio = currentBatchArray[i].nir860_irradiance_uW_per_cm_squared / currentBatchArray[i].R650_irradiance_uW_per_cm_squared;
        // currentBatchArray[i].simpleRatio = currentBatchArray[i].nir860_reflectance / currentBatchArray[i].R650_reflectance;

        SR_chart.data.datasets[0].data[i] = {
          x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
          y: currentBatchArray[i].simpleRatio,
        };

        //console.log("GRAPHED Simple Ratio: " + currentBatchArray[i].B500_irradiance_uW_per_cm_squared);
      }
    }

    //** UPDATE DSWI 4 **//
    if (dswi_element.classList.contains("selected")) {
      for (let i = 0; i < currentBatchArray.length; i++) {
        //** GRAB LAST VALUE OF ARRAY TO SET THE MAX TIMESTAMP OF CHART */
        if (i == currentBatchArray.length - 1) {
          DSWI_chart.options.scales.x.max = currentBatchArray[
            i
          ].timestamp.replace(/\s/g, "");
        }
        //** GRAB FIRST VALUE OF ARRAY TO SET THE MIN TIMESTAMP OF CHART */
        else if (i == 0) {
          DSWI_chart.options.scales.x.min = currentBatchArray[
            i
          ].timestamp.replace(/\s/g, "");
        }

        //currentBatchArray[i].DSWI = currentBatchArray[i].G550_irradiance_uW_per_cm_squared / currentBatchArray[i].nir680_irradiance_uW_per_cm_squared;
        currentBatchArray[i].DSWI =
          currentBatchArray[i].G550_reflectance /
          currentBatchArray[i].nir680_reflectance;

        DSWI_chart.data.datasets[0].data[i] = {
          x: currentBatchArray[i].timestamp.replace(/\s/g, ""),
          y: currentBatchArray[i].DSWI,
        };
      }
    }
    //** UPDATE EXTRA INFO LABELS */
    dateHeader_label.innerHTML =
      currentBatchArray[dataTimeIndex].timestamp
        .replace(/\s/g, "")
        .substring(4, 6) +
      "/" +
      currentBatchArray[dataTimeIndex].timestamp
        .replace(/\s/g, "")
        .substring(6, 8) +
      "/" +
      currentBatchArray[dataTimeIndex].timestamp
        .replace(/\s/g, "")
        .substring(0, 4);

    // uid_label.innerHTML = "UID: " + currentBatchArray[dataTimeIndex].UID;

    var string = currentBatchArray[dataTimeIndex].timestamp.replace(/\s/g, ""),
      date = new Date(
        string.replace(/(....)(..)(.....)(..)(.*)/, "$1-$2-$3:$4:$5")
      );
    var dateTime_time = date.toLocaleTimeString("en-US");
    time_label.innerHTML = "time: " + dateTime_time;
    
    airTemp_label.innerHTML = currentBatchArray[dataTimeIndex].air_temperature_C;
    updateGauge(air_temp_Gauge, surface_temp_Gradient, currentBatchArray[dataTimeIndex].air_temperature_C, -20, 60);

    //** CHECK FOR SURFACE TEMP NAME DIFFERENCES IN THE CSV */
    var currentSurfaceTemp;
    if (currentBatchArray[dataTimeIndex].surface_temperature) {
      currentSurfaceTemp = currentBatchArray[dataTimeIndex].surface_temperature;
    } else if (currentBatchArray[dataTimeIndex].surface_temperature_C) {
      currentSurfaceTemp =
        currentBatchArray[dataTimeIndex].surface_temperature_C;
    } else {
      currentSurfaceTemp = 0;
    }
    
    surfaceTemp_label.innerHTML = currentSurfaceTemp;
    updateGauge(surfaceTemp_Gauge, surface_temp_Gradient, currentSurfaceTemp, -20, 60);

    //** CHECK FOR RELATIVE HUMIDITY NAME DIFFERENCES IN THE CSV */
    var currentRelativeHumidity;
    if (currentBatchArray[dataTimeIndex].relative_humidity) {
      currentRelativeHumidity =
        currentBatchArray[dataTimeIndex].relative_humidity;
    } else if (currentBatchArray[dataTimeIndex].relative_humidity_percent) {
      currentRelativeHumidity =
        currentBatchArray[dataTimeIndex].relative_humidity_percent;
    } else {
      currentRelativeHumidity = 0;
    }

    relativeHumidity_label.innerHTML = currentRelativeHumidity;
    updateGauge(relative_humidity_Gauge, relative_humidity_Gradient, currentRelativeHumidity, 0, 100);

    batteryVoltage_label.innerHTML = currentBatchArray[dataTimeIndex].battery_voltage;
    updateGauge(battery_voltage_Gauge, battery_voltage_Gradient, currentBatchArray[dataTimeIndex].battery_voltage, 0, 16);

    mainChart.update();
    reflectance_chart.update();
    chart2.update();
    liveChart.update();
    NIRv_chart.update();
    SR_chart.update();
    DSWI_chart.update();
    tempChart.update();
    rawOverTime_Chart.update();

    //** CALLS AN UPDATE FUNCTION */
    if (animPlay) {
      clearTimeout(animWaitFunc);
      animWaitFunc = setTimeout(function () {
        if (animPlay) {
          updateChart();
        }
      }, animationTime);
    } else {
      clearTimeout(animWaitFunc);
    }
  }
}

//** UPDATES THE GRAPHS GRADIENTS BASED ON THEIR SCREEN SIZE*/
function graphGradients() {
  //** USE TIMEOUT TO GIVE GRAPHS A CHANCE TO RESIZE */
  setTimeout(() => {
    //console.log("HEIGHT: " + chart2.height + ", WIDTH: " + chart2.width);

    //** MAIN GRAPH */
    visibleGradient = ctx.createLinearGradient(0, 0, mainChart.width / 2, 0);
    visibleGradient.addColorStop(0.1, "rgba(0, 0, 255, 0.75)");
    visibleGradient.addColorStop(0.25, "rgba(0, 255, 0, 0.75)");
    visibleGradient.addColorStop(0.5, "rgba(255, 255, 0, 0.75)");
    visibleGradient.addColorStop(0.75, "rgba(255, 102, 0, 0.75)");
    visibleGradient.addColorStop(1, "rgba(255, 0, 0, 0.75)");

    infraredGradient = ctx.createLinearGradient(0, 0, mainChart.width, 0);
    infraredGradient.addColorStop(0, "rgba(255, 0, 0, 1)");
    infraredGradient.addColorStop(1, "rgba(173, 173, 173, 0.75)");

    mainChart.data.datasets[13].backgroundColor = visibleGradient;
    mainChart.data.datasets[13].borderColor = visibleGradient;

    mainChart.data.datasets[12].backgroundColor = infraredGradient;
    mainChart.data.datasets[12].borderColor = infraredGradient;

    //** NDVI GRAPH */
    ndviGradient = ctx2.createLinearGradient(0, 0, 0, chart2.height / 2);
    ndviGradient.addColorStop(0, "rgba(3, 252, 49, 1)");
    ndviGradient.addColorStop(1, "rgba(194, 155, 0)");

    chart2.data.datasets[0].backgroundColor = ndviGradient;
    chart2.data.datasets[0].borderColor = ndviGradient;

    //** NIRv GRAPH */
    nirvGradient = ctx4.createLinearGradient(0, 0, 0, NIRv_chart.height / 2);
    nirvGradient.addColorStop(0, "rgb(252, 187, 5)");
    nirvGradient.addColorStop(1, "rgb(194, 85, 2)");

    NIRv_chart.data.datasets[0].backgroundColor = nirvGradient;
    NIRv_chart.data.datasets[0].borderColor = nirvGradient;

    //** SIMPLE RATIO GRAPH */
    srGradient = ctx4.createLinearGradient(0, 0, 0, SR_chart.height);
    srGradient.addColorStop(0, "rgb(250, 171, 2)");
    srGradient.addColorStop(1, "rgb(4, 185, 217)");

    //** DSWI 4 GRADIENT */
    let dswiGradient = ctx6.createLinearGradient(0, 0, 0, 700);
    dswiGradient.addColorStop(0, "rgb(0, 213, 255)");
    dswiGradient.addColorStop(1, "rgb(0, 34, 255)");

    SR_chart.data.datasets[0].backgroundColor = srGradient;
    SR_chart.data.datasets[0].borderColor = srGradient;

    mainChart.update();
    chart2.update();
    NIRv_chart.update();
    SR_chart.update();
    DSWI_chart.update();
    tempChart.update();
    rawOverTime_Chart.update();
  }, 500);
}

//** CONVERTS THE INCOMING TEXT FILE INTO A USABLE CSV ARRAY */
function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      header = header.replace(/\s/g, "");

      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

//** UPDATES THE CHART'S LEGENDS TO DISPLAY DEPENDING ON WHAT DATA IS SELECTED */
function updateChartLabels() {
  excludeLabelList = [];

  //excludeLabelList = excludeLabelList.concat(averageData_array);

  if (rawData_element.classList.contains("selected")) {
    mainChart.getDatasetMeta(12).hidden = false;
    mainChart.getDatasetMeta(13).hidden = false;
  } else {
    excludeLabelList = excludeLabelList.concat(rawData_array);
    console.log("Raw Data is not selected: " + excludeLabelList);
    mainChart.getDatasetMeta(12).hidden = true;
    mainChart.getDatasetMeta(13).hidden = true;
  }
  if (visible_filter_element.classList.contains("selected")) {
    console.log("Visible data is Selected: ");
    mainChart.getDatasetMeta(6).hidden = false;
    mainChart.getDatasetMeta(7).hidden = false;
    mainChart.getDatasetMeta(8).hidden = false;
    mainChart.getDatasetMeta(9).hidden = false;
    mainChart.getDatasetMeta(10).hidden = false;
    mainChart.getDatasetMeta(11).hidden = false;
  } else {
    excludeLabelList = excludeLabelList.concat(visible_filter_array);
    mainChart.getDatasetMeta(6).hidden = true;
    mainChart.getDatasetMeta(7).hidden = true;
    mainChart.getDatasetMeta(8).hidden = true;
    mainChart.getDatasetMeta(9).hidden = true;
    mainChart.getDatasetMeta(10).hidden = true;
    mainChart.getDatasetMeta(11).hidden = true;
  }
  if (infrared_filter_element.classList.contains("selected")) {
    console.log("Infrared data is Selected: ");
    mainChart.getDatasetMeta(0).hidden = false;
    mainChart.getDatasetMeta(1).hidden = false;
    mainChart.getDatasetMeta(2).hidden = false;
    mainChart.getDatasetMeta(3).hidden = false;
    mainChart.getDatasetMeta(4).hidden = false;
    mainChart.getDatasetMeta(5).hidden = false;
  } else {
    excludeLabelList = excludeLabelList.concat(infrared_filter_array);
    mainChart.getDatasetMeta(0).hidden = true;
    mainChart.getDatasetMeta(1).hidden = true;
    mainChart.getDatasetMeta(2).hidden = true;
    mainChart.getDatasetMeta(3).hidden = true;
    mainChart.getDatasetMeta(4).hidden = true;
    mainChart.getDatasetMeta(5).hidden = true;
  }
  if (!dataIsAverage) {
    excludeLabelList = excludeLabelList.concat(averageData_array);
    mainChart.getDatasetMeta(14).hidden = true;
  } else {
    mainChart.getDatasetMeta(14).hidden = false;
  }

  //console.log(excludeLabelList);
  mainChart.update();
}

function calculateNDVI(index) {
  // var b1 = "nir810_irradiance_uW_per_cm_squared";
  // var b2 = "nir680_irradiance_uW_per_cm_squared";

  var b1 = "nir810_reflectance";
  var b2 = "nir680_reflectance";

  //console.log(currentBatchArray[index])

  var ndvi =
    (parseFloat(currentBatchArray[index][b1]) -
      parseFloat(currentBatchArray[index][b2])) /
    (parseFloat(currentBatchArray[index][b1]) +
      parseFloat(currentBatchArray[index][b2]));

  return ndvi;
}

//READS MESSAGES BEING SENT THROUGH THE SERIAL PORT *//
async function getSerialMessage() {
  clearTimeout(serialTimeout);

  serialTimeout = setTimeout(async function () {
    if (deviceConnected) {
      var message = await serialScaleController.read();
      console.log(message);
      getSerialMessage();
      decipherSerialMessage(message);
      //console.log("update read");
    }
  }, readTime);
}

function decipherSerialMessage(message) {
  let messageSplit = message.split(" ");
  console.log(messageSplit);
  if (message.includes("paused")) {
    //console.log("PAUSED");
    paused = true;
    if (!recording_live_label.classList.contains("pause")) {
      recording_live_label.classList.toggle("pause");
      console.log("FIRE");
    }
  }
  //** IF THE FULL MESSAGE DIDN"T COME IN */
  else if (message.length < 5) {
    if (message.includes("p") || message.includes(".")) {
      paused = true;
      if (!recording_live_label.classList.contains("pause")) {
        recording_live_label.classList.toggle("pause");
        console.log("FIRE");
      }
    }
  }
  //** IF THE MESSAGE CONTAINS... */
  else {
    //** SURFACE TEMP */
    if (messageSplit.includes("surface_temp,")) {
      let surface_temp =
        messageSplit[messageSplit.indexOf("surface_temp,") + 1];
      let surface_temp_float = parseFloat(surface_temp);

      if (!isNaN(surface_temp_float)) {
        let surface_temp_string = "Surface: " + surface_temp_float + "C";
        document.getElementById("surfaceTemp_label").innerHTML =
          surface_temp_string.replace(/ /g, "");
      }

      if (recording_live_label.classList.contains("pause")) {
        recording_live_label.classList.toggle("pause");
        console.log("FIRE");
      }
    }
    //** AIR TEMP */
    if (messageSplit.includes("air_temp,")) {
      let airTemp = messageSplit[messageSplit.indexOf("air_temp,") + 1];
      if (!isNaN(parseFloat(airTemp))) {
        document.getElementById("airTemp_label").innerHTML =
          "Air: " + parseFloat(airTemp) + "C";
      }
    }
    //** TIMESTAMP */
    if (
      messageSplit.includes("hour,") &&
      messageSplit.includes("min,") &&
      messageSplit.includes("sec,")
    ) {
      if (
        messageSplit.indexOf("hour,") + 1 &&
        messageSplit.indexOf("min,") + 1 &&
        messageSplit.indexOf("sec,") + 1
      ) {
        let hour = messageSplit[messageSplit.indexOf("hour,") + 1];
        let min = messageSplit[messageSplit.indexOf("min,") + 1];
        let sec = messageSplit[messageSplit.indexOf("sec,") + 1];

        if (
          !isNaN(parseFloat(hour)) &&
          !isNaN(parseFloat(min)) &&
          !isNaN(parseFloat(sec))
        ) {
          if (parseInt(hour) < 10) {
            hour = "0" + hour.substring(0, hour.length - 1);
          } else {
            hour = hour.substring(0, hour.length - 1);
          }
          if (parseInt(min) < 10) {
            min = "0" + min.substring(0, min.length - 1);
          } else {
            min = min.substring(0, min.length - 1);
          }
          if (parseInt(sec) < 10) {
            sec = "0" + sec.substring(0, sec.length - 1);
          } else {
            sec = sec.substring(0, sec.length - 1);
          }

          document.getElementById("timestamp_label").innerHTML =
            hour + ":" + min + ":" + sec + "Z";
        }
      }
    }
    //** DATESTAMP */
    if (
      messageSplit.includes("year,") &&
      messageSplit.includes("month,") &&
      messageSplit.includes("day,")
    ) {
      if (
        messageSplit.indexOf("year,") + 1 &&
        messageSplit.indexOf("month,") + 1 &&
        messageSplit.indexOf("day,") + 1
      ) {
        let year = messageSplit[messageSplit.indexOf("year,") + 1];
        let month = messageSplit[messageSplit.indexOf("month,") + 1];
        let day = messageSplit[messageSplit.indexOf("day,") + 1];

        if (
          !isNaN(parseInt(year)) &&
          !isNaN(parseInt(year)) &&
          !isNaN(parseInt(year))
        ) {
          if (parseInt(year) < 10) {
            year = "0" + year.substring(0, year.length - 1);
          } else {
            year = year.substring(0, year.length - 1);
          }
          if (parseInt(month) < 10) {
            month = "0" + month.substring(0, month.length - 1);
          } else {
            month = month.substring(0, month.length - 1);
          }
          if (parseInt(day) < 10) {
            day = "0" + day.substring(0, day.length - 1);
          } else {
            day = day.substring(0, day.length - 1);
          }

          document.getElementById("date_label").innerHTML =
            year + "-" + month + "-" + day;
        }
      }
    }
    if (messageSplit.includes("batch,")) {
      let batchNmb = messageSplit[messageSplit.indexOf("batch,") + 1];

      if (!isNaN(parseFloat(batchNmb))) {
        document.getElementById("batchNmb_label").innerHTML =
          parseFloat(batchNmb);
      }
    }
    // if (messageSplit.includes("UID,")) {
    //   let uid = messageSplit[messageSplit.indexOf("UID,") + 1];
    //   if (!isNaN(parseFloat(uid))) {
    //     document.getElementById("UID_label").innerHTML =
    //       "UID: " + parseFloat(uid);
    //   }
    // }

    var v450_value,
      b500_value,
      g550_value,
      y570_value,
      o600_value,
      r650_value,
      i610_value,
      i680_value,
      i730_value,
      i760_value,
      i810_value,
      i860_value = 0;

    //** UPDATE VISIBLE LIVE VALUES */
    if (messageSplit.includes("v450,")) {
      let v450 = messageSplit[messageSplit.indexOf("v450,") + 1];
      v450_value = parseFloat(v450);

      if (!isNaN(v450_value)) {
        document.getElementById("v450_label").innerHTML = "V450: " + v450_value;
        liveChart.data.datasets[0].data[0] = {
          x: 450,
          y: v450_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("b500,")) {
      let b500 = messageSplit[messageSplit.indexOf("b500,") + 1];
      b500_value = parseFloat(b500);

      if (!isNaN(b500_value)) {
        document.getElementById("b500_label").innerHTML = "B500: " + b500_value;
        liveChart.data.datasets[0].data[1] = {
          x: 500,
          y: b500_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("g550,")) {
      let g550 = messageSplit[messageSplit.indexOf("g550,") + 1];
      g550_value = parseFloat(g550);

      if (!isNaN(g550_value)) {
        document.getElementById("g550_label").innerHTML = "G550: " + g550_value;
        liveChart.data.datasets[0].data[2] = {
          x: 550,
          y: g550_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("y570,")) {
      let y570 = messageSplit[messageSplit.indexOf("y570,") + 1];
      y570_value = parseFloat(y570);

      if (!isNaN(y570_value)) {
        document.getElementById("y570_label").innerHTML = "Y570: " + y570_value;
        liveChart.data.datasets[0].data[3] = {
          x: 570,
          y: y570_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("o600,")) {
      let o600 = messageSplit[messageSplit.indexOf("o600,") + 1];
      o600_value = parseFloat(o600);

      if (!isNaN(parseFloat(o600))) {
        document.getElementById("o600_label").innerHTML = "O600: " + o600_value;
        liveChart.data.datasets[0].data[4] = {
          x: 600,
          y: o600_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("r650,")) {
      let r650 = messageSplit[messageSplit.indexOf("r650,") + 1];
      r650_value = parseFloat(r650);

      if (!isNaN(r650_value)) {
        document.getElementById("r650_label").innerHTML = "R650: " + r650_value;
        liveChart.data.datasets[0].data[5] = {
          x: 650,
          y: r650_value,
        };
        liveChart.update();
      }
    }

    //** UPDATE INFRARED VALUES */
    if (messageSplit.includes("610,")) {
      let i610 = messageSplit[messageSplit.indexOf("610,") + 1];
      i610_value = parseFloat(i610);

      if (!isNaN(i610_value)) {
        document.getElementById("610_label").innerHTML = "610: " + i610_value;
        liveChart.data.datasets[1].data[0] = {
          x: 610,
          y: i610_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("680,")) {
      let i680 = messageSplit[messageSplit.indexOf("680,") + 1];
      i680_value = parseFloat(i680);

      if (!isNaN(i680_value)) {
        document.getElementById("680_label").innerHTML = "680: " + i680_value;
        liveChart.data.datasets[1].data[1] = {
          x: 680,
          y: i680_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("730,")) {
      let i730 = messageSplit[messageSplit.indexOf("730,") + 1];
      i730_value = parseFloat(i730);

      if (!isNaN(i730_value)) {
        document.getElementById("730_label").innerHTML = "730: " + i730_value;
        liveChart.data.datasets[1].data[2] = {
          x: 730,
          y: i730_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("760,")) {
      let i760 = messageSplit[messageSplit.indexOf("760,") + 1];
      i760_value = parseFloat(i760);

      if (!isNaN(i760_value)) {
        document.getElementById("760_label").innerHTML = "760: " + i760_value;
        liveChart.data.datasets[1].data[3] = {
          x: 760,
          y: i760_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("810,")) {
      let i810 = messageSplit[messageSplit.indexOf("810,") + 1];
      i810_value = parseFloat(i810);

      if (!isNaN(i810_value)) {
        document.getElementById("810_label").innerHTML = "810: " + i810_value;
        liveChart.data.datasets[1].data[4] = {
          x: 810,
          y: i810_value,
        };
        liveChart.update();
      }
    }
    if (messageSplit.includes("860,")) {
      let i860 = messageSplit[messageSplit.indexOf("860,") + 1];
      i860_value = parseFloat(i860);

      if (!isNaN(i860_value)) {
        document.getElementById("860_label").innerHTML = "860: " + i860_value;
        liveChart.data.datasets[1].data[5] = {
          x: 860,
          y: i860_value,
        };
        liveChart.update();
      }
    }

    //** UPDATE CONTROL SIDEBAR */
    if (messageSplit.includes("batch,")) {
    }
  }
}

//** TAKES A TIME VARIABLE AND CONVERTS IT INTO MINUTES / SECONDS */
function formatTime(time) {
  // The largest round integer less than or equal to the result of time divided being by 60.
  const minutes = Math.floor(time / 60);

  // Seconds are the remainder of the time divided by 60 (modulus operator)
  let seconds = time % 60;

  // If the value of seconds is less than 10, then display seconds with a leading zero
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  // The output in MM:SS format
  return `${minutes}:${seconds}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    // The amount of time passed increments by one
    timePassed = timePassed += 1;

    // The time left label is updated
    recordingText.innerHTML = "<b>" + formatTime(timePassed) + "</b>";
    // console.log("TICK: " + formatTime(timePassed));
  }, 1000);
}

function addBatches(dataArray) {
  for (var i = 0; i < dataArray.length; i++) 
  {
    if(dataArray[i].length != 0)
    {
      const div = document.createElement("div");
      var div2 = document.createElement("div");
      div.id = "batchNmb";
      div.classList.add("active");

      //** BATCH NUMBER CLICK FUNCTION */
      div.onclick = function () {
        if (!this.classList.contains("selected")) {
          const batchGrid = document
            .getElementById("batchGrid")
            .querySelectorAll("[id=batchNmb]");

          lastSliderValue = 0;

          batchGrid.forEach((item) => {
            if (item.classList.contains("selected")) {
              item.classList.toggle("selected");
            }
          });

          this.classList.toggle("selected");
          currentBatchArray = dataArray[this.index];
          currentBatchArray.index = this.index;
          resetTrim();

          //** UPDATE CHART WITH UID */
          mainChart.options.plugins.title.text =
            "  UID: " + currentBatchArray[0].UID;
          mainChart.update();

          clearTimeout(animWaitFunc);
          batchChangeUpdate();
        }
      };

      var date =
      dataArray[i][0].timestamp.replace(/\s/g, "").substr(0, 4) +
      "/" +
      dataArray[i][0].timestamp.replace(/\s/g, "").substr(4, 2) +
      "/" +
      dataArray[i][0].timestamp.replace(/\s/g, "").substr(6, 2);

      div.innerHTML = dataArray[i][0].batch_number;
      div.index = i;
      div.title = date;

      var div2 = div.cloneNode(true);
      div2.index = i;

      //** CLICK FUNCTIONALITY FOR CALIBRATION BATCH SELECTION*/
      div2.onclick = function () {
        if (!this.classList.contains("selected")) {
          console.log(this.parentNode.id);
          const batchGrid = document
            .getElementById("calibration_batch_grid")
            .querySelectorAll("[id=batchNmb]");

          batchGrid.forEach((item) => {
            if (item.classList.contains("selected")) {
              item.classList.toggle("selected");
            }
          });

          this.classList.toggle("selected");
          let calibrationArray = dataArrayBatches[this.index];
          currentDataBatchIndex = this.index;

          if (!ndvi_element.classList.contains("active")) {
            ndvi_element.classList.toggle("active");
          }
          if (!reflectance_element.classList.contains("active")) {
            reflectance_element.classList.toggle("active");
          }
          if (!sr_element.classList.contains("active")) {
            sr_element.classList.toggle("active");
          }
          if (!dswi_element.classList.contains("active")) {
            dswi_element.classList.toggle("active");
          }
          if (!nirv_element.classList.contains("active")) {
            nirv_element.classList.toggle("active");
          }
          if(!airSurface_element.classList.contains("active")) {
            airSurface_element.classList.toggle("active");
          }
          if(!rawOverTime_element.classList.contains("active")) {
            rawOverTime_element.classList.toggle("active");
          }

          console.log(calibrationArray);
          calibrationBatchSelected = true;

          clearTimeout(animWaitFunc);
          averageCalibrationArray(calibrationArray);
        }
      };

      //** SELECT THE FIRST BATCH IN THE LIST ON INITIALIZATION*/
      if (i == 0) {
        div.classList.toggle("selected");
        currentBatchArray = dataArray[0];
        currentBatchArray.index = 0;

        //** INIT EDITING DATA */
        var children = editRange_start.parentNode.childNodes[1].childNodes;
        children[1].style.width = "0%";
        children[5].style.left = "0%";
        children[7].style.left = "0%";
        children[3].style.width = "100%";
        children[5].style.right = "0%";
        children[9].style.left = "100%";
        editRange_start.max = currentBatchArray.length;
        editRange_end.max = currentBatchArray.length;
        editRange_start.value = 1;
        editRange_end.value = currentBatchArray.length;
      }

      document.getElementById("calibration_batch_grid").appendChild(div2);
      document.getElementById("batchGrid").appendChild(div);
    }
  }

  //** ADJUST SIZING DEPENDING ON SIZE OF BATCHES */
  if (batchesContainer.childElementCount > 7) {
    document.getElementById("batches").style.height = "20%";
    document.getElementById("batches_calibration").style.height = "10%";
  } else {
    document.getElementById("batches").style.height = "fit-content";
    document.getElementById("batches_calibration").style.height = "10%";
  }
  if (batchesContainer.childElementCount < 3) {
    document.getElementById("batches_calibration").style.height = "fit-content";
  }

  //** UDPATE UID ON CHART TITLE AT BATCH INIT */
  mainChart.options.plugins.title.text = "  UID: " + currentBatchArray[0].UID;
    
}

function batchChangeUpdate() {
  //** CLEAR DATA VALUES TO ALLOW FOR NEW DATA TO POPULATE THE GRAPHS */
  chart2.data.labels = Object.keys(data);
  chart2.data.datasets.forEach((dataset) => {
    dataset.data = Object.values(data);
  });
  NIRv_chart.data.labels = Object.keys(data);
  NIRv_chart.data.datasets.forEach((dataset) => {
    dataset.data = Object.values(data);
  });

  SR_chart.data.labels = Object.keys(data);
  SR_chart.data.datasets.forEach((dataset) => {
    dataset.data = Object.values(data);
  });

  DSWI_chart.data.labels = Object.keys(data);
  DSWI_chart.data.datasets.forEach((dataset) => {
    dataset.data = Object.values(data);
  });

  tempChart.data.labels = Object.keys(data);
  tempChart.data.datasets.forEach((dataset) => {
    dataset.data = Object.values(data);
  });

  rawOverTime_Chart.data.labels = Object.keys(data);
  rawOverTime_Chart.data.datasets.forEach((dataset) => {
    dataset.data = Object.values(data);
  });

  chart2.update();
  NIRv_chart.update();
  clearTimeout(animWaitFunc);
  updateChart();

  if (calibrationBatchSelected) {
    convertToReflectance();
  }

  //** CLOSE TRIM AND EDIT ICONS IF THE BATCH IS LESS THAN 2 */
  if (currentBatchArray.length < 3) {
    if (!trim_icon.classList.contains("disabled")) {
      trim_icon.classList.toggle("disabled");
    }
  } else if (trim_icon.classList.contains("disabled")) {
    trim_icon.classList.toggle("disabled");
  }
}

function removeBatches(input) {
  document.getElementById("batchGrid").removeChild(input);
  console.log("REMOVE: " + input);
}

function saveCSV() {
  let csv = "";
  let headers = "";
  let firstHeader = true;
  console.log(
    "START: " + editRange_start.value + ", END: " + editRange_end.value
  );

  var saveArray = currentBatchArray.slice(
    editRange_start.value - 1,
    editRange_end.value
  );

  for (var index1 in saveArray) {
    var row = currentBatchArray[index1];

    // Row is the row of array at index "index1"
    var string = "";

    // Empty string which will be added later
    for (var index in row) {
      // Traversing each element in the row
      var w = row[index];

      if (firstHeader) {
        headers += index + ",";
      }

      // Adding the element at index "index" to the string
      string += w;
      if (index != row.length - 1) {
        string += ",";
        // If the element is not the last element , then add a comma
      }
    }
    string += "\n";
    firstHeader = false;

    // Adding next line at the end
    csv += string;
    // adding the string to the final string "csv"
  }

  //** ADDS HEADERS BASED ON THE HEADERS IN THE DATA.TXT*/
  csv = "data:text/csv;charset=utf-8," + headers + "\n" + csv;

  var encodedUri = encodeURI(csv);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_data.txt");
  document.body.appendChild(link);
  link.click();
}

//** CALCULATES ALL IRRADIANCE AVERAGES FOR THE CALIBRATION BATCH */
function averageCalibrationArray(cal_array) {
  let average_450nm = 0,
    average_500nm = 0,
    average_550nm = 0,
    average_570nm = 0,
    average_600nm = 0,
    average_650nm = 0,
    average_610nm = 0,
    average_680nm = 0,
    average_730nm = 0,
    average_760nm = 0,
    average_810nm = 0,
    average_860nm = 0;

  for (let i = 0; i < cal_array.length; i++) {
    average_450nm += parseFloat(cal_array[i].V450_irradiance_uW_per_cm_squared);
    average_500nm += parseFloat(cal_array[i].B500_irradiance_uW_per_cm_squared);
    average_550nm += parseFloat(cal_array[i].G550_irradiance_uW_per_cm_squared);
    average_570nm += parseFloat(cal_array[i].Y570_irradiance_uW_per_cm_squared);
    average_600nm += parseFloat(cal_array[i].O600_irradiance_uW_per_cm_squared);
    average_650nm += parseFloat(cal_array[i].R650_irradiance_uW_per_cm_squared);
    average_610nm += parseFloat(
      cal_array[i].nir610_irradiance_uW_per_cm_squared
    );
    average_680nm += parseFloat(
      cal_array[i].nir680_irradiance_uW_per_cm_squared
    );
    average_730nm += parseFloat(
      cal_array[i].nir730_irradiance_uW_per_cm_squared
    );
    average_760nm += parseFloat(
      cal_array[i].nir760_irradiance_uW_per_cm_squared
    );
    average_810nm += parseFloat(
      cal_array[i].nir810_irradiance_uW_per_cm_squared
    );
    average_860nm += parseFloat(
      cal_array[i].nir860_irradiance_uW_per_cm_squared
    );
  }

  //** DIVIDE ALL BY LENGTH OF ARRAY TO GET AVERAGE*/
  average_450nm = average_450nm / cal_array.length;
  average_500nm = average_500nm / cal_array.length;
  average_550nm = average_550nm / cal_array.length;
  average_570nm = average_570nm / cal_array.length;
  average_600nm = average_600nm / cal_array.length;
  average_650nm = average_650nm / cal_array.length;
  average_610nm = average_610nm / cal_array.length;
  average_680nm = average_680nm / cal_array.length;
  average_730nm = average_730nm / cal_array.length;
  average_760nm = average_760nm / cal_array.length;
  average_810nm = average_810nm / cal_array.length;
  average_860nm = average_860nm / cal_array.length;

  // console.log("450nm average: " + average_450nm);
  // console.log("500nm average: " + average_500nm);
  // console.log("550nm average: " + average_550nm);
  // console.log("570nm average: " + average_570nm);
  // console.log("600nm average: " + average_600nm);
  // console.log("650nm average: " + average_650nm);

  // console.log("610nm average: " + average_610nm);
  // console.log("680nm average: " + average_680nm);
  // console.log("730nm average: " + average_730nm);
  // console.log("760nm average: " + average_760nm);
  // console.log("810nm average: " + average_810nm);
  // console.log("860nm average: " + average_860nm);

  calibration_array.V450_average_irradiance = average_450nm;
  calibration_array.B500_average_irradiance = average_500nm;
  calibration_array.G550_average_irradiance = average_550nm;
  calibration_array.Y570_average_irradiance = average_570nm;
  calibration_array.O600_average_irradiance = average_600nm;
  calibration_array.R650_average_irradiance = average_650nm;

  calibration_array.nir610_average_irradiance = average_610nm;
  calibration_array.nir680_average_irradiance = average_680nm;
  calibration_array.nir730_average_irradiance = average_730nm;
  calibration_array.nir760_average_irradiance = average_760nm;
  calibration_array.nir810_average_irradiance = average_810nm;
  calibration_array.nir860_average_irradiance = average_860nm;

  console.log(calibration_array);
  //average_450nm = average_450nm/parseFloat(calibration_array.length);

  convertToReflectance();
}

function convertToReflectance() {
  let FOV = 40;
  let distance = distanceInput.value;

  //** radius = (tan(FOV/2)) * 10 */
  let radius = getTanFromDegrees(FOV / 2) * distance;

  //** area = PI * Radius^2 */
  let area = Math.PI * Math.pow(radius, 2);

  // console.log("distance: " + distance);
  // console.log("radius: " + radius);
  // console.log("area: " + area);

  //** CALIBRATION RADIANCE CALCULATION */
  //** radiance = irradiance * distance²/Area */
  let radiance_450nm_calibration =
    calibration_array.V450_average_irradiance * (Math.pow(distance, 2) / area);
  let radiance_500nm_calibration =
    calibration_array.B500_average_irradiance * (Math.pow(distance, 2) / area);
  let radiance_550nm_calibration =
    calibration_array.G550_average_irradiance * (Math.pow(distance, 2) / area);
  let radiance_570nm_calibration =
    calibration_array.Y570_average_irradiance * (Math.pow(distance, 2) / area);
  let radiance_600nm_calibration =
    calibration_array.O600_average_irradiance * (Math.pow(distance, 2) / area);
  let radiance_650nm_calibration =
    calibration_array.R650_average_irradiance * (Math.pow(distance, 2) / area);
  let radiance_610nm_calibration =
    calibration_array.nir610_average_irradiance *
    (Math.pow(distance, 2) / area);
  let radiance_680nm_calibration =
    calibration_array.nir680_average_irradiance *
    (Math.pow(distance, 2) / area);
  let radiance_730nm_calibration =
    calibration_array.nir730_average_irradiance *
    (Math.pow(distance, 2) / area);
  let radiance_760nm_calibration =
    calibration_array.nir760_average_irradiance *
    (Math.pow(distance, 2) / area);
  let radiance_810nm_calibration =
    calibration_array.nir810_average_irradiance *
    (Math.pow(distance, 2) / area);
  let radiance_860nm_calibration =
    calibration_array.nir860_average_irradiance *
    (Math.pow(distance, 2) / area);

  //** CALCULATES RADIANCE -> REFLECTANCE FOR EACH TIMESTAMP IN THE CURRENT BATCH */
  for (let i = 0; i < currentBatchArray.length; i++) {
    //** RADIANCE CALCULATION */
    //** radiance = irradiance * distance²/Area */
    currentBatchArray[i].V450_radiance =
      currentBatchArray[i].V450_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].B500_radiance =
      currentBatchArray[i].B500_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].G550_radiance =
      currentBatchArray[i].G550_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].Y570_radiance =
      currentBatchArray[i].Y570_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].O600_radiance =
      currentBatchArray[i].O600_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].R650_radiance =
      currentBatchArray[i].R650_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].nir610_radiance =
      currentBatchArray[i].nir610_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].nir680_radiance =
      currentBatchArray[i].nir680_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].nir730_radiance =
      currentBatchArray[i].nir730_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].nir760_radiance =
      currentBatchArray[i].nir760_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].nir810_radiance =
      currentBatchArray[i].nir810_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);
    currentBatchArray[i].nir860_radiance =
      currentBatchArray[i].nir860_irradiance_uW_per_cm_squared *
      (Math.pow(distance, 2) / area);

    //** REFLECTANCE CALCULATION */
    //** Reflectance = Radiance from the plant / Radiance from the white reference */
    currentBatchArray[i].V450_reflectance =
      currentBatchArray[i].V450_radiance / radiance_450nm_calibration;
    currentBatchArray[i].B500_reflectance =
      currentBatchArray[i].B500_radiance / radiance_500nm_calibration;
    currentBatchArray[i].G550_reflectance =
      currentBatchArray[i].G550_radiance / radiance_550nm_calibration;
    currentBatchArray[i].Y570_reflectance =
      currentBatchArray[i].Y570_radiance / radiance_570nm_calibration;
    currentBatchArray[i].O600_reflectance =
      currentBatchArray[i].O600_radiance / radiance_600nm_calibration;
    currentBatchArray[i].R650_reflectance =
      currentBatchArray[i].R650_radiance / radiance_650nm_calibration;
    currentBatchArray[i].nir610_reflectance =
      currentBatchArray[i].nir610_radiance / radiance_610nm_calibration;
    currentBatchArray[i].nir680_reflectance =
      currentBatchArray[i].nir680_radiance / radiance_680nm_calibration;
    currentBatchArray[i].nir730_reflectance =
      currentBatchArray[i].nir730_radiance / radiance_730nm_calibration;
    currentBatchArray[i].nir760_reflectance =
      currentBatchArray[i].nir760_radiance / radiance_760nm_calibration;
    currentBatchArray[i].nir810_reflectance =
      currentBatchArray[i].nir810_radiance / radiance_810nm_calibration;
    currentBatchArray[i].nir860_reflectance =
      currentBatchArray[i].nir860_radiance / radiance_860nm_calibration;

    // console.log("V450: " + currentBatchArray[i].V450_reflectance);
    // console.log("B500: " + currentBatchArray[i].B500_reflectance);
    // console.log("G550: " + currentBatchArray[i].G550_reflectance);
    // console.log("Y570: " + currentBatchArray[i].Y570_reflectance);
    // console.log("O600: " + currentBatchArray[i].O600_reflectance);
    // console.log("R650: " + currentBatchArray[i].R650_reflectance);
    // console.log("nir610: " + currentBatchArray[i].nir610_reflectance);
    // console.log("nir680: " + currentBatchArray[i].nir680_reflectance);
    // console.log("nir730: " + currentBatchArray[i].nir730_reflectance);
    // console.log("nir760: " + currentBatchArray[i].nir760_reflectance);
    // console.log("nir810: " + currentBatchArray[i].nir810_reflectance);
    //console.log("nir860: " + currentBatchArray[i].nir860_reflectance);
  }
  calculateNIRV();
}

function calculateNIRV() {
  for (let i = 0; i < currentBatchArray.length; i++) {
    //** NIRv Calculation */
    let NIRv =
      ((currentBatchArray[i].nir810_reflectance -
        currentBatchArray[i].nir680_reflectance) /
        (currentBatchArray[i].nir680_reflectance +
          currentBatchArray[i].nir810_reflectance)) *
      currentBatchArray[i].nir810_reflectance;

    currentBatchArray[i].NIRv = NIRv;
  }

  //console.log(currentBatchArray);

  updateChart(false, currentDataBatchIndex, true);
}

function getTanFromDegrees(degrees) {
  return Math.tan((degrees * Math.PI) / 180);
}

//** UPDATES SELECTED GAUGE */
function updateGauge(gauge, gradient, val, min, max)
{
  var percent = mapRange(val, min, max, 0, 1);
  val = mapRange(val, min, max, 45, 225)

  gauge.style.transform = "rotate("+ val +"deg)";
  var finalColor = getColorForPercentage(percent, gradient);
  gauge.style.borderBottomColor = finalColor;
  gauge.style.borderRightColor = finalColor;
}

//** CREATES A VALUE FROM THE COMPAIRSON OF TWO RANGES */
function mapRange (value, in_min, in_max, out_min, out_max) {
	let val = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	if (val < out_min) val = out_min;
	else if (val > out_max) val = out_max;
	return val;
}

var getColorForPercentage = function(pct, temp_Gradient) {
  for (var i = 1; i < temp_Gradient.length - 1; i++) {
      if (pct < temp_Gradient[i].pct) {
          break;
      }
  }
  var lower = temp_Gradient[i - 1];
  var upper = temp_Gradient[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  // or output as hex if preferred
};

//** CLICK EVENT FOR UPLOAD NEW BUTTON */
menuElement.addEventListener("click", function (ev) {
  ev.stopPropagation(); // prevent event from bubbling up to .container
  clearTimeout(animWaitFunc);
  menuElement.classList.toggle("active");
  menuContainer.classList.toggle("disable");
  helpButton.classList.toggle("active");
  sidebarButton.classList.toggle("active");
  viewMode = 0;

  document.getElementById("chartCard").style.gridTemplateColumns =
    "minmax(200px, 1fr)";
  document.getElementById("chartCard").style.gridTemplateRows = "auto";

  if (sidebar.classList.contains("active")) {
    sidebarButton.innerHTML = "<";
    sidebar.classList.toggle("active");
  } else if (sidebar_live.classList.contains("active")) {
    sidebarButton.innerHTML = "<";
    sidebar_live.classList.toggle("active");
  }

  // if (controlSidebar.classList.contains("active")) {
  //   controlSidebar.classList.toggle("active");
  // }
  // if (controlSidebar_live.classList.contains("active")) {
  //   controlSidebar_live.classList.toggle("active");
  // }
  if (document.getElementById("temp_Graph").classList.contains("active")) {
    document.getElementById("temp_Graph").classList.toggle("active");
  }
  if (document.getElementById("rawOverTime_Graph").classList.contains("active")) {
    document.getElementById("rawOverTime_Graph").classList.toggle("active");
  }
  if (document.getElementById("calcGraph").classList.contains("active")) {
    document.getElementById("calcGraph").classList.toggle("active");
  }
  if (document.getElementById("liveGraph").classList.contains("active")) {
    document.getElementById("liveGraph").classList.toggle("active");
  }
  if (document.getElementById("SR_Graph").classList.contains("active")) {
    document.getElementById("SR_Graph").classList.toggle("active");
  }
  if (document.getElementById("DSWI_Graph").classList.contains("active")) {
    document.getElementById("DSWI_Graph").classList.toggle("active");
  }
  if (document.getElementById("NIRv_Graph").classList.contains("active")) {
    document.getElementById("NIRv_Graph").classList.toggle("active");
  }
  if (document.getElementById("reflectance_Graph").classList.contains("active")) 
  {
    document.getElementById("reflectance_Graph").classList.toggle("active");
  }
  if (document.getElementById("temp_Graph").classList.contains("active")) 
  {
    document.getElementById("temp_Graph").classList.toggle("active");
  }
  if (document.getElementById("rawOverTime_Graph").classList.contains("active")) 
  {
    document.getElementById("rawOverTime_Graph").classList.toggle("active");
  }

  if (ndvi_element.classList.contains("selected")) {
    ndvi_element.classList.toggle("selected");
  }
  if (reflectance_element.classList.contains("selected")) {
    reflectance_element.classList.toggle("selected");
  }
  if (nirv_element.classList.contains("selected")) {
    nirv_element.classList.toggle("selected");
  }
  if (sr_element.classList.contains("selected")) {
    sr_element.classList.toggle("selected");
  }
  if (dswi_element.classList.contains("selected")) {
    dswi_element.classList.toggle("selected");
  }
  if(airSurface_element.classList.contains("selected")) {
    airSurface_element.classList.toggle("selected");
  }
  if(rawOverTime_element.classList.contains("selected")) {
    rawOverTime_element.classList.toggle("selected");
  }

  if (duplicateScreen.classList.contains("active")) {
    duplicateScreen.classList.toggle("active");
  }

  if (rawData_element.classList.contains("active")) {
    rawData_element.classList.toggle("active");
    visible_filter_element.classList.toggle("active");
    infrared_filter_element.classList.toggle("active");
    recordContainer.classList.toggle("active");
    // document.getElementById("mainGraph").classList.toggle("active");
    if (document.getElementById("mainGraph").classList.contains("active")) {
      document.getElementById("mainGraph").classList.toggle("active");
    }
  }

  updateGraphGrid();
  landing.classList.toggle("active");
  RESOURCE_LOADED = false;
});

function updateGraphGrid(currentlyGraphed) {
  let myElement;

  //** CHOOSE MY ELEMENT, WHETHER IN CONNECT_DEVICE OR UPLOAD_FILE MODE */
  if (sidebar.classList.contains("active")) {
    myElement = document.getElementById("chartCard");
  }
  // else if (controlSidebar_live.classList.contains("active")) {
  //   myElement = document.getElementById("chartCardLive");
  // }
  else {
    myElement = document.getElementById("chartCardLive");
  }

  let counter = 0;
  for (const child of myElement.children) {
    if (child.classList.contains("active")) {
      counter++;
    }
  }
  if (counter < 2) {
    myElement.style.gridTemplateColumns = "minmax(200px, 1fr)";
    myElement.style.gridTemplateRows = "auto";
  } else if (counter == 2) {
    myElement.style.gridTemplateColumns =
      "minmax(200px, 1fr) minmax(200px, 1fr)";
    myElement.style.gridTemplateRows = "auto";
  } else if (counter > 2 && counter < 5) {
    myElement.style.gridTemplateColumns =
      "minmax(200px, 1fr) minmax(200px, 1fr)";
    myElement.style.gridTemplateRows = "minmax(200px, 1fr) minmax(200px, 1fr)";
  } else if (counter > 4) {
    document.getElementById(lastGraphed).classList.toggle("active");

    if (lastGraphed == "mainGraph") {
      raw_element.classList.toggle("selected");
    } else if (lastGraphed == "DSWI_Graph") {
      dswi_element.classList.toggle("selected");
    } else if (lastGraphed == "SR_Graph") {
      sr_element.classList.toggle("selected");
    } else if (lastGraphed == "NIRv_Graph") {
      nirv_element.classList.toggle("selected");
    } else if (lastGraphed == "calcGraph") {
      ndvi_element.classList.toggle("selected");
    } else if (lastGraphed == "reflectance_Graph") {
      reflectance_element.classList.toggle("selected");
    } else if (lastGraphed == "temp_Graph") {
      airSurface_element.classList.toggle("selected");
    } else if (lastGraphed == "rawOverTime_Graph") {
      rawOverTime_element.classList.toggle("selected");
    }
  }

  //** UPDATE LAST GRAPHED VARIABLE */
  if (currentlyGraphed) {
    lastGraphed = currentlyGraphed;
  }
}

//** CLICK EVENT FOR THE PLAY / PAUSE BUTTON */
box.addEventListener("click", (e) => {
  e.target.classList.toggle("pause");

  if (animPlay) {
    animPlay = false;
    clearTimeout(animWaitFunc);
  } else {
    animPlay = true;
    updateChart();
  }
});

//** CLICK EVENT FOR RIGHT ARROW BUTTON */
arrowRight.addEventListener("click", (e) => {
  if (animPlay) {
    animPlay = false;
    box.classList.toggle("pause");
  }

  clearTimeout(animWaitFunc);
  updateChart(false);
});

//** CLICK EVENT FOR LEFT ARROW BUTTON */
arrowLeft.addEventListener("click", (e) => {
  if (animPlay) {
    animPlay = false;
    box.classList.toggle("pause");
  }

  clearTimeout(animWaitFunc);
  updateChart(true);
});

//** WINDOW RESIZE EVENT */
var doit;
window.onresize = function () {
  clearTimeout(doit);
  doit = setTimeout(function () {
    graphGradients();
  }, 1000);

  mainChart.resize();
  chart2.resize();
  liveChart.resize();
  SR_chart.resize();
};

var lastSliderValue = 0;
//** USED TO CONTROL SPEED OF ANIMATION */
speedSlider.addEventListener("input", function (e) {
  // Force the string value of the range to a number and then force the
  // number to have a single decimal

  updateChart(false, speedSlider.value);

  lastSliderValue = speedSlider.value;
  clearTimeout(animWaitFunc);

  if (animPlay) {
    animPlay = false;
    clearTimeout(animWaitFunc);
    console.log("PAUSE");
    box.classList.toggle("pause");
  }
  animationTime = 1000;
});

rawData_element.addEventListener("click", function () {
  console.log("Clicked Raw Data");
  rawData_element.classList.toggle("selected");
  updateChartLabels();
});

visible_filter_element.addEventListener("click", function () {
  visible_filter_element.classList.toggle("selected");
  //document.getElementById('visibleFilter_rangeContainer').classList.toggle("active");
  updateChartLabels();
  console.log("Clicked visible_filter");
});

infrared_filter_element.addEventListener("click", function () {
  infrared_filter_element.classList.toggle("selected");
  updateChartLabels();
});

//** DATA LABEL's VISIBILITY TOGGLES */
raw_visibility_icon.addEventListener("click", function () {
  if (raw_visibility_icon.classList.contains("selected")) {
    raw_visibility_icon.classList.toggle("selected");
    raw_labels_visible = true;
    document.getElementById("visibleIcon_raw").innerHTML = "visibility";
  } else {
    raw_visibility_icon.classList.toggle("selected");
    raw_labels_visible = false;
    document.getElementById("visibleIcon_raw").innerHTML = "visibility_off";
  }
  mainChart.update();
});
ndvi_visibility_icon.addEventListener("click", function () {
  if (ndvi_visibility_icon.classList.contains("selected")) {
    ndvi_visibility_icon.classList.toggle("selected");
    ndvi_labels_visible = true;
    document.getElementById("visibleIcon_ndvi").innerHTML = "visibility";
  } else {
    ndvi_visibility_icon.classList.toggle("selected");
    ndvi_labels_visible = false;
    document.getElementById("visibleIcon_ndvi").innerHTML = "visibility_off";
  }
  chart2.update();
});

nirv_visibility_icon.addEventListener("click", function () {
  if (nirv_visibility_icon.classList.contains("selected")) {
    nirv_visibility_icon.classList.toggle("selected");
    nirv_labels_visible = true;
    document.getElementById("visibleIcon_nirv").innerHTML = "visibility";
  } else {
    nirv_visibility_icon.classList.toggle("selected");
    nirv_labels_visible = false;
    document.getElementById("visibleIcon_nirv").innerHTML = "visibility_off";
  }
  NIRv_chart.update();
});
reflectance_visibility_icon.addEventListener("click", function () {
  if (reflectance_visibility_icon.classList.contains("selected")) {
    reflectance_visibility_icon.classList.toggle("selected");
    reflectance_labels_visible = true;
    document.getElementById("visibleIcon_reflectance").innerHTML = "visibility";
  } else {
    reflectance_visibility_icon.classList.toggle("selected");
    reflectance_labels_visible = false;
    document.getElementById("visibleIcon_reflectance").innerHTML =
      "visibility_off";
  }
  reflectance_chart.update();
});
sr_visibility_icon.addEventListener("click", function () {
  if (sr_visibility_icon.classList.contains("selected")) {
    sr_visibility_icon.classList.toggle("selected");
    sr_labels_visible = true;
    document.getElementById("visibilityIcon_sr").innerHTML = "visibility";
  } else {
    sr_visibility_icon.classList.toggle("selected");
    sr_labels_visible = false;
    document.getElementById("visibilityIcon_sr").innerHTML = "visibility_off";
  }
  SR_chart.update();
});
dswi_visibility_icon.addEventListener("click", function () {
  if (dswi_visibility_icon.classList.contains("selected")) {
    dswi_visibility_icon.classList.toggle("selected");
    dswi_labels_visible = true;
    document.getElementById("visibilityIcon_dswi").innerHTML = "visibility";
  } else {
    dswi_visibility_icon.classList.toggle("selected");
    dswi_labels_visible = false;
    document.getElementById("visibilityIcon_dswi").innerHTML = "visibility_off";
  }
  DSWI_chart.update();
});
airSurface_visibility_icon.addEventListener("click", function () {
  if (airSurface_visibility_icon.classList.contains("selected")) {
    airSurface_visibility_icon.classList.toggle("selected");
    temp_labels_visible = true;
    document.getElementById("visibleIcon_temp").innerHTML = "visibility";
  } else {
    airSurface_visibility_icon.classList.toggle("selected");
    temp_labels_visible = false;
    document.getElementById("visibleIcon_temp").innerHTML = "visibility_off";
  }
  tempChart.update();
});

rawOverTime_visibility_icon.addEventListener("click", function () {
  if (rawOverTime_visibility_icon.classList.contains("selected")) {
    rawOverTime_visibility_icon.classList.toggle("selected");
    rawOverTime_labels_visible = true;
    document.getElementById("visibleIcon_rawOverTime").innerHTML = "visibility";
  } else {
    rawOverTime_visibility_icon.classList.toggle("selected");
    rawOverTime_labels_visible = false;
    document.getElementById("visibleIcon_rawOverTime").innerHTML = "visibility_off";
  }
  rawOverTime_Chart.update();
});


raw_visibility_live_icon.addEventListener("click", function () {
  if (raw_visibility_live_icon.classList.contains("selected")) {
    raw_visibility_live_icon.classList.toggle("selected");
    document.getElementById("visibleIcon_raw_live").innerHTML = "visibility";
  } else {
    raw_visibility_live_icon.classList.toggle("selected");
    document.getElementById("visibleIcon_raw_live").innerHTML =
      "visibility_off";
  }
  liveChart.update();
});

//** TOGGLE UNIT LABELS */
toggleUnitLabels_icon.addEventListener("click", function () {
  if (toggleUnitLabels_icon.classList.contains("selected")) {
    toggleUnitLabels_icon.classList.toggle("selected");
  } else {
    toggleUnitLabels_icon.classList.toggle("selected");
  }
  mainChart.update();
});

toggleUnitLabels_live_icon.addEventListener("click", function () {
  if (toggleUnitLabels_live_icon.classList.contains("selected")) {
    toggleUnitLabels_live_icon.classList.toggle("selected");
  } else {
    toggleUnitLabels_live_icon.classList.toggle("selected");
  }
  liveChart.update();
});

//** TRIM BUTTON FOR EDITING DATA */
trim_icon.addEventListener("click", function () {
  trim_icon.classList.toggle("selected");
  editRange.classList.toggle("active");
  playPauseContainer.classList.toggle("active");
  arrowRight.classList.toggle("active");
  arrowLeft.classList.toggle("active");

  document.getElementById("trimBtns_container").classList.toggle("active");

  resetTrim();

  //** PAUSE THE TIMELINE PLAY BUTTON */
  if (box.classList.contains("pause")) {
    box.classList.toggle("pause");
  }
  animPlay = false;
  clearTimeout(animWaitFunc);
});

//** DOWNLOAD SIDEBAR */
// fileName_download.addEventListener("change", function () {
//   console.log("CHANGE DOWNLOAD");

//   //**REMOVE BLANK SPACE */
//   fileName_download.value = fileName_download.value.replace(/\s+/g, '');

//   if(fileName_download.value == "")
//   {
//     fileName_download.value = "fileName";
//   }
//   fileName_download.value = fileName_download.value + ".csv";
// });

//** CHANGE EVENT FOR SR SELECTOR */
srGraph_numerator.addEventListener("change", function () {
  console.log(srGraph_numerator.value);
  updateChart();
});
srGraph_denominator.addEventListener("change", function () {
  console.log(srGraph_denominator.value);
  updateChart();
});

function resetTrim() {
  //** SET EDIT RANGE BACK TO NORMAL */
  var children = editRange_start.parentNode.childNodes[1].childNodes;
  children[1].style.width = "0%";
  children[5].style.left = "0%";
  children[7].style.left = "0%";
  children[3].style.width = "100%";
  children[5].style.right = "0%";
  children[9].style.left = "100%";
  children[11].style.left = "0%";
  children[11].children[0].innerHTML = 1;
  children[13].style.left = "100%";
  children[13].children[0].innerHTML = currentBatchArray.length;
  editRange_start.max = currentBatchArray.length;
  editRange_end.max = currentBatchArray.length;
  editRange_start.value = 1;
  editRange_end.value = currentBatchArray.length;
  editRange_thumb_start.style.left = "0%";
  editRange_thumb_end.style.left = "100%";
}

done_trim.addEventListener("click", function () {
  console.log(
    "START: " + editRange_start.value + " End: " + editRange_end.value
  );
  console.log(currentBatchArray.length);
  currentBatchArray = currentBatchArray.slice(
    editRange_start.value - 1,
    editRange_end.value
  );
  console.log(currentBatchArray.length);

  console.log(currentBatchArray);

  trim_icon.classList.toggle("selected");
  editRange.classList.toggle("active");
  playPauseContainer.classList.toggle("active");
  arrowRight.classList.toggle("active");
  arrowLeft.classList.toggle("active");
  document.getElementById("trimBtns_container").classList.toggle("active");

  console.log("SAVE");

  batchChangeUpdate();
});

//** DOWNLOAD BUTTON */
download_label.addEventListener("click", function () {
  saveCSV();
});

//** DOUBLE RANGE SLIDERS FOR EDITING */
editRange_start.addEventListener("input", function () {
  //** GRABS THE VALUE, MAKE SURE ITS NOT CROSSING THE OTHER RANGE'S BOUNDRY, AND CONVERTS IT INTO A FACTOR OF 100 */
  this.value = Math.min(this.value, this.parentNode.childNodes[5].value - 1);
  var value =
    (100 / (parseInt(this.max) - parseInt(this.min))) * parseInt(this.value) -
    (100 / (parseInt(this.max) - parseInt(this.min))) * parseInt(this.min);

  //** GRAB CHILDREN HTML ELEMENTS */
  var children = this.parentNode.childNodes[1].childNodes;
  children[1].style.width = value + "%";
  children[5].style.left = value + "%";
  children[7].style.left = value + "%";
  children[11].style.left = value + "%";
  children[11].children[0].innerHTML = this.value;

  //** UPDATES THE CHART AS WELL */
  updateChart(false, this.value);
});

editRange_end.addEventListener("input", function () {
  this.value = Math.max(this.value, this.parentNode.childNodes[3].value - -1);
  var value =
    (100 / (parseInt(this.max) - parseInt(this.min))) * parseInt(this.value) -
    (100 / (parseInt(this.max) - parseInt(this.min))) * parseInt(this.min);
  var children = this.parentNode.childNodes[1].childNodes;
  value = parseInt(value);
  children[3].style.width = 100 - value + "%";
  //** CONTROLS INSIDE SPAN OF END RANGE **//
  children[5].style.right = 100 - value + "%";
  //** CONTROLS END CIRCLE **//
  children[9].style.left = value + "%";
  children[13].style.left = value + "%";
  children[13].children[0].innerHTML = this.value;

  //** UPDATES THE CHART AS WELL */
  updateChart(false, this.value);
});

//** GRAPH TOGGLE's IN CONTROL SIDEBAR */
ndvi_element.addEventListener("click", function () {
  ndvi_element.classList.toggle("selected");
  if (!ndvi_element.classList.contains("selected")) {
    mainChart.update();
  }

  //** TOGGLE ON GRAPH */
  document.getElementById("calcGraph").classList.toggle("active");
  updateGraphGrid("calcGraph");
  updateChartLabels();
  graphGradients();
  updateChart();

  clearTimeout(animWaitFunc);

  NIRv_chart.resize();
  reflectance_chart.resize();
  mainChart.resize();
  chart2.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
  rawOverTime_Chart.resize();
});

reflectance_element.addEventListener("click", function () {
  reflectance_element.classList.toggle("selected");
  if (!reflectance_element.classList.contains("selected")) {
    mainChart.update();
  }

  //** TOGGLE ON GRAPH */
  document.getElementById("reflectance_Graph").classList.toggle("active");
  updateGraphGrid("reflectance_Graph");
  updateChartLabels();
  graphGradients();
  updateChart();

  clearTimeout(animWaitFunc);

  NIRv_chart.resize();
  reflectance_chart.resize();
  mainChart.resize();
  chart2.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
  rawOverTime_Chart.resize();
});

nirv_element.addEventListener("click", function () {
  nirv_element.classList.toggle("selected");
  if (!nirv_element.classList.contains("selected")) {
    NIRv_chart.update();
  }
  //** TOGGLE ON GRAPH */
  document.getElementById("NIRv_Graph").classList.toggle("active");
  updateGraphGrid("NIRv_Graph");
  updateChartLabels();
  graphGradients();
  updateChart();

  clearTimeout(animWaitFunc);

  NIRv_chart.resize();
  reflectance_chart.resize();
  mainChart.resize();
  chart2.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
  rawOverTime_Chart.resize();
});

sr_element.addEventListener("click", function () {
  sr_element.classList.toggle("selected");
  if (!sr_element.classList.contains("selected")) {
    SR_chart.update();
  }
  //** TOGGLE ON GRAPH */
  document.getElementById("SR_Graph").classList.toggle("active");
  updateGraphGrid("SR_Graph");

  updateChart();
  updateChartLabels();
  graphGradients();

  clearTimeout(animWaitFunc);

  NIRv_chart.resize();
  reflectance_chart.resize();
  mainChart.resize();
  chart2.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
  rawOverTime_Chart.resize();
});

dswi_element.addEventListener("click", function () {
  dswi_element.classList.toggle("selected");
  if (!dswi_element.classList.contains("selected")) {
    DSWI_chart.update();
  }
  //** TOGGLE ON GRAPH */
  document.getElementById("DSWI_Graph").classList.toggle("active");
  updateGraphGrid("DSWI_Graph");

  updateChart();
  updateChartLabels();
  graphGradients();

  clearTimeout(animWaitFunc);

  NIRv_chart.resize();
  reflectance_chart.resize();
  mainChart.resize();
  chart2.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
  rawOverTime_Chart.resize();
});

raw_element.addEventListener("click", function () {
  raw_element.classList.toggle("selected");
  if (!raw_element.classList.contains("selected")) {
    mainChart.update();
  }

  document.getElementById("mainGraph").classList.toggle("active");
  updateGraphGrid("mainGraph");
  updateChartLabels();
  graphGradients();

  clearTimeout(animWaitFunc);

  NIRv_chart.resize();
  reflectance_chart.resize();
  mainChart.resize();
  chart2.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
  rawOverTime_Chart.resize();
});

airSurface_element.addEventListener("click", function () {
  airSurface_element.classList.toggle("selected");
  if (!airSurface_element.classList.contains("selected")) {
    tempChart.update();
  }

  document.getElementById("temp_Graph").classList.toggle("active");
  updateGraphGrid("temp_Graph");
  updateChartLabels();
  graphGradients();

  clearTimeout(animWaitFunc);

  NIRv_chart.resize();
  reflectance_chart.resize();
  mainChart.resize();
  chart2.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
});

rawOverTime_element.addEventListener("click", function () {
  rawOverTime_element.classList.toggle("selected");
  if (!rawOverTime_element.classList.contains("selected")) {
    rawOverTime_Chart.update();
  }

  document.getElementById("rawOverTime_Graph").classList.toggle("active");
  updateGraphGrid("rawOverTime_Graph");
  updateChartLabels();
  graphGradients();

  clearTimeout(animWaitFunc);

  NIRv_chart.resize();
  reflectance_chart.resize();
  mainChart.resize();
  chart2.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
  rawOverTime_Chart.resize();
});

//** GRAPH TOGGLE's IN LIVE CONTROL SIDEBAR */
raw_element_live.addEventListener("click", function () {
  raw_element_live.classList.toggle("selected");
  if (!raw_element_live.classList.contains("selected")) {
    liveChart.update();
  }

  document.getElementById("liveGraph").classList.toggle("active");
  updateGraphGrid();
  updateChartLabels();
  graphGradients();

  clearTimeout(animWaitFunc);

  liveChart.resize();
});

duplicate_element_live.addEventListener("click", function () {
  duplicate_element_live.classList.toggle("selected");
  if (!duplicate_element_live.classList.contains("selected")) {
    liveChart.update();
  }

  document.getElementById("duplicateScreen").classList.toggle("active");
  updateGraphGrid();
  updateChartLabels();
  liveChart.resize();
});

//** HOMESCREEN BUTTON */
connectDevice.addEventListener("click", function () {
  serialScaleController.init();
  if (!raw_element_live.classList.contains("selected")) {
    raw_element_live.classList.toggle("selected");
  }
  if (!duplicate_element_live.classList.contains("selected")) {
    duplicate_element_live.classList.toggle("selected");
  }
});

about_button.addEventListener("click", function () {
  window.open("https://landsat.gsfc.nasa.gov/stella/", "_blank");
});

recordContainer.addEventListener("click", function () {
  recordButton.classList.toggle("recording");
  if (recordButton.classList.contains("recording")) {
    startTimer();
    mediaRecorder.start();
    recordingText.classList.toggle("active");
  } else {
    clearInterval(timerInterval);
    recordingText.innerHTML = "<b>Record</b>";
    mediaRecorder.stop();
    timePassed = 0;
    recordingText.classList.toggle("active");
  }
});

snapShotIcon.addEventListener("click", function () {
  var image = document
    .getElementById("graph")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById("link");
  link.setAttribute("download", "stella_graph.png");
  link.setAttribute("href", image);
  link.click();
});

snapShotIcon_2.addEventListener("click", function () {
  var image = document
    .getElementById("graph2")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById("link");
  link.setAttribute("download", "stella_graph.png");
  link.setAttribute("href", image);
  link.click();
});

snapShotIcon_3.addEventListener("click", function () {
  var image = document
    .getElementById("graph_NIRv")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById("link");
  link.setAttribute("download", "stella_graph.png");
  link.setAttribute("href", image);
  link.click();
});

snapShotIcon_4.addEventListener("click", function () {
  var image = document
    .getElementById("graph_SR")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById("link");
  link.setAttribute("download", "stella_graph.png");
  link.setAttribute("href", image);
  link.click();
});

snapShotIcon_5.addEventListener("click", function () {
  var image = document
    .getElementById("graph_DSWI")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById("link");
  link.setAttribute("download", "stella_graph.png");
  link.setAttribute("href", image);
  link.click();
});

snapShotIcon_6.addEventListener("click", function () {
  var image = document
    .getElementById("graph_reflectance")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById("link");
  link.setAttribute("download", "stella_graph.png");
  link.setAttribute("href", image);
  link.click();
});

snapShotIcon_7.addEventListener("click", function () {
  var image = document
    .getElementById("graph_temp")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById("link");
  link.setAttribute("download", "stella_graph.png");
  link.setAttribute("href", image);
  link.click();
});

snapShotIcon_8.addEventListener("click", function () {
  var image = document
    .getElementById("graph_rawOverTime")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

  var link = document.getElementById("link");
  link.setAttribute("download", "stella_graph.png");
  link.setAttribute("href", image);
  link.click();
});

//** SERIAL PORT FUNCTIONALITY */
navigator.serial.addEventListener("connect", (e) => {
  // Connect to `e.target` or add it to a list of available ports.
  console.log("CONNECT TO PORT: " + e);
  console.log(e);
});

navigator.serial.addEventListener("disconnect", (e) => {
  // Remove `e.target` from the list of available ports.
  deviceConnected = false;
  alert("STELLA Disconnected");

  if (viewMode == 2) {
    document.getElementById("liveGraph").classList.toggle("active");
    //duplicateScreen.classList.toggle("active");
    menuElement.classList.toggle("active");
    menuContainer.classList.toggle("disable");
    helpButton.classList.toggle("active");
    sidebarButton.classList.toggle("active");

    if (sidebar_live.classList.contains("active")) {
      sidebar_live.classList.toggle("active");
    }
    if (duplicateScreen.classList.contains("active")) {
      duplicateScreen.classList.toggle("active");
    }

    landing.classList.toggle("active");
    //controlSidebar_live.classList.toggle("active");
  }
});

navigator.serial.getPorts().then((ports) => {
  // Initialize the list of available ports with `ports` on page load.
  //console.log(ports);
});

document.getElementById("read").addEventListener("pointerdown", async () => {
  getSerialMessage();
  duplicateScreen.classList.toggle("active");
  //await closedPromise;
});

window.addEventListener("mouseover", (event) => {
  //console.log(event.target.localName);
  document.getElementById("descriptionText").innerHTML = event.target.localName;
});

//** MENU HELP BUTTON */
menu_help.addEventListener("click", function () {
  helpScreen.classList.toggle("active");
});

//** CLOSE BUTTON FOR HELP SCREEN */
help_closeBtn.addEventListener("click", function () {
  if (helpScreen.classList.contains("active")) {
    helpScreen.classList.toggle("active");
  }
});

//** TUTORIAL BUTTONS */
tut_btn_prev.addEventListener("click", function () {
  console.log("PREVIOUS");
  progressTutorial(false);
});
tut_btn_next.addEventListener("click", function () {
  console.log("NEXT");

  if (tutorialIndex == tutorialTextList.length - 1) {
    if (tut_wrap.classList.contains("active")) {
      tut_wrap.classList.toggle("active");
    }
    tutorial = false;
  } else {
    progressTutorial(true);
  }
});
tut_btn_skip.addEventListener("click", function () {
  if (tut_wrap.classList.contains("active")) {
    tut_wrap.classList.toggle("active");
  }
  tutorial = false;
});

//** DETECT DISTANCE DISTANCE INPUT CHANGE */
distanceInput.addEventListener("change", function () {
  console.log("CHANGED INPUT: " + distanceInput.value);

  averageCalibrationArray(dataArrayBatches[currentDataBatchIndex]);
});

function progressTutorial(forward) {
  //** FORWARD NAVIGATION */
  if (forward) {
    tutorialIndex++;
    tut_text.innerHTML = tutorialTextList[tutorialIndex];
  }
  //** BACKWARD NAVIGATION */
  else {
    tutorialIndex--;
    tut_text.innerHTML = tutorialTextList[tutorialIndex];
  }

  //** POSITIONING OF TUT_WRAP */
  if (tutorialIndex == 0) {
    //** #BATCHES POSITIONING */
    var distance = document.getElementById("batches").offsetTop;
    tut_wrap.style.top = distance + "px";
    tut_wrap.style.left = "17.5%";
    console.log(document.getElementById("batches").offsetTop);
  } else if (tutorialIndex == 1) {
    //** SLIDER POSITIONING */
    var distanceTop = document.getElementById("slider_container").offsetTop;
    var distanceLeft = document.getElementById("slider_container").offsetLeft;
    tut_wrap.style.top = distanceTop + 50 + "px";
    tut_wrap.style.left = distanceLeft + "px";

    console.log(
      document.getElementById("myRange").offsetTop + ": range slider top"
    );
    console.log(
      document.getElementById("myRange").offsetLeft + ": range slider left"
    );
  } else if (tutorialIndex == 2) {
    //** CALIBRATION BATCH POSITIONING */
    var distance = document.getElementById("calibration_batch_grid").offsetTop;
    tut_wrap.style.top = distance + "px";
    tut_wrap.style.left = "17.5%";
    console.log(document.getElementById("calibration_batch_grid").offsetTop);
  } else if (tutorialIndex == 3) {
    //** GRAPHS POSITIONING */
    var distance = document.getElementById("graphs").offsetTop;
    tut_wrap.style.top = distance + "px";
    tut_wrap.style.left = "17.5%";
    console.log(document.getElementById("graphs").offsetTop);
  } else if (tutorialIndex == 4) {
    //** EXTRA INFO POSITIONING */
    var distance = document.getElementById("extraInfo").offsetTop;
    tut_wrap.style.top = distance + "px";
    tut_wrap.style.left = "17.5%";
    console.log(document.getElementById("extraInfo").offsetTop);
  }

  //** FOR ENABELING AND DISABELING PREV BUTTON */
  if (tutorialIndex == 0) {
    if (!tut_btn_prev.classList.contains("disabled")) {
      tut_btn_prev.classList.toggle("disabled");
    }
  } else {
    if (tut_btn_prev.classList.contains("disabled")) {
      tut_btn_prev.classList.toggle("disabled");
    }
  }
  //** FOR ENABELING AND DISABELING NEXT BUTTON */
  if (tutorialIndex == tutorialTextList.length - 1) {
    tut_btn_next.innerHTML = "<b>DONE</b>";
  } else {
    tut_btn_next.innerHTML = "<b>&gt;</b>";
  }

  console.log("tutorial index: " + tutorialIndex);
}

//** DRAG FUNCTION FOR CONTROL SIDEBAR"S */
let wrapper = controlSidebar;
function onDrag({ movementX: e, movementY: r }) {
  let t = window.getComputedStyle(wrapper),
    a = parseInt(t.left),
    o = parseInt(t.top);
  (wrapper.style.left = `${a + e}px`), (wrapper.style.top = `${o + r}px`);
}

//** MOUSE EVENTS FOR CONTROL SIDEBARS */
// controlSidebarHeader.addEventListener("mousedown", (e) => {
//   e.stopPropagation();
//   if (controlSidebar.classList.contains("active")) {
//     wrapper = controlSidebar;
//     controlSidebarHeader.classList.add("active"),
//       controlSidebarHeader.addEventListener("mousemove", onDrag);
//   }
// }),
// controlSidebarHeader_live.addEventListener("mousedown", () => {
//   if (controlSidebar_live.classList.contains("active")) {
//     wrapper = controlSidebar_live;
//     controlSidebarHeader_live.classList.add("active"),
//       controlSidebarHeader_live.addEventListener("mousemove", onDrag);
//   }
// }),
helpHeader.addEventListener("mousedown", (e) => {
  e.stopPropagation();
  if (helpScreen.classList.contains("active")) {
    wrapper = helpScreen;
    helpScreen.classList.add("active"),
      helpHeader.addEventListener("mousemove", onDrag);
  }
});
document.addEventListener("mouseup", () => {
  // if (controlSidebar.classList.contains("active")) {
  //   controlSidebarHeader.classList.remove("active"),
  //     controlSidebarHeader.removeEventListener("mousemove", onDrag);
  // }
  // if (controlSidebar_live.classList.contains("active")) {
  //   controlSidebarHeader_live.classList.remove("active"),
  //     controlSidebarHeader_live.removeEventListener("mousemove", onDrag);
  // }
  if (helpScreen.classList.contains("active")) {
    helpHeader.removeEventListener("mousemove", onDrag);
  }
});

//** SIDEBAR FUNCTIONALITY */
sidebarButton.addEventListener("click", function () {
  if (viewMode == 2) {
    sidebar_live.classList.toggle("active");
  } else if (viewMode == 1) {
    sidebar.classList.toggle("active");
  }

  if (
    sidebar.classList.contains("active") ||
    sidebar_live.classList.contains("active")
  ) {
    sidebarButton.innerHTML = "<";
  } else {
    sidebarButton.innerHTML = ">";
  }
});

update();
function update() {
  mainChart.resize();
  chart2.resize();
  liveChart.resize();
  NIRv_chart.resize();
  reflectance_chart.resize();
  SR_chart.resize();
  DSWI_chart.resize();
  tempChart.resize();
  rawOverTime_Chart.resize();

  setTimeout(() => {
    update();
  }, 1000);
}
