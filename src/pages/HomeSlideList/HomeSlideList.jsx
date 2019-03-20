import React, { Component } from 'react';
import ComplexTabTable from './components/ComplexTabTable';
import { ajaxTo } from '../../util/util';
export default class HomeSlideList extends Component {
static displayName = 'HomeSlideList';

  constructor(props) {
    super(props);
    this.state = {
      updateUrl:'api.php?entry=sys&c=app&a=regulation&do=display',

    };
  }


  render() {
    const newAry = {'history':this.props};
    console.log(this.state.allData)
    return (
      <div className="activity-list-page">
        <ComplexTabTable newData={newAry}/>
      </div>
    );
  }
}
