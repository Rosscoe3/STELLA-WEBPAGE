import './style.css'

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `
const ctx = document.getElementById('graph').getContext("2d");
let delayed;

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

//** VARIOUS VARIABLES */
var RESOURCE_LOADED = false;
var animPlay = true;
var animWaitFunc;

var visibleStartData = [2.4, 2.6, 2.2, 1.9, 2.0, 1.8];
var infraredStartData = [5.4, 5.0, 5.4, 6.5, 5.0, 4.3];

var visible = [...Array(1)].map(e => Array(1));
var infrared = [...Array(1)].map(e => Array(1));


//** DATA SETUP FOR CHARTJS */
var data = {
  // labels,
  datasets: [
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
      borderColor: "#fff", 
      pointBackgroundColor: 'rgb(189, 195, 199)',
    },
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
      borderColor: "#fff", 
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
    hitRadius: 20,
    hoverRadius: 8,
    spanGaps: true,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'STELLA'
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

const myChart = new Chart(ctx, config);

//** INITIALIZES DRAG AND DROP */
const initApp = () => {
  const droparea = document.querySelector('.droparea');

  const active = () => droparea.classList.add("green-border");

  const inactive = () => droparea.classList.remove("green-border");

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

function updateChart(backward)
{
  if(RESOURCE_LOADED)
  {
    
    
    if(animPlay)
    {
      if(dataTimeIndex < newDataArray.length - 1)
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
        if(dataTimeIndex < newDataArray.length - 1 && dataTimeIndex > 0)
        {
          dataTimeIndex--;
        }
        else if(dataTimeIndex == newDataArray.length - 1)
        {
          dataTimeIndex--;
        }
        else
        {
          dataTimeIndex = newDataArray.length - 1;
        }
      }
      //** FORWARDS IN TIMELINE */
      else if(!backward)
      {
        if(dataTimeIndex < newDataArray.length - 1)
        {
          dataTimeIndex++;
        }
        else
        {
          dataTimeIndex = 0;
        }
      }
    }
    

    var progress = (dataTimeIndex/(newDataArray.length-1)) * 100;
    document.querySelector(".progress__fill").style.width = progress + "%";
    console.log("PROGRESS: " + progress + " DATA INDEX: " + dataTimeIndex);
    frameNumber.innerHTML = dataTimeIndex + "/" + (visible.length-1);

    myChart.data.datasets[0].data = [
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

    myChart.data.datasets[1].data = [
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

graphGradients();
function graphGradients()
{
  console.log("HEIGHT: " + myChart.height + ", WIDTH: " + myChart.width);
  console.log(myChart.data.datasets[0].backgroundColor);

  visibleGradient = ctx.createLinearGradient(0, 0, myChart.width/2, 0);
  visibleGradient.addColorStop(0.1, "rgba(0, 0, 255, 0.75)");
  visibleGradient.addColorStop(0.25, "rgba(0, 255, 0, 0.75)");
  visibleGradient.addColorStop(0.5, "rgba(255, 255, 0, 0.75)");
  visibleGradient.addColorStop(0.75, "rgba(255, 102, 0, 0.75)");
  visibleGradient.addColorStop(1, "rgba(255, 0, 0, 0.75)");
  
  infraredGradient = ctx.createLinearGradient(0, 0, myChart.width, 0);
  infraredGradient.addColorStop(0, "rgba(255, 0, 0, 1)");
  infraredGradient.addColorStop(1, "rgba(173, 173, 173, 0.75)");
  
  myChart.data.datasets[0].backgroundColor = visibleGradient;
  myChart.data.datasets[1].backgroundColor = infraredGradient;

  myChart.update();
}

document.addEventListener("DOMContentLoaded", initApp);
//** HANDLES THE FILE DROP */
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
      newFile.classList.toggle("active");
      //** WHEN THE DATA FILE IS LOADED */
      reader.onload = function(event) 
      {
        
        newDataArray = csvToArray(reader.result);
        console.log(newDataArray);
        console.log(newDataArray[0].B500_power);
        
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

uploadNew.addEventListener("click", function (ev) 
{
  ev.stopPropagation(); // prevent event from bubbling up to .container
  newFile.classList.toggle("active");
  document.querySelector('.droparea').classList.toggle("active");
  document.getElementById("chart").classList.toggle("active");
  RESOURCE_LOADED = false;
});

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
