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
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Parameters" :list="design.params" v-if="isDebug"></parameters-list>
            
            <output-capsule
                title="P<sub>f</sub>"
                :value="design.Pf"
                :decimal=2
                unit="psf"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="P<sub>m</sub>"
                :value="design.Pm"
                :decimal=2
                unit="psf"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="P<sub>rs</sub>"
                :value="design.Prs"
                :decimal=2
                unit="psf"
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
                    {xs : 6, md : 3, title : "parameters"},
                    {xs : 6, md : 3, title : "parameters"},
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
                    Pg : this.Pg,
                    exposure : this.exposure,
                    terrain : this.terrain,
                    thermal : this.thermal,
                    category : this.category
                }
                let obj = new Snow(objData)
               
                return {
                    //DEBUGGING PARAMETERS
                    params : obj.params(),

                    //OUTPUT
                    Pf : obj.Pf(),
                    Pm : obj.Pm(),
                    Prs : obj.Prs(),
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>