import React, { Component } from 'react';
import CreateConsultationManageForm from './components/CreateConsultationManageForm';

export default class ConsultationManage extends Component {
  static displayName = 'ConsultationManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateConsultationManageForm history={this.props} />
      </div>
    );
  }
}
