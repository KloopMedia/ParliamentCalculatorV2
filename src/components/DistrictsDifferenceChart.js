import React from 'react';
import ReactEcharts from "echarts-for-react";
import 'echarts-gl';

import matchParty from '../util/partyMathching'

const DistrictsDifferenceChart = (props) =>  {

    if (typeof(props.chartData.diff) === 'undefined' || typeof(props.chartData.base) === 'undefined'){
        return(<div></div>)
    }

    console.log('DRAW DIFF')
    console.log(typeof(props.chartData.diff) === undefined)

    let labelRight = {position: 'right'}
    let labelLeft = {position: 'left'}

    let itemStyleRed = {color: '#e76f51'}
    let itemStyleGreen = {color: '#2a9d8f'}

    let tooltipDataBase = props.chartData.base
    let totalBase = tooltipDataBase['total']

    let tooltipData = props.chartData.diff
    let total = tooltipData['total']

    let xData = []
    let yData = []

    Object.keys(tooltipDataBase).map(party => {
        let partyData = {}

        if(party == 'total'){
            return
        }

        xData.unshift(matchParty(party))

        let basePercent = (tooltipDataBase[party] / totalBase * 100).toFixed(2)
        let diffPercent = (tooltipData[party] / total * 100).toFixed(2)

        let percentDiff = (diffPercent - basePercent).toFixed(2)
        partyData['value']  = percentDiff

        if (percentDiff <= 0){
            partyData['label'] = labelLeft
            partyData['itemStyle']  = itemStyleRed
        }else{
            partyData['label'] = labelRight
            partyData['itemStyle']  = itemStyleGreen
        }

        yData.unshift(partyData)     
        
    })

    let option = {
        title: {
            text: props.chartData.district,
            subtext: 'Разница в процентах между результатами "ДО" и "ПОСЛЕ"'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {     
                type: 'shadow'       
            }
        },
        grid: {
            top: 80,
            bottom: 30
        },
        xAxis: {
            type: 'value',
            position: 'top',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'category',
            axisLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data: xData
        },
        series: [
            {
                name: 'Разница',
                type: 'bar',
                stack: 'b',
                label: {
                    show: true,
                    formatter: '{b}'
                },
                data: yData
            }
        ]
    }        

    return (    
        
        <ReactEcharts
                option={option}
            />                  
    ); 
}


export default DistrictsDifferenceChart

