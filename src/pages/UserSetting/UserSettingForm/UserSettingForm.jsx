import React, {Component} from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import IceLabel from '@icedesign/label';
import {ajaxTo} from '../../../util/util';
import { userrecord } from '../../../util/userecord';
import IceContainer from '@icedesign/container';
import {Feedback} from '@icedesign/base';
import Img from '@icedesign/img';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
import IcePanel from '@icedesign/panel';
import {
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Upload,
  Tab,
  Table,
  Pagination,
  Dialog
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload} = Upload;
const TabPane = Tab.TabPane;

const aStyle={
  display:"inline-block",
  color:"#5485F7",
  marginRight:"1rem",
  cursor:'pointer'
}
// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
// const { Group: RadioGroup } = Radio;

// Switch 组件的选中等 props 是 checked 不符合表单规范的 value 在此做转换
const SwitchForForm = (props) => {
  const checked = props.checked === undefined
    ? props.value
    : props.checked;

  return (<Switch {...props} checked={checked} onChange={(currentChecked) => {
      if (props.onChange)
        props.onChange(currentChecked);
      }}/>);
};
const onRowClick = function(record, index, e) {
  console.log(record)

}
export default class UserSettingForm extends Component {
  static displayName = 'UserSettingForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
        this.queryCache = {};
    console.log(this.props);
    this.state = {
      allData:'',
      logoImg: '',

      value: {
        isapp: false,
        appstatus: false,
        appid: '',
        apprecommend: false,
        appbibei: false,

      },
      QRcode:'boss',
      chit:'date',
      homestyle:'list',
      getAllClass: ""
    };
    // this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {

    console.log(this.props);
    const that = this;

    ajaxTo('api.php?entry=sys&c=user&a=customerForm&do=display').then(function(res){
      console.log(res);
      that.setState({
        position:res.data.content
      })
    })
    ajaxTo('api.php?entry=sys&c=user&a=userinfo&do=userinfo').then(function(res) {
      console.log(res);
      that.setState({
        allData:res.data,
        pageSize:res.psize,
        total:res.totle
      })
    })
  }

  componentDidMount(){
    // const activityId = this.props.history.params.activityId;
    //  正确获取到activityId的值，去获取他的值
    // if(activityId != 'create'){
    //   ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=regulation&do=edit',{'id':activityId})
    //   .then((res)=>{
    //     console.log(res)
    //     const currentData=res.data;
    //     console.log(currentData);
    //      返回的信息
    //     this.setState({
    //       value:{
    //         appname:currentData.appname,
    //         apphumen:currentData.apphumen,
    //         appicon:currentData.appicon,
    //         appclass:currentData.appclass,
    //         appstatus:currentData.appstatus=='1'?true:false,
    //         appid:currentData.appid,
    //         apprecommend:currentData.isRecommend=='1'?true:false,
    //         appbibei:currentData.appbibei == '1' ? true : false,
    //         appdetail:currentData.appdetail,
    //         isapp:currentData.isapp == '1' ? true : false
    //       },
    //       logoImg:currentData.appicon
    //     })
    //   })
    // }else{
    //   const allClass = this.state;
    //   console.log(allClass);
    //    this.setState({
    //      value:{
    //        appclass:this.state.getAllClass,
    //      }
    //    })
    // }
  }

  deleteRecord = (id) => {
    const that = this;
    console.log(id);
    Dialog.confirm({
      content: "确认删除用户?",
      title: "删除",
      onOk: () => {
        const result = ajaxTo('api.php?entry=sys&c=user&a=userinfo&do=del',{
          id:id
        })
        .then((res) => {
          let newArr = this.state.allData.filter(obj=>obj.id!==id);
          that.setState({
            allData:newArr
          })
          Feedback.toast.success('删除成功');
        })
      }
    });

  }

  userRecord=(userid)=>{
  console.log(userid);
  const data=userrecord(userid,12);
  console.log(data);

}
  renderOperations = (value, index, record) => {
    console.log(record);
    const toUrl = '/usersetting/'+record.id;
    return (
      <div style={styles.complexTabTableOperation}>
      <div style={aStyle}  onClick={this.userRecord.bind(this,record.openid)}>用户记录</div>
        <a style={{color:'#289ffa',cursor:'pointer'}} onClick={(id) => this.deleteRecord(record.id)}>删除</a>
      </div>
    );
  };

  onFormChange = (value) => {
    this.setState({value});
  };

  onDragOver = () => {
    console.log("dragover callback");
  }

  onDrop = (fileList) => {
    console.log("drop callback : ", fileList);
  }
  getIcon = (appicon) => {
    console.log(appicon);
    return (<img src={appicon} style={{
        width: '28px'
      }} className="media-side"/>)
  }

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;
        console.log(this.queryCache.page);
    const that=this;
    console.log(currentPage);
    ajaxTo('api.php?entry=sys&c=user&a=userinfo&do=userinfo',{page:currentPage})
    .then(function(res){
      console.log(res)
      that.setState({
        currentPage:currentPage,
        allData:res.data

      })
    })
  };
  renderStatus = (value) => {
    return (
      <IceLabel inverse={false} status="default">
        {value}
      </IceLabel>
    );
  };

  onSubCategoryClick = (catId) => {
    this.setState({currentCategory: catId});
    this.queryCache.catId = catId;
    this.fetchData();
  };

  exportUser = (type) => {
    let url = 'https://bang.schneider-electric.cn/academy/api/'
    console.log(type);
    if(type == 'form'){
      url = url + 'api.php?entry=sys&c=user&a=export&do=all';
      window.open(url, '_blank');
    }else if(type == 'user'){
      url = url + 'api.php?entry=sys&c=user&a=export&do=reg';
      window.open(url, '_blank');
    }
  }
  onChangeSelect=()=>{

  };
  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      console.log(value);
      ajaxTo('api.php?entry=sys&c=user&a=userinfo&do=userinfo',{...value}).then(function(res){
        console.log(res);
        that.setState({
          allData:res.data,
          pageSize:res.psize,
          total:res.totle
        })
      })
    })
  };
  render() {
    const defultClass = this.state.getAllClass;
    let forData = this.state.allData;
    console.log(forData);
    const arr = [];
    if (forData) {
      for (var i = 0; i < forData.length; i++) {
        console.log(i);
        arr.push({
          'name':forData[i].name,
          'email':forData[i].email,
          'nname': forData[i].nickname,
          'createtime': forData[i].createtime,
          'id': forData[i].id,
          'tel':forData[i].phone,
          'industry':forData[i].industry,
          'company':forData[i].company,
          'position':forData[i].position,
          'openid':forData[i].openid,
          'from':forData[i].from == 'false'? '' : forData[i].from,
          'time':forData[i].time,
          'isAccept':forData[i].isAccept==1?"是":"否"
        })
      }
    }
    let tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.pageSize,
      'data': arr,
      'total':this.state.total
    }

    console.log(tableData.data);

    const styleP = {
      paddingBottom: '25px'
    }
    if (this.state.position) {
      var allClassL = [];
      const all=this.state.position;
      for(var i=0;i<all.length;i++){
        allClassL.push({label: all[i],value: all[i]})
      }
    }
    const guildAll=[{label: '农业,食品与饮料', value: '农业,食品与饮料'},
    {label: '汽车', value: '汽车'},
    {label: '云服务供应商', value:'云服务供应商'},
    {label: '教育与研究', value: '教育与研究'},
    {label: '电力', value: '电力'},
    {label: '金融', value: '金融'},
    {label: '医疗保健', value: '医疗保健'},
    {label: '酒店与酒店管理', value: '酒店与酒店管理'},
    {label: 'IT供应商与系统集成商', value: 'IT供应商与系统集成商'},
    {label: '生命科学', value:'生命科学'},
    {label: '制造业', value:'制造业'},
    {label: '海事', value: '海事'},
    {label: '采矿,矿物与金属', value: '采矿,矿物与金属'},
    {label: '石油与天然气', value: '石油与天然气'},
    {label: '民用住宅', value: '民用住宅'},
    {label: '零售', value: '零售'},
    {label: '交通运输', value: '交通运输'},
    {label: '水行业', value: '水行业'},
    {label: '政府/非商用设施', value: '政府/非商用设施'},
    {label: '其他', value: '其他'},
  ]
    const currentArr=[{label: '否', value: 0},{label: '是', value: 1}]
    return (<div className="create-activity-form">
      <IceContainer style={styles.container} title="用户管理">
        <div style={styles.btnGroup}>
          <Button type="primary" onClick={()=>this.exportUser('user')} style={{marginRight: '10px'}}>
            导出注册用户信息
          </Button>
          <Button type="primary" onClick={()=>this.exportUser('form')}>
            导出全部用户信息
          </Button>
        </div>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <IcePanel style={{
                marginBottom: '10px',
                border: 'none',
                backgroundColor: "#fff"
              }}>
              <IcePanel.Header>
                筛选
              </IcePanel.Header>
              <IcePanel.Body>
              <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                行业：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="guild">
                  <Select  className="next-form-text-align"  dataSource={guildAll} onChange={this.onChangeSelect.bind(this)}/>
                </IceFormBinder>
              </Col>
              </Row>

              <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                职位：
              </Col>
              <Col s="12" l="10">
              <IceFormBinder name="position">
                <Select  className="next-form-text-align" dataSource={allClassL}   onChange={this.onChangeSelect.bind(this)}/>
              </IceFormBinder>
              </Col>
              </Row>

              <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                是否接受邮件：
              </Col>
              <Col s="12" l="10">
              <IceFormBinder name="oremail">
                <Select  className="next-form-text-align" dataSource={currentArr}   onChange={this.onChangeSelect.bind(this)}/>
              </IceFormBinder>
              </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                  搜索内容：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="content">
                    <Input placeholder="可以搜索 姓名 邮箱 手机号" style={{
                        width: '100%'
                      }}/>
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>搜索</Button>

              </Col>
              </Row>







              </IcePanel.Body>
            </IcePanel>

            <IcePanel style={styles.jianxi}>
              <IcePanel.Header>
                共计{tableData.total}条数据
              </IcePanel.Header>
              <IcePanel.Body>
                <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
                  <Table.Column title="姓名" width={60} dataIndex="name"/>
                  <Table.Column title="邮箱" width={120} dataIndex="email"/>
                  <Table.Column title="手机号" dataIndex="tel" width={70}/>
                  <Table.Column title="行业" width={70} dataIndex="industry"/>
                  <Table.Column title="公司名称" width={70} dataIndex="company"/>
                  <Table.Column title="职业" width={70} dataIndex="position"/>
                  <Table.Column title="openid" width={120} dataIndex="openid"/>
                  <Table.Column title="来源" width={120} dataIndex="from"/>
                  <Table.Column title="注册时间" width={120} dataIndex="createtime"/>
                  <Table.Column title="提交表单时间" width={120} dataIndex="time"/>
                  <Table.Column title="是否接受邮件" width={120} dataIndex="isAccept" cell={this.renderStatus}/>

                  <Table.Column title="操作" width={150} cell={this.renderOperations}/>
                </Table>
                <div style={styles.pagination}>
                  <Pagination current={tableData.currentPage} pageSize={tableData.pageSize} total={tableData.total} onChange={this.changePage}/>
                </div>
              </IcePanel.Body>
            </IcePanel>


          </div>



        </IceFormBinderWrapper>
      </IceContainer>
    </div>);
  }
}

const styles = {
  btnGroup:{
    position:'absolute',
    top:'1rem',
    right:'2rem',
    display:'flex',
    flexDirection:'row'
  },
  jianxi:{
    marginBottom:"25px"
  },
  container: {
    paddingBottom: 0,
    position:'relative'
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginTop: '25px',
    marginBottom: '10px'
  },
  huise: {
    color: '#CFCFCF'
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
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginBottom: '25px'
  },
  formLabel: {
    textAlign: 'right'
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
