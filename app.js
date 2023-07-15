// Author: AO
// Date: 2021-07-11
// Version: 1.0
// Homework Dataviz bootamp Ch 14

// Point to the data file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


//use d3 to read the json file
d3.json(url).then(function(data) {
  console.log(data);
});

// calling DashBoard Function
function buildDash() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // this is causing me fits..... stuck on this for a week.. what am I doing wrong here??
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample_one = names[0];

        // remember to change all these to sample_one - match the rubrics and instructions
        //reading this to the consule to see if it's working..
        console.log(sample_one);

        // Build the initial plots
        buildMeta(sample_one);
        buildBar(sample_one);
        buildBubble(sample_one);
        //buildGaugeChart(sample_one);
        //may get to this it's extra non-credit one. 

    });
};

// this function used to add meta info
function buildMeta(sample) {

    // Use D3 to retrieve all of the data i think this is dup since we did up there.. Shaun question
    // am i looping multiple times hereneedlessesly... I think i am...
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        //  show in log(consule) meta so I can make sure it's working in console
        console.log(value)

        // slice into the first index from the array
        let valueData = value[0];

        // Clear out meta values this was done in class in two of the examples.  
        d3.select("#sample-metadata").html("");

        // Use Object.entries, this came from Shaun's pre class talk. adds each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // show in log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function buildBar(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // get sample data
        let sampleInfo = data.samples;

        //  sample filter
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // checking to see if data is right in console
        console.log(otu_ids,otu_labels,sample_values);

        // top 10 values per req 2 doing arrow and map here from class 3 on this.  stu examples
        let y = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let x = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // trace for the bar chart  h= is horizontal in setting , screwed that up for an hour.
        let trace = {
            x: x,
            y: y,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function buildBubble(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // sample filter
        let value = sampleInfo.filter(result => result.id == sample);

        // slice first value in array`
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to build bubble baby
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// This function will update dashboard when diff sample is selected in dropdown.. or I hope so.
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all charts 
    buildBubble(value);
    buildBarChart(value);
    buildMeta(value);

    //extra no extra credit..... see if I have time to do this...
    buildGaugeChart(value);
};

// Call the initialize function
buildDash();
