<template>
    <div class="dashboard">
        <aside>
            <div class="s-top">
                <el-tabs v-model="activeName" type="border-card" @tab-click="handleOnClick">
                    <el-tab-pane label="1" name="1">
                        <span slot="label">用户查询</span>
                        <etc-userQuery
                                @onSearchVehicle="handleOnSearchVehicle"
                                @onSearch="handleOnSearch">
                        </etc-userQuery>
                    </el-tab-pane>
                    <el-tab-pane label="2" name="2">
                        <span slot="label">签约查询</span>
                        <etc-signQuery
                                @onSearch="handleOnSearch">
                        </etc-signQuery>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div
                    class="hdTop"
                    :style="hdStyle">
                <h1 v-text="hdTitle"></h1>
                <i v-show="hdTitle == '查询列表'" class="el-icon-close" @click="handleOnClose"></i>
            </div>
            <div class="s-footer"
                 :style="{overflowY: 'scroll',overflowX:'hidden'}">
                <!--个人用户信息-->
                <etc-userInfo
                        v-if="!isShow"
                        :loading.sync="loading"
                        @OnCloseUser="handleOnCloseUser"
                        @onVehicle="handleOnVehicle">
                </etc-userInfo>
                <!--用户信息列表-->
                <etc-UserList
                        v-if="isShow"
                        :type="type"
                        :tableData="tableData"
                        @onClose="handleOnClose"
                        @onRowClick="handleOnRowClick">
                </etc-UserList>
            </div>
        </aside>
        <section>
            <div class="c-hd">
                <div class="tl">
                    <h1><img :src="require('@assets/selected.png')" style="width: 20px"/>当前办理车辆</h1>
                    <i class="el-icon-close" @click="handleOnCloseVehicle"></i>
                </div>
                <div
                        v-loading="Object.keys(vehicleInfo).length == 0"
                        target="暂无车辆1信息"
                        element-loading-text="未选择车辆"
                        element-loading-spinner="el-icon-etcwushuju"
                        element-loading-background="rgba(255, 255, 255, 0.8)">
                    <ul class="currentVehicle">
                        <li @click="showVehicle('detail')">
                            <div class="licensePlate" v-if="vehicleInfo.vehicle_code">
                                <div class="autoSizeBackImage" :class="getClass(vehicleInfo.vehicle_color)">
                                    <div class="sign" :style="plate"
                                         v-text="'['+getVType(vehicleInfo.vehicle_type)+']'"></div>
                                    <div style="position: relative" :style="plate" class="vehicleCode">
                                        {{vehicleInfo.vehicle_code}}
                                        <div class="arrowSpan"></div>
                                    </div>
                                    <div class="details">
                                        <div>详</div>
                                        <div>情</div>
                                    </div>

                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="card">
                                CPU卡号：
                                <span @click="showVehicle('CPU')" class="number"
                                      v-text="vehicleInfo['cpu_card_id'] || '无'"></span>
                                <img v-show="vehicleInfo['cpu_card_id']" :src="require('@assets/_detail.png')"/>
                                <span v-show="vehicleInfo['cpu_card_id']" :class="(vehicleInfo['cpu_status'] == '1') ? 'status': 'status error'"
                                      v-text="_getCpuStatus(vehicleInfo['cpu_status'])"></span>
                            </div>
                            <div class="card">
                                OBU标签：
                                <span @click="showVehicle('OBU')" class="number"
                                      v-text="vehicleInfo['obu_id'] || '无'"></span>
                                <img v-show="vehicleInfo['obu_id']" :src="require('@assets/_detail.png')"/>
                                <span v-show="vehicleInfo['obu_id']" :class="(vehicleInfo['obu_status'] == '1') ? 'status': 'status error'"
                                      v-text="_getObuStatus(vehicleInfo['obu_status'])"></span>
                            </div>
                        </li>
                        <li>
                            <img :src="vehicleInfo['card_type'] &&  vehicleInfo['only_cpu_card'] ? imgs[vehicleInfo.card_type][vehicleInfo.only_cpu_card] : ''"/>
                            <div class="bookKeepName" v-text="_getCardType(vehicleInfo.card_type)"></div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="c-ft">
                <etc-Section></etc-Section>
            </div>
            <mainDialog @onClose="onclose" :title="dialogTitle" :dialogVisible="dialogVisible">
                <div slot="child">
                    <div class="main_dialog">
                        <vehicleInfoComponents v-if="active==='1'"></vehicleInfoComponents>
                        <vehicleCpuIndex v-if="active==='2'"></vehicleCpuIndex>
                        <vehicleObuIndex v-if="active==='3'"></vehicleObuIndex>
                    </div>
                </div>
            </mainDialog>
        </section>
    </div>
</template>
<script>
    import mainDialog from '../../components/mainDialog';
    import vehicleInfoComponents from '../../components/vehicleInfoDir/vehicleInfo';
    import vehicleCpuIndex from '../../components/vehicleInfoDir/vehicleCpu/vehicleCpuIndex';
    import vehicleObuIndex from '../../components/vehicleInfoDir/vehicleObu/vehicleObuIndex';
    import vehicleBlacklist from '../../components/vehicleInfoDir/vehicleBlacklist';
    import accountInfo from '@/components/accountInfoDir/accountInfo';
    import EtcUserQuery from './user/userQuery';
    import EtcSignQuery from './sign/signQuery';
    import EtcUserInfo from './user/info';
    import EtcSection from './section';
    import EtcUserList from './user/list'
    import {mapGetters, mapActions} from 'vuex'
    import {getVehicleType, getCardType, getObuStatus, getCpuStatus, vehicleTabList} from '@/utils/dictionaries'
    import {types} from 'util';

    import {getLocalStorage} from '@/utils/auth'
    import {MessageBox} from 'element-ui'
    import store from './../../store'
    import wsConsts from '@/utils/wsConsts'
    import * as dlgUtils from './../../utils/dialogUtils'

    const list = {
        'detail': {
            active: '1',
            name: '车辆详情'
        },
        'CPU': {
            active: '2',
            name: '卡片详情'
        },
        'OBU': {
            active: '3',
            name: '标签详情'
        },


    }
    export default {
        components: {
            vehicleBlacklist,
            vehicleInfoComponents,
            accountInfo,
            vehicleCpuIndex,
            vehicleObuIndex,
            mainDialog,
            EtcUserQuery,
            EtcSignQuery,
            EtcUserInfo,
            EtcSection,
            EtcUserList
        },
        data() {
            return {
                isShow: false,
                active: '0',
                dialogTitle: '',

                dialogVisible: false,
                type: '',
                userData: [],
                signData: [],
                tableData: [],
                loading: false,
                ldSpinner: 'tt',
                activeName: '1',
                hdStyle: {
                    backgroundImage: 'url(' + require('@assets/customer.png') + ')',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '10px center',
                    paddingLeft: '40px'
                },
                hdTitle: '用户信息',
                imgs: {
                    '1': {//记账
                        '0': require('@assets/bookKeep_b.png'),//蓝卡
                        '1': require('@assets/bookKeep_y.png')//黄卡
                    },
                    '2': {//储值
                        '0': require('@assets/cpu_card_1.png'),//蓝卡
                        '1': require('@assets/cpu_card_2.png')//黄卡
                    }
                },
                vData: [],
                titils: {
                    '1': {
                        name: '查询列表',
                        backgroundImage: 'url(' + require('@assets/customer2.png') + ')'
                    },
                    '2': {
                        name: '搜索列表',
                        backgroundImage: 'url(' + require('@assets/customer2.png') + ')'
                    }
                },
                arrow: {
                    '0': {
                        color: '#fff',
                        background: '#196FCA',
                    },
                    '1': {
                        backgroundImage: `url(${require('@assets/license_1_big.png')})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                        color: '#000'
                    },
                    '2': {
                        backgroundImage: `url(${require('@assets/license_2_big.png')})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                        color: '#fff'
                    },
                    '3': {
                        backgroundImage: `url(${require('@assets/license_3_big.png')})`,
                        backgroundRepeat: 'repeat-x',
                        backgroundSize: '100% 100%',
                        color: '#000'

                    },
                    '4': {
                        backgroundImage: `url(${require('@assets/license_4_big.png')})`,
                        backgroundRepeat: 'repeat-x',
                        backgroundSize: '100% 100%',
                        color: '#000'

                    },
                    '5': {
                        backgroundImage: `url(${require('@assets/license_5_big.png')})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                        color: '#000'
                    },
                    '6': {
                        backgroundImage: `url(${require('@assets/license_6_big.png')})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                        color: '#000'
                    }
                }
            }
        },
        computed: {
            ...mapGetters([
                'vehicleInfo',
                'customerInfo'
            ]),
            plate() {
                return 'fontSize: 30px';
            }
        },
        mounted() {

            // 因首页无接口请求，故再次临时增加刷新页面判断到期时间
            let expireTime = getLocalStorage('expireTime');
            console.log(expireTime < new Date().getTime());
            if (expireTime) {
                if ((expireTime < new Date().getTime())) {
                    console.log(expireTime, new Date().getTime() + 7*24*60*60*1000);
                    dlgUtils.loginTimeout()
                    /*MessageBox.alert('登录信息已失效，请重新登录', '登录过期',  {
                      confirmButtonText: '重新登录',
                      //cancelButtonText: '取消',
                        showClose:false,
                        showCancelButton:false,
                      type: 'warning'
                    }).then(() => {
                      store.dispatch('FedLogOut').then(() => {
                        location.reload()// 为了重新实例化vue-router对象 避免bug
                      })
                    }).catch((error)=>{
                        store.dispatch('FedLogOut').then(() => {
                            location.reload()// 为了重新实例化vue-router对象 避免bug
                        })
                    })*/
                }
            }
        },
        watch: {
            customerInfo(newVal) {
                this.vData = [].concat(newVal['vehicles'] || []);
            },
            loading(newVal) {

                if (newVal) {

                    let hd = document.getElementsByClassName('c-hd')[0];
                    let spinner = hd.getElementsByClassName('el-loading-spinner')[0];
                    let i = spinner.getElementsByTagName('i')[0];

                    i.classList.remove("el-icon-etcwushuju");
                    i.classList.add("el-icon-loading");
                }
            }
        },
        methods: {
            ...mapActions([
                'setCustomerInfo',
                'setVehicleInfo'
            ]),
            showVehicle(type) {
                if(type==='CPU' && this.vehicleInfo.cpu_card_id){
                    this.dialogVisible = !this.dialogVisible;
                    this.active = list[type].active;
                    this.dialogTitle = list[type].name;
                }
                else if(type==='OBU' && this.vehicleInfo.obu_id){
                    this.dialogVisible = !this.dialogVisible;
                    this.active = list[type].active;
                    this.dialogTitle = list[type].name;
                }
                else if(type==='detail'){
                    this.dialogVisible = !this.dialogVisible;
                    this.active = list[type].active;
                    this.dialogTitle = list[type].name;
                }
                else{

                }
            },
            onclose(status) {
                this.dialogVisible = status;
                this.active=0;
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
            getVType(val) {
                return getVehicleType(val);
            },
            _getCpuStatus(val) {
                return getCpuStatus(val);
            },
            _getObuStatus(val) {
                return getObuStatus(val);
            },
            _getCardType(val) {
                return getCardType(val);
            },
            handleOnClick(tab, event) {

                let idx = tab.name;
                this.type = idx;

                if (idx == 2) {//签约查询
                    this.hdTitle = this.titils[idx].name;
                    this.hdStyle.backgroundImage = this.titils[idx].backgroundImage;

                    this.tableData = [].concat(this.signData);
                    this.isShow = true;
                }

                if (idx == 1) {//用户信息

                    if ((Object.keys(this.customerInfo).length > 0 || Object.keys(this.customerInfo).length == 0) && this.userData.length == 0) {

                        this.isShow = false;

                        this.hdTitle = '用户信息';
                        this.hdStyle.backgroundImage = 'url(' + require('@assets/customer.png') + ')';
                    }

                    if (Object.keys(this.customerInfo).length == 0 && this.userData.length > 0) {
                        this.isShow = true;

                        this.hdTitle = this.titils[idx].name;
                        this.hdStyle.backgroundImage = this.titils[idx].backgroundImage;

                        this.tableData = [].concat(this.userData);

                    }

                }
            },
            handleOnCloseUser() {

                if (Object.keys(this.vehicleInfo).length > 0) {
                    this.setVehicleInfo({});
                }
                this.setCustomerInfo({});
                this.userData = [];

                let hd = document.getElementsByClassName('c-hd')[0];
                let spinner = hd.getElementsByClassName('el-loading-spinner')[0];
                let i = spinner.getElementsByTagName('i')[0];

                i.classList.remove("el-icon-loading");
                i.classList.add("el-icon-etcwushuju");

            },
            handleOnCloseVehicle() {

                this.setVehicleInfo({});

                let hd = document.getElementsByClassName('c-hd')[0];
                let spinner = hd.getElementsByClassName('el-loading-spinner')[0];
                let i = spinner.getElementsByTagName('i')[0];

                i.classList.remove("el-icon-loading");
                i.classList.add("el-icon-etcwushuju");
            },
            handleOnSearchVehicle(res) {

                this.handleOnClose();

                let {infos, carInfo} = res;
                if (infos.length) {
                    this.setCustomerInfo(infos[0]);

                    let vehicles = infos[0].vehicles || [];

                    if (carInfo.length > 0) {
                        this.setVehicleInfo(carInfo[0]);
                    }
                } else {
                    this.handleOnCloseUser();
                }
            },
            handleOnClose() {

                this.isShow = false;

                this.hdStyle.backgroundImage = 'url(' + require('@assets/customer.png') + ')';
                this.hdTitle = "用户信息"

                this.userData = [];
                this.tableData = [];


            },
            handleOnSearch(data) {

                let {type, res} = data;

                this.hdStyle.backgroundImage = this.titils[type].backgroundImage;
                this.hdTitle = this.titils[type].name;

                this.isShow = true;
                this.type = type;


                if (type == 1) {//用户查询

                    this.userData = [].concat(res);
                    this.tableData = [].concat(this.userData);

                    this.setVehicleInfo({});
                    this.setCustomerInfo({});
                }
                if (type == 2) {//签约查询

                    this.signData = [].concat(res);
                    this.tableData = [].concat(this.signData);
                }


                let hd = document.getElementsByClassName('c-hd')[0];
                let spinner = hd.getElementsByClassName('el-loading-spinner')[0];
                let i = spinner.getElementsByTagName('i')[0];

                i.classList.remove("el-icon-loading");
                i.classList.add("el-icon-etcwushuju");


            },
            handleOnRowClick(customerId) {

                if (this.type == 2) return false;//签约查询

                if (this.type == 1) {//用户查询

                    this.hdStyle.backgroundImage = 'url(' + require('@assets/customer.png') + ')';
                    this.hdTitle = "用户信息"

                    this.isShow = false;
                    this.userData = [];

                    let field = this.tableData.find(el => el.customer_id == customerId);
                    if (field) {
                        this.setCustomerInfo(field);
                    } else {
                        this.setCustomerInfo({});
                    }

                }

            },
            handleOnVehicle(carInfo) {

                this.setVehicleInfo(carInfo);
            },
            calulateFsz(length) {
                let originFsz = 30;
                let originWidth = originFsz * (length + 3);
                let width = 100;
                let result = width / originWidth * originFsz + 'px';
                return 'fontSize:' + result;
            }
        }
    }
</script>
<style type="text/scss" lang="scss">
    @import "../../styles/mixin";
    @import "../../styles/common";

    .dashboard {
        height: calc(100vh - 50px);
        display: flex;
        width: 100%;
        overflow: auto;
        background: #ffffff;

        aside {
            flex: 0 0 380px;
            display: flex;
            flex-direction: column;
            width: 380px;
            height: 100%;
            border-right: 1px solid #999;
            box-shadow: 2px 2px 3px #b3b3b3;
            border-left: 1px solid #DCDFE6;


            .el-tabs--border-card {
                box-shadow: none;
                border-bottom: none;
                border-right: none;
                border-left: none;

                .el-tabs__content {
                    padding: 10px;
                }
            }

            .el-tabs__item {
                height: auto;

                &.is-active {
                    border-top: 2px solid $second-color;
                }
            }

            .s-footer {
                flex: 1;

            }

            .hdTop {
                @include clearfix;
                height: 35px;
                line-height: 35px;
                border-bottom: 1px solid #e3e5e8;
                background-size: 20px 20px;

                h1 {
                    @include f_left;
                    font-size: 14px;
                    font-weight: normal;
                }

                .el-icon-close {
                    @include f_right;
                    color: #666;
                    text-align: left;
                    margin-right: 10px;
                    cursor: pointer;
                    padding: 10px;
                }
            }
        }

        section {
            flex: 1;
            max-width: 1160px;
            min-width: 850px;
            overflow-y: scroll;
            overflow-x: scroll;
            padding: 0 10px;

            .c-hd {
                text-align: left;
                color: #999999;
                font-size: 16px;
                font-weight: 400;

                .tl {
                    @include clearfix;
                    border-bottom: 1px solid #DCDEE3;
                    height: 39px;
                    line-height: 39px;

                    h1 {
                        @include f_left;
                        font-size: 20px;

                    }

                    .el-icon-close {
                        @include f_right;
                        display: inline-block;
                        height: 39px;
                        line-height: 39px;
                        cursor: pointer;
                    }
                }

                .currentVehicle {
                    padding: .35rem 0;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    cursor: pointer;

                    li {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        justify-content: center;

                        img {
                            width: .7rem;
                            visibility: unset;
                        }

                        &:last-child {
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;

                            img {
                                width: 2rem;
                                margin-bottom: 5px;
                                visibility: unset;
                            }
                        }

                        .licensePlate {
                            position: relative;

                            .autoSizeBackImage {
                                min-width: 170px;
                                position: relative;
                                display: flex;
                                align-items: center;
                                flex-direction: row;
                                justify-content: flex-start;
                                box-shadow: 3px 3px 4px #e5e5e5;
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

                        }

                        .card {
                            font-size: 14px;
                            color: #999;
                            height: 30px;
                            line-height: 30px;

                            span {
                                display: inline-block;

                                &.number {
                                    width: 198px;
                                    color: #01A79A;
                                    font-size: 20px;
                                    letter-spacing: 1px;
                                    margin-right: 10px;
                                }

                                &.status {
                                    padding-left: 32px;
                                    font-size: 16px;

                                    &.error {
                                        color: $rd;
                                    }
                                }
                            }

                        }

                        .bookKeepName {
                            font-size: 18px;
                            color: $second-color;
                            letter-spacing: 5px;
                        }
                    }
                }
            }
        }

        .query {
            .el-button {
                color: #fff;
                box-shadow: 1px 1px 3px #333;
                border: none;
            }

            .el-input {
                .el-input__inner {
                    height: 32px;
                    line-height: 32px;
                }
            }

            .item {
                display: flex;

                .el-select {
                    margin-right: 4px;
                }

            }
        }

    }

    .el-loading-spinner {
        i {
            font-size: 36px;
        }
    }

</style>
