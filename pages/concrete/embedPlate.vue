<template>
    <module-card :title="title" :inputCards="inputCards">
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="Nu (k)" v-model.number="Nu" class="pa-0 ma-0"></v-text-field>
                <v-text-field label="en (in)" v-model.number="en" class="pa-0 ma-0"></v-text-field>
				<v-text-field label="Vu (k)" v-model.number="Vu" class="pa-0 ma-0"></v-text-field>
				<v-text-field label="ev (in)" v-model.number="ev" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:1>
            <v-text-field label="h" v-model.number="h" class="pa-0 ma-0"></v-text-field>
			<v-text-field label="fc" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
			<v-checkbox label="Cracked" v-model="cracked" class="pa-0 ma-0"></v-checkbox>
			<v-checkbox label="Confined" v-model="confined" class="pa-0 ma-0"></v-checkbox>
        </template>
        <template v-slot:2>
            <v-combobox label="ds (in)" :items="headedStudSizeList" v-model="headedStudSize" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="hef (in)" v-model.number="hef" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:3>
            <v-text-field label="# Rows" v-model.number="NR" class="pa-0 ma-0"></v-text-field>
			<v-text-field label="# Columns" v-model.number="NC" class="pa-0 ma-0"></v-text-field>
			<v-text-field label="Column Spacing (in)" v-model.number="SC" class="pa-0 ma-0"></v-text-field>
			<v-text-field label="Row Spacing (in)" v-model.number="SR" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:4>
            <v-text-field label="Left (in)" v-model.number="d1" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Right (in)" v-model.number="d2" class="pa-0 ma-0"></v-text-field>
			<v-text-field label="Bottom (in)" v-model.number="d3" class="pa-0 ma-0"></v-text-field>
			<v-text-field label="Top (in)" v-model.number="d4" class="pa-0 ma-0"></v-text-field>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:buttons>
                <v-btn-toggle v-model="mode" mandatory v-if="!isDebug">
                    <v-btn value="Capacity">Capacity</v-btn>
                    <v-btn value="Interaction">Interaction</v-btn>
                </v-btn-toggle>
        </template>

        <template>
            <parameters-list title="Steel" :list="design.steelParams" :decimal="2" v-if="isDebug"></parameters-list>
            <parameters-list title="Breakout" :list="design.breakoutParams" :decimal="2" v-if="isDebug"></parameters-list>
            <parameters-list title="Pullout" :list="design.pulloutParams" :decimal="2" v-if="isDebug"></parameters-list>
            <parameters-list title="Blowout" :list="design.blowoutParams" :decimal="2" v-if="isDebug"></parameters-list>
            <parameters-list title="Front Edge" :list="design.frontParams" :decimal="2" v-if="isDebug"></parameters-list>
            <parameters-list title="Corner" :list="design.cornerParams" :decimal="2" v-if="isDebug"></parameters-list>
            <parameters-list title="Side Edge" :list="design.sideParams" :decimal="2" v-if="isDebug"></parameters-list>

            <output-capsule
                title="&phi;N<sub>n</sub>"
                :value="design.fNn"
                :decimal=2
                unit="k"
                v-if="!isDebug && mode == 'Capacity'"
            ></output-capsule>
            <output-capsule
                title="&phi;V<sub>n</sub>"
                :value="design.fVn"
                :decimal=2
                unit="k"
                v-if="!isDebug && mode == 'Capacity'"
            ></output-capsule>

            <output-capsule
                title="Tension"
                :decimal=0
                :actual="Nu"
                :allowable="design.fNn"
                unit=""
                v-if="!isDebug && mode == 'Interaction'"
            ></output-capsule>

            <output-capsule
                title="Shear"
                :decimal=0
                :actual="Vu"
                :allowable="design.fVn"
                unit=""
                v-if="!isDebug && mode == 'Interaction'"
            ></output-capsule>

            <output-capsule
                title="Interaction"
                :value="design.interaction"
                :decimal=0
                unit=""
                v-if="!isDebug && mode == 'Interaction'"
            ></output-capsule>
           
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:warnings>
            <check-capsule
                title="Anchor Embed"
                :actual="hef"
                :allowable="h"
                :decimal=2
                v-if="hef > h"
            ></check-capsule>
        </template>
    </module-card>
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'
import OutputCapsule from '@/components/OutputCapsule.vue'
import CheckCapsule from '@/components/CheckCapsule.vue'
import ParametersList from '@/components/ParametersList.vue'

import {concrete} from '@/mixins/concreteMixin'
import {headedStud} from '@/data/CON_HeadedStud'
import {deciToPercent} from '@/library/mathLib'

import EmbedPlate from '@/classes/concrete/clsEmbedPlate'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard,OutputCapsule, CheckCapsule, ParametersList
        },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                isDebug : false,
                mode: "Capacity",
                //LOAD
               	Nu: 5,
                en : 3,
                Vu : 1,
                ev : 0,
                //MEMBER
                h : 6,
                fc : 4000,
                cracked : true,
                confined : true,
                //STUD
                ds : 0.5,
                hef: 4,
                //LAYOUT
                NR : 2,
                NC : 1,
                SR : 6,
                SC : 6,
                //EDGE DISTANCES
                d1 : 72,
                d2 : 72,
                d3 : 72,
                d4 : 72,
                
                inputCards :[
                    {xs : 4, md : 2, title : "loads"},
                    {xs : 4, md : 2, title : "member"},
                    {xs : 4, md : 2, title : "stud"},
                    {xs : 6, md : 3, title : "layout"},
                    {xs : 6, md : 3, title : "edge distance"},
                ]
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
                let embedData = {
                    //LOAD
                    Nu: this.Nu,
                    en : this.en,
                    Vu : this.Vu,
                    ev : this.ev,
                    //MEMBER
                    h : this.h,
                    fc : this.fc,
                    cracked : this.cracked,
                    confined : this.confined,
                    //STUD
                    headedStud : headedStud(this.headedStudSize),
                    hef: this.hef,
                    //LAYOUT
                    NR : this.NR,
                    NC : this.NC,
                    SR : this.SR,
                    SC : this.SC,
                    //EDGE DISTANCES
                    d1 : this.d1,
                    d2 : this.d2,
                    d3 : this.d3,
                    d4 : this.d4,
                }

                let obj = new EmbedPlate(embedData)

                return{
                    //DEBUGGING
                    steelParams : obj.steelParams(),
                    breakoutParams : obj.breakoutParams(),
                    pulloutParams : obj.pulloutParams(),
                    blowoutParams : obj.blowoutParams(),
                    frontParams : obj.frontParams(),
                    cornerParams : obj.cornerParams(),
                    sideParams : obj.sideParams(),
                    //OUTPUT
                    fNn : obj.fNn(),
                    fVn : obj.fVn(),
                    interaction : deciToPercent(this.Nu/obj.fNn() + this.Vu/obj.fVn())
                    //WARNING
                    
                }

            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>