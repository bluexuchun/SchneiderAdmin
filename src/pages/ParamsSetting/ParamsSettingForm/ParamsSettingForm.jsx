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

export default class ParamsSettingForm extends Component {
  static displayName = 'ParamsSettingForm';

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
      getAllClass: ""
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

  componentDidMount(){
     // 正确获取到activityId的值，去获取他的值
      ajaxTo('api.php?entry=sys&c=setting&a=setting&do=qiniuList')
      .then((res)=>{
        console.log(res)
        const currentData=res.data;
        console.log(currentData);
         // 返回的信息
        this.setState({
          value:{
            AccessKey:currentData.AccessKey,
            SecretKey:currentData.SecretKey,
            Bucket:currentData.Bucket,
            Url:currentData.Url,
            // appstatus:currentData.appstatus=='1'?true:false,
            // appid:currentData.appid,
            // apprecommend:currentData.isRecommend=='1'?true:false,
            // appbibei:currentData.appbibei == '1' ? true : false,
            // appdetail:currentData.appdetail,
            // isapp:currentData.isapp == '1' ? true : false
          },
        })
      })
  }


  onChange(value) {
    this.setState({
        QRcode:value
    });
  }
  onChange1(value) {
    this.setState({
        chit:value
    });
  }

  onChange2(value) {
    this.setState({
        homestyle:value
    });
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
        ...that.formRef.props.value
      }
      console.log(that.formRef.props.value);
      // console.log(that.state)
      //修改区

      const result = ajaxTo('api.php?entry=sys&c=setting&a=setting&do=qiniu', dataAry);
      console.log(dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        // setTimeout(function() {
        //   that.props.history.router.push('/activityList');
        // }, 1000);

        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })

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
      <IceContainer style={styles.container} title="参数设置">
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <IcePanel style={styles.jianxi}>
              <IcePanel.Header>
                七牛存储设置
              </IcePanel.Header>
              <IcePanel.Body>
                <div>
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *七牛AccessKey：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="AccessKey">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="AccessKey"/>
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
                      *七牛SecretKey：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="SecretKey">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="SecretKey"/>
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *七牛Bucket：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="Bucket">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="Bucket"/>
                    </Col>
                  </Row>

                  {/* <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *七牛队列名：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="columnname" required={false} message="标题名称必须填写">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="columnname"/>
                    </Col>
                  </Row>

                  <Row style={styles.huise}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                    <Col s="12" l="10">
                      媒体转码队列名,声音文件需要转码后才能在安卓和苹果上使用
                    </Col>
                  </Row> */}

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *七牛访问域名：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="Url">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="Url"/>
                    </Col>
                  </Row>
                  <Row style={styles.huise}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                    <Col s="12" l="10">
                      七牛上可以绑定自己的域名来访问资源,此处填写绑定到七牛的域名
                    </Col>
                  </Row>

                  {/* <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      状态：
                    </Col>
                    <Col s="12" l="10">
                      <IceFormBinder name="appstatus">
                        <SwitchForForm defaultChecked={this.state.value.appstatus}/>
                      </IceFormBinder>
                    </Col>
                  </Row> */
                  }






                </div>
              </IcePanel.Body>
            </IcePanel>

            {/* <IcePanel style={styles.jianxi}>
              <IcePanel.Header>
                直播设置
              </IcePanel.Header>
              <IcePanel.Body>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    课程开始模板消息：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="subjecttext" required={false} message="标题名称必须填写">
                      <Input style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="subjecttext"/>
                  </Col>
                </Row>

                <Row style={styles.huise}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                  <Col s="12" l="10">
                    课程即将开始时提醒,模板为 互联网|电子商务>>预约课程开始提醒<br />
                    （OPENTM405456204）
                  </Col>
                </Row>
                <Row style={{marginTop: '10px',color:'#CFCFCF'}}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                  <Col s="12" l="10">
                    您预约的课程即将开始！<br/>
                    课程名称：《28天口语训练营》<br/>
                    开始时间：2016-06-02 19:00<br/>
                    点击查看详情。
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    购买成功模板消息：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="successmode" required={false} message="标题名称必须填写">
                      <Input style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="successmode"/>
                  </Col>
                </Row>

                <Row style={styles.huise}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                  <Col s="12" l="10">
                    购买成功提醒,模板为 互联网|电子商务>>购买成功通知<br />
                    （TM00001）
                  </Col>
                </Row>
                <Row style={{marginTop: '10px',color:'#CFCFCF'}}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                  <Col s="12" l="10">
                    您好，您已购买成功<br/>
                    商品信息：xx课程<br/>
                    点击查看详情。
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    审核通过模板消息：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="allowmode" required={false} message="标题名称必须填写">
                      <Input style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="allowmode"/>
                  </Col>
                </Row>

                <Row style={styles.huise}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                  <Col s="12" l="10">
                    开课提醒,模板为 互联网|电子商务>>审核通过提醒<br />
                    （OPENTM411793302）
                  </Col>
                </Row>
                <Row style={{marginTop: '10px',color:'#CFCFCF'}}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                  <Col s="12" l="10">
                    你好，你提交的资料已通过审核。<br/>
                    审核状态：通过审核<br/>
                    审核时间：2017年10月2日 18:00:20<br/>
                    点击查看详情。
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    提现限额设置：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="limit" required={false} message="标题名称必须填写">
                      <Input addonBefore="满" addonAfter="元可提现" style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="limit"/>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    直播间显示二维码：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="QRcode" required={false} message="标题名称必须填写">
                      <div>
                        <RadioGroup value={this.state.QRcode} onChange={this.onChange.bind(this)}>
                          <Radio id="boss" name="QRcode" value="boss">
                            平台的二维码
                          </Radio>
                          <Radio id="person" name="QRcode" value="person">
                            创建者上传的二维码
                          </Radio>
                        </RadioGroup>
                      </div>
                    </IceFormBinder>
                    <IceFormError name="QRcode"/>
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    *开启认证：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="renzheng">
                      <SwitchForForm defaultChecked={this.state.value.appstatus}/>
                    </IceFormBinder>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    *短信使用类型：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="chit" required={false} message="标题名称必须填写">
                      <div>
                        <RadioGroup value={this.state.chit} onChange={this.onChange1.bind(this)}>
                          <Radio id="old" value="old">
                            阿里大于(老版)
                          </Radio>
                          <Radio id="new" value="new">
                            阿里大于(新版)
                          </Radio>
                          <Radio id="date" value="date">
                            聚合数据
                          </Radio>
                        </RadioGroup>
                      </div>
                    </IceFormBinder>
                    <IceFormError name="chit"/>
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    平台分成比例：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="divide" required={false} message="标题名称必须填写">
                      <Input  addonAfter="%" style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="divide"/>
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    *首页展示样式：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="homestyle" required={false} message="标题名称必须填写">
                      <div>
                        <RadioGroup value={this.state.homestyle} onChange={this.onChange2.bind(this)}>
                          <Radio id="list"  value="list">
                            列表
                          </Radio>
                          <Radio id="list"  value="nine">
                            九宫格
                          </Radio>
                        </RadioGroup>
                      </div>
                    </IceFormBinder>
                    <IceFormError name="homestyle"/>
                  </Col>
                </Row>

              </IcePanel.Body>
            </IcePanel> */}

            {/* <IcePanel style={styles.jianxi}>
              <IcePanel.Header>
                聚合数据短信设置
              </IcePanel.Header>
              <IcePanel.Body>
                <div>
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *应用APPKEY：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="appkey" required={false} message="标题名称必须填写">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="appkey"/>
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *短信模板ID：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="chitid" required={false} message="标题名称必须填写">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="chitid"/>
                    </Col>
                  </Row>
                  <Row style={styles.huise}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                    <Col s="12" l="10">
                      短信模板ID，请参考个人中心短信模板设置
                    </Col>
                  </Row>
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      *短信模板内容变量：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="chitcontent" required={false} message="标题名称必须填写">
                        <Input style={{
                            width: '100%'
                          }}/>
                      </IceFormBinder>
                      <IceFormError name="chitcontent"/>
                    </Col>
                  </Row>
                  <Row style={styles.huise}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

                    <Col s="12" l="10">
                      例：亲，您的验证码为#code#,感谢您的支持! <br/>
                      则输入code即可
                    </Col>
                  </Row>
                </div>
              </IcePanel.Body>
            </IcePanel> */}

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
