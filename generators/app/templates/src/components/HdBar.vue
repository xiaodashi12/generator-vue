<template>
    <div class="HdBar">
        <div class="lf">
            江苏ETC客户发行管理系统
        </div>
        <div v-show="noticeInfo.show" class="my_marquee_content" style="display:npne">
            <marquee class="my_marquee" :direction="noticeInfo.direction" :scrollamount="noticeInfo.scrollamount" id="">
                <div></div>
            </marquee>
        </div>
        <div class="menu">
            <el-menu class="el-menu-demo status" mode="horizontal">
                <el-submenu index="1" style="display:none;">
                    <template slot="title">
                        <div class="imgs" :style=" sts.cpu == 0 ? normal.cpu : abNormal.cpu"></div>
                        <div class="title" :class="sts.cpu == 0 ? 'hover' : ''">CPU读写器</div>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1">
                            <span @click="handleOnOpen('cpu')">打开读写器</span>
                        </el-menu-item>
                        <el-menu-item index="1-1">
                            <span @click="handleOnClose('cpu')">关闭读写器</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2" style="display:none;">
                    <template slot="title">
                        <div class="imgs" :style="sts.obu == 0 ? normal.obu : abNormal.obu"></div>
                        <div class="title" :class="sts.obu == 0 ? 'hover' : ''">OBU读写器</div>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="2-1">
                            <span @click="handleOnOpen('obu')">打开读写器</span>
                        </el-menu-item>
                        <el-menu-item index="2-1">
                            <span @click="handleOnClose('obu')">关闭读写器</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="3" class="camera" style="display:none;">
                    <div class="imgs" :style="sts.camera == 0 ? normal.camera : abNormal.camera"></div>
                    <div class="title camera" :class="sts.camera == 0 ? 'hover' : ''">高拍仪</div>
                </el-menu-item>
                <el-menu-item index="3" style="display:none;">
                    <div class="imgs" :style="sts.cs == 0 ? normal.cs : abNormal.cs"></div>
                    <div class="title cs" :class="sts.cs == 0 ? 'hover' : ''">桌面发行端</div>
                </el-menu-item>
                <el-menu-item index="4" class="setting" @click="handleOnSetting">
                    <div class="imgs" :style="sts.cs == 0 ? normal.setting : abNormal.setting"></div>
                    <div class="title" :class="sts.cs == 0 ? 'setting' : ''">设置</div>
                </el-menu-item>
            </el-menu>
            <el-menu class="el-menu-demo" mode="horizontal">
                <el-submenu index="2" popper-class="loginInfo">
                    <template slot="title">
                        <div class="avatar">
                            <div class="name">{{operatorInfo.data.nickName}}</div>
                            <div class="branch">{{operatorInfo.data.nickName}}</div>
                        </div>
                    </template>
                    <el-menu-item-group>
                        <template slot="title">用户中心</template>
                        <el-menu-item index="1-1">你好 - {{this.operatorInfo.data.nickName}}</el-menu-item>
                        <el-menu-item index="1-2">
                            <span @click="handleOnLogOut">退出登录</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </div>
        <main-dialog
                title="参数设置"
                :dialogVisible="setUpVisible"
                @onClose="setUpVisible = !setUpVisible">
            <div slot="child">
                <dynamic-form
                        :style="{'width':'70%','margin':'20px auto'}"
                        :formDomains="formDomains"
                        :formLabelAlign="formLabelAlign"
                        @input="handleInput">
                </dynamic-form>
                <etc-DlgFooter :btninfos="ftBtnArrays" @ftClick="handleOnSave"></etc-DlgFooter>
            </div>
        </main-dialog>
    </div>
</template>

<script>

    import {mapGetters, mapActions} from 'vuex'
    import wsApi from '@/api/wsApi'
    import dynamicForm from '@/components/dynamic-form/form'
    import {debug} from 'util';
    import {debuggerStatement} from '@babel/types';
    import MainDialog from '@/components/mainDialog';
    import EtcDlgFooter from "@/components/Dialog/DlgFooter";
    import { notice } from '../../public/static/notice'
    export default {
        name: 'HdBar',
        components: {dynamicForm, MainDialog, EtcDlgFooter},
        props: {},
        data() {
            return {
              noticeInfo: notice,
                ftBtnArrays: [{
                    text: "保存",
                    cls: "green-btn",
                    cmd: "mRegistration"
                }],
                formLabelAlign: {},
                formDomains: [],
                setUpVisible: false,
                normal: {
                    'cpu': {
                        backgroundImage: `url(${require('@assets/reader_on.png')})`,
                    },
                    'obu': {
                        backgroundImage: `url(${require('@assets/reader_on.png')})`,
                    },
                    'camera': {
                        backgroundImage: `url(${require('@assets/camera_on.png')})`,
                    },
                    'cs': {
                        backgroundImage: `url(${require('@assets/desktop_on.png')})`,
                    },
                    'setting': {
                        backgroundImage: `url(${require('@assets/setting.png')})`,
                    }
                },
                abNormal: {
                    'cpu': {
                        backgroundImage: `url(${require('@assets/reader_off.png')})`,

                    },
                    'obu': {
                        backgroundImage: `url(${require('@assets/reader_off.png')})`,

                    },
                    'camera': {
                        backgroundImage: `url(${require('@assets/camera_off.png')})`,

                    },
                    'cs': {
                        backgroundImage: `url(${require('@assets/desktop_off.png')})`,
                    },
                    'setting': {
                        backgroundImage: `url(${require('@assets/setting_off.png')})`,
                    }
                },
                sts: {
                    cpu: 1,
                    obu: 1,
                    camera: 1,
                    cs: 1
                }
            }
        },
        computed: {
            ...mapGetters([
                'operatorInfo'
            ])
        },
        created() {
            console.log(this.operatorInfo)
            this.getDesktopStatus();

        },
        destroyed() {
            // wsApi.heartbeat();
        },
        methods: {
            ...mapActions([
                'FedLogOut'
            ]),
            forFunc() {
                this.initForFunc = true;

                let arr = this.getFormDomains();

                let func = (idx) => {

                    if (idx >= arr.length) {

                        this.formDomains = arr;
                        this.settingInit();

                        return false;
                    }

                    const item = arr[idx];
                    this.$set(this.formLabelAlign, item.field, item.defaultVal);

                    func(idx + 1);


                }
                return func(0);


            },
            getFormDomains() {
                let arr = [{
                        name: '读写器类型',
                        field: 'is_desktop_device',
                        fieldType: 3,
                        defaultVal: '',
                        event: {
                            onBtnClick: this.handleOnBtnClick
                        },
                        allVal: [{
                            value: '0',
                            name: 'CPU读写器和OBU读写器'
                        }, {
                            value: '1',
                            name: '二合一读写器'
                        }],
                        rules: [],
                        placeholder: '请选择业务类型'
                    }, {
                        name: 'CPU读写器品牌',
                        field: 'cpu_brand',
                        fieldType: 1,
                        defaultVal: '',
                        parentFiled: 'is_desktop_device',
                        parentValue: '0',
                        allVal: [{
                            name: '金溢',
                            value: '1'
                        }, {
                            name: '搜林',
                            value: '2'
                        }, {
                            name: '聚利',
                            value: '3'
                        }, {
                            name: '搜林（旧版）',
                            value: '4'
                        }],
                        rules: [],
                        placeholder: '请选择业务类型'
                    }, {
                        name: 'CPU读写器串口号',
                        field: 'cpu_serial_port',
                        fieldType: 2,
                        defaultVal: '',
                        parentFiled: 'is_desktop_device',
                        parentValue: '0',
                        rules: [],
                        placeholder: '请输入CPU读写器串口号'
                    }, {
                        name: 'CPU读写器波特率',
                        field: 'cpu_baud_rate',
                        fieldType: 2,
                        defaultVal: '',
                        parentFiled: 'is_desktop_device',
                        parentValue: '0',
                        rules: [],
                        placeholder: '请输入CPU读写器串口号'
                    }, {
                        name: 'OBU读写器品牌',
                        field: 'obu_brand',
                        fieldType: 1,
                        defaultVal: '',
                        parentFiled: 'is_desktop_device',
                        parentValue: '0',
                        allVal: [{
                            name: '金溢',
                            value: '1'
                        }, {
                            name: '搜林',
                            value: '2'
                        }, {
                            name: '聚利',
                            value: '3'
                        }, {
                            name: '搜林（旧版）',
                            value: '4'
                        }],
                        rules: [],
                        placeholder: '请选择OBU读写器品牌'
                    }, {
                        name: 'OBU读写器串口号',
                        field: 'obu_serial_port',
                        fieldType: 2,
                        defaultVal: '',
                        parentFiled: 'is_desktop_device',
                        parentValue: '0',
                        rules: [],
                        placeholder: '请输入OBU读写器串口号'
                    },
                        
                    {
                        name: '二合一读写器品牌',
                        field: 'dd_brand',
                        fieldType: 1,
                        defaultVal: '',
                        parentFiled: 'is_desktop_device',
                        parentValue: '1',
                        allVal: [{
                            name: '金溢',
                            value: '1'
                        }, {
                            name: '搜林',
                            value: '2'
                        }, {
                            name: '聚利',
                            value: '3'
                        }, {
                            name: '搜林（旧版）',
                            value: '4'
                        }],
                        rules: [],
                        placeholder: '请选择二合一读写器串口号'
                    }, {
                        name: '二合一读写器串口号',
                        field: 'dd_serial_port',
                        fieldType: 2,
                        defaultVal: '',
                        parentFiled: 'is_desktop_device',
                        parentValue: '1',
                        rules: [],
                        placeholder: '请输入OBU读写器串口号'
                    }, {
                        name: '二合一读写器波特率',
                        field: 'dd_baud_rate',
                        fieldType: 2,
                        defaultVal: '',
                        parentFiled: 'is_desktop_device',
                        parentValue: '1',
                        rules: [],
                        placeholder: '请输入OBU读写器波特率'
                    }, {
                        name: 'M1卡槽顺序',
                        field: 'cpu_m1_index',
                        fieldType: 2,
                        defaultVal: '',
                        rules: [],
                        placeholder: '请输入M1卡槽顺序'
                    }
                ]
                return arr;
            },
            getDesktopStatus() {
                let _onSuccess = (_res) => {

                    let rspData = JSON.parse(_res.data);
                    if (rspData.return_code === '0') {

                        let res = JSON.parse(rspData.biz_content);
                        this.sts.remark = res.remark;


                        this.sts['camera'] = res.camera_status;
                        this.sts.cs = 0;

                        if (res.is_desktop_device == 1) {//是二合一

                            Object.keys(this.sts).map(el => {
                                if (el != 'camera' && el != 'cs') {
                                    this.sts[el] = res.dd_reader_status
                                }
                            })
                            return false;
                        }

                        this.sts.cpu = res.cpu_reader_status;
                        this.sts.obu = res.obu_reader_status;

                        // console.log(this.sts, "sts")
                    }
                }
                let _onError = (err) => {

                    Object.keys(this.sts).map(el => {
                        this.sts[el] = 1
                    })
                }
                // wsApi.heartbeat(_onSuccess, _onError);
            },
            handleOnLogOut() {
                this.FedLogOut().then(res => {
                    this.$router.push({name: 'login'});
                });
            },
            onSuccess(res) {
                
                let rspData = JSON.parse(res.data);
                if (rspData.return_code === '0') {

                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: "操作成功！",
                    });

                } else {

                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: rspData.return_msg || "操作失败！",
                    });
                }
            },
            onError(error) {

                this.$message({
                    showClose: true,
                    type: 'error',
                    message: error.message || "操作失败！",
                });
            },
            handleOnOpen(name) {

                // if (name == 'cpu') {
                //     wsApi.openReader(this.onSuccess, (error) => {

                //         this.$alert(error.message, '提示', {
                //             dangerouslyUseHTMLString: true,
                //             showClose:false,
                //             confirmButtonText: '确定',
                //             callback: action => {}
                //         });
                //     })
                // }
                // if (name == 'obu') {
                //     wsApi.opeRsu({type: 0}, this.onSuccess, (error) => {

                //         this.$alert(error.message, '提示', {
                //             dangerouslyUseHTMLString: true,
                //             showClose:false,
                //             confirmButtonText: '确定',
                //             callback: action => {}
                //         });
                //     })
                // }

            },
            handleOnClose(name) {

                // if (name == 'cpu') {
                //     wsApi.closeReader(this.onSuccess, (error) => {
                //         this.$alert(error.message, '提示', {
                //             dangerouslyUseHTMLString: true,
                //             showClose:false,
                //             confirmButtonText: '确定',
                //             callback: action => {}
                //         });
                //     })
                // }

                // if (name == 'obu') {
                //     wsApi.closeRsu({type: 0}, this.onSuccess, (error) => {
                //         this.$alert(error.message, '提示', {
                //             dangerouslyUseHTMLString: true,
                //             showClose:false,
                //             confirmButtonText: '确定',
                //             callback: action => {}
                //         });
                //     })
                // }

            },
            handleOnSetting() {

                if (this.sts.cs != 0) return false;
                this.formLabelAlign = {};

                if (!this.initForFunc) {
                    this.forFunc();
                } else {
                    this.settingInit();
                }

            },
            handleOnBeforSetting() {
                this.wsError = false;
                this.setUpVisible = false;
            },
            settingInit() {

                this.wsError = true;
                this.startLoading();

                // wsApi.readConfig({}, (res) => {

                //     let rspData = JSON.parse(res.data);
                //     this.endLoading();

                //     if (rspData.return_code === '0') {

                //         this.setUpVisible = true;
                //         let bizContent = JSON.parse(rspData.biz_content);

                //         Object.keys(bizContent).forEach(el => {
                //             this.$set(this.formLabelAlign, el, bizContent[el]);
                //         })
                //     } else {

                //         this.$alert(rspData.return_msg, '提示', {
                //             showClose: false,
                //             confirmButtonText: '确定',
                //             dangerouslyUseHTMLString: true,
                //             callback: action => {
                //             }
                //         });

                //     }

                // }, (error) => {

                //     this.endLoading();
                //     if (this.wsError == undefined || this.wsError) {

                //         this.wsError = false;
                //         this.$alert(error.message, '提示', {
                //             dangerouslyUseHTMLString: true,
                //             showClose: false,
                //             confirmButtonText: '确定',
                //             callback: action => {
                //                 this.wsError = true;
                //             }
                //         });
                //     }
                // })
            },
            handleInput(val) {

                this.formLabelAlign = {...val}
                console.log(this.formLabelAlign, "this.formLabelAlign")
            },
            handleOnBtnClick(val, field) {
                if (this.formLabelAlign.hasOwnProperty(field)) {
                    this.formLabelAlign[field] = val;
                }
            },
            handleOnSave() {

                let params = {
                    'is_desktop_device': this.formLabelAlign.is_desktop_device,
                    // 'camera_type':this.formLabelAlign.camera_type,
                    'cpu_m1_index': this.formLabelAlign.cpu_m1_index
                }
                this.formDomains.map(el => {
                    if (el.parentValue == params.is_desktop_device) {
                        params[el.field] = this.formLabelAlign[el.field]
                    }
                })

                console.log(params, '22222')
                // wsApi.saveConfig(params, (res) => {

                //     let rspData = JSON.parse(res.data);
                //     if (rspData.return_code === '0') {

                //         let _this = this;
                //         this.$alert('操作成功', '提示', {
                //             confirmButtonText: '确定',
                //             showClose: false,
                //             callback: action => {
                //                 _this.setUpVisible = false;
                //             }
                //         });

                //     } else {

                //         this.$alert(rspData.return_msg, '提示', {
                //             dangerouslyUseHTMLString: true,
                //             showClose: false,
                //             confirmButtonText: '确定',
                //             callback: action => {
                //             }
                //         });
                //     }
                // }, (error) => {
                //     this.$alert(error.message, '提示', {
                //         dangerouslyUseHTMLString: true,
                //         showClose: false,
                //         confirmButtonText: '确定',
                //         callback: action => {
                //         }
                //     });
                // })
            }
        }
    }
</script>
<style type="text/scss" lang="scss">
    @import "../styles/mixin";
    @import "../styles/common";
    .el-menu--horizontal {
        &.loginInfo {
            .el-menu-item-group__title {
                text-align: left;
                color: #ccc;
                padding: 0
            }

            .el-menu-item {
                font-size: 12px;
                color: #666;

                span {
                    display: inline-block;
                    color: #666;
                    width: 100%;
                }
            }

        }

        .el-submenu:hover .el-submenu__title {
            color: #909399;
        }
    }

    .HdBar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: $header-height;
        line-height: $header-height;
        background-color: $main-color;
        .my_marquee_content{
            flex: 1;
            padding: 0 20px;
            .my_marquee{
                vertical-align: bottom;
                height: 50px;
                line-height: 50px;
                color:#c9c9c9;
                font-size: .5rem;
            }
        }

        .lf {
            height: $header-height;
            line-height: $header-height;
            padding-left: 16px;
            color: $second-color;
            font-size: 24px;

        }
        .my_main_dialog .el-dialog{
            width: 50%;
        }

        .menu {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            .el-menu-demo {
                &.status {

                    .el-icon-arrow-down {
                        display: none;
                    }

                    .el-submenu, .el-menu-item {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        height: $header-height;
                        box-sizing: border-box;
                        min-width: 75px;
                        padding: 0;
                        /*&.camera{*/
                        /*  width:56px;*/
                        /*}*/

                        &.is-active {
                            border-bottom-color: transparent;
                        }

                        &:not(.is-disabled):focus, &:not(.is-disabled):hover {
                            background-color: $main-color;
                        }

                        .el-submenu__title {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-around;
                            align-items: center;
                            padding: 0;
                        }
                    }

                    .imgs {
                        width: 15px;
                        height: 15px;
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        background-position: center;
                        margin: 5px auto 0;
                    }

                    .title {
                        font-size: 12px;
                        color: #666;
                        height: 20px;
                        line-height: 20px;

                        &.hover {
                            color: #01C1B2
                        }

                        &.camera {
                            left: 15px;
                            text-align: center;
                        }

                        &.cs {
                            left: 14px;
                        }

                        &.setting {
                            color: #fff;
                        }
                    }
                }

                background-color: $main-color;

                .el-submenu__title {
                    height: $header-height;
                    line-height: $header-height;

                    &:hover {
                        background-color: $main-color;
                    }
                }
            }

            .avatar {
                position: relative;
                display: inline-block;
                line-height: 1;
                border-radius: 500px;
                white-space: nowrap;
                font-size: 12px;
                top: -3px;

                .name {
                    text-align: left;
                    line-height: 23px;
                    font-size: 13px;
                    color: #f6f7f7;
                    height: 23px;
                }

                img {
                    border-radius: 500px;
                    width: 100%;
                }

                i {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 10px;
                    height: 10px;
                    margin: 1px;
                    border-width: 2px;
                    border-style: solid;
                    border-radius: 100%;

                    &.on {
                        background-color: #6cc788
                    }

                    &.bottom {
                        left: auto;
                        top: auto;
                        bottom: 0;
                        right: 0;
                    }

                    &.b-white {
                        border-color: #ffffff;
                    }
                }


            }
        }
    }
</style>
