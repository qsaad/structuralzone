<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="Pg (psf)" v-model="Pg" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Terrain" :items="terrainList" v-model="terrain" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Exposure" :items="exposureList" v-model="exposure" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:1>
            <v-combobox label="Thermal" :items="thermalList" v-model="thermal" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Category" :items="categoryList" v-model="category" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:2>
            <v-text-field label="Lu - High (ft)" v-model="Luh" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Lu - Low (ft)" v-model="Lul" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="h (ft)" v-model="h" class="pa-0 ma-0"></v-text-field>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Parameters" :list="design.params" v-if="isDebug"></parameters-list>
            <parameters-list title="Parameters" :list="design.driftParams" v-if="isDebug"></parameters-list>

            <output-capsule
                title="P<sub>d</sub>"
                :value="design.Pd"
                :decimal=2
                unit="psf"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="w<sub>d</sub>"
                :value="design.wd"
                :decimal=2
                unit="ft"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="h<sub>d</sub>"
                :value="design.hd"
                :decimal=2
                unit="ft"
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

import Snow from '@/classes/snow/clsSnow'

import {snow} from '@/mixins/snowMixin'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, CheckCapsule, ParametersList   
        },//COMPONENTS
        mixins : [snow],
        data(){
            return{
                isDebug : false,
                inputCards :[
                    {xs : 4, md : 4, title : "parameters"},
                    {xs : 4, md : 4, title : "parameters"},
                    {xs : 4, md : 4, title : "parameters"},
                ],
                Luh : 75,
                Lul : 100,
                h : 6,
               
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
                    Pg : this.Pg,
                    exposure : this.exposure,
                    terrain : this.terrain,
                    thermal : this.thermal,
                    category : this.category,
                    Luh : this.Luh,
                    Lul : this.Lul,
                    h : this.h
                }
                let obj = new Snow(objData)
               
                return {
                    //DEBUGGING PARAMETERS
                    params : obj.params(),
                    driftParams : obj.driftParams(),
                    //OUTPUT
                    Pd : obj.Pd(),
                    wd : obj.wd(),
                    hd : obj.hd(),
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>