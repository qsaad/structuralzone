<template>
    <module-card :title="title" :inputCards="inputCards">
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-combobox label="t (in)" :items="thicknessList" v-model.number="thickness" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="fm (psi)" v-model.number="fm" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="h (ft)" v-model.number="h" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:1>
            <v-combobox label="Rebar Location" :items="rebarLocList" v-model="rebarLoc" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Spacing (in)" :items="rebarSpaList" v-model="rebarSpa" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-combobox>
        </template>
        
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Property" :list="design.propParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Flexure" :list="design.flexureParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Axial" :list="design.axialParams" v-if="isDebug"></parameters-list>
            
            <output-capsule
                title="M"
                :value="design.M"
                :decimal=0
                unit="lb-ft"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="P"
                :value="design.P"
                :decimal=0
                unit="lb"
                v-if="!isDebug"
            ></output-capsule>
          
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:warnings>
            <!-- <check-capsule
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
            ></check-capsule> -->
        </template>
    </module-card>
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'
import OutputCapsule from '@/components/OutputCapsule.vue'
import CheckCapsule from '@/components/CheckCapsule.vue'
import ParametersList from '@/components/ParametersList.vue'

import {masonry} from '@/mixins/masonryMixin'
import WallCapacity from '@/classes/masonry/clsWallCapacity'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard,OutputCapsule, CheckCapsule, ParametersList 
        },//COMPONENTS
        mixins : [masonry],
        data(){
            return{
                isDebug : false,
                h : 24,
               
                inputCards :[
                    {xs : 6, md : 3, title : "beam"},
                    {xs : 6, md : 3, title : "rebar"},
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
                    thickness : this.thickness,
                    fm:this.fm,
                    h:this.h, 
                    rebarSize:this.rebarSize, 
                    rebarSpa:this.rebarSpa,
                    rebarLoc:this.rebarLoc,
                }

                let obj = new WallCapacity(objData)

                return{
                    //DEBUGGING
                    propParams : obj.propParams(),
                    flexureParams : obj.flexureParams(),
                    axialParams : obj.axialParams(),
                    //OUTPUT
                    M : obj.M(),
                    P : obj.P(),
                    // n : obj.n().toFixed(3),
                    // b : obj.b().toFixed(3),
                    // d : obj.d().toFixed(3),
                    // rho : obj.rho().toFixed(4),
                    // k1 : obj.k1().toFixed(3),
                    // kd : obj.kd().toFixed(3),
                    // k : obj.k().toFixed(3),
                    // j : obj.j().toFixed(3),
                    // Fs : obj.Fs().toFixed(0),
                    // Mm : obj.Mm().toFixed(0),
                    // Ms : obj.Ms().toFixed(0),
                    // h_r : obj.h_r().toFixed(2),
                    // r : obj.r.toFixed(2),
                    // Ag : obj.Ag.toFixed(2),
                    // Fa : obj.Fa().toFixed(0),
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>