import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const muiTheme = createMuiTheme({
  overrides:{
    MuiSlider: {
      thumb:{
      color: "red",
      },
      track: {
        color: 'blue'
      },
      rail: {
        color: 'black'
      }
    }
}
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const marks = [
  {
    value: 0,
    label: '0%'
  },
  {
    value: 25,
    label: '25%'
  },
  {
    value: 50,
    label: '50%'
  },
  {
    value: 75,
    label: '75%'
  },
  {
    value: 100,
    label: '100%'
  },
];

const valuetext = (value) => {  
  return `${value}%`;
}

export default function CutoffSlider(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-always" gutterBottom>
         
      </Typography>
      <ThemeProvider theme={muiTheme}>
      <Slider
        defaultValue={0}
        getAriaValueText={valuetext}
        onChange={props.cutoffOnChange}
        aria-labelledby="discrete-slider-always"
        step={5}
        marks={marks}
        valueLabelDisplay="on"
        min={0}
        max={100}
      />
      </ThemeProvider>
    </div>
  );
}

