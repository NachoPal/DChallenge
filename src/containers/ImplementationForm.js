import web3 from '../initializers/web3';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { setImplementation } from '../actions';

class ImplementationForm extends Component {
  renderField(field) {
    const className = `form-group ${field.meta.touched && field.meta.error ? 'has-error': ''}`;

		return (
			<div className={className}>
				<label className="col-md-offset-2 col-md-2 control-label">{field.label}</label>
        <div className="col-md-6">
  				<input
            type="text"
            className="form-control"
            placeholder={field.label}
  					//onChange={field.input.onChange}
  					//onFocus={field.input.onFocus}
  					{...field.input}
  				/>
          <p className="row text-danger">
            {field.meta.touched ? field.meta.error : '' }
            {/* {field.meta.touched ? field.meta.error : '' } */}
          </p>
        </div>

			</div>
		);
	}

  onSubmitForm(values) {
    this.props.setImplementation(values.address);
  }


	render() {
    const { handleSubmit } = this.props;

		return (
			<form className="form-horizontal" onSubmit={handleSubmit(this.onSubmitForm.bind(this))}>
				<Field
  				label="New address"
  				name="address"
  				component={this.renderField}
				/>
        <div className="form-group">
          <button type="submit" className="btn btn-default">Submit</button>
        </div>
			</form>
		);
  }
}

function validate(values) {
  const errors = {};

  if(!web3.utils.isAddress(values.address)) {
    errors.address = "Enter a valid address";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'OwnerForm'
})(
  connect(null,{ setImplementation })(ImplementationForm)
);
