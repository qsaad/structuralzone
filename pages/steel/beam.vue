<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="P (k)" v-model.number="P" class="pa-0 ma-0 text-xs-center"></v-text-field>
            <v-text-field label="M (k-ft)" v-model.number="M" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="B (ft)" v-model.number="B" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <output-capsule
                title="P/A"
                :value="design.qp"
                :decimal=2
                unit="ksf"
            ></output-capsule>
            <output-capsule
                title="M/S"
                :value="design.qm"
                :decimal=2
                unit="ksf"
            ></output-capsule>
            <output-capsule
                title="q"
                :value="design.q"
                :decimal=2
                unit="ksf"
            ></output-capsule>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
       
        <template v-slot:warnings>
           <check-capsule
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
            ></check-capsule>
        </template>
    </module-card>   
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'
import OutputCapsule from '@/components/OutputCapsule.vue'
import CheckCapsule from '@/components/CheckCapsule.vue'

import BasePressure from '@/classes/analysis/clsBasePressure'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, CheckCapsule    
        },//COMPONENTS
        mixins : [],
        data(){
            return{
                inputCards :[
                    {xs : 4, md : 4, title : "parameters"},
                ],
                P : 20,
                M : 1,
                B : 6,
                L : 6,
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
                    M : this. M,
                    B : this. B,
                    L : this. L
                }
                let obj = new BasePressure(objData)
               
                return {
                    qp : obj.qp(),
                    qm : obj.qm(),
                    q : obj.q(),
                    e : obj.e(),
                    x : obj.x()
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>