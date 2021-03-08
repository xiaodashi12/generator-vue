<template>
    <div class="content">
        <div class="my_list_row">
            <div class="title">用户信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户姓名：</label>
                        <span class="rg">{{customerInfo.customer_name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>用户类型：</label>
                        <span class="rg">{{customerInfo.customer_type | getCustomerTypeFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>用户编号：</label>
                        <span class="rg">{{customerInfo.customer_id}}</span>
                    </el-col>
                </el-row>
            </div>

            <div class="title">车辆信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <div class="vehicleCodeDiv">
                            <label>车牌：</label>
                            <!--                        <span class="rg vehicle_code"  :class="getClass(vehicleInfo.vehicle_color)">{{vehicleInfo.vehicle_code}}</span>-->
                            <div class="autoSizeBackImage" :class="getClass(vehicleInfo.vehicle_color)">
                                <div class="sign"
                                     v-text="'['+getVType(vehicleInfo.vehicle_type)+']'"></div>
                                <div style="position: relative"  class="vehicleCode">
                                    {{vehicleInfo.vehicle_code}}
                                </div>
                            </div>
                            </div>

                    </el-col>
                    <el-col :span="8">
                        <label>车型：</label>
                        <span class="rg">{{vehicleInfo.vehicle_class === '7' ? ' 集卡车' : (vehicleClass)}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车辆用户类型：</label>
                        <span class="rg">{{vehicleInfo.vehicle_user_type | getVehicleUserTypeFilter}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>座位数：</label>
                        <span class="rg">{{vehicleInfo.vehicle_seat}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>载重：</label>
                        <span class="rg">{{vehicleInfo.vehicle_ton}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车籍地：</label>
                        <span class="rg">{{vehicleInfo.vehicle_city | vehicleCityFilter}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>发动机号：</label>
                        <span class="rg">{{vehicleInfo.vehicle_engine}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>识别代码：</label>
                        <span class="rg">{{vehicleInfo.vehicle_distinguish}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车辆特征：</label>
                        <span class="rg">{{vehicleInfo.vehicle_specificInfo}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>CPU卡片：</label>
                        <span class="rg">{{vehicleInfo.cpu_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>通行卡功能：</label>
                        <span class="rg">{{vehicleInfo.card_type | getCardTypeFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>通行卡类型：</label>
                        <span class="rg">{{vehicleInfo.only_cpu_card | getCardColorFilter}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>长x宽x高：</label>
                        <span class="rg">{{vehicleInfo.vehicle_length + 'x' + vehicleInfo.vehicle_width + 'x' +
                        vehicleInfo.vehicle_height}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车轮数：</label>
                        <span class="rg">{{vehicleInfo.vehicle_wheels}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车轴数：</label>
                        <span class="rg">{{vehicleInfo.vehicle_axles}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>轴距：</label>
                        <span class="rg">{{vehicleInfo.vehicle_wheelbases}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>签约银行：</label>
                        <span class="rg">{{vehicleInfo.bank_name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>签约账号：</label>
                        <span class="rg">{{vehicleInfo.bank_account}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>发行渠道：</label>
                        <span class="rg">{{vehicleInfo.issue_way | getIssueTypeFilters}}</span>
                    </el-col>

                </el-row>
            </div>

            <div v-show="showForce" class="forceVehicle">
                <div class="title">注销信息</div>
                <div class="info">
                    <el-row :span="24">
                        <el-col :span="24">
                            <div class="upLoadPicture">
                                <label><i>*</i>电子档案：</label>
                                <electronicArchives :special_code="cancel_serial" :name="'行驶证'" :code="'17'"
                                                    @takePhotoSuccess="handlePhotoLink"
                                                    @toggleShowImage="toggleShowImage"
                                                    @deletePicture="deletePicture"></electronicArchives>
                                <electronicArchives :special_code="cancel_serial" :name="'身份证(人像面)'" :code="'18'"
                                                    @takePhotoSuccess="handlePhotoLink"
                                                    @toggleShowImage="toggleShowImage"
                                                    @deletePicture="deletePicture"></electronicArchives>
                                <electronicArchives :special_code="cancel_serial" :name="'身份证(国徽面)'" :code="'19'"
                                                    @takePhotoSuccess="handlePhotoLink"
                                                    @toggleShowImage="toggleShowImage"
                                                    @deletePicture="deletePicture"></electronicArchives>

                            </div>

                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="24">
                            <label><i>*</i>原因：</label>
                            <el-input
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入内容"
                                    v-model="reason">
                            </el-input>

                        </el-col>
                    </el-row>
                </div>
            </div>
            <PhotoComponent @arrowClick="arrowClick" @closeImageShow="closeImageShow" :photoVisible="photoVisible"
                            :imgSrc="imgSrc"></PhotoComponent>
        </div>
        <div v-if="showBtn">
            <dlg-footer :btninfos="ftBtnArrays[btnType]" @ftClick="ftClick"></dlg-footer>
        </div>
    </div>

</template>

<script>


    import {mapGetters} from 'vuex';
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {
        getIssueType,
        getCustomerType,
        getVehicleType,
        getVehicleClassType,
        getVehicleUserType,
        getCardType,
        getCardColor,
        getObuIssue,
        cities
    } from '../../utils/dictionaries'
    import fetch from '@/utils/fetch'
    import PhotoDialog from '@/components/PhotoDialog'
    import PhotoComponent from '@/components/PhotoComponent'
    import api from '@/api'
    import electronicArchives from '../electronicArchives';

    export default {
        name: 'vehicleInfo',
        props: {
            showBtn: {
                type: Boolean,
                default: false
            },
            showForce: {
                type: Boolean,
                default: false
            },
            active: {
                type: String,
                default: '0'
            },
            btnType: {
                type: String,
                default: 'vehicleCancellation'
            },
        },
        components: {
            DlgFooter,
            PhotoDialog,
            electronicArchives,
            PhotoComponent,
        },

        data() {
            return {
                ftBtnArrays: ftBtns,
                reason: '',

                travelImage: '', // 行驶证base64
                travelSuccess: false,   // 行驶证上传状态
                IdentityFrontImage: '',// 身份证(人像面)base64
                IdentityFrontSuccess: false,// 身份证(人像面)上传状态
                IdentityBackImage: '',// 身份证(国徽面)base64
                IdentityBackSuccess: false, // 身份证(国徽面)上传状态

                cancel_serial: '',  //强制注销编号
                imgSrc: '',
                chooseImage: 0,
                photoVisible: false,
                pictureList: [],
                list: [],
                vList:{
                    '0':{
                        background: '#4494F9',
                        color:'#fff',
                    },
                    '1':{
                        background: '#ffbc52',

                    },
                    '2':{
                        background: '#4a4a4a',

                        color:'#fff'
                    },
                    '3':{
                        background: '#f3f3f3',

                    },
                    '4':{
                        backgroundImage:`url(${require('@assets/gradualGreen.png')})`,

                        backgroundRepeat:'repeat-x',
                        backgroundSize:'100% 100%'

                    },
                    '5':{

                    },
                    '6':{
                        backgroundImage:`url(${require('@assets/bw.png')})`,
                        backgroundRepeat:'repeat-x',
                        backgroundSize:'100% 100%',

                    }
                },
            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
            vehicleClass: function () {
                return getVehicleClassType(this.vehicleInfo.vehicle_class) + '[' + getVehicleType(this.vehicleInfo.vehicle_type) + ']'
            },
        },
        mounted() {
            console.log(this.vehicleInfo, 'vehicleInfo');
            if (this.showForce) {
                // 强制注销
                //
                fetch({
                    url: api['vehiclePassiveCancelinit'].url || '',
                    method: 'post',
                    data: {
                        method: api['vehiclePassiveCancelinit'].method,
                        customer_id: this.customerInfo.customer_id,
                        vehicle_color: this.vehicleInfo.vehicle_color,
                        vehicle_code: this.vehicleInfo.vehicle_code,
                    }
                }).then((res) => {
                    this.cancel_serial = res.cancel_serial

                }).catch((err) => {
                    this.$alert(err.message, '提示', {
                        dangerouslyUseHTMLString: true,
                        showClose: false,
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                })
            }
        },
        methods: {
            getVType(val) {
                return getVehicleType(val);
            },
            getClass(type) {
                let result = '';
                switch (type) {
                    case '0':
                        result = 'blue';
                        break;
                    case '1':
                        result = 'yellow';
                        break;
                    case '2':
                        result = 'black';
                        break;
                    case '3':
                        result = 'white';
                        break;
                    case '4':
                        result = 'gradualGreen';
                        break;
                    case '5':
                        result = 'yellowGreen';
                        break;
                    case '6':
                        result = 'blueWhite';
                        break;

                }
                return result;
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
            closeImageShow() {
                this.photoVisible = false;
            },
            arrowClick(direction) {
                if (this.list.length > 1) {
                    if (direction === 'left') {
                        if (this.chooseImage >= 1) {
                            this.chooseImage = this.chooseImage - 1;
                            this.imgSrc = '/archives/display/L/' + this.list[this.chooseImage].file_code;
                        } else {
                            this.noMore()
                        }
                    } else {
                        if (this.chooseImage < (this.list.length - 1)) {
                            this.chooseImage = this.chooseImage + 1;
                            this.imgSrc = '/archives/display/L/' + this.list[this.chooseImage].file_code;
                        } else {
                            this.noMore()
                        }
                    }
                } else {
                    this.noMore()
                }

            },
            // 点击展示大图
            toggleShowImage(file_code, index) {
                this.list = this.pictureList.filter((item) => {
                    return item
                })
                this.photoVisible = true;
                this.chooseImage = index === '17' ? 0 : (index === '18' ? 1 : 2);
                this.imgSrc = '/archives/display/L/' + file_code;

            },
            deletePicture(code) {
                this.pictureList[code] = null;
            },
            handlePhotoLink(option) {
                if (option.code === '17') {
                    this.travelSuccess = true;
                } else if (option.code === '18') {
                    this.IdentityFrontSuccess = true;
                } else if (option.code === '19') {
                    this.IdentityBackSuccess = true;
                }
                this.pictureList[option.code] = option;
            },
            check() {
                let r = true;
                if (this.vehicleInfo.cpu_card_id) {
                    this.$msgbox({
                        title: '警告',
                        customClass: 'my_msgBox singelBtn',
                        message: '该车已绑定有CPU卡不可注销',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                } else if (this.vehicleInfo.obu_id) {
                    this.$msgbox({
                        title: '警告',
                        customClass: 'my_msgBox singelBtn',
                        message: '该车已绑定有OBU不可注销',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                }

                return r;
            },
            // 车辆注销
            VehicleCancellation() {
                let _this = this;
                if (!this.check()) {
                    return;
                }
                fetch({
                    url: api['vehicleCancel'].url || '',
                    method: 'post',
                    data: {
                        method: api['vehicleCancel'].method,
                        customer_id: this.customerInfo.customer_id,
                        vehicle_color: this.vehicleInfo.vehicle_color,
                        vehicle_code: this.vehicleInfo.vehicle_code,
                    }
                }).then((res) => {
                    this.$msgbox({
                        title: '注销成功',
                        customClass: 'my_msgBox singelBtn',
                        message: '车辆注销成功',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                            this.$emit('closeMainDiadog')
                            _this.getUserInfo({
                                customer_id: this.customerInfo.customer_id,
                            })
                        }
                    })
                }).catch((err) => {
                    this.$alert(err.message, '提示', {
                        dangerouslyUseHTMLString: true,
                        showClose: false,
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                })
            },
            compulsoryCancelCheck() {
                let r = true;
                if (!this.reason) {
                    this.$msgbox({
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        message: '请输入强制注销原因',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                } else if (!(this.travelSuccess && this.IdentityFrontSuccess && this.IdentityBackSuccess)) {
                    this.$msgbox({
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        message: '请先上传完整的证件照片',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                }
                return r

            },
            // 车辆强制注销
            compulsoryCancellation() {
                let _this = this;
                if (this.compulsoryCancelCheck()) {
                    fetch({
                        url: api['vehiclePassiveCancel'].url || '',
                        method: 'post',
                        data: {
                            method: api['vehiclePassiveCancel'].method,
                            customer_id: this.customerInfo.customer_id,
                            vehicle_color: this.vehicleInfo.vehicle_color,
                            vehicle_code: this.vehicleInfo.vehicle_code,
                            reason: this.reason,
                            cancel_serial: this.cancel_serial,
                        }
                    }).then((res) => {
                        this.$msgbox({
                            title: '强制注销成功',
                            customClass: 'my_msgBox singelBtn',
                            message: '车辆强制注销成功',
                            showCancelButton: false,
                            confirmButtonText: '确定',
                            beforeClose: (action, instance, done) => {
                                done();
                                this.$emit('closeMainDiadog')
                                _this.getUserInfo({
                                    customer_id: this.customerInfo.customer_id,
                                })
                            }
                        })
                    }).catch((err) => {
                        this.$alert(err.message, '提示', {
                            dangerouslyUseHTMLString: true,
                            showClose: false,
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    })
                } else {

                }

            },
            ftClick(cmd) {
                if (cmd === cmds.vehicleCancellation) {
                    this.VehicleCancellation();
                } else if (cmd === cmds.compulsoryCancellation) {
                    this.compulsoryCancellation()
                }

            },


        },
        filters: {
            getIssueTypeFilters(val){
              return getIssueType(val);
            },
            getCustomerTypeFilter(val) {
                return getCustomerType(val);
            },
            getVehicleTypeFilter(val) {
                return '[' + getVehicleType(val) + ']';
            },
            getVehicleClassTypeFilter(val) {
                return getVehicleClassType(val);
            },
            getVehicleUserTypeFilter(val) {
                return getVehicleUserType(val);
            },
            getCardTypeFilter(val) {
                return getCardType(val);
            },
            getCardColorFilter(val) {
                return getCardColor(val);
            },
            getObuIssueFilter(val) {
                return getObuIssue(val);
            },
            vehicleCityFilter(val) {
                if (val) {
                    let city = cities.filter((item) => {
                        if (item.city_code === val) {
                            return item
                        }
                    });
                    return city[0].city_name
                } else {
                    return ''
                }

            },
        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    @import "../../styles/mixin";
    @import "../../styles/common";

    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: $dialog-height;

        .my_list_row {
            height: $dialog-height;
            overflow-y: auto;
        }

        .upLoadPicture {
            display: flex;
            flex-direction: row;
            align-items: center;

            .upLoadPictureItem {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 5px;

                .btnBox {
                    min-width: 80px;
                    padding: 3px 8px;
                    border: 1px solid #e5e5e5;
                    font-size: 12px;
                    text-align: center;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .complete {
                    color: $second-color;
                    border-color: $second-color;
                }
            }

            .previewPicture {
                margin-bottom: 15px;
                position: relative;
                width: 128px;
                height: 100px;

                .file-remove {
                    z-index: 1;
                    position: absolute;
                    right: 4px;
                    display: none;
                    top: 4px;
                    width: 22px;
                    height: 22px;
                    font-size: 21px;
                    text-align: center;
                    vertical-align: middle;
                    color: white;
                    cursor: pointer;
                    line-height: 20px;
                    border-radius: 100%;
                    transform: rotate(45deg);
                    background: rgba(0, 0, 0, 0.5);
                }

                &:hover .file-remove {
                    display: inline;
                }

                .previewPictureModel {
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }

                .previewPictureClose {
                    /*background-image: ;*/
                }

                .previewPictureDiv {
                    width: 128px;
                    height: 100px;
                    border: 1px dashed #e5e5e5;
                }

                img {
                    width: 128px;
                    height: 100px;
                }
            }
        }

        .forceVehicle {
            .el-textarea {
                width: 70%;
            }
        }
        .vehicle_code{
            border-radius: 6px;
            padding: 5px 10px;
        }

        .blue {
            color: #fff;

            .sign {
                background: #196FCA;
            }

            .vehicleCode {
                background: #196FCA;

                .arrowSpan {
                    border-color: transparent transparent transparent #196FCA;
                }
            }
        }

        .yellow {
            color: #000;

            .sign {
                background: #FFBC52;
            }

            .vehicleCode {
                background: #FFBC52;

                .arrowSpan {
                    border-color: transparent transparent transparent #FFBC52;
                }
            }
        }

        .black {
            color: #fff;

            .sign {
                background: #4A4A4A;
            }

            .vehicleCode {
                background: #4A4A4A;

                .arrowSpan {
                    border-color: transparent transparent transparent #4A4A4A;
                }
            }
        }

        .white {
            color: #000;

            .sign {
                background: #F3F3F3;
            }

            .vehicleCode {
                background: #F3F3F3;

                .arrowSpan {
                    border-color: transparent transparent transparent #F3F3F3;
                }
            }
        }

        .gradualGreen {
            color: #000;

            .sign {
                background: linear-gradient(to top, #72EC72 20%, #F3FFF3 90%);

            }

            .vehicleCode {
                background: linear-gradient(to top, #72EC72 20%, #F3FFF3 90%);

                .arrowSpan {
                    border-color: transparent transparent transparent #A4F3A4;
                }
            }
        }

        .yellowGreen {
            color: #000;

            .sign {
                background: #FFBC52;

            }

            .vehicleCode {
                background: #72EC72;

                .arrowSpan {
                    border-color: transparent transparent transparent #72EC72;
                }
            }
        }

        .blueWhite {
            color: #000;

            .sign {
                background: linear-gradient(to top, #509AEA 20%, #F3FFF3 90%);

            }

            .vehicleCode {
                background: linear-gradient(to top, #509AEA 20%, #F3FFF3 90%);

                .arrowSpan {
                    border-color: transparent transparent transparent #CEE8F1;
                }
            }
        }
        .vehicleCodeDiv{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
        }
        .autoSizeBackImage {
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: flex-start;
            border-bottom-right-radius: 6px;
            border-top-right-radius: 6px;

            .sign {
                padding: 4px 10px;
                padding-left: 15px;
                border-bottom-left-radius: 6px;
                border-top-left-radius: 6px;
            }

            .vehicleCode {
                padding: 4px 0;
                padding-right: 15px;
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
            }

            .arrowSpan {
                position: absolute;
                top: 50%;
                right: -12px;
                margin-top: -6px;
                width: 0;
                height: 0;
                display: inline-block;
                border-width: 6px;
                border-style: solid;
                word-break: break-all;

            }

            .details {
                font-size: .3rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                background: #ffffff;

                color: #01A79A;
                padding: 0 10px;

            }
        }

    }

</style>
