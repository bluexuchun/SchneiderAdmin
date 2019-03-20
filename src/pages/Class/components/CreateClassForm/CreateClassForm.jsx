import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo} from '../../../../util/util';
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
  { tab: "标签管理", key: 0, content: "/classList"},
  { tab: "添加标签", key: 1, content: "/class/create"},
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

export default class CreateClassForm extends Component {
  static displayName = 'CreateClassForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg:'',
      value: {
        isapp:false,
        enabled: false,
        appid:'',
        apprecommend:false,
        appbibei:false,
        text_color:'',
        ground_color:''
      },
      getAllClass:""
    };
  }

  componentWillMount(){
    const that = this;
    ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=regulation&do=getallclass')
    .then(function(res){
      console.log(res);
      that.setState({
        getAllClass:res.data
      })
    })
  }

  componentDidMount(){
    const activityId = this.props.history.params.id;
    // 正确获取到activityId的值，去获取他的值
    if(activityId != 'create'){
      ajaxTo('api.php?entry=sys&c=tags&a=tags&op=edit',{'tid':activityId})
      .then((res)=>{
        console.log(res)
        const currentData=res.data;
        console.log(currentData);
        // 返回的信息
        this.setState({
          value:{
            tag_name:currentData.tag_name,
            enabled:currentData.enabled=='1'?true:false,
            appid:currentData.appid,
            displayorder:currentData.displayorder,
            text_color:currentData.text_color,
            ground_color:currentData.ground_color
          },
        })
      })
    }else{
      const allClass = this.state;
    }
  }


  onFormChange = (value) => {
    this.setState({value});
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
      value:{
        tag_name:'',
        enabled:false,
        displayorder:'',
        text_color:'',
        ground_color:''
      },
    })
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
      const dataAry = {...that.formRef.props.value,logoImg:that.state.logoImg,tid:this.props.history.params.id}
      console.log(that.formRef.props.value);

      //修改区
      const newrequestUrl=this.props.history.params.id=='create'?'api.php?entry=sys&c=tags&a=tags&op=update':'api.php?entry=sys&c=tags&a=tags&op=update';
      console.log(newrequestUrl);
      const result =ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function(){
          that.props.history.router.push('/classlist');
        },1000);

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
                标签：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="tag_name">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="tag_name"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                显示：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="enabled">
                  <SwitchForForm defaultChecked={this.state.value.enabled}/>
                </IceFormBinder>
              </Col>
            </Row>
            
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                文字颜色：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="text_color">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                底色：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="ground_color">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                排序：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="displayorder">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>

              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {this.props.history.params.id != 'create' ? '保存' : '立即创建'}
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
