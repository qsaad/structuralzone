<template>
    <v-layout row wrap justify-center>
        <v-flex xs6 md4>
            <v-card hover height="100%">
                <v-card-text class="text-xs-center pa-3">
                    WOOD
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'



import {split,get,find,forEach,map,omit} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard,   
        },//COMPONENTS
        mixins : [],
        data(){
            return{
                inputCards :[
                    {xs : 4, md : 4, title : "parameters"},
                ],
             
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
          
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>