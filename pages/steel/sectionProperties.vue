<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-combobox label="Select Type" :items="TypeList" v-model="Type"></v-combobox>
        </template>
        <template v-slot:1>
            <v-combobox label="Select Section" :items="items" v-model="Shape"></v-combobox>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
           <v-container grid-list-md fluid class="pa-0 mt-3">
                <v-layout row wrap>
                    <v-flex xs4 sm4 md2 v-for="(value, key) in properties" :key="key">
                        <v-card hover>
                            <v-card-text class="pa-1">
                                <v-layout row space-between>
                                    <v-flex xs6 class="body-1 font-weight-thin blue--text">{{key}}</v-flex>
                                    <v-flex xs6 class="body-1 font-weight-thin yellow--text">{{value}}</v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
       
        <template v-slot:warnings>
          
        </template>
    </module-card>   
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'

import * as Data_W from '@/data/Data_W' 
import * as Data_WT from '@/data/Data_WT' 
import * as Data_HSS from '@/data/Data_HSS'
import * as Data_C from '@/data/Data_C'
import * as Data_MC from '@/data/Data_MC'
import * as Data_Pipe from '@/data/Data_Pipe'
import * as Data_HSR from '@/data/Data_HSR'
import * as Data_LLBB from '@/data/Data_LLBB'
import * as Data_LU from '@/data/Data_LU'

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
                    {xs : 6, md : 6, title : "parameters"},
                    {xs : 6, md : 6, title : "parameters"},
                ],
                TypeList : ['W','WT','HSS','C','MC','Pipe','HSR','LLBB','LU'],
                Type : 'W',
                ShapeList:[],
                Shape :'W16X26'
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
            forEach(Data_W.ShapeList,item =>{
                this.ShapeList.push(item)
            }) 
        },//MOUNTED
        computed:{
            items(){
                this.ShapeList = []
                switch(this.Type){
                    case ('W'):
                        forEach(Data_W.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Shape = "W16X26"
                        break
                    case ('WT'):
                        forEach(Data_WT.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Shape = "WT6X25"
                        break
                    case ('HSS'):
                        forEach(Data_HSS.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Shape = "HSS6X6X3/8"
                        break
                    case ('C'):
                        forEach(Data_C.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Shape = "C10X15.3"
                        break
                    case ('MC'):
                        forEach(Data_MC.ShapeList,item =>this.ShapeList.push(item))
                        this.Shape = "MC6X16.3" 
                        break
                    case ('Pipe'):
                        forEach(Data_Pipe.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Shape = "PIPE3STD"
                        break
                    case ('HSR'):
                        forEach(Data_HSR.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Shape = "HSS6X.250"
                        break
                    case ('LLBB'):
                        forEach(Data_LLBB.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Shape = "2L5X3-1/2X5/16LLBB"
                        break
                    case ('LU'):
                        forEach(Data_LU.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Shape = "L5X3-1/2X5/16"
                        break

                }

                return map(this.ShapeList, 'Shape')
            },//DATA
            properties(){
                return omit(find(this.ShapeList, {'Shape': this.Shape}),['Shape'])
            },//PROPERTIES
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>