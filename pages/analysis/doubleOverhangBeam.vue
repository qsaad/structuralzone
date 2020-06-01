<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="LEFT CANTI (ft)" v-model.number="L1" class="pa-0 ma-0 text-xs-center"></v-text-field>
            <v-text-field label="CENTER (ft)" v-model.number="L2" class="pa-0 ma-0 text-xs-center"></v-text-field>
            <v-text-field label="RIGHT CANTI (ft)" v-model.number="L3" class="pa-0 ma-0 text-xs-center"></v-text-field>
            
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
            <parameters-list title="Length" :list="design.lengthParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Shear" :list="design.shearParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Flexure" :list="design.flexureParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Deflection" :list="design.deflectionParams" v-if="isDebug"></parameters-list>

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
                :leftCantilever = "L1"
                :length = "L2"
                :rightCantilever = "L3"
                :plotForce = design.plotForce
                v-if="!isDebug"
            ></plot-beam-force>

            <!-- <table width="100%" v-if="!isDebug">
                <tr>
                    <th>FORCE</th>
                    <th>LEFT</th>
                    <th>MIDDLE</th>
                    <th>RIGHT</th>
                </tr>
                <tr>
                    <td>R</td>
                    <td>{{design.RL}}</td>
                    <td></td>
                    <td>{{design.RR}}</td>
                </tr>
                <tr>
                    <td>M</td>
                    <td>{{design.MCL}}</td>
                    <td>{{design.M}}</td>
                    <td>{{design.mcr}}</td>
                </tr>
                <tr>
                    <td>D</td>
                    <td>{{design.DCL}}</td>
                    <td>{{design.D}}</td>
                    <td>{{design.DCR}}</td>
                </tr>
            </table> -->

            <!-- <output-capsule
                title="RL"
                :value="design.RL"
                :decimal=2
                unit="k"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="RR"
                :value="design.RR"
                :decimal=2
                unit="k"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="M"
                :value="design.M"
                :decimal=2
                unit="k-ft"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="M<sub>c</sub>"
                :value="design.Mc"
                :decimal=2
                unit="k-ft"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="D"
                :value="design.D"
                :decimal=4
                unit="in"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="D<sub>c</sub>"
                :value="design.Dc"
                :decimal=4
                unit="in"
                v-if="!isDebug"
            ></output-capsule> -->

            <!-- <v-btn-toggle v-model="toggle_one" mandatory v-if="!isDebug">
                <v-btn>
                    <v-icon>M</v-icon>
                </v-btn>

                <v-btn>
                    <v-icon>V</v-icon>
                </v-btn>

                <v-btn>
                    <v-icon>D</v-icon>
                </v-btn>
            </v-btn-toggle>

            <plot-beam-force 
                title = "Flexure"
                type="Double Overhang"
                :width = 715
                :height = 300
                :leftCantilever = "L1"
                :length = "L2"
                :rightCantilever = "L3"
                :plotData = design.plotM
                v-if="toggle_one == 0"
            >
            </plot-beam-force>

            <plot-beam-force 
                title = "Shear"
                type="Double Overhang"
                :width = 715
                :height = 300
                :leftCantilever = "L1"
                :length = "L2"
                :rightCantilever = "L3"
                :plotData = design.plotV
                v-if="toggle_one == 1"
            >
            </plot-beam-force>

            <plot-beam-force 
                title = "Deflection"
                type="Double Overhang"
                :width = 715
                :height = 300
                :leftCantilever = "L1"
                :length = "L2"
                :rightCantilever = "L3"
                :plotData = design.plotD
                v-if="toggle_one == 2"
            >
            </plot-beam-force> -->

            

            
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


import DoubleOverhangBeam from '@/classes/analysis/clsDoubleOverhangBeam'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, ParametersList,
            PlotBeamForce    
        },//COMPONENTS
        mixins : [],
        data(){
            return{
                isDebug : false,
                toggle_one: 0,
                inputCards :[
                    {xs : 4, md : 4, title : "spans"},
                    {xs : 4, md : 4, title : "property"},
                    {xs : 4, md : 4, title : "load"},
                ],
                type : 'Double Overhang',
                L1 : 2,
                L2 : 12,
                L3 : 2,
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
                    L1 : this.L1,
                    L2 : this.L2,
                    L3 : this.L3,
                    E : this.E,
                    I : this.I, 
                    w : this.w, 
                    P : this.P,
                    a : this.a
                }

                let obj = new DoubleOverhangBeam(objData)

                let plotForce = []

                switch(this.mode){
                    case "Load":
                        plotForce = obj.plotL()
                        break
                    case "Flexure":
                        plotForce = obj.plotM()
                        plotCapacity = cap.plotM()
                        break
                    case "Shear":
                        plotForce = obj.plotV()
                        plotCapacity = cap.plotV()
                        break
                    case "Deflection":
                        plotForce = obj.plotD()
                        plotCapacity = cap.plotD()
                        break
                }


                return{
                    //DEBUG
                    lengthParams : obj.lengthParams(),
                    shearParams : obj.shearParams(),
                    flexureParams : obj.flexureParams(),
                    deflectionParams : obj.deflectionParams(),
                    //OUTPUT
                    plotForce : plotForce,
                    // M : obj.Mmax(),
                    // MCL : obj.MCL(),
                    // MCR : obj.MCR(),
                    // RL : obj.RL(),
                    // RR : obj.RR(),
                    // D : obj.Dmax(),
                    // DCL : obj.DCL(),
                    // DCR : obj.DCR(),
                    // plotM : obj.plotM(),
                    // plotV : obj.plotV(),
                    // plotD : obj.plotD(),
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>