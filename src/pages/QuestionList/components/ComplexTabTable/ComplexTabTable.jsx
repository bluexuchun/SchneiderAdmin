/* eslint no-underscore-dangle:0 */
import React, {Component} from 'react';
import {Table, Pagination, Tab, Search} from '@icedesign/base';
import {
  Input,
  Button,
  Select,
  DatePicker,
  Grid,
  Icon,
  Feedback,
  Dialog
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
import { div } from 'gl-matrix/src/gl-matrix/vec4';

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
    tab: "问题管理",
    key: 1,
    content: "/questionList/create"
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
      visible:false,
      alertTitle:'确认审核通过?'
    };
  }

  componentWillMount() {
    const that = this;
    let id = that.props.newData.history.params.id
    that.getQuestion(id)
  }

  /**
   * 获取问题列表
   */
  getQuestion = (id,page) => {
    let that = this
    const result = ajaxTo('api.php?entry=sys&c=chapter&a=question&do=display',{
      cid:id,
      page:page
    });
    result.then(function(res) {
      console.log(res)
      if(res.status == 1){
        that.setState({allData: res.data.list,pageNum:res.data.total,currentPageNum:res.data.psize});
      }
      
    })
  }

  tabClick = (key) => {
    const url = tabs[key].content;
    this.props.newData.history.router.push(url);
  }

  renderTitle = (value, index, record) => {
    return (<div style={styles.titleWrapper}>
      <div>
        <IceImg src={record.cover} width={48} height={48}/>
      </div>
      <span style={styles.title}>{record.title}</span>
    </div>);
  };

  editItem = (record, e) => {
    e.preventDefault();
  };

  renderStatus = (value, index, record) => {
    let _this = this
    return (
      <div status="default" className="labelStyle" style={{background: (record.status == '未审核') ? '#999' : '#289ffa',color:'#fff'}} onClick={() => _this.confrimStatus(record)}>
        {value}
      </div>
    );
  };

  confrimStatus = (record) => {
    let id = record.id
    let alertTitle = record.status == '未审核' ? '确认审核通过?' : '确认审核失败'
    this.setState({
      alertTitle,
      visible:true,
      currentItem:record
    })
  }

  changePage = (currentPage) => {
    let id = this.props.newData.history.params.id
    this.queryCache.page = currentPage;
    const that=this;
    ajaxTo('api.php?entry=sys&c=chapter&a=question&do=display',{cid:id,page:currentPage})
    .then(function(res){
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
    const that = this;
    let id = record.id
    let answerUrl = '/answerList/'+record.id
    let answerEdit = '/question/'+record.id+'/'+id
    return (
      <div style={{display:'flex',flexDirection:'row'}}>
        <Link style={aStyle} to={answerUrl}>查看回答</Link>
        <Link style={aStyle} to={answerEdit}>编辑</Link>
        <div style={aStyle} onClick={() => that.delAnswer(id)}>删除</div>
      </div>
    )
  };

  delAnswer = (id) => {
    let that = this
    let tid = that.props.newData.history.params.id
    ajaxTo('api.php?entry=sys&c=chapter&a=question&do=delete',{id:id})
    .then(function(res){
      if(res.status == 1){
        Feedback.toast.success(res.message);
        that.getQuestion(tid)
      }else{
        Feedback.toast.error(res.message);
      }
    })
  }

  getIcon = (appicon) => {
    console.log(appicon);
    return (<img src={appicon} style={{
        width: '28px'
      }} className="media-side"/>)
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  onConfirm = () => {
    let _this = this
    let questionItem = _this.state.currentItem
    let tid = _this.props.newData.history.params.id
    questionItem.status = questionItem.status == '未审核' ? 1 : 2
    
    ajaxTo('api.php?entry=sys&c=chapter&a=question&do=update',{
      ..._this.state.currentItem,
      tpid:_this.props.newData.history.params.id
    }).then((res) => {
      console.log(res)
      if(res.status == 1){
        Feedback.toast.success(res.message);
        _this.getQuestion(tid)
        _this.setState({
          visible: false
        });
      }else{
        Feedback.toast.error(res.message);
      }
    })
  }
  onClick = () => {
    
  };

  render() {
    let forData = this.state.allData;
    const arr = [];
    if (forData) {
      for (var i = 0; i < forData.length; i++) {
        arr.push({
          'id':forData[i].id,
          'content': forData[i].content,
          'pop':forData[i].pop,
          'uid': forData[i].uid,
          'time': forData[i].time,
          'displayerorder':forData[i].displayerorder,
          'status': forData[i].status == '1'
            ? '审核通过'
            : '未审核'
        })
      }
    }
    const tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.currentPageNum,
      'data': arr,
      'total':this.state.pageNum
    }

    return (<div className="complex-tab-table">
      <Dialog
        visible={this.state.visible}
        onOk={this.onConfirm}
        onCancel={this.onClose}
        onClose={this.onClose}
        title="警告"
      >
        <h3>{this.state.alertTitle}</h3>
      </Dialog>
      <IceContainer>
        <Tab defaultActiveKey="1">
          {tabs.map(item => (console.log(item), <TabPane key={item.key} tab={item.tab} onClick={this.tabClick} ></TabPane>))}
        </Tab>
        <div>
        <IcePanel style={{
          marginTop: "25px"
        }}>
          <IcePanel.Header>
            共计{tableData.total}条数据
          </IcePanel.Header>
          <IcePanel.Body>
            <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false}>
              <Table.Column title="ID" width={150} dataIndex="id"/>
              <Table.Column title="问题" width={150} dataIndex="content"/>
              <Table.Column title="用户ID" width={150} dataIndex="uid"/>
              <Table.Column title="点赞人数" width={150} dataIndex="pop"/>
              <Table.Column title="创建时间" width={150} dataIndex="time"/>
              <Table.Column title="审核状态" dataIndex="status" width={85} cell={this.renderStatus}/>
              <Table.Column title="操作" dataIndex="operation" width={150} cell={this.newRender}/>
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
