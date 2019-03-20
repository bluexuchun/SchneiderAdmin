import React, { Component } from 'react';
import CreateCourseManageForm from './components/CreateCourseManageForm';

export default class CourseManage extends Component {
  static displayName = 'CourseManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateCourseManageForm history={this.props} />
      </div>
    );
  }
}
