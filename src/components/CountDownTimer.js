import React, { Component } from 'react';
//import { render } from 'react-dom';
import Countdown from 'react-countdown-now';



const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <span>CLOSED</span>;
  } else {
    // Render a countdown
    if(days > 0) {
      return <span>{days} days, {hours}:{minutes}:{seconds}</span>;
    }
    return <span>{hours}:{minutes}:{seconds}</span>;
  }
};

const CountDownTimer = (props) => {
  return (
    <div className="row count-down">
        <Countdown date={props.date}
          renderer={renderer}
        />
    </div>
  );
}

export default CountDownTimer;
