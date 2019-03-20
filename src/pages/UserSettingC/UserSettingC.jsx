import React, { Component } from 'react';
import CreateUserSettingCForm from './components/CreateUserSettingCForm';

export default class UserSettingC extends Component {
  static displayName = 'UserSettingC';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateUserSettingCForm history={this.props} />
      </div>
    );
  }
}
