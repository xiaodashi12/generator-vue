<template>
    <div class="etcModel">
        <div class="item">
            <div class="model" style="width:65%;">
                <h1>
                    <img :src="require('@assets/new.png')"/>
                    <span>新开户</span>
                </h1>
                <div class="lb wrap">
                    <el-button
                            class="bt"
                            @click="handleOnEdit({title:cmds.saveCustInfo,model:modelType.newuser, type:'new'})">
                        新增用户
                    </el-button>
                    <el-button
                            class="bt"
                            :class="isCustomerInfo? '' : 'is-disabled my_disabled' "
                            :disabled="!isCustomerInfo"
                            @click="handleOnEdit({title:cmds.saveVehicleInfo,model: modelType.newuser})">
                        新增车辆
                    </el-button>
                    <el-button
                            class="bt"
                            :class="isCustomerInfo && isVehicleInfo ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo)"
                            @click="handleOnEdit({title:cmds.cardIssue,model:modelType.newuser})">
                        卡片发行
                    </el-button>
                    <el-button
                            class="bt"
                            v-has="{'rights':[5,7,9]}"
                            :class="isCustomerInfo && isVehicleInfo ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo&&!isOnlyCpuCard)"
                            @click="handleOnEdit({title:cmds.obuIssue,model:modelType.newuser})">
                        标签发行
                    </el-button>
                </div>
            </div>
            <div class="model" style="width:34%;">
                <h1>
                    <img :src="require('@assets/signing.png')"/>
                    <span>签约业务</span>
                </h1>
                <div class="lb wrap">
                    <!-- <el-button
                             class="bt bt_s"
                             v-has="{'rights':[13]}"
                             :class="isCustomerInfo ? '' : 'is-disabled my_disabled' "
                             :disabled="!isCustomerInfo"
                             @click="handleOnEdit({title:cmds.specialSign})">
                         特殊签约
                     </el-button>-->
                    <el-button
                            class="bt bt_t"
                            :class="(isCustomerInfo && isVehicleInfo && cardType == 1) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cardType == 1)"
                            @click="handleOnEdit({title:cmds.unSign})">
                        撤销签约
                    </el-button>
                    <!-- <el-button
                    class="bt bt_d"
                    :class="isCustomerInfo ? '' : 'is-disabled my_disabled' "
                    :disabled="!isCustomerInfo">
                        工行签约
                    </el-button> -->
                </div>
            </div>
        </div>
        <div class="item">
            <div class="model" style="width:39.5%;">
                <h1>
                    <img :src="require('@assets/customer2.png')"/>
                    <span>用户业务</span>
                </h1>
                <div class="lb wrap">
                    <el-button
                            class="bt bt_s"
                            @click="handleOnEdit({title:cmds.saveCustInfo,model:modelType.userbusiness, type:'edit'})"
                            :class="isCustomerInfo ? '' : 'is-disabled my_disabled' "
                            :disabled="!isCustomerInfo">
                        用户变更
                    </el-button>
                    <el-button
                            class="bt bt_s"
                            @click="handleOnEdit({title:cmds.uplCustArch,model:modelType.userbusiness})"
                            :class="isCustomerInfo ? '' : 'is-disabled my_disabled' "
                            :disabled="!isCustomerInfo">
                        用户档案
                    </el-button>
                    <el-button
                            class="bt bt_s"
                            @click="handleOnEdit({title:cmds.createReceipts,model:modelType.userbusiness})"
                            :class="(isCustomerInfo && isVehicleInfo) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo)">
                        受理单
                    </el-button>
                </div>
            </div>
            <div class="model" style="width:60%;">
                <h1>
                    <img :src="require('@assets/vehicle.png')"/>
                    <span>车辆信息</span>
                </h1>
                <div class="lb wrap">
                    <el-button
                            class="bt bt_s"
                            @click="handleOnEdit({title:cmds.saveVehicleInfo,model:modelType.vehicleinfo})"
                            :class="(isCustomerInfo && isVehicleInfo) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo)">
                        车辆变更
                    </el-button>
                    <el-button
                            class="bt bt_s"
                            @click="handleOnEdit({title:cmds.uplVehicleArch,model:modelType.vehicleinfo})"
                            :class="(isCustomerInfo && isVehicleInfo) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo)">
                        车辆档案
                    </el-button>
                    <el-button
                            class="bt bt_t"
                            @click="handleOnEdit({title:cmds.vehicleCancellation,model:modelType.vehicleinfo})"
                            :class="(isCustomerInfo && isVehicleInfo) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo)">
                        车辆注销
                    </el-button>
                    <el-button
                            class="bt bt_6"
                            v-has="{'rights':[4]}"
                            @click="handleOnEdit({title:cmds.compulsoryCancellation,model:modelType.vehicleinfo})"
                            :class="(isCustomerInfo && isVehicleInfo) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo)">
                        强制注销
                    </el-button>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="model" style="width:60%;">
                <h1>
                    <img :src="require('@assets/etc_card.png')"/>
                    <span>卡片业务</span>
                </h1>
                <div class="lb wrap">
                    <el-button
                            class="bt bt_s"
                            @click="handleOnEdit({title:cmds.cardIssue})"
                            :class="(isCustomerInfo && isVehicleInfo && cpuCardId) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cpuCardId)">
                        编辑发行
                    </el-button>
                    <el-button
                            class="bt bt_s"
                            :class="(isCustomerInfo && isVehicleInfo && cpuCardId) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cpuCardId)"
                            @click="handleOnEdit({title:cmds.loss})">
                        挂失解挂
                    </el-button>
                    <el-button
                            class="bt bt_s"
                            @click="handleOnEdit({title:cmds.newCardCheck})"
                            :class="(isCustomerInfo && isVehicleInfo && cpuCardId) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cpuCardId)"
                    >
                        补领换卡
                    </el-button>
                    <el-button
                            class="bt bt_s"
                            :class="(isCustomerInfo && isVehicleInfo && cpuCardId) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cpuCardId)"
                            @click="handleOnEdit({title:cmds.frozen})">
                        冻结解冻
                    </el-button>
                    <el-button
                            class="bt bt_t"
                            :class="(isCustomerInfo && isVehicleInfo && cpuCardId) ? '' : 'is-disabled my_disabled' "
                            @click="handleOnEdit({title:cmds.cardCancellation})"
                            :disabled="!(isCustomerInfo && isVehicleInfo && cpuCardId)">
                        卡片注销
                    </el-button>
                    <el-button
                            class="bt bt_s"
                            :class="(isCustomerInfo && isVehicleInfo && cpuCardId) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cpuCardId)"
                            @click="handleOnEdit({title:cmds.unlock})">
                        卡片解锁
                    </el-button>
                </div>
            </div>
            <div class="model" style="width:40%;">
                <h1>
                    <img :src="require('@assets/money.png')"/>
                    <span>储值业务</span>
                </h1>
                <div class="lb wrap">
                    <!--<el-button
                            class="bt bt_s"
                            :class="(isCustomerInfo && isVehicleInfo && cardType == 2) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cardType == 2)"
                            @click="handleOnEdit({title:cmds.posRecharge})">
                        POS充值
                    </el-button>-->
                    <el-button
                            class="bt bt_s"
                            :class="(isCustomerInfo && isVehicleInfo && cpuCardId && cardType == 2) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cpuCardId && cardType == 2)"
                            @click="handleOnEdit({title:'storedValue'})">
                        储值资金
                    </el-button>
                    <el-button
                            class="bt bt_t"
                            :class="(isCustomerInfo && isVehicleInfo && cpuCardId && cardType == 2) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cpuCardId && cardType == 2)"
                            @click="handleOnEdit({title:'accountInfo'})">
                        账户明细
                    </el-button>
                    <!--<el-button
                            class="bt bt_d"
                            :class="(isCustomerInfo && isVehicleInfo && cardType == 2) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cardType == 2)">
                        退款申请
                    </el-button>-->
                    <!--<el-button
                            class="bt bt_6"
                            :class="(isCustomerInfo && isVehicleInfo && cardType == 2) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && cardType == 2)">
                        储值票据
                    </el-button>-->
                </div>
            </div>
        </div>
        <div class="item">
            <div class="model" style="width:60%;">
                <h1>
                    <img :src="require('@assets/obu.png')"/>
                    <span>标签业务</span>
                </h1>
                <div
                        class="lb wrap"
                        v-has="{'rights':[5,7,9]}">
                    <el-button
                            :class="(isCustomerInfo && isVehicleInfo && obuId) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && obuId)"
                            @click="handleOnEdit({title:cmds.obuIssue})"
                            class="bt bt_s">
                        编辑发行
                    </el-button>
                    <el-button
                            :class="(isCustomerInfo && isVehicleInfo && obuId) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && obuId)"
                            class="bt bt_t"
                            @click="handleOnEdit({title:cmds.labelCancellation})">
                        标签注销
                    </el-button>
                    <el-button
                            :class="(isCustomerInfo && isVehicleInfo && obuId) ? '' : 'is-disabled my_disabled' "
                            :disabled="!(isCustomerInfo && isVehicleInfo && obuId)"
                            class="bt bt_s" @click="handleOnEdit({title:cmds.mRegistration})">
                        维修登记
                    </el-button>
                    <!--<el-button
                    :class="(isCustomerInfo && isVehicleInfo && obuId) ? '' : 'is-disabled my_disabled' "
                    :disabled="!(isCustomerInfo && isVehicleInfo && obuId)"
                    class="bt bt_d">
                        挂起解挂
                    </el-button>-->
                </div>
            </div>
            <div class="model" style="width:39.5%;">
                <h1>
                    <img :src="require('@assets/other.png')"/>
                    <span>其他</span>
                </h1>
                <div class="lb wrap">
                    <el-button class="bt bt_6"
                               @click="handleOnEdit({title:cmds.checkCpu})">卡片检测
                    </el-button>
                    <el-button class="bt bt_6"
                               @click="handleOnEdit({title:cmds.checkObu})">标签检测
                    </el-button>
                    <el-button class="bt bt_6"
                               @click="handleOnEdit({title:cmds.webIssue})">互联网发行
                    </el-button>
                    <el-button class="noBt">标签检测</el-button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import {cmds} from "@/utils/ftBtnConsts";
    import * as dict from "@utils/dictionaries"

    export default {
        data() {
            return {
                cmds: cmds,
                modelType: dict.modelType
            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
            isCustomerInfo() {
                if (Object.keys(this.customerInfo).length > 0) {
                    return true;
                }
                return false
            },
            isVehicleInfo() {
                if (Object.keys(this.vehicleInfo).length > 0) {
                    return true;
                }
                return false
            },
            isOnlyCpuCard() {
                return this.vehicleInfo.only_cpu_card == '1'
            },
            isVehicleColor() {//黄卡 0蓝 1黄 2黑 3白 4渐变绿 5黄绿双拼 6蓝白渐变）

                if (Object.keys(this.vehicleInfo).length > 0 && this.vehicleInfo.vehicle_color != 1) {
                    return true;
                }
                return false
            },
            cardType() {

                if (Object.keys(this.vehicleInfo).length == 0) return '';
                return this.vehicleInfo['card_type'] || '';
            },
            cpuCardId() {

                if (Object.keys(this.vehicleInfo).length == 0) return false;
                if (this.vehicleInfo['cpu_card_id'] != null || this.vehicleInfo['cpu_card_id'] != undefined) {
                    return this.vehicleInfo['cpu_card_id']
                }
                return false;
            },
            obuId() {
                if (Object.keys(this.vehicleInfo).length == 0) return false;
                if (this.vehicleInfo['obu_id'] != null || this.vehicleInfo['obu_id'] != undefined) {
                    return this.vehicleInfo['obu_id']
                }
                return false;
            }
        },
        methods: {
            handleOnEdit(difBtn) {
                this.$emit('onEdit', difBtn);
            },
        }
    }
</script>
<style type="text/scss" lang="scss">
    @import "../../../styles/mixin";

    #moneyDiolag {
        .el-dialog {
            height: 540px;
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
                    font-size: .5rem;
                    color: #01C1B2;
                    letter-spacing: 0;
                    height: 40px;
                }

                .el-dialog__headerbtn {
                    font-size: .5rem;
                    line-height: 40px;
                    top: 0px;
                    right: 10px;
                }
            }

            .el-dialog__body {
                padding: 10px 0px 0px;
            }
        }
    }

    .etcModel {
        .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: .8rem;

            .model {
                /* @include clearfix; */
                display: inline-block;
                box-sizing: border-box;
                padding: 0 10px;
                border: 1px solid #EFEFEF;
                box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.22);

                .lb {
                    display: flex;
                    align-content: flex-start;
                    flex-direction: row;
                    justify-content: flex-start;
                    cursor: pointer;

                    .el-button + .el-button {
                        &.noBt {
                            height: 0;
                            border: none;
                            background: #fff;
                            color: #fff;
                            cursor: auto;

                        }
                    }

                    &.wrap {
                        flex-wrap: wrap;
                    }

                    .bt {
                        text-align: center;
                        margin: .5rem .25rem;
                        min-width: 2.7rem;
                        background-color: $second-color;
                        box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.22);
                        color: #fff;
                        // font-size: .6rem;
                        // padding:0.23rem 0.27rem;
                        border-radius: 5px;

                        &.is-disabled {
                            opacity: 0.8;
                        }

                        &.bt_s {
                            background-color: #fff;
                            border: 1px solid $second-color;
                            color: $second-color;
                        }

                        &.bt_t {
                            background-color: #fff;
                            border: 1px solid $three-color;
                            color: $three-color;
                        }

                        &.bt_d {
                            background: #F7F8FA;
                            border: 1px solid #E6E7EB;
                            color: #CCCCCC;
                        }

                        &.bt_6 {
                            background: #FFFFFF;
                            border: 1px solid #666666;
                            color: #666666;
                        }
                    }
                }

                /* &:last-child{
                    @include f_right;
                } */
                h1 {
                    font-weight: normal;
                    color: #999;
                    font-size: .5rem;
                    border-bottom: 1px solid #DCDEE3;
                    padding: 5px 0;

                    span {
                        display: inline-block;
                        padding-left: 10px;
                    }

                }
            }
        }

        .my_disabled {
            background: #F7F8FA !important;
            border: 1px solid #E6E7EB !important;;
            color: #CCCCCC !important;;
        }

        img {
            width: .5rem;
            vertical-align: unset;
        }
    }
</style>
