import React, { Component } from 'react';
import CreateHomeNavManageForm from './components/CreateHomeNavManageForm/CreateHomeNavManageForm';

export default class HomeNavManage extends Component {
  static displayName = 'HomeNavManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateHomeNavManageForm history={this.props} />
      </div>
    );
  }
}
