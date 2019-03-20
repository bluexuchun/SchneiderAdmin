import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo} from '../../../../util/util';
import IceContainer from '@icedesign/container';
import {Feedback} from '@icedesign/base';
import Img from '@icedesign/img';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
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
  NumberPicker
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core, DragUpload} = Upload;
// const {DragUpload}=Upload;
const TabPane = Tab.TabPane;

const tabs = [
  {
    tab: "业务咨询列表",
    key: 0,
    content: "/consultationmanagelist"
  }, {
    tab: "新增业务咨询",
    key: 1,
    content: "/consultationmanage/create"
  }
];

// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
// const { DragUpload } = Upload;

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

export default class CreateConsultationManageForm extends Component {
  static displayName = 'CreateConsultationManageForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg: '',
      value: {
        isapp: false,
        appstatus: false,
        appid: '',
        apprecommend: false,
        appbibei: false
      },
      getAllClass: "",
      editable: false,
      value: 0,
      homestyle: 'list'
      // num:""
    };
  }

  // componentWillMount(){
  //   const that = this;
  //   ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=regulation&do=getallclass')
  //   .then(function(res){
  //     console.log(res);
  //     that.setState({
  //       getAllClass:res.data
  //     })
  //   })
  // }
  //
  componentDidMount(){
    const activityId = this.props.history.params.id;
     // 正确获取到activityId的值，去获取他的值
    if(activityId != 'create'){
      ajaxTo('api.php?entry=sys&c=counsel&a=detail',{'id':activityId})
      .then((res)=>{
        console.log(res)
        const currentData=res;
        console.log(currentData);
         // 返回的信息
        this.setState({
          value:{
            name:currentData.name,
            phone:currentData.phone,
            email:currentData.email,
            company:currentData.company,
            send_email:currentData.send_email=='1'?true:false,
            position:currentData.position,
            counsel:currentData.counsel,
          },
        })
      })
    }else{
      const allClass = this.state;
      console.log(allClass);
       this.setState({
         value:{
           appclass:this.state.getAllClass,
         }
       })
    }
  }

  onError = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg = 'http://' + res.imgURL;
    this.setState({logoImg: logoImg})
  }
  onFormChange = (value) => {
    this.setState({value});
  };

  onDragOver = () => {
    console.log("dragover callback");
  }

  onDrop = (fileList) => {
    console.log("drop callback : ", fileList);
  }
  onFileChange = (file) => {
    // console.log(file.file.imgURL);
    const iconImg = 'https://app.yongketong.cn/' + file.file.imgURL;
    console.log(iconImg);
    // this.setState({
    //   iconImg
    // })
  }
  onChange(value) {
    console.log("changed", value);
    this.setState({num: value});
  }
  onChange2(value) {
    this.setState({homestyle: value});
  }
  reset = () => {
    this.setState({
      value: {
        appname: '',
        isapp: false,
        appstatus: false,
        appid: '',
        apprecommend: false,
        apphumen: '',
        appdetail: '',
        appbibei: false
      },
      logoImg: ''
    });
  };

  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      // console.log('error', error, 'value', value);
      if (error) {
        // 处理表单报错
      }
      // 提交当前填写的数据
      //
      console.log(that.props);

      //
      const dataAry = {
        ...that.formRef.props.value,
        logoImg: that.state.logoImg,
        id: this.props.history.params.activityId
      }
      console.log(that.formRef.props.value);

      //修改区
      const newrequestUrl = this.props.history.params.id == 'create'
        ? 'api.php?entry=sys&c=counsel&a=list'
        : 'api.php?entry=sys&c=app&a=regulation&do=update';
      console.log(newrequestUrl);
      const result = ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/consultationmanagelist');
        }, 1000);

        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })

      // console.log(this.formRef.props.value.name)
    });
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.history.router.push(url);
  }

  render() {
    const defultClass = this.state.getAllClass;

    const styleP = {
      paddingBottom: '25px'
    }

    var allClassL = [
      {
        label: '数字直播',
        value: '1'
      }
    ];

    return (<div className="create-activity-form">
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <Tab onChange={this.tabChange} defaultActiveKey={1}>
              {tabs.map(item => (<TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
            </Tab>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                姓名：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="name">
                  <Input  disabled={true} style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="name"/>
              </Col>
            </Row>

            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                App/H5：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="isapp">
                  <SwitchForForm defaultChecked={this.state.value.isapp}/>
                </IceFormBinder>
              </Col>
            </Row> */
            }

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                电话：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="phone">
                  <Input disabled={true} style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="phone"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                邮箱：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="email">
                  <Input disabled={true} style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="email"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                公司：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="company">
                  <Input  disabled={true} style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="company"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                职位：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder  name="position">
                  <Input  disabled={true} style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="position"/>
              </Col>
            </Row>

            <Row style={styles.formItem1}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                问题：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="counsel">
                  <Input  disabled={true} style={{
                      width: '100%'
                    }} multiple="multiple"/>
                </IceFormBinder>
                <IceFormError name="counsel"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                是否接受电子邮件：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="send_email">
                  <SwitchForForm  disabled={true} defaultChecked={this.state.value.appstatus}/>
                </IceFormBinder>
              </Col>
            </Row>


            {/* <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {
                    this.props.history.params.id != 'create'
                      ? '保存'
                      : '立即创建'
                  }
                </Button>
                <Button style={styles.resetBtn} onClick={this.reset}>
                  重置
                </Button>
              </Col>
            </Row> */}
          </div>
        </IceFormBinderWrapper>
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
    marginTop: '25px',
    marginBottom: '10px'
  },
  formItem1: {
    height: '145px',
    lineHeight: '28px',
    marginBottom: '25px'
  },
  formLabel: {
    textAlign: 'right'
  },
  btns: {
    margin: '25px 0'
  },
  huise: {
    color: '#CFCFCF'
  },
  resetBtn: {
    marginLeft: '20px'
  }
};
