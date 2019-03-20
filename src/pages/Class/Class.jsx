import React, { Component } from 'react';
import CreateClassForm from './components/CreateClassForm';

export default class Class extends Component {
  static displayName = 'Class';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateClassForm history={this.props} />
      </div>
    );
  }
}
