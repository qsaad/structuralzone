<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-combobox label="Type" :items="fastenerTypeList" v-model="fastenerType" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="D (in)" v-model.number="D" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="L (in)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Shear Plane" :items="shearPlaneList" v-model="shearPlane" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:1>
            <v-combobox label="Type" :items="sideTypeList" v-model="sideType" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="Gs" v-model.number="Gs" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="ts (in)" v-model.number="ts" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="angle" v-model.number="theta_side" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:2>
            <v-combobox label="Type" :items="mainTypeList" v-model="mainType" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="Gm" v-model.number="Gm" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="tm (in)" v-model.number="tm" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="angle" v-model.number="theta_main" class="pa-0 ma-0"></v-text-field>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Fastener" :list="design.fastenerParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Modes" :list="design.modeParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Side Member" :list="design.sideParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Main Member" :list="design.mainParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Shear" :list="design.shearParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Withdrawal" :list="design.withdrawalParams" v-if="isDebug"></parameters-list>
            <output-capsule
                title="q<sub>z</sub>"
                :value="design.Z"
                :decimal=2
                unit="lb"
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

import Fastener from '@/classes/wood/clsFastener'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, CheckCapsule, ParametersList   
        },//COMPONENTS
        mixins : [],
        data(){
            return{
                isDebug : false,
                inputCards :[
                    {xs : 4, md : 4, title : "parameters"},
                    {xs : 4, md : 4, title : "parameters"},
                    {xs : 4, md : 4, title : "parameters"},
                ],
                //FASTENER
                fastenerTypeList : ['Nail','Wood Screw','Lag Screw','Bolt'],
                fastenerType : 'Nail',
                D : 0.119,
                L : 3,
                shearPlaneList : ['Single','Double'],
                shearPlane : 'Single',
                //SIDE MEMBER
                sideTypeList : ['Wood','Steel','ColdForm'],
                sideType : 'Wood',
                Gs : 0.5,
                ts : 1.5,
                theta_side : 0,
                //MAIN MEMBER
                mainTypeList : ['Wood','Concrete','Masonry','Steel'],
                mainType : 'Wood',
                Gm : 0.5,
                tm : 1.5,
                theta_main : 0,
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
                    //FASTENER
                    fastenerType : this.fastenerType,
                    D : this.D,
                    L : this.L,
                    shearPlane : this.shearPlane,
                    //SIDE MEMBER
                    sideType : this.sideType,
                    Gs : this.Gs,
                    ts : this.ts,
                    theta_side : this.theta_side,
                    //MAIN MEMBER
                    mainType : this.mainType,
                    Gm : this.Gm,
                    tm : this.tm,
                    theta_main : this.theta_main,
                }
                let obj = new Fastener(objData)
               
                return {
                    //DEBUG
                    fastenerParams : obj.fastenerParams(),
                    modeParams : obj.modeParams(),
                    sideParams : obj.sideParams(),
                    mainParams : obj.mainParams(),
                    shearParams : obj.shearParams(),
                    withdrawalParams : obj.withdrawalParams(),
                    //OUTPUT
                    Z : obj.Z(),
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>