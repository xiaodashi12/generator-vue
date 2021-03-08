<template>
  <div class="steps step">
    <el-steps :active="idx" :align-center="true">
        <el-step 
        v-for="(item,index) in stepTitles" 
        :key="index" 
        :title="item.title">
        </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  props:{
    idx:{
      type:Number//数字
    },
    stepTitles:{
        type:Array//数组
    }
  },
  mounted() {
    
  },
  methods: {}
};
</script>

<style  lang="scss">
  .step{
      padding: 0 20px;
      margin: 10px 0px 20px 0px;
      .el-step__title{
          text-indent: 3px;
      }
  }
  .el-step__head{display:none;}
  .el-steps .el-step {
    display: inline-block !important;
    position: relative !important;
    margin-right: 5px !important;
    line-height: 18px !important;
    list-style: none !important;
    padding: 0px !important;
    background: #efefef ;
    zoom: 1 !important;
    cursor: pointer;
    .el-step__title {
      line-height: 32px !important;
      width:100%;
      text-align:center;
      font-size:14px;
      &.is-process {
        background: #01c1b2;
        color: #ffffff;
        background-position:  left top;
        &:before{
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          height: 0 !important;
          width: 0 !important;
          border-bottom: 16px inset transparent !important;
          border-left: 16px solid #fff !important;
          border-top: 16px inset transparent !important;
          content: "" !important;
        }
        &:after{
          position: absolute !important;
          right: -16px !important;
          top: 0 !important;
          height: 0 !important;
          width: 0 !important;
          border-bottom: 16px inset transparent !important;
          border-left: 16px solid #01c1b2 !important;
          border-top: 16px inset transparent !important;
          content: "" !important;
          z-index: 2 !important;
        }
      }
      &.is-finish {
        background: #d6f4ed;
        color: #01c1b2;
        &:before{
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          height: 0 !important;
          width: 0 !important;
          border-bottom: 16px inset transparent !important;
          border-left: 16px solid #fff !important;
          border-top: 16px inset transparent !important;
          content: "" !important;
        }
        &:after{
          position: absolute !important;
          right: -16px !important;
          top: 0 !important;
          height: 0 !important;
          width: 0 !important;
          border-bottom: 16px inset transparent !important;
          border-left: 16px solid #d6f4ed !important;
          border-top: 16px inset transparent !important;
          content: "" !important;
          z-index: 2 !important;
        }
      }
      &.is-wait {
        &:before{
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          height: 0 !important;
          width: 0 !important;
          border-bottom: 16px inset transparent !important;
          border-left: 16px solid #fff !important;
          border-top: 16px inset transparent !important;
          content: "" !important;
        }
        &:after{
          position: absolute !important;
          right: -16px !important;
          top: 0 !important;
          height: 0 !important;
          width: 0 !important;
          border-bottom: 16px inset transparent !important;
          border-left: 16px solid #efefef !important;
          border-top: 16px inset transparent !important;
          content: "" !important;
          z-index: 2 !important;
        }
      }
    }
  }
  .el-steps .el-step:first-child .el-step__title:before{
    border: 0  !important;
  }
  .el-steps .el-step:last-child .el-step__title:after{
    border: 0  !important;
  }
  .el-steps .el-step:last-child{
      margin-right: 0px !important;
  }
  .el-step__arrow{
    display: none !important;
  }
  .el-step.is-simple:not(:last-of-type) .el-step__title{
    max-width: 100% !important;
  }
  .el-steps--simple{
    padding: 13px 2% !important;
  }
  .el-step__description{
      margin-top: 0px;
  }
</style>
