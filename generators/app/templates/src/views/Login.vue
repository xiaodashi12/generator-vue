<template>
    <div class="login-container">
        <div class="login-header"></div>
        <div class="card-box">
            <h1>江苏省ETC发行管理系统</h1>
            <el-form
                    class="login-form"
                    autoComplete="on"
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-position="left">
                <div class="login_msg" v-if="loginMsg">
                    <i class="el-icon-error"></i>
                    <p class="error">
                        {{loginMsg}}
                    </p>
                </div>
                <el-form-item prop="userName" class="item">
                    <el-input
                            placeholder="请输入用户名"
                            name="userName"
                            autoComplete="on"
                            v-model="ruleForm.userName">
                        <i slot="prefix" class="el-icon-etcyonghuming"></i>
                    </el-input>
                </el-form-item>
                <el-form-item
                        prop="password"
                        class="item">
                    <el-input
                            placeholder="请输入密码"
                            name="password"
                            :type="isShowPwd ? 'text' : 'password'"
                            @keyup.enter.native="handleLogin"
                            v-model="ruleForm.password"
                            autoComplete="on">
                        <i slot="prefix" class="el-icon-etcyonghuming1"></i>
                    </el-input>
                </el-form-item>
                <div class="vCode" v-if="code.isVCode">
                    <el-form-item
                            prop="verification_code"
                            class="item">
                        <el-input
                                placeholder="请输入验证码"
                                name="app_ver"
                                type="text"
                                v-model="ruleForm.verification_code">
                            <i slot="prefix" class="el-icon-etcyanzhengma"></i>
                        </el-input>
                    </el-form-item>
                    <div id="code" title="看不清？换一张～" @click="handleOnRandom">
                        <img :src="'/issue/captcha?n='+ rand"/>
                    </div>
                </div>

                <div>
                    <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading"
                               @click.native="handleLogin()">登录
                    </el-button>
                </div>
            </el-form>
        </div>
        <div class="login-footer">

        </div>
    </div>
</template>

<script>
    import api from '@/api'
    import {mapActions} from 'vuex';
    import {loading} from "../utils/dialogUtils";
    import {getSecuCode} from "../utils/dialogUtils";
import { getToken, setToken, removeToken, getLocalStorage, setLocalStorage,clearLocalStorage } from '@/utils/auth'
    export default {
        data() {
            let validatePwd = (rule, value, callback) => {

                if (value === "" || value === undefined) {
                    callback(new Error("请输入密码"));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    userName: "admin",
                    password: "admin",
                    checked: true
                },
                rules: {
                    userName: [
                        {required: true, message: "请输入登录名", trigger: "blur"}
                    ],
                    password: [{validator: validatePwd, trigger: "blur"}]
                },
                code: {
                    isVCode: false,//是否显示验证码
                    src: ''
                },
                rand: 0,
                error12: 0,
                loginMsg: '',
                isShowPwd: false, // 是否显示密码
                loading: false, // 登录loading
            };
        },
        methods: {
            ...mapActions([
                'Login'
            ]),
            handleLogin() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        let params = {
                            userName: this.ruleForm.userName,
                            password: this.ruleForm.password,
                        }

                        this.Login(params).then(res => {
                            this.loginMsg = '';
                             console.log('res'+res)
                           if(getLocalStorage('operatorInfo').code==200){
                                this.$router.push({name: 'NewDashBoard'});
                           }else if(getLocalStorage('operatorInfo').code!=200){
                                this.loginMsg = getLocalStorage('operatorInfo').msg;
                                return;
                           }
                        }, error => {
                            console.log(error)
                            this.loginMsg = error.msg;
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleOnRandom() {
                this.rand += 1;
            }
        },
        created() {
        }
    };
</script>

<style type="text/scss" lang="scss">
    @import "../styles/mixin";
    @import "../styles/common";


    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        @include relative;

        height: 100%;

        .login-header {
            width: 100%;
            height: 50%;
            background: url('../assets/login_bg.png') no-repeat center #fff;
            background-size: 100% 100%;
        }

        .card-box {
            @include fxied-center;
            text-align: center;
            width: 60%;
            transform: translate(-50%, -57%);

            h1 {
                color: #f5f5f5;
                margin-bottom: 20px;
                text-shadow: 2px 2px 5px #0c0c0c;
            }

            .login-form {
                padding: 51px 48px 48px 48px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                box-shadow: 1px 1px 3px #999;
                width: 35%;
                margin: 0 auto;
            }

            .login_msg {
                background-color: #fef2f2;
                color: #6C6C6C;
                line-height: 16px;
                padding: 6px 10px;
                background: #fef2f2;
                border: 1px solid #ffb4a8;
                margin-bottom: 22px;
                overflow: hidden;
                text-align: left;
                display: flex;

                i {

                    padding-right: 10px;
                    color: #f40;
                }

                p {
                    @include f_left;
                    white-space: normal;
                    word-wrap: break-word;
                    padding: 0;
                    margin: 0;
                }
            }
        }

        .item {
            .el-form-item__content {
                display: flex;
                flex-flow: row;

                .el-input__inner {
                    color: #999;
                }
            }

        }

        .vCode {
            display: flex;
            flex-flow: row;
            justify-content: space-between;

            .item {
                width: 60%;
            }

            #code {
                display: block;
                color: #ffffff;
                font-size: 20px;
                padding: 5px 35px 10px 35px;
                margin-left: 5%;
                height: 27px;
                cursor: pointer;
            }
        }

        input {
            border: 0;
            -webkit-appearance: none;
            color: $light_gray;
            height: 100%;
        }

        .el-input {
            display: inline-block;
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 0.13333rem;
        }

        .svg-container {
            padding: 0.08rem 0.0666rem 0.08rem 0.2rem;
            color: $dark_gray;
            vertical-align: middle;
            display: inline-block;

            &_login {
                font-size: 20px;
            }
        }

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0 auto 0.5333rem auto;
            text-align: center;
            font-weight: bold;
        }

        .el-form-item {
            border: 1px solid #cbcbcb;
            background: #fff;
            border-radius: 5px;
            color: #9f9f9f;
        }

        .show-pwd {
            position: absolute;
            right: 0.1333rem;
            top: 0.09333rem;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
        }

        .login-footer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 32px;
            background: url('../assets/login-ft.png') no-repeat center;
        }

        .SoftwareDownload{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .SoftwareDownloadTitle{
                margin-right: 10px;
            }
            .SoftwareDownloadClick{
                flex: 1;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;

            }
            span{
                color: $three-color;
                margin-right: 8px;
                cursor: pointer;
            }
            .line{
                font-weight: 500;
                color: black;
            }
        }
    }
</style>
        