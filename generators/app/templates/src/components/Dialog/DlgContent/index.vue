<template>
  <div class="dialog-content">
    <newUser
    :idx="idx"
    v-if="idx===0"
    @ftClick="ftClick">
    </newUser>
    <etc-customerarchives 
    v-if="idx===1" 
    :idx="idx"
    :key="idx"
    @ftClick="ftClick">
    </etc-customerarchives>

    <etc-vehicleinfo 
    v-if="idx===2" 
    :idx="idx"
    :key="idx"
    @ftClick="ftClick">
    </etc-vehicleinfo>

    <etc-vehiclearchives 
      v-if="idx===3" 
      :idx="idx"
      :key="idx"
      @ftClick="ftClick">
    </etc-vehiclearchives>

    <etc-cardissue 
    v-if="idx===4" 
    :idx="idx"
    :key="idx"
    @ftClick="ftClick">
    </etc-cardissue>

    <etc-labelissue 
      v-if="idx===5" 
      :idx="idx"
      :key="idx"
      @ftClick="ftClick">
    </etc-labelissue>

    <etc-customeracceptance 
      v-if="idx===6" 
      :idx="idx"
      :key="idx"
      @ftClick="ftClick">
    </etc-customeracceptance>
  </div>
</template>

<script>

import etcCustomerarchives from '@/views/customerBusiness/archives';
import etcVehicleinfo from '@/views/vehicleBusiness/info';
import etcVehiclearchives from '@/views/vehicleBusiness/archives';
import etcCardissue from '@/views/cardBusiness/issue';
import etcLabelissue from '@/views/labelBusiness/issue';
import etcCustomeracceptance from '@/views/customerBusiness/acceptance';

import newUser from "@/views/customerBusiness/newUser";



export default {
  name: "DlgContent",
  props: {
    idx: {//当前步骤
      type: Number,
      required: true
    },
    model:{//功能模块 //功能模块 ['newuser'-新开户 ‘userbusiness’-用户业务 'vehicleinfo'-车辆信息 ]
        type:String,
        default:''
    }
  },
  data() {
    return {
      around:''//当前前进或后退
    };
  },
  components: {
      newUser,
    etcCardissue,
    etcVehicleinfo,
    etcVehiclearchives,
    etcLabelissue,
    etcCustomeracceptance,
    etcCustomerarchives
  },
  methods: {
    ftClick: function(cmd) {
      //事件向上层传递（返回、下一步等）
      this.$emit("ftClick", cmd);
      this.around = cmd
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-content {
  background-color: #fff;
}
</style>
