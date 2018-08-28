import _ from 'lodash';
import web3 from '../initializers/web3';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { createChallenge } from '../actions';
import Loading from 'react-loading-components';
import { OPEN_CHALLENGES_PATH } from '../initializers/routes';

class CreateChallengeForm extends Component {
  constructor(props) {
    super(props);
    //const txHash = '0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b';
    // const txHash = '0x4176d323e95f467a15a501f395f3902e39b7082d03acd3ac7622d6f1700cbe6f';
    // this.props.history.push({
    //   pathname: OPEN_CHALLENGES_PATH,
    //   state: {txHash: txHash}
    // });

    this.state = {submitting: false};
    this.state = {bettingPrice: "100000000000000000"};
    this.state = {thumbnail: null};
    this.state = {summary: null};
    this.state = {description: null};
    this.state = {Errorthumbnail: false};
    this.state = {Errorsummary: false};
    this.state = {Errordescription: false};
  }

  // saveInput(event) {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   console.log(event.target.value);
  //   this.setState({entryFee: event.target.value});
  // }

  captureFile(name, event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader, name)
  }

  convertToBuffer(reader, name) {
    const buffer = Buffer.from(reader.result);
    var object = {};
    var error = {};
    object[name] = buffer;
    error["Error" + name] = false;
    this.setState(error);
    this.setState(object);

  }

  renderNumberField() {
		return (
			<div className="form-group">
				<label className="col-md-offset-2 col-md-2 control-label">Entry fee</label>
        <div className="col-md-6">
  				<input
            disabled
            type="number"
            className="form-control"
            placeholder="Entry fee"
            min="100000000000000"
            max="100000000000000000"
            step="1000"
            value="100000000000000000"//{this.state.entryFee}
            //onChange={(e) => this.saveInput(e)}
  				/>
          {/* <p className="row text-danger">
            {field.meta.touched ? field.meta.error : '' }
          </p> */}
        </div>
			</div>
		);
  }

  renderTextField(field) {
    const className = `form-group ${field.meta.touched && field.meta.error ? 'has-error': ''}`;

		return (
			<div className={className}>
				<label className="col-md-offset-2 col-md-2 control-label">{field.label}</label>
        <div className="col-md-6">
  				<input
            type="text"
            className="form-control"
            placeholder={field.label}
  					{...field.input}
  				/>
          <p className="row text-danger">
            {field.meta.touched ? field.meta.error : '' }
          </p>
        </div>
			</div>
		);
	}

  renderFileField(name) {
    const className = `form-group ${this.state["Error" + name] ? 'has-error': ''}`;

		return (
			<div className={className}>
				<label className="col-md-offset-2 col-md-2 control-label">
          {name.replace(/\w/, c => c.toUpperCase())}
        </label>
        <div className="col-md-6">
  				<input
            type="file"
            className="form-control"
            onChange = {(e) => this.captureFile(name, e)}
  				/>
          <p className="row text-danger">
            {this.state["Error" + name] ? "You should upload a file" : ''}
          </p>
        </div>
			</div>
		);
  }

  onSubmitForm(values) {
    const {
      Errorthumbnail,
      Errorsummary,
      Errordescription,
      thumbnail,
      description,
      summary,
      bettingPrice
    } = this.state;

    if(!thumbnail) this.setState({Errorthumbnail: true});
    if(!summary) this.setState({Errorsummary: true});
    if(!description) this.setState({Errordescription: true});

    if(Errorthumbnail == false && Errorsummary == false && Errordescription == false) {
      values["thumbnail"] = thumbnail;
      values["summary"] = summary;
      values["description"] = description;
      values["bettingPrice"] = "100000000000000000";
      this.setState({submitting: true});
      this.props.createChallenge(values, (txHash) => {
        this.props.history.push({
          pathname: OPEN_CHALLENGES_PATH,
          state: {txHash: txHash}
        });
      });
    }
  }

	render() {
    if (this.state.submitting == true) {
      return(
        <div className="row" style={{height: 500}}>

          <div className="row" style={{marginTop: 100}}>
            <h4>Uploading files to IPFS</h4>
            <Loading
              type='oval'
              width={150}
              height={150}
              //style={{paddingTop: 250}}
              fill='#000'
            />
          </div>
        </div>
      );
    } else {
      const { handleSubmit } = this.props;
  		return (
  			<form
          className="form-horizontal"
          onSubmit={handleSubmit(this.onSubmitForm.bind(this))}
          style={{marginTop: 15}}
        >
  				<Field
    				label="Title"
    				name="title"
    				component={this.renderTextField}
  				/>
          {this.renderFileField("thumbnail")}
          {this.renderFileField("summary")}
          {this.renderFileField("description")}
          <Field
    				label="Open Time"
    				name="openTime"
    				component={this.renderTextField}
  				/>
          <Field
    				label="Close Time"
    				name="closeTime"
    				component={this.renderTextField}
  				/>
          {this.renderNumberField()}
          <div className="form-group">
            <button type="submit" className="btn btn-default">Submit</button>
          </div>
  			</form>
  		);
    }
  }
}

function validate(values) {
  const errors = {};

  if(web3.utils.asciiToHex(values.title).length > 66) {
    errors.title = "Title longer than 32 bytes";
  }

  if(!values.title) {
    errors.title = "Title can't be empty";
  }

  if(!values.openTime) {
    errors.openTime = "Open Time can't be empty";
  }

  if(values.openTime && parseInt(values.openTime) < 360) {
    errors.openTime = "Open Time should be at least 360 seconds";
  }

  if(!values.closeTime) {
    errors.closeTime = "Close Time can't be empty";
  }

  // if(values.closeTime && parseInt(values.closeTime) < 360) {
  //   errors.closeTime = "Close Time should be at least 360 seconds";
  // }

  if((parseInt(values.openTime) + 360) > parseInt(values.closeTime)) {
    errors.closeTime = "Close Time should be at least 360 seconds bigger than Open Time";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'CreateChallengeForm'
})(
  connect(null,{ createChallenge })(CreateChallengeForm)
);
