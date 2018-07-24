import React,{Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Avatar from 'react-avatar';
import { fetchUserChallengesIndex } from '../actions';

class AccountArea extends Component {
  constructor(props) {
    super(props);
  }

  // componentWillUpdate(){
  //   console.log("WILL UPDATE: LLAMO A COGER LOS INDICES")
  //   this.props.fetchUserChallengesIndex(this.props.user, this.saveInSessionStorage);
  // }

  componentDidMount() {
    console.log("DID MOUNT: LLAMO A COGER LOS INDICES")
    this.props.fetchUserChallengesIndex(this.props.user, this.saveInSessionStorage);
  }

  saveInSessionStorage(userInfo) {
    sessionStorage.setItem('user', JSON.stringify(userInfo));
  }

  render() {
    return(
      <li>
        <Avatar name={this.props.user.details.name} src={this.props.user.details.avatar.uri} round="100%" size="50px"/>
      </li>
    );
  }
}

function mapStateToProps({user}) {
  return { user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUserChallengesIndex }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountArea);
