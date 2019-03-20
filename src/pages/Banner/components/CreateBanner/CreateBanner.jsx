import React, {Component} from 'react';
import axios from 'axios';
import uploadUrl, {ajaxTo} from '../../../../util/util';
import IceContainer from '@icedesign/container';
import { Feedback } from '@icedesign/base';
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
  Tab
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload}=Upload;

const TabPane = Tab.TabPane;
const tabs = [
  { tab: "轮播图列表", key: 0, content: "/bannerList"},
  { tab: "轮播图编辑", key: 1, content: "/banner/bannercreate"},
];

// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;

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

export default class CreateBanner extends Component {
  static displayName = 'CreateBanner';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg:'',
      value: {
        bannername:'',
        bannerstatus: false,
      },
      getAllClass:""
    };
  }

  componentWillMount(){

  }

  // componentDidMount(){
  //   const activityId = this.props.history.params.activityId;
  //   // 正确获取到activityId的值，去获取他的值
  //   if(activityId != 'bannercreate'){
  //     ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=appbanner&do=edit',{'bannerid':activityId})
  //     .then((res)=>{
  //       console.log(res)
  //       const currentData=res.data;
  //       console.log(activityId);
  //       // 返回的信息
  //       this.setState({
  //         value:{
  //           bannername:currentData.bannername,
  //           bannericon:currentData.bannericon,
  //           bannerstatus:currentData.bannerstatus=='1'?true:false,
  //         },
  //         logoImg:currentData.bannericon
  //       })
  //     })
  //   }else{
  //     const allClass = this.state;
  //     console.log(allClass);
  //     // this.setState({
  //     //   value:{
  //     //     appclass:this.state.getAllClass,
  //     //   }
  //     // })
  //   }
  // }

  onChange(checked) {
    var that = this;
    const nameValue = that.props.name;
    console.log(checked)
    console.log(nameValue);
    this.setState({
      value:{
        bannerstatus:false,
        apprecommend:false
      }
    })
  }

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
  onFormChange = (value) => {
    // this.setState({value});
  };

  onDragOver= () =>{
    console.log("dragover callback");
  }

  onDrop= (fileList) => {
    console.log("drop callback : ", fileList);
  }
  onFileChange=(file)=>{
    // console.log(file.file.imgURL);
    const iconImg = 'https://app.yongketong.cn/'+file.file.imgURL;
    console.log(iconImg);
    // this.setState({
    //   iconImg
    // })
  }

  reset = () => {
    this.setState({
      value: {
        bannername:'',
        bannerstatus: false,
      },
      logoImg:''
    });
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.history.router.push(url);
  }

  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      if (error) {

      }
      //
      console.log(that.props);

      //
      const dataAry = {...that.formRef.props.value,logoImg:that.state.logoImg,bannerid:this.props.history.params.activityId}
      console.log(that.formRef.props.value);

      //修改区
      const newrequestUrl=this.props.history.params.activityId=='bannercreate'?'api.php?entry=sys&c=app&a=appbanner&do=insert':'api.php?entry=sys&c=app&a=appbanner&do=update';
      console.log(newrequestUrl);
      const result =ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function(){
          that.props.history.router.push('/bannerList');
        },1000);
        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })

      // console.log(this.formRef.props.value.name)
    });
  };

  render() {
    const defultClass=this.state.getAllClass;

    const styleP={
      paddingBottom:'25px'
    }
    if(this.state.getAllClass){
      var allClassL=[];
      const allClass=this.state.getAllClass.map((item,i)=>{
        return allClassL.push({
                    label: item.sorttitle,
                    value: item.id
                  })
      })
    }

    return (<div className="create-activity-form">
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <Tab onChange={this.tabChange} defaultActiveKey={1}>
              {tabs.map(item => (
                <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

                </TabPane>
              ))}
            </Tab>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                标题：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="bannername" required={true} message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="bannername"/>
              </Col>
            </Row>


            <Row style={styleP}>
              <Col  xxs="6" s="2" l="2" style={styles.formLabel}>
                icon：
              </Col>
              <Col s="12" l="10">
                  <Upload
                    style={{
                      display: "block",
                      textAlign: "center",
                      width: "120px",
                      height: "120px",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "12px"
                    }}
                    action='https://app.yongketong.cn/api.php?entry=sys&c=account&a=upload'
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={this.onSuccess}
                    onError={this.onError}
                  >
                  {this.state.logoImg ?
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
                  }
                </Upload>
              </Col>
            </Row>





            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                状态：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="bannerstatus">
                  <SwitchForForm defaultChecked={this.state.value.bannerstatus}/>
                </IceFormBinder>
              </Col>
            </Row>


            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>

              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {this.props.history.params.activityId != 'bannercreate' ? '保存' : '立即创建'}
                </Button>
                <Button style={styles.resetBtn} onClick={this.reset}>
                  重置
                </Button>
              </Col>
            </Row>
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
  }
};
