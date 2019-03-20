import React, { Component } from 'react';
import CreateBottomMenuSettingForm from './components/CreateBottomMenuSettingForm';

export default class BottomMenuSetting extends Component {
  static displayName = 'BottomMenuSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateBottomMenuSettingForm history={this.props} />
      </div>
    );
  }
}
