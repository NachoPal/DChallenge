import React from 'react';
import ReactCountdownClock from 'react-countdown-clock';

const Ongoing = props => {
  return(
    <div className="row panel panel-primary open-challenge">
      <div className="panel-heading">{props.title}</div>
      <div className="panel-body">
        <div className="col-md-2 even">
          <div className="row enrrolled"><b>{`${props.accomplished}/${props.enrolled}`}</b> accomplishments</div>
          <div className="row count-down">
            <ReactCountdownClock seconds={props.time} size={80} color="#000"/>
          </div>
          <div className="row">
            <button type="button" className="btn btn-success play">SEE MORE</button>
          </div>
        </div>
        <div className="col-md-4">
            <img src={props.img} className="img-responsive" alt="Challenge thumbnail" />
        </div>
        <div className="col-md-6">
          {props.description}
        </div>
    </div>
  </div>
  );
}

export default Ongoing;
