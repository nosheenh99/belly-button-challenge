d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
    console.log(data);

    // Initialize the dashboard
    init(data);

}).catch(error => {
    console.error('Error fetching the JSON data:', error);
});


function init(data) {
    // Call the function to build the bar chart for the first sample when the page loads
    buildBarChart('940', data); // Pass data as a second argument

    // Populate the dropdown menu with the sample IDs
    var dropdownMenu = d3.select("#selDataset");
    data.names.forEach(name => {
        dropdownMenu.append("option").text(name).property("value", name);
    });

    // Call the function to build the bubble chart for the first sample when the page loads
    buildBubbleChart('940', data);

    // Call the function to build the metadata panel for the first sample when the page loads
    buildMetadataPanel('940', data);

    // Call the function to build the gauge chart for the first sample when the page loads
    buildGaugeChart('940', data);
}


function buildBarChart(sample, data) {
    // Get the data for the selected sample
    var sampleData = data.samples.filter(obj => obj.id == sample)[0];

    // Sort the data by sample_values in descending order and slice to get the top 10 values
    var sortedData = sampleData.sample_values.sort((a, b) => b - a);
    var topSampleValues = sortedData.slice(0, 10);

    // Get the top 10 otu_ids and otu_labels
    var topOtuIds = sampleData.otu_ids.slice(0, 10);
    var topOtuLabels = sampleData.otu_labels.slice(0, 10);

    // Create a trace for the bar chart
    var trace = {
        x: topSampleValues,
        y: topOtuIds.map(id => `OTU ${id}`),
        text: topOtuLabels,
        type: "bar",
        orientation: "h"
    };

    // Create the data array for the plot
    var data = [trace];

    // Define the plot layout
    var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };

    // Plot the bar chart
    Plotly.newPlot("bar", data, layout);
}


function buildBubbleChart(sample, data) {
    // Get the data for the selected sample
    var sampleData = data.samples.filter(obj => obj.id == sample)[0];

    // Create a trace for the bubble chart
    var trace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: 'markers',
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids,
            colorscale: 'Earth'
        }
    };

    // Create the data array for the plot
    var data = [trace];

    // Define the plot layout
    var layout = {
        title: 'Bacteria Cultures per Sample',
        xaxis: { title: 'OTU ID' },
        hovermode: 'closest'
    };

    // Plot the bubble chart
    Plotly.newPlot('bubble', data, layout);
}


function buildMetadataPanel(sample, data) {
    // Get the metadata for the selected sample
    var metadata = data.metadata.filter(obj => obj.id == sample)[0];

    // Select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // clear existing metadata
    panel.html("");

    // Add each key and value pair to the panel
    Object.entries(metadata).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
    });
}


function buildGaugeChart(sample, data) {
    // Get the metadata for the selected sample
    var metadata = data.metadata.filter(obj => obj.id == sample)[0];

    // Get the washing frequency of the selected sample
    var wfreq = metadata.wfreq;

    // Create the data array for the plot
    var data = [
        {
            type: "indicator",
            mode: "gauge",
            value: wfreq,
            title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: { size: 24 } },
            gauge: {
                axis: {
                    range: [null, 9],
                    tickvals: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5],
                    ticktext: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
                    tickwidth: 1,
                    tickcolor: "darkgreen"
                },
                bar: { color: "transparent" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 1], color: "#ccffcc" },
                    { range: [1, 2], color: "#b3ffb3" },
                    { range: [2, 3], color: "#99ff99" },
                    { range: [3, 4], color: "#80ff80" },
                    { range: [4, 5], color: "#66ff66" },
                    { range: [5, 6], color: "#4dff4d" },
                    { range: [6, 7], color: "#33cc33" },
                    { range: [7, 8], color: "#269926" },
                    { range: [8, 9], color: "#1a661a" }
                ]
            }
        }
    ];

    // Define the plot layout
    var layout = {
        width: 500,
        height: 400,
        margin: { t: 0, b: 0 },
        annotations: [
            {
                x: 0.5,
                y: 0.4,
                text: wfreq.toString(),
                showarrow: false,
                font: {
                    size: 30,
                    color: '850000'
                }
            }
        ],
    };

    // Plot the gauge chart
    Plotly.newPlot('gauge', data, layout);
}


function optionChanged(newSample) {
    // Build the bar chart for the newly selected sample
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        buildBarChart(newSample, data);
    });

    // Build the bubble chart for the newly selected sample
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        buildBubbleChart(newSample, data);
    });

    // Build the metadata panel for the newly selected sample
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        buildMetadataPanel(newSample, data);
    });

    // Build the metadata panel for the newly selected sample
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        buildGaugeChart(newSample, data)
    });
}
