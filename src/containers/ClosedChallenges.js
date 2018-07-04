import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentRoute } from '../actions'

class ClosedChallenges extends Component {

  constructor(props) {
    super(props);
    console.log("Yes");
    this.props.setCurrentRoute(this.props.path);
  }

  render() {
    return (
      <div className="row">
        <h3>Soy Closed Challenges</h3>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setCurrentRoute }, dispatch);
}

export default connect(null, mapDispatchToProps)(OpenChallenges);
