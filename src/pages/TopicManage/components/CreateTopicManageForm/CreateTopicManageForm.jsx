import React, {Component} from 'react';
import axios from 'axios';
import uploadUrl,{ajaxTo} from '../../../../util/util';
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
  NumberPicker,
  TimePicker
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core, DragUpload} = Upload;
// const {DragUpload}=Upload;

const TabPane = Tab.TabPane;

const tabs = [
  {
    tab: "课程列表",
    key: 0,
    content: "/topicmanagelist"
  }, {
    tab: "新建课程",
    key: 1,
    content: "/topicmanage/create"
  }
];

// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const { Group: CheckboxGroup } = Checkbox;
const RadioGroup = Radio.Group;
const {MonthPicker, YearPicker, RangePicker} = DatePicker;
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

export default class CreateTopicManageForm extends Component {
  static displayName = 'CreateTopicManageForm';

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
        authority: []
      },
      allClass:[],
      getAllClass: [],
      editable: false,
      value: 0,
      homestyle: 'list',
      starttime: '',
      startdate: '',
      endtime: '',
      gettype:[],
      seleectArr: [
        {
          label: '图片',
          value: '1'
        }, {
          label: '视频/音频',
          value: '2'
        }
      ],

       num:""
    };
  }

  componentWillMount() {
    const that = this;
    const activityId = this.props.history.params.id;
    console.log(activityId);
     // 正确获取到activityId的值，去获取他的值
    if (activityId != 'create') {
      ajaxTo('api.php?entry=sys&c=course&a=course&do=edit', {'cid': activityId}).then((res) => {
        console.log(res)
        const currentData = res.data;
        console.log(currentData.tags[0]);
        let inter = [];
        currentData.type.map((v,i) => {
          console.log(v);
          inter.push(Number(v));
        })
        console.log(inter);
        // 返回的信息
        that.setState({
          value: {
            displayorder:currentData.displayorder,
            topic_desc: currentData.topic_desc,
            title: currentData.topic_name,
            author: currentData.guest_name,
            position: currentData.guest_position,
            section: currentData.guest_section,
            detail: currentData.guest_info,
            status: currentData.topic_status == '1'
              ? true
              : false,
            appid:currentData.appid,
            apprecommend:currentData.isRecommend=='1'?true:false,
            appbibei:currentData.appbibei == '1' ? true : false,
            appdetail:currentData.appdetail,
            isapp:currentData.isapp == '1' ? true : false,
            is_hot:currentData.is_hot == '1' ? true : false
          },
          topic_type:currentData.topic_type,
          logoImg: currentData.topic_icon,
          logoImg1:currentData.guest_imgs,
          logoImg2:currentData.share,
          logoImg3:currentData.share_icon,
          startdate: currentData.date,
          starttime: currentData.begin_time,
          endtime: currentData.end_time,
          class: currentData.tags,
          authority: currentData.tags,
          allClass:inter
        })
      })
    } else {
      const allClass = this.state;
      console.log(allClass);
       this.setState({
         value:{
           appclass:this.state.getAllClass,
         }
       })
    }


    ajaxTo('api.php?entry=sys&c=course&a=course&do=getTags').then(function(res) {
      console.log(res);
      let testAry = [];
      for (let i = 0; i < res.data.length; i++) {
        testAry.push(res.data[i]);
      }
      that.setState({getAllClass: testAry})
    });

    ajaxTo('api.php?entry=sys&c=course&a=course&do=gettype').then(function(res) {
      console.log(res);
      let testAry = [];
      for (let i = 0; i < res.data.length; i++) {
        testAry.push(res.data[i]);
      }
      that.setState({gettype: testAry})
    });

  }

  componentDidMount() {

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
    const logoImg = 'https://' + res.imgURL;
    this.setState({logoImg: logoImg})
  }
  onError1 = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload1 = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess1 = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg = 'https://' + res.imgURL;
    this.setState({logoImg1: logoImg})
  }
  onFormChange1 = (value) => {
     this.setState({value});
  };

  onError2 = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload2 = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess2 = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg2 = 'https://' + res.imgURL;
    this.setState({logoImg2: logoImg2})
  }

  onError3 = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload3 = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess3 = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg3 = 'https://' + res.imgURL;
    this.setState({logoImg3: logoImg3})
  }


  onDragOver = () => {
    console.log("dragover callback");
  }

  onDrop = (fileList) => {
    console.log("drop callback : ", fileList);
  }
  onFileChange = (file) => {
     console.log(file.file.imgURL);
    const iconImg = 'https://snd.widiazine.cn/' + file.file.imgURL;
    console.log(iconImg);
     this.setState({
       iconImg
     })
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
  onChange3(selectedItems) {
    console.log(selectedItems)
    this.setState({authority: selectedItems});

  }
  onChange4(selectedItems) {
    console.log(selectedItems)
    this.setState({allClass: selectedItems});

  }
onChangeSelect(value,option){
  console.log(value,option);
  this.setState({
    topic_type:value
  })
}
  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      console.log(value);
      if (error) {
        // 处理表单报错
      }
      // 提交当前填写的数据
      
      let newvalue = {...that.formRef.props.value}
      newvalue.is_hot = newvalue.is_hot ? '1' : '2'

      const dataAry = {
        ...newvalue,
        icon: that.state.logoImg,
        guest_imgs: that.state.logoImg1,
        share:that.state.logoImg2,
        share_icon:that.state.logoImg3,
        startdate: this.state.startdate,
        starttime: this.state.starttime,
        endtime: this.state.endtime,
        cid: this.props.history.params.id,
        topic_type:this.state.topic_type,
        class:this.state.authority,
        allClass:this.state.allClass,
      }
      console.log(that.formRef.props.value);

      // 修改区
      const newrequestUrl = this.props.history.params.id == 'create'
        ? 'api.php?entry=sys&c=course&a=course&do=update'
        : 'api.php?entry=sys&c=course&a=course&do=update';
      console.log(newrequestUrl);
      const result = ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      result.then(function(res) {
        // 这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/topicmanagelist');
        }, 1000);

        console.log(res)
      }, function(value) {
        // 这是错误请求返回的信息
      })

       console.log(this.formRef.props.value.name)
    });
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.history.router.push(url);
  }
  cateOnChange(selectedItems) {
    console.log("onChange callback", selectedItems);
    this.setState({
      allClass: selectedItems
    });
    console.log(this.state);
  }
  render() {
    console.log(this.state);
    const defultClass = this.state.getAllClass;
    const defultType=this.state.gettype;

    console.log(this.state.gettype);
    let list = [];
    this.state.gettype.map((v,i) => {
      let item = {
        value:v.id,
        label:v.title
      }
      list.push(item);
    })

    const styleP = {
      paddingBottom: '25px'
    }

    const tagsList = [];
    const tagslists = this.state.value.authority;
     // console.log(tagslists.length);
    if (tagslists) {
      for (var i in tagslists) {
        tagsList.push(tagslists[i]);
      }
    }
    console.log(tagsList[0]);

    var allClassL = [];


    console.log(this.state.starttime, this.state.endtime);
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
                <IceFormError name="displayorder"/>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                封面：
              </Col>
              <Col s="12" l="10">
                <Upload style={{
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
                  name="filename" beforeUpload={this.beforeUpload}
                  onSuccess={this.onSuccess}
                  onError={this.onError}>
                  {
                    this.state.logoImg
                      ? <Img width={120} height={120} src={this.state.logoImg} type="cover" style={{
                            borderRadius: "5px"
                          }}/>
                      : <div style={{
                            width: "120px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            border: "1px dashed #aaa",
                            borderRadius: "5px"
                          }}>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "30px",
                              width: "100%",
                              textAlign: "center"
                            }}>+</div>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "14px",
                              width: "100%",
                              textAlign: "center"
                            }}>上传图片</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                老师头像：
              </Col>
              <Col s="12" l="10">
                <Upload style={{
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
                  beforeUpload={this.beforeUpload1}
                  onSuccess={this.onSuccess1}
                  onError={this.onError1}>
                  {
                    this.state.logoImg1
                      ? <Img width={120} height={120} src={this.state.logoImg1} type="cover" style={{
                            borderRadius: "5px"
                          }}/>
                      : <div style={{
                            width: "120px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            border: "1px dashed #aaa",
                            borderRadius: "5px"
                          }}>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "30px",
                              width: "100%",
                              textAlign: "center"
                            }}>+</div>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "14px",
                              width: "100%",
                              textAlign: "center"
                            }}>上传图片</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                分享图片：
              </Col>
              <Col s="12" l="10">
                <Upload style={{
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
                  beforeUpload={this.beforeUpload2}
                  onSuccess={this.onSuccess2}
                  onError={this.onError2}>
                  {
                    this.state.logoImg2
                      ? <Img width={120} height={120} src={this.state.logoImg2} type="cover" style={{
                            borderRadius: "5px"
                          }}/>
                      : <div style={{
                            width: "120px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            border: "1px dashed #aaa",
                            borderRadius: "5px"
                          }}>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "30px",
                              width: "100%",
                              textAlign: "center"
                            }}>+</div>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "14px",
                              width: "100%",
                              textAlign: "center"
                            }}>上传图片</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                课程分享显示图片：
              </Col>
              <Col s="12" l="10">
                <Upload style={{
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
                  beforeUpload={this.beforeUpload3}
                  onSuccess={this.onSuccess3}
                  onError={this.onError3}>
                  {
                    this.state.logoImg3
                      ? <Img width={120} height={120} src={this.state.logoImg3} type="cover" style={{
                            borderRadius: "5px"
                          }}/>
                      : <div style={{
                            width: "120px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            border: "1px dashed #aaa",
                            borderRadius: "5px"
                          }}>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "30px",
                              width: "100%",
                              textAlign: "center"
                            }}>+</div>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "14px",
                              width: "100%",
                              textAlign: "center"
                            }}>上传图片</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                老师：
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
                老师职业：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="position">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="position"/>
              </Col>
            </Row>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                老师所属部门：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="section">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="section"/>
              </Col>
            </Row>

            <Row style={styles.formItem1}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                老师简介：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="detail">
                  <Input style={{
                      width: '100%'
                    }} multiple="multiple"/>
                </IceFormBinder>
                <IceFormError name="detial"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                课程类型：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="topic_type">
                  <Select className="next-form-text-align" onChange={this.onChangeSelect.bind(this)} value={this.state.topic_type} dataSource={this.state.seleectArr}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem1}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                课程简介：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="topic_desc">
                  <Input style={{
                      width: '100%'
                    }} multiple="multiple"/>
                </IceFormBinder>
                <IceFormError name="topic_desc"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                开始日期：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="startdate">
                  <DatePicker value={this.state.startdate} onChange={(val, str) => this.setState({startdate: str})}/>
                </IceFormBinder>
                <IceFormError name="startdate"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                开始时间：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="starttime">
                  <TimePicker format='HH:mm:ss' onChange={(val, str) => this.setState({starttime: str})} language="en-us" value={this.state.starttime}/>
                </IceFormBinder>
                <IceFormError name="begin_time"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                结束时间：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="endtime">
                  <TimePicker format='HH:mm:ss' onChange={(val, str) => this.setState({endtime: str})} language="en-us" value={this.state.endtime}/>
                </IceFormBinder>
                <IceFormError name="endtime"/>
              </Col>
            </Row>



            <Row style={{
                'height' : '150px'
              }}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                标签：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="class">
                  <CheckboxGroup value={this.state.authority} onChange={this.onChange3.bind(this)}>

                    {
                      defultClass.map((i, value) => (<Checkbox indeterminate="indeterminate" style={{}} id={i.id} value={i.tag_name}>
                        {i.tag_name}
                      </Checkbox>))
                    }

                  </CheckboxGroup>
                </IceFormBinder>
              </Col>
            </Row>


            <Row style={{
                'height' : '150px'
              }}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                首页分类：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="allClass">
                  <CheckboxGroup
                    value={this.state.allClass}
                    dataSource={list}
                    onChange={this.cateOnChange.bind(this)}
                  />
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                热门：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="is_hot">
                  <SwitchForForm defaultChecked={this.state.value.is_hot}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                显示/隐藏：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="status">
                  <SwitchForForm defaultChecked={this.state.value.status}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {
                    this.props.history.params.id!= 'create'
                      ? '保存'
                      : '立即创建'
                  }
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
