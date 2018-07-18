import React, {Component} from 'react';
import Modal from 'react-modal';
import Loading from 'react-loading-components';
import Code from './Code';

Modal.setAppElement('.main-container');

export default class ModalSubmit extends Component {
  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.this.setState({modalIsOpen: false});
  }

  render() {
    return(
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={() => {this.props.this.state.modalIsOpen}}
        shouldCloseOnOverlayClick={true}
        contentLabel="Submit"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className="close" onClick={this.closeModal}><span aria-hidden="true">&times;</span></button>
        <div className="row">
          <Code />
          {/* <SubmitChallengeForm /> */}
        </div>
      </Modal>
    );
  }
}
