export const menuData = [
  {
    name: '首页',
    url: 'Dashboard',
    icon: 'bar-chart',
  }, { 
    name: '实时监控', 
    url: "Statistics"
  }, {
    name: '施工信息',
    url: 'Operation',
    icon: 'area-chart',
  }, {
    name: '机构管理',
    url: 'Customer',
    icon: 'tool',
    children: [
      { name: '代理商', url: 'Channel' },
      { name: '员工', url: 'Operator' },
      { name: '业主', url: 'Owner' },
      { name: '团队', url: 'Team' },
    ]
  }, {
    name: '物料准备',
    url: 'Material',
    icon: 'edit',
    children: [
      { name: '物料库存', url: 'Stock' },
      { name: '物料入库', url: 'In' },
      { name: '物料出库', url: 'Out' },
    ]
  }, {
    name: '基础信息',
    url: 'BasicInfo',
    icon: 'bars',
    children: [
      { name: '地区信息', url: 'District' },
      { name: '路口信息', url: 'Crossing' },
      { name: '斑马线信息', url: 'ZebraCrossing' },
      { name: '物料设备清单', url: 'MaterialBill' },
    ]
  }, {
    name: '设备更新',
    url: 'DeviceUpdate',
    icon: 'sync',
    children: [
      { name: '软件版本管理', url: 'Versions' },
      { name: '升级策略管理', url: 'Update' },
    ]
  }
]


