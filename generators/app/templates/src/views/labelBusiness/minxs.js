
import { getVehicleColor,getBackupType,getSetupState,getObuStatus } from '@utils/dictionaries';
import api from '@/api'
import fetch from '@/utils/fetch'

export default {
    data:() => {
        return{
            obuInfos:{}
        }
    },
    methods: {
        _getVehicleColors(val){
            return getVehicleColor(val);
        },
        getObuInfo(params){
            
            return new Promise((resolve, reject) => {

                fetch({
                    url: api['getObuInfo'].url || '',
                    method: 'post',
                    data: {
                        method:api['getObuInfo'].method,
                        ...params
                    }
                }).then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    },
    filters:{
        _getBackupType(val){
            return getBackupType(val);
        },
        _getObuStatus(val){
            return getObuStatus(val);
        },
        _getSetupState(val){
            return getSetupState(val);
        }
    }
}