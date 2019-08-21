import ratioData from "./ratio.json"

Chart.defaults.groupableBar = Chart.helpers.clone(Chart.defaults.bar);

var helpers = Chart.helpers;
Chart.controllers.groupableBar = Chart.controllers.bar.extend({
    calculateBarX: function (index, datasetIndex) {
        // position the bars based on the stack index
        var stackIndex = this.getMeta().stackIndex;
        return Chart.controllers.bar.prototype.calculateBarX.apply(this, [index, stackIndex]);
    },

    hideOtherStacks: function (datasetIndex) {
        var meta = this.getMeta();
        var stackIndex = meta.stackIndex;

        this.hiddens = [];
        for (var i = 0; i < datasetIndex; i++) {
            var dsMeta = this.chart.getDatasetMeta(i);
            if (dsMeta.stackIndex !== stackIndex) {
                this.hiddens.push(dsMeta.hidden);
                dsMeta.hidden = true;
            }
        }
    },

    unhideOtherStacks: function (datasetIndex) {
        var meta = this.getMeta();
        var stackIndex = meta.stackIndex;

        for (var i = 0; i < datasetIndex; i++) {
            var dsMeta = this.chart.getDatasetMeta(i);
            if (dsMeta.stackIndex !== stackIndex) {
                dsMeta.hidden = this.hiddens.unshift();
            }
        }
    },

    calculateBarY: function (index, datasetIndex) {
        this.hideOtherStacks(datasetIndex);
        var barY = Chart.controllers.bar.prototype.calculateBarY.apply(this, [index, datasetIndex]);
        this.unhideOtherStacks(datasetIndex);
        return barY;
    },

    calculateBarBase: function (datasetIndex, index) {
        this.hideOtherStacks(datasetIndex);
        var barBase = Chart.controllers.bar.prototype.calculateBarBase.apply(this, [datasetIndex, index]);
        this.unhideOtherStacks(datasetIndex);
        return barBase;
    },

    getBarCount: function () {
        var stacks = [];

        // put the stack index in the dataset meta
        Chart.helpers.each(this.chart.data.datasets, function (dataset, datasetIndex) {
            var meta = this.chart.getDatasetMeta(datasetIndex);
            if (meta.bar && this.chart.isDatasetVisible(datasetIndex)) {
                var stackIndex = stacks.indexOf(dataset.stack);
                if (stackIndex === -1) {
                    stackIndex = stacks.length;
                    stacks.push(dataset.stack);
                }
                meta.stackIndex = stackIndex;
            }
        }, this);

        this.getMeta().stacks = stacks;
        return stacks.length;
    },
});



const dataToDisplay = []

for (let key in ratioData) {
    const dataRender = {}
    dataRender.title = key.replace(" ratio", "");
    dataRender.label = [];

    for (let label in ratioData[key].Male['18-30']) {
        dataRender.label.push(label);
    }

    const dataSets = [];
    for (let gender in ratioData[key]) {
        const data = [];
        for (let age in ratioData[key][gender]) {
            const dataValue = [];
            for (let value in ratioData[key][gender][age]) {
                dataValue.push(ratioData[key][gender][age][value]);
            }
            data.push(dataValue)
        }
        dataSets.push(data)
    }
    dataRender.dataSets = dataSets;
    dataToDisplay.push(dataRender)
}

dataToDisplay.splice(0, 3);
console.log(dataToDisplay);


const colorArr = ["#FF8000", "#FFFF00", "#008000", "#0000FF", "#FF0000", "#4B0082", "#9400D3"]


dataToDisplay.map(item => {
    const { title, label, dataSets } = item;
    const dataset = [];
    let index = 0;
    let labelIndex = 0;
    console.log (title)
    for (let labelName of label) {
        const maleSet = {
            label: labelName,
            backgroundColor: colorArr[index],
            stack: 1
        }
        const data = []
        for (let arr of dataSets[0]){
            data.push(arr[labelIndex]);
        }
        dataset.push({ ...maleSet, data })
        labelIndex++;
        index++;
    }

     index = 0;
     labelIndex = 0;
    for (let labelName of label) {
        const femaleSet = {
            label: labelName,
            backgroundColor: colorArr[index],
            stack: 2
        }
        const data = []
        for (let arr of dataSets[1]){
            data.push(arr[labelIndex]);
        }
        dataset.push({ ...femaleSet, data })
        labelIndex++;
        index++;
    }
    console.log(dataset)
    const data = {
        labels: [["Male \t\t      Female","18-30"], ["Male \t\t      Female",'31-50'], ["Male \t\t      Female",'51-65'], ["Male \t\t      Female",'Over 65']],
        datasets: dataset
    }
    var ctxPoiter = document.createElement("canvas");
    var ctx = ctxPoiter.getContext("2d");
    new Chart(ctx, {
        type: 'groupableBar',
        data: data,
        options: {
            legend: {
                labels: {
                    generateLabels: function (chart) {
                        const length = Chart.defaults.global.legend.labels.generateLabels.apply(this, [chart]).length;
                        return Chart.defaults.global.legend.labels.generateLabels.apply(this, [chart]).filter(function (item, i) {
                            return i <length/2;
                        });
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 40,
                    },
                    stacked: true,
                }]
            },
            title: {
                display: true,
                text: title
            }
        }
    });
    document.getElementById("myChart").appendChild(ctxPoiter)
})


