function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var newData = data.metadata;
        console.log(newData);

        // Filter the data with the sample number 
        var resultArray = newData.filter(item => item.id == sample);
        var result = resultArray[0];
        console.log(result);
        //Use d3 to select the panel
        var panel = d3.select("#sample-metadata");
        //clear existing metadata
        panel.html("");
        //tag each key,value in metadata
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}, ${value}}`);
        });
//         //Build guage chart
        // buildGuage(result.wfreq);
    });
}

function charts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(item => item.id == sample);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

       //Build bubble chart 
       
       var layout = {
           title: "Bacteria Cultures Per Samples",
           margin : {t: 0},
           hovermode: "closest",
           xaxis: {title: "OTU ID"},
           margin: {t:30}
       };

       var trace1 = [ {
           x: otu_ids,
           y: sample_values,
           text: otu_labels,
           mode: "markers",
           marker: {
               size: sample_values,
               color: otu_ids,
               colorscale: "Earth"
           }
       }];

       Plotly.newPlot("bubble", trace1, layout);

       var yticks = otu_ids.slice(0,10).map(items => `OTU ${items}`).reverse();

       var trace2 = [
           {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: "h"
            }
        ];

        var barlayout = {
            title: "Top 10 OTUs found in the individual",
            margin: { t:30, l:150}
        };

        Plotly.newPlot("bar", trace2, barlayout);
    });
}  

    function init() {
        // Grab a reference to the dropdown select element
        var selector = d3.select("#selDataset");
        //use list of names for selection
        d3.json("samples.json").then((data) => {
            var sampleNames = data.names;

            sampleNames.forEach((sample) => {
                selector.append("option")
                .text(sample).property("value", sample);
            });
            //Use the first sample for inital plot
            var initialchart = sampleNames[0];
            charts(initialchart);
            buildMetadata(initialchart);
            });
    }

    //select new data when a new sample is chosen
function optionChanged(newSample){
    charts(newSample);
    buildMetadata(newSample);
    }

    init();