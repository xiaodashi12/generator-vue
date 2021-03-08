<template>
    <div class="dlg-footer">
        <button
                v-for="info in btninfos"
                :key="info.cmd"
                @click="btnclick(info.cmd)"
                :class="info.cls"
        >{{info.text}}
        </button>
    </div>
</template>
<script>
    export default {
        props: {
            //按钮列表
            btninfos: {
                type: Array,
                required: true
            }
        },
        methods: {
            btnclick: function (cmd) {
                //触发点击事件
                this.$emit("ftClick", cmd);
            }
        }
    };
</script>

<style lang="scss">
    @import "../../../styles/mixin";

    @mixin colorBtn($color) {
        background: $color;
    }


    .dlg-footer {
        font-family: 'PingFangSC-Semibold';
        display: flex;
        flex-direction: row;
        position: relative;
        width: 100%;
        font-size: 20px;
        background: #ffffff 100%;
        letter-spacing: 5px;

        button {
            cursor: pointer;
            flex: 1;
            height: 45px;
            font-size: 20px;
            color: #fff;
            text-align: center;
            border: none;
            outline: none;
            border-right: 1px solid #fff;

            &:last-child {
                border-right: 0;
            }

            /* transition: 600ms ease all; */
            position: relative;
            display: inline-block;

            &:hover {
                /* background: #fff; */
                opacity: 0.8;
            }

            &.flex2 {
                flex: 2;
            }

            &.arrowright {
                &:after {
                    position: absolute;
                    top: 14px;
                    right: 36px;
                    content: '';
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border-top: 2px solid #fff;
                    border-right: 2px solid #fff;
                    transform: rotate(45deg);
                }
            }

            &.arrowleft {
                position: relative;

                &:before {
                    position: absolute;
                    top: 14px;
                    left: 36px;
                    content: '';
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border-top: 2px solid #fff;
                    border-right: 2px solid #fff;
                    transform: rotate(225deg);
                }
            }

            &.gray-btn {
                @include colorBtn(#999999);
                cursor: pointer;
            }

            &.green-btn {
                @include colorBtn(#01C1B2);
                cursor: pointer;
            }

            &.green-border-btn{
                border:1px solid $second-color;
                background-color: #fff;
                color: $second-color;
            }
            &.is-disabled{
                    color: #c0c4cc;
                    background-image: none;
                    background-color: #fff;
                    border-color: #ebeef5;
                    cursor: not-allowed;
            }

            &.blue-btn {
                @include colorBtn(#4494F9);
                cursor: pointer;
            }

            &.radius-l-b-6 {
                border-bottom-left-radius: 6px;
            }

            &.radius-r-b-6 {
                border-bottom-right-radius: 6px;
            }

            &.space30 {
                letter-spacing: 10px
            }
        }

    }


    /*.blue-btn {
      @include colorBtn(#999999);
    }
    .red-btn {
      @include colorBtn(#01C1B2);
    }
    .pink-btn {
      @include colorBtn(#4494F9);
    }
    .yellow-btn {
      @include colorBtn(#01C1B2);
    }*/


</style>

