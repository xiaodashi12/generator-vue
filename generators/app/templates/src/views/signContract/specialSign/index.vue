<template>
    <div class="container">
        <div class="special-sign">
            <el-form class="sp-form" ref="signInfo" size="normal" :model="signInfo" :rules="rules" label-suffix=""
                     label-width="118px"
                     label-position="right">
                <el-row :span="24">
                    <el-col :span="24">
                        <el-form-item label="车牌颜色：" class="vehicle-color" prop="vehicle_color">
                            <el-radio-group v-model="signInfo.vehicle_color"
                                            label="1">
                                <el-radio-button v-for="(value,key) in vehicleColors" :label="key" :key="key">{{value}}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="12">
                        <el-form-item class="item" prop="vehicle_code">
                            <label slot="label">车&ensp;牌&ensp;号：</label>
                            <el-input placeholder="请输入车牌号" v-model="signInfo.vehicle_code">

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作类型：" prop="issue_obu">
                            <el-radio-group v-model="signInfo.operation">
                                <el-radio-button :label="1" :key="1">签约
                                </el-radio-button>
                                <el-radio-button :label="2" :key="2">撤销签约
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="24">
                        <el-form-item label="车辆类型：" class="vehicle-color" prop="vehicle_color">
                            <el-radio-group v-model="signInfo.car_category"
                                            label="1">
                                <el-radio-button v-for="(value,key) in vehicleSpecialType" :label="key" :key="key">
                                    {{value}}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <dlg-footer :btninfos="ftBtnArrays.specialSign" @ftClick="ftClick"></dlg-footer>
    </div>
</template>

<script>
    import * as dict from "@utils/dictionaries"
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {cmds, ftBtns} from "@utils/ftBtnConsts";
    import fetch from '@utils/fetch'
    import api from '@/api'

    export default {
        props: {},
        components: {
            DlgFooter,
        },
        data() {
            return {
                ftBtnArrays: ftBtns,
                progressStr: '加载中，请稍候...',
                vehicleColors: dict.vehicleColors,
                vehicleSpecialType: dict.vehicleSpecialType,
                signInfo: {
                    car_category: '5',
                    vehicle_color: '0',
                    vehicle_code: '',
                    operation: '1',
                },
                rules: {
                    vehicle_code: [{required: true, message: '请输入车牌', minLength: 6, trigger: 'blur'},
                        {type: 'string', min: 5, max: 10, message: '车牌号长度不足', trigger: 'blur'},
                        {
                            pattern: '^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z0-9]{1}[A-Z0-9]{1}([京津沪渝桂蒙宁新藏冀晋辽吉黑苏浙皖赣闽鲁粤鄂湘豫川云贵陕甘青琼])?[A-NP-Z0-9]{1}[A-NP-Z0-9]{3}[A-NP-Z0-9挂学警港澳领试超外]{1}([A-NP-Z0-9外])?)|([A-Z0-9]{7})$',
                            message: '请输入合法车牌号',
                            trigger: 'blur'
                        }
                    ],
                }
            }
        },
        methods: {
            ftClick: function (cmd) {
                switch (cmd) {
                    case cmds.specialSign:
                        this.$refs.signInfo.validate(valid => {
                            if (valid) {
                                let msg = this.signInfo.operation == '1' ? "签约" : '撤销特殊签约'
                                this.startLoading();
                                fetch({
                                    url: api['specialSign'].url || '',
                                    method: 'post',
                                    data: {
                                        method: api['specialSign'].method,
                                        ...this.signInfo
                                    }
                                }).then((res) => {
                                    this.endLoading()
                                    this.$msgbox({
                                        message: msg + "操作成功", title: "成功", type: 'success',
                                        showCancelButton: false,
                                        customClass: 'my_msgBox singelBtn',
                                        confirmButtonText: '确定'
                                    })
                                }).catch((e) => {
                                    this.endLoading()
                                    this.$msgbox({
                                        message: msg + "操作失败：" + e.message,
                                        title: "失败",
                                        type: 'error',
                                        showCancelButton: false,
                                        customClass: 'my_msgBox singelBtn',
                                        confirmButtonText: '确定'
                                    })
                                });
                            }
                        })
                        break;
                    default:
                        break
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import "../../../styles/common";

    .container {
        .special-sign {
            height: $dialog-height;

            .sp-form {
                margin: 20px 4% 0px 4%;
                height: $dialog-height;
                overflow-y: hidden;
                overflow-x: hidden;
                //display: flex;
                box-sizing: border-box;
            }
        }
    }
</style>