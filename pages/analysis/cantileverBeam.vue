<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0 text-xs-center"></v-text-field>
        </template>
        <template v-slot:1>
            <v-text-field label="E (ksi)" v-model.number="E" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="I (in^4)" v-model.number="I" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:2>
            <v-text-field label="w (k/ft)" v-model.number="w" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="P (k)" v-model ="P" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="a (ft)" v-model="a" class="pa-0 ma-0"></v-text-field>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Length" :list="design.lengthParams" :decimal=2 v-if="isDebug"></parameters-list>
            <parameters-list title="Shear" :list="design.shearParams" :decimal=2 v-if="isDebug"></parameters-list>
            <parameters-list title="Flexure" :list="design.flexureParams" :decimal=2 v-if="isDebug"></parameters-list>
            <parameters-list title="Deflection" :list="design.deflectionParams" :decimal=4 v-if="isDebug"></parameters-list>

            <v-btn-toggle v-model="mode" mandatory v-if="!isDebug">
                <v-btn value="Load"><v-icon>L</v-icon></v-btn>
                <v-btn value="Flexure"><v-icon>M</v-icon></v-btn>
                <v-btn value="Shear"><v-icon>V</v-icon></v-btn>
                <v-btn value="Deflection"><v-icon>D</v-icon></v-btn>
            </v-btn-toggle>

            <plot-beam-force 
                :title = mode
                :type = type
                :width = 715
                :height = 300
                :length = "L"
                :plotForce = design.plotForce
                v-if="!isDebug"
            ></plot-beam-force>

        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        
        <template v-slot:warnings>
           
        </template>
    </module-card>
      
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'
import OutputCapsule from '@/components/OutputCapsule.vue'
import ParametersList from '@/components/ParametersList.vue'
import PlotBeamForce from '@/components/PlotBeamForce.vue'

import CantileverBeam from '@/classes/analysis/clsCantileverBeam'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, ParametersList ,
            PlotBeamForce      
        },//COMPONENTS
        mixins : [],
        data(){
            return{
                isDebug : false,
                mode: "Load",
                inputCards :[
                    {xs : 4, md : 4, title : "parameters"},
                    {xs : 4, md : 4, title : "property"},
                    {xs : 4, md : 4, title : "loads"},
                ],
                type : 'Cantilever',
                L : 12,
                E : 29000,
                I : 200,
                w : 1,
                P : [],
                a : []
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
                    L : this.L,
                    E : this.E,
                    I : this.I, 
                    w : this.w, 
                    P : this.P,
                    a : this.a
                }

                let obj = new CantileverBeam(objData)

                let plotForce = []

                switch(this.mode){
                    case "Load":
                        plotForce = obj.plotL()
                        break
                    case "Flexure":
                        plotForce = obj.plotM()
                        break
                    case "Shear":
                        plotForce = obj.plotV()
                        break
                    case "Deflection":
                        plotForce = obj.plotD()
                        break
                }

                return{
                     //DEBUG
                    lengthParams : obj.lengthParams(),
                    shearParams : obj.shearParams(),
                    flexureParams : obj.flexureParams(),
                    deflectionParams : obj.deflectionParams(),
                    //OUTPUT
                    plotForce : plotForce
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>