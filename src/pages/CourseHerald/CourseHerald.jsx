import React, { Component } from 'react';
import CreateCourseHeraldForm from './components/CreateCourseHeraldForm';

export default class CourseHerald extends Component {
  static displayName = 'CourseHerald';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateCourseHeraldForm history={this.props} />
      </div>
    );
  }
}
