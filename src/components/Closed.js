import React from 'react';
import ReactCountdownClock from 'react-countdown-clock';

const Closed = props => {
  return(
    <div className="row panel panel-primary closed-challenge">
      <div className="panel-heading">{props.title}</div>
      <div className="panel-body">
        <div className="col-md-2 even">
          <div className="row enrrolled"><b>{`${props.accomplished}/${props.enrolled}`}</b> accomplishments</div>
          <div className="row"><b>3</b> days ago</div>
          <div className="row">
            <b>{`${props.raised}`}</b> ETH
          </div>
          <div className="row">
            <button type="button" className="btn btn-success play">SEE WINNERS</button>
          </div>
        </div>
        <div className="col-md-4">
          <video id="player" controls src="https://gateway.ipfs.io/ipfs/QmU1GSqu4w29Pt7EEM57Lhte8Lce6e7kuhRHo6rSNb2UaC">
            <p>Your browser does not support playing video. Update your browser to watch this video.</p>
          </video>
        </div>
        <div className="col-md-6">
          {props.description}
        </div>
    </div>
  </div>
  );
}

export default Closed;
