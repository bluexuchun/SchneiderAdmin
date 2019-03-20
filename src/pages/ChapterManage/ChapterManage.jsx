import React, { Component } from 'react';
import CreateChapterManageForm from './components/CreateChapterManageForm';

export default class ChapterManage extends Component {
  static displayName = 'ChapterManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateChapterManageForm history={this.props} />
      </div>
    );
  }
}
