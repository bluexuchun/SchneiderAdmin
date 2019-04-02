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
    tab: "返回",
    key: 0,
    content: "/questionList"
  }, {
    tab: "回答管理",
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
    that.getAnswer(id)
  }

  getAnswer = (id,page) => {
    const that = this;
    let result = ajaxTo('api.php?entry=sys&c=chapter&a=answer&do=display',{
      qid:id,
      page:page
    });
    result.then(function(res) {
      console.log(res)
      that.setState({allData: res.data.list,pageNum:res.data.total,currentPageNum:res.data.psize});
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

  deleteId = (id) => {
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
  };

  renderStatus = (value, index, record) => {
    let _this = this
    return (
      <div status="default" className="labelStyle" style={{background: (record.status == '未审核') ? '#999' : '#289ffa',color:'#fff'}} onClick={() => _this.confrimStatus(record)}>
        {value}
      </div>
    );
  }

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
    this.queryCache.page = currentPage;
    const that=this;
    ajaxTo('api.php?entry=sys&c=course&a=course&do=display',{page:currentPage})
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
  }

  delAnswer = (id) => {
    let that = this
    let tid = that.props.newData.history.params.id
    ajaxTo('api.php?entry=sys&c=chapter&a=answer&do=delete',{id:id})
    .then(function(res){
      if(res.status == 1){
        Feedback.toast.success(res.message);
        that.getAnswer(tid)
      }else{
        Feedback.toast.error(res.message);
      }
    })
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  }

  onConfirm = () => {
    let _this = this
    let questionItem = _this.state.currentItem
    let tid = _this.props.newData.history.params.id
    questionItem.status = questionItem.status == '未审核' ? 1 : 2
    
    ajaxTo('api.php?entry=sys&c=chapter&a=answer&do=update',{
      ..._this.state.currentItem,
      tpid:questionItem.cid
    }).then((res) => {
      console.log(res)
      if(res.status == 1){
        Feedback.toast.success(res.message);
        _this.getAnswer(tid)
        _this.setState({
          visible: false
        });
      }else{
        Feedback.toast.error(res.message);
      }
    })
  }

  newRender = (value, index, record) => {
    console.log(record)
    let _this = this
    let detail = '/answer/'+ record.id + '/'+  _this.props.newData.history.params.id
    return (
      <div style={{display:'flex',flexDirection:'row'}}>
        <Link to={detail} style={aStyle}>编辑</Link>
        <Link style={aStyle} onClick={() => _this.delAnswer(record.id)}>删除</Link>
      </div>
    )
  };

  getIcon = (appicon) => {
    console.log(appicon);
    return (<img src={appicon} style={{
        width: '28px'
      }} className="media-side"/>)
  }

  addAnswer = () => {
    console.log('123')
    let _this = this
    this.props.newData.history.router.push('/answer/create/'+_this.props.newData.history.params.id);
  }
  render() {
    let forData = this.state.allData;
    const arr = [];
    var strClass;
    var currentClass
    if (forData) {
      for (var i = 0; i < forData.length; i++) {
        arr.push({
          'content': forData[i].content,
          'uid': forData[i].uid,
          'time': forData[i].time,
          'status': forData[i].status == '1'
            ? '审核通过'
            : '未审核',
          'displayorder': forData[i].displayorder,
          'type':forData[i].type == 1 ? '普通用户' : '专家',
          'id':forData[i].id,
          'cid':forData[i].cid
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
      <IceContainer>
        <Dialog
          visible={this.state.visible}
          onOk={this.onConfirm}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="警告"
        >
          <h3>{this.state.alertTitle}</h3>
        </Dialog>
        <div>
        <IcePanel style={{
          marginTop: "25px"
        }}>
          <Button type="primary" onClick={this.addAnswer} style={{margin:'20px 10px'}}>
            +新增回复
          </Button>
          <IcePanel.Header>
            共计{tableData.total}条数据
          </IcePanel.Header>
          <IcePanel.Body>
            <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
              <Table.Column title="ID" width={150} dataIndex="id"/>
              <Table.Column title="用户" width={150} dataIndex="uid"/>
              <Table.Column title="回答" width={150} dataIndex="content"/>
              <Table.Column title="回复时间" width={150} dataIndex="time"/>
              <Table.Column title="排序" width={150} dataIndex="displayorder"/>
              <Table.Column title="用户类型" width={150} dataIndex="type"/>
              <Table.Column title="状态" dataIndex="status" width={85} cell={this.renderStatus}/>
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
