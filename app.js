// Create function for data plotting
function createPlots(id) {
    //read data in with d3
    d3.json("data/samples.json").then((data) => {
        console.log(data)

        // washing frequency variable 
        var wfreq = data.metadata.map(d => d.wfreq)
        // console.log(wfreq)

        // filter samples by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples)

        // top 10
        var sample_values = samples.sample_values.slice(0, 10);
        console.log(sample_values)

        // top 10 otu ids for the plot otu 
        var topTenOTU = samples.otu_ids.slice(0, 10).reverse();

        var otu_ids = topTenOTU.map(d => "OTU " + d)

        // console.log(otu_ids)

        // get labels for top 10
        var otu_labels = samples.otu_labels.slice(0, 10);
        // console.log(otu_labels)

        // set trace var
        var trace = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            marker: {
                color: 'rgb(142,124,195)'
            },
            type: "bar",
            orientation: "h"
        };

        // set data var
        var data = [trace];

        // set layout var
        var layout = {
            title: "Top 10 OTU",
            yaxis: {
                tickmode: "linear"
            },
            margin: {
                left: 100,
                right: 100,
                top: 100,
                bottom: 30
            }
        };

        // create plotly bar chart
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart
        var bubbleLayout = {
            title: "Top 10 OTU ID's",
            xaxis: {
                tilte: "OTU ID"
            },
            height: 600,
            width: 1000
        };

        var bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            marker: {
                size: [sample_values]
            }
        };

        var bubbleData = [bubbleTrace];

        // plot bubble chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        var gaugeData = [{
            domain: {
                x: [0, 1],
                y: [0, 1]
            },
            value: parseFloat(wfreq),
            title: {
                text: `Weekly Washing Frequncy`
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {
                    range: [null, 9]
                },
                steps: [{
                        range: [0, 2],
                        color: "yellow"
                    },
                    {
                        range: [2, 4],
                        color: "cyan"
                    },
                    {
                        range: [4, 6],
                        color: "teal"
                    },
                    {
                        range: [6, 8],
                        color: "lime"
                    },
                    {
                        range: [8, 9],
                        color: "green"
                    },
                ]
            }
        }];

        var gaugeLayout = {
            width: 700,
            height: 600,
            margin: {
                top: 20,
                bottom: 40,
                left: 100,
                right: 100
            }
        };

        // plot gauge plot 
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    });
}

// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("Data/samples.json").then((data) => {

        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    createPlots(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("Data/samples.json").then((data) => {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        createPlots(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();