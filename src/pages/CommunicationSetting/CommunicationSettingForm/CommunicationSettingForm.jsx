import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo} from '../../../util/util';
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
  Tab
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload} = Upload;
const TabPane = Tab.TabPane;


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

export default class CommunicationSettingForm extends Component {
  static displayName = 'CommunicationSettingForm';

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
        appbibei: false,

      },
      QRcode:'boss',
      chit:'date',
      homestyle:'list',
      getAllClass: "",
      logoImg:''
    };
    // this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    // const that = this;
    // ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=regulation&do=getallclass').then(function(res) {
    //   console.log(res);
    //   that.setState({getAllClass: res.data})
    // })
  }

  // componentDidMount(){
  //   const activityId = this.props.history.params.activityId;
  //    正确获取到activityId的值，去获取他的值
  //   if(activityId != 'create'){
  //     ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=regulation&do=edit',{'id':activityId})
  //     .then((res)=>{
  //       console.log(res)
  //       const currentData=res.data;
  //       console.log(currentData);
  //        返回的信息
  //       this.setState({
  //         value:{
  //           appname:currentData.appname,
  //           apphumen:currentData.apphumen,
  //           appicon:currentData.appicon,
  //           appclass:currentData.appclass,
  //           appstatus:currentData.appstatus=='1'?true:false,
  //           appid:currentData.appid,
  //           apprecommend:currentData.isRecommend=='1'?true:false,
  //           appbibei:currentData.appbibei == '1' ? true : false,
  //           appdetail:currentData.appdetail,
  //           isapp:currentData.isapp == '1' ? true : false
  //         },
  //         logoImg:currentData.appicon
  //       })
  //     })
  //   }else{
  //     const allClass = this.state;
  //     console.log(allClass);
  //      this.setState({
  //        value:{
  //          appclass:this.state.getAllClass,
  //        }
  //      })
  //   }
  // }

  onError=(file)=> {
     console.log('onError callback : ', file);
   }
   beforeUpload = (info) => {
     console.log('beforeUpload callback : ', info);
   }

   onSuccess = (res, file) => {
     console.log(res)
     Feedback.toast.success('上传成功');
     const logoImg = 'http://' + res.imgURL;
     this.setState({
       logoImg: logoImg
     })
   }
   onSuccess = (res, file) => {
     console.log(res)
     Feedback.toast.success('上传成功');
     const logoImg = 'http://' + res.imgURL;
     this.setState({
       logoImg: logoImg
     })
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


  // reset = () => {
  //   this.setState({
  //     value: {
  //       appname: '',
  //       isapp: false,
  //       appstatus: false,
  //       appid: '',
  //       apprecommend: false,
  //       apphumen: '',
  //       appdetail: '',
  //       appbibei: false
  //     },
  //     logoImg: ''
  //   });
  // };

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
      // console.log(that.state)
      //修改区
      // const newrequestUrl = this.props.history.params.activityId == 'create'
      //   ? 'api.php?entry=sys&c=app&a=regulation&do=insert'
      //   : 'api.php?entry=sys&c=app&a=regulation&do=update';
      // console.log(newrequestUrl);
      // const result = ajaxTo(newrequestUrl, dataAry);
      // console.log(dataAry);
      // result.then(function(res) {
      //   //这是成功请求返回的数据
      //   Feedback.toast.success(res.message);
      //   setTimeout(function() {
      //     that.props.history.router.push('/activityList');
      //   }, 1000);
      //
      //   console.log(res)
      // }, function(value) {
      //   //这是错误请求返回的信息
      // })

      // console.log(this.formRef.props.value.name)
    });
  };

  render() {
    const defultClass = this.state.getAllClass;

    const styleP = {
      paddingBottom: '25px'
    }
    if (this.state.getAllClass) {
      var allClassL = [];
      const allClass = this.state.getAllClass.map((item, i) => {
        return allClassL.push({label: item.sorttitle, value: item.id})
      })
    }

    return (<div className="create-activity-form">
      <IceContainer style={styles.container} title="云平台分享设置">
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <IcePanel style={styles.jianxi}>
              <IcePanel.Header>
                设置实时通讯相关信息(配置好请联系开发者)
              </IcePanel.Header>
              <IcePanel.Body>
                <div>
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *SdkAppId：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="SdkAppId" required={false} message="标题名称必须填写">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="SdkAppId"/>
                    </Col>
                  </Row>



                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *accountType：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="accountType" required={false} message="标题名称必须填写">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="accountType"/>
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *账号管理员：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="manager" required={false} message="标题名称必须填写">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="manager"/>
                    </Col>
                  </Row>

                  <Row style={styles.formItem1}>
                    <Col  xxs="6" s="2" l="2" style={styles.formLabel}>
                      *分享图片：
                    </Col>
                    <Col s="12" l="10">
                        <Upload
                          // style={{
                          //   display: "block",
                          //   textAlign: "center",
                          //   width: "120px",
                          //   height: "120px",
                          //   border: "1px solid black",
                          //   borderRadius: "5px",
                          //   fontSize: "12px"
                          // }}
                          listType="text"
                          type="file"
                          action='https://app.yongketong.cn/api.php?entry=sys&c=account&a=upload'
                          // accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                          name="filename"
                          beforeUpload={this.beforeUpload}
                          onSuccess={this.onSuccess}
                          onError={this.onError}
                        >
                        {/* {this.state.logoImg ?
                          <Img
                            width={120}
                            height={120}
                            src={this.state.logoImg}
                            type="cover"
                            style={{
                              borderRadius:"5px"
                            }}
                          />
                          :
                          <div style={{ width:"120px",height:"120px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer",border:"1px dashed #aaa",borderRadius:"5px"}}>
                            <div style={{ color:"#3080FE",fontSize:"30px",width:"100%",textAlign:"center"}}>+</div>
                            <div style={{ color:"#3080FE",fontSize:"14px",width:"100%",textAlign:"center"}}>上传图片</div>
                          </div>
                        } */}
                        <Button type="primary" style={{ margin: "0 0 10px" }}>
                          上传文件
                        </Button>
                      </Upload>
                    </Col>
                  </Row>





                </div>
              </IcePanel.Body>
            </IcePanel>

            <IcePanel style={{
                marginBottom: '10px',
                border: 'none',
                backgroundColor: "#fff"
              }}>
              <IcePanel.Body>
                <Row style={styles.btns}>

                  <Col s="12" l="10">
                    <Button type="primary" onClick={this.submit}>
                      {/* {this.props.history.params.activityId != 'create' ? '保存' : '立即创建'} */}
                      提交
                    </Button>
                    {/* <Button style={styles.resetBtn} onClick={this.reset}>
                      重置
                    </Button> */
                    }
                  </Col>
                </Row>
              </IcePanel.Body>
            </IcePanel>
          </div>



        </IceFormBinderWrapper>
      </IceContainer>
    </div>);
  }
}

const styles = {
  jianxi:{
    marginBottom:"25px"
  },
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
    height: '125px',
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
  }
};
