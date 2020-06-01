<template>
    <module-card :title="title" :inputCards="inputCards">
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="P (k)" v-model.number="P" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="M (k)" v-model.number="M" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="SBC (ksf)" v-model.number="SBC" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:1>
            <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="B (ft)" v-model.number="B" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="H (in)" v-model.number="H" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:2>
            <v-text-field label="Lp (in)" v-model.number="Lp" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Bp (in)" v-model.number="Bp" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Hp (in)" v-model.number="Hp" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:3>
            <v-text-field label="fc (psi)" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Footing" :items="rebarSizeList" v-model="rebarSizeFooting" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Pier" :items="rebarSizeList" v-model="rebarSizePier" class="pa-0 ma-0"></v-combobox>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            
            <parameters-list title="Bearing" :list="design.basePressure" v-if="isDebug"></parameters-list>
            <parameters-list title="Flexure" :list="design.flexure" :decimal=4 v-if="isDebug"></parameters-list>
            <parameters-list title="Shear" :list="design.shear" :decimal=4 v-if="isDebug"></parameters-list>
           
            <output-capsule
                title="SBC"
                :decimal=0
                :actual="design.qmax"
                :allowable="SBC"
                unit="Pressure"
                v-if="!isDebug"
            ></output-capsule>

            <output-capsule
                title="V<sub>1</sub>"
                :decimal=0
                :actual="design.Vu1"
                :allowable="design.fVn1"
                unit="Oneway Shear"
                v-if="!isDebug"
            ></output-capsule>

            <output-capsule
                title="V<sub>p</sub>"
                :decimal=0
                :actual="design.Vup"
                :allowable="design.fVnp"
                unit="Punching Shear"
                v-if="!isDebug"
            ></output-capsule>

            <output-capsule
                title="Rebar"
                :value="design.Nb"
                :decimal=0
                :unit="rebarSizeFooting"
                v-if="!isDebug"
            ></output-capsule>
        
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:warnings>
            
            <check-capsule
                title="Spacing"
                :actual="design.Sb"
                :allowable="18"
                :decimal=2
                v-if="design.Sb > 18"
            ></check-capsule>
          
        </template>
        <template v-slot:calculations>
         
        </template>
    </module-card>
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'
import OutputCapsule from '@/components/OutputCapsule.vue'
import ParametersList from '@/components/ParametersList.vue'
import CheckCapsule from '@/components/CheckCapsule.vue'

import {concrete} from '@/mixins/concreteMixin'
import SpreadFooting from '@/classes/foundation/clsSpreadFooting'

import {split,get,find} from 'lodash'

import {deciToPercent} from '@/library/mathLib'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard,OutputCapsule, CheckCapsule, ParametersList
        },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                isDebug:false,
                //LOAD
                P : 50,
                M : 20,
                SBC : 3,
                //FOOTING
                L : 6,
                B : 6,
                H : 12,
                //PIER
                Lp : 18,
                Bp : 18,
                Hp : 24,
                //REINFORCING
                fc : 3000,
                rebarSizeFooting : "#5",
                rebarSizePier : "#5",

                inputCards :[
                    {xs : 3, md : 3, title : "loads"},
                    {xs : 3, md : 3, title : "footing"},
                    {xs : 3, md : 3, title : "pier"},
                    {xs : 3, md : 3, title : "rebar"},
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
                let objData = {
                    P : this.P,
                    M : this.M,
                    SBC : this.SBC,  

                    L : this.L, 
                    B : this.B,
                    H : this.H,

                    Lp : this.Lp,
                    Bp : this.Bp,
                    Hp : this.Hp,
                  
                    fc : this.fc,
                    rebarSizeFooting : this.rebarSizeFooting,
                    rebarSizePier : this.rebarSizePier,
                }

                let obj = new SpreadFooting(objData)

                return{
                    //DEBUGGING PARAMETERS
                    basePressure : obj.basePressure(),
                    flexure : obj.flexure(),
                    shear : obj.shear(),
                    //OUTPUT
                   // q : obj.bearingPressure().qmax,
                    qmax : obj.basePressure().qmax,
                    //q : deciToPercent(obj.basePressure().qmax/this.SBC),
                    //V1 : deciToPercent(obj.basePressure().Vu1/obj.shear().fVn1),
                    //Vp : deciToPercent(obj.basePressure().Vup/obj.shear().fVnp),
                    Nb : obj.flexure().Nb,
                    Vu1 : obj.basePressure().Vu1,
                    Vup : obj.basePressure().Vup,
                    fVn1 : obj.shear().fVn1,
                    fVnp : obj.shear().fVnp,
                   
                    //DESIGN
                    rho : obj.flexure().rho,
                    rho_bal : obj.flexure().rho_bal,
                    rho_min : obj.flexure().rho_min,
                    Sb : obj.flexure().Sb,
                   
                }

            }//DESIGN
        },//COMPUTED
        methods:{
            
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>