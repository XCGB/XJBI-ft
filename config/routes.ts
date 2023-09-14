export default [
  { path: '/welcome', name: '首页', icon: 'smile', component: './Welcome' },
  { path: '/', redirect: '/welcome' },
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/chart',
    icon: 'barChart',
    name: '图表',
    routes: [
      { path: '/chart', redirect: '/chart/addChart' },
      { path: '/chart/addChart', name: '图表分析 ', component: './Chart/AddChart' },
    ],
  },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', name: '管理页面', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页面', component: './Admin' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
