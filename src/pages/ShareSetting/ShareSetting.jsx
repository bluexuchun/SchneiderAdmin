import React, { Component } from 'react';
import ShareSettingForm from './ShareSettingForm/ShareSettingForm';

export default class ShareSetting extends Component {
  static displayName = 'ShareSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <ShareSettingForm history={this.props} />
      </div>
    );
  }
}
