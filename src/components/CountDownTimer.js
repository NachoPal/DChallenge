import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';

class CountDownTimer extends Component {
  // shouldComponentUpdate() {
  //   return true;
  // }
  render(){
    return (
      <div className="row count-down">
        <ReactCountdownClock seconds={this.props.seconds} size={80} color="#000"/>
      </div>
    );
  }
}

export default CountDownTimer;
