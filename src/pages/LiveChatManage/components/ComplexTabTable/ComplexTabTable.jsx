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
  marginLeft: "1rem",
  cursor: 'pointer'
}
const onRowClick = function(record, index, e) {
  console.log(record)

}
const TabPane = Tab.TabPane;
const {Row, Col} = Grid;
const tabs = [
  {
    tab: "话题列表",
    key: 0,
    content: "/topicmanagelist"
  },
  // {
  //   tab: "新建话题",
  //   key: 1,
  //   content: "/topicmanage/create"
  // }
];

export default class ComplexTabTable extends Component {
  static displayName = 'ComplexTabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      isMobile: false,
      currentTab: 'solved',
      currentCategory: '1'
    };
  }

  componentWillMount() {
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=record&a=list&do=display');
    result.then(function(res) {
      console.log(res.data)

      that.setState({allData: res.data});
    })
  }

  // componentDidMount() {}

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
    ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=regulation&do=delete', {'id': id});
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
    const toUrl = '/activity/' + record.id;
    return (<div style={styles.complexTabTableOperation}>
      <Link to={toUrl}>编辑</Link>
      <div style={aStyle} data-id={record.id} onClick={this.deleteId.bind(this, record.id)}>删除</div>
    </div>);
  };

  // onClickStatus(value){
  //   if(value=='禁用'){
  //     this.setState({
  //       currentStatus:'开启'
  //     })
  //   }else{
  //     this.setState({
  //       currentStatus:'关闭'
  //     })
  //   }
  // }
  renderStatus = (value) => {

    return (      <IceLabel inverse={false} status="default">
            {value}
          </IceLabel>);
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;

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

  render() {
    let forData = this.state.allData;
    const arr = [];
    var currentType;
    if (forData) {
      for (var i = 0; i < forData.length; i++) {
        if(forData[i].type=="text"){
          currentType='文本'
        }else if(forData[i].type=="voice"){
          currentType='语音'
        }else{
          currentType='图片'
        }

        arr.push({
          'appname': forData[i].name,
          'class': currentType,
          detail1:forData[i].content,
          roomnum:forData[i].topic_id,
          what1:forData[i].is_question,
          'publishTime': forData[i].time,
          'id': forData[i].id,
          'status': forData[i].status == '1'
            ? '显示'
            : '禁用',
          'appicon': forData[i].appicon
        })
      }
    }
    const tableData = {
      'currentPage': 1,
      'pageSize': 8,
      'data': arr
    }

    const {tabList} = this.state;
    const allClassL=[
      {
        label:"不限",
        value:'1'
      },
      {
        label:"待审核",
        value:'2'
      },
      {
        label:"被禁用",
        value:'3'
      },
      {
        label:"正常",
        value:'4'
      },
    ]
    return (<div className="complex-tab-table">
      <IceContainer>
        <Tab>
          {tabs.map(item => (console.log(item), <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
        </Tab>
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
                    分类：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="appclass">
                      <Select className="next-form-text-align"  dataSource={allClassL}/>
                    </IceFormBinder>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    标题：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="appname" required={true} message="标题名称必须填写">
                      <Input style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="appname"/>
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
            共计0条数据
          </IcePanel.Header>
          <IcePanel.Body>
            <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
              <Table.Column title="用户名" width={220} dataIndex="appname"/>
              <Table.Column title="类型" width={100} dataIndex="class"/>
              <Table.Column title="内容" width={100} dataIndex="detail1"/>
              <Table.Column title="房间号" width={100} dataIndex="roomnum"/>
              <Table.Column title="问题" width={100} dataIndex="what1"/>
              <Table.Column title="发布时间" dataIndex="publishTime" width={150}/>
              <Table.Column title="状态" dataIndex="status" width={85} cell={this.renderStatus}/>
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
