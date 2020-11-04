import React from 'react'

import * as Highcharts from 'highcharts';
import ItemSeriesModule from 'highcharts/modules/item-series';
import HighchartsReact from 'highcharts-react-official'

ItemSeriesModule(Highcharts);

const generateChartData = (chartData, title) => {

    console.log('DRAW CHART')
    console.log(chartData)
    const options = {

        chart: {
            type: 'item'
        },
    
        title: {
            text: title
        },
    
        subtitle: {
            text: 'Жогорку Кенеш'
        },
    
        legend: {
            labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
        },
    
        series: [{
            name: 'Депутатов',
            keys: ['name', 'y', 'color', 'label'],
            data: chartData,
            dataLabels: {
                enabled: true,
                format: '{point.label}'
            },
    
            // Circular options
            center: ['50%', '88%'],
            size: '170%',
            startAngle: -100,
            endAngle: 100
        }]
    }

    return options
}

const ParlamentChart = (props) => <HighchartsReact
  containerProps={{ style: { width: "100%", height: '100%' } }}
  highcharts={Highcharts}
  constructorType={'chart'}
  options={generateChartData(props.chartData, props.title)}
/>

const areEqual = (prevProps, nextProps) => {
    return (prevProps.chartData === nextProps.chartData)
    }

export default React.memo(ParlamentChart, areEqual);
  
//export default ParlamentChart