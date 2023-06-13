// Use the D3 library to read JSON file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function buildCharts(sample) {

 // Use `d3.json` to fetch the sample data for the plots
 const dataPromise = d3.json(url);
 console.log("Data Promise: ", dataPromise);
 // Fetch the JSON data and console log it
 d3.json(url).then((data) => {

  let samples = data.samples 
  let resultsarray= samples.filter(object => 
      object.id == sample);
  let result= resultsarray[0]

  let ids = result.otu_ids;
  let labels = result.otu_labels;
  let values = result.sample_values;

   //Build a BAR Chart

  let bar_data =[
    {
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];

  let barLayout = {
    title: "Top 10 OTUs found ",
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", bar_data, barLayout);


   // Build a BUBBLE Chart 


  let LayoutBubble = {
    margin: { t: 0 },
    xaxis: { title: "OTU ID" },
    hovermode: "closest",
    };

    let DataBubble = [ 
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];

  Plotly.newPlot("bubble", DataBubble, LayoutBubble);

});
}
 

// build a function to show Panel based on Metadata;
function buildMetadata(sample) {
   // Fetch the JSON data and console log it
   d3.json(url).then((data) => {
      let metadata= data.metadata;
      let resultsarray= metadata.filter(object => 
        object.id == sample);
      let result= resultsarray[0]
      let panel = d3.select("#sample-metadata");
      // .html will refresh the panel each time we seclect different id 
      panel.html("");
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h5").text(`${key}: ${value}`);
      });
  
    
  
  
  
    });
  }


  function init() {
    // Grab a reference to the dropdown select element
    let dropdownMenu = d3.select("#selDataset");
    
    // build the dropdown menu
    d3.json(url).then((data) => {
      let sampleNames = data.names;
      sampleNames.forEach((sample) => {
        dropdownMenu
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    
// Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
    }
    

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}



// Initialize the dashboard
init();




