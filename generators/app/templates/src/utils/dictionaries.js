//用户类型字典
export const customerType = {
    '1': '个人',
    '2': '企业',
    '3': '事业或政府单位'
}

export const customerTypeList =
    [
        {
            value: '1',
            label: '个人'
        },{
            value: '2',
            label: '企业'
        },{
            value: '3',
            label: '事业或政府单位'
        },
    ]

//用户类型
export function getCustomerType(val) {
    return customerType[val] || ''
}

//签约银行 1中信 2工行 3农信 4邮储 5农业 6建设 7中行 8交通
export const bankCode = {
    '1': '中信',
    '2': '工行',
    '3': '农信',
    '4': '邮储',
    '5': '农业',
    '6': '建设',
    '7': '中行',
    '8': '交通'
}

//签约银行 1中信 2工行 3农信 4邮储 5农业 6建设 7中行 8交通
export function getBankCode(val) {
    return bankCode[val] || ''
}


//签约银行(互联网发行)
export const signBankCode = {
    '1': '中信银行',
    '2': '工商银行',
    '3': '农信银行',
    '4': '邮储银行',
    '5': '农业银行',
    '6': '建设银行',
    '7': '中国银行',
    '8': '绍兴银行',
    '9': '光大银行',
    'B': '宁波银行',
    'E': '浦发银行',
    'F': '浙商银行',
    'G': '银联',
    'H': '支付宝',
    'I': '微信',
    'J': '浙商互联',
}
// 缩略语	银行编码	含义
// ZX	1	中信银行
// GH	2	工商银行
// NX	3	农信银行
// YC	4	邮储银行
// NY	5	农业银行
// JS	6	建设银行
// ZH	7	中国银行
// SX	8	绍兴银行
// GD	9	光大银行
// NB	B	宁波银行
// PF	E	浦发银行
// ZS	F	浙商银行
// YL	G	银联
// ZFB	H	支付宝
// WX	I	微信
// HL	J	浙商互联
//签约银行(互联网发行)
export function getsignBankCode(val) {
    return signBankCode[val] || ''
}

export const shippingMethod = {
    '1': '快递',
    '2': '自提'
}

export function getshippingMethods(val) {
    return shippingMethod[val] || ''
}
export const vehicleColors = {
    '0': '蓝',
    '1': '黄',
    '2': '黑',
    '3': '白',
    '4': '渐变绿',
    '5': '黄绿双拼',
    '6': '蓝白渐变'
}

//车牌颜色
export function getVehicleColor(val) {
    return vehicleColors[val] || ''
}

//证件类型字典
export const certificatesType = {
    '1': '身份证',
    '2': '军官证',
    '3': '经营执照编码',
    '4': '机构代码证',
    '5': '香港身份证',
    '6': '护照',
    '7': '台胞证'
}

//证件类型
export function getCertificatesType(val) {
    return certificatesType[val] || ''
}

//车辆类型字典
export const vehicleType = {
    '0': '客',
    '1': '货'
}

//车辆类型
export function getVehicleType(val) {
    return vehicleType[val] || ''
}

//车辆类型字典
export const VehicleClassType = {
    '1': '一类车',
    '2': '二类车',
    '3': '三类车',
    '4': '四类车',
    '5': '五类车',
    '6': '六类车',
    '7': '七类车',

}

//车辆类型
export function getVehicleClassType(val) {
    return VehicleClassType[val] || ''
}


//车型
/**
 * 货车只有1-5类车，7类是集卡车
 * 客车只有1-4类车
 * **/
export function getNewVehicleType(val) {
    if (val) {
        if (val === '0') {
            return ''
        } else {
            if(val.length === 1) {
                return (VehicleClassType[val] + '[客]') || ''
            } else {
                if (val[1] === '7') {
                    return '集卡车'
                } else {
                    return (VehicleClassType[val[1]] + '[货]') || ''
                }
            }
        }

    } else {
        return ''
    }
}


//车辆用户类型字典
export const vehicleUserType = {
    '0': '普通车',
    '1': '集卡车',
    //'2': '卧铺车',
    //'8': '军车',
    // '9': '警车',
    // '15': '紧急车',
    // '16': '特殊公务车',
    '26': '应急车',
}

export const vehicleSpecialType = {
    //'8': '军车',
    '9': '警车',
    '5': '紧急车',
    '6': '特殊公务车',
}

//车辆用户类型
export function getVehicleUserType(val) {
    return vehicleUserType[val] || '';
}

export const cardType = {
    // '22': '储值',
    // '23': '记账',
    '1': '记账卡',
    '2': '储值卡'
}

export const newCardType = {
    // '22': '储值',
    // '23': '记账',
    '1': '记账卡',
}

//卡片类型（card_type）
export function getCardType(val) {
    // let cardType = {
    //     '22': '储值',
    //     '23': '记账',
    // }
    return cardType[val] || '';
}

export const issueType = {
    '1' :'线下',
    '2' :'线上（自提）',
    '3' :'线上（快递）',
}

export function getIssueType(val){
    return issueType[val] || '';
}

//电子档案类型列表
export const receiptsTypes = {
    'customer': '用户档案',
    'vehicle': '车辆档案'
}

//获取指定电子档案类型
export function getReceiptsType(val) {
    return receiptsTypes[val] || '';
}

//单位级别字典
export const companyLevel = {
    '0': '省',
    '1': '市',
    '2': '县'
}
//单位级别字典
export const companyDetailsLevel = {
    '0': '省',
    '1': '市',
    '2': '县及以下'
}

//获取单位级别
export function getCompanyLevel(val) {
    return companyLevel[val] || '';
}

//单位属性字典
export const companyAttr = {
    '0': '纳入会计核算中心类',
    '1': '监督管理类事业单位',
    '2': '公益类事业单位',
    '3': '其他'
}

//获取单位属性
export function getCompanyAttr(val) {
    return companyAttr[val] || ''
}

//银行卡类型字典
export const bankCardType = {
    '0': '信用卡',
    '1': '本地账号',
    '2': '零余额账号',
    '3': '他行账号',
    '4': '他行宁波地区账号',
}

//银行卡类型
export function getBankCardType(val) {
    return bankCardType[val] || ''
}

//车种类型字典
export const vehicleCatgoryType = {
    '1': '一类车',
    '2': '二类车',
    '3': '三类车',
    '4': '四类车',
    '5': '五类车',
    '6': '六类车',
    '7': '七类车'
}

//车种类型
export function getVehicleCatgoryType(val) {
    return vehicleCatgoryType[val] || ''
}

//OBU状态字典
export const obuStatus = {
    '0': '未发行',
    '1': '正常',
    '3': '故障',
    '5': '已注销',
}

//OBU状态
export function getObuStatus(val) {
    return obuStatus[val] || '未知'
}

//CPU卡状态
export const cpuStatus = {
    '0': '未发行',
    '1': '正常',
    '2': '挂失',
    '3': '消卡',
    '4': '废卡',
    '5': '冻结',
    '6': '遗失',
}

//获取CPU卡状态
export function getCpuStatus(val) {
    return cpuStatus[val] || '未知'
}

//图片尺寸字典
export const imgSize = {
    'O': '原图',
    'L': '大图',
    'S': '缩略图'
}

//图片尺寸
export function getImgSize(val) {
    return imgSize[val] || ''
}

//OCR类型字典
export const ocrType = {
    '1': '身份证',
    '2': '营业执照',
    '3': '护照',
    '4': '行驶证'
}

//OCR类型
export function getOcrType(val) {
    return ocrType[val] || ''
}

//车牌省份字典
export const provinces = {
    "浙": '浙',
    '沪': '沪',
    '苏': '苏',
    '皖': '皖',
    '赣': '赣',
    '闽': '闽',
    '京': '京',
    '津': '津',
    '渝': '渝',
    '冀': '冀',
    '豫': '豫',
    '云': '云',
    '辽': '辽',
    '黑': '黑',
    '湘': '湘',
    '鲁': '鲁',
    '新': '新',
    '鄂': '鄂',
    '桂': '桂',
    '甘': '甘',
    '晋': '晋',
    '蒙': '蒙',
    '陕': '陕',
    '吉': '吉',
    '贵': '贵',
    '粤': '粤',
    '青': '青',
    '藏': '藏',
    '川': '川',
    '宁': '宁',
    '琼': '琼',
    '使': '使',
    '领': '领',
}

//车牌省份
export function getProvince(val) {
    return provinces[val] || ''
}

//卡片类型（0：黄卡---货车支付卡；1：蓝卡---ETC通行卡）
export const obuIssue = {
    '1': 'ETC通行卡',
    '0': '货车支付卡'
}

//获取卡片类型
export function getObuIssue(val) {
    return obuIssue[val] || ''
}

//卡片颜色（）
export const cardColorList = {
    '0': 'ETC通行卡(蓝卡)',
    '1': '支付卡(黄卡)',
}

//获取卡片颜色
export function getCardColor(val) {
    return cardColorList[val] || ''
}

//城市列表
export const cities = [
    {city_code: "0282", parent_code: "02", city_name: "慈溪"},
    {city_code: "0382", parent_code: "03", city_name: "乐清"},
    {city_code: "0683", parent_code: "06", city_name: "嵊州"},
    {city_code: "0800", parent_code: "08", city_name: "衢州市区"},
    {city_code: "1021", parent_code: "10", city_name: "玉环"},
    {city_code: "0900", parent_code: "09", city_name: "舟山市区"},
    {city_code: "31", parent_code: "99", city_name: "上海"},
    {city_code: "12", parent_code: "0", city_name: "外省市"},
    {city_code: "0281", parent_code: "02", city_name: "余姚"},
    {city_code: "06", parent_code: "0", city_name: "绍兴市"},
    {city_code: "0211", parent_code: "02", city_name: "镇海"},
    {city_code: "0300", parent_code: "03", city_name: "温州市区"},
    {city_code: "0621", parent_code: "06", city_name: "绍兴县"},
    {city_code: "0521", parent_code: "05", city_name: "德清"},
    {city_code: "0481", parent_code: "04", city_name: "海宁"},
    {city_code: "0723", parent_code: "07", city_name: "武义"},
    {city_code: "0784", parent_code: "07", city_name: "永康"},
    {city_code: "1081", parent_code: "10", city_name: "温岭"},
    {city_code: "1023", parent_code: "10", city_name: "天台"},
    {city_code: "34", parent_code: "99", city_name: "安徽"},
    {city_code: "0100", parent_code: "01", city_name: "杭州市区"},
    {city_code: "0182", parent_code: "01", city_name: "建德"},
    {city_code: "0127", parent_code: "01", city_name: "淳安"},
    {city_code: "08", parent_code: "0", city_name: "衢州市"},
    {city_code: "0324", parent_code: "03", city_name: "永嘉"},
    {city_code: "0327", parent_code: "03", city_name: "苍南"},
    {city_code: "0600", parent_code: "06", city_name: "绍兴市区"},
    {city_code: "0522", parent_code: "05", city_name: "长兴"},
    {city_code: "0700", parent_code: "07", city_name: "金华市区"},
    {city_code: "0822", parent_code: "08", city_name: "常山"},
    {city_code: "1181", parent_code: "11", city_name: "龙泉"},
    {city_code: "1126", parent_code: "11", city_name: "庆元"},
    {city_code: "0922", parent_code: "09", city_name: "嵊泗"},
    {city_code: "0183", parent_code: "01", city_name: "富阳"},
    {city_code: "0185", parent_code: "01", city_name: "临安"},
    {city_code: "0122", parent_code: "01", city_name: "桐庐"},
    {city_code: "0212", parent_code: "02", city_name: "鄞州"},
    {city_code: "0", parent_code: "", city_name: "浙江"},
    {city_code: "02", parent_code: "0", city_name: "宁波市"},
    {city_code: "11", parent_code: "0", city_name: "丽水市"},
    {city_code: "10", parent_code: "0", city_name: "台州市"},
    {city_code: "0283", parent_code: "02", city_name: "奉化"},
    {city_code: "0206", parent_code: "02", city_name: "北仑"},
    {city_code: "0400", parent_code: "04", city_name: "嘉兴市区"},
    {city_code: "1024", parent_code: "10", city_name: "仙居"},
    {city_code: "1123", parent_code: "11", city_name: "遂昌"},
    {city_code: "0110", parent_code: "01", city_name: "余杭"},
    {city_code: "0200", parent_code: "02", city_name: "宁波市区"},
    {city_code: "09", parent_code: "0", city_name: "舟山市"},
    {city_code: "0381", parent_code: "03", city_name: "瑞安"},
    {city_code: "0825", parent_code: "08", city_name: "龙游"},
    {city_code: "1125", parent_code: "11", city_name: "云和"},
    {city_code: "1122", parent_code: "11", city_name: "缙云"},
    {city_code: "0921", parent_code: "09", city_name: "岱山"},
    {city_code: "32", parent_code: "99", city_name: "江苏"},
    {city_code: "36", parent_code: "99", city_name: "江西"},
    {city_code: "0225", parent_code: "02", city_name: "象山"},
    {city_code: "0326", parent_code: "03", city_name: "平阳"},
    {city_code: "0329", parent_code: "03", city_name: "泰顺"},
    {city_code: "0328", parent_code: "03", city_name: "文成"},
    {city_code: "0322", parent_code: "03", city_name: "洞头"},
    {city_code: "0682", parent_code: "06", city_name: "上虞"},
    {city_code: "0482", parent_code: "04", city_name: "平湖"},
    {city_code: "0424", parent_code: "04", city_name: "海盐"},
    {city_code: "0483", parent_code: "04", city_name: "桐乡"},
    {city_code: "0881", parent_code: "08", city_name: "江山"},
    {city_code: "0824", parent_code: "08", city_name: "开化"},
    {city_code: "1000", parent_code: "10", city_name: "台州市区"},
    {city_code: "1100", parent_code: "11", city_name: "丽水市区"},
    {city_code: "05", parent_code: "0", city_name: "湖州市"},
    {city_code: "07", parent_code: "0", city_name: "金华市"},
    {city_code: "0226", parent_code: "02", city_name: "宁海"},
    {city_code: "0681", parent_code: "06", city_name: "诸暨"},
    {city_code: "0624", parent_code: "06", city_name: "新昌"},
    {city_code: "0421", parent_code: "04", city_name: "嘉善"},
    {city_code: "0781", parent_code: "07", city_name: "兰溪"},
    {city_code: "0782", parent_code: "07", city_name: "义乌"},
    {city_code: "1121", parent_code: "11", city_name: "青田"},
    {city_code: "0109", parent_code: "01", city_name: "萧山"},
    {city_code: "01", parent_code: "0", city_name: "杭州市"},
    {city_code: "03", parent_code: "0", city_name: "温州市"},
    {city_code: "04", parent_code: "0", city_name: "嘉兴市"},
    {city_code: "0500", parent_code: "05", city_name: "湖州市区"},
    {city_code: "0523", parent_code: "05", city_name: "安吉"},
    {city_code: "0783", parent_code: "07", city_name: "东阳"},
    {city_code: "0727", parent_code: "07", city_name: "磐安"},
    {city_code: "0726", parent_code: "07", city_name: "蒲江"},
    {city_code: "1082", parent_code: "10", city_name: "临海"},
    {city_code: "1022", parent_code: "10", city_name: "三门"},
    {city_code: "1127", parent_code: "11", city_name: "景宁"},
    {city_code: "1124", parent_code: "11", city_name: "松阳"},
    {city_code: "33", parent_code: "99", city_name: "浙江"},
    {city_code: "1200", parent_code: "12", city_name: "外省市"},
    {city_code: "0207", parent_code: "02", city_name: "大榭"},
]


//个人证件类型字典
export const personalOCRType = {
    '1': '身份证',
    '2': '军官证',
    '5': '香港身份证',
    '6': '护照',
    '7': '台胞证'
}

//企业类型字典
export const enterpriseOCRType = {
    '3': '经营执照编码',
    '4': '组织机构代码证'
}

//事业或政府单位类型字典
export const governmentOCRType = {
    '4': '组织机构代码证',
}


//当前操作的模块类型
export const modelType = {
    newuser: 'newuser',
    userbusiness: 'userbusiness',
    vehicleinfo : 'vehicleinfo',
}

export const transTypes = {
    '02': '圈存',
    '06': '消费',
    '09': '复合消费'
}

export function getTransType(val) {
    return transTypes[val] || ''
}

//类别
export const backupType = {
    '0': '正常',
    '1': '备机'
}

export function getBackupType(val) {
    return backupType[val] || ''
}

//安装状态
export const setupState = {
    '0': '未安装',
    '1': '已安装'
}

export function getSetupState(val) {
    return setupState[val] || ''
}

export const cancelType = {
    '1': '无卡销卡',
    '2': '有卡销卡'
}

export function getCancelType(val) {
    return cancelType[val] || ''
}

//账户明细业务类型
export const acBusStatus = {
    '0': '充值',
    '1': '冲正',
    '2': '隔日冲正',
    '3': '退费',
    '4': '转存',
    '5': '调账',
    '6': '争议',
}

export function getAcBusStatus(val) {
    return acBusStatus[val] || ''
}
//交易渠道
export const acChannelType = {
    '0': '网站',
    '1': '网点',
    '2': '中信',
    '3': '工商',
    '4': '农信',
    '5': '邮储',
    '6': '农业',
    '7': '建设',
    '8': '中行',
    '9': '绍兴银行',
    'A': '光大银行',
    'B': '宁波银行',
    'F': '浙商银行',
}

export function getAcChannelType(val) {
    return acChannelType[val] || ''
}

export const acChannelName = {
    '0': '网站',
    '1': '网点',
    '2': '中信',
    '3': '工商',
    '4': '农信',
    '5': '邮储',
    '6': '农业',
    '7': '建设',
    '8': '中行',
    '9': '绍兴银行',
    'A': '光大银行',
    'B': '宁波银行',
    'F': '浙商银行',
}
export function getAcChannelName(val) {
    return acChannelName[val] || ''
}

//圈存状态
export const acLoadStatus = {
    '0': '未圈存',
    '1': '已圈存',
    '2': '圈存中',
}

export function getAcLoadStatus(val) {
    return acLoadStatus[val] || ''
}


//车辆详情tab列表
export const vehicleTabList = [
    {
        key: '0',
        value: '车辆信息'
    },
    {
        key: '1',
        value: '车辆黑名单'
    },
    {
        key: '2',
        value: '车辆日志'
    },
    {
        key: '3',
        value: '卡片发行日志'
    },
    {
        key: '4',
        value: '标签发行日志'
    },
]
export const accountTabList = [
    {
        key: '0',
        value: '用户账户明细'
    },
    {
        key: '1',
        value: '卡账户明细'
    },
    {
        key: '2',
        value: '圈存记录'
    },
    {
        key: '3',
        value: '消费记录'
    },
]

export const vehicleCpuTabList = [
    {
        key: '0',
        value: '卡片信息'
    },
    {
        key: '1',
        value: '卡片发行记录'
    },
    {
        key: '2',
        value: '卡片消费记录'
    },
]

export const vehicleObuTabList = [
    {
        key: '0',
        value: '标签信息'
    },
    {
        key: '1',
        value: '标签发行记录'
    },
]

//圈存异常人工处理底部tab列表
export const capTabList = [
    {
        key: '0',
        value: '通行消费流水'
    },
    {
        key: '1',
        value: '圈存记录'
    },
    {
        key: '2',
        value: '卡片内流水'
    }
]
export const refundTypeList = {
    '1': '本人',
    '2': '他人'
}
export const colorOptionsInfo = [
    {
      id:0,
      value:"蓝色",
      name:"蓝色"
    },
    {
      id:1,
      value:"黄色",
      name:"黄色"
    },
    {
      id:2,
      value:"黑色",
      name:"黑色"
    },
    {
      id:3,
      value:"白色",
      name:"白色"
    },
    {
      id:4,
      value:"渐变绿色",
      name:"渐变绿色"
    },
    {
      id:5,
      value:"黄绿双拼色",
      name:"黄绿双拼色"
    },
    {
      id:6,
      value:"蓝白渐变色",
      name:"蓝白渐变色"
    }
]
export function getRefundType(val) {
    return refundTypeList[val] || ''
}
const plateAccountToTypeMap = new Map([
	['0', "储值卡"],
	['1', "记账卡"],
	['2', "信用卡"]
])
const plateAccountToStateMap = new Map([
	['1', "正常"],
	['2', "有卡挂起"],
	['3', "无卡挂起"],
	['4', "有卡注销"],
    ['5', "无卡注销"],
    ['6', "卡挂失"]
])
const plateColorToColorMap = new Map([
	['0', "蓝色"],
	['1', "黄色"],
	['2', "黑色"],
	['3', "白色"],
	['4', "渐变绿色"],
	['5', "黄绿双拼色"],
	['6', "蓝白渐变色"],
	['7', "临时牌照"],
	['8', "未确定"],
])
const plateMenuToListMap = new Map([
	['index', "首页"],
	['userlist', "员工列表"],
	['hislist', "签约列表"],
	['channellist', "渠道列表"],
	['findCustomer', "查找用户车"],
    ['findRedis', "获取Redis值"],
    ['customerList', "客户列表"],
])
export {
    plateColorToColorMap,
    plateMenuToListMap,
    plateAccountToTypeMap,
    plateAccountToStateMap
}