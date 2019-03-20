import React, { Component } from 'react';
import CreateFenleiForm from './components/CreateFenleiForm';

export default class Fenlei extends Component {
  static displayName = 'Fenlei';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateFenleiForm history={this.props} />
      </div>
    );
  }
}
