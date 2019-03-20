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
  Tab
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload} = Upload;
const TabPane = Tab.TabPane;

const tabs = [
  {
    tab: "首页导航列表",
    key: 0,
    content: "/homenavmanagelist"
  }, {
    tab: "新建首页导航",
    key: 1,
    content: "/homenavmanage/create"
  }
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

export default class CreateHomeNavManageForm extends Component {
  static displayName = 'CreateChapterManageForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
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
      allpic: []
      // picLists:[]
      // num:""
    };
  }

  componentWillMount() {
    const that = this;
    ajaxTo('api.php?entry=sys&c=chapter&a=chapter&do=getTopic').then(function(res) {
      console.log(res);
      that.setState({getAllClass: res.data})
    })
  }
  //
  componentDidMount() {
    const activityId = this.props.history.params.id;
    // 正确获取到activityId的值，去获取他的值
    if (activityId != 'create') {
      ajaxTo('api.php?entry=sys&c=chapter&a=chapter&do=edit ', {'cid': activityId}).then((res) => {
        console.log(res)
        const currentData = res.data;
        console.log(currentData);
        // 返回的信息
        this.setState({
          value: {
            title: currentData.title,
            tid: currentData.tid,
            displayorder: currentData.displayorder,
            // appclass:currentData.appclass,
            status: currentData.status == '1'
              ? true
              : false,
            // appid:currentData.appid,
            // apprecommend:currentData.isRecommend=='1'?true:false,
            // appbibei:currentData.appbibei == '1' ? true : false,
            // appdetail:currentData.appdetail,
            // isapp:currentData.isapp == '1' ? true : false
          },
          // logoImg:currentData.appicon
          allpic: currentData.attachment,
          audio: currentData.audio,
          video: currentData.videoUrl,
          description:currentData.rich,
          editorOption: {
            height: 400,
            contentFormat: 'html',
            initialContent: res.data.rich,
            placeholder: '关于我们...',
            onChange: this.richTextOnchange,
            onRawChange: this.handleRawChange,
            media: {
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
            }
          }

        })
      })
    } else {
      const allClass = this.state;
      console.log(allClass);
      this.setState({
        editorOption: {
          height: 400,
          contentFormat: 'html',
          placeholder: '关于我们...',
          onChange: this.richTextOnchange,
          onRawChange: this.handleRawChange,
          media: {
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
          }
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
    this.setState({audio: logoImg})
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
    const logoImg1 = 'http://' + res.imgURL;
    this.setState({video: logoImg1})
  }

  onError2 = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload2 = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess2 = (res, file) => {
    console.log(res)
    // console.log('111');
    Feedback.toast.success('上传成功');
    const logoImg2 = {
      'imgURL': 'http://' + res.imgURL
    };

    picArr.push(logoImg2);
    console.log(picArr);
    // var currentname='allpic'+currenNum++;
    this.setState({allpic: picArr})
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
    this.setState({description: value})
  }

  uploadMedia = (param) => {
    const serverURL = 'http://snd.widiazine.cn/api.php?entry=sys&c=account&a=upload'
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
    console.log(param.libraryId)

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址

      const result = eval('(' + xhr.responseText + ')');
      const imgUrl = 'http://' + result.imgURL;
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
      // 提交当前填写的数据
      //
      console.log(that.props);

      //
      const dataAry = {
        ...that.formRef.props.value,
        audio: that.state.audio,
        video: this.state.vidoe,
        allpic: this.state.allpic,
        cid: this.props.history.params.id,
        rich:this.state.description
      }
      console.log(that.formRef.props.value);

      //修改区
      const newrequestUrl = this.props.history.params.id == 'create'
        ? 'api.php?entry=sys&c=chapter&a=chapter&do=updates'
        : 'api.php?entry=sys&c=chapter&a=chapter&do=updates';
      console.log(newrequestUrl);
      const result = ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      console.log(this.state)
      result.then(function(res) {
        console.log(res)
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/chaptermanagelist');
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
    var currentArr = [];
    if (defultClass) {
      defultClass.map((i, value) => {
        currentArr.push({label: i.topic_name, value: i.id})
      })
    }
    const askjdhkjahsjkd = [];
    // if(this.state.allpic){
    //   this.state.allpic.map((i, v) => {
    //     console.log(i.imgURL);
    //     askjdhkjahsjkd.push({name: "pic.png", fileName: "pic.png", status: "done", size: 1000, imgURL: i.imgURL})
    //   });
    // }


    const styleP = {
      paddingBottom: '25px'
    }

    var allClassL = [
      {
        label: '数字直播',
        value: '1'
      }
    ];

    const AllPic = this.state.allpic;
    console.log(AllPic);
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
                <IceFormBinder name="title" required={true} message="标题名称必须填写">
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
                  <Select className="next-form-text-align" dataSource={currentArr}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                排序：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="displayorder" required={true} message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="appname"/>
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

            {/* <Row style={styles.formItem1}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                *课程介绍：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="appid" required={true} message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }} multiple />
                </IceFormBinder>
                <IceFormError name="appid"/>
              </Col>
            </Row> */
            }

            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                *排课计划：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="appdetail" required={true} message="标题名称必须填写">
                  <NumberPicker
                    onChange={this.onChange.bind(this)}
                    value={this.state.num}
                    editable={this.state.editable}
                  />
                </IceFormBinder>
                <IceFormError name="appdetail"/>
              </Col>
            </Row> */
            }
            {/* <Row style={styles.huise}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>

              <Col s="12" l="10">
                媒体转码队列名,声音文件需要转码后才能在安卓和苹果上使用
              </Col>
            </Row>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                *系列课价格：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="apphumen"  message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
              </Col>
            </Row> */
            }

            {/*
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                分类标签：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="appclass">
                  <RadioGroup value={this.state.homestyle} onChange={this.onChange2.bind(this)}>
                    <Radio id="list"  value="list">
                      mmm
                    </Radio>

                  </RadioGroup>
                </IceFormBinder>
              </Col>
            </Row> */
            }

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                音频上传：
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
                  }} action='http://snd.widiazine.cn/api.php?entry=sys&c=upload&a=upload&do=upload' accept="audio" name="filename" beforeUpload={this.beforeUpload} onSuccess={this.onSuccess} onError={this.onError}>
                  {
                    this.state.audio
                      ? <Img width={120} height={120} src={this.state.audio} type="cover" style={{
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
                            }}>上传音频</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                视频上传：
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
                  }} action='http://snd.widiazine.cn/api.php?entry=sys&c=upload&a=upload&do=upload' name="filename" beforeUpload={this.beforeUpload1} onSuccess={this.onSuccess1} onError={this.onError1}>
                  {
                    this.state.video
                    ? <Img width={120} height={120} src={this.state.video} type="cover" style={{
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
                          }}>上传音频</div>
                      </div>
                  }
                </Upload>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                概括图片：
              </Col>
              <Col s="12" l="10">

                <ImageUpload listType="picture-card" action="http://snd.widiazine.cn/api.php?entry=sys&c=upload&a=upload&do=upload" accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp" locale={{
                    image: {
                      cancel: "取消上传",
                      addPhoto: "上传图片"
                    }
                  }} name="filename" beforeUpload={this.beforeUpload2}
                  // onChange={this.onChange3}
                  onSuccess={this.onSuccess2} onError={this.onError2}
                  // defaultFileList={allpic}

                />

              </Col>
            </Row>

            <Row className='public'>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                添加文本：
              </Col>
              <Col s="18" l="18">
                <div style={styles.richText}>
                  <BraftEditor {...this.state.editorOption} ref={(instance) => this.editorInstance = instance}/>
                </div>

              </Col>
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

// export default class CreateHomeNavManageForm extends Component {
//   static displayName = 'CreateHomeNavManageForm';
//
//   static defaultProps = {};
//
//   constructor(props) {
//     super(props);
//     console.log(this.props);
//     this.state = {
//       logoImg: '',
//       value: {
//         isapp: false,
//         appstatus: false,
//         appid: '',
//         apprecommend: false,
//         appbibei: false
//       },
//       getAllClass: "",
//       dataSource: [
//         {
//           label: '外部链接',
//           value: '1'
//         }, {
//           label: '内部链接',
//           value: '2'
//         }
//       ],
//       icontype: 'sty'
//
//     };
//   }
//
//   // componentWillMount(){
//   //   const that = this;
//   //   ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=regulation&do=getallclass')
//   //   .then(function(res){
//   //     console.log(res);
//   //     that.setState({
//   //       getAllClass:res.data
//   //     })
//   //   })
//   // }
//
//   componentDidMount() {
//     const activityId = this.props.history.params.id;
//     // 正确获取到activityId的值，去获取他的值
//     if (activityId != 'create') {
//       ajaxTo('api.php?entry=sys&c=navbar&a=navbarManage&op=edit', {'nid': activityId}).then((res) => {
//         console.log(res)
//         const currentData = res.data;
//         console.log(currentData);
//         // 返回的信息
//         this.setState({
//           value: {
//             title: currentData.title,
//             url: currentData.url,
//             seq: currentData.seq,
//             // appclass:currentData.appclass,
//             // appstatus:currentData.appstatus=='1'?true:false,
//             // appid:currentData.appid,
//             // apprecommend:currentData.isRecommend=='1'?true:false,
//             // appbibei:currentData.appbibei == '1' ? true : false,
//             // appdetail:currentData.appdetail,
//             // isapp:currentData.isapp == '1' ? true : false
//           },
//           logoImg: currentData.icon
//         })
//       })
//     } else {
//       const allClass = this.state;
//       console.log(allClass);
//       // this.setState({
//       //   value:{
//       //     appclass:this.state.getAllClass,
//       //   }
//       // })
//     }
//   }
//
//   onError = (file) => {
//     console.log('onError callback : ', file);
//   }
//   beforeUpload = (info) => {
//     console.log('beforeUpload callback : ', info);
//   }
//
//   onSuccess = (res, file) => {
//     console.log(res)
//     Feedback.toast.success('上传成功');
//     const logoImg = 'http://' + res.imgURL;
//     this.setState({logoImg: logoImg})
//   }
//   onFormChange = (value) => {
//     this.setState({value});
//   };
//
//   onDragOver = () => {
//     console.log("dragover callback");
//   }
//
//   onDrop = (fileList) => {
//     console.log("drop callback : ", fileList);
//   }
//   onFileChange = (file) => {
//     // console.log(file.file.imgURL);
//     const iconImg = 'https://app.yongketong.cn/' + file.file.imgURL;
//     console.log(iconImg);
//     // this.setState({
//     //   iconImg
//     // })
//   }
//   onChange1(icontype) {
//     this.setState({'icontype': icontype})
//   }
//   reset = () => {
//     this.setState({
//       value: {
//         appname: '',
//         isapp: false,
//         seq: false,
//         appid: '',
//         apprecommend: false,
//         apphumen: '',
//         appdetail: '',
//         appbibei: false
//       },
//       logoImg: ''
//     });
//   };
//
//   submit = () => {
//     const that = this;
//     that.formRef.validateAll((error, value) => {
//       // console.log('error', error, 'value', value);
//       if (error) {
//         // 处理表单报错
//       }
//       // 提交当前填写的数据
//       //
//       console.log(that.props);
//
//       //
//       const dataAry = {
//         ...that.formRef.props.value,
//         logoImg: that.state.logoImg,
//         nid: this.props.history.params.id
//       }
//       console.log(that.formRef.props.value);
//
//       //修改区
//       const newrequestUrl = this.props.history.params.id == 'create'
//         ? 'api.php?entry=sys&c=navbar&a=navbarManage&op=update'
//         : 'api.php?entry=sys&c=navbar&a=navbarManage&op=update';
//       console.log(newrequestUrl);
//       const result = ajaxTo(newrequestUrl, dataAry);
//       console.log(dataAry);
//       result.then(function(res) {
//         //这是成功请求返回的数据
//         Feedback.toast.success(res.message);
//         setTimeout(function() {
//           that.props.history.router.push('/homenavmanagelist');
//         }, 1000);
//
//         console.log(res)
//       }, function(value) {
//         //这是错误请求返回的信息
//       })
//
//       // console.log(this.formRef.props.value.name)
//     });
//   };
//
//   tabClick = (key) => {
//     const url = tabs[key].content;
//     console.log(url);
//     this.props.history.router.push(url);
//   }
//
//   render() {
//     const defultClass = this.state.getAllClass;
//
//     const styleP = {
//       paddingBottom: '25px'
//     }
//     if (this.state.getAllClass) {
//       var allClassL = [];
//       const allClass = this.state.getAllClass.map((item, i) => {
//         return allClassL.push({label: item.sorttitle, value: item.id})
//       })
//     }
//
//     return (<div className="create-activity-form">
//       <IceContainer style={styles.container}>
//         <IceFormBinderWrapper ref={(formRef) => {
//             this.formRef = formRef;
//           }} value={this.state.value} onChange={this.onFormChange}>
//           <div>
//             <Tab onChange={this.tabChange} defaultActiveKey={1}>
//               {tabs.map(item => (<TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
//             </Tab>
//             <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 *导航标题：
//               </Col>
//
//               <Col s="12" l="10">
//                 <IceFormBinder name="title" required={true} message="标题名称必须填写">
//                   <Input style={{
//                       width: '100%'
//                     }}/>
//                 </IceFormBinder>
//                 <IceFormError name="title"/>
//               </Col>
//             </Row>
//
//             {/* <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 *跳转方式：
//               </Col>
//               <Col s="12" l="10">
//                 <IceFormBinder name="gotolink">
//                   <Select className="next-form-text-align" defaultValue="1"  dataSource={this.state.dataSource}/>
//                 </IceFormBinder>
//               </Col>
//             </Row> */
//             }
//
//             <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 *外部链接地址：
//               </Col>
//
//               <Col s="12" l="10">
//                 <IceFormBinder name="url" required={true} message="标题名称必须填写">
//                   <Input style={{
//                       width: '100%'
//                     }}/>
//                 </IceFormBinder>
//                 <IceFormError name="url"/>
//               </Col>
//             </Row>
//
//             <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 *排序（从左至右）：
//               </Col>
//
//               <Col s="12" l="10">
//                 <IceFormBinder name="seq" required={true} message="标题名称必须填写">
//                   <Input style={{
//                       width: '100%'
//                     }}/>
//                 </IceFormBinder>
//                 <IceFormError name="seq"/>
//               </Col>
//             </Row>
//
//             {/* <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 *短信使用类型：
//               </Col>
//
//               <Col s="12" l="10">
//                 <IceFormBinder name="icontype" required={false} message="标题名称必须填写">
//                   <div>
//                     <RadioGroup value={this.state.icontype} onChange={this.onChange1.bind(this)}>
//                       <Radio id="ciontype1" value="sty">
//                         系统内置
//                       </Radio>
//                       <Radio id="icontype2" value="custom">
//                         自定义上传
//                       </Radio>
//                     </RadioGroup>
//                   </div>
//                 </IceFormBinder>
//                 <IceFormError name="icontype"/>
//               </Col>
//             </Row> */
//             }
//
//             {/* <Row style={styles.jianxi}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>
//
//               <Col s="12" l="10">
//                 请选择系统的默认图标或者自己上传图标
//               </Col>
//             </Row> */
//             }
//
//             <Row style={styleP}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 banner：
//               </Col>
//               <Col s="12" l="10">
//                 <Upload style={{
//                     display: "block",
//                     textAlign: "center",
//                     width: "120px",
//                     height: "120px",
//                     border: "none",
//                     borderRadius: "5px",
//                     fontSize: "12px"
//                   }} action='http://snd.widiazine.cn/api.php?entry=sys&c=upload&a=upload&do=upload' name="filename" beforeUpload={this.beforeUpload} onSuccess={this.onSuccess} onError={this.onError}>
//                   {
//                     this.state.logoImg
//                       ? <Img width={120} height={120} src={this.state.logoImg} type="cover" style={{
//                             borderRadius: "5px"
//                           }}/>
//                       : <div style={{
//                             width: "120px",
//                             height: "120px",
//                             display: "flex",
//                             flexDirection: "column",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             cursor: "pointer",
//                             border: "1px dashed #aaa",
//                             borderRadius: "5px"
//                           }}>
//                           <div style={{
//                               color: "#3080FE",
//                               fontSize: "30px",
//                               width: "100%",
//                               textAlign: "center"
//                             }}>+</div>
//                           <div style={{
//                               color: "#3080FE",
//                               fontSize: "14px",
//                               width: "100%",
//                               textAlign: "center"
//                             }}>上传图片</div>
//                         </div>
//                   }
//                 </Upload>
//               </Col>
//             </Row>
//
//             {/* <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 分类：
//               </Col>
//               <Col s="12" l="10">
//                 <IceFormBinder name="appclass">
//                   <Select className="next-form-text-align"  dataSource={allClassL}/>
//                 </IceFormBinder>
//               </Col>
//             </Row>
//
//
//
//             <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 状态：
//               </Col>
//               <Col s="12" l="10">
//                 <IceFormBinder name="appstatus">
//                   <SwitchForForm defaultChecked={this.state.value.appstatus}/>
//                 </IceFormBinder>
//               </Col>
//             </Row>
//
//             <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 推荐：
//               </Col>
//               <Col s="12" l="10">
//                 <IceFormBinder name="apprecommend">
//                   <SwitchForForm defaultChecked={this.state.value.apprecommend}/>
//                 </IceFormBinder>
//               </Col>
//             </Row>
//
//             <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 必备：
//               </Col>
//               <Col s="12" l="10">
//                 <IceFormBinder name="appbibei">
//                   <SwitchForForm defaultChecked={this.state.value.appbibei}/>
//                 </IceFormBinder>
//               </Col>
//             </Row>
//
//             <Row style={styles.formItem}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}>
//                 虚拟人气：
//               </Col>
//
//               <Col s="12" l="10">
//                 <IceFormBinder name="apphumen"  message="标题名称必须填写">
//                   <Input style={{
//                       width: '100%'
//                     }}/>
//                 </IceFormBinder>
//               </Col>
//             </Row> */
//             }
//
//             <Row style={styles.btns}>
//               <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>
//               <Col s="12" l="10">
//                 <Button type="primary" onClick={this.submit}>
//                   {
//                     this.props.history.params.activityId != 'create'
//                       ? '保存'
//                       : '立即创建'
//                   }
//                 </Button>
//                 <Button style={styles.resetBtn} onClick={this.reset}>
//                   重置
//                 </Button>
//               </Col>
//             </Row>
//           </div>
//         </IceFormBinderWrapper>
//       </IceContainer>
//     </div>);
//   }
// }

const styles = {
  container: {
    paddingBottom: 0
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
  jianxi: {
    marginBottom: "25px"
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginBottom: '25px',
    // marginBottom: '5px'
  },
  huise: {
    color: '#CFCFCF'
  }
};
