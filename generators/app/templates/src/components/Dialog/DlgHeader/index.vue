<template>
  <div class="dlg-header">
    <p>
      <slot></slot>
    </p>
    <span>x</span>
  </div>
</template>
<script>
export default {};
</script>

<style type ="scss" scoped>
.dlg-header {
  position: relative;
  border-radius: 6px 6px 0px 0px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  background: #3c4150 100%;
}
.dlg-header p {
  letter-spacing:2px;
    font-family:PingFangSC-Regular;
    text-align: left;
    padding: 0px;
    color: #01C1B2;
    margin:0px 0px 0px 20px;
  }
.dlg-header span {
    display: block;
    font-size: 18px;
    position: absolute;
    right: 0px;
    top:0px;
    height: 40px;
    width: 40px;
    color:#e7e7e7;    
    cursor: pointer;
  }
</style>

