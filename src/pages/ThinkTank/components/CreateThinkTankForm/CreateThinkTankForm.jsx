import React, {Component} from 'react';
import axios from 'axios';
import uploadUrl,{ajaxTo} from '../../../../util/util';
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
  { tab: "智库列表", key: 0, content: "/thinktanklist"},
  { tab: "新增智库", key: 1, content: "/thinktank/create"},
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

export default class CreateThinkTankForm extends Component {
  static displayName = 'CreateThinkTankForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      cover:'',
      value: {
        status:false,
        title:'',
      },
      gettype1:[],
    };
  }

  componentWillMount(){
    const that = this;
    ajaxTo('api.php?entry=sys&c=course&a=course&do=gettypes').then(function(res) {
      console.log(res);
      let testAry = [];
      for (let i = 0; i < res.data.length; i++) {
        testAry.push(res.data[i]);
      }
      that.setState({gettype1: testAry})
    });
  }

  componentDidMount(){
    const activityId = this.props.history.params.id;
    console.log(activityId);
    // 正确获取到activityId的值，去获取他的值
    if(activityId != 'create'){
      ajaxTo('api.php?entry=sys&c=library&a=depot&do=edit',{'id':activityId})
      .then((res)=>{
        const currentData=res.data;
        let newList = [];
        currentData.type.map((v,i) => {
          newList.push(Number(v));
        })
        // 返回的信息
        this.setState({
          value:{
            title:currentData.title,
            status:currentData.status=="1"?true:false,
            name:currentData.name,
            link:currentData.link,
            displayorder:currentData.displayorder
          },
          cover:currentData.cover,
          allClass:newList
        })
      })
    }else{
      const allClass = this.state;
    }
  }
  cateOnChange(selectedItems) {
    this.setState({allClass: selectedItems});
  }

 onError=(file)=> {
    console.log('onError callback : ', file);
  }
  beforeUpload = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess = (res, file) => {
    Feedback.toast.success('上传成功');
    const logoImg = 'https://' + res.imgURL;
    this.setState({
      cover: logoImg
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
    const iconImg = 'https://app.yongketong.cn/'+file.file.imgURL;
  }

  //添加表单
  addItem = () => {
    console.log(this.state.value.items);
    this.state.value.items.push({});
    this.setState({value: this.state.value});
  };

  formChange = value => {
    console.log('value', value);
    this.setState({value});
  };

  removeItem = (index) => {
    this.state.value.items.splice(index, 1);
    this.setState({value: this.state.value});
  }

  validateAllFormField = () => {
     this.refs.form.validateAll((errors, values) => {
      console.log('errors', errors, 'values', values);
    });
  };

  reset = () => {
    this.setState({
      value:{
        title:'',
        status:false,
        name:'',
        link:'',
      },
      cover:''
    })
  };

  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      if (error) {
        // 处理表单报错
      }

      const dataAry = {...that.formRef.props.value,cover:that.state.cover,id:this.props.history.params.id,type:that.state.allClass}

      //修改区
      const newrequestUrl=this.props.history.params.id=='create'?'api.php?entry=sys&c=library&a=depot&do=update':'api.php?entry=sys&c=library&a=depot&do=update';
      const result =ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function(){
          that.props.history.router.push('/thinktanklist');
        },1000);

      }, function(value) {
        //这是错误请求返回的信息
      })

    });
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    this.props.history.router.push(url);
  }

  render() {
    const defultType=this.state.gettype1;
    const defultClass=this.state.getAllClass;

    let list = [];
    this.state.gettype1.map((v,i) => {
      let item = {
        value:v.id,
        label:v.title
      }
      list.push(item);
    })

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
                <IceFormBinder name="title">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="title"/>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col  xxs="6" s="2" l="2" style={styles.formLabel}>
                封面：
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
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={this.onSuccess}
                    onError={this.onError}
                  >
                  {this.state.cover ?
                    <Img
                      width={120}
                      height={120}
                      src={this.state.cover}
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

            <Row>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                首页分类：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="allClass">
                  <CheckboxGroup
                    style={{height:'100%','display':'flex','flexDirection':'row','alignItems':'center'}}
                    value={this.state.allClass}
                    dataSource={list}
                    onChange={this.cateOnChange.bind(this)}
                  />
                </IceFormBinder>
              </Col>
            </Row>


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

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                链接：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder>
                  <Input name='link' style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <div><IceFormError name='link'/></div>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                排序：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder>
                  <Input name='displayorder' style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <div><IceFormError name='displayorder'/></div>
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
    lineHeight:'28px',
    textAlign: 'right'
  },
  btns: {
    margin: '25px 0'
  },
  resetBtn: {
    marginLeft: '20px'
  }
};
