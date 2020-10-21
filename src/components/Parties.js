import React from 'react';
import Grid from '@material-ui/core/Grid'

import electionsConfig from '../electionsConfig'

import ParlamentChart from '../components/ParlamentChart'

import { Typography } from '@material-ui/core';

const Parties = (props) => {

    const isAgainstAllReached = props.againstAllReached;
    const onlyOnePartyPassed = props.onlyOnePartyPassed

    console.log('PARTIES')
    console.log(props.parties)
    console.log(props.partiesBase)

    return (
        <div>                            

            <Grid container justify="center">
                <ParlamentChart 
                    chartData={prepareChartData('partiesBase', props)}
                    title='Распределение мест ДО'>

                </ParlamentChart>

                {props.showCompareChart
                    ? <ParlamentChart 
                        chartData={prepareChartData('parties', props)}
                        title='Распределение мест ПОСЛЕ'
                        >

                    </ParlamentChart>
                    : <div></div>
                }
            </Grid>       

            {/* <Typography variant="body1">Осталось распределить: {this.state.percentsLeft}</Typography>                 */}

            <b>{isAgainstAllReached ? electionsConfig.against_all_reached_message : ''}</b>

            <b>{onlyOnePartyPassed ? electionsConfig.one_party_cutoff_only_message : ''}</b>                

        </div>
    )
    
}

const prepareChartData = (partiesSet, props) => {

    console.log('CHART DATA')
    console.log(props)

    let chartData = []

    Object.keys(props[partiesSet]).map((party) => {
        
        let chairsNumber = props[partiesSet][party].parlamentResultChairs

        if (Number(chairsNumber) > 0) {

            console.log(chairsNumber)

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
    return chartData
}

const areEqual = (prevProps, nextProps) => {

    return (prevProps.parties === nextProps.parties && prevProps.partiesBase === nextProps.partiesBase)
    }

export default React.memo(Parties, areEqual);
