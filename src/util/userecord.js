import $ from 'jquery';
import {Feedback, Field} from '@icedesign/base';
export function userrecord(userid,sideid){
  const getVidUrl='https://tongji.widiazine.cn/index.php?module=API&method=UserId.getUsers&idSite='+sideid+'&period=year&date=today&label='+userid+'&format=JSON&token_auth=20a120ceb243e8b2aef3d03388788bbb';

  $.ajax({
  url:getVidUrl,
  dataType : "jsonp",
  jsonp: "jsoncallback",
  jsonpCallback:"success_jsonpCallback",
  success:function(res){
    console.log(res);
    // const user=res[0].idvisitor;
    // console.log(user);
    if(res.length==0){
      console.log('111');
          Feedback.toast.success('该用户没有记录');
    //   location.href='https://tongji.widiazine.cn/index.php?module=Widgetize&action=iframe&widget=1&moduleToWidgetize=Live&actionToWidgetize=getVisitorProfilePopup&idSite=14&visitorId='+res[0].idvisitor+'&period=day&date=today&disableLink=1&widget=1'
  }else{
location.href='https://tongji.widiazine.cn/index.php?module=Widgetize&action=iframe&widget=1&moduleToWidgetize=Live&actionToWidgetize=getVisitorProfilePopup&idSite='+sideid+'&visitorId='+res[0].idvisitor+'&period=day&date=today&disableLink=1&widget=1&token_auth=20a120ceb243e8b2aef3d03388788bbb'
  }
  }
})


}
