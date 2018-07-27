const host = (() => {
    switch (process.env.NODE_ENV) {
        case "development": return { api: '/dev' };
        case "local": return { api: '/local' };
        default: return { api: '' };
    }

})();
/*params
 * fn:url
 * 接口
*/
export default {
    login: host.api + '/Login',
    getDevMonitorInfo: host.api + '/GetDevMonitorInfo',

    //机构
    getCustomerInfo: host.api + '/GetRegCustomerInfo',
    getCustomerList: host.api + '/GetCustomerList',
    modifyCustomerInfo: host.api + '/ModifyCustomerInfo',
    deleteCustomerInfo: host.api + '/DeleteCustomerInfo',

    //员工
    getOperateList: host.api + '/GetOperateList',
    modifyOperateInfo: host.api + "/ModifyOperateInfo",
    deleteOperateInfo: host.api + "/DeleteOperateInfo",

    //操作员
    getOwnerList: host.api + '/GetOwnerList',
    modifyOwnerInfo: host.api + '/ModifyOwnerInfo',
    deleteOwnerInfo: host.api + '/DeleteOwnerInfo',

    //团队
    getTeamList: host.api + '/GetTeamList',
    modifyTeamInfo: host.api + '/ModifyTeamInfo',
    deleteTeamInfo: host.api + '/DeleteTeamInfo',

    //仓库
    getGodownEntryList: host.api + "/GetGodownEntryList",
    listGodownEntryDetails: host.api + "/listGodownEntryDetails ",
    insertGodownEntryMain: host.api + "/insertGodownEntryMain",
    modifyGodownEntryMain: host.api + "/ModifyGodownEntryMain",
    deleteGodownEntryMain: host.api + "/DeleteGodownEntryMain",
    confirmWarehousing: host.api + "/confirmWarehousing",

    //地区
    modifyAreaInfo: host.api + "/ModifyAreaInfo",
    deleteAreaInfo: host.api + "/DeleteAreaInfo",
    getAreaInfoTree: host.api + "/GetAreaInfoTree",
    getAreaInfoList: host.api + "/GetAreaInfoList",

    //路口
    getRoadSetInfoList: host.api + "/GetRoadSetInfoList",
    modifyRoadSetInfo: host.api + "/ModifyRoadSetInfo",
    deleteRoadSetInfo: host.api + "/DeleteRoadSetInfo",

    //斑马线
    getBanMaLineListinfo: host.api + "/GetBanMaLineListinfo",
    modifyBanMaLineInfo: host.api + "/ModifyBanMaLineInfo",
    deleteBanMaLineInfo: host.api + "/DeleteBanMaLineInfo",

    //验收单
    getInspectionInfo: host.api + '/GetInspectionInfo',
    modifyInspectionInfo: host.api + '/ModifyInspectionInfo',
    deleteInspectionInfo: host.api + '/DeleteInspectionInfo',

    //反馈单
    getQualityFeedbackInfo: host.api + '/GetQualityFeedbackInfo',
    modifyQualityFeedbackInfo: host.api + '/ModifyQualityFeedbackInfo',
    deleteQualityFeedbackInfo: host.api + '/DeleteQualityFeedbackInfo',

    //设备维修
    getDeviceRepairList: host.api + '/GetDeviceRepairList',
    insertDeviceRepairInfo: host.api + '/InsertDeviceRepairInfo',
    modifyDevRepairInfo: host.api + '/ModifyDevRepairInfo',
    deleteDevRepairInfo: host.api + '/DeleteDevRepairInfo',

    //斑马线设备
    getBanMaLineDevList: host.api + '/GetBanMaLineDevList',
    addBanMaLineDevInfo: host.api + '/AddBanMaLineDevInfo',
    deleteBanMaLineDevInfo: host.api + '/DeleteBanMaLineDevInfo',

    //斑马线物料
    getBanMaLineBomList: host.api +"/GetBanMaLineBomList",
    addBanMaLineBomInfo: host.api+'/AddBanMaLineBomInfo',
    deleteBanMaLineBomInfo: host.api+'/DeleteBanMaLineBomInfo',

    //设备类别
    getDeviceTypeTree: host.api + '/GetDeviceTypeTree',
    getDeviceTypeList: host.api + '/GetDeviceTypeList',
    modifyDeviceType: host.api + "/ModifyDeviceType",
    deleteDeviceType: host.api + "/DeleteDeviceType",

    //斑马线业主
    getBanMaLineOwnerList: host.api + '/GetBanMaLineOwnerList',

    //斑马线施工团队
    getRoadWorkerList: host.api + '/GetRoadWorkerList',
    addRoadWorkInfo: host.api + '/AddRoadWorkInfo',
    deleteRoadWorkerInfo: host.api + '/DeleteRoadWorkerInfo',

    //团队人员
    getDayWorkRecoder: host.api + '/GetDayWorkRecoder',
    modifyDayWorkRecoder: host.api + '/ModifyDayWorkRecoder',
    delDayWorkRecoder: host.api + '/DelDayWorkRecoder',

    //勘察
    getSurveyInfo: host.api + '/GetSurveyInfo',
    modifySurveyInfo: host.api + '/ModifySurveyInfo',

    //竣工单
    getCompletedInfo: host.api + '/GetCompletedInfo',
    modifyCompletedInfo: host.api + '/ModifyCompletedInfo',
    deleteCompletedInfo: host.api+'/DeleteCompletedInfo',

    //物料清单
    getDeviceInfoList: host.api + "/GetDeviceInfoList",
    modifyDeviceInfo: host.api + "/ModifyDeviceInfo",
    deleteDeviceInfo: host.api + "/DeleteDeviceInfo",

    //获取系统参数
    getSystemParam: host.api + "/getSystemParam",
    showWarehouse: host.api + "/ShowWarehouse",

    //出库
    getDeliveryOrderList: host.api + "/GetDeliveryOrderList",
    insertDeliveryOrder: host.api + "/insertDeliveryOrder",
    confirmDelivery: host.api + "/confirmDelivery",
    modifyDeliveryOrderList: host.api + "/ModifyDeliveryOrderList",
    deleteDeliveryOrderInfo: host.api + "/DeleteDeliveryOrderInfo",
  
    //设备升级
    uploadFile: host.api +"/UploadFile",
    getVerInfoList: host.api +"/GetVerInfoList",
    delVerInfoList:host.api +"/DelVerInfoList",
    getRoleList:host.api +"/GetRoleList",
    getRoleDetail:host.api +"/GetRoleDetail",
    getDevList:host.api +"/GetDevList",
    setRole:host.api +"/SetRole",

    //获取图片；
    getIMGList:host.api+'/GetIMGList'
};
