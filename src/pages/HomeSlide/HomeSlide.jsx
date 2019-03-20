import React, { Component } from 'react';
import CreateHomeSlideForm from './components/CreateHomeSlideForm';

export default class HomeSlide extends Component {
  static displayName = 'HomeSlide';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateHomeSlideForm history={this.props} />
      </div>
    );
  }
}
