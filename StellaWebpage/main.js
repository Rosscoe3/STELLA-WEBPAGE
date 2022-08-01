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
let dataTimeIndex = 0;
let animationTime = 1500;

//** HTML ELEMENTS */
let uploadNew = document.getElementById("newFile");
let speedSlider = document.getElementById("myRange");

//** VARIOUS VARIABLES */
var RESOURCE_LOADED = false;
var animPlay = true;
var animWaitFunc;

var visibleStartData = [2.4, 2.6, 2.2, 1.9, 2.0, 1.8];
var infraredStartData = [5.4, 5.0, 5.4, 6.5, 5.0, 4.3];

var visible = [...Array(1)].map(e => Array(1));
var infrared = [...Array(1)].map(e => Array(1));

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

const config = {
  type: 'scatter', 
  data: data, 
  options: {
    radius: 3,
    hitRadius: 30,
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

graphGradients();

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
      if(dataTimeIndex < visible.length - 1)
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
        if(dataTimeIndex < visible.length - 1 && dataTimeIndex > 0)
        {
          dataTimeIndex--;
        }
        else if(dataTimeIndex == visible.length - 1)
        {
          dataTimeIndex--;
        }
        else
        {
          dataTimeIndex = visible.length - 1;
        }
      }
      //** FORWARDS IN TIMELINE */
      else if(!backward)
      {
        if(dataTimeIndex < visible.length - 1)
        {
          dataTimeIndex++;
        }
        else
        {
          dataTimeIndex = 0;
        }
      }
    }
    

    var progress = (dataTimeIndex/(visible.length-1)) * 100;
    document.querySelector(".progress__fill").style.width = progress + "%";
    console.log("PROGRESS: " + progress + " DATA INDEX: " + dataTimeIndex);

    myChart.data.datasets[0].data = [
    {
      x: 450,
      y: visible[dataTimeIndex][0],
    },
    {
      x: 500,
      y: visible[dataTimeIndex][1],
    },
    {
      x: 550,
      y: visible[dataTimeIndex][2],
    },
    {
      x: 570,
      y: visible[dataTimeIndex][3],
    },
    {
      x: 600,
      y: visible[dataTimeIndex][4],
    },
    {
      x: 650,
      y: visible[dataTimeIndex][5],
    },];

    myChart.data.datasets[1].data = [
      {
        x: 610,
        y: infrared[dataTimeIndex][0],
      },
      {
        x: 680,
        y: infrared[dataTimeIndex][1],
      },
      {
        x: 730,
        y: infrared[dataTimeIndex][2],
      },
      {
        x: 760,
        y: infrared[dataTimeIndex][3],
      },
      {
        x: 810,
        y: infrared[dataTimeIndex][4],
      },
      {
        x: 860,
        y: infrared[dataTimeIndex][5],
      },];
    
    myChart.update();

    if(animPlay)
    {
      animWaitFunc = setTimeout(function()
      {
        updateChart();
        console.log(visible[dataTimeIndex]);
        console.log("UPDATE: " + dataTimeIndex);
        
      }, animationTime);
    }
  }
}

function graphGradients()
{
  console.log(myChart.height);
  
  visibleGradient = ctx.createLinearGradient(myChart.width/4, 0, myChart.width/4, 0);
  // visibleGradient.addColorStop(0, "rgba(0, 0, 255, 0.75)");
  // visibleGradient.addColorStop(0.25, "rgba(0, 255, 0, 0.75)");
  // visibleGradient.addColorStop(0.5, "rgba(255, 255, 0, 0.75)");
  visibleGradient.addColorStop(0.75, "rgba(255, 102, 0, 0.75)");
  visibleGradient.addColorStop(1, "rgba(255, 0, 0, 0.75)");
  myChart.data.datasets[0].data.backgroundColor = visibleGradient;
}

document.addEventListener("DOMContentLoaded", initApp);
//** HANDLES THE FILE DROP */
const handleDrop = (e) => {

  if(!RESOURCE_LOADED)
  {
    const dt = e.dataTransfer;
    const files = dt.files;
    const fileArray = [...files];
    document.querySelector('.droparea').classList.toggle("active");
    document.getElementById("chart").classList.toggle("active");
    newFile.classList.toggle("active");
  
    var file = e.dataTransfer.files[0],
        reader = new FileReader();
    
    //** WHEN THE DATA FILE IS LOADED */
    reader.onload = function(event) 
    {
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

      console.log(visible);
      console.log(infrared);

      RESOURCE_LOADED = true;
      updateChart();
    };
  
    //console.log(visible[0][0]);
  
    console.log(file);
    reader.readAsText(file);
  
    //console.log(files); // FileList
    //console.log(fileArray);
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
  console.log("Right Button");
  
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

//** USED TO CONTROL SPEED OF ANIMATION */
speedSlider.addEventListener("change", function(e){
  // Force the string value of the range to a number and then force the 
  // number to have a single decimal
  animationTime = 200 * speedSlider.value;
  console.log(speedSlider.value);
});
