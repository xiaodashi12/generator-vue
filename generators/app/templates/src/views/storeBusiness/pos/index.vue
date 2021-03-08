<template>
    <div class="posRecharge">
        <vehicleTab
        :vehicleTabList="vehicleTabList"
        @onChangeActive="handleOnChangeActive">
            <div slot="child">
               <user-recharge 
               ref="userRecharge" 
               v-if="key == 0"
               :rechargeInfo="rechargeInfo"></user-recharge>
               <correct ref="correct" v-if="key == 1"></correct>
            </div>
        </vehicleTab>
    </div>
</template>
<script>

import vehicleTab from '@/components/vehicleTab'
import api from '@/api'
import fetch from '@/utils/fetch'
import userRecharge from './userRecharge';
import correct from './correct';

export default {
    components:{vehicleTab,userRecharge,correct},
    data () {
        return {
            key:0,
            vehicleTabList:[{
                key: 0,
                value:'用户账户充值'
            },{
                key: 1,
                value:'充值冲正'
            }],
            rechargeInfo:{}
        }
    },
    created () {
        this.getInit();
        
    },
    methods:{
        getInit(){
            let params = {
                customer_id:this.customerInfo.customer_id
            }
            this._customerAccountBalanc(params,(res) => {
                this.customerMoney = res;
            },(error) => {
                this.$alert(error.message, '提示', {
                    dangerouslyUseHTMLString: true,
                    showClose:false,
                    confirmButtonText: '确定',
                    callback: action => {}
                    });
                })
        },
        _customerAccountBalanc(params){
            this.startLoading();

           return  new Promise((resolve, reject) => {
                fetch({
                    url: api['customerAccountBalanc'].url || '',
                    method: 'post',
                    data: {
                        method:api['customerAccountBalanc'].method,
                        ...params
                    }
                }).then((response)=> {
                    
                    resolve(response);
                }).catch((err)=>{
                    
                    this.endLoading();
                    reject(err)
                })
            })
        },
        handleOnChangeActive(key){
            this.key = key
        },
        handleOnFtClick (cmd) {
            
            
            
            

            if(cmd == 'correct'){//确认冲正

            }
        }
    }
}
</script>


