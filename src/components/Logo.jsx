import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import {ajaxTo} from '../util/util.js';
export default class Logo extends PureComponent {

    static displayName = '';

    static defaultProps = {};

    constructor(props) {
      super(props);

      this.queryCache = {};
      this.state = {
        title:''

      };
    }
  componentDidMount(){
    const that=this;
    console.log('11111');
    ajaxTo('api.php?entry=sys&c=system&a=setting&do=display').then(function(res){
      console.log(res.data.leftTitle);
           that.setState({
               title:res.data.leftTitle,
             
           })
    })
  }
  render() {
    const title=this.state.title;
    return (
      <div className="logo" style={{}}>
        <Link to="/" className="logo-text">
          {title}
        </Link>
      </div>
    );
  }
}
