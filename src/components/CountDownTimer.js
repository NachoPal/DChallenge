import React, { Component } from 'react';
import Countdown from 'react-countdown-now';


const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>TIME OUT</span>;
  } else {
    if(days > 0) {
      return <span>{days} days, {hours}:{minutes}:{seconds}</span>;
    }
    return <span>{hours}:{minutes}:{seconds}</span>;
  }
};

const CountDownTimer = (props) => {
  return (
    <div className="row count-down">
        <Countdown date={props.date * 1000}
          renderer={renderer}
          onComplete={props.onComplete}
        />
    </div>
  );
}

export default CountDownTimer;
