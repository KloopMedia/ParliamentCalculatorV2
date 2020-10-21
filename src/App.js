
import React, { useState } from "react";

import './App.css';

import electionsConfig from './electionsConfig'
import Parties from './components/Parties'
import { Grid, Typography } from '@material-ui/core';

import FormTwoChart from './components/FormTwoChart'
import CutoffSlider from './components/CutoffSlider'

import Map from './components/RegionsMap'
import ReactTooltip from "react-tooltip";

import DistrictsDifferenceChart from './components/DistrictsDifferenceChart'

import matchParty, {matchPartyForMap} from './util/partyMathching'
import {districts, matchDistrictShow, matchDistrict} from './util/districtsMatching'

import TextField from '@material-ui/core/TextField';

import * as d3 from 'd3'

class App extends React.Component {

  constructor(props) {
    super(props);

    let defaultState = {}

    defaultState.percentsLeft=100
    defaultState.againstAllReached = false
    defaultState.onlyOnePartyPassed = false

    defaultState.dataForChartDifference = {}

    defaultState.content = ''
    //const [content, setContent] = useState("");

    //Form2 state
    this.voteResults = []
    this.cutoff = 0

    let parties = {}
    let partiesBase = {}
    electionsConfig.parties.map((value) => {

        let partyInfo = {}

        partyInfo.voteResult = 0
        partyInfo.parlamentResultChairs = 0
        partyInfo.parlamentResultPercents = 0
        partyInfo.residual = 0
        partyInfo.monopolyResidual = 0
        partyInfo.message = ''

        parties[value]=partyInfo
    })

    electionsConfig.parties.map((value) => {

        let partyInfo = {}

        partyInfo.voteResult = 0
        partyInfo.parlamentResultChairs = 0
        partyInfo.parlamentResultPercents = 0
        partyInfo.residual = 0
        partyInfo.monopolyResidual = 0
        partyInfo.message = ''

        partiesBase[value]=partyInfo
    })

    defaultState.parties = parties
    defaultState.partiesBase = partiesBase

    this.state = defaultState;
    this.showCompareChart = false

    this.resultsDataDisctricts = {}
    this.resultsSummaryDistrictsBase = {}

    this.UIKtotal = 0
    this.UIKleft = 0
    this.UIKcutted = 0
  }    

  componentDidMount() { 
        
    //Костыль
    if(this.state.partiesBase['Биримдик'].voteResult == 0){
        this.loadElectionsResultsData() 
    }                       
  }

  loadElectionsResultsData = () => {
    d3.csv(require('./data/PARTIES_RESULTS_REACT_LEVEL_ONE.csv')).then(data => {
        data.forEach(function(d) {
            d.form2_percent = parseFloat(d.form2_percent)
            d.total = parseFloat(d.total)
            //d.uic_number= parseFloat(d.uic_number)
            d['«АТА МЕКЕН» саясий социалисттик партиясы'] = parseFloat(d['«АТА МЕКЕН» саясий социалисттик партиясы'])
            d['«АФГАНИСТАН СОГУШУНУН АРДАГЕРЛЕРИ ЖАНА УШУЛ СЫЯКТУУ КАГЫШУУЛАРГА КАТЫШКАНДАРДЫН САЯСИЙ ПАРТИЯСЫ»'] = parseFloat(d['«АФГАНИСТАН СОГУШУНУН АРДАГЕРЛЕРИ ЖАНА УШУЛ СЫЯКТУУ КАГЫШУУЛАРГА КАТЫШКАНДАРДЫН САЯСИЙ ПАРТИЯСЫ»'])
            d['«БИР БОЛ»'] = parseFloat(d['«БИР БОЛ»']) 
            d['«БИРИМДИК»'] = parseFloat(d['«БИРИМДИК»'])
            d['«БҮТҮН КЫРГЫЗСТАН» саясий партиясы'] = parseFloat(d['«БҮТҮН КЫРГЫЗСТАН» саясий партиясы'])
            d['«ЗАМАНДАШ»'] = parseFloat(d['«ЗАМАНДАШ»'])
            d['«КЫРГЫЗСТАН»'] = parseFloat(d['«КЫРГЫЗСТАН»'])
            d['«МЕКЕН ЫНТЫМАГЫ»'] = parseFloat(d['«МЕКЕН ЫНТЫМАГЫ»'])
            d['«МЕКЕНИМ КЫРГЫЗСТАН»'] = parseFloat(d['«МЕКЕНИМ КЫРГЫЗСТАН»'])
            d['«МЕКЕНЧИЛ»'] = parseFloat(d['«МЕКЕНЧИЛ»'])
            d['«ОРДО»'] = parseFloat(d['«ОРДО»'])
            d['«РЕФОРМА» партиясы'] = parseFloat(d['«РЕФОРМА» партиясы'])
            d['«ЧОҢ КАЗАТ»'] = parseFloat(d['«ЧОҢ КАЗАТ»'])
            d['«ЫЙМАН НУРУ»'] = parseFloat(d['«ЫЙМАН НУРУ»'])
            d['БААРЫНА КАРШЫ'] =  parseFloat(d['БААРЫНА КАРШЫ'])
            d['РЕСПУБЛИКА'] = parseFloat(d['РЕСПУБЛИКА'])
            d['СОЦИАЛ-ДЕМОКРАТТАР'] = parseFloat(d['СОЦИАЛ-ДЕМОКРАТТАР'])
            });

        return data                 
        
        }).then((resultsData) => {

        console.log('TOTAL DATA')
        console.log(resultsData.length)
        this.UIKtotal = resultsData.length

        if(typeof(resultsData) !== undefined){

            this.voteResults = resultsData

            let resultsSummary = {}

            resultsData.forEach(result => {
                Object.keys(result).map((key) => {

                    if (resultsSummary.hasOwnProperty(key)){
                        resultsSummary[key] += result[key]
                    }else{
                        resultsSummary[key] = result[key]
                    }            
                })  

            }) 
            
            const parties = {...this.state.partiesBase}

            Object.keys(resultsSummary).map((key) => {

                if (parties.hasOwnProperty(matchParty([key]))){

                    parties[matchParty([key])].voteResult = resultsSummary[key] / resultsSummary.total * 100   
                    
                }  
            })  

            this.setState( {partiesBase: parties} )

            //Percents left
            this.calculateResults('partiesBase')

            //Для карты районов
            let resultsDataDisctrictsBase = {}
            Object.entries(districts).forEach(([key, value]) => {

                let partySum = {}

                let filteredDistrict = resultsData.filter(function(result) {                    
                    return result.level_one == value;
                });

                //Суммируем по партиями
                filteredDistrict.forEach(result => {
                    Object.keys(result).map((keyFiltered) => {
    
                        if(keyFiltered !== 'form2_percent' && keyFiltered !== 'level_one'){
                        if (partySum.hasOwnProperty(keyFiltered)){
                            partySum[keyFiltered] += result[keyFiltered]
                        }else{
                            partySum[keyFiltered] = result[keyFiltered]
                        }          
                        }  
                    })      
                })     

                resultsDataDisctrictsBase[key] = partySum
            })

            this.resultsDataDisctrictsBase = resultsDataDisctrictsBase
            
        }                  
    });                      
  }

  createTooltipTable = () => {

    // console.log('CREATE TOOLTIP')
    // console.log(this.state.content)
    // console.log(this.resultsDataDisctricts)
    // console.log(this.resultsDataDisctrictsBase)

    if(this.state.content === ''){
        console.log('BUG')
        return (<a
                    
            ></a>)
    }

    if(Object.keys(this.resultsDataDisctricts).length == 0){
        let tooltipData = this.resultsDataDisctrictsBase[this.state.content] 
        let total = tooltipData['total']
        //delete tooltipData['total']

        return (<a
                        
                >                   
                    <h3>{this.state.content}</h3>
        
                    <table style={{width:'100%', borderCollapse: 'collapse'}}>
                    <tr>
                    <th>Партия</th>
                    <th>Процент</th>
                    </tr>

                    {Object.keys(tooltipData).map(party => (
                        <tr>
                        <td>{matchPartyForMap(party)}</td>
                        <td>{(tooltipData[party] / total * 100).toFixed(2) + '%'} </td>
                        </tr>
                    ))}
                    
                </table>
        
            </a>)

    }else{

        // console.log('DIFF')
        let tooltipDataBase = this.resultsDataDisctrictsBase[this.state.content] 
        let totalBase = tooltipDataBase['total']

        let tooltipData = this.resultsDataDisctricts[this.state.content] 
        let total = tooltipData['total']
        //delete tooltipData['total']
        return (<a
                    
            >                   
                <h3>{this.state.content}</h3>
    
                <table style={{width:'100%', borderCollapse: 'collapse'}}>
                <tr>
                <th>Партия</th>
                <th>ДО</th>
                <th>ПОСЛЕ</th>
                </tr>

                {Object.keys(tooltipDataBase).map(party => (
                    <tr>
                    <td>{matchPartyForMap(party)}</td>
                    <td>{(tooltipDataBase[party] / totalBase * 100).toFixed(2) + '%'} </td>
                    <td>{(tooltipData[party] / total * 100).toFixed(2) + '%'} </td>
                    </tr>
                ))}
                
            </table>
    
        </a>)
        
    }        
}

handleContentTooltip = (content) => {
    this.setState({content: content})
}


setCutoff = (event, value) => {
    // //console.log(event.target.ariaValueNow)
    // console.log('EVENT')
    // console.log(event)

    if(this.cutoff != value){
            

        //Фильтр
        let filteredResults = this.voteResults.filter(function(result) {
            return result.form2_percent < value;
        });

        this.UIKleft = filteredResults.length
        this.UIKcutted = this.UIKtotal - this.UIKleft

        console.log("TEST UIK")
        console.log(this.UIKtotal)
        console.log(this.UIKleft)
        console.log(this.UIKcutted)

        let resultsSummary = {}
        let resultsSummaryDistricts = {}

        //Для графика распределения
        filteredResults.forEach(result => {
            Object.keys(result).map((key) => {

                if (resultsSummary.hasOwnProperty(key)){
                    resultsSummary[key] += result[key]
                }else{
                    resultsSummary[key] = result[key]
                }            
            })  

        })         

        // console.log(filteredResults)

        //Для карты районов
        Object.entries(districts).forEach(([key, value]) => {

            let partySum = {}

            // console.log('FILTER')

            // console.log(key)
            // console.log(value)

            let filteredDistrict = filteredResults.filter(function(result) {                    
                return result.level_one == value;
            });

            //Суммируем по партиями
            filteredDistrict.forEach(result => {
                Object.keys(result).map((keyFiltered) => {

                    if(keyFiltered !== 'form2_percent' && keyFiltered !== 'level_one'){
                        if (partySum.hasOwnProperty(keyFiltered)){
                            partySum[keyFiltered] += result[keyFiltered]
                        }else{
                            partySum[keyFiltered] = result[keyFiltered]
                        }          
                    }  
                })      
            })     

            // console.log('FILTER RESULTS')
            // console.log(partySum)
            // console.log(filteredDistrict)

            resultsSummaryDistricts[key] = partySum
        })


        // console.log('RESULT SUMMARY')
        // console.log(resultsSummary)
        // console.log(resultsSummaryDistricts)

        this.showCompareChart = true
        const parties = {...this.state.parties}

        // console.log('CLICK')
        // console.log(parties)

        //График распределения
        Object.keys(resultsSummary).map((key) => {

            if (parties.hasOwnProperty(matchParty([key]))){
                parties[matchParty([key])].voteResult = resultsSummary[key] / resultsSummary.total * 100                   
            }  
        })  

        if (this.state.parties !== parties){
            this.setState( {parties: parties} )

            //Percents left
            this.calculateResults('parties')
        }

        //Карта
        //Для карты районов
        this.resultsDataDisctricts = resultsSummaryDistricts 

        //Разница
        this.handeOnDistrictClick({ADM1_RU: this.state.content})
    }

}

sortProperties(obj, sortedBy, isNumericSort, reverse) {
    sortedBy = sortedBy || 1; // by default first key
    isNumericSort = isNumericSort || false; // by default text sort
    reverse = reverse || false; // by default no reverse

    var reversed = (reverse) ? -1 : 1;

    var sortable = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            sortable.push([key, obj[key]]);
        }
    }
    if (isNumericSort)
        sortable.sort(function (a, b) {
            return reversed * (a[1][sortedBy] - b[1][sortedBy]);
        });
    else
        sortable.sort(function (a, b) {
            var x = a[1][sortedBy],
                y = b[1][sortedBy];
            return x < y ? reversed * -1 : x > y ? reversed : 0;
        });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

calculateResults = (partiesSet) => {

    let percentSum = 0
    let totalPassedParlamentPercent = 0
    let totalChairs = 0 

    let stateParties = this.state[partiesSet]

    Object.keys(stateParties).map((party) => {

        let voteResult = stateParties[party].voteResult
        percentSum = percentSum + voteResult

        if (voteResult >= electionsConfig.cutoff && party != 'Против всех'){
            totalPassedParlamentPercent = totalPassedParlamentPercent + voteResult     
        }

     })     
     
    let percentsLeft = Number(100 - percentSum).toFixed(2)
    this.setState( {percentsLeft: percentsLeft} )

    const parties = {...stateParties} 

    if (percentsLeft == 0) {                     

        Object.keys(stateParties).map((party) => {

            let voteResult = stateParties[party].voteResult    

            let parlamentResultPercents = 0  
            let parlamentResultChairsFloat = 0
            let parlamentResultChairs = 0 
            let message = electionsConfig.cutoff_message + ' ' + electionsConfig.cutoff + '%'

            if (voteResult >= electionsConfig.cutoff && party != 'Против всех'){
                parlamentResultPercents = voteResult * 100 / totalPassedParlamentPercent  
                parlamentResultChairsFloat = electionsConfig.totalChairs * parlamentResultPercents / 100 
                parlamentResultChairs = Math.floor(electionsConfig.totalChairs * parlamentResultPercents / 100)
                message = ''
            } 

            parties[party].parlamentResultPercents = parlamentResultPercents
            parties[party].parlamentResultChairs = parlamentResultChairs
            parties[party].residual = (parlamentResultChairsFloat - parlamentResultChairs).toFixed(2)
            parties[party].message = message

            totalChairs = totalChairs + parlamentResultChairs
        })  
        
        //Распределить мандаты если остались после первичного распределения
        if (totalChairs != electionsConfig.totalChairs){

            let sortedParties = this.sortProperties(parties, 'residual', true, true)

            let distributeLeft = electionsConfig.totalChairs - totalChairs

            sortedParties.forEach(function (item) {

                if (distributeLeft > 0){
                    parties[item[0]].parlamentResultChairs += 1 
                    distributeLeft -= 1
                }
              });
        }

        //Если одна партия набирает больше 65 голосов
        let monopolyParty = ''
        let isMonopoly = false
        let monopolyChairs = 0
        let monopolyPercent = 0
        
        Object.keys(stateParties).map((party) => {
            if (parties[party].parlamentResultChairs > electionsConfig.maxChairsForParty) {
                isMonopoly = true
                monopolyParty = party
                monopolyChairs = parties[party].parlamentResultChairs
                monopolyPercent = parties[party].voteResult 
            }

        })

        if (isMonopoly){

            totalChairs = 0
            Object.keys(stateParties).map((party) => {

                let voteResult = parties[party].voteResult    

                if (voteResult >= electionsConfig.cutoff && party != 'Против всех' ){
                    if (party == monopolyParty){
                        parties[party].parlamentResultChairs = electionsConfig.maxChairsForParty
                    }else{  

                        let parlamentResultPercents = voteResult * 100 / (totalPassedParlamentPercent - monopolyPercent)  
                        
                        parties[party].monopolyResidual =  (((monopolyChairs-electionsConfig.maxChairsForParty) * parlamentResultPercents / 100) - (Math.floor((monopolyChairs-electionsConfig.maxChairsForParty) * parlamentResultPercents / 100))).toFixed(2)
                        parties[party].parlamentResultChairs += Math.floor((monopolyChairs-electionsConfig.maxChairsForParty) * parlamentResultPercents / 100)
                    }

                    totalChairs = totalChairs + parties[party].parlamentResultChairs
                }    
            })  
            
             //Распределить мандаты если остались после первичного распределения (если Монополия)
            if (totalChairs != electionsConfig.totalChairs){                    

                let sortedParties = this.sortProperties(parties, 'monopolyResidual', true, true)

                let distributeLeft = electionsConfig.totalChairs - totalChairs

                sortedParties.forEach(function (item) {                        

                    if (distributeLeft > 0){
                        if (item[0] != monopolyParty){
                            parties[item[0]].parlamentResultChairs += 1 
                            distributeLeft -= 1
                        }                            
                    }
                });
            }

            //Проверить если одна только партия прошла барьер
            let passCounter = 0   
            let onlyOnePartyPassed = false             
            Object.keys(stateParties).map((party) => {
                
                let voteResult = parties[party].voteResult  

                if (voteResult >= electionsConfig.cutoff){
                    passCounter += 1 
                }                    
            })

            if (passCounter < 2){

                onlyOnePartyPassed = true    
                Object.keys(stateParties).map((party) => {
                    parties[party].parlamentResultChairs = 0
                })   

                this.setState( {onlyOnePartyPassed: onlyOnePartyPassed} )
            }
        }

    } else {
        
        Object.keys(stateParties).map((party) => {

            //parties[party].parlamentResultPercents = 0
            parties[party].parlamentResultChairs = 0
            parties[party].residual = 0
            parties[party].monopolyResidual = 0
            parties[party].message = ''
        })             
    }          

    //Против всех
    if (parties['Против всех'].voteResult < electionsConfig.against_all_cutoff)  {

        if ((percentsLeft == 0) && (parties['Против всех'].voteResult > 0)){
            parties['Против всех'].message = electionsConfig.against_all_message                    
        }else {
            parties['Против всех'].message = ''
        }
        this.setState( {againstAllReached: false} )
        
    } else {
        parties['Против всех'].message = ''
        this.setState( {againstAllReached: true} )
    }
    
    if(this.state[partiesSet] !== parties){
        this.setState( {[partiesSet]: parties} )
    }        
}

  handeOnDistrictClick = (geoData) => {
    let tooltipDataBase = this.resultsDataDisctrictsBase[geoData.ADM1_RU] 
    let tooltipData = this.resultsDataDisctricts[geoData.ADM1_RU] 

    console.log('STATE handeOnDistrictClick')
    console.log(geoData.ADM1_RU)
    
    this.setState({dataForChartDifference: {'district': matchDistrictShow(matchDistrict(geoData.ADM1_RU)), 
                                            'base': tooltipDataBase, 
                                            'diff': tooltipData}})
  }

  render () {

    console.log('RENDER APP')

    return (
      <div className="App">     

        {/* <Typography variant="h6">{electionsConfig.distribute_all_votes_message}</Typography> */}

        <FormTwoChart></FormTwoChart>    

        <Grid container justify="center">
            Хотите увидеть что было бы если анулировать результаты голосования на участках с аномальным показателем по Форме2? 
        </Grid>

        <Grid container justify="center">
            Для этого установите бегунок с интересующем Вас процентом
        </Grid>     

        <Grid container justify="center">
            <CutoffSlider cutoffOnChange={this.setCutoff}></CutoffSlider>
        </Grid>

        <div style={{padding: '20px'}} >
          <Grid container justify="center">          
            <Grid style={{width: 120, paddingRight: 5}}>
              <TextField  
                  id='UIK total'
                  value={this.UIKtotal}
                  disabled={true}
                  type ='number'                            
                  label="УИК всего" 
                  variant="outlined"
                  fullWidth
                  inputProps={{style: {fontSize: 14, color: "black", fontWeight: 'bold'}}}
                  InputLabelProps={{style: {fontSize: 14}}}
                  />                
            </Grid>

            <Grid style={{width: 120, paddingRight: 5}}>
              <TextField  
                  id='UIK cutted'
                  value={this.UIKcutted}
                  disabled={true}
                  type ='number'                            
                  label="УИК анулированных" 
                  variant="outlined"
                  fullWidth
                  inputProps={{style: {fontSize: 14, color: "black", fontWeight: 'bold'}}}
                  InputLabelProps={{style: {fontSize: 14}}}
                  />                
            </Grid>

            <Grid style={{width: 120, paddingRight: 5}}>
              <TextField  
                  id='UIK left'
                  value={this.UIKleft}
                  disabled={true}
                  type ='number'                            
                  label="УИК осталось" 
                  variant="outlined"
                  fullWidth
                  inputProps={{style: {fontSize: 14, color: "red", fontWeight: 'bold'}}}
                  InputLabelProps={{style: {fontSize: 14}}}
                  />                
            </Grid>                  
          </Grid>
        </div> 

        <Parties
          parties = {this.state.parties}
          partiesBase = {this.state.partiesBase}
          againstAllReached = {this.state.againstAllReached}
          onlyOnePartyPassed = {this.state.onlyOnePartyPassed} 
          showCompareChart = {this.showCompareChart}     
        >  
        </Parties>

        <Grid container justify="center">
              Для просмотра распределения процентов по областям - наведите на область                
        </Grid>
        <Grid container justify="center">
            <div style={{width: 1000, height: '100%'}}>
                <Map setTooltipContent={this.handleContentTooltip} onDistrictClick={this.handeOnDistrictClick} />        
            </div>                    
        </Grid>

        <ReactTooltip
                type='error'
                // place='top'
                multiline={true}>
                
                <div>

                    {this.createTooltipTable()}

                </div>   
                
        </ReactTooltip>

        <DistrictsDifferenceChart chartData={this.state.dataForChartDifference} ></DistrictsDifferenceChart> 	
      </div>
    );
  }
}

export default App;


