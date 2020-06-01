<template>
    <module-card :title="title" :inputCards="inputCards">
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="b (in)" v-model.number="b" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="h (in)" v-model.number="h" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="fc (psi)" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:1>
            <v-combobox label="Quantity" :items="rebarQtyList" v-model.number="rebarQty" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="cov (in)" v-model.number="cov" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:2>
            <v-combobox label="Size" :items="rebarSizeList" v-model="stirrupSize" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="Spa (in)" v-model.number="stirrupSpa" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Legs " v-model.number="noStirrupLegs" class="pa-0 ma-0"></v-text-field>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Flexure" :list="design.flexureParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Shear" :list="design.shearParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Rebar" :list="design.rebarParams" :decimal="4" v-if="isDebug"></parameters-list>

            <output-capsule
                title="&phi;M<sub>n</sub>"
                :value="design.M"
                :decimal=2
                unit="k-ft"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="&phi;V<sub>n</sub>"
                :value="design.V"
                :decimal=2
                unit="k"
                v-if="!isDebug"
            ></output-capsule>
           
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:warnings>
            <check-capsule
                title="&rho;"
                :actual="design.rho"
                :allowable="design.rho_bal"
                :decimal=4
                v-if="design_rho > design.rho_bal"
            ></check-capsule>
            <check-capsule
                title="Clr Spa"
                :actual="design.clrSpa"
                :allowable=0.75
                :decimal=2
                v-if="design.clrSpa < 0.75"
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
import {flexureCapacity, fVn1} from '@/library/concreteLib'
import ConcreteBeam from '@/classes/concrete/clsConcreteBeam'

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
                b : 12,
                h : 24,
                rebarQtyList : [2,3,4,5,6,7,8,9,10],
                stirrupSize : "#3",
                stirrupSpa : 12,
                noStirrupLegs : 2,
               
                inputCards :[
                    {xs : 4, md : 2, title : "beam"},
                    {xs : 4, md : 2, title : "rebar"},
                    {xs : 4, md : 2, title : "stirrups"},
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
                let beamData = {
                    b:this.b, 
                    h:this.h, 
                    rebarSize:this.rebarSize, 
                    stirrupSize:this.stirrupSize, 
                    rebarQty:this.rebarQty, 
                    stirrupSpa:this.stirrupSpa,
                    noStirrupLegs :this.noStirrupLegs, 
                    cov:this.cov, 
                    Fy:60000, 
                    fc:this.fc
                }

                let obj = new ConcreteBeam(beamData)

                return{
                    //DEBUGGING
                    flexureParams : obj.flexureParams(),
                    shearParams : obj.shearParams(),
                    rebarParams : obj.rebarParams(),
                    //OUTPUT
                    M : obj.flexureCapacity(),
                    V : obj.shearCapacity(),
                    //WARNING
                    rho : obj.rho(),
                    rho_min : obj.rho_min(),
                    rho_bal : obj.rho_bal(),
                    clrSpa : obj.clrSpa(),
                }

            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>