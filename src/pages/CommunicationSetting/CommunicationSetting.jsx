import React, { Component } from 'react';
import CommunicationSettingForm from './CommunicationSettingForm/CommunicationSettingForm';

export default class CommunicationSetting extends Component {
  static displayName = 'CommunicationSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CommunicationSettingForm history={this.props} />
      </div>
    );
  }
}
