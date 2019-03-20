import React, { Component } from 'react';
import CreateLiveSettingForm from './components/CreateLiveSettingForm';

export default class LiveSetting extends Component {
  static displayName = 'LiveSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateLiveSettingForm history={this.props} />
      </div>
    );
  }
}
