
<template>
    <div>
        <popSwitch @onChange="transKey" :btnList="vehicleCpuTabList"></popSwitch>

        <vehicleCpuInfo v-if="active==='0'"></vehicleCpuInfo>
        <vehicleCpuLog v-if="active==='1'"></vehicleCpuLog>
        <vehicleCpuPayinfo v-if="active==='2'"></vehicleCpuPayinfo>

    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {vehicleCpuTabList} from '@/utils/dictionaries'
    import {getCustomerType, getVehicleType, getVehicleUserType, getCardType} from '../../../utils/dictionaries'
    import popSwitch from '../../popSwitch';
    import vehicleCpuInfo from './vehicleCpuInfo';
    import vehicleCpuLog from '../vehicleCpuLog';
    import vehicleCpuPayinfo from './vehicleCpuPayinfo';

    export default {
        name: 'vehicleCpuIndex',
        props: {
            showBtn: {
                type: Boolean,
                default: false
            },
        },
        components: {
            vehicleCpuInfo,
            vehicleCpuLog,
            vehicleCpuPayinfo,
            popSwitch,
        },
        data() {
            return {
                vehicleCpuTabList: vehicleCpuTabList,
                active: '0',
            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
        },
        mounted() {
            console.log(this.customerInfo, 'customerInfo');
            console.log(this.vehicleInfo, 'vehicleInfo');
        },
        methods: {
            transKey(key){
                this.active = key;
            },
        },
        filters: {
            getCustomerTypeFilter(val) {
                return getCustomerType(val);
            },
            getVehicleTypeFilter(val) {
                return getVehicleType(val);
            },
            getVehicleUserTypeFilter(val) {
                return getVehicleUserType(val);
            },
            getCardTypeFilter(val) {
                return getCardType(val);
            },

        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../../../styles/mixin";
    .list_row {
        padding: 30px;
        display: flex;
        flex-direction: column;

        .list_row_title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            font-size: .5rem;

            .line {
                width: 2px;
                height: 20px;
                display: inline-block;
                background: $three-color;
                margin-right: 5px;
            }
        }

        .list_row_body {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-bottom: 30px;

            > div {
                width: 33%;
                display: flex;
                flex-direction: row;
                padding: 10px;
                box-sizing: border-box;
            }

            .userInfo_key {
                color: #999999;
            }
        }
    }
</style>
