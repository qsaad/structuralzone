<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="Ss" v-model="Ss" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="S1" v-model="S1" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:1>
            <v-text-field label="R" v-model="R" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="h (ft)" v-model="h" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:2>
            <v-select label="Site Class" :items="siteClassList" v-model="siteClass" class="pa-0 ma-0"></v-select>
            <v-select label="Category" :items="categoryList" v-model="category" class="pa-0 ma-0"></v-select>
        </template>
        <template v-slot:3>
            <v-select label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-select>
            <v-select label="Period" :items="TLList" v-model="TL" class="pa-0 ma-0"></v-select>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Parameters" :list="design.params" :decimal="3" v-if="isDebug"></parameters-list>
            <parameters-list title="Parameters" :list="design.shearParams" :decimal="3" v-if="isDebug"></parameters-list>
            
            <output-capsule
                title="C<sub>s</sub>"
                :value="design.Cs"
                :decimal=3
                unit="&nbsp;"
                v-if="!isDebug"
            ></output-capsule>

            <output-capsule
                title="SDC"
                :value="design.SDC"
                unit="&nbsp;"
                v-if="!isDebug"
            ></output-capsule>
           
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
       
        <template v-slot:warnings>
           <!-- <check-capsule
                title="e"
                :actual="design.e"
                :allowable="L/6"
                :decimal=2
                v-if="design.e > L/6"
            ></check-capsule>
            <check-capsule
                title="x"
                :actual="design.x"
                :allowable="L"
                :decimal=2
                v-if="design.x < L"
            ></check-capsule> -->
        </template>
    </module-card>   
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'
import OutputCapsule from '@/components/OutputCapsule.vue'
import CheckCapsule from '@/components/CheckCapsule.vue'
import ParametersList from '@/components/ParametersList.vue'

import Seismic from '@/classes/seismic/clsSeismic'

import {seismic} from '@/mixins/seismicMixin'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, CheckCapsule, ParametersList   
        },//COMPONENTS
        mixins : [seismic],
        data(){
            return{
                isDebug : false,
                inputCards :[
                    {xs : 3, md : 3, title : "coefficient"},
                    {xs : 3, md : 3, title : "parameters"},
                    {xs : 3, md : 3, title : "category"},
                    {xs : 3, md : 3, title : "type"},
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
            design(){
                let objData = {
                    Ss : this.Ss,
                    S1 : this.S1,
                    R : this.R,
                    h : this.h,
                    siteClass : this.siteClass,
                    category : this.category,
                    type : this.type,
                    TL : this.TL,
                }
                let obj = new Seismic(objData)
               
                return {
                    //DEBUGGING PARAMETERS
                    params : obj.params(),
                    shearParams : obj.shearParams(),

                    //OUTPUT
                    Cs : obj.Cs(),
                    SDC : obj.SDC(),
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>