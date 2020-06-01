<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="Sds" v-model="Sds" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Wp" v-model="Wp" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:1>
            <v-text-field label="ap" v-model="ap" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Rp" v-model="Rp" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:2>
            <v-text-field label="Ip" v-model="Ip" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="z" v-model="z" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="h" v-model="h" class="pa-0 ma-0"></v-text-field>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Parameters" :list="design.params" :decimal="0" v-if="isDebug"></parameters-list>
            
            <output-capsule
                title="C<sub>s</sub>"
                :value="design.Fp"
                :decimal=0
                unit="lbs"
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

import ComponentForce from '@/classes/seismic/clsComponentForce'

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
                    {xs : 4, md : 4, title : "coefficient"},
                    {xs : 4, md : 4, title : "parameters"},
                    {xs : 4, md : 4, title : "category"},
                ],
                Sds : 1,
                Wp : 1000,
                ap : 2,
                Rp : 6,
                z : 20,
                Ip : 1,
                h : 20
               
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
                    Sds : this.Sds,
                    Wp : this.Wp,
                    ap : this.ap,
                    Rp : this.Rp,
                    z : this.z,
                    Ip : this.Ip,
                    h : this.h,
                }
                let obj = new ComponentForce(objData)
               
                return {
                    //DEBUGGING PARAMETERS
                    params : obj.params(),

                    //OUTPUT
                    Fp : obj.Fp(),
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>