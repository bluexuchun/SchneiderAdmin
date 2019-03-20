import React, { Component } from 'react';
import CreateThinkTankForm from './components/CreateThinkTankForm';

export default class ThinkTank extends Component {
  static displayName = 'ThinkTank';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateThinkTankForm history={this.props} />
      </div>
    );
  }
}
