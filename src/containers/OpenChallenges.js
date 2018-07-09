import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOpenChallenges } from '../actions';
import _ from 'lodash';

import Open from '../components/Open';

class OpenChallenges extends Component {

  constructor(props) {
    super(props);
    console.log("Se monta OPEN");
    //DESCOMENTAR CUANDO SE HAGA EL FETCH DESDE WEB3
    this.props.fetchOpenChallenges();
  }

  renderOpenChallenges() {
    return this.props.open.map( open => {
      return(
        <Open
          key={open.id.toString()}
          title={open.title}
          description={open.description}
          img={open.img}
          enrolled={open.enrolled}
          time={open.time}
        />
      );
    });
  }

  render() {
    return (
      <div className="content container">
        <div className="row">
          {this.renderOpenChallenges()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({open}) {
  return {open}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchOpenChallenges}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenChallenges);
