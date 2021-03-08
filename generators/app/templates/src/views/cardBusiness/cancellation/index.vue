<template>
    <div class="content">
        <div class="pdf-view" v-show="false" style="z-index: 100">
            <iframe id='previewPdf' :src="fileUrl" height="99%"
                    width="100%">
            </iframe>
        </div>
        <div class="my_list_row">
            <div class="title">原卡用户信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户姓名：</label>
                        <span class="rg">{{customerInfo.customer_name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{vehicleInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{vehicleInfo.vehicle_color | getVehicleColorFilter}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>卡号：</label>
                        <span class="rg">{{vehicleInfo.cpu_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片类型：</label>
                        <span class="rg">{{vehicleInfo.card_type | getCardTypeFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片颜色：</label>
                        <span class="rg">{{vehicleInfo.only_cpu_card | getCardColorFilter}}</span>
                    </el-col>

                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>卡片状态：</label>
                        <span class="rg">{{vehicleInfo.cpu_status | getCpuStatusFilter}}</span>
                    </el-col>
<!--                    <el-col :span="8">-->
<!--                        <label>挂失时间：</label>-->
<!--                        <span class="rg">{{customerInfo.customer_type}}</span>-->
<!--                    </el-col>-->
                </el-row>
            </div>
            <div v-if="cardInfo.cpu_card_id">
                <div class="title">读取卡内信息</div>
                <div class="info">
                    <el-row :span="24">
                        <el-col :span="8">
                            <label>卡片编号：</label>
                            <span class="rg">{{cardInfo.cpu_card_id}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>卡片类型：</label>
                            <span class="rg">{{cardInfo.agency_type | getCardColorFilter}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>卡内余额：</label>
                            <span class="rg">{{cardInfo.balance_money}}</span>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8">
                            <label>车牌号码：</label>
                            <span class="rg">{{cardInfo.vehicle_code}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>车牌颜色：</label>
                            <span class="rg">{{cardInfo.vehicle_color | getVehicleColorFilter}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>启用日期：</label>
                            <span class="rg">{{cardInfo.start_date}}</span>
                        </el-col>
                    </el-row>
                    <el-row :span="24">

                        <el-col :span="8">
                            <label>失效日期：</label>
                            <span class="rg">{{cardInfo.end_date}}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div v-show="!isBookkeeping">
                <div v-show="need_refund === '0'">
                    <div class="title">卡内余额处理转存 <span>*当前用户下存在有效的储值卡车辆,可将余额转存入其他车辆</span></div>
                    <div class="info">
                        <el-row :span="24">
                            <el-col :span="8">
                                <label>转存卡片：</label>
                                <span class="rg">{{chooseVehicleInfo.cpu_card_id}}</span>
                            </el-col>
                            <el-col :span="8">
                                <label>转存车辆：</label>
                                <span class="rg">{{chooseVehicleInfo.vehicle_code}}</span>
                            </el-col>
                            <el-col :span="8">
                                <el-button size="mini" @click="showListBtn" class="reserve-search">选择转存车辆</el-button>
                            </el-col>
                        </el-row>
                        <el-row :span="24" v-show="showCarListTable">
                            <el-table
                                    stripe
                                    :data="carList"
                                    @row-click="handleCurrentChange"
                                    style="width: 100%">
                                <el-table-column
                                        prop="vehicle_code"
                                        label="车牌号码"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="vehicle_color"
                                        label="车牌颜色"
                                        width="180">
                                    <template slot-scope="scope">{{ scope.row.vehicle_color | getVehicleColorFilter }}</template>
                                </el-table-column>
                                <el-table-column
                                        prop="cpu_card_id"
                                        label="cpu卡号">
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </div>
                </div>

                <div v-show="need_refund === '1'">
                    <div class="title">卡内余额退款 <span>*当前用户下不存在有效的储值卡车辆,余额需要退还用户银行卡</span></div>
                    <div class="info">
                        <el-form :model="bankCardInfo" :rules='rules' size="mini" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                            <el-row :span="24">
                                <el-col :span="12">
                                    <el-form-item class="my_form_label" label="银行账号" prop="bank_num">
                                        <el-input maxlength="20" class="my_input" v-model="bankCardInfo.bank_num" placeholder="境内银行账户"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item class="my_form_label" label="开户名" prop="bank_account_name">
                                        <el-input class="my_input"  v-model="bankCardInfo.bank_account_name" placeholder="银行账户开户名"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :span="24">
                                <el-col :span="12">
                                    <el-form-item class="my_form_label" label="开户行" prop="bank_deposit_name">
                                        <el-input class="my_input"  v-model="bankCardInfo.bank_deposit_name" placeholder="银行账户开户行"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item class="my_form_label" label="联系电话" prop="phone">
                                        <el-input class="my_input" maxlength="11" v-model="bankCardInfo.phone" placeholder="用户联系电话"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :span="24">
                                <el-col :span="24">
                                    <el-form-item class="my_form_label" label="办理类型" prop="refund_type">

                                        <el-radio-group v-model="bankCardInfo.refund_type"
                                                        label="1">
                                            <el-radio-button v-for="(value,key) in refundTypeList" :label="key" :key="key">
                                                {{value}}
                                            </el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row :span="24">
                                <el-col :span="24">
                                    <el-form-item class="my_form_label" label="电子档案">
                                        <div class="electronic_archives">
                                            <electronicArchives @toggleShowImage="toggleShowImage" :special_code="refund_serial" name="退款申请单" code="12" @deletePicture="deletePicture" @takePhotoSuccess="handlePhotoLink"></electronicArchives>
                                            <electronicArchives @toggleShowImage="toggleShowImage" :special_code="refund_serial" name="身份证(人像面)" code="13" @deletePicture="deletePicture"  @takePhotoSuccess="handlePhotoLink"></electronicArchives>
                                            <electronicArchives @toggleShowImage="toggleShowImage" :special_code="refund_serial" name="身份证(国徽面)" code="14" @deletePicture="deletePicture"  @takePhotoSuccess="handlePhotoLink"></electronicArchives>
                                            <electronicArchives @toggleShowImage="toggleShowImage" :special_code="refund_serial" name="单位介绍信" code="15" @deletePicture="deletePicture"  @takePhotoSuccess="handlePhotoLink"></electronicArchives>
                                            <electronicArchives @toggleShowImage="toggleShowImage" :special_code="refund_serial" name="委托代办书" code="16" @deletePicture="deletePicture"  @takePhotoSuccess="handlePhotoLink"></electronicArchives>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
            </div>

           <div class="reason_content">
               <div class="reason_result">原因</div>
               <el-input
                       type="textarea"
                       :rows="2"
                       placeholder="请输入内容"
                       v-model="reason">
               </el-input>
           </div>

        </div>
        <dlg-footer v-if="!isBookkeeping && need_refund === '1'" :btninfos="ftBtnArrays.cardCancellation" @ftClick="ftClick"></dlg-footer>

        <dlg-footer v-else :btninfos="ftBtnArrays.cardCancellationTwo" @ftClick="ftClick"></dlg-footer>
        <PhotoDialog :transfer="dialog" @PhotoftClick="photoftClick" @onCloseDialog="onCloseDialog"></PhotoDialog>
        <PhotoComponent @arrowClick="arrowClick" @closeImageShow="closeImageShow" :photoVisible="photoVisible"
                        :imgSrc="imgSrc"></PhotoComponent>
    </div>

</template>

<script>

    import axios from 'axios'
    import {mapGetters, mapActions} from 'vuex';
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import WsConsts from "@/utils/wsConsts";
    import electronicArchives from '@/components/electronicArchives';
    import {
        getVehicleColor,
        refundTypeList,
        getVehicleUserType,
        getCardType,
        getObuIssue,
        getCpuStatus,
        getCardColor,
        cities
    } from '@/utils/dictionaries'
    import fetch from '@/utils/fetch'
    import PhotoDialog from '@/components/PhotoDialog'
    import PhotoComponent from '@/components/PhotoComponent'
    import api from '@/api'
    import WsApi from "@/api/wsApi";
    import {getToken} from '@/utils/auth';

    export default {
        name: 'cancellation',
        props: {

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
                issue_code: '', //销卡随机码
                refund_serial: '',  // 退款单号
                reason: '', //原因
                dialog: {
                    visible: false,
                },
                bankCardInfo: {
                    bank_num: null,
                    bank_account_name: null,
                    bank_deposit_name: null,
                    phone: null,
                    refund_type: '1',
                },
                rules: {
                    bank_num: [
                        { required: true, message: '请输入银行卡', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    bank_account_name: [
                        { required: true, message: '请输入开户名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    bank_deposit_name: [
                        { required: true, message: '请输入开户行名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    phone: [
                        {
                            required: true,
                            pattern: '(^1[3|4|5|6|7|8|9][0-9]{9})$',
                            message: '请输入正确的手机号码',
                            trigger: 'blur'
                        }
                    ],
                    refund_type: [
                        { required: true, message: ''},
                    ],

                },
                refundTypeList: refundTypeList,
                cardInfo: {},
                carList: [],
                isBookkeeping: false,   //是否为记账卡，记账卡没有退款业务
                // showPdf: false,   //是否显示pdf
                fileUrl: '',   //pdf链接
                need_refund: '1',
                showCarListTable: false,
                chooseVehicleInfo: {},
                IDCardFront: false,            // 身份证（人像面）
                IDCardBack: false,             // 身份证（国徽面）
                RefundApplication: false,      // 单位介绍信
                LetterOfIntroduction: false,   // 单位介绍信
                LetterOfAttorney: false,       //委托代办书
                list: [],
                pictureList: [],
                photoVisible: false,
                chooseImage: 0,
                imgSrc: '',
                map: {
                    '12': 0,
                    '13': 1,
                    '14': 2,
                    '15': 3,
                    '16': 4,
                }
            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
        },
        mounted() {
            let _this = this;
            this.startLoading()
            fetch({
                url: api['cardCancelInit'].url || '',
                method: 'post',
                data: {
                    method: api['cardCancelInit'].method,
                    customer_id: _this.customerInfo.customer_id,
                    vehicle_code: _this.vehicleInfo.vehicle_code,
                    vehicle_color: _this.vehicleInfo.vehicle_color,
                    cpu_card_id: _this.vehicleInfo.cpu_card_id,
                }
            }).then(function (response) {

                _this.carList = response.transfer_card_list;
                _this.need_refund = response.need_refund;
                _this.isBookkeeping = response.card_type === '1';
                _this.issue_code = response.issue_code;
                _this.refund_serial = response.refund_serial; // 退款申请单号
                console.log(response, 'response');
                console.log(_this.isBookkeeping, 'response isBookkeeping');
                console.log(_this.need_refund, 'response need_refund');
                _this.endLoading()
            }).catch(function (err) {
                this.$alert(err.message, '提示', {
                    dangerouslyUseHTMLString: true,
                    showClose:false,
                    confirmButtonText: '确定',
                    callback: action => {
                        if (action === 'confirm') {
                            _this.hasCard()
                        }
                    }
                });
                _this.endLoading()
            })
        },
        methods: {
            ...mapActions([
                'setCustomerInfo',
                'setVehicleInfo'
            ]),
            showListBtn() {
                this.showCarListTable = !this.showCarListTable;
            },
            handleCurrentChange(val) {
                console.log(val, 'val');
                this.showCarListTable = false;
                this.chooseVehicleInfo = val;
            },

            handlePhotoLink(option) {
                /**
                 *  IDCardFront: false,            // 身份证（人像面）
                    IDCardBack: false,             // 身份证（国徽面）
                    RefundApplication: false,      // 退款申请单
                    LetterOfIntroduction: false,   // 单位介绍信
                    LetterOfAttorney: false,       //委托代办书
                 * **/
                if (option.code === '12') {
                    //退款申请单
                    this.RefundApplication = true;
                } else if (option.code === '13') {
                    //身份证（人像面）
                    this.IDCardFront = true;
                } else if (option.code === '14') {
                    //身份证（国徽面）
                    this.IDCardBack = true;
                } else if (option.code === '15') {
                    //单位介绍信
                    this.LetterOfIntroduction = true;
                } else if (option.code === '16') {
                    //委托代办书
                    this.LetterOfAttorney = true;
                }
                this.pictureList[option.code] = option;
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
            // 点击展示大图
            toggleShowImage(file_code, index) {
                console.log(this.pictureList, 'this.pictureList');
                this.list = this.pictureList.filter((item) => {
                    return item
                })
                this.photoVisible = true;
                this.chooseImage = this.map[index];
                this.imgSrc = '/archives/display/L/' + file_code;

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


            deletePicture(code) {
                /**
                 *  IDCardFront: false,            // 身份证（人像面）
                    IDCardBack: false,             // 身份证（国徽面）
                    RefundApplication: false,      // 退款申请单
                    LetterOfIntroduction: false,   // 单位介绍信
                    LetterOfAttorney: false,       //委托代办书
                 * **/
                if (code === '12') {
                    //退款申请单
                    this.RefundApplication = false;
                } else if (code === '13') {
                    //身份证（人像面）
                    this.IDCardFront = false;
                } else if (code === '14') {
                    //身份证（国徽面）
                    this.IDCardBack = false;
                } else if (code === '15') {
                    //单位介绍信
                    this.LetterOfIntroduction = false;
                } else if (code === '16') {
                    //委托代办书
                    this.LetterOfAttorney = false;
                }
                this.pictureList[code] = null;
            },
            photoftClick(val) {
                this.startLoading();
                let base64 = this.photoType === 'travel' ? 'travelImage' : (this.photoType === 'IdentityFront' ? 'IdentityFrontImage' : 'IdentityBackImage');
                this[base64] = val;
                const param = {
                    imgBase64: val,
                    photo_code: this.photo_code,
                };
                this.upload(param, (res) => {
                    if (this.photoType === 'travel') {
                        this.travelSuccess = true;
                    } else if (this.photoType === 'IdentityFront') {
                        this.IdentityFrontSuccess = true;
                    } else {
                        this.IdentityBackSuccess = true;
                    }
                    this.endLoading();
                }, (err) => {
                    this.endLoading();
                    if (this.photoType === 'travel') {
                        this.travelSuccess = false;
                        this.travelImage = '';
                    } else if (this.photoType === 'IdentityFront') {
                        this.IdentityFrontSuccess = false;
                        this.IdentityFrontImage = '';
                    } else {
                        this.IdentityBackSuccess = false;
                        this.IdentityBackImage = '';
                    }
                    this.$msgbox({
                        title: '上传失败',
                        message: '照片上传失败',
                        customClass: 'my_msgBox singelBtn',
                        // showCancelButton: true,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                done();
                            }
                        }
                    })
                })
                // this.$emit('onOperation', param);
                //this.iteminfo['changed']=true
            },

            takePhoto(type, code) {
                this.photoType = type;
                this.photo_code = code;
                this.dialog.visible = true;
            },
            clearPicture(type) {
                if (type === 'travel') {
                    this.travelImage = ''; // 行驶证base64
                    this.travelSuccess = false   // 行驶证上传状态
                } else if (type === 'IdentityFront') {
                    this.IdentityFrontImage = ''; // 行驶证base64
                    this.IdentityFrontSuccess = false   // 行驶证上传状态
                } else {
                    this.IdentityBackImage = ''; // 行驶证base64
                    this.IdentityBackSuccess = false   // 行驶证上传状态
                }
            },
            ftClick(cmd) {
              let _this = this;
                // 退款单打印
                if (cmd === cmds.refundPrinting) {
                    if (!this.isBookkeeping && this.need_refund === '1') {
                        // 打印退款单
                        this.refundPrinting();
                    } else {
                        // 打印变更单
                        this.changePrinting();
                    }
                } else if (cmd === cmds.noCard) {
                    //无卡销卡
                  if (_this.vehicleInfo.card_type === '2') {
                    this.$alert('当前ETC卡为储值卡，注销后该车辆不能重新申请为储值卡，如需继续使用储值卡请使用“补领换卡”功能办理！是否继续销卡？', '提示', {
                      dangerouslyUseHTMLString: true,
                      showClose:true,
                      showCancelButton:true,
                      confirmButtonText: '确定',
                      callback: action => {
                        if (action === 'confirm') {
                          this.noCard()
                        }
                      }
                    });
                  } else {
                    this.$alert('确认销卡？', '提示', {
                      dangerouslyUseHTMLString: true,
                      showClose:true,
                      showCancelButton:true,
                      confirmButtonText: '确定',
                      callback: action => {
                        if (action === 'confirm') {
                          this.noCard()
                        }
                      }
                    });
                  }
                } else if (cmd === cmds.readCard) {
                    //读卡
                    this.readCard()
                } else {
                    //有卡销卡
                  if (_this.vehicleInfo.card_type === '2') {
                    this.$alert('当前ETC卡为储值卡，注销后该车辆不能重新申请为储值卡，如需继续使用储值卡请使用“补领换卡”功能办理！是否继续销卡？', '提示', {
                      dangerouslyUseHTMLString: true,
                      showClose:true,
                      showCancelButton:true,
                      confirmButtonText: '确定',
                      callback: action => {
                        if (action === 'confirm') {
                          this.hasCard()
                        }
                      }
                    });
                  } else {
                    this.$alert('确认销卡？', '提示', {
                      dangerouslyUseHTMLString: true,
                      showClose:true,
                      showCancelButton:true,
                      confirmButtonText: '确定',
                      callback: action => {
                        if (action === 'confirm') {
                          this.hasCard()
                        }
                      }
                    });
                  }
                }

            },
            //卡内余额退款校验
            checkBank() {
                // 校验卡内余额退款数据
                /**
                 *  IDCardFront: false,            // 身份证（人像面）
                 IDCardBack: false,             // 身份证（国徽面）
                 RefundApplication: false,      // 退款申请单
                 LetterOfIntroduction: false,   // 单位介绍信
                 LetterOfAttorney: false,       //委托代办书
                 * **/
                let r = true;
                if (!this.IDCardFront) {
                    this.$msgbox({
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        message: '请上传身份证（人像面）',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                } else if (!this.IDCardBack) {
                    this.$msgbox({
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        message: '请上传身份证（国徽面）',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                } else if (!this.RefundApplication) {
                    this.$msgbox({
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        message: '请上传退款申请单',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                } else if((!this.reason)) {
                    this.$msgbox({
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        message: '请输入原因',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                } else if (this.reason.length>100) {
                    this.$msgbox({
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        message: '原因最大为100个字符',
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
            //卡内余额转存校验
            noCardCheck() {
                let r = true;
                // 卡内余额转存
                if (!this.reason) {
                    this.$msgbox({
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        message: '请输入原因',
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            done();
                        }
                    })
                    r = false;
                } else if (!this.chooseVehicleInfo.cpu_card_id) {
                    this.$msgbox({
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        message: '请选择转存车辆',
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

            //变更单打印
            changePrinting () {
                this.startLoading();
                let params = {
                    customer_id: this.customerInfo.customer_id,
                    customer_name: this.customerInfo.customer_name ,
                    link_mobile: this.customerInfo.link_mobile  ,
                    link_address: this.customerInfo.link_address   ,
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    orig_cpu_card_id: this.vehicleInfo.cpu_card_id,
                    obu_id: this.vehicleInfo.obu_id, //
                    new_cpu_card_id: this.cardInfo.cpu_card_id,
                    reason: this.reason,
                    operation: '6'
                }
                fetch({
                    url: api['specialPrint'].url || '',
                    method: 'post',
                    data: {
                        method: api['specialPrint'].method,
                        ...params
                    },
                    responseType: 'blob'
                }).then((response) => {
                    this.endLoading();
                    let binaryData = [];
                    binaryData.push(response);
                    // let url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}));
                    // this.fileUrl = "../../static/pdf/web/viewer.html?file=" + encodeURIComponent(url);

                    this.fileUrl = window.URL.createObjectURL(new Blob(binaryData, {type:"application/pdf"}));
                    document.getElementById('previewPdf').onload = () => {//等待iframe加载完成后再执行doPrint.每次iframe设置src之后都会重新执行这部分代码。
                        if(this.fileUrl){
                            this.endLoading();
                            document.getElementById('previewPdf').contentWindow.print();
                        }

                    };

                    // this.showPdf = true
                }).catch((err) => {
                    this.endLoading();
                    // this.showPdf = false
                    this.$msgbox({
                        message: '获取业务单失败:' + err.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
            // 退款单打印
            refundPrinting() {
                //退款单打印
                this.startLoading();
                let baseParams = {
                    customer_id: this.customerInfo.customer_id,
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    cpu_card_id: this.vehicleInfo.cpu_card_id,
                    reason: this.reason,
                    refund_serial: this.refund_serial,
                }
                let obj = {};
                if (!this.isBookkeeping) {
                    if (this.need_refund !== '0') {
                        // 退款销卡
                        obj= {
                            phone: this.bankCardInfo.phone,
                            bank_num: this.bankCardInfo.bank_num,
                            bank_account_name: this.bankCardInfo.bank_account_name,
                            bank_deposit_name: this.bankCardInfo.bank_deposit_name,
                            refund_type: this.bankCardInfo.refund_type,

                        }
                    }
                }
                fetch({
                    url: api['cardRefundPrint'].url || '',
                    method: 'post',
                    data: {
                        method: api['cardRefundPrint'].method,
                        ...baseParams,
                        ...obj
                    },
                    responseType: 'blob'
                }).then((response) => {
                    this.endLoading();
                    let binaryData = [];
                    binaryData.push(response);

                    this.fileUrl = window.URL.createObjectURL(new Blob(binaryData, {type:"application/pdf"}));
                    document.getElementById('previewPdf').onload = () => {//等待iframe加载完成后再执行doPrint.每次iframe设置src之后都会重新执行这部分代码。
                        if(this.fileUrl){
                            this.endLoading();
                            document.getElementById('previewPdf').contentWindow.print();
                        }

                    };

                }).catch((err) => {
                    this.endLoading();
                    this.$alert(err.message, '提示', {
                        dangerouslyUseHTMLString: true,
                        showClose:false,
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                })
            },

            //无卡销卡
            noCard() {
                let baseParmas = {
                    customer_id: this.customerInfo.customer_id,
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    cpu_card_id: this.vehicleInfo.cpu_card_id,
                    operation: '2',
                    issue_code: this.issue_code,
                    reason: this.reason,
                };
                let obj = {}
                if (!this.isBookkeeping) {
                    if (this.need_refund === '0') {
                        if (!this.noCardCheck()) {
                            return ;
                        }
                        // 转存销卡
                        obj = {
                            transfer_vehicle_code: this.chooseVehicleInfo.vehicle_code,
                            transfer_vehicle_color: this.chooseVehicleInfo.vehicle_color,
                        }
                        let parmas = {
                            ...baseParmas,
                            ...obj,
                        }
                        this.deleteCard(parmas);
                    } else {
                        this.$refs['ruleForm'].validate(valid => {
                            if (valid) {
                                if (!this.checkBank()) {
                                    return ;
                                }

                                // 退款销卡
                                obj= {
                                    phone: this.bankCardInfo.phone,
                                    bank_num: this.bankCardInfo.bank_num,
                                    bank_account_name: this.bankCardInfo.bank_account_name,
                                    bank_deposit_name: this.bankCardInfo.bank_deposit_name,
                                    refund_type: this.bankCardInfo.refund_type,
                                    refund_serial: this.refund_serial,
                                }
                                let parmas = {
                                    ...baseParmas,
                                    ...obj,
                                }
                                this.deleteCard(parmas);
                            } else {

                            }
                        })

                    }
                } else{
                    if (this.reason) {
                        this.deleteCard(baseParmas);
                    } else {
                        this.$msgbox({
                            title: '失败',
                            customClass: 'my_msgBox singelBtn',
                            message: '请输入原因',
                            showCancelButton: false,
                            confirmButtonText: '确定',
                            beforeClose: (action, instance, done) => {
                                done();
                            }
                        })
                    }
                }

            },
            //读卡
            readCard() {
                this.startLoading();
                //如果当前车辆存在CPU卡号，则传入
                let param = {}
                if (this.vehicleInfo.cpu_card_id !== undefined)
                    param['cpu_card_id'] = this.vehicleInfo.cpu_card_id
                //初始化卡信息
                this.cardInfo = {};
                WsApi.readCpuInfo(param, this.onMsg, this.onErr);
            },
            //有卡销卡
            hasCard() {
                if (!this.cardInfo.cpu_card_id) {
                    this.$msgbox({
                        title: '温馨提示',
                        message: '请先读卡~',
                        customClass: 'my_msgBox singelBtn',
                        // showCancelButton: true,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                done();
                            }
                        }
                    })
                    return;

                }
                let baseParmas = {
                    customer_id: this.customerInfo.customer_id,
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    cpu_card_id: this.vehicleInfo.cpu_card_id,
                    operation: '1',
                    card_balance: this.cardInfo.balance_money,
                    issue_code: this.issue_code,
                    reason: this.reason,
                }
                let obj = {}
                if (!this.isBookkeeping) {
                    if (this.need_refund === '0') {
                        // 转存销卡
                        if (!this.noCardCheck()) {
                            return
                        }
                        obj = {
                            transfer_vehicle_code: this.chooseVehicleInfo.vehicle_code,
                            transfer_vehicle_color: this.chooseVehicleInfo.vehicle_color,
                        }
                        let parmas = {
                            ...baseParmas,
                            ...obj,
                        }
                        this.csDeleteCard(parmas);
                    } else {
                        // 退款销卡
                        this.$refs['ruleForm'].validate(valid => {
                            if (valid) {
                                if (!this.checkBank()) {
                                    return
                                }
                                obj= {
                                    phone: this.bankCardInfo.phone,
                                    bank_num: this.bankCardInfo.bank_num,
                                    bank_account_name: this.bankCardInfo.bank_account_name,
                                    bank_deposit_name: this.bankCardInfo.bank_deposit_name,
                                    refund_type: this.bankCardInfo.refund_type,
                                    refund_serial: this.refund_serial,
                                }
                                let parmas = {
                                    ...baseParmas,
                                    ...obj,
                                }
                                this.csDeleteCard(parmas);

                            } else {

                            }
                        })
                    }
                } else{
                    if (this.reason) {
                        this.csDeleteCard(baseParmas);
                    } else {
                        this.$msgbox({
                            title: '失败',
                            customClass: 'my_msgBox singelBtn',
                            message: '请输入原因',
                            showCancelButton: false,
                            confirmButtonText: '确定',
                            beforeClose: (action, instance, done) => {
                                done();
                            }
                        })
                    }
                }

            },
            csDeleteCard(parmas) {
              // 有卡销卡调用cs端的销卡流程
                this.startLoading();
                WsApi.cpuCancel(parmas, this.onMsg, this.onErr);
            },
            deleteCard (parmas) {
                this.startLoading();
                // 无卡销卡调用服务器端的销卡核验
                fetch({
                    url: api['cancelValid'].url ,
                    method: 'post',
                    data: {
                        method:api['cancelValid'].method,
                        ...parmas
                    }
                }).then((res)=>{
                    let _this = this;
                    // 注销完成，需要把vehicleInfo里的cpu_card_id字段置空
                    this.setVehicleInfo({...this.vehicleInfo, cpu_card_id: ''})
                    this.$msgbox({
                        title: '销卡成功',
                        message: '销卡成功',
                        customClass: 'my_msgBox singelBtn',
                        // showCancelButton: true,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                _this.$emit('closeMainDiadog');
                                done();
                            }
                        }
                    })
                    this.endLoading();
                }).catch((err)=>{
                    this.popBox(err.message)
                    this.endLoading();
                })
            },
            onCloseDialog() {
                this.dialog.visible = false;
            },
            // //上传图片
            upload(obj, cb, errCb) {
                let param = new FormData(); //创建form对象
                let biz_content = {
                    file_name: "file",
                    customer_id: this.customerInfo.customer_id || '',
                    photo_code: obj.photo_code,
                }
                param.append('method', api['upImg'].method);
                param.append('biz_content', JSON.stringify(biz_content))

                param.append('ticket', getToken());
                let blob = this.dataUrlToBlob(obj.imgBase64);

                param.append('file', blob, 'img.jpg');


                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };  //添加请求头
                axios.post('/issue/do', param, config)
                    .then(response => {
                        cb && cb(response.data)
                    }).catch((err) => {
                    errCb && errCb(err)
                })
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
            //websocket消息处理回调
            onMsg: function (msg) {
                let _this = this;
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    switch (rspData.method) {
                        //读到卡信息的处理
                        case WsConsts.methods.readCpuInfo:
                            this.cardInfo = {...bizContent};
                            console.log(bizContent, 'bizContent');
                            this.endLoading();
                            break;
                        case WsConsts.methods.cpuCancel:
                            // 注销完成，需要把vehicleInfo里的cpu_card_id字段置空
                            this.setVehicleInfo({...this.vehicleInfo, cpu_card_id: ''})
                            this.$msgbox({
                                title: '销卡成功',
                                message: '销卡成功',
                                customClass: 'my_msgBox singelBtn',
                                // showCancelButton: true,
                                confirmButtonText: '确定',
                                beforeClose: (action, instance, done) => {
                                    if (action === 'confirm') {
                                        _this.$emit('closeMainDiadog');
                                        done();
                                    }
                                }
                            })
                            this.endLoading();
                            break;
                        default:
                            this.endLoading();
                            break;
                    }
                } else {
                    this.endLoading();
                    if (rspData.method === WsConsts.methods.cpuCancel) {
                        _this.popBox(rspData.return_msg, 'hasCard')
                    } else {
                        this.$alert(rspData.return_msg, '提示', {
                            dangerouslyUseHTMLString: true,
                            showClose:false,
                            confirmButtonText: '确定',
                            callback: action => {}
                        });
                    }
                }
            },
            //websocket异常处理回调
            onErr: function (err) {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: "请求异常：" + err.message,
                });
                //隐藏进度条
                this.endLoading();
                console.log("请求异常：" + err.message);
            },
            popBox(msg, type) {
                let  _this = this;
                if (type) {
                    //
                    // this.$alert(msg, '提示', {
                    //     dangerouslyUseHTMLString: true,
                    //     showClose:false,
                    //     confirmButtonText: '无卡销卡',
                    //     callback: action => {
                    //         if (action === 'confirm') {
                    //             _this.noCard()
                    //         }
                    //     }
                    // });

                    this.$msgbox({
                        title: '销卡失败',
                        message: msg,
                        customClass: 'my_msgBox singelBtn',
                        showCancelButton: false,
                        confirmButtonText: '无卡销卡',
                        callback: (action, instance) => {
                            if (action === 'confirm') {
                                _this.noCard()
                            }
                        }
                    })
                } else {
                    // this.$alert(msg, '提示', {
                    //     dangerouslyUseHTMLString: true,
                    //     showClose:false,
                    //     confirmButtonText: '有卡销卡',
                    //     callback: action => {
                    //         if (action === 'confirm') {
                    //             _this.hasCard()
                    //         }
                    //     }
                    // });

                    this.$msgbox({
                        title: '销卡失败',
                        message: msg,
                        customClass: 'my_msgBox singelBtn',
                        showCancelButton: false,
                        confirmButtonText: '有卡销卡',
                        callback: (action, instance) => {
                            if (action === 'confirm') {
                                _this.hasCard()
                            }
                        }
                    })
                }

            }
        },
        filters: {
            getCustomerTypeFilter(val) {
                return getCustomerType(val);;
            },
            getVehicleTypeFilter(val) {
                return getVehicleType(val);;
            },
            getVehicleUserTypeFilter(val) {
                return getVehicleUserType(val);
            },
            getCardTypeFilter(val) {
                return getCardType(val);
            },
            getObuIssueFilter(val) {
                return getObuIssue(val);
            },
            getCpuStatusFilter(val) {
                return getCpuStatus(val);
            },
            getCardColorFilter(val) {
                return getCardColor(val);
            },
            getVehicleColorFilter(val) {
                return getVehicleColor(val);
            },
            vehicleCityFilter(val) {
                let city =  cities.filter((item) => {
                    if (item.city_code === val) {
                        return item
                    }
                });
                return city[0].city_name
            },

        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../../../styles/mixin";
    @import "../../../styles/common";

    .content {
        /*display: flex;*/
        /*flex-direction: column;*/
        height: $dialog-height;
        /*justify-content: space-between;*/
        .pdf-view {
            height: $dialog-height;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .my_list_row {
            height: $dialog-height;
            overflow-y: auto;

        }
        .electronic_archives{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            flex-wrap: wrap;
        }
        .reserve-search {
            background: $second-color;
            color: #ffffff
        }
        .reason_content{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .reason_result{
                min-width: 50px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                &::before{
                    content: '*';
                    color: #F56C6C;
                    margin-right: 4px;
                }
            }
        }
    }

</style>
