/* eslint no-underscore-dangle:0 */
import React, {Component} from 'react';
import {Table, Pagination, Tab, Search} from '@icedesign/base';
import {
  Input,
  Button,
  Select,
  DatePicker,
  Grid,
  Icon
} from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import {enquireScreen} from 'enquire-js';
import SubCategoryItem from './SubCategoryItem';
import './ComplexTabTable.scss';
import {Link} from 'react-router'
import {ajaxTo} from '../../../../util/util';
import Img from '@icedesign/img';
import IcePanel from '@icedesign/panel';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';

const aStyle = {
  display: "inline-block",
  color: "#5485F7",
  marginRight: "1rem",
  cursor: 'pointer'
}
const onRowClick = function(record, index, e) {
  console.log(record)

}
const TabPane = Tab.TabPane;
const {Row, Col} = Grid;
const tabs = [
  {
    tab: "学分排行",
    key: 0,
    content: "/topicmanagelist"
  }
];

export default class ComplexTabTable extends Component {
  static displayName = 'ComplexTabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      currentPage:1,
      isMobile: false,
      currentTab: 'solved',
      currentCategory: 1,

    };
  }

  componentWillMount() {
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=score&a=score&do=display');
    result.then(function(res) {
      console.log(res.data)

      that.setState({allData: res.data.list,pageNum:res.data.total,currentPageNum:res.data.psize});
    })
  }

  renderTitle = (value, index, record) => {
    return (<div style={styles.titleWrapper}>
      <div>
        <IceImg src={record.cover} width={48} height={48}/>
      </div>
      <span style={styles.title}>{record.title}</span>
    </div>);
  };

  deleteId = (id) => {
    console.log(id);
    ajaxTo('api.php?entry=sys&c=course&a=course&do=del', {'cid': id});
    let oldData = this.state.allData;
    for (var i = 0; i < oldData.length; i++) {
      if (oldData[i].id == id) {
        oldData.splice(i, 1);
        this.setState({allData: oldData})
      }
    }

  }
  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    const toQuestion = '/questionList/' + record.id 
    const toUrl = '/topicmanage/' + record.id;
    return (<div style={styles.complexTabTableOperation}>   
      <Link style={aStyle} to={toUrl}>详细信息</Link>
      <div style={aStyle} data-id={record.id} onClick={this.deleteId.bind(this, record.id)}>删除</div>
    </div>);
  };

  renderStatus = (value) => {
    return (<IceLabel inverse={false} status="default">
      {value}
    </IceLabel>);
  };

  changePage = (currentPage) => {

    this.queryCache.page = currentPage;
    const that=this;
    console.log(currentPage);
    ajaxTo('api.php?entry=sys&c=course&a=course&do=display',{page:currentPage})
    .then(function(res){
      console.log(res)
      that.setState({
        currentPage:currentPage,
        allData:res.data.list
      })
    })

  };

  onSubCategoryClick = (catId) => {
    this.setState({currentCategory: catId});
    this.queryCache.catId = catId;
    this.fetchData();
  };

  getData = () => {
    let result = [];
    const data = this.props.newData;
    for (let i = 0; i < data.length; i++) {
      result.push({titlenaem: data.appname, AppID: data.id, publishTime: data.createtime, publishStatus: data.appstatus, publishTime: data.createtime});
    }
    return result;
  };
  newRender = (value, index, record) => {
    return <a>操作</a>;
  };

  getIcon = (appicon) => {
    console.log(appicon);
    return (<img src={appicon} style={{
        width: '28px'
      }} className="media-side"/>)
  }

  avatarbox = (value, index, record) => {
    return (
      <img src={record.headimgurl} style={{
        width:'30px',
        height:'30px'
      }} className="media-side"/>
    )
  }

  render() {
    let forData = this.state.allData;
    const arr = [];
    var strClass;
    var currentClass
    if (forData) {
      for (var i = 0; i < forData.length; i++) {
        arr.push({
          'headimgurl': forData[i].headimgurl,
          'nickname': forData[i].nickname,
          'score': forData[i].score
        })
      }
    }
    const tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.currentPageNum,
      'data': arr,
      'total':this.state.pageNum
    }

    const { tabList } = this.state;
    return (<div className="complex-tab-table">
      <IceContainer>
        <Tab>
          {tabs.map(item => (console.log(item), <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
        </Tab>
        <div>
          <IcePanel>
            <IcePanel.Header>
              共计{tableData.total}条数据
            </IcePanel.Header>
            <IcePanel.Body>
              <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
                <Table.Column title="姓名" width={150} dataIndex="nickname"/>
                <Table.Column title="头像" width={150} dataIndex="headimgurl" cell={this.avatarbox}/>
                <Table.Column title="总学分" width={150} dataIndex="score"/>
                {/* <Table.Column title="操作" dataIndex="operation" width={150} cell={this.renderOperations}/> */}
              </Table>
              <div style={styles.pagination}>
                <Pagination current={tableData.currentPage} pageSize={tableData.pageSize} total={tableData.total} onChange={this.changePage}/>
              </div>
            </IcePanel.Body>
          </IcePanel>
        </div>
      </IceContainer>
    </div>);
  }
}

const styles = {
  container: {
    paddingBottom: 0
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginBottom: '25px'
  },
  formLabel: {
    textAlign: 'right'
  },
  btns: {
    margin: '25px 0'
  },
  resetBtn: {
    marginLeft: '20px'
  },
  complexTabTableOperation: {
    lineHeight: '28px'
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  title: {
    marginLeft: '10px',
    lineHeight: '20px'
  },
  operation: {
    marginRight: '12px',
    textDecoration: 'none'
  },
  tabExtra: {
    display: 'flex',
    alignItems: 'center'
  },
  search: {
    marginLeft: 10
  },
  tabCount: {
    marginLeft: '5px',
    color: '#3080FE'
  },
  pagination: {
    textAlign: 'right',
    paddingTop: '26px'
  }
};
