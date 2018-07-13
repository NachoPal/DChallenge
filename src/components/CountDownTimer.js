import React, { Component } from 'react';
//import { render } from 'react-dom';
import Countdown from 'react-countdown-now';

const Completionist = () => <span>You are good to go!</span>;

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <span>FINISHED</span>;
  } else {
    // Render a countdown
    return <span>{hours}:{minutes}:{seconds}</span>;
  }
};

const CountDownTimer = (props) => {
  return (
    <div className="row count-down">
        <Countdown date={props.date * 1000}
          renderer={renderer}
        />
    </div>
  );
}

export default CountDownTimer;
