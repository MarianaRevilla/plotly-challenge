// 1. Read necessary data in the samples.json file: 
d3.json("./samples.json").then(function(data)  {
    let samples = data.samples;
    let metadata = data.metadata;
  
// 2. Create charts for the first Subject ID: 
BarPlot(samples.slice(0,1));
BubbleChart(samples.slice(0,1));
buildMetadata(metadata.slice(0,1)); 

// 3. Function to build the metadata panel: 
function buildMetadata(metadata) {
        // Select the panel using D3: 
        let PANEL = d3.select("#sample-metadata");
        // Clear any previous data:
        PANEL.html("");
        // Append data: 
        Object.entries(metadata[0]).forEach(([key, value]) => 
          PANEL.append("div").text(`${key.toUpperCase()}: ${value}`);
        
    }
  
// 4. Bar Plot:   
function BarPlot(samples) { 
// Select info for the graphs: 
let sample_values = samples[0].sample_values.slice(0,10).reverse();
let otu_labels1 = samples[0].otu_labels.slice(0,10);
// Get top 10 OTU then reverse them:
let otu_top = (samples[0].otu_ids.slice(0, 10)).reverse();
// Get top 10 OTU ids:
let otu_ids = otu_top.map(d => "OTU " + d);
// Get top 10 OTU labels:
let otu_labels = samples[0].otu_labels.slice(0,10);
// Trace for the bar plot: 
let trace = {
    x: sample_values,
    y: otu_ids,
    text: otu_labels1,
    color: "blue",
    type:"bar",
    orientation: "h",
  };
// Data variable for the bar plot: 
let data = [trace];
// Layout variable for the bar plot:
  let layout = {
    title: "Top OTU found",
    height: 600,
    width: 800,
  };
// Create the bar plot: 
Plotly.newPlot("bar", data, layout);
}

// 5. Bubble Chart:
function BubbleChart(samples) {
// Trace for the bubble chart: 
let bubbleTrace = {
    x: samples[0].otu_ids,
    y: samples[0].sample_values,
    mode: "markers",
    marker: {
      size: samples[0].sample_values,
      color: samples[0].otu_ids
    },
    text: samples[0].otu_labels
};

// Data variable for the bubble chart: 
let bubbleData = [bubbleTrace];
// Layout variable for the bubble chart: 
let bubbleLayout = {
    xaxis:{title: "OTU ID"},
    height: 600,
    width: 800,
    margin: {
        l: 300,
        r: 10,
        t: 100,
        b: 30
      }
  };
// Create the bubble chart: 
Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
}

// 6. Build the dropdown menu: 
function DropDownMenu(ids) {
    // Reference the dropdown select element:
    let ddMenu = d3.select("#selDataset");
    // Append id information to the dropdown:
      ids.forEach(id => {
        let option = d3.select("#selDataset").append("option");
        option.text(id);
      });
    }
    // Call the function
    DropDownMenu(samples.map(x => x.id));

// 7. Update Bar Plot when an option is selected: 
  function updateBarPlot(selected) {
      // Select info for the graphs:
      let otu_ids = selected[0].otu_ids.slice(0,10).reverse();
      let sample_values = selected[0].sample_values.slice(0,10).reverse();
      let otu_labels = selected[0].otu_labels.slice(0,10).reverse();
      let otu_idss = otu_ids.map(x => "OTU" + x);
      // New data variable for the bar plot: 
      let barUp = {
        x: [sample_values],
        y: [otu_idss],
        text: [otu_labels]
        };
      Plotly.restyle("bar", barUp);
    };
  
  // 8. Update BubbleChart when an option is selected: 
  function updateBubbleChart(selected) {
      // Select info for the graphs: 
      let ids_bubble = selected[0].otu_ids;
      let sample_bubble = selected[0].sample_values;
      let labels_bubble = selected[0].otu_labels;
      // New data variable: 
      let bubbleUp = {
        x: [ids_bubble],
        y: [sample_bubble],
        text: [labels_bubble],
        marker: {
          size: sample_bubble,
          color: ids_bubble
          }
        };
        Plotly.restyle("bubble", bubbleUp);
    };
  
// 9. Change dataset when a different option is selected: 
 d3.selectAll("#selDataset").on("change", optionChanged);
  function optionChanged() {
      // Reference the dropdown select element:
      let dropdownMenu = d3.select("#selDataset");
      let menuID = dropdownMenu.property("value");
      var selected = samples.filter(row => row.id === menuID);
  
      // Update the functions: 
      updateBarPlot(selected);
      updateBubbleChart(selected);
      buildMetadata(selected);
    };
}
});
        
