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
  NumberPicker
} from '@icedesign/base';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import './AllStyle.scss';

const {Row, Col} = Grid;
const {Core, DragUpload} = Upload;
// const {DragUpload}=Upload;
const TabPane = Tab.TabPane;
const {ImageUpload} = Upload;

const tabs = [
  {
    tab: "课程章节列表",
    key: 0,
    content: "/chaptermanagelist"
  }, {
    tab: "新建课程章节",
    key: 1,
    content: "/chaptermanage/create"
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
var currenNum = 1;
var  picArr = [];
export default class CreateChapterManageForm extends Component {
  static displayName = 'CreateChapterManageForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      audio: '',
      video: '',
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
      homestyle: 'list',
      allpic: [],
      isShow:true,
      isSelect:false,
      isJuage:true,
      logoImg:'',
      tid:'',
    };
  }

  componentWillMount() {
    picArr = [];
    const that = this;
    ajaxTo('api.php?entry=sys&c=chapter&a=chapter&do=getTopic').then(function(res) {
      that.setState({getAllClass: res.data})
    })
    ajaxTo('api.php?entry=sys&c=chapter&a=chapter&do=dataList').then(function(res){
      that.setState({getAllClass1: res.data})
    })
  }
  //
  componentDidMount() {
    const activityId = this.props.history.params.id;
    const that = this;
    // 正确获取到activityId的值，去获取他的值
    if (activityId != 'create') {
      ajaxTo('api.php?entry=sys&c=chapter&a=chapter&do=edit ', {'cid': activityId}).then((res) => {
        const currentData = res.data;
        // 返回的信息
        that.setState({
          value: {
            dataUrl:currentData.dataUrl,
            teacher:currentData.teacher,
            position:currentData.position,
            attachmentUrl:currentData.attachmentUrl,
            mobileattachmentUrl:currentData.mobileattachmentUrl,
            video: currentData.videoUrl,
            title: currentData.title,
            tid: currentData.tid,
            dataId:currentData.dataId,
            displayorder: currentData.displayorder,
            duration:currentData.duration,
            status: currentData.status == '1'
              ? true
              : false,
            hidden: currentData.hidden == '1'
              ? true
              : false,
            allhidden: currentData.allhidden == '1'
              ? true
              : false,
          },
          tid: currentData.tid,
          allpic: currentData.attachment,
          logoImg: currentData.image,
          description:currentData.rich,
          isSelect:true,
          editorOption: {
            height: 400,
            contentFormat: 'html',
            initialContent: res.data.rich,
            placeholder: '关于我们...',
            onChange: that.richTextOnchange,
            onRawChange: that.handleRawChange,
          }

        })
      })
    } else {
      const allClass = that.state;
      that.setState({
        editorOption: {
          height: 400,
          contentFormat: 'html',
          placeholder: '关于我们...',
          onChange: that.richTextOnchange,
          onRawChange: that.handleRawChange,
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



  onError2 = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload2 = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess2 = (res, file) => {
    console.log(res)
    console.log('111');
    Feedback.toast.success('上传成功');
    const logoImg2 = {
      'imgURL': 'https://' + res.imgURL
    };

    picArr.push(logoImg2);
    console.log(picArr);
    // var currentname='allpic'+currenNum++;
    this.setState({allpic: picArr})
    console.log(this.state.allpic);
  }

  onChange3(info) {
    console.log("onChane callback : ", info);
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

  richTextOnchange = (value) => {
    console.log(this.state.editorOption);
    console.log(value);
    this.setState({description: value})
  }

  uploadMedia = (param) => {
    console.log(param);
    const serverURL = uploadUrl
    const xhr = new XMLHttpRequest
    const fd = new FormData()
    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
    console.log(param.libraryId)

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      console.log(response);
      const result = eval('(' + xhr.responseText + ')');
      const imgUrl = 'https://' + result.imgURL;
      param.success({url: imgUrl})
    }

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({msg: 'unable to upload.'})
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('filename', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  }

  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      // console.log('error', error, 'value', value);
      if (error) {
        // 处理表单报错
      }
      const dataAry = {
        ...that.formRef.props.value,
        allpic: this.state.allpic,
        cid: this.props.history.params.id,
        rich:this.state.description,
        image:this.state.logoImg,
        tid:this.state.tid
      }

      //修改区
      const newrequestUrl = this.props.history.params.id == 'create'
        ? 'api.php?entry=sys&c=chapter&a=chapter&do=updates'
        : 'api.php?entry=sys&c=chapter&a=chapter&do=updates';
      const result = ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/chaptermanagelist');
        }, 1000);

      }, function(value) {
        //这是错误请求返回的信息
      })

    });
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.history.router.push(url);
  }

  onChangeSelect = (value,option) => {
    this.setState({
      tid:value
    })
    const classes = this.state.getAllClass;
    for (var i in classes) {
      if(classes[i].id == value){
        console.log(classes[i].topic_type);
        classes[i].topic_type=="1"?this.setState({isShow:true,isJuage:false}):this.setState({isShow:true,isJuage:true})
      }
    }
  }

  onChangeSelect1 = (value,option) => {

    console.log(value);
    console.log(option);
    this.setState({
      dataId:value
    })

  }

  render() {
    const media = {
      allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
      image: true, // 开启图片插入功能
      video: true, // 开启视频插入功能
      audio: true, // 开启音频插入功能
      validateFn: null, // 指定本地校验函数，说明见下文
      uploadFn: this.uploadMedia, // 指定上传函数，说明见下文
      removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
      onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
      onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
      onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
    };
    const editorProps = {...this.state.editorOption,media};

    const defultClass = this.state.getAllClass;
    const defultClass1 = this.state.getAllClass1;
    var currentArr = [];
    var currentArr1=[];
    if (defultClass) {
      defultClass.map((i, value) => {
        currentArr.push({label: i.topic_name, value: i.id})
      })
    }
    if (defultClass1) {
      defultClass1.map((i, value) => {
        currentArr1.push({label: i.title, value: i.id})
      })
    }


    const styleP = {
      paddingBottom: '25px'
    }

    var allClassL = [
      {
        label: '数字直播',
        value: '1'
      }
    ];

    const defaultImgList = [];
    if(this.state.allpic){
        if(this.state.allpic!='false'){
          this.state.allpic.map((i,value)=>{
            const imgInfo = {
              name:'IMG.png',
              status:'done',
              downloadURL:i.imgURL,
              fileURL:i.imgURL,
              imgURL:i.imgURL
            }
            defaultImgList.push(imgInfo);
          })
        }
    }


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
                文章标题：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="title">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="appname"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                所属课程：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="tid">
                  <Select disabled={this.state.isSelect} className="next-form-text-align" dataSource={currentArr} onChange={this.onChangeSelect.bind(this)}/>
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
                <IceFormError name="displayorder"/>
              </Col>
            </Row>
            <Row style={styles.formItem} className={this.state.isJuage?'allstyle1':'allstyle'}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel} className='float-l'>
                视频URL：
              </Col>

              <Col s="12" l="10"  className='float-l'>
                <IceFormBinder name="video">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="video"/>
              </Col>
              <div style={{'clear':'both'}}></div>
            </Row>

            <Row style={styles.formItem}  className={this.state.isJuage?'allstyle1':'allstyle'}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel} className='float-l'>
                音频URL：
              </Col>

              <Col s="12" l="10" className='float-l'>
                <IceFormBinder name="audio">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="audio"/>
              </Col>
              <div style={{'clear':'both'}}></div>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                时长：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="duration">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="duration"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                全部隐藏：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="allhidden">
                  <SwitchForForm defaultChecked={this.state.value.allhidden}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                部分隐藏：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="hidden">
                  <SwitchForForm defaultChecked={this.state.value.hidden}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={{
              'marginBottom':'10px'
            }}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                静帧图：
              </Col>
              <Col s="12" l="10" style={{'float':'left'}}>
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
                  beforeUpload={this.beforeUpload}
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
              <div style={{'clear':'both'}}></div>
            </Row>



            <Row  style={this.state.isShow ? {'display':'block'}:{'display':'none'}}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                课件(ppt图片)：
              </Col>
              <Col s="12" l="10" style={{'float':'left'}}>
                {/*
                  { this.state.allpic ?
                  this.state.allpic.map((v,i)=>(
                    <Img
                      enableAliCDNSuffix={true}
                      width={200}
                      height={100}
                      src={v.imgURL}
                    />
                  )) : '2'}
                */}
                <ImageUpload
                  listType="picture-card"
                  action={uploadUrl}
                  accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                  locale={{
                    image: {
                      cancel: "取消上传",
                      addPhoto: "上传图片"
                    }
                  }}
                  name="filename"
                  beforeUpload={this.beforeUpload2}
                  onChange={this.onChange3}
                  onSuccess={this.onSuccess2}
                  onError={this.onError2}
                  fileList={defaultImgList}
                />

              </Col>
              <div style={{'clear':'both'}}></div>
            </Row>
            <Row style={styles.formItem}  className={this.state.isJuage?'allstyle1':'allstyle'}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel} className='float-l'>
                课件下载URL：
              </Col>

              <Col s="12" l="10" className='float-l'>
                <IceFormBinder name="attachmentUrl">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="attachmentUrl"/>
              </Col>
              <div style={{'clear':'both'}}></div>
            </Row>

            <Row style={styles.formItem}  className={this.state.isJuage?'allstyle1':'allstyle'}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel} className='float-l'>
                课件下载PDF：
              </Col>

              <Col s="12" l="10" className='float-l'>
                <IceFormBinder name="mobileattachmentUrl">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="mobileattachmentUrl"/>
              </Col>
              <div style={{'clear':'both'}}></div>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                老师：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="teacher">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="teacher"/>
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

            <Row className='public'>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                章节简介：
              </Col>
              <Col s="18" l="18">
                <div style={styles.richText}>
                  <BraftEditor {...editorProps} ref={(instance) => this.editorInstance = instance}/>
                </div>

              </Col>
            </Row>


            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                所属行业分类：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="dataId">
                  <Select  className="next-form-text-align" dataSource={currentArr1} onChange={this.onChangeSelect1.bind(this)}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}  className={this.state.isJuage?'allstyle1':'allstyle'}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel} className='float-l'>
                资料下载URL：
              </Col>

              <Col s="12" l="10" className='float-l'>
                <IceFormBinder name="dataUrl">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="dataUrl"/>
              </Col>
              <div style={{'clear':'both'}}></div>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                状态：
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
                    this.props.history.params.id != 'create'
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
    textAlign: 'right',
    'float':'left'
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
