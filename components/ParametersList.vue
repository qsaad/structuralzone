<template>
    <v-card dark tile hover color="teal darken-3 mx-1" fill-height>
        <v-card-text class="subheading px-0 ma-0 py-1">
            <table style="width:150px">
                <tr>
                    <td colspan="2" class="blue--text">{{title}}</td>
                </tr>
                <tr v-for="(value,key) in list" :key="key">
                    <td class="green--text">{{key}}</td>
                    <td class="teal--text" v-html="computedValue(value,decimal)"> </td>
                    <!-- <td>{{value.toFixed(decimal)}}</td> -->
                </tr>
            </table>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        props:{
            title : {type:String,default:""},
            list : {type:Array,default:[]},
            decimal : {type:Number,default:2}
        },
        data(){
            return{
              
            }//RETURN
        },//DATA
        created(){
            
        },//CREATED
        mounted(){
            
        },//MOUNTED
        computed:{
            
        },//COMPUTED
        methods:{
            computedValue(value,decimal){
                return _.isNumber(value) ?  value.toFixed(decimal) : value
                // switch(val){
                //     case _.isString(val) : 
                //         return val
                //         break
                //     case _.isNumber(val):
                //         return val.toFixed(decimal)
                //         break
                //     case _.isArray(val):
                //         return val
                //         break
                //     case _.isObject(val):
                //         return val
                //         break
                // }
            },
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>