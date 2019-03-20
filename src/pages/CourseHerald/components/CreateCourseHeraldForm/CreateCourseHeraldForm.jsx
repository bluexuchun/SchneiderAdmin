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
  Tab,
  TimePicker
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload}=Upload;
const TabPane = Tab.TabPane;

const tabs = [
  { tab: "课程预告列表", key: 0, content: "/courseheraldlist"},
  { tab: "新建课程预告", key: 1, content: "/courseherald/create"},
];

// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { MonthPicker, YearPicker, RangePicker } = DatePicker;

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

export default class CreateCourseHeraldForm extends Component {
  static displayName = 'CreateCourseHeraldForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg:'',
      value: {
        isapp:false,
        appstatus: false,
        appid:'',
        apprecommend:false,
        appbibei:false,
      },
      getAllClass:"",
      startdate:'',
      starttime:''
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
      ajaxTo('api.php?entry=sys&c=foreshow&a=foreshow&op=edit',{'fid':activityId})
      .then((res)=>{
        console.log(res)
        const currentData=res.data;
        console.log(currentData);
        // 返回的信息
        this.setState({
          value:{
            title:currentData.title,
            author:currentData.author,
            position:currentData.position,
            startdate:currentData.startdate,
            status:currentData.status=='1'?true:false,
            appid:currentData.appid,
            starttime:currentData.starttime,

          },
          starttime:currentData.starttime,
          startdate:currentData.startdate
        })
      })
    }else{
      const allClass = this.state;
      console.log(allClass);
      // this.setState({
      //   value:{
      //     appclass:this.state.getAllClass,
      //   }
      // })
    }
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
        title:'',
        author:'',
        position:'',
        startdate:'',
        status:false,
        appid:'',
        starttime:'',

      },
    })
  };

onChange11(date,formatDate){
  console.log(date,formatDate);
}
  submit = () => {
    console.log(this.state.startdate);
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
      const dataAry = {...that.formRef.props.value,startdate:this.state.startdate,starttime:this.state.starttime,logoImg:that.state.logoImg,fid:this.props.history.params.id}
      console.log(that.formRef.props.value);

      //修改区
      const newrequestUrl=this.props.history.params.id=='create'?'api.php?entry=sys&c=foreshow&a=foreshow&op=update':'api.php?entry=sys&c=foreshow&a=foreshow&op=update';
      console.log(newrequestUrl);
      const result =ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function(){
          that.props.history.router.push('/courseheraldlist');
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
    const data1=['YYYY-MM-DD', 'HH:mm:ss'];
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
                主题：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="title">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="title"/>
              </Col>
            </Row>



            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                主讲人：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="author">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="author"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                开始日期：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="startdate">
                  <DatePicker defaultValue={this.state.startdate} onChange={(val, str) => this.setState({startdate:str})}/>
                </IceFormBinder>
                <IceFormError name="startdate"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                开始时间：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="starttime" defaultValue={this.state.starttime}>
                  <TimePicker
                    format='HH:mm:ss'
                    onChange={(val, str) => this.setState({starttime:str})}
                    language="en-us"
                  />
                </IceFormBinder>
                <IceFormError name="starttime"/>
              </Col>
            </Row>

            {/* <Row style={styleP}>
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
            </Row> */}



            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                分类：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="appclass">
                  <Select className="next-form-text-align"  dataSource={allClassL}/>
                </IceFormBinder>
              </Col>
            </Row> */}



            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                状态：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="status">
                  <SwitchForForm defaultChecked={this.state.value.appstatus}/>
                </IceFormBinder>
              </Col>
            </Row>

            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                推荐：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="apprecommend">
                  <SwitchForForm defaultChecked={this.state.value.apprecommend}/>
                </IceFormBinder>
              </Col>
            </Row> */}

            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                必备：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="appbibei">
                  <SwitchForForm defaultChecked={this.state.value.appbibei}/>
                </IceFormBinder>
              </Col>
            </Row> */}

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                职业：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="position"  message="标题名称必须填写">
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
