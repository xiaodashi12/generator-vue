<template>
        <div class="archives-container">
          <div class="archives-content" >
            <photograph @toggleShowImage="toggleShowImage"  :iteminfo="pictureList[0]" photoCode="1" class="item" :iteminfoKey="0" @onOperation="handleOperation">身份证(人像面)</photograph>
            <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[1]" photoCode="11" class="item" :iteminfoKey="1" @onOperation="handleOperation">身份证(国徽面)</photograph>
            <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[2]" photoCode="2" class="item" :iteminfoKey="2" @onOperation="handleOperation">机构证件</photograph>
            <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[3]" photoCode="4" class="item" :iteminfoKey="3" @onOperation="handleOperation">申请单</photograph>
            <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[4]" photoCode="7" class="item" :iteminfoKey="4" @onOperation="handleOperation">用户变更单</photograph>
            <template v-for="(item,index) in  UOtherlength" >
               <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[5+index]" class="item" photoCode="9" :key="item" :iteminfoKey="5+index" @onOperation="handleOperation">用户其他</photograph>
            </template>
      
          </div>
            <PhotoComponent @arrowClick="arrowClick" @closeImageShow="closeImageShow"  :photoVisible="photoVisible" :imgSrc="imgSrc"></PhotoComponent>
          <dlg-footer :btninfos="ftBtnArrays.customerArch" @ftClick="ftClick"></dlg-footer>
        </div>
      </template>
      
      <script>
      import api from '@/api';
      import axios from 'axios'
      import { mapGetters, mapActions } from 'vuex';
      import fetch from '@/utils/fetch';
      import { getToken } from '@/utils/auth';
      import {MessageBox} from 'element-ui';
      import DlgFooter from "@/components/Dialog/DlgFooter";
      import photograph from "@/components/photograph";
      import PhotoComponent from "@/components/PhotoComponent";
      import { cmds, ftBtns } from "@/utils/ftBtnConsts";

      export default {
        components: {
          DlgFooter,
            PhotoComponent,
          photograph
        },
        props: {
            idx:{//当前步骤条
                type:Number,
                default:''
            }
        },
        data() {
          return {
            ftBtnArrays:ftBtns,
            UOtherlength:1,
              list: [],
              imgSrc:'',
              chooseImage: 0,
              photoVisible: false,
            pictureList:[
              {photo_code:'1'},//身份证正面
              {photo_code:'11'},//身份证背面
              {photo_code:'2'},//机构证件
              {photo_code:'4'},//申请单
              {photo_code:'7'},//用户变更单
              {photo_code:'9'},//用户其他
              ],
              upOperation:false //上传操作
          };
        },
        computed: {
          ...mapGetters([  
              'customerInfo',
              'modelType'
          ])
        },
        created () {
          this.getCustomerFiles()
        },
        mounted () {
          this.init();
        },
        methods: {
          ...mapActions([
            'setCancelVehicle',
          ]),
          //底部按钮点击事件处理
          ftClick: function(cmd) {
            
            switch (cmd) {
                 //上传
              case cmds.uplCustArch:
              this.uplCustArch();
                break;
              case cmds.next:
                    if ( this.modelType !== 'newuser' &&this.upOperation) {
                        // MessageBox.confirm('是否放弃编辑档案？', '警告', {
                        //     confirmButtonText: '确定',
                        //     cancelButtonText: '取消',
                        //     type: 'warning'
                        // }).then(() => {
                            this.$emit("ftClick", cmds.next);
                        // })
                    } else if( this.modelType == 'newuser'&&this.upOperation==false){
                        this.$alert('请先上传用户档案！', '警告', {
                            confirmButtonText: '确定',
                            type: 'warning',
                            callback: action => {
                            }
                        });
                    }else{
                       this.$emit("ftClick", cmd);
                    }

                    break;
              //其他（上一步、下一步）
              default:
                //TODO 是否可以上一步下一步
                //如果可以，才调用上层事件处理
                this.setCancelVehicle(true)
                this.$emit("ftClick", cmd);
                break;
            }
          },
          init(){
            this.UOtherlength=1;
            this.pictureList=[
              {photo_code:'1'},//身份证正面
              {photo_code:'11'},//身份证背面
              {photo_code:'2'},//机构证件
              {photo_code:'4'},//申请单
              {photo_code:'7'},//用户变更单
              {photo_code:'9'},//用户其他
              ];
            this.getCustomerFiles();
          },
          uplCustArch(){
            let r = true;
            for (let k in this.pictureList) {
                //changed为true的时候，则有未上传的，反之，图片已经全部上传
                if (this.pictureList[k].changed) {
                    r = false;
                }
            }
            if (r) {
                this.$msgbox({
                    title: '温馨提示',
                    message: '无可上传图片',
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
            }

              this.pictureList.forEach((item, index)=>{
                  if(item.imgBase64&&item.photo_code){
                      this.upload(item, index);
                  }
                  if(item.photo_code&&item.file_serial&&item.delete){
                      this.delPic(item, index);
                  }
              })
            // for(let item of this.pictureList){
            //   if(item.imgBase64&&item.photo_code){
            //     this.upload(item);
            //   }
            //   if(item.photo_code&&item.file_serial&&item.delete){
            //     this.delPic(item);
            //   }
            // }
            this.upOperation==true;
          },
          handleOperation(param){
            console.log('操作图片param',param);
            let type = param.type;
            let imgInfo = param.imgBase64;

            let index = param.index;
            let photoCode = param.photoCode;
            
            let obj = this.pictureList[index];
            let userPCArr = ['1','11','2','4','7','9'];
            if(userPCArr.includes(photoCode)){
                //删除图片
              if(type==='delete'){
                  console.log(this.pictureList[0], 'pictureList');
                if(photoCode=='9'&& index>5){
                  this.UOtherlength =this.UOtherlength-1;
                }
                let param = {
                  photo_code:photoCode,
                  file_serial:obj.file_serial,
                  delete:true
                };
                this.$set(this.pictureList, index, param);
                  this.delPic(param);
              }else if(type==='setImg'){ //
                let param  = {
                  ...obj,
                  imgBase64:imgInfo,
                    changed:true
                };
                this.$set(this.pictureList, index, param);
                if(photoCode === '9'){
                  this.pictureList.push({photo_code:'9'});
                  this.UOtherlength =this.UOtherlength+1;
                }
              }
            }
          
            console.log(' this.pictureList', this.pictureList)
      
          },
            // //上传图片
          upload(obj, index){
              let _this = this;
              let param = new FormData(); //创建form对象
              let biz_content = {
                  file_name:"file",
                  customer_id:this.customerInfo.customer_id||'',
                  photo_code: obj.photo_code,
              }
              param.append('method',api['upImg'].method);
              param.append('biz_content',JSON.stringify(biz_content))
      
              param.append('ticket',getToken());
              let blob = this.dataUrlToBlob(obj.imgBase64);
      
              param.append('file', blob,'img.jpg');
      
              console.log('file',param.getAll('file'))
      
              let config = {
                headers:{'Content-Type':'multipart/form-data'}
              };  //添加请求头
              axios.post('/issue/do',param,config)
              .then(response=>{
                  obj.imgBase64 = null
                  obj.changed=false

                  let data = JSON.parse(response.data.biz_content)
                  console.log(data);
                  this.$set(this.pictureList, index, {
                      file_code: data.file_code,
                      file_name: data.file_name,
                      file_serial: data.file_serial,
                      photo_code: obj.photo_code,
                  });
                  console.log(this.pictureList, '11111111');
              }).catch((err)=>{
                  _this.$alert(err.message, '提示', {
                      dangerouslyUseHTMLString: true,
                      showClose: false,
                      confirmButtonText: '确定'
                  })
              })
          },
            //dataURL to blob,
          dataUrlToBlob(dataURI){
             let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
              let byteString = atob(dataURI.split(',')[1]); //base64 解码
      
              let arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
              let intArray = new Uint8Array(arrayBuffer); //创建视图
      
              for (let i = 0; i < byteString.length; i++) {
                  intArray[i] = byteString.charCodeAt(i);
              }
              return new Blob([intArray], {type: mimeString});
          },
          
          delPic(obj){
            new Promise((resolve, reject) => {
              fetch({
                url: api['delPic'].url ,
                method: 'post',
                data: {
                  method:api['delPic'].method,
                  customer_id:this.customerInfo.customer_id||'',
                  photo_code:obj.photo_code,
                  file_serial:obj.file_serial
                }
              }).catch(error => {
                 console.log("获取信息失败：", error);
              })
            })
          },
          //获取客户档案
          getCustomerFiles(){

            new Promise((resolve, reject) => {
              fetch({
                url: api['getUArchives'].url ,
                method: 'post',
                data: {
                  method:api['getUArchives'].method,
                  customer_id:this.customerInfo.customer_id||''
                }
              }).then(res => {
                  // console.log("获取信息res1111：", res);
                  
                  const bizContent = res;
                  if(res.length>0){
                    this.upOperation=true;
                  }
                  console.log("获取信息bizContent：",bizContent);
                   bizContent.forEach((item) => {
                          switch (item.photo_code) {
                              case '1':
                                  this.$set(this.pictureList, 0, item);
                                  break;
                              case '11':
                                  this.$set(this.pictureList, 1, item);
                                  break;
                              case '2':
                                  this.$set(this.pictureList, 2, item);
                                  break;
                              case '4':
                                  this.$set(this.pictureList, 3, item);
                                  break
                              case '7':
                                  this.$set(this.pictureList, 4, item);
                                  break
                          }
                          
                          let arr =  bizContent.filter(m => m.photo_code == '9')||[];
                          console.log('arrarrarrarrarr',arr)
                          if(arr.length>0){
                            this.UOtherlength = arr.length+1;
                            for (let i = 0; i < arr.length; i++) {
                                let idx = 5 + i;
                                this.$set(this.pictureList, idx, arr[i]);
                            }
                            let index = 5+arr.length;
                            this.$set(this.pictureList, index, {photo_code:'9'});
                          }
                      });
                   console.log("用户其他",this.pictureList);
      
                 
              }).catch(error => {
                 console.log("获取信息失败：", error);
              })
            })
          },

            // 点击展示大图
            toggleShowImage(file_code, index) {
                this.list = this.pictureList.filter((item) => {
                    return item.file_code;
                })
                this.photoVisible = true;
                this.chooseImage = index;
              this.imgSrc = '/archives/display/L/' + file_code;

            },
            closeImageShow() {
                this.photoVisible = false;
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
            arrowClick(direction) {
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
            }
        }
      };
      </script>
      <style lang="scss" scoped>
          @import "../../../styles/common";
          .archives-container{
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              position: relative;
          }
      .archives-content {
        /*width: 815px;*/
          padding: 0 20px;
          height: $dialog-height;
          overflow-y: auto;
        .item {
          display: inline-block;
          margin: 20px 30px 20px 35px;
        }
      }
      </style>
      