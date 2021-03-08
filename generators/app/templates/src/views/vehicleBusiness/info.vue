<template xmlns:el-row="http://www.w3.org/1999/html">
    <div class="vehicle-info-container">
        <div class="vehicle-info-box">
<!--            <div class="appointment">-->
<!--                <div>渠道预约：</div>-->
<!--                <el-button size="mini" @click="showReserveSearch" class="reserve-search">预约查询-->
<!--                </el-button>-->
<!--            </div>-->
            <div class="vehicle-info-dialogContent"
                 :class="vehicleInfo.issue_obu=='1'?'vehicle-info  blue-card':'vehicle-info  yellow-card'">

                <el-form style="width: 100%" ref="vehicleInfo" size="medium" :model="vehicleInfo" :rules="rules" label-suffix=""
                         label-width="118px"
                         label-position="right">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item label="用户编号：" class="item" prop="customer_id">
                                <el-input class="no-border" readonly="readonly"
                                          v-model="vehicleInfo.customer_id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户姓名：" class="item" prop="customer_name">
                                <el-input class="no-border" readonly="readonly"
                                          v-model="this.$store.getters.customerInfo.customer_name">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="24">
                            <el-form-item label="车牌颜色：" class="vehicle-color" prop="vehicle_color">
                                <el-radio-group :disabled="isEdit || appointIsEdit" v-model="vehicleInfo.vehicle_color"
                                                @change="colorChange"
                                                label="1">
                                    <el-radio-button v-for="(value,key) in vehicleColors" :label="key" :key="key">
                                        {{value}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="item" prop="vehicle_code">
                                <label slot="label">车&ensp;牌&ensp;号：</label>
                                <el-radio-group label="1">
                                    <el-input :disabled="isEdit || appointIsEdit" placeholder="请输入车牌号" maxLength="11"
                                              v-model="vehicleProvinceEnd"
                                              class="input-with-select">
                                        <el-select :disabled="isEdit || appointIsEdit" v-model="vehicleProvincePre"
                                                   @change="provinceChange"
                                                   slot="prepend" placeholder="请选择">
                                            <el-option v-for="(value,key) in provinces" :key="key" :label="key"
                                                       :value="value"></el-option>
                                        </el-select>
                                    </el-input>
                                    <img v-if="!isEdit && !appointIsEdit" :src="require('@assets/ocr.png')" @click="openCamDialog"/>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="卡片类型：" class="cart-type" prop="issue_obu">
                                <el-radio-group :disabled="hasCardOrObu || appointIsEdit" v-model="vehicleInfo.issue_obu" @change="issueObuChange">
                                    <el-radio-button :label="1" :disabled="blueCardDisabled" :key="1">{{obuIssue['1']}}</el-radio-button>
                                    <el-radio-button :label="0" :disabled="yellowCardDisabled" :key="0">{{obuIssue['0']}}</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="vehicle-type" prop="vehicle_type">
                                <label slot="label">车&emsp;&emsp;型：</label>
                                <el-radio-group :disabled="hasCardOrObu || appointIsEdit" v-model="vehicleInfo.vehicle_type"
                                                @change="vehicleTypeChange">
                                    <el-radio-button v-for="(value,key) in vehicleType"
                                                     :disabled="(key==0?(!canIssueCar):(!canIssueTruck))||disableBus(key)"
                                                     :label="key" :key="key">{{value}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="车辆用户类型：" class="vehicle-user-type" prop="vehicle_user_type">
                                <el-select v-model="vehicleInfo.vehicle_user_type" :disabled="appointIsEdit" placeholder="请选择">
                                    <el-option v-for="item in vehicleUserType" :label="item.value"
                                               :value="item.type"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="item" prop="vehicle_seat">
                                <label slot="label">座&ensp;位&ensp;数：</label>
                                <el-input v-model="vehicleInfo.vehicle_seat" class="input-with-select">
                                    <template slot="append">座</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发动机号：" class="item" prop="vehicle_engine">
                                <el-input maxLength="20" placeholder="车辆发动机号（最长20位）" v-model="vehicleEngine"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="vehicle-cities" prop="vehicle_city">
                                <label slot="label">车&ensp;籍&ensp;地：</label>
                                <el-select v-model="parentCode"
                                           @change="cityChange" placeholder="请选择">
                                    <el-option v-for="city in parentCities" :key="city.city_code"
                                               :label="city.city_name"
                                               :value="city.city_code"></el-option>
                                </el-select>
                                <el-select v-model="vehicleInfo.vehicle_city"
                                           placeholder="请选择" @change="childCityChange">
                                    <el-option v-for="city in childCities"
                                               :value="city.city_code" :key="city.city_code" :label="city.city_name"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="识别代码：" class="item" prop="vehicle_distinguish">
                                <el-input maxLength="32" placeholder="车辆识别代码、车辆VIN码"
                                          v-model="vehicleDistinguish"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" v-show="isTruck">
                        <el-col :span="12">
                            <el-form-item class="item" prop="vehicle_ton">
                                <label slot="label">载&emsp;&emsp;重：</label>
                                <el-input v-model="vehicleInfo.vehicle_ton" class="input-with-select">
                                    <template slot="append">吨</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="item" prop="vehicle_axles">
                                <label slot="label">车&ensp;轴&ensp;数：</label>
                                <el-input v-model="vehicleInfo.vehicle_axles" class="input-with-select">
                                    <template slot="append">轴</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item label="ETC卡功能：" prop="card_type">
                                <div v-if="isEdit">{{vehicleInfo.card_type | getCardTypeFilter}}</div>
                                <el-radio-group v-else v-model="vehicleInfo.card_type" :disabled="appointIsEdit">
                                    <el-radio-button v-for="(value,key) in cardType" :label="key" :key="key">{{value}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="车辆特征："  class="item" prop="vehicle_specificInfo">
                                <el-input placeholder="车辆特征描述" v-model="vehicleInfo.vehicle_specificInfo">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label"
                                          v-show="appointIsEdit"
                                          label="申领证件：" prop="customer_type">
                                <div class="ArchivesPhoto">
                                    <checkArchives v-for="(item, index) in list" @toggleShowImage="toggleShowImage" :ind="index" :file_code="item.file_code" :name="getArchivesNameFilter(item.photo_code)"></checkArchives>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <dlg-footer :btninfos="ftBtnArrays.vehicleInfo" @ftClick="ftClick"></dlg-footer>
        </div>
        <el-dialog width="350" height="100%" id="vehicle-reserve" title="车辆预约查询" :visible.sync="reserveDlgVisible"
                   append-to-body @close="closeReserve">
            <el-row :span="24">
                <el-col :span="3">
                    <label class="lbl">车&ensp;牌&ensp;号：</label>
                </el-col>
                <el-col :span="21">
                    <el-input placeholder="请输入车牌号" auto-complete="true" size="medium" v-model="reserveVehicleCode">
                        <el-button slot="append" @click="reserveSearch" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="reserveList" stripe @row-click="selectReserve" style="width: 100%"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <el-table-column align='center' prop="reservation_id" label="预约编号"></el-table-column>
                <el-table-column align='center' prop="vehicle_code" label="车牌号码"></el-table-column>
                <el-table-column align='center' prop="vehicle_type" label="车型"
                                 :formatter="getVehicleType"></el-table-column>
                <el-table-column align='center' prop="vehicle_color" :formatter="getVehicleColor"
                                 label="车牌颜色"></el-table-column>
                <el-table-column align='center' prop="vehicle_user_type" :formatter="getVehicleUserType"
                                 label="车辆用户类型"></el-table-column>
            </el-table>
        </el-dialog>
        <photo-dialog :transfer="dialog" @PhotoftClick="photoftClick"></photo-dialog>
        <PhotoComponent @arrowClick="arrowClick"  :name="imgName" @closeImageShow="closeImageShow" :photoVisible="photoVisible"
                        :imgSrc="imgSrc"></PhotoComponent>
        <!--        store中当前车辆信息有变化时及时响应到界面上-->
        <!-- {{vehicle}} -->
    </div>
</template>

<script>
    import PhotoDialog from '@/components/PhotoDialog'
    import * as dict from "@utils/dictionaries"
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {getArchivesName} from "@/utils/utils";
    import {cmds, ftBtns} from "@utils/ftBtnConsts";
    import fetch from '@utils/fetch'
    import api from '@/api'
    import PhotoComponent from '@/components/PhotoComponent'
    import checkArchives from '@/components/checkArchives';
    import {getToken} from '@/utils/auth';
    import {Loading} from 'element-ui';
    import {ignoreNull} from '@utils/arrayUtils'
    import axios from 'axios'
    import defaultVars from '@/utils/defaultVars'
    import {mapGetters , mapActions} from "vuex";

    export default {
        components: {
            DlgFooter,
            PhotoDialog,
            PhotoComponent,
            checkArchives,
        },
        props: {
            idx: {//当前步骤条
                type: Number,
                default: ''
            }
        },
        data() {
            return {
                dialog: {
                    visible: false,
                },
                imgSrc: '',
                imgName: '',
                list: [],
                photoVisible: false,
                chooseImage: 0,
                ftBtnArrays: ftBtns,
                //预约列表
                reserveList: [],
                //预约查询车牌号
                reserveVehicleCode: '',
                reserveDlgVisible: false,
                progressStr: '加载中，请稍候...',
                //是否发行OBU
                noObu: false,
                //是否是货车
                isTruck: false,
                rules: {
                    customer_id: [
                        {required: true, message: '请先选择用户', trigger: 'blur'},
                    ],
                    vehicle_code: [{required: true, message: '请输入车牌', minLength: 6, trigger: 'blur'},
                        {type: 'string', max: 12, message: '车牌号长度最大12位', trigger: 'blur'},
                        {
                            pattern: '^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}([京津沪渝桂蒙宁新藏冀晋辽吉黑苏浙皖赣闽鲁粤鄂湘豫川云贵陕甘青琼])?[A-NP-Z0-9]{1}[A-NP-Z0-9]{3}[A-NP-Z0-9挂学警港澳领试超外]{1}([A-NP-Z0-9外])?)|^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z0-9]{5}应急)|^(应急[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z0-9]{4})$|([A-Z0-9]{7})$',
                            message: '请输入合法车牌号',
                            trigger: 'blur'
                        }
                    ],
                    //	车牌颜色（0蓝 1黄 2黑 3白 4渐变绿 5黄绿双拼 6蓝白渐变）
                    vehicle_color: [{
                        required: true,
                        message: '请选择车牌颜色',
                        min: 0,
                        max: 6,
                        trigger: 'blur'
                    }],
                    //	车型（车型 0客车,1货车）
                    vehicle_type: [{required: true, message: '请选择车型', trigger: 'blur'}
                    ],
                    //	车辆用户类型(0 普通车 1集卡车 2卧铺车 8军车(交通战备车) 9警车 15紧急车 16特殊公务车)，集卡车只有车型选货车的时候显示
                    vehicle_user_type: [{required: true, message: '请选择车辆用户类型', trigger: 'blur'}
                    ],
                    //	座位数
                    vehicle_seat: [{required: true, message: '请输入座位数', trigger: 'blur'},
                        {type: 'string', max: 2, message: '座位数最多2位', trigger: 'blur'},
                        {pattern: '^[0-9]*$', message: '请输入数字'}
                    ],
                    //	吨数
                    vehicle_ton: [{required: true, message: '请输入载重', trigger: 'blur'},
                        {type: 'string', max: 4, message: '载重位数最多4位', trigger: 'blur'},
                        {pattern: '^[0-9]{1,5}(\\.[0-9]{1,3})?$', message: '请输入合法载重（小数位数不超过4位）'}
                    ],
                    //长
                    vehicle_length: [{required: true, message: '请请输入长度', trigger: 'blur'},
                        {type: 'string', max: 4, message: '车长最多4位', trigger: 'blur'},
                        {pattern: '^[0-9]*$', message: '请输入数字'}
                    ],
                    //	宽
                    vehicle_width: [{required: true, message: '请输入宽度', trigger: 'blur'},
                        {type: 'string', max: 4, message: '车宽最多4位', trigger: 'blur'},
                        {pattern: '^[0-9]*$', message: '请输入数字'}
                    ],
                    //	高
                    vehicle_height: [{required: true, message: '请输入高度', trigger: 'blur'},
                        {type: 'string', max: 4, message: '车高最多4位', trigger: 'blur'},
                        {pattern: '^[0-9]*$', message: '请输入数字'}
                    ],
                    //	车轮数
                    vehicle_wheels: [{required: true, message: '请输入车轮数', trigger: 'blur'},
                        {type: 'string', max: 4, message: '车轮数最多4位', trigger: 'blur'},
                        {pattern: '^[0-9]*$', message: '请输入数字'}
                    ],
                    //	车轴数
                    vehicle_axles: [{required: true, message: '请输入车轴数', trigger: 'blur'},
                        {type: 'string', max: 2, message: '车轴数最多2位', trigger: 'blur'},
                        {pattern: '^[0-9]*$', message: '请输入数字'}
                    ],
                    //	轴距
                    vehicle_wheelbases: [{required: true, message: '请输入轴距', trigger: 'blur'},
                        {type: 'string', max: 4, message: '轴距最多4位', trigger: 'blur'},
                        {pattern: '^[0-9]*$', message: '请输入数字'}
                    ],
                    //	车籍地（对应车籍地附件  车籍地信息city.xls）
                    vehicle_city: [{required: true, message: '请选择车籍地', trigger: 'blur'}
                    ],
                    //	发动机号
                    vehicle_engine: [{required: true, message: '请输入发动机号', trigger: 'blur'},
                        {type: 'string', max: 20, message: '发动机号最多20位', trigger: 'blur'},
                        {pattern: '^[\\w\-\\/\+\\*\\s\\u2E80-\\uFE4F—]+$', message: '请输入合法发动机号'}
                    ],
                    //	车辆识别代码 VIN
                    vehicle_distinguish: [{required: true, message: '请输入车辆识别代码', trigger: 'blur'},
                        {type: 'string', max: 32, message: '车辆识别代码最多32位', trigger: 'blur'},
                        {pattern: '^[\\w\\-\\/\\+]+$', message: '请输入合法车辆识别代码'}
                    ],
                    //	ETC通行卡功能（1记账2储值）
                    card_type: [{required: true, message: '请选择ETC通行卡功能', trigger: 'blur'}],
                },
                //车辆信息
                vehicleInfo: {...defaultVars.vehicleInfo()},
                //车牌颜色字典
                vehicleColors: dict.vehicleColors,
                //车牌省份字典
                provinces: dict.provinces,
                //是否发行OBU
                obuIssue: dict.obuIssue,
                //卡片类型
                cardType: dict.newCardType,
                //车型
                vehicleType: dict.vehicleType,
                //车辆用户类型
                vehicleUserType: {'': ''},//this.setVehicleUserInfo(),//dict.vehicleUserType,
                //城市列表
                cities: dict.cities,//.filter((item) => {
                //     if (item.parent_code === '0') return item
                // }),
                //cities.filter((item)=>{if(item.parent_code===this.vehicleInfo.vehicle_city) return item})
                childCities: [],

                parentCode: '01',
                //页面数据是否有变更
                isDataChange: false,
                //页面数据是否保存
                isDataSave: false,
                //是否是编辑
                // isEdit: false,
                isFirstInitEdit: true,
                blueCardDisabled: true,
                yellowCardDisabled: true,
            }
        },
        watch: {
            vehicleJson: {
                handler: function (nowVal, oldVal) {

                    if (nowVal != oldVal) {
                        if (this.isEdit) {
                            //如果不是编辑界面初始化数据
                            if (this.isFirstInitEdit) {
                                this.isFirstInitEdit = false
                            } else {
                                this.isDataChange = true
                            }
                        } else {
                            this.isDataChange = true
                        }
                    }
                    //this.isDataSave = false
                    // console.log("监测到界面数据变化：")
                    // console.log(nowVal, oldVal, this.isDataChange);
                },
                deep: true
            }
        },
        computed: {
            //是否是编辑
            isEdit: {
                get: function () {//modeltype===='vehicleinfo'时 return 1 else return 0
                    return 'vehicleinfo' === this.$store.getters.modelType
                }
            },
            appointIsEdit: {
                get: function () {
                    return !!(this.$store.getters.appointInfo.appoint_id)
                }
            },
            vehicleCode: {
                get: function () {
                    return this.vehicleInfo.vehicle_code
                },
                set: function (val) {
                    this.vehicleInfo.vehicle_code = val.toUpperCase()
                }
            },
            vehicleJson() {
                return JSON.stringify(this.vehicleInfo)
            },
            parentCities: {
                get: function () {
                    return this.cities.filter((item) => {
                        if (item.parent_code === '0') return item
                    })
                }
            },
            //车牌省份
            vehicleProvincePre: {
                get: function () {
                    if (this.vehicleInfo.vehicle_code !== undefined) {
                        let prefix = this.vehicleInfo.vehicle_code.substr(0, 1);
                        if (dict.getProvince(prefix) === '')
                            return null;
                        return prefix;
                    }
                },
                set: function (value) {
                    if (this.vehicleInfo.vehicle_code !== undefined)
                        this.vehicleInfo.vehicle_code = value + this.vehicleInfo.vehicle_code.substr(1)
                    // console.log(this.vehicleInfo.vehicle_code)
                }
            },
            //车牌除省份之外的部分
            vehicleProvinceEnd: {
                get: function () {
                    if (this.vehicleInfo.vehicle_code !== undefined)
                        return this.vehicleInfo.vehicle_code.substr(1)
                },
                set: function (value) {
                    if (this.vehicleInfo.vehicle_code !== undefined)
                        this.vehicleInfo.vehicle_code = (this.vehicleInfo.vehicle_code.substr(0, 1) + value).toUpperCase()
                    // console.log(this.vehicleInfo.vehicle_code)
                }
            },
            vehicleEngine: {
                get: function () {
                    return this.vehicleInfo.vehicle_engine
                },
                set: function (val) {
                    this.vehicleInfo.vehicle_engine = val.toUpperCase()
                }
            },
            vehicleDistinguish: {
                get: function () {
                    return this.vehicleInfo.vehicle_distinguish
                },
                set: function (val) {
                    this.vehicleInfo.vehicle_distinguish = val.toUpperCase()
                }
            },
            vehicle() {
                //TODO 如果是编辑，则加载当前车辆数据
                //let editVehicleInfo = _this.$store.getters.vehicleInfo
                if (this.isEdit) {
                    this.initEdit()
                }
                else {
                    this.vehicleInfo = defaultVars.vehicleInfo()
                }
            },
            ...mapGetters([
                'operatorInfo',
                'appointInfo'
            ]),
            hasCardOrObu() {
                return !!this.vehicleInfo.cpu_card_id || !!this.vehicleInfo.obu_id
            },
            canIssueCar() {
                return this.$_has({'rights': [5, 11]})
            },
            canIssueTruck() {
                return this.$_has({'rights': [9, 10, 11]})
            }
        },
        created: function () {
            this.initAdd()
            // console.log(this.$store.getters.appointInfo.appoint_id, '----------------------------');
            // console.log(this.vehicleInfo, '------------');
        },

        destroyed: function () {
            this.vehicleInfo = defaultVars.vehicleInfo()
            //this.vehicleInfo = {}
            this.isDataSave = false
            this.isDataChange = false
            this.$store.getters.appointInfo.appoint_id= ''

        },
        mounted() {
            this.appointAssign();
          console.log(this.$store.getters.application_order_no, '---------------------');
        },
        methods: {
            ...mapActions([
                'setAppointInfo',
            ]),
            initAdd: function () {
                if (this.isEdit) {
                    this.isFirstInitEdit = true
                    this.initEdit()
                } else {
                    this.vehicleInfo = defaultVars.vehicleInfo()
                    let pcode = '00'//this.$store.getters.operatorInfo.branch_no.substr(2, 2)
                    if (pcode == '00') pcode = '01'
                    this.parentCode = pcode
                    this.cityChange(this.parentCode)
                }

                //if (!this.isEdit) {
                let obuRights = ['5', '7', '9', '11']
                let yellowRights = ['6', '8']
                if (!this.isEdit)
                    this.vehicleInfo.issue_obu = '0'
                this.blueCardDisabled = true
                for (let i = 0; i < obuRights.length; i++) {
                    if (this.$store.getters.operatorInfo.rights.indexOf(obuRights[i]) !== -1) {
                        if (!this.isEdit)
                            this.vehicleInfo.issue_obu = '1'
                        this.blueCardDisabled = false
                        break
                    }
                }
                this.yellowCardDisabled = true
                for (let i = 0; i < yellowRights.length; i++) {
                    if (this.$store.getters.operatorInfo.rights.indexOf(yellowRights[i]) !== -1) {
                        this.yellowCardDisabled = false
                        break
                    }
                }
                this.issueObuChange(this.vehicleInfo.issue_obu)
                //}
                // this.setVehicleUserInfo()
                //默认杭州市区
                //this.setCities('0100')
            },
            onCloseDialog() {
                this.dialog = false
            },
            dataUrlToBlob(dataURI) {
                let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
                let byteString = atob(dataURI.split(',')[1]); //base64 解码

                let arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
                let intArray = new Uint8Array(arrayBuffer); //创建视图

                for (let i = 0; i < byteString.length; i++) {
                    intArray[i] = byteString.charCodeAt(i);
                }
                return new Blob([intArray], {type: mimeString});
            },
            photoftClick(val) {
                let _this = this
                _this.startLoading()
                let formData = new FormData();
                let bizContent = {
                    'ocr_type': '4',
                    'file_name': 'file',
                }
                formData.append('method', api['ocrIdentify'].method)
                formData.append('ticket', getToken())
                formData.append('biz_content', JSON.stringify(bizContent))
                formData.append('file', _this.dataUrlToBlob(val), 'img.jpg')
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };
                axios.post(api['ocrIdentify'].url, formData, config)
                    .then((response) => {
                        _this.endLoading()
                        //如果识别成功
                        if (response.data.return_code == '0') {
                            _this.$message({
                                showClose: true,
                                type: 'success',
                                message: '行驶证识别成功'
                            })

                            let bizContent = JSON.parse(response.data.biz_content)
                            let map = {};
                            bizContent.forEach((item, index) => {
                                map[item.key_name] = item.key_value;
                            })
                            _this.vehicleInfo.vehicle_code = map['车牌号码']
                            _this.vehicleInfo.vehicle_specificInfo = map['车辆特征']
                            _this.vehicleInfo.vehicle_engine = map['发动机号']
                            _this.vehicleInfo.vehicle_distinguish = map['识别代码']
                        } else {
                            //识别失败
                            _this.$message({
                                showClose: true,
                                type: 'warning',
                                message: response.data.return_msg
                            })
                        }
                        // console.log(response.data);
                    }).catch(function (err) {
                        //置空车辆预约列表
                        _this.$message({
                            showClose: true,
                            type: 'warning',
                            message: 'Ocr识别异常：' + err
                        })
                        _this.endLoading()
                    }
                )
            },
            openCamDialog() {
                this.dialog.visible = true;
            },
            initEdit: function () {
                let _this = this
                let editVehicleInfo = _this.$store.getters.vehicleInfo
                Object.keys(editVehicleInfo).forEach(function (key) {//遍历出vehicleinfo的属性值
                    //debugger
                    if (key === 'only_cpu_card')
                        _this.vehicleInfo['issue_obu'] = editVehicleInfo[key] === '0' ? '1' : '0'
                    else if (key === 'vehicle_city') {
                        _this.setCities(editVehicleInfo[key])
                    } else
                        _this.vehicleInfo[key] = editVehicleInfo[key]
                });
                if (_this.vehicleInfo.vehicle_type == '1') {
                    this.isTruck = true
                }

                this.setVehicleUserInfo(true)
            },
            //关闭车辆预约查询
            closeReserve: function () {
                //清空预约列表
                this.reserveList = []
                //清空搜索框
                this.reserveVehicleCode = ''
                this.reserveDlgVisible = false
            },
            //车型
            getVehicleType: function (row, col) {
                return dict.getVehicleType(row.vehicle_type)
            },
            //车牌颜色
            getVehicleColor: function (row, col) {
                return dict.getVehicleColor(row.vehicle_color)
            },
            //车辆用户类型
            getVehicleUserType: function (row, col) {
                return dict.getVehicleUserType(row.vehicle_user_type)
            },
            selectReserve: function (row) {
                let _this = this
                _this.reserveList = []
                _this.reserveVehicleCode = ''
                _this.reserveDlgVisible = false
                Object.keys(row).forEach(function (key) {
                    if (key === 'vehicle_city') {
                        _this.setCities(row[key])
                    }
                    _this.vehicleInfo[key] = row[key]
                });
            },
            appointAssign() {//调用完毕记得刷新
                let _this = this
                if( _this.$store.getters.appointInfo.appoint_id ){
                  let parmas = {
                    order_no: _this.$store.getters.application_order_no,
                    type: '2'
                  }
                  fetch({
                    url: api['internetArchives'].url ,
                    method: 'post',
                    data: {
                      method:api['internetArchives'].method,
                      ...parmas
                    }
                  }).then(res=>{
                    this.list = res;
                    console.log(res, 'res');
                  }).catch(err=>{
                    console.log(err, 'err');
                  })
                Object.keys(_this.$store.getters.appointInfo).forEach(function (key) {
                    Object.keys(_this.vehicleInfo).forEach(function (key2) {
                        if(key2===key){
                            _this.vehicleInfo[key2] = _this.$store.getters.appointInfo[key]
                            _this.$store.getters.appointInfo[key] = ''
                        }
                        else if (key2 === 'issue_obu' && key==='only_cpu_card'){
                            _this.vehicleInfo[key2] = _this.$store.getters.appointInfo[key]=== '0' ? '1' : '0'
                            _this.$store.getters.appointInfo[key] = ''
                        }
                        else if (key2 === 'reservation_id' && key==='appoint_id'){
                            _this.vehicleInfo[key2] = _this.$store.getters.appointInfo[key]
                        }
                    });
                });
                }
                // console.log(_this.appointInfo , '_this.$store.getters.appointInfo');
                // console.log(_this.vehicleInfo , '_this.$store.getters.vehicleInfo');
            },

            childCityChange: function (val) {
                // console.log("当前子城市：" + val + ";;;;vehicleInfo.vehicle_city=" + this.vehicleInfo.vehicle_city)
            },
            showReserveSearch: function () {
                this.reserveDlgVisible = true
            },
            //预约查询
            reserveSearch: function () {
                let _this = this
                _this.startLoading(_this.progressStr)
                new Promise((resolve, reject) => {
                        fetch({
                            url: api['shCarReservation'].url || '',
                            method: 'post',
                            data: {
                                method: api['shCarReservation'].method,
                                vehicle_code: _this.reserveVehicleCode,//"浙A107NX",
                            }
                        }).then(function (response) {
                            //车辆预约列表
                            _this.reserveList = response
                            _this.endLoading()
                        }).catch(function (err) {
                            //置空车辆预约列表
                            _this.reserveList = []
                            _this.endLoading()
                            reject(err)
                        })
                    }
                )
            },
            //根据区设置车籍地
            setCities: function (val) {
                let _this = this
                //获取并设置市
                _this.parentCode = _this.cities.find((item) => {
                    if (item.city_code === val) return item
                }).parent_code
                //获取并设置区
                _this.childCities =
                    _this.cities.filter((item) => {
                        if (item.parent_code === _this.parentCode) {
                            return item
                        }
                    });
                this.vehicleInfo.vehicle_city = val
            },
            //客车不可用
            disableBus: function (key) {
                return key === '0' && this.noObu;
            },
            //市下拉框改变事件
            cityChange: function (value) {
                this.childCities =
                    this.cities.filter((item) => {
                        if (item.parent_code === value) {
                            return item
                        }
                    });
                this.vehicleInfo.vehicle_city = this.childCities[0].city_code
            },
            //客货变更
            vehicleTypeChange: function (value) {
                this.isTruck = value === '1'
                this.setVehicleUserInfo()
            },
            //车牌颜色变更事件
            colorChange: function (value) {
                // console.log("colorChange:" + value);
            },
            //车牌省份切换事件
            provinceChange: function (value) {
                // console.log("provinceChange:" + value);
            },
            //是否发行OBU
            issueObuChange: function (value) {
                //debugger
                this.noObu = value == '0';
                this.isTruck = value == '0'
                if (value == '0')
                    this.vehicleInfo.vehicle_type = '1';
                // else
                //     this.vehicleInfo.vehicle_type = '0'

                this.setVehicleUserInfo()
                // console.log("issueObuChange:" + value + ":::" + this.vehicleInfo.vehicle_user_type);
            },

            setVehicleUserInfo(isInitEdit = false) {
                // debugger
                //如果是货车支付卡（黄卡）
                //if (this.vehicleInfo.issue_obu == 0) {
                let truck = [
                    {rights: '5', type: '0', value: '普通车', issueObu: 1, isTruck: 0},
                    {rights: '11', type: '26', value: '应急车', issueObu: 1, isTruck: 0},
                    {rights: '9', type: '1', value: '集卡车', issueObu: 1, isTruck: 1},
                    {rights: '11', type: '26', value: '应急车', issueObu: 1, isTruck: 1},
                    {rights: '6', type: '0', value: '普通车', issueObu: 0, isTruck: 1},
                    {rights: '8', type: '1', value: '集卡车', issueObu: 0, isTruck: 1},
                ]
                this.vehicleUserType = truck.filter(item => item.issueObu == this.vehicleInfo.issue_obu
                    && item.isTruck == this.vehicleInfo.vehicle_type
                    && this.$_has({'rights': [item.rights]}))

                if (!this.isEdit)
                    this.vehicleInfo.vehicle_user_type = this.vehicleUserType[0].type
                else {
                    if (!this.hasCardOrObu && !isInitEdit) {
                        this.vehicleInfo.vehicle_user_type = this.vehicleUserType[0].type
                    }
                }
                // this.vehicleUserType['0'] =
                //     {}

                // } else {//如果是ETC通行卡（蓝卡）
                //
                //     //如果是客车
                //     if (this.vehicleInfo.vehicle_type == 0) {
                //
                //     } else {
                //
                //     }
                //
                // }
            },
            //底部按钮点击事件处理
            ftClick: function (cmd) {
                switch (cmd) {
                    //发行
                    case cmds.saveVehicleInfo:
                        let _this = this
                        //TODO 保存(新增、编辑)车辆
                        this.$refs.vehicleInfo.validate(valid => {
                            if (valid) {
                                if (this.vehicleInfo.vehicle_user_type == '26' &&
                                    (this.vehicleInfo.vehicle_color != '3' || this.vehicleInfo.card_type != '1')) {
                                    this.$msgbox({
                                        message: ('错误信息，应急车只能是记账卡，并且车牌颜色只能是白色！'),
                                        title: '提示',
                                        customClass: 'my_msgBox singelBtn',
                                        confirmButtonText: '确定',
                                        type: 'error'
                                    })
                                    return
                                }
                                this.startLoading();
                                fetch({
                                    url: this.isEdit ? api['editVehicle'].url : api['regVehicle'].url || '',
                                    method: 'post',
                                    data: {
                                        method: this.isEdit ? api['editVehicle'].method : api['regVehicle'].method,
                                        ...ignoreNull(_this.vehicleInfo)
                                    }
                                }).then(function (response) {
                                    _this.isDataChange = false
                                    _this.isDataSave = true
                                    // debugger
                                    //console.log(_this.isEdit ? "编辑车辆" : "新增车辆：" + JSON.stringify(response))
                                    _this.vehicleInfo = Object.assign(_this.vehicleInfo, response)
                                    let _vehicleInfo = {}
                                    Object.keys(_this.vehicleInfo).forEach(function (key) {
                                        //debugger
                                        if (key === 'issue_obu')
                                            _vehicleInfo['only_cpu_card'] = _this.vehicleInfo[key] === '0' ? '1' : '0'
                                        else
                                            _vehicleInfo[key] = _this.vehicleInfo[key]
                                    });
                                    _this.$store.commit('SET_VEHICLEINFO', _vehicleInfo)
                                    _this.endLoading()
                                    // console.log(_this.vehicleInfo.vehicle_code, '_this.vehicleInfo.vehicle_code');
                                    if (!_this.isEdit) {
                                        _this.getUserInfo({
                                            customer_id: _this.customerInfo.customer_id,
                                        }, _this.vehicleInfo.vehicle_code)
                                        // fetch({
                                        //     url: api['getUserInfo'].url || '',
                                        //     method: 'post',
                                        //     data: {
                                        //         method: api['getUserInfo'].method,
                                        //         customer_id: _this.vehicleInfo.customer_id
                                        //     }
                                        // }).then(res => {
                                        //     _this.$store.commit('SET_CUSTOMERINFO', res[0])
                                        // }).catch(error => {
                                        //
                                        // })
                                        const h = _this.$createElement;
                                        if(_this.$store.getters.appointInfo.appoint_id){
                                            _this.$msgbox({
                                                message: h('div', null, [
                                                    h('p', '用户名称：' + _this.$store.getters.customerInfo.customer_name),
                                                    h('p', '车牌号：' + _this.$store.getters.vehicleInfo.vehicle_code),
                                                    h('p', '车辆档案号：' + _this.$store.getters.vehicleInfo.vehicle_archives_no),
                                                ]),
                                                title: '提示',
                                                customClass: 'my_msgBox singelBtn',
                                                confirmButtonText: '上传车辆档案',
                                                type: 'success'
                                            }).then(() => {
                                                _this.$emit('ftClick', 'next')
                                            }).catch(() => {
                                                _this.vehicleInfo = defaultVars.vehicleInfo()
                                                _this.initAdd()
                                            });
                                        }
                                        else{
                                            _this.$msgbox({
                                                message: h('div', null, [
                                                    h('p', '用户名称：' + _this.$store.getters.customerInfo.customer_name),
                                                    h('p', '车牌号：' + _this.$store.getters.vehicleInfo.vehicle_code),
                                                    h('p', '车辆档案号：' + _this.$store.getters.vehicleInfo.vehicle_archives_no),
                                                ]),
                                                title: '提示',
                                                customClass: 'my_msgBox',
                                                showCancelButton: true,
                                                confirmButtonText: '上传车辆档案',
                                                cancelButtonText: '继续新增车辆',
                                                type: 'success'
                                            }).then(() => {
                                                _this.$emit('ftClick', 'next')
                                            }).catch(() => {
                                                _this.vehicleInfo = defaultVars.vehicleInfo()
                                                _this.initAdd()
                                            });
                                        }

                                    } else {
                                        const h = _this.$createElement;
                                        _this.$msgbox({
                                            message: h('div', null, [
                                                h('p', '用户名称：' + _this.$store.getters.customerInfo.customer_name),
                                                h('p', '车牌号：' + _this.$store.getters.vehicleInfo.vehicle_code),
                                                h('p', '车辆档案号：' + _this.$store.getters.vehicleInfo.vehicle_archives_no),
                                            ]),
                                            title: '提示',
                                            customClass: 'my_msgBox',
                                            showCancelButton: true,
                                            confirmButtonText: '上传车辆档案',
                                            cancelButtonText: '完成',
                                            type: 'success'
                                        }).then(() => {
                                            _this.$emit('ftClick', 'next')
                                        }).catch(() => {
                                            //_this.vehicleInfo = defaultVars.vehicleInfo()
                                        });
                                    }
                                }).catch((err) => {
                                    _this.endLoading()
                                    this.$msgbox({
                                        message: (_this.isEdit ? "编辑车辆失败:" : '新增车辆失败：') + err.message,
                                        title: '失败',
                                        customClass: 'my_msgBox singelBtn',
                                        confirmButtonText: '确定',
                                        type: 'error'
                                    })
                                })
                            } else {
                                // console.log('error submit!!')
                                return false
                            }
                        })
                        break;
                    //其他（上一步、下一步）
                    default:
                        //如果界面数据有变动，并且未保存，弹出提示框
                        if (this.isEdit) {
                            if (this.isDataChange && !this.isDataSave) {
                                this.$confirm('数据有修改，是否确定离开？', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                        //debugger
                                        if (this.isEdit) {
                                            this.initEdit()
                                        } else {
                                            this.vehicleInfo = defaultVars.vehicleInfo()
                                        }
                                        this.isDataChange = false
                                        //TODO 是否可以上一步下一步
                                        //如果可以，才调用上层事件处理
                                        this.$emit("ftClick", cmd);
                                    }
                                ).catch(() => {
                                });
                            } else {
                                this.$emit("ftClick", cmd);
                            }
                        } else {
                            //新增车辆屏蔽下一步
                            if (cmd !== cmds.next) {
                                this.$emit("ftClick", cmd);
                            }
                        }
                        break;
                }
            },
          // 点击展示大图
          toggleShowImage(file_code, index, name) {
            this.photoVisible = true;
            this.chooseImage = index;
            this.imgSrc = '/archives/display/L/' + file_code;
            this.imgName = name;
          },
          closeImageShow() {
            this.photoVisible = false;
          },
          arrowClick(direction) {
            if (direction === 'left') {
              if (this.chooseImage >= 1) {
                this.chooseImage = this.chooseImage - 1;
                this.imgSrc = '/archives/display/L/' + this.list[this.chooseImage].file_code;
                this.imgName = this.getArchivesNameFilter(this.list[this.chooseImage].photo_code)
              } else {
                this.noMore()
              }
            } else {
              if (this.chooseImage < (this.list.length - 1)) {
                this.chooseImage = this.chooseImage + 1;
                this.imgSrc = '/archives/display/L/' + this.list[this.chooseImage].file_code;
                this.imgName = this.getArchivesNameFilter(this.list[this.chooseImage].photo_code)
              } else {
                this.noMore()
              }
            }
          },
          noMore() {
            this.$msgbox({
              title: '温馨提示',
              message: '没有更多啦',
              customClass: 'my_msgBox singelBtn',
              // showCancelButton: true,
              confirmButtonText: '确定',
              type:'info',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  done();
                }
              }
            })
          },
          getArchivesNameFilter(val) {
            return getArchivesName(val);;
          },

        },
        filters: {
            getCardTypeFilter(val) {
              return dict.getCardType(val);
            },
        }
    }
</script>

<style lang="scss">
    @import "../../styles/common";

    #vehicle-reserve {
        span {
            min-width: 52px
        }

        .lbl {
            min-width: 70px;
            display: inline-block;
            text-align: right;
        }

        .el-row {
            height: 28px;
            line-height: 28px;
            margin-bottom: 20px;
            padding: 9px 10px 0px 10px !important;
        }

        .el-dialog {
            /*height: 60%;*/
            border-radius: 6px;

            .el-dialog__header {
                background-color: #3C4150;
                text-align: left;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                height: 40px;
                padding: 0px 20px;

                .el-dialog__title {
                    line-height: 40px;
                    font-family: PingFangSC-Regular;
                    font-size: 20px;
                    color: #01C1B2;
                    letter-spacing: 0;
                    height: 40px;
                }

                .el-dialog__headerbtn {
                    font-size: 20px;
                    line-height: 40px;
                    top: 0px;
                    right: 10px;
                }
            }

            .el-dialog__body {
                padding: 0px 0px 0px 0px;

                .dialog-content {
                }
            }
        }
    }

    .vehicle-info-container {
        .ArchivesPhoto{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
        }
        .vehicle-info-box {
            .vehicle-info-dialogContent {
                height: $dialog-height;
                overflow-y: hidden;
                overflow-x: hidden;
                display: flex;
                box-sizing: border-box;
            }

            /deep/ .el-row {
                margin: 0px;
            }

            .appointment {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
                margin-bottom: 10px;
                margin-right: 20px;

                .reserve-search {
                    background: $second-color;
                    color: #ffffff
                }
            }
        }
    }

    .vehicle-info-container .vehicle-info {


        //background: url("../../assets/cpu_card_big_b.png") no-repeat 50% 50%;
        //background-size:30%;
        //background-color:rgba(255,255,255,.4);
        margin: 5px 4% 5px 4%;

        .el-form-item__label {
            /*text-align: justify;*/
            /*width: 118;*/
            /*display: inline-block;*/
            /*height: 100%;*/
            /*width: 100px;*/
            /*text-align: justify;*/

        }

        /deep/ .input-with-select {
            width: 80%;
            margin-right: 5px;
        }

        /deep/ .vehicle-user-type .el-select {
            /*min-width: 256px;*/
            width: auto;
        }

        &.blue-card {
            background: url("../../assets/cpu_card_big_b.png") no-repeat 50% 50%;
            background-size: 300px;
        }

        &.yellow-card {
            background: url("../../assets/cpu_card_big_y.png") no-repeat 50% 50%;
            background-size: 300px;
        }

        input {
            /*background: rgba(255, 255, 255, .2);*/
        }

        /deep/ .vehicle-cities .el-select {
            width: 40% !important;
        }

        /deep/ .vehicle-type span, .cart-type span {
            /*min-width: 128px;*/
        }

        /deep/ .vehicle-color span {
            /*min-width: 89px*/
        }

        /deep/ .no-border input {
            border: none !important;
        }

        /deep/ .el-col {
            padding: 0px 5px 0px 5px;

            .el-form-item__label {
                padding: 0 6px 0 0;
            }

            &:first-child {
                /*padding-right: 10px;*/
                /*padding-left: 0px;*/
            }

            &:last-child {
                /*padding-right: 0px;*/
                /*padding-left: 10px;*/
            }
        }

        /deep/ .el-radio-button__inner {
            font-size: 14px !important;
        }

        /deep/ .el-select {
            /*width: 90px !important;*/
        }

        /deep/ .el-input__inner {
            /*text-align: center;*/
            font-size: 14px;
        }

        /deep/ .el-form-item {
            /*margin-bottom: 20px !important;*/
        }

        /deep/ .el-input-group__prepend .el-select {
            width: 64px !important;
        }

        /deep/ .el-input-group--append {
            border: none !important;
            /*width: -10px !important;*/
        }

        /*/deep/ .reserve-search {*/
        /*    height: 28px !important;*/
        /*    !*width: 97px !important;*!*/
        /*    border-radius: 6px !important;*/
        /*    border: none !important;*/
        /*    background-color: #01c1b2 !important;*/
        /*    line-height: 28px !important;*/
        /*    padding: 0 10px 0 10px !important;*/
        /*    float: right;*/

        /*    span {*/
        /*        color: #ffffff;*/
        /*    }*/
        /*}*/
    }
</style>