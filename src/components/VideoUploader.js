import React, { Component } from 'react';
import web3 from "../initializers/web3";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  submitVideo,
  submitToBlockchain
} from '../actions';
import Loading from 'react-loading-components';

class VideoUplaoder extends Component {
  constructor(props){
    super(props);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitToBlockchain = this.onSubmitToBlockchain.bind(this);
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
    console.log(this.state.buffer);
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({submitting: true});
    console.log("Entra en submit");
    this.props.submitVideo(this.state.buffer);
  }

  onSubmitToBlockchain(event) {
    event.preventDefault();
    const video = document.getElementById("video-submit");
    const duration = Math.floor(video.duration);
    this.props.submitToBlockchain({
      ...this.props.submit,
      videoDuration: duration,
      id: this.props.challengeId
    });

  }

  renderVideo() {
    console.log("SUBMITING", this.state);
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
              onClick={this.onSubmitToBlockchain}>
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
      console.log("Video rerenderiza", this.props.submit);
    if(this.props.submit.codeAccepted == true){
      return(
        <div >
          <h4> Choose video to send to IPFS </h4>
          <form onSubmit={this.onSubmit}>
            <label className="btn btn-default btn-file">
              <input type = "file" onChange = {this.captureFile}/>
            </label>
            <button className="primary" type="submit">Submit</button>
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
    submitToBlockchain
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoUplaoder);
