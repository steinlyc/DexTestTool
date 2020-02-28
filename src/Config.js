export const menuMap = [
  {
    title: 'ABO测试',
    name: 'abo',
    to: '',
    hasChildren: true,
    children: [
      {
        title: '盘口数据',
        name: 'abo1',
        to: '/abo1',
      },
      {
        title: '年化收益',
        name: 'abo2',
        to: '/abo2',
      },
      {
        title: '回购监控',
        name: 'abo3',
        to: '/abo3',
      },
      {
        title: '挂单查询',
        name: 'abo4',
        to: '/abo4',
      },
      {
        title: '价格监控',
        name: 'abo5',
        to: '/abo5',
      }
    ]
  },
  {
    title: '深度共享',
    name: 'depth',
    to: '',
    hasChildren: true,
    children: [
      {
        title: '深度共享原始数据',
        name: 'depth1',
        to: '/depth1',
      },
      {
        title: '深度共享处理数据',
        name: 'depth2',
        to: '/depth2',
      },
    ],
  },
]

export const routerMap = {
  '/': {
    key: 'abo1',
  },
  '/abo1': {
    key: 'abo1',
  },
  '/abo2': {
    key: 'abo2',
  },
  '/abo3': {
    key: 'abo3',
  },
  '/abo4': {
    key: 'abo4',
  },
  '/abo5': {
    key: 'abo5',
  },
  '/depth1': {
    key: 'depth1',
  },
  '/depth2': {
    key: 'depth2',
  },
}
