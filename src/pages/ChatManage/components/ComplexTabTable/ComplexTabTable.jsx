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
  // marginLeft: "1rem",
  cursor: 'pointer'
}
const onRowClick = function(record, index, e) {
  console.log(record)

}
const TabPane = Tab.TabPane;
const {Row, Col} = Grid;


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
      currentCategory: '1',
      inputValue:''
    };
  }

  componentWillMount() {
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=record&a=list');
    result.then(function(res) {

      console.log(res.data)

      that.setState({allData: res.data,pageNum:res.total,currentPageNum:res.psize});
    });
    ajaxTo('api.php?entry=sys&c=webmaster&a=webmaster&do=getTopic')
    .then(function(res){
      console.log(res);
      that.setState({
        getAllClass:res.data,
      })
    })
  }

  componentDidMount() {}

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
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
    console.log(id);
    ajaxTo('api.php?entry=sys&c=record&a=list&do=delete', {'id': id});
    let oldData = this.state.allData;
    for (var i = 0; i < oldData.length; i++) {
      if (oldData[i].id == id) {
        oldData.splice(i, 1);
        this.setState({allData: oldData})
      }
    }
    // let newCurrenData=this.state.allData.splice

  }
  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    const toUrl = '/thinktank/' + record.id;
    return (<div style={styles.complexTabTableOperation}>
      {/* <Link to={toUrl}>编辑</Link> */}
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
    ajaxTo('api.php?entry=sys&c=record&a=list',{page:currentPage,topic_id:this.state.cid})
    .then(function(res){
      console.log(res)
      that.setState({
        currentPage:currentPage,
        allData:res.data

      })
    })

  };
  onChange1=(value)=>{
    console.log(value);
    this.setState({
      inputValue:value
    })
  }

  onSubCategoryClick = (catId) => {
    this.setState({currentCategory: catId});
    this.queryCache.catId = catId;
    this.fetchData();
  };

  changeCourse = (option,value) =>{
    const that=this;
    console.log(option,value);


    ajaxTo('api.php?entry=sys&c=webmaster&a=webmaster&do=getChapter',{tid:option})
    .then(function(res){
      console.log(res.data)
      var  currentChatAll=[];
      if(res.data){
        res.data.map((i,item)=>{
          currentChatAll.push({label: i.title, value: i.id})
        })
      }
      console.log(currentChatAll);

      that.setState({
        chatAll:currentChatAll,
        tid:option
      });
      console.log(that.state.chatAll);
    });
  }
  changeChat=(option,value)=>{
    // console.log(option);
    this.setState({
      cid:option
    })
  }

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

  submit=()=>{
    var that=this;
    console.log(this.state.inputValue);
    ajaxTo('api.php?entry=sys&c=record&a=list',{topic_id:this.state.cid})
    .then(function(res){
      console.log(res);
      that.setState({
        allData:res.data,pageNum:res.total,currentPageNum:res.psize
      })
    })
    // console.log(this.state)
  }

  render() {
    const defultClass = this.state.getAllClass;

    const styleP = {
      paddingBottom: '25px'
    };
    if (this.state.getAllClass) {
      // console.log(this.state.getAllClass)
      var  allClassL = [];
      const allClass = this.state.getAllClass.map((item, i) => {
        // console.log(item,i);
        return allClassL.push({label: item.topic_name, value: item.id})
      })
    }


    let forData = this.state.allData;
    const arr = [];
    if (forData) {
      for (var i = 0; i < forData.length; i++) {

        arr.push({
          'avatar': forData[i].avatar,
          'content': forData[i].content,
          'time': forData[i].time,
          'id': forData[i].id,
          'is_question': forData[i].is_question=="1"?'是':'否',
          'img_path': forData[i].img_path,
          'name':forData[i].name,
          'type':forData[i].type=='text'?'文本':forData[i].type=='img'?'图片':'音频',
          'voice_path':forData[i].voice_path,

        })
      }
    }
    const tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.currentPageNum,
      'data': arr,
      total:this.state.pageNum
    }

    const {tabList} = this.state;

    return (<div className="complex-tab-table">
      <IceContainer>
        <div>
          <IcePanel>
          <IcePanel.Header>
            筛选
          </IcePanel.Header>
          <IcePanel.Body>
            <IceFormBinderWrapper ref={(formRef) => {
                this.formRef = formRef;
              }} value={this.state.value} onChange={this.onFormChange}>
              <div>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    选择课程：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="appclass">
                      <Select className="next-form-text-align" dataSource={allClassL} onChange={this.changeCourse}/>
                    </IceFormBinder>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    选择章节：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="class1">
                      <Select className="next-form-text-align" dataSource={this.state.chatAll} onChange={this.changeChat} />
                    </IceFormBinder>
                  </Col>
                </Row>

                <Row style={styles.btns}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>

                  </Col>
                  <Col s="12" l="10">

                    <Button type="primary" onClick={this.submit}>
                      <Icon type="search" size="xs" />
                      搜索
                    </Button>

                  </Col>
                </Row>
              </div>
            </IceFormBinderWrapper>
          </IcePanel.Body>
        </IcePanel>

        <IcePanel style={{
          marginTop: "25px"
        }}>
          <IcePanel.Header>
            共计{tableData.total}条数据
          </IcePanel.Header>
          <IcePanel.Body>
            <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
              <Table.Column title="头像" width={80} dataIndex="avatar" cell={this.getIcon}/>
              <Table.Column title="昵称" width={80} dataIndex="name"/>
              <Table.Column title="消息类型" dataIndex="type" width={80} cell={this.renderStatus}></Table.Column>
              <Table.Column title="内容" dataIndex="content" width={120}></Table.Column>
              {/* <Table.Column title="图片地址" dataIndex="img_path" width={120}></Table.Column>
              <Table.Column title="音频地址" dataIndex="voice_path" width={120}></Table.Column> */}
              <Table.Column title="是否是问题" dataIndex="is_question" width={80} cell={this.renderStatus}></Table.Column>
              <Table.Column title="时间" width={80} dataIndex="time"/>
              <Table.Column title="操作" dataIndex="operation" width={150} cell={this.renderOperations}/>
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
