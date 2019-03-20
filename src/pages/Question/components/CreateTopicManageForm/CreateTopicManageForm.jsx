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
    this.state = {};
  }

  componentWillMount() {
    const that = this;
    const activityId = this.props.history.params.id;
    // 正确获取到activityId的值，去获取他的值
    ajaxTo('api.php?entry=sys&c=chapter&a=question&do=edit', {'id': activityId}).then((res) => {
      const currentData = res.data;
      // 返回的信息
      that.setState({
        value: {
          displayorder:currentData.displayorder,
          content: currentData.content,
          uid: currentData.uid,
          time: currentData.time,
          pop: currentData.pop,
          status: currentData.status
        },
      })
    })
  }

  componentDidMount() {

  }

  onError = (file) => {
    console.log('onError callback : ', file);
  }

  onChangeSelect(value,option){
    let valueOrigin = {...this.state.value}
    valueOrigin.status = value
    this.setState({
      value:valueOrigin
    })
  }

  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      if (error) {
         // 处理表单报错
      }

      const dataAry = {
        ...that.formRef.props.value,
        id:that.props.history.params.id,
        tid:that.props.history.params.tid
      }

      // 修改区
      const newrequestUrl = 'api.php?entry=sys&c=chapter&a=question&do=update'
      const result = ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        Feedback.toast.success(res.message);
        setTimeout(function() {
          window.history.go(-1)
        }, 1000);
      }, function(value) {

      })
    });
  };

  render() {
    const styleP = {
      paddingBottom: '25px'
    }

    var allClassL = [];

    const dataSource = [
      {label:'审核通过', value:'1'},
      {label:'审核中', value:'2'}
    ]

    return (<div className="create-activity-form">
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                问题：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="content">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="content"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                用户UID：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="uid">
                  <Input style={{
                      width: '100%'
                    }} disabled />
                </IceFormBinder>
                <IceFormError name="uid"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                点赞人数：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="pop">
                  <Input style={{
                      width: '100%'
                    }} />
                </IceFormBinder>
                <IceFormError name="pop"/>
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

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                审核状态：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="status">
                  <Select  className="next-form-text-align" dataSource={dataSource} onChange={this.onChangeSelect.bind(this)}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                创建时间：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="time">
                  <Input style={{
                      width: '100%'
                    }} disabled />
                </IceFormBinder>
                <IceFormError name="time"/>
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
