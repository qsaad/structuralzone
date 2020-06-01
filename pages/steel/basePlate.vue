<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="P(k)" v-model.number="Pr" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="M (k-ft)" v-model.number="Mr" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="V (k)" v-model.number="Vr" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:1>
            <v-combobox label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Axis" :items="axisList" v-model="axis" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:2>
            <v-combobox label="db (in)" :items="anchorSizeList" v-model="anchorSize" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="de (in) " v-model.number="de" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Qty Each End " v-model.number="Nb" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Fyb (ksi)" :items="anchorGradeList" v-model="anchorGrade" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:3>
            <v-text-field label="Np (in)" v-model.number="NP" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Bp (in)" v-model.number="BP" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Fy (ksi)" :items="FybList" v-model="Fyp" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:4>
            <v-text-field label="Nc (in)" v-model.number="NC" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Bc (in) " v-model.number="BC" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="fc (psi) " v-model.number="fc" class="pa-0 ma-0"></v-text-field>
        </template>
        
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Load" :list="design.forceParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Plate" :list="design.plateParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Anchor" :list="design.anchorParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Column" :list="design.columnParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Pier" :list="design.pierParams" v-if="isDebug"></parameters-list>
           {{test}}
            <output-capsule
                title="t<sub>p</sub>"
                :value="design.tp"
                :decimal=2
                unit="in"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="Anchor"
                :value="design.I"
                :decimal=0
                unit="Interaction"
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

import * as Data_W from '@/data/Data_W' 
import * as Data_HSS from '@/data/Data_HSS'
import * as Data_Pipe from '@/data/Data_Pipe'
import * as Data_HSR from '@/data/Data_HSR'

import {anchorSize} from '@/data/STL_AnchorSize'
import {anchorGrade} from '@/data/STL_AnchorGrade'

import BasePlate from '@/classes/steel/clsBasePlate'

import {steel} from '@/mixins/steelMixin'
import {deciToPercent} from '@/library/mathLib'

import {split,get,find, filter, map, forEach} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, CheckCapsule, ParametersList   
        },//COMPONENTS
        mixins : [steel],
        data(){
            return{
                isDebug : false,
                inputCards :[
                    {xs : 4, md : 4, title : "load"},
                    {xs : 4, md : 4, title : "column"},
                    {xs : 4, md : 4, title : "anchor"},
                    {xs : 6, md : 6, title : "plate"},
                    {xs : 6, md : 6, title : "pier"},
                ],
                //LOAD
                Pr : 260,
                Vr : 0,
                Mr : 208.33,
                //COLUMN SECTION
                typeList : ['W','HSS','Pipe','HSR'],
                type : 'W',
                ShapeList:[],
                Shape :'W12X96',
                Fy : 50,
                //BASE PLATE
                NP : 22,
                BP : 22,
                FypList : [36,50],
                Fyp : 36,
                //ANCHOR ROD
                Nb : 2,
                de : 1.5,
                FybList : [36,50],
                Fyb : 36,
                //CONCRETE PIER
                NC : 22,
                BC : 22,
                fc : 4000,
               
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
                this.FyList = []
                switch(this.type){
                    case ('W'):
                        forEach(Data_W.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Fy = 50
                        this.Shape = "W12X96"
                        break
                    case ('HSS'):
                        forEach(Data_HSS.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Fy = 46
                        this.Shape = "HSS6X6X3/8"
                        break
                    case ('Pipe'):
                        forEach(Data_Pipe.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Fy = 35
                        this.Shape = "PIPE3STD"
                        break
                    case ('HSR'):
                        forEach(Data_HSR.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Fy = 42
                        this.Shape = "HSS6X.250"
                        break
                }
                return map(this.ShapeList, 'Shape')
            },//ITEMS
            test(){
                console.log(anchorSize(this.anchorSize))
            },
            design(){
                let objData = {
                   //LOAD
                    Pr : this.Pr,
                    Vr : this.Vr,
                    Mr : this.Mr,
                    method : this.method,
                    //SECTION
                    type : this.type,
                    section : find(this.ShapeList, {'Shape': this.Shape}),
                    Fy : this.Fy,
                    axis : this.axis,
                    //PLATE
                    NP : this.NP,
                    BP : this.BP,
                    Fyp : this.Fyp,
                    //ANCHOR
                    anchorSize : anchorSize(this.anchorSize),
                    Nb : this.Nb,
                    de : this.de,
                    anchorGrade : anchorGrade(this.anchorGrade),
                    //PIER
                    NC : this.NC,
                    BC : this.BC,
                    fc : this.fc,
                }
                let obj = new BasePlate(objData)

                let interaction = obj.Tr()/obj.fTn() + this.Vr/obj.fVn()
               
                return {
                    //DEBUGGING PARAMETERS
                    forceParams : obj.forceParams(),
                    plateParams : obj.plateParams(),
                    anchorParams : obj.anchorParams(),
                    columnParams : obj.columnParams(),
                    pierParams : obj.pierParams(),

                    //OUTPUT
                    tp : obj.tp(),
                    I : deciToPercent(interaction),
                    // fTn : obj.fTn(),
                    // fVn : obj.fVn(),
                    // Tr : obj.Tr(),
                    // Vr : this.Vr
                   
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>