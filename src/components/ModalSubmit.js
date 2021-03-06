import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import Loading from 'react-loading-components';
import Code from './Code';
import VideoUplaoder from './VideoUploader'

Modal.setAppElement('.main-container');

class ModalSubmit extends Component {
  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.this.setState({modalSubmitIsOpen: false});
  }

  renderVideoUploader() {
    if(this.props.submit.challengeSubmissionError == false) {
      if(this.props.from == "item") {
        return(
          <VideoUplaoder
            challengeId={this.props.this.props.item.id}
            history={this.props.history}
            modal={this.props.this}
          />
        );
      } else if(this.props.from == "view") {
        return(
          <VideoUplaoder
            challengeId={this.props.this.props.challenge.id}
            history={this.props.history}
            modal={this.props.this}
          />
        );
      }
    } else if(this.props.submit.challengeSubmissionError == true) {
      return(
        <p>You sent the video too late, reset the CODE generator and submit a NEW video</p>
      );
    }
  }

  render() {
    return(
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={() => {this.props.this.state.modalSubmitIsOpen}}
        shouldCloseOnOverlayClick={true}
        contentLabel="Submit"
        className="modal-content-code"
        overlayClassName="modal-overlay"
      >
        <button className="close" onClick={this.closeModal}><span aria-hidden="true">&times;</span></button>
        <div className="row">
          <Code />
        </div>
        <div>
          <div className="row">
            {this.renderVideoUploader()}
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps({ submit }) {
  return { submit };
}

export default connect(mapStateToProps)(ModalSubmit);
