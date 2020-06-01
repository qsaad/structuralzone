<template>
       <v-layout row wrap justify-center>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        ANALYSIS
                    </v-card-text>
                </v-card>
             </v-flex>
            {{design}}
        </v-layout>
</template>

<script>
import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                L : 12,
                E : 29000,
                I : 200,
                w : 1,
                M : 0,
                V : 0,
                D : 0
            }//RETURN
        },//DATA
        head(){
            return {
                //title: this.title,
                meta: [
                    { hid: 'description', name: 'description', content: this.description }
                ]
            }
        },//HEAD
        asyncData({store,params,route}){
            let arr = split(route.path, '/')
            let link = route.path
            return{
                title : get(find(store.state.pagesList,{'category':arr[1],'link':link}),'title'),
                description : get(find(store.state.pagesList,{'category':arr[1],'link':link}),'description'),
                root : '/' + arr[1]  
            }
        },//ASYNCDATA
        created(){
            
        },//CREATED
        mounted(){
            
        },//MOUNTED
        computed:{
            design(){
              
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>