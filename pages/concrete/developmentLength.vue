<template>
    <module-card :title="title" :inputCards="inputCards">
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-combobox label="Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-combobox>
            <v-text-field label="fc (psi)" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Size" :items="rebarGradeList" v-model="rebarGrade" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:1>
            <v-combobox label="Location" :items="locationList" v-model.number="location" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Coating" :items="coatingList" v-model.number="coating" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Type" :items="concreteTypeList" v-model.number="concreteType" class="pa-0 ma-0"></v-combobox>
        </template>
        <!-- <template v-slot:2>
            <v-text-field label="cov (in)" v-model.number="cov" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Spac (in)" v-model.number="rebarSpa" class="pa-0 ma-0"></v-text-field>
        </template> -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <output-capsule
                title="L<sub>d</sub>"
                :value="design.Ld"
                :decimal=0
                unit="in"
            ></output-capsule>
            <output-capsule
                title="L<sub>dh</sub>"
                :value="design.Ldh"
                :decimal=0
                unit="in"
            ></output-capsule>
            <output-capsule
                title="L<sub>dc</sub>"
                :value="design.Ldc"
                :decimal=0
                unit="in"
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
import {concrete} from '@/mixins/concreteMixin'
import DevelopmentLength from '@/classes/concrete/clsDevelopmentLength'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, CheckCapsule 
        },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                inputCards :[
                    {xs : 6, md : 3, title : "material"},
                    {xs : 6, md : 3, title : "coating"},
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
                    rebarSize : this.rebarSize, 
                    Fy : this.rebarGrade, 
                    fc : this.fc,
                    location : this.location, 
                    coating : this.coating,
                    concreteType : this.concreteType,
                    cov : this.cov, 
                    rebarSpa : this.rebarSpa, 
                }

                let obj = new DevelopmentLength(objData)

                return{
                    Ld : obj.Ld(),
                    Ldh : obj.Ldh(), 
                    Ldc : obj.Ldc(), 
                }

            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>