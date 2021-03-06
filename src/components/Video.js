import React,{Component} from 'react';

const isWinner = (winner) => {
  if(winner == true) {
    return <h3 className="border-title">WINNER</h3>
  }
}

const Video = ({ video, winner}) => {
  return(
    <div className="row video-container">
      <div className="col-md-4">
        {isWinner(winner)}
        <div className="row"><b>User address:</b> {video.userAddress}</div>
        <div className="row"><b>CODE:</b> {(video.code.slice(2,6)).toUpperCase()}</div>
        <div className="row"><b>Video durantion:</b> {video.duration} seg</div>
      </div>
      <div className="col-md-8">
        <video className="video-list" controls src={`https://gateway.ipfs.io/ipfs/${video.ipfsHash}`}>
          <p>Your browser does not support playing video. Update your browser to watch this video.</p>
        </video>
      </div>
    </div>
  );
}

export default Video;
