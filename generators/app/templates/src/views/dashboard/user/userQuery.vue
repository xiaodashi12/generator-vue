<template>
    <div class="userQuery query">
        <div class="queryItem" :class="!disableds.userInfo ? 'ck' : 'unCK'" >
            <el-input
            size="small"
            name="userInfo"
            v-model="formObj.userInfo"
            placeholder="用户名称、用户编号、手机号"
            maxlength="100"
            @focus="handleOnFocus"
            @keyup.enter.native="handleOnSearch">
            <i slot="suffix" class="el-icon-circle-close-outline" @click="handleOnClear('userInfo')"></i>
            </el-input>
        </div>
        <div class="item queryItem" :class="!disableds.item ? 'ck' : 'unCK'">
            <el-select
                    size="small"
                    name="item"
                    v-model="formObj.vehicle_color"
                    placeholder="车牌颜色"
                    @focus="handleOnFocus">
                <el-option label="蓝" value="0"></el-option>
                <el-option label="黄" value="1"></el-option>
                <el-option label="黑" value="2"></el-option>
                <el-option label="白" value="3"></el-option>
                <el-option label="渐变绿" value="4"></el-option>
                <el-option label="黄绿双拼" value="5"></el-option>
                <el-option label="蓝白渐变" value="6"></el-option>
            </el-select>
            <el-input
            size="small"
            name="item"
            class="code"
            v-model="formObj.vehicle_code"
            placeholder="车牌号码"
            maxlength="12"
            @keyup.enter.native="handleOnSearch"
            @focus="handleOnFocus">
                <i slot="suffix" class="el-icon-circle-close-outline" @click="handleOnClear('item')"></i>
            </el-input>
            <div class="tips">可查车牌全国办理状态</div>
        </div>

        <div class="item">
            <div class="lf">
                <div class="queryItem" :class="!disableds.cpu_card_id ? 'ck' : 'unCK'">
                    <el-input
                    size="small"
                    name="cpu_card_id"
                    v-model="formObj.cpu_card_id"
                    placeholder="CUP卡号"
                    maxlength="16"
                    @focus="handleOnFocus"
                    @keyup.enter.native="handleOnSearch">
                        <i slot="suffix" class="el-icon-circle-close-outline" @click="handleOnClear('cpu_card_id')"></i>
                    </el-input>
                </div>
                <div class="queryItem" :class="!disableds.certificates_code ? 'ck' : 'unCK'">
                    <el-input
                    size="small"
                    name="certificates_code"
                    v-model="formObj.certificates_code"
                    placeholder="证件号"
                    maxlength="18"
                    @keyup.enter.native="handleOnSearch"
                    @focus="handleOnFocus">
                        <i slot="suffix" class="el-icon-circle-close-outline" @click="handleOnClear('certificates_code')"></i>
                    </el-input>
                </div>
                
            </div>
            <div class="btn">
                <el-button :disabled="loading" class="search" @click="handleOnSearch">查询</el-button>
                <el-button class="reading" @click="handleOnReadCard">读卡</el-button>
            </div>
        </div>

    </div>
</template>
<script>
    import api from '@/api';
    import wsApi from '@/api/wsApi'
    import fetch from '@/utils/fetch';
    import _minx from './minx.js'
    import { mapActions,mapGetters } from 'vuex'

    export default {
        name:'EtcUserQuery',
        mixins:[ _minx ],
        props:{
        },
        data () {
            return {
                loading:false,
                disableds:{
                    userInfo:true,
                    item:true,
                    cpu_card_id:true,
                    certificates_code:true
                },
                formObj:{
                    userInfo:'',
                    vehicle_color:'0',
                    vehicle_code:'',
                    cpu_card_id:'',
                    certificates_code:''
                }
            }
        },
        computed:{
            ...mapGetters([
                'vehicleInfo',
                'customerInfo',
                'appointInfo'
            ])
        },
        watch:{
            'formObj.vehicle_code' (newval) {
                this.formObj.vehicle_code = newval.toUpperCase();
            }
        },
        methods:{
            ...mapActions([
                'setCustomerInfo',
                'setVehicleInfo',
                'setAppointInfo'
            ]),
            findDisableds () {
                let _arr =  Object.keys(this.disableds);
                for(let item in this.disableds){
                    if(!this.disableds[item]){
                        return item;
                        break;
                    }
                }
                return '';
            },
            getUserInfo(userInfo){
                return new Promise((resolve, reject) => {
                    fetch({
                        url: api['getUserInfo'].url || '',
                        method: 'post',
                        data: {
                            method:api['getUserInfo'].method,
                            ...userInfo
                        }
                    }).then(res => {
                        resolve(res)
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            handleOnFocus(event){

                let name  = '';
                if(event instanceof Object){
                    name = event.target.name
                }
                if(typeof event == 'string'){
                    name = event;
                }
                Object.keys(this.disableds).forEach(el => {
                    if(el != name){
                        this.disableds[el] = true;
                        this.formObj[el] = '';
                        if(el == 'item'){
                            this.formObj.vehicle_color='0';
                            this.formObj.vehicle_code = ''
                        }
                    }else{
                        this.disableds[el] = false;
                    }
                })
            },
            handleOnClear(name){
                this.formObj[name] = '';
                if(name == 'item'){
                    this.formObj.vehicle_color='';
                    this.formObj.vehicle_code = ''
                }
            },
            handleOnBlur(){
                Object.keys(this.disableds).forEach(el => {
                    this.disableds[el] = false
                })
            },
            _search(name){
                
                if(!name){
                    this.loading = false;
                     return '';
                }
                let obj = {
                    'item': () => {//车辆颜色 车牌号码
                        let params = {
                            vehicle_color:this.formObj.vehicle_color,
                            vehicle_code:this.formObj.vehicle_code
                        }

                        if(params.vehicle_color || params.vehicle_code){
                            this.getCarinfo(params).then(carInfo => {
                                this.getUserInfo({customer_id:carInfo[0].customer_id}).then(res => {
                                    this.loading = false;
                                    this.$emit('onSearchVehicle',{type:'1',infos:res,carInfo})
                                },(error) => {
                                    this.$alert(error.message, '提示', {
                                        dangerouslyUseHTMLString: true,
                                        showClose:false,
                                        confirmButtonText: '确定',
                                        callback: action => {}
                                    });
                                    this.loading = false;
                                    this.$emit('onSearchVehicle',{type:'1',infos:[],carInfo})
                                })

                            },(error) => {
                                this.$alert(error.message, '提示', {
                                    dangerouslyUseHTMLString: true,
                                    showClose:false,
                                    confirmButtonText: '确定',
                                    callback: action => {}
                                });
                                this.loading = false;
                                this.$emit('onSearchVehicle',{type:'1',infos:[],carInfo:[]})
                            })
                        }else{

                            this.loading = false;
                            this.$emit('onSearchVehicle',{type:'1',res:[],carInfo:[]})
                        }


                    },
                    'cpu_card_id':() => {//车辆CUP卡号
                    
                        let params = {
                            cpu_card_id:this.formObj.cpu_card_id
                        }
                        if(params.cpu_card_id){
                            this.getCarinfo(params).then(carInfo => {
                                this.getUserInfo({customer_id:carInfo[0].customer_id}).then(userInfos => {
                                    
                                    this.loading = false;
                                    this.$emit('onSearchVehicle',{type:'1',infos:userInfos,carInfo})
                                },(error) => {

                                    this.$alert(error.message, '提示', {
                                        dangerouslyUseHTMLString: true,
                                        showClose:false,
                                        confirmButtonText: '确定',
                                        callback: action => {}
                                    });
                                    this.loading = false;
                                    this.$emit('onSearchVehicle',{type:'1',infos:[],carInfo})
                                })

                            },(error) => {
                                this.$alert(error.message, '提示', {
                                    dangerouslyUseHTMLString: true,
                                    showClose:false,
                                    confirmButtonText: '确定',
                                    callback: action => {}
                                });
                                this.loading = false;
                                this.$emit('onSearchVehicle',{type:'1',res:[],carInfo:[]})

                            })
                        }else{
                            this.loading = false;
                            this.$emit('onSearchVehicle',{type:'1',res:[],carInfo:[]})
                        }

                    },
                    'userInfo':() => {//用户名称,用户编号,手机号
                        
                        let params = {};
                        let reg = /^[0-9]\d*$/;//包括零的正整数

                        let data = Math.abs(this.formObj[name]);
                        if(reg.test(this.formObj[name]) && data.toString().length <= 11){
                            
                            if(data.toString().length <= 8){//编号
                                params.customer_id = data;
                            }else if(data.toString().length == 11){//手机号
                                params.phone = data
                            }
                        }else{
                            params.customer_name = this.formObj[name]
                        }

                        let arr = Object.keys(params);
                        if(params[arr[0]]){
                            this.getUserInfo(params).then(res => {
                                this.loading = false;
                                this.$emit('onSearch',{type:'1',res})
                            },(error) => {
                                this.$alert(error.message, '提示', {
                                    dangerouslyUseHTMLString: true,
                                    showClose:false,
                                    confirmButtonText: '确定',
                                    callback: action => {}
                                });

                                this.loading = false;
                                this.$emit('onSearch',{type:'1',res:[]})
                            })
                        }else{
                            this.loading = false;
                            this.$emit('onSearch',{type:'1',res:[]})
                        }

                    },
                    'certificates_code': () => {//证件号
                        let params = {
                            certificates_code:this.formObj[name]
                        }
                        if(params.certificates_code){
                            this.getUserInfo(params).then(res => {
                                this.loading = false;
                                this.$emit('onSearch',{type:'1',res})
                            },(error) => {
                                this.$alert(error.message, '提示', {
                                    dangerouslyUseHTMLString: true,
                                    showClose:false,
                                    confirmButtonText: '确定',
                                    callback: action => {}
                                });

                                this.loading = false;
                                this.$emit('onSearch',{type:'1',res:[]})
                            })
                        }else{
                            this.loading = false;
                            this.$emit('onSearch',{type:'1',res:[]})
                        }

                    }
                }

                return obj[name]
            },

            handleOnSearch () {
                this.loading = true;
                if(Object.keys(this.appointInfo).length > 0){
                    this.setAppointInfo({});
                }//查询操作将预约信息清空
                if(Object.keys(this.customerInfo).length > 0){
                    this.setCustomerInfo({});
                }
                if(Object.keys(this.vehicleInfo).length > 0){
                    this.setVehicleInfo({});
                }
                let name = this.findDisableds();
                let func = this._search(name);
                if(func instanceof Function){
                    func();
                }
            },

            handleOnReadCard(){

                if(Object.keys(this.customerInfo).length > 0){
                    this.setCustomerInfo({});
                }
                if(Object.keys(this.vehicleInfo).length > 0){
                    this.setVehicleInfo({})
                }
                
                
                wsApi.readCardId({},this.onSuccess,this.onError)
            },
            onSuccess (res) {
                let rspData = JSON.parse(res.data);
                if (rspData.return_code === '0'){

                    let bizContent = JSON.parse(rspData.biz_content);
                    this.formObj.cpu_card_id = bizContent.cpu_card_id;

                    this.handleOnFocus('cpu_card_id');
                    let func = this._search('cpu_card_id');

                    if(func instanceof Function){
                        func();
                    }

                }else{

                    if( this.disableds.cpu_card_id){
                        this.disableds.cpu_card_id = true;
                    }
                    if(this.formObj.cpu_card_id){
                        this.formObj.cpu_card_id = "";
                    }

                    this.handleOnBlur();
                    this.handleOnClear();
                    
                    this.$alert(rspData.return_msg, '提示', {
                        dangerouslyUseHTMLString: true,
                        showClose:false,
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                }
            },
            onError (error) {
                this.$alert(error.message, '提示', {
                    dangerouslyUseHTMLString: true,
                    showClose:false,
                    confirmButtonText: '确定',
                    callback: action => {}
                });
            }
        }
    }
</script>
<style type="text/scss"  lang="scss">
    @import "../../../styles/mixin";
    .userQuery{
        .queryItem{
            margin-bottom:10px;
           .el-input {
               width: 94%;
               padding-left:20px;
               margin-bottom: 0;
               .el-input__suffix{
                    top:6px;
                    cursor: pointer;
                }
                &.code{
                   padding-left:15px;
               }
           }
           .el-select{
               padding-left: 0;
               .el-input__suffix{
                    top:0px;
                    cursor: pointer;
                }
           }
           
        }
        .ck{
            background:url('../../../assets/checked.png') no-repeat left center;
        }
        .unCK{
            background:url('../../../assets/unchecked.png') no-repeat left center;
        }
        

        .item{
            .tips{
                padding:0 3px;
                font-size: 11px;
                color:#C4C6CF;
                min-width: 68px;
            }
            .btn{
                display: flex;
                flex-direction: row;
                height: 55px;
                position: relative;
                top:8px;

                .el-button{
                    font-size:18px;
                    width:60px;
                    padding:0;
                    &.search{
                        background-color: $three-color;
                    }
                    &.reading{
                        background-color: $second-color;
                    }
                }



            }
            .lf{
                margin-right:20px;
                width: 60%;
                div:last-child{
                    margin-bottom:0px;
                }
            }
        }
    }
</style>
