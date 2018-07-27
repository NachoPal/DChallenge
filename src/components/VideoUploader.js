import React, { Component } from 'react';
import web3 from "../initializers/web3";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  submitVideo,
  submitChallenge
} from '../actions';
import Loading from 'react-loading-components';

class VideoUplaoder extends Component {
  constructor(props){
    super(props);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitChallenge = this.onSubmitChallenge.bind(this);
    this.state = {submitting: false};
  }

  captureFile(event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  }

  convertToBuffer(reader) {
    const buffer = Buffer.from(reader.result);
    this.setState({buffer});
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({submitting: true});
    this.props.submitVideo(this.state.buffer);
  }

  onSubmitChallenge(event) {
    event.preventDefault();
    const video = document.getElementById("video-submit");
    const duration = Math.floor(video.duration);
    this.props.submitChallenge({
      ...this.props.submit,
      videoDuration: duration,
      id: this.props.challengeId
    }, () => {
        this.props.modal.setState({modalSubmitIsOpen: false});
        this.props.history.push(`/challenge/${this.props.challengeId}`);
      }
    );
  }

  renderVideo() {
    if(this.props.submit.videoSubmitted == true){
      if(this.state.submitting == true) {
        this.setState({submitting: false});
      }
      const { ipfsHash } = this.props.submit;
      return(
        <div>
          <div className="row">
            <video id="video-submit" controls src={`https://gateway.ipfs.io/ipfs/${ipfsHash}`}>
              <p>Your browser does not support playing video. Update your browser to watch this video.</p>
            </video>
          </div>
          <div className="row">
            <button
              type="button"
              className="btn btn-success play"
              onClick={this.onSubmitChallenge}>
              SUBMIT
            </button>
          </div>
        </div>
      );
    }
  }

  renderLoader() {
    if(this.state.submitting == true) {
      return(
          <div className="row" id="video-submit-loader">
            <Loading
              type='oval'
              width={50}
              height={50}
              style={{marginTop: 10}}
              fill='#000'
            />
          </div>
      );
    }
  }

  render() {
    if(this.props.submit.codeAccepted == true){
      return(
        <div >
          <h4> Choose video to send to IPFS </h4>
          <form onSubmit={this.onSubmit}>
            <label className="btn btn-default btn-file">
              <input type = "file" onChange = {this.captureFile}/>
            </label>
            <button className="primary" type="submit">Send</button>
          </form>
          {this.renderVideo()}
          {this.renderLoader()}
        </div>
      );
    } else {
      return(<div></div>);
    }
  }
}

function mapStateToProps({ submit }) {
  return { submit };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    submitVideo,
    submitChallenge
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoUplaoder);
