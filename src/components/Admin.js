import React,{Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import  ImplementationForm  from '../containers/ImplementationForm';
import  CreateChallengeForm  from '../containers/CreateChallengeForm';
import { fetchAdminInfo } from '../actions';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.props.fetchAdminInfo();
  }

  render() {
    return(
      <div className="container content">
        <h3 className="border-title">PROXY - UPGRADEABILITY</h3>
        <div className="row">
            <h3><b>Owner</b></h3>
            <h3>{this.props.owner.ownerAddress}</h3>
            <h3><b>Proxy</b></h3>
            <h3>{this.props.owner.proxyAddress}</h3>
            <h3><b>Implementation</b></h3>
            <h3>{this.props.owner.implementationAddress}</h3>
            <ImplementationForm />
        </div>
        <h3 className="border-title">CREATE A CHALLENGE</h3>
          <div className="row">
            <CreateChallengeForm history={this.props.history}/>
          </div>
        <div className="row">

        </div>
      </div>
    );
  }
}

function mapStateToProps({ owner }) {
  return { owner }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchAdminInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
