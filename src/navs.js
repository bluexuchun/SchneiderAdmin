// <!-- auto generated navs start -->
const autoGenHeaderNavs = [];
const autoGenAsideNavs = [

];

// <!-- auto generated navs end -->

const customHeaderNavs = [
  {
    text: '首页',
    to: '/',
    icon: 'home',
  }
];

const customAsideNavs = [
  {
    name:'home',
    text: '首页',
    to: '/Home',
    icon: 'home'
  },
  // {
  //   text: '参数设置',
  //   to: '/paramssetting',
  //   icon: 'repair'
  // },
  {
    text: '权限设置',
    to: '/authoritysettinglist',
    icon: 'fans'
  },
  {
    text: '课程管理',
    to: '/activity',
    icon: 'content',
    children: [
      {
        text: '新建课程',
        to: '/topicmanage/create',
      },
      {
        text: '课程列表',
        to: '/topicmanagelist'
      },

    ]
  },
  {
    text: '章节管理',
    to: '/activity',
    icon: 'material',
    children: [
      {
        text: '新建章节',
        to: '/chaptermanage/create',
      },
      {
        text: '章节列表',
        to: '/chaptermanagelist'
      },

    ]
  },
  {
    text: '课程预告管理',
    to: '',
    icon: 'material',
    children: [
      {
        text: '新建课程预告',
        to: '/courseherald/create',
      },
      {
        text: '课程预告列表',
        to: '/courseheraldlist'
      },

    ]
  },
  {
    text: 'banner管理',
    to: '/activity',
    icon: 'image',
    children: [
      {
        text: '新建banner',
        to: '/homeslide/create',
      },
      {
        text: 'banner列表',
        to: '/homeslidelist'
      },

    ]
  },
  {
    text: '标签管理',
    to: '/class',
    icon: 'link',
    children: [
      {
        text: '添加标签',
        to: '/class/create',
      },
      {
        text: '标签管理',
        to: '/classList'
      },
    ]
  },
  {
    text: '分类管理',
    to: '/class',
    icon: 'cascades',
    children: [
      {
        text: '添加分类',
        to: '/fenlei/create',
      },
      {
        text: '分类列表',
        to: '/fenleilist'
      },
    ]
  },
  {
    text: '用户管理',
    to: '/usersetting',
    icon: 'yonghu'
  },
  {
    text: '管理员设置',
    to: '/activity',
    icon: 'anchor',
    children: [
      {
        text: '添加管理员',
        to: '/managersetting/create',
      },
      {
        text: '管理员列表',
        to: '/managersettinglist'
      },

    ]
  },
  {
    text:'学分管理',
    to:'/score',
    icon:'chart',
    children:[
      {
        text:'学分列表',
        to:'/scorelist'
      }
    ]
  },
  {
    text: '行业智库',
    to: '/setting',
    icon: 'task',
    children: [

      {
        text: '新增智库',
        to: '/thinktank/create',
      },
      {
        text: '智库列表',
        to: '/thinktanklist',
      },
    ],
  },
  {
    text: '聊天记录管理',
    to: '/chatmanage',
    icon: 'yonghu'
  },
  {
    text: '业务咨询管理',
    to: '/setting',
    icon: 'message',
    children: [
      {
        text: '业务咨询列表',
        to: '/consultationmanagelist',
      },
    ],
  },
  {
    text: '系统设置',
    to: '/setting',
    icon: 'shezhi',
    children: [
      {
        text: '基本设置',
        to: '/setting',
      },
      // {
      //   text: '附件设置',
      //   to: '/comment',
      // },
    ],
  },
];

function transform(navs) {
  // custom logical
  return [...navs];
}

export const headerNavs = transform([
  ...autoGenHeaderNavs,
  ...customHeaderNavs,
]);


export const asideNavs = transform([...autoGenAsideNavs, ...customAsideNavs]);
