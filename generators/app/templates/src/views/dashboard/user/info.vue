<template>
    <div class="userInfo">
        <div
                class="ct"
                v-loading="Object.keys(customerInfo).length == 0"
                element-loading-text="请新增或搜索用户"
                element-loading-spinner="el-icon-etcwushuju"
                element-loading-background="rgba(255, 255, 255, 0.8)"
        >
            <div class="hd">
                <div>
                     <span class="tl">
                    <b v-text="getType(customerInfo.customer_type)">222</b>
                    <b>用户</b>
                </span>
                    <span v-text="customerInfo.customer_name"></span>
                </div>
                <div>
                    <i class="el-icon-close" @click="handleOnCloseUser"></i>
                </div>
            </div>
            <dynamic-list-item
                    :listArr="listArr"
                    :valObj="customerInfo">
            </dynamic-list-item>
            <div class="vehicleInfor">
                <div class="bind_card_list">
                    <div class="fl">
                        绑定车辆: <b v-text="customerInfo['vehicles'] ? customerInfo['vehicles'].length : 0"></b>辆
                    </div>
                    <div class="rg">
                        <el-input
                                placeholder="车牌筛选"
                                @input="handleOnblur"
                                suffix-icon="el-icon-search"
                                v-model="veHicleSearch">
                        </el-input>
                    </div>
                </div>
                <div class="vehicleListscroll">
                    <div class="vehicleListO vlist" v-if="customerInfo['vehicles']">
                        <ul>
                            <li
                                    :key="'one'+ index"
                                    :style="vList[v.vehicle_color]"
                                    :class="v.vehicle_color==='5'?'special':''"
                                    v-for="(v,index) in vehiclesOne"
                                    class="infoItem"
                                    @click="handleOnVehicle(v)">
                                <div style="font-size:15px" class="infoItem_item">
                                    <div v-text="'['+getVType(v.vehicle_type)+']'"></div>
                                    <div v-text="v.vehicle_code" class="vehicleCode"></div>
                                </div>
                            </li>
                            <li class="more" @click="handleOnMore"
                                v-if="(customerInfo['vehicles'] && customerInfo['vehicles'].length > 8)  && isMore">
                                更多车辆
                            </li>
                        </ul>
                    </div>
                    <transition name="fade">
                        <div class="vehicleListT vlist" v-show="vehicleMoreShow">
                            <ul>
                                <li
                                        :key="'tow'+ index"
                                        :style="vList[v.vehicle_color]"
                                        class="infoItem"
                                        :class="v.vehicle_color==='5'?'special':''"
                                        v-for="(v,index) in vehiclesTwo"
                                        @click="handleOnVehicle(v)"
                                >
                                    <div style="font-size:15px" class="infoItem_item">
                                        <div v-text="'['+getVType(v.vehicle_type)+']'"></div>
                                        <div v-text="v.vehicle_code" class="vehicleCode"></div>
                                    </div>
                                </li>
                                <li class="more" @click="handleOnRetract">
                                    收起车辆
                                </li>
                            </ul>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import DynamicListItem from '@/components/dynamic-list/item'
    import {getCertificatesType, getCustomerType, getVehicleType} from '@/utils/dictionaries'
    import _minx from './minx.js'
    import {mapGetters} from 'vuex'


    export default {
        name: 'EtcUserInfo',
        components: {DynamicListItem},
        mixins: [_minx],
        props: {
            loading: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                vehicleMoreShow: false,
                veHicleSearch: '',
                listArr: [],
                vehiclesOne: [],
                vehiclesTwo: [],
                isMore: false,
                vList: {
                    '0': {
                        background: '#4494F9',
                        color: '#fff'
                    },
                    '1': {
                        background: '#ffbc52',
                    },
                    '2': {
                        background: '#4a4a4a',
                        color: '#fff'
                    },
                    '3': {
                        background: '#f3f3f3'
                    },
                    '4': {
                        backgroundImage: `url(${require('@assets/gradualGreen.png')})`,
                        backgroundRepeat: 'repeat-x',
                        backgroundSize: '100% 100%'

                    },
                    '5': {},
                    '6': {
                        backgroundImage: `url(${require('@assets/bw.png')})`,
                        backgroundRepeat: 'repeat-x',
                        backgroundSize: '100% 100%'
                    }
                },
                vListSpan: {
                    '5': {
                        background: '#ffbc52'
                    }
                }
            }
        },
        created() {

            this.listArr = this.getListArr();
            this.initVehicles(this.customerInfo['vehicles']);

        },
        computed: {
            ...mapGetters([
                'customerInfo'
            ])
        },
        watch: {
            customerInfo(newval) {
                this.initVehicles(newval['vehicles']);
            },
            veHicleSearch(newval) {
                this.veHicleSearch = newval.toUpperCase();
            }
        },
        methods: {
            touppercase() {
                this.veHicleSearch = this.veHicleSearch.toUpperCase();
            },
            initVehicles(data) {
                this.vehiclesOne = [];
                this.vehiclesTwo = [];

                if (data && data.length <= 8) {
                    this.vehiclesOne = [].concat(data);
                } else if (data && data.length > 8) {
                    this.vehiclesOne = [].concat(data.slice(0, 8));
                    this.isMore = true;
                }
                console.log(this.vehiclesOne, "oneoneone")
            },
            getType(val) {
                return getCustomerType(val);
            },
            getVType(val) {
                return getVehicleType(val);
            },
            handleOnMore() {

                this.vehicleMoreShow = true;
                this.isMore = false;

                let vehicles = this.customerInfo['vehicles'];
                if (this.veHicleSearch) {
                    vehicles = this.arr;
                }

                this.vehiclesOne = this.vehiclesOne.concat(vehicles.slice(8, 9));

                let twoVal = vehicles.slice(9, vehicles.length);
                this.vehiclesTwo = [].concat(twoVal);

            },
            handleOnRetract() {

                this.vehicleMoreShow = false;
                this.isMore = true;

                this.vehiclesOne.splice(8, 9)
            },
            getListArr() {
                return [[{
                    label: '用户编号：',
                    field: 'customer_id',
                    span: 10,
                }, {
                    label: '开户日期：',
                    field: 'open_date',
                    span: 14,
                }], [{
                    label: '联系人：',
                    field: 'link_man',
                    span: 10,
                }, {
                    label: '手机号码：',
                    field: 'link_mobile',
                    span: 14,
                }], [{
                    label: '证件类型：',
                    field: 'certificates_type',
                    span: 24,
                    record: (val) => {
                        return getCertificatesType(val)
                    }
                }], [{
                    label: '证件号码：',
                    field: 'certificates_code',
                    span: 24,
                }], [{
                    label: '开户网点：',
                    field: 'branch_name',
                    span: 24,
                }], [{
                    label: '联系地址：',
                    field: 'link_address',
                    span: 24,
                }]]
            },
            handleOnCloseUser() {
                this.$emit('OnCloseUser')
            },
            handleOnVehicle(row) {

                if (!this.loading) {
                    // this.$emit('update:loading', true);

                    let carInfo = {
                        vehicle_code: row.vehicle_code,
                        vehicle_color: row.vehicle_color
                    }

                    this.getCarinfo(carInfo).then(res => {

                        // this.$emit('update:loading', false)
                        let canEdit=false
                        let canIssueObu = res[0].only_cpu_card == 0
                        let isCar = res[0].vehicle_type == 0
                        // debugger
                        if(canIssueObu){
                            if(isCar){
                                if(this.$_has({'rights':[5,11]})){
                                    canEdit=true
                                }
                            }else{
                                if(this.$_has({'rights':[9,10,11]})){
                                    canEdit=true
                                }
                            }
                        }else{
                            if(this.$_has({'rights':[6,8]})){
                                canEdit=true
                            }
                        }


                        // let obuRights = ['5', '7', '9', '11']
                        // //let canIssueObu = false
                        //
                        // if (res[0].only_cpu_card == '0') {
                        //     canIssueObu = true
                        // } else {
                        //     for (let i = 0; i < obuRights.length; i++) {
                        //         if (this.$store.getters.operatorInfo.rights.split(',').findIndex(a => a == obuRights[i]) != -1) {
                        //             canIssueObu = true
                        //             break
                        //         }
                        //     }
                        // }
                        if (canEdit) {
                            this.$emit('onVehicle', res[0]);
                        } else {
                            this.$msgbox({
                                showClose: true,
                                type: 'warning', customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString: true,
                                message: "您无权限操作该车辆",
                            });
                        }
                    }).catch(error=>{
                      // this.$emit('update:loading', false)
                      console.log(error);
                      this.$msgbox({
                        message: error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                      })
                    })
                }
            },
            handleOnblur(val) {

                if (!this.customerInfo['vehicles'] || this.customerInfo['vehicles'].length == 0) return false;

                if (val) {

                    let vehicles = this.customerInfo['vehicles'];
                    this.arr = [];

                    vehicles.forEach(el => {

                        if (el.vehicle_code.indexOf(val) > -1) {
                            this.arr.push(el)
                        }
                    })
                    this.isMore = false;
                    this.vehicleMoreShow = false;
                    this.initVehicles(this.arr)
                } else {
                    this.initVehicles(this.customerInfo['vehicles'])
                }

            },
            calulateFsz(length) {
                // 90px  11个字  初始15px
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
    @import "~styles/mixin";

    .userInfo {
        background: #ffffff;

        .ct {
            .hd {
                border: none;
                padding: 10px 5px 0 5px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                color: #4A4A4A;
                height: 34px;
                width: 100%;
                line-height: 34px;

                span {
                    display: inline-block;
                    font-size: 16px;
                }

                .tl {
                    color: #fff;
                    padding: 2px 5px;
                    margin-right: 5px;
                    background-color: $second-color;
                    border-radius: 5px;
                    font-size: 14px;
                    height: 25px;
                    line-height: 25px;
                }

                i {
                    cursor: pointer;
                    display: inline-block;
                    height: 28px;
                    line-height: 28px;
                    padding-right: 10px;
                }
            }
        }

        .list {

            .el-row {
                padding: 0 5px;

                &:nth-child(odd) {
                    background-color: rgba(1, 167, 154, 0.07);
                }

                .listLabel {
                    min-width: 70px;
                    text-align: left;
                }
            }

            .listVal {
                font-size: .4rem
            }
        }

        .vehicleInfor {
            .bind_card_list {
                display: flex;
                font-size: .4rem;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 0 5px;

                .fl {
                    color: #666666;

                    b {
                        color: $second-color;
                    }
                }

                .rg {
                    width: 116px;

                    .el-input__inner {
                        /*  */
                        height: 30px;
                        line-height: 30px;
                        border-radius: 15px;

                    }

                    .el-input__icon {
                        line-height: 30px;
                    }
                }
            }

            .vlist {
                &.vehicleListT {
                    ul {
                        padding-top: 0;
                    }
                }

                ul {
                    padding-top: 20px;
                    font-size: 16px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    flex-wrap: wrap;

                    li {
                        &:hover {
                            box-shadow: 2px 2px 3px #999;
                        }

                        i {
                            font-style: normal;
                            white-space: nowrap;

                        }

                        cursor: pointer;
                        width: 120px;
                        height: 30px;
                        word-break: keep-all;
                        line-height: 30px;
                        color: #000000;
                        margin: 0 2px;
                        text-align: center;
                        margin-bottom: 15px;
                        border-radius: 5px;
                        box-shadow: 1px 1px 3px #999;
                        font-size: .3rem;

                        span {
                            display: inline-block;
                            width: 25px;
                            border-top-left-radius: 5px;
                            border-bottom-left-radius: 5px;
                            float: left;

                        }

                        &.more {
                            background: #ACACAC;
                            color: #fff;
                            font-size: 15px;
                        }
                    }
                }
            }

            .fade-enter-active, .fade-leave-active {
                transition: all 0.2s ease;
            }

            .fade-enter, .fade-leave-to {
                transform: translateY(-10px);
            }

        }

        .el-loading-spinner {
            i {
                font-size: 36px;
            }
        }

        .infoItem {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .infoItem_item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

        }

        .special {
            height: 140px;
            width: 200px;
            background-image: linear-gradient(90deg, #f8aa00 35px, rgb(57, 255, 17) 35px);
        }
    }
</style>