import './style.css'

const ctx = document.getElementById('graph').getContext("2d");

//** GRADIENT FILL */
let visibleGradient = ctx.createLinearGradient(0, 0, 500, 0);
visibleGradient.addColorStop(0.1, "rgba(0, 0, 255, 0.75)");
visibleGradient.addColorStop(0.25, "rgba(0, 255, 0, 0.75)");
visibleGradient.addColorStop(0.5, "rgba(255, 255, 0, 0.75)");
visibleGradient.addColorStop(0.75, "rgba(255, 102, 0, 0.75)");
visibleGradient.addColorStop(1, "rgba(255, 0, 0, 0.75)");
let infraredGradient = ctx.createLinearGradient(0, 0, 800, 0);
infraredGradient.addColorStop(0, "rgba(255, 0, 0, 1)");
infraredGradient.addColorStop(1, "rgba(173, 173, 173, 0.75)");

//** FILE DROP JS */
let dropArea = document.getElementById('drop-area');
let dataArray = [];
let newDataArray = [];
let dataTimeIndex = 0;
let animationTime = 1500;

//** HTML ELEMENTS */
let uploadNew = document.getElementById("newFile");
let speedSlider = document.getElementById("myRange");
let frameNumber = document.getElementById("frameNumber");
let rawData_element = document.getElementById('rawData');
let visible_filter_element = document.getElementById('visible_filter');
let infrared_filter_element = document.getElementById('infrared_filter');
let connectDevice = document.getElementById('plugInDevice');

let visible_filter_range = document.getElementById('visibleFilter_range');

//** SERIAL PORTS */
let port;

//** VARIOUS VARIABLES */
var RESOURCE_LOADED = false;
var animPlay = true;
var animWaitFunc;
let excludeLabelList = [];
let visible_filter_array = ['V', 'B', 'G', 'Y', 'O', 'R'];
let infrared_filter_array = ['610nm', '680nm', '730nm', '760nm', '810nm', '860nm'];
let rawData_array = ['Visible', 'Infrared'];
let delayed;
var calibrationData, calibrationData_Infrared;
var calibrationArray_Visible, calibrationArray_Infrared;

excludeLabelList = excludeLabelList.concat(visible_filter_array, infrared_filter_array);
console.log(excludeLabelList);

//** VARIABLES FOR CONTROLLING DATA */
let step = 5;
let cut = 0;
var visibleStartData = [2.4, 2.6, 2.2, 1.9, 2.0, 1.8];
var infraredStartData = [5.4, 5.0, 5.4, 6.5, 5.0, 4.3];
var visible = [...Array(1)].map(e => Array(1));
var infrared = [...Array(1)].map(e => Array(1));


//** DATA SETUP FOR CHARTJS */
var data = {
  datasets: [
    //** 610 */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "610nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(212.5,0,0)",
      borderColor: "rgb(212.5,0,0)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** 680 */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "680nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 40, 40)",
      borderColor: "rgb(200, 40, 40)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** 730 */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "730nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 80, 80)",
      borderColor: "rgb(200, 80, 80)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** 760 */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "760nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 120, 120)",
      borderColor: "rgb(200, 120, 120)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** 810 */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "810nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 160, 160)",
      borderColor: "rgb(200, 160, 160)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** 860 */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "860nm",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(200, 200, 200)",
      borderColor: "rgb(200, 200, 200)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** V */
    {
      data: [
      {
        x: 450,
        y: 1,
      }],
      showLine: true,
      label: "V",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(147,112,219)",
      borderColor: "rgb(147,112,219)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** B */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "B",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(0,0,255)",
      borderColor: "rgb(0,0,255)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** G */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "G",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(0,255,0)",
      borderColor: "rgb(0,255,0)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** Y */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "Y",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(255,255,0)",
      borderColor: "rgb(255,255,0)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** O */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "O",
      hidden: true,
      fill: false,
      backgroundColor: "rgb(255,140,0)",
      borderColor: "rgb(255,140,0)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** R */
    {
      data: [
      {
        x: 500,
        y: 1,
      }],
      showLine: true,
      label: "R",
      fill: false,
      hidden: true,
      backgroundColor: "rgb(255,0,0)",
      borderColor: "rgb(255,0,0)",
      lineTension: 0.25,  
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** INFRARED */
    {
      data: [{
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
      }],
      showLine: true,
      label: "Infrared",
      fill: true,
      backgroundColor: infraredGradient,
      borderColor: 'rgb(255, 255, 255)', 
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
    //** VISIBLE */
    {
      data: [{
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
      }],
      showLine: true,
      label: "Visible",
      fill: true,
      backgroundColor: visibleGradient,
      borderColor: 'rgb(255, 255, 255)', 
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
  ], 
};

//** CONFIG SETUP FOR CHARTJS */
const config = {
  type: 'scatter', 
  data: data, 
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: true,
    responsive: true,
    tension: 0,
    plugins: {
      title: {
        display: true,
        text: 'STELLA'
      },
      legend: {
        display: true,
        labels: {
          filter: function( item, chart)
          {                   
            //** Function for filtering out legends. Chooses which Labels to exclude depending on the dataMode*/

            if(excludeLabelList.includes(item.text))
            {
              return false;
            }
            else
            {
              return item;
            }
          }
        }
     },
    },
    //** ADDS NM to the Y axis lables */
    animation:{
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed)
        {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y:{
        // ticks: {
        //   callback: function (value){
        //     return value + "μW/cm²";
        //   }
        // },
        title: {
          display: true,
          text: 'μW/cm²',
          font: {
            size: 15
          },
        }
      }, 
      x:{
        type: 'linear',
        position: 'bottom',
        // ticks: {
        //   callback: function (value){
        //     return value + " nm";
        //   }
        // },
        title: {
          display: true,
          text: 'Wavelength (nm)', 
          align: 'center',
          font: {
            size: 15
          },
        },
      }
    },
  },
};

//** CHART INSTANTIATION */
const myChart = new Chart(ctx, config);

init();
function init()
{
  calibrationData = readTextFile("/files/Calibration-visible.csv", true);
  calibrationData_Infrared = readTextFile("/files/calibration-infrared.csv", false);

  graphGradients();
}

//** GRABS THE DATA FROM THE DROP AND SENDS IT TO BE CONVERTED INTO A CSV */
function readTextFile(file, visible)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var csvdata = allText;

                if(visible)
                {
                  calibrationArray_Visible = csvToArray(csvdata);
                  console.log(calibrationArray_Visible);
                }
                else
                {
                  calibrationArray_Infrared = csvToArray(csvdata);
                  console.log(calibrationArray_Infrared);
                }

                //console.log(array);
                //console.log(parseFloat(calibrationArray_Visible[0].wavelength));
            }
        }
    }
    rawFile.send(null);
}

//** INITIALIZES DRAG AND DROP */
const initApp = () => {
  const droparea = document.querySelector('.droparea');

  const active = () => droparea.classList.add("-border");

  const inactive = () => droparea.classList.remove("-border");

  const prevents = (e) => e.preventDefault();

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
      droparea.addEventListener(evtName, prevents);
  });

  ['dragenter', 'dragover'].forEach(evtName => {
      droparea.addEventListener(evtName, active);
  });

  ['dragleave', 'drop'].forEach(evtName => {
      droparea.addEventListener(evtName, inactive);
  });

  droparea.addEventListener("drop", handleDrop);

}

//** USED TO UPDATE THE CHART WITH THE CONTROLS */
function updateChart(backward)
{ 
  if(RESOURCE_LOADED)
  {
    
    
    if(animPlay)
    {
      if(dataTimeIndex < newDataArray.length - 2)
      {
        dataTimeIndex++;
      }
      else
      {
        dataTimeIndex = 0;
      }
    }
    else
    {
      //** BACKWARDS IN TIMELINE */
      if(backward)
      {
        if(dataTimeIndex < newDataArray.length - 2 && dataTimeIndex > 0)
        {
          dataTimeIndex--;
        }
        else if(dataTimeIndex == newDataArray.length - 2)
        {
          dataTimeIndex--;
        }
        else
        {
          dataTimeIndex = newDataArray.length - 2;
        }
      }
      //** FORWARDS IN TIMELINE */
      else if(!backward)
      {
        if(dataTimeIndex < newDataArray.length - 2)
        {
          dataTimeIndex++;
        }
        else
        {
          dataTimeIndex = 0;
        }
      }
    }
    

    var progress = (dataTimeIndex/(newDataArray.length-2)) * 100;
    document.querySelector(".progress__fill").style.width = progress + "%";
    console.log("PROGRESS: " + progress + " DATA INDEX: " + dataTimeIndex);
    frameNumber.innerHTML = dataTimeIndex + "/" + (newDataArray.length-2);

    myChart.data.datasets[13].data = [
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
    },];

    myChart.data.datasets[12].data = [
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
      },];
    
    //** ADD ALL NORMALIZED VALUES TO CURVE, START AT ONE TO AVOID LABELS*/
    for(let i = 0; i < (calibrationArray_Visible.length - cut)/step; i++)
    {
      myChart.data.datasets[6].data[i] = ({
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y: newDataArray[dataTimeIndex].V450_power * parseFloat(calibrationArray_Visible[i * step].V450_power)
      });
      myChart.data.datasets[7].data[i] = ({
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y: newDataArray[dataTimeIndex].B500_power * parseFloat(calibrationArray_Visible[i * step].B500_power)
      });
      myChart.data.datasets[8].data[i] = ({
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y: newDataArray[dataTimeIndex].G550_power * parseFloat(calibrationArray_Visible[i * step].G550_power)
      });
      myChart.data.datasets[9].data[i] = ({
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y: newDataArray[dataTimeIndex].Y570_power * parseFloat(calibrationArray_Visible[i * step].Y570_power)
      });
      myChart.data.datasets[10].data[i] = ({
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y: newDataArray[dataTimeIndex].O600_power * parseFloat(calibrationArray_Visible[i * step].O600_power)
      });
      myChart.data.datasets[11].data[i] = ({
        x: parseInt(calibrationArray_Visible[i * step].wavelength),
        y: newDataArray[dataTimeIndex].R650_power * parseFloat(calibrationArray_Visible[i * step].R650_power)
      });
    }
    for(let i = 0; i < (calibrationArray_Infrared.length - cut)/step; i++)
    {
      myChart.data.datasets[0].data[i] = ({
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y: newDataArray[dataTimeIndex].nir610_power * parseFloat(calibrationArray_Infrared[i * step].nir610_power)
      });
      myChart.data.datasets[1].data[i] = ({
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y: newDataArray[dataTimeIndex].nir680_power * parseFloat(calibrationArray_Infrared[i * step].nir680_power)
      });
      myChart.data.datasets[2].data[i] = ({
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y: newDataArray[dataTimeIndex].nir730_power * parseFloat(calibrationArray_Infrared[i * step].nir730_power)
      });
      myChart.data.datasets[3].data[i] = ({
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y: newDataArray[dataTimeIndex].nir760_power * parseFloat(calibrationArray_Infrared[i * step].nir760_power)
      });
      myChart.data.datasets[4].data[i] = ({
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y: newDataArray[dataTimeIndex].nir810_power * parseFloat(calibrationArray_Infrared[i * step].nir810_power)
      });
      myChart.data.datasets[5].data[i] = ({
        x: parseInt(calibrationArray_Infrared[i * step].Lambda),
        y: newDataArray[dataTimeIndex].nir860_power * parseFloat(calibrationArray_Infrared[i * step].nir860_power)
      });
    }
    
    myChart.update();

    if(animPlay)
    {
      animWaitFunc = setTimeout(function()
      {
        updateChart();
        console.log(newDataArray[dataTimeIndex]);
        console.log("UPDATE: " + dataTimeIndex);
        
      }, animationTime);
    }
  }
}

//** UPDATES THE GRAPHS GRADIENTS */
function graphGradients()
{
  console.log("HEIGHT: " + myChart.height + ", WIDTH: " + myChart.width);

  visibleGradient = ctx.createLinearGradient(0, 0, myChart.width/2, 0);
  visibleGradient.addColorStop(0.1, "rgba(0, 0, 255, 0.75)");
  visibleGradient.addColorStop(0.25, "rgba(0, 255, 0, 0.75)");
  visibleGradient.addColorStop(0.5, "rgba(255, 255, 0, 0.75)");
  visibleGradient.addColorStop(0.75, "rgba(255, 102, 0, 0.75)");
  visibleGradient.addColorStop(1, "rgba(255, 0, 0, 0.75)");
  
  infraredGradient = ctx.createLinearGradient(0, 0, myChart.width, 0);
  infraredGradient.addColorStop(0, "rgba(255, 0, 0, 1)");
  infraredGradient.addColorStop(1, "rgba(173, 173, 173, 0.75)");
  
  myChart.data.datasets[13].backgroundColor = visibleGradient;
  myChart.data.datasets[12].backgroundColor = infraredGradient;

  myChart.update();
}

//** HANDLES THE FILE DROP */
document.addEventListener("DOMContentLoaded", initApp);
const handleDrop = (e) => {

  if(!RESOURCE_LOADED)
  {
    const dt = e.dataTransfer;
    const files = dt.files;
    const fileArray = [...files];
    
    var file = e.dataTransfer.files[0],
    reader = new FileReader();

    if(file.type == "text/plain")
    {
      document.querySelector('.droparea').classList.toggle("active");
      document.getElementById("chart").classList.toggle("active");
      rawData_element.classList.toggle("active");
      visible_filter_element.classList.toggle("active");
      infrared_filter_element.classList.toggle("active");

      newFile.classList.toggle("active");
      //** WHEN THE DATA FILE IS LOADED */
      reader.onload = function(event) 
      {
        
        newDataArray = csvToArray(reader.result);
        console.log(newDataArray);
        console.log(newDataArray[0].B500_power);
        console.log(calibrationArray_Visible[1].wavelength);
        
        //** CLEAR THE ARRAY IF IT IS FULL */  
        if(dataArray)
        {
          dataArray = [];
        }  
    
        //console.log(event.target);
        const lineSplit = reader.result.split(/\r?\n/);
        //console.log(lineSplit);
        
        for(var i = 0; i < lineSplit.length; i++)
        {
          dataArray.push(lineSplit[i].split(","));
        }
        //console.log(dataArray);
    
        //** SORT DATA TO VISIBLE AND INFRARED */
        for(var x = 0; x < dataArray.length - 1; x++)
        {
          visible[x] = [];
          infrared[x] = [];
          //** OFFSET INDEX TO ONLY GRAB VALUES */
          for(var y = 0; y < dataArray[x].length; y++)
          {
            
            //** IF EVEN, FOR GETTING THE LABELS */
            if(y % 2 == 0)
            {
              //infrared[x].push(dataArray[x][y]);
            }
            //** IF ODD, FOR GETTING THE DATA */
            else
            {
              //** VISIBLE */
              if(y < 12)
              {
                visible[x].push(parseFloat(dataArray[x][y]));
              }
              //** INFRARED */
              else
              {
                //** ADD BLANK SPACE TO ARRAY FOR CHART.JS*/
                infrared[x].push(parseFloat(dataArray[x][y]));
                //infrared[x].push(parseFloat(dataArray[x][y]));
              }
              
              //** IF ODD */
            }
          }
        }
        RESOURCE_LOADED = true;
        updateChart();
        
      };
    }
    console.log(file);
    reader.readAsText(file);
  }
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
function updateChartLabels()
{
  excludeLabelList = [];

  if(rawData_element.classList.contains('selected'))
  {
    console.log('Raw Data is Selected: ');
    myChart.getDatasetMeta(12).hidden = false;
    myChart.getDatasetMeta(13).hidden = false;
  }
  else
  {
    excludeLabelList = excludeLabelList.concat(rawData_array);
    console.log('Raw Data is not selected: ' + excludeLabelList);
    myChart.getDatasetMeta(12).hidden = true;
    myChart.getDatasetMeta(13).hidden = true;
  }
  if(visible_filter_element.classList.contains('selected'))
  {
    console.log('Visible data is Selected: ');
    myChart.getDatasetMeta(6).hidden = false;
    myChart.getDatasetMeta(7).hidden = false;
    myChart.getDatasetMeta(8).hidden = false;
    myChart.getDatasetMeta(9).hidden = false;
    myChart.getDatasetMeta(10).hidden = false;
    myChart.getDatasetMeta(11).hidden = false;
  }
  else
  {
    excludeLabelList = excludeLabelList.concat(visible_filter_array);
    console.log('Visible Data is not selected: ' + excludeLabelList);
    myChart.getDatasetMeta(6).hidden = true;
    myChart.getDatasetMeta(7).hidden = true;
    myChart.getDatasetMeta(8).hidden = true;
    myChart.getDatasetMeta(9).hidden = true;
    myChart.getDatasetMeta(10).hidden = true;
    myChart.getDatasetMeta(11).hidden = true;
  }
  if(infrared_filter_element.classList.contains('selected'))
  {
    console.log('Infrared data is Selected: ');
    myChart.getDatasetMeta(0).hidden = false;
    myChart.getDatasetMeta(1).hidden = false;
    myChart.getDatasetMeta(2).hidden = false;
    myChart.getDatasetMeta(3).hidden = false;
    myChart.getDatasetMeta(4).hidden = false;
    myChart.getDatasetMeta(5).hidden = false;
  }
  else
  {
    excludeLabelList = excludeLabelList.concat(infrared_filter_array);
    console.log('Infrared Data is not selected: ' + excludeLabelList);
    myChart.getDatasetMeta(0).hidden = true;
    myChart.getDatasetMeta(1).hidden = true;
    myChart.getDatasetMeta(2).hidden = true;
    myChart.getDatasetMeta(3).hidden = true;
    myChart.getDatasetMeta(4).hidden = true;
    myChart.getDatasetMeta(5).hidden = true;
  }


  myChart.update();
}

//** USED TO REQUEST AVAILABLE PLUGGED IN DEVICES */
async function requestSerialPort()
{
  
  // CODELAB: Add code to request & open port here.
  // - Request a port and open a connection.
  port = await navigator.serial.requestPort();
  // - Wait for the port to open.
  await port.open({ baudRate: 9600 });
  
  const usbVendorId = 0xABCD;

  //filters: [{ usbVendorId }]
  // port = navigator.serial.requestPort({ }).then((port) => {
  //   // Connect to `port` or add it to the list of available ports.
  // }).catch((e) => {
  //   // The user didn't select a port.
  // });
}

//** CLICK EVENT FOR UPLOAD NEW BUTTON */
uploadNew.addEventListener("click", function (ev) 
{
  ev.stopPropagation(); // prevent event from bubbling up to .container
  newFile.classList.toggle("active");
  document.querySelector('.droparea').classList.toggle("active");
  document.getElementById("chart").classList.toggle("active");
  rawData_element.classList.toggle("active");
  visible_filter_element.classList.toggle("active");
  infrared_filter_element.classList.toggle("active");
  RESOURCE_LOADED = false;
});

//** CLICK EVENT FOR THE PLAY / PAUSE BUTTON */
const box = document.querySelector('.box');
box.addEventListener('click', (e)=>{
  e.target.classList.toggle('pause');

  if(animPlay)
  {
    animPlay = false;
    clearTimeout(animWaitFunc);
    console.log("PAUSE");
  }
  else
  {
    animPlay = true;
    updateChart();
    console.log("PLAY");
  }
  
  //clearTimeout(animWaitFunc);
})

//** CLICK EVENT FOR RIGHT ARROW BUTTON */
const arrowRight = document.getElementById('arrowRight');
arrowRight.addEventListener('click', (e)=>{
  
  if(animPlay)
  {
    animPlay = false;
    box.classList.toggle('pause');
  }
  
  clearTimeout(animWaitFunc);
  updateChart(false);
})

//** CLICK EVENT FOR LEFT ARROW BUTTON */
const arrowLeft = document.getElementById('arrowLeft');
arrowLeft.addEventListener('click', (e)=>{
  console.log("Left Button");
  
  if(animPlay)
  {
    animPlay = false;
    box.classList.toggle('pause');
  }
  
  clearTimeout(animWaitFunc);
  updateChart(true);
})

//** WINDOW RESIZE EVENT */
var doit;
window.onresize = function() {
  clearTimeout(doit);
  doit = setTimeout(function() 
  {
      graphGradients();
  }, 1000);
};

//** USED TO CONTROL SPEED OF ANIMATION */
speedSlider.addEventListener("change", function(e){
  // Force the string value of the range to a number and then force the 
  // number to have a single decimal
  animationTime = 200 * speedSlider.value;
  console.log(speedSlider.value);
});

rawData_element.addEventListener('click', function() {
  console.log("Clicked Raw Data");
  rawData_element.classList.toggle('selected');
  updateChartLabels();
});

visible_filter_element.addEventListener('click', function() {
  visible_filter_element.classList.toggle('selected');
  //document.getElementById('visibleFilter_rangeContainer').classList.toggle("active");
  updateChartLabels();
  console.log("Clicked visible_filter");
});

infrared_filter_element.addEventListener('click', function() {
  infrared_filter_element.classList.toggle('selected');
  updateChartLabels();
});

connectDevice.addEventListener('click', function() {
  requestSerialPort();
});


// const reader = port.readable.getReader();

//   // Listen to data coming from the serial device.
//   while (true) {
//     const { value, done } = await reader.read();
//     if (done) {
//       // Allow the serial port to be closed later.
//       reader.releaseLock();
//       break;
//     }
//     // value is a Uint8Array.
//     console.log(value);
//   }
//   readIncomingData();
  
//** SERIAL PORT FUNCTIONALITY */
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName);      // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
})
//await port.open({ baudRate: 9600 });
navigator.serial.addEventListener('connect', (e) => {
  // Connect to `e.target` or add it to a list of available ports.
  console.log("CONNECT TO PORT: " + e);
});

navigator.serial.addEventListener('disconnect', (e) => {
  // Remove `e.target` from the list of available ports.
  console.log("DISCONNECT TO PORT: " + e);
});

navigator.serial.getPorts().then((ports) => {
  // Initialize the list of available ports with `ports` on page load.
});

// visible_filter_range.addEventListener("change", function(e){
//   //step = visible_filter_range.value;
//   //console.log(speedSlider.value);
// });