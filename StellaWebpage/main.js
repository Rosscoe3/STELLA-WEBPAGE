import "./style.css";

const ctx = document.getElementById("graph").getContext("2d");
const ctx2 = document.getElementById("graph2").getContext("2d");

//** GRADIENT FILL */
let visibleGradient = ctx.createLinearGradient(0, 0, 500, 0);
visibleGradient.addColorStop(0.1, "rgba(0, 0, 255, 0.75)");
visibleGradient.addColorStop(0.25, "rgba(0, 255, 0, 0.75)");
visibleGradient.addColorStop(0.5, "rgba(255, 255, 0, 0.75)");
visibleGradient.addColorStop(0.75, "rgba(255, 102, 0, 0.75)");
visibleGradient.addColorStop(1, "rgba(255, 0, 0, 0.75)");

var graph = document.getElementById("graph");

ctx.fillStyle = "green";
ctx.fillRect(0, 0, graph.width, graph.height);

let infraredGradient = ctx.createLinearGradient(0, 0, 800, 0);
infraredGradient.addColorStop(0, "rgba(255, 0, 0, 1)");
infraredGradient.addColorStop(1, "rgba(173, 173, 173, 0.75)");

//** LIVE DATA */
let visibleDataLive = [];
let infraredDataLive = [];

//** FILE DROP JS */
let dropArea = document.getElementById("drop-area");
let dataArray = [];
let newDataArray = [];
let ndviArray = [];
let dataTimeIndex = 0;
let animationTime = 1500;

//** HTML ELEMENTS */
let uploadNew = document.getElementById("newFile");

let speedSlider = document.getElementById("myRange");
let frameNumber = document.getElementById("frameNumber");
let rawData_element = document.getElementById("rawData");
let visible_filter_element = document.getElementById("visible_filter");
let infrared_filter_element = document.getElementById("infrared_filter");
let ndvi_element = document.getElementById("ndvi");
let connectDevice = document.getElementById("plugInDevice");
let recordButton = document.getElementById("recordButton");
let recordingText = document.getElementById("recordingText");
let readDeviceBtn = document.getElementById("read");
let visible_filter_range = document.getElementById("visibleFilter_range");

let duplicateScreen = document.getElementById("duplicateScreen");

//** SERIAL PORTS */
class SerialScaleController {
  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }
  async init() {
    if ("serial" in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        this.reader = port.readable.getReader();
        let signals = await port.getSignals();
        console.log("DEVICE PAIRED");
        readDeviceBtn.classList.toggle("active");
        console.log(signals);
      } catch (err) {
        console.error("There was an error opening the serial port:", err);
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
    while (true)
    {
      try {
        const readerData = await this.reader.read();
        //console.log(readerData);
        return this.decoder.decode(readerData.value);
      } catch (err) {
        const errorMessage = `error reading data: ${err}`;
        console.error(errorMessage);
        return errorMessage;
      }
    }
    
  }
}
var serialTimeout;
const serialScaleController = new SerialScaleController();

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
let delayed;
var calibrationData, calibrationData_Infrared;
var calibrationArray_Visible, calibrationArray_Infrared;

//** VARIABLES FOR RECORDING */
var recording;
var timePassed = 0;
let timerInterval = null;

excludeLabelList = excludeLabelList.concat(
  visible_filter_array,
  infrared_filter_array,
  "NDVI"
);
console.log(excludeLabelList);

//** VARIABLES FOR CONTROLLING DATA */
let step = 5;
let cut = 0;
var visibleStartData = [2.4, 2.6, 2.2, 1.9, 2.0, 1.8];
var infraredStartData = [5.4, 5.0, 5.4, 6.5, 5.0, 4.3];
var visible = [...Array(1)].map((e) => Array(1));
var infrared = [...Array(1)].map((e) => Array(1));

//** RECORD VIDEO */
var recordedElement = document.getElementById("graph");
//let video = document.querySelector("video");
var videoStream = recordedElement.captureStream(30);
var mediaRecorder = new MediaRecorder(videoStream);

var chunks = [];
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
  console.log("BG");
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
  ],
};

//** DATA SETUP FOR SECOND CHART */
var data2 = {
  datasets: [
    //** NDVI */
    {
      data: [
        {
          x: 500,
          y: 1,
        },
      ],
      showLine: true,
      label: "NDVI",
      fill: false,
      hidden: false,
      backgroundColor: "rgb(255,0,0)",
      borderColor: "rgb(255,0,0)",
      lineTension: 0.25,
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
    responsive: true,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "STELLA",
      },
      background: {
        color: "black",
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
  plugins: [plugin],
};

//** CONFIG SETUP FOR SECOND CHART */
const config2 = {
  type: "scatter",
  data: data2,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: true,
    responsive: true,
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
        display: true,
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
          text: "NDVI",
          font: {
            size: 15,
          },
        },
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
          text: "Decimal Hour",
          align: "center",
          font: {
            size: 15,
          },
        },
      },
    },
  },
  plugins: [plugin],
};

//** CHART INSTANTIATION */
const mainChart = new Chart(ctx, config);
const chart2 = new Chart(ctx2, config2);

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
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        var csvdata = allText;

        if (visible) {
          calibrationArray_Visible = csvToArray(csvdata);
          console.log(calibrationArray_Visible);
        } else {
          calibrationArray_Infrared = csvToArray(csvdata);
          console.log(calibrationArray_Infrared);
        }

        //console.log(array);
        //console.log(parseFloat(calibrationArray_Visible[0].wavelength));
      }
    }
  };
  rawFile.send(null);
}

//** INITIALIZES DRAG AND DROP */
const initApp = () => {
  const droparea = document.querySelector(".droparea");

  const active = () => droparea.classList.add("-border");

  const inactive = () => droparea.classList.remove("-border");

  const prevents = (e) => e.preventDefault();

  ["dragenter", "dragover", "dragleave", "drop"].forEach((evtName) => {
    droparea.addEventListener(evtName, prevents);
  });

  ["dragenter", "dragover"].forEach((evtName) => {
    droparea.addEventListener(evtName, active);
  });

  ["dragleave", "drop"].forEach((evtName) => {
    droparea.addEventListener(evtName, inactive);
  });

  droparea.addEventListener("drop", handleDrop);
};

//** USED TO UPDATE THE CHART WITH THE CONTROLS */
function updateChart(backward) {
  if (RESOURCE_LOADED) {
    if (animPlay) {
      if (dataTimeIndex < newDataArray.length - 2) {
        dataTimeIndex++;
      } else {
        dataTimeIndex = 0;
      }
    } else {
      //** BACKWARDS IN TIMELINE */
      if (backward) {
        if (dataTimeIndex < newDataArray.length - 2 && dataTimeIndex > 0) {
          dataTimeIndex--;
        } else if (dataTimeIndex == newDataArray.length - 2) {
          dataTimeIndex--;
        } else {
          dataTimeIndex = newDataArray.length - 2;
        }
      }
      //** FORWARDS IN TIMELINE */
      else if (!backward) {
        if (dataTimeIndex < newDataArray.length - 2) {
          dataTimeIndex++;
        } else {
          dataTimeIndex = 0;
        }
      }
    }

    var progress = (dataTimeIndex / (newDataArray.length - 2)) * 100;
    document.querySelector(".progress__fill").style.width = progress + "%";
    console.log("PROGRESS: " + progress + " DATA INDEX: " + dataTimeIndex);
    frameNumber.innerHTML = dataTimeIndex + "/" + (newDataArray.length - 2);

    //** VISIBLE LIGHT RAW */
    mainChart.data.datasets[13].data = [
      {
        x: 450,
        y: newDataArray[dataTimeIndex].V450_power,
      },
      {
        x: 500,
        y: newDataArray[dataTimeIndex].B500_power,
      },
      {
        x: 550,
        y: newDataArray[dataTimeIndex].G550_power,
      },
      {
        x: 570,
        y: newDataArray[dataTimeIndex].Y570_power,
      },
      {
        x: 600,
        y: newDataArray[dataTimeIndex].O600_power,
      },
      {
        x: 650,
        y: newDataArray[dataTimeIndex].R650_power,
      },
    ];

    //** INFRARED RAW */
    mainChart.data.datasets[12].data = [
      {
        x: 610,
        y: newDataArray[dataTimeIndex].nir610_power,
      },
      {
        x: 680,
        y: newDataArray[dataTimeIndex].nir680_power,
      },
      {
        x: 730,
        y: newDataArray[dataTimeIndex].nir730_power,
      },
      {
        x: 760,
        y: newDataArray[dataTimeIndex].nir760_power,
      },
      {
        x: 810,
        y: newDataArray[dataTimeIndex].nir810_power,
      },
      {
        x: 860,
        y: newDataArray[dataTimeIndex].nir860_power,
      },
    ];

    //** ADD ALL NORMALIZED VALUES TO CURVE, START AT ONE TO AVOID LABELS*/

    //** NORMALIZED VISIBLE */
    for (let i = 0; i < (calibrationArray_Visible.length - cut) / step; i++) {
      mainChart.data.datasets[6].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          newDataArray[dataTimeIndex].V450_power *
          parseFloat(calibrationArray_Visible[i * step].V450_power),
      };
      mainChart.data.datasets[7].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          newDataArray[dataTimeIndex].B500_power *
          parseFloat(calibrationArray_Visible[i * step].B500_power),
      };
      mainChart.data.datasets[8].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          newDataArray[dataTimeIndex].G550_power *
          parseFloat(calibrationArray_Visible[i * step].G550_power),
      };
      mainChart.data.datasets[9].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          newDataArray[dataTimeIndex].Y570_power *
          parseFloat(calibrationArray_Visible[i * step].Y570_power),
      };
      mainChart.data.datasets[10].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          newDataArray[dataTimeIndex].O600_power *
          parseFloat(calibrationArray_Visible[i * step].O600_power),
      };
      mainChart.data.datasets[11].data[i] = {
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y:
          newDataArray[dataTimeIndex].R650_power *
          parseFloat(calibrationArray_Visible[i * step].R650_power),
      };
    }
    //** NORMALIZED INFRARED */
    for (let i = 0; i < (calibrationArray_Infrared.length - cut) / step; i++) {
      mainChart.data.datasets[0].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          newDataArray[dataTimeIndex].nir610_power *
          parseFloat(calibrationArray_Infrared[i * step].nir610_power),
      };
      mainChart.data.datasets[1].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          newDataArray[dataTimeIndex].nir680_power *
          parseFloat(calibrationArray_Infrared[i * step].nir680_power),
      };
      mainChart.data.datasets[2].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          newDataArray[dataTimeIndex].nir730_power *
          parseFloat(calibrationArray_Infrared[i * step].nir730_power),
      };
      mainChart.data.datasets[3].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          newDataArray[dataTimeIndex].nir760_power *
          parseFloat(calibrationArray_Infrared[i * step].nir760_power),
      };
      mainChart.data.datasets[4].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          newDataArray[dataTimeIndex].nir810_power *
          parseFloat(calibrationArray_Infrared[i * step].nir810_power),
      };
      mainChart.data.datasets[5].data[i] = {
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y:
          newDataArray[dataTimeIndex].nir860_power *
          parseFloat(calibrationArray_Infrared[i * step].nir860_power),
      };
    }

    //** udpate NDVI */
    for (let i = 0; i < newDataArray.length; i++) {
      chart2.data.datasets[0].data[i] = {
        x: parseFloat(newDataArray[i].decimal_hour),
        y: calculateNDVI(i),
      };
      calculateNDVI(i);
    }

    mainChart.update();
    chart2.update();

    if (animPlay) {
      animWaitFunc = setTimeout(function () {
        updateChart();
        console.log(newDataArray[dataTimeIndex]);
        console.log("UPDATE: " + dataTimeIndex);
      }, animationTime);
    }
  }
}

//** UPDATES THE GRAPHS GRADIENTS */
function graphGradients() {
  console.log("HEIGHT: " + mainChart.height + ", WIDTH: " + mainChart.width);

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
  mainChart.data.datasets[12].backgroundColor = infraredGradient;

  mainChart.update();
}

//** HANDLES THE FILE DROP */
document.addEventListener("DOMContentLoaded", initApp);
const handleDrop = (e) => {
  if (!RESOURCE_LOADED) {
    const dt = e.dataTransfer;
    const files = dt.files;
    const fileArray = [...files];

    var file = e.dataTransfer.files[0],
      reader = new FileReader();

    if (file.type == "text/plain") {
      document.querySelector(".droparea").classList.toggle("active");
      document.getElementById("mainGraph").classList.toggle("active");
      rawData_element.classList.toggle("active");
      visible_filter_element.classList.toggle("active");
      infrared_filter_element.classList.toggle("active");
      ndvi_element.classList.toggle("active");
      recordButton.classList.toggle("active");

      newFile.classList.toggle("active");
      graphGradients();

      //** WHEN THE DATA FILE IS LOADED */
      reader.onload = function (event) {
        newDataArray = csvToArray(reader.result);
        console.log(newDataArray);

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
        //console.log(dataArray);
        RESOURCE_LOADED = true;
        updateChart();
      };
    }
    console.log(file);
    reader.readAsText(file);
  }
};

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

  if (rawData_element.classList.contains("selected")) {
    console.log("Raw Data is Selected: ");
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
    console.log("Visible Data is not selected: " + excludeLabelList);
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
    console.log("Infrared Data is not selected: " + excludeLabelList);
    mainChart.getDatasetMeta(0).hidden = true;
    mainChart.getDatasetMeta(1).hidden = true;
    mainChart.getDatasetMeta(2).hidden = true;
    mainChart.getDatasetMeta(3).hidden = true;
    mainChart.getDatasetMeta(4).hidden = true;
    mainChart.getDatasetMeta(5).hidden = true;
  }

  mainChart.update();
}

function calculateNDVI(index) {
  var b1 = "nir860_power";
  var b2 = "R650_power";
  console.log(newDataArray);
  console.log(index);

  var ndvi =
    (parseFloat(newDataArray[index][b1]) -
      parseFloat(newDataArray[index][b2])) /
    (parseFloat(newDataArray[index][b1]) + parseFloat(newDataArray[index][b2]));
  //console.log(ndvi);

  return ndvi;
  // for(var i = 0; i < newDataArray.length; i++)
  // {
  // }
}

//READS MESSAGES BEING SENT THROUGH THE SERIAL PORT *//
async function getSerialMessage() {
  //getSerialMessage();

  clearTimeout(serialTimeout);

  //** IF THERE ARE NO ERRORS */
  serialTimeout = setTimeout(async function () {
    var message = await serialScaleController.read();
    console.log(message);
    getSerialMessage();
    decipherSerialMessage(message);
    //console.log("update read");
  }, 500);

  //document.querySelector("#serial-messages-container .message").innerText += await serialScaleController.read()
}

function decipherSerialMessage(message)
{
  let messageSplit = message.split(" ");
  if(message.includes("paused"))
  {
    //console.log("PAUSED");
  }

  //** IF THE FULL MESSAGE DIDN"T COME IN */
  else if(message.length < 5)
  {
    if(message.includes('p') || message.includes('.'))
    {
      //console.log("PAUSED");
    }
  }
  else
  {
    //** TOP LIVE VALUES */
    
    //** SURFACE TEMP */
    if(messageSplit.includes("surface_temp:"))
    {
      let surface_temp = messageSplit[messageSplit.indexOf("surface_temp:")+1];
      document.getElementById("surfaceTemp_label").innerHTML = "Surface: " + parseFloat(surface_temp) + "C";
    }
    //** AIR TEMP */
    if(messageSplit.includes("air_temp:"))
    {
      let airTemp = messageSplit[messageSplit.indexOf("air_temp:")+1];
      document.getElementById("airTemp_label").innerHTML = "Air: " + parseFloat(airTemp) + "C";
    }
    //** TIMESTAMP */
    if(messageSplit.includes("hour:") && messageSplit.includes("min:") && messageSplit.includes("sec:"))
    {
      if(messageSplit.indexOf("hour:")+1 && messageSplit.indexOf("min:")+1 && messageSplit.indexOf("sec:")+1)
      {
        let hour = messageSplit[messageSplit.indexOf("hour:")+1];
        let min = messageSplit[messageSplit.indexOf("min:")+1];
        let sec = messageSplit[messageSplit.indexOf("sec:")+1];

        if(parseInt(hour) < 10)
        {
          hour = "0" + hour.substring(0, hour.length - 1);
        }
        else
        {
          hour = hour.substring(0, hour.length - 1);
        }
        if(parseInt(min) < 10)
        {
          min = "0" + min.substring(0, min.length - 1);
        }
        else
        {
          min = min.substring(0, min.length - 1);
        }
        if(parseInt(sec) < 10)
        {
          sec = "0" + sec.substring(0, sec.length - 1);
        }
        else
        {
          sec = sec.substring(0, sec.length - 1);
        }

        document.getElementById("timestamp_label").innerHTML =  
        hour + ":" 
        + min + ":" 
        + sec + "Z";
      }
    }
    //** DATESTAMP */
    if(messageSplit.includes("year:") && messageSplit.includes("month:") && messageSplit.includes("day:"))
    {
      if(messageSplit.indexOf("year:")+1 && messageSplit.indexOf("month:")+1 && messageSplit.indexOf("day:")+1)
      {
        let year = messageSplit[messageSplit.indexOf("year:")+1];
        let month = messageSplit[messageSplit.indexOf("month:")+1];
        let day = messageSplit[messageSplit.indexOf("day:")+1];

        if(parseInt(year) < 10)
        {
          year = "0" + year.substring(0, year.length - 1);
        }
        else
        {
          year = year.substring(0, year.length - 1);
        }
        if(parseInt(month) < 10)
        {
          month = "0" + month.substring(0, month.length - 1);
        }
        else
        {
          month = month.substring(0, month.length - 1);
        }
        if(parseInt(day) < 10)
        {
          day = "0" + day.substring(0, day.length - 1);
        }
        else
        {
          day = day.substring(0, day.length - 1);
        }

        document.getElementById("date_label").innerHTML =  
        year + "-" 
        + month + "-" 
        + day;
      }
    }
    if(messageSplit.includes("batch:"))
    {
      let batchNmb = messageSplit[messageSplit.indexOf("batch:")+1];
      document.getElementById("batchNmb_label").innerHTML = parseFloat(batchNmb);
    }
    if(messageSplit.includes("UID:"))
    {
      let uid = messageSplit[messageSplit.indexOf("UID:")+1];
      document.getElementById("UID_label").innerHTML = "UID: " + parseFloat(uid);
    }

    //** UPDATE VISIBLE LIVE VALUES */
    if(messageSplit.includes("v450:"))
    {
      let v450 = messageSplit[messageSplit.indexOf("v450:")+1];
      document.getElementById("v450_label").innerHTML = "V450: " + parseFloat(v450);
    }
    if(messageSplit.includes("b500:"))
    {
      let b500 = messageSplit[messageSplit.indexOf("b500:")+1];
      document.getElementById("b500_label").innerHTML = "B500: " + parseFloat(b500);
    }
    if(messageSplit.includes("g550:"))
    {
      let g550 = messageSplit[messageSplit.indexOf("g550:")+1];
      document.getElementById("g550_label").innerHTML = "G550: " + parseFloat(g550);
    }
    if(messageSplit.includes("y570:"))
    {
      let y570 = messageSplit[messageSplit.indexOf("y570:")+1];
      document.getElementById("y570_label").innerHTML = "Y570: " + parseFloat(y570);
    }
    if(messageSplit.includes("o600:"))
    {
      let o600 = messageSplit[messageSplit.indexOf("o600:")+1];
      document.getElementById("o600_label").innerHTML = "O600: " + parseFloat(o600);
    }
    if(messageSplit.includes("r650:"))
    {
      let r650 = messageSplit[messageSplit.indexOf("r650:")+1];
      document.getElementById("r650_label").innerHTML = "R650: " + parseFloat(r650);
    }

    //** UPDATE INFRARED VALUES */
    if(messageSplit.includes("610:"))
    {
      let i610 = messageSplit[messageSplit.indexOf("610:")+1];
      document.getElementById("610_label").innerHTML = "610: " + parseFloat(i610);
    }
    if(messageSplit.includes("680:"))
    {
      let i680 = messageSplit[messageSplit.indexOf("680:")+1];
      document.getElementById("680_label").innerHTML = "680: " + parseFloat(i680);
    }
    if(messageSplit.includes("730:"))
    {
      let i730 = messageSplit[messageSplit.indexOf("730:")+1];
      document.getElementById("730_label").innerHTML = "730: " + parseFloat(i730);
    }
    if(messageSplit.includes("760:"))
    {
      let i760 = messageSplit[messageSplit.indexOf("760:")+1];
      document.getElementById("760_label").innerHTML = "760: " + parseFloat(i760);
    }
    if(messageSplit.includes("810:"))
    {
      let i810 = messageSplit[messageSplit.indexOf("810:")+1];
      document.getElementById("810_label").innerHTML = "810: " + parseFloat(i810);
    }
    if(messageSplit.includes("860:"))
    {
      let i860 = messageSplit[messageSplit.indexOf("860:")+1];
      document.getElementById("860_label").innerHTML = "860: " + parseFloat(i860);
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
    recordingText.innerHTML = formatTime(timePassed);
    console.log("TICK: " + formatTime(timePassed));
  }, 1000);
}

function animate() {
  ctx.fillStyle = "#FF0000"; // with your desired background color
  ctx.fillRect(0, 0, 500, 500);
  console.log("ANIMTE");
}
animate();

//** CLICK EVENT FOR UPLOAD NEW BUTTON */
uploadNew.addEventListener("click", function (ev) {
  ev.stopPropagation(); // prevent event from bubbling up to .container
  newFile.classList.toggle("active");
  document.querySelector(".droparea").classList.toggle("active");
  document.getElementById("mainGraph").classList.toggle("active");

  if (document.getElementById("calcGraph").classList.contains("active")) {
    document.getElementById("calcGraph").classList.toggle("active");
  }
  if (ndvi_element.classList.contains("selected")) {
    ndvi_element.classList.toggle("selected");
  }
  rawData_element.classList.toggle("active");
  visible_filter_element.classList.toggle("active");
  infrared_filter_element.classList.toggle("active");
  ndvi_element.classList.toggle("active");
  recordButton.classList.toggle("active");
  RESOURCE_LOADED = false;
});

//** CLICK EVENT FOR THE PLAY / PAUSE BUTTON */
const box = document.querySelector(".box");
box.addEventListener("click", (e) => {
  e.target.classList.toggle("pause");

  if (animPlay) {
    animPlay = false;
    clearTimeout(animWaitFunc);
    console.log("PAUSE");
  } else {
    animPlay = true;
    updateChart();
    console.log("PLAY");
  }

  //clearTimeout(animWaitFunc);
});

//** CLICK EVENT FOR RIGHT ARROW BUTTON */
const arrowRight = document.getElementById("arrowRight");
arrowRight.addEventListener("click", (e) => {
  if (animPlay) {
    animPlay = false;
    box.classList.toggle("pause");
  }

  clearTimeout(animWaitFunc);
  updateChart(false);
});

//** CLICK EVENT FOR LEFT ARROW BUTTON */
const arrowLeft = document.getElementById("arrowLeft");
arrowLeft.addEventListener("click", (e) => {
  console.log("Left Button");

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
};

//** USED TO CONTROL SPEED OF ANIMATION */
speedSlider.addEventListener("change", function (e) {
  // Force the string value of the range to a number and then force the
  // number to have a single decimal
  animationTime = 200 * speedSlider.value;
  console.log(speedSlider.value);
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

ndvi_element.addEventListener("click", function () {
  ndvi_element.classList.toggle("selected");

  if (ndvi_element.classList.contains("selected")) {
    document.getElementById("mainGraph").style.width = "50%";
    document.getElementById("calcGraph").style.width = "50%";
  } else {
    document.getElementById("mainGraph").style.width = "75%";
    mainChart.update();
  }

  updateChartLabels();
  document.getElementById("calcGraph").classList.toggle("active");
});

connectDevice.addEventListener("click", function () {
  serialScaleController.init();
});

recordButton.addEventListener("click", function () {
  recordButton.classList.toggle("recording");
  if (recordButton.classList.contains("recording")) {
    startTimer();
    mediaRecorder.start();
    recordingText.classList.toggle("active");
  } else {
    clearInterval(timerInterval);
    recordingText.innerHTML = "Record";
    mediaRecorder.stop();
    timePassed = 0;
    recordingText.classList.toggle("active");
  }
});

//** SERIAL PORT FUNCTIONALITY */
navigator.serial.addEventListener("connect", (e) => {
  // Connect to `e.target` or add it to a list of available ports.
  console.log("CONNECT TO PORT: " + e);
  console.log(e);
});

navigator.serial.addEventListener("disconnect", (e) => {
  // Remove `e.target` from the list of available ports.
  console.log("DISCONNECT TO PORT: " + e);
});

navigator.serial.getPorts().then((ports) => {
  // Initialize the list of available ports with `ports` on page load.
  console.log(ports);
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

// visible_filter_range.addEventListener("change", function(e){
//   //step = visible_filter_range.value;
//   //console.log(speedSlider.value);
// });
