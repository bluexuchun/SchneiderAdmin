import React, { Component } from 'react';
import ParamsSettingForm from './ParamsSettingForm/ParamsSettingForm';

export default class ParamsSetting extends Component {
  static displayName = 'ParamsSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <ParamsSettingForm history={this.props} />
      </div>
    );
  }
}
