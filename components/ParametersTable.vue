<template>
    <v-card dark tile hover color="teal darken-3 mx-1" fill-height>
        <v-card-text class="subheading px-0 ma-0 py-1">
            <table >
                <tr>
                    <td colspan="2" class="blue--text">{{title}}</td>
                </tr>
                <tr>
                    <th v-for="(value,key) in list[0]" :key="key" v-html="computedValue(key,decimal)" class="green--text"></th>
                </tr>
                <tr v-for="(item,i) in list" :key="i">
                    <td v-for="(value,key) in item" :key="key" v-html="computedValue(value,decimal)" class="teal--text">
                    </td>
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
            let val = value
            return _.isString(val) ?  val : val.toFixed(decimal)
        },
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>
table {
    
  border-collapse: collapse;
  width: 100%;
}

table, th, td {
    border-bottom: 1px solid #ddd;
  /* border: 1px solid black; */
    padding-top: 5px;
    padding-bottom: 5px;
}

/* tr:hover {background-color: #f5f5f5;} */

tr:nth-child(even) {background-color: #f2f2f2;}
</style>