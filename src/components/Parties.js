import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { withStyles } from '@material-ui/core/styles';

import electionsConfig from '../electionsConfig'

import ParlamentChart from '../components/ParlamentChart'
import FormTwoChart from '../components/FormTwoChart'
import { Typography } from '@material-ui/core';

import matchParty from '../util/partyMathching'

import * as d3 from 'd3'

//import { d3 } from "d3-scale-chromatic";

const styles = theme => ({
    header: {
        [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
        [theme.breakpoints.up('sm')]: {
        width: '70%',
        },
        [theme.breakpoints.up('md')]: {
        width: '50%',
        },
    },
    redLine: {
        content:'',
        position:"absolute",
        borderBottom:"solid 1px",
        top:"50%",
        color: "red",
        justifyContent: "center",
        [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
        [theme.breakpoints.up('sm')]: {
        width: '80%',
        },
        [theme.breakpoints.up('md')]: {
        width: '70%',
        },
    }
  });

class Parties extends React.Component {

    constructor(props) {
        super(props);

        let defaultState = {}

        defaultState.percentsLeft=100
        defaultState.againstAllReached = false
        defaultState.onlyOnePartyPassed = false

        //Form2 state
        defaultState.voteResults = ''

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
      }    

    componentDidMount() { 
        this.loadElectionsResultsData()               
    }

    loadElectionsResultsData = () => {
        d3.csv(require('../data/PARTIES_RESULTS_REACT.csv')).then(data => {
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

            if(typeof(resultsData) !== undefined){

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

                    // console.log(matchParty([key]))
                    // console.log(event[key])
                    if (parties.hasOwnProperty(matchParty([key]))){

                        parties[matchParty([key])].voteResult = resultsSummary[key] / resultsSummary.total * 100   
                        
                        //console.log(key)
                    }  
                })  

                //console.log(parties)

                this.setState( {partiesBase: parties} )

                //Percents left
                this.calculateResults('partiesBase')
            }                  
        });                      
    }

    handleClickFormTwoChart = (event) => {
        //console.log('HAPPY!')
        //console.log(event)

        this.showCompareChart = true
        const parties = {...this.state.parties}

        //console.log(parties)

        Object.keys(event).map((key) => {

            // console.log(matchParty([key]))
            // console.log(event[key])
            if (parties.hasOwnProperty(matchParty([key]))){

                parties[matchParty([key])].voteResult = event[key] / event.total * 100   
                
                //console.log(key)
            }  
         })  

         //console.log(parties)

        this.setState( {parties: parties} )

        //Percents left
        this.calculateResults('parties')
    }

    voteNumberOnChange = (event) => {

        const party = event.target.id
        const parties = {...this.state.parties}  
        parties[party].voteResult = Number(event.target.value)

        this.setState( {parties: parties} )

        //Percents left
        this.calculateResults('parties')
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
                    //console.log(item[0]);

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
                            // console.log("START MONOPOLY")               
                            // console.log(monopolyChairs)     
                            // console.log(monopolyPercent) 
                            // console.log(voteResult)     
                            
                            let parlamentResultPercents = voteResult * 100 / (totalPassedParlamentPercent - monopolyPercent)  

                            //console.log(Math.floor((monopolyChairs-electionsConfig.maxChairsForParty) * parlamentResultPercents / 100)) 
                            
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

                    //console.log('CHECK');
                    //console.log(distributeLeft);
                    //console.log(sortedParties);

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
        
        this.setState( {[partiesSet]: parties} )
    }

    prepareChartData = (partiesSet) => {

        let chartData = []
        //var colours = d3.scaleOrdinal(d3.schemeCategory10)
	    //.domain(["foo", "bar", "baz", "foobar"]);
  
        //console.log(colours("foobar"))

        let listOfColors = ['#ff4000','#ff8000','#ffbf00','#ffff00','#bfff00','#80ff00','#40ff00','#00ff00','#00ff40','#00ff80','#00ffbf','#00ffff','#00bfff','#0080ff','#0040ff','#0000ff','#4000ff','#8000ff','#bf00ff','#ff00ff','#ff00bf','#ff0080','#ff0040','#ff0000']

        Object.keys(this.state[partiesSet]).map((party) => {

            
            let chairsNumber = this.state[partiesSet][party].parlamentResultChairs

            if (Number(chairsNumber) > 0) {

                let colorParty = ''
                if (party=='Биримдик'){
                    colorParty = '#7cb5ec'
                }else if(party=='Мекеним Кыргызстан'){
                    colorParty = '#434348'
                }else if(party=='Бутун Кыргызстан'){
                    colorParty = '#90ed7d'
                }else if(party=='Кыргызстан'){
                    colorParty = '#f7a35c'
                }else if(party=='Мекенчил'){
                    colorParty = '#ff4000'
                }

                let partyChartInfo = [party, parseInt(chairsNumber), colorParty, party]
                chartData.push(partyChartInfo)              
            } 
                        
        })    
        //console.log(chartData)
        //chartData = [['TEST', 25, '#ffbf00', 'TEST'], ['TEST', 25, '#ffbf00', 'TEST'], ['TEST', 25, '#ffbf00', 'TEST'], ['TEST', 25, '#ffbf00', 'TEST']]
        return chartData
    }


    render() {       

        console.log("STATE RENDER")
        console.log(this.state)

        const isAgainstAllReached = this.state.againstAllReached;
        const onlyOnePartyPassed = this.state.onlyOnePartyPassed;
        const { classes } = this.props;

        //console.log(this.prepareChartData())
        return (
            <div> 
  
                <Grid container justify="center">
                    Хотите увидеть что было бы если анулировать результаты голосования на участках с аномальным показателем по Форме2? 
                </Grid>

                <Grid container justify="center">
                    Для этого нажмите на колонку из графика с интересующим Вас пороговым процентом
                </Grid>

                <FormTwoChart 
                    clickOnBar={this.handleClickFormTwoChart}>
                </FormTwoChart>                

                <Grid container justify="center">
                    {this.state.percentsLeft == 0
                        ? <ParlamentChart 
                            chartData={this.prepareChartData('partiesBase')}
                            title='Распределение мест ДО'>

                        </ParlamentChart>
                        : <b>Для отображения графика распределения мест необходимо полностью распределить проценты голосов</b>
                    }

                    {this.showCompareChart
                        ? <ParlamentChart 
                            chartData={this.prepareChartData('parties')}
                            title='Распределение мест ПОСЛЕ'
                            >

                        </ParlamentChart>
                        : <div></div>
                    }
                </Grid>

                <Typography variant="body1">Осталось распределить: {this.state.percentsLeft}</Typography>                

                <b>{isAgainstAllReached ? electionsConfig.against_all_reached_message : ''}</b>

                <b>{onlyOnePartyPassed ? electionsConfig.one_party_cutoff_only_message : ''}</b>

                <List dense className={'Parties'}>
                {electionsConfig.parties.map((value) => {
                    const labelId = `label-${value}`;
                    const disabled = this.state.parties[value].message ? true : false
                    return (
                    <Tooltip TransitionComponent={Zoom} title={disabled ? this.state.parties[value].message : "" } arrow>
                    <ListItem key={value} style={{justifyContent: "center"}} disabled={disabled}>
                        {disabled ? <Grid item className={classes.redLine}></Grid> : null}
                        <Grid item>
                            <ListItemAvatar>
                            <Avatar
                                //alt={`Avatar n°${value}`}
                                src={require("./PartyLogo/" + value + ".png")}
                                variant="square"
                            />
                            </ListItemAvatar>
                        </Grid>
                        <Grid item xs={5}>
                            <ListItemText id={labelId} primary={value} />
                        </Grid>
                                                
                        {/* <Grid style={{width: 130}}>
                        <TextField  
                            id={value} 
                            value={this.state.partiesBase[value].voteResult.toFixed(2)}
                            type ='number'                            
                            onChange={this.voteNumberOnChange}
                            label="Процент голосов ДО" 
                            variant="outlined"
                            fullWidth
                            inputProps={{style: {fontSize: 16}}}
                            InputLabelProps={{style: {fontSize: 16}}}
                            />
                            
                        </Grid> */}

                        <Grid style={{width: 110, paddingRight: 5}}>
                        <TextField  
                            id={value} 
                            value={this.state.partiesBase[value].parlamentResultChairs}
                            disabled={true}
                            onChange={this.voteNumberOnChange}
                            label="Мест ДО" 
                            variant="outlined"
                            fullWidth
                            inputProps={{style: {fontSize: 16, color: "green", fontWeight: 'bold'}}}
                            InputLabelProps={{style: {fontSize: 16}}}
                            /> 
                        </Grid>

                        {/* <Grid style={{width: 130}}>
                        <TextField  
                            id={value} 
                            value={this.state.parties[value].voteResult.toFixed(2)}
                            type ='number'                            
                            onChange={this.voteNumberOnChange}
                            label="Процент голосов ПОСЛЕ" 
                            variant="outlined"
                            fullWidth
                            inputProps={{style: {fontSize: 16}}}
                            InputLabelProps={{style: {fontSize: 16}}}
                            />
                            
                        </Grid> */}

                        <Grid style={{width: 110}}>
                        <TextField  
                            id={value} 
                            value={this.state.parties[value].parlamentResultChairs}
                            disabled={true}
                            onChange={this.voteNumberOnChange}
                            label="Мест ПОСЛЕ" 
                            variant="outlined"
                            fullWidth
                            inputProps={{style: {fontSize: 16, color: "green", fontWeight: 'bold'}}}
                            InputLabelProps={{style: {fontSize: 16}}}
                            /> 
                        </Grid>

                        {/* <div>{this.state.parties[value].message}</div> */}
                    </ListItem>
                    </Tooltip>
                    );
                })}
                </List>              
                              
            </div>
          );
        }
    }    

export default withStyles(styles, { withTheme: true })(Parties)