<template>
    <module-card :title="title" :inputCards="inputCards">
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="Wall Thickness (in)" v-model.number="tw" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Wall Height (ft)" v-model.number="Hs" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Base Thickness (in)" v-model.number="tb" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Toe Length (ft)" v-model.number="Lt" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Heel Length (ft)" v-model.number="Lh" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:1>
            <v-text-field label="Toe Fill (ft)" v-model.number="HTF" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Back Fill (ft)" v-model.number="HBF" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Soil Density (pcf)" v-model.number="rho_s" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Internal Friction Angle" v-model.number="phi_s" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Base Friction" v-model.number="nu_s" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:2>
            <v-text-field label="Surcharge (psf)" v-model.number="SCL" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Lateral Load (k/ft)" v-model.number="PX" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Gravity Load (k/ft)" v-model.number="PY" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Water Table (ft)" v-model.number="WLE" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="SBC (ksf)" v-model.number="SBC" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:3>
            <v-text-field label="fc (psi)" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Stem Rebar" :items="rebarSizeList" v-model="rebarSizeStem" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Heel Rebar" :items="rebarSizeList" v-model="rebarSizeHeel" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Toe Rebar" :items="rebarSizeList" v-model="rebarSizeToe" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Temp Rebar" :items="rebarSizeList" v-model="rebarSizeTemp" class="pa-0 ma-0"></v-combobox>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:buttons>
            <!-- <v-layout row justify-center align-center>
                <toggle-button title="RebarSpacing" @toggleState="isRebarSpacing = $event"></toggle-button>
                <toggle-button title="Shear Check" @toggleState="isShearCheck = $event"></toggle-button>
                <toggle-button title="Development Length" @toggleState="isDevelopmentLength = $event"></toggle-button>
            </v-layout> -->
        </template>
        <template>
            
            <parameters-list title="Active" :list="design.active" v-if="isDebug"></parameters-list>
            <parameters-list title="Surcharge" :list="design.surcharge" v-if="isDebug"></parameters-list>
            <parameters-list title="Water" :list="design.water" v-if="isDebug"></parameters-list>
            <parameters-list title="Lateral" :list="design.lateral" v-if="isDebug"></parameters-list>
            <parameters-list title="Backfill" :list="design.backfill" v-if="isDebug"></parameters-list>
            <parameters-list title="Toefill" :list="design.toefill" v-if="isDebug"></parameters-list>
            <parameters-list title="Passive" :list="design.passive" v-if="isDebug"></parameters-list>
            <parameters-list title="Stem" :list="design.stem" v-if="isDebug"></parameters-list>
            <parameters-list title="Base" :list="design.base" v-if="isDebug"></parameters-list>
            <parameters-list title="Gravity" :list="design.gravity" v-if="isDebug"></parameters-list>
            <parameters-list title="Heel" :list="design.heel" v-if="isDebug"></parameters-list>
            <parameters-list title="Toe" :list="design.toe" v-if="isDebug"></parameters-list>
            <parameters-list title="Stability" :list="design.stability" v-if="isDebug"></parameters-list>
            <parameters-list title="Base Pressure" :list="design.basePressure" v-if="isDebug"></parameters-list>
            <parameters-list title="Design" :list="design.design1" v-if="isDebug"></parameters-list>

            <output-capsule
                title="FSS"
                :value="design.SlidingCheck"
                :decimal=2
                :actual=1.5
                :allowable="design.SlidingCheck"
                unit="Sliding"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="FSO"
                :value="design.OverturningCheck"
                :decimal=2
                :actual=1.5
                :allowable="design.OverturningCheck"
                unit="Overturning"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="q"
                :value="design.BearingCheck"
                :decimal=2
                :actual="design.BearingCheck"
                :allowable="SBC"
                unit="Pressure"
                v-if="!isDebug"
            ></output-capsule>

        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- WARNINGS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:warnings>
          
            <check-capsule
                title="Wall Height"
                :actual="Hs"
                :allowable="HTF + HBF"
                :decimal=2
                v-if="Hs < HTF + HBF"
            ></check-capsule>
          
        </template>
        <template v-slot:calculations>
            <v-tabs grow v-if="!isDebug" hidden-sm-and-down>
                <v-tab ripple class="yellow--text">Overturning</v-tab>
                <v-tab ripple class="yellow--text">Resisting</v-tab>
                <v-tab ripple class="yellow--text">Bearing</v-tab>
                <v-tab ripple class="yellow--text">Design</v-tab>
                <v-tab ripple class="yellow--text">Stem</v-tab>
                <v-tab ripple class="yellow--text">Heel</v-tab>
                <v-tab ripple class="yellow--text">Toe</v-tab>
                    <!-- OVERTURNING MOMENT -->
                    <v-tab-item>
                        <table style="width:100%">
                            <tr>
                                <th class="green--text" style="text-align:left">Name</th>
                                <th class="green--text">F (k)</th>
                                <th class="green--text">y (ft)</th>
                                <th class="green--text">M<sub>o</sub> (k-ft)</th>
                            </tr>
                            <tr v-for="(item,i) in design.overturningParameters" :key="i">
                                <td class="teal--text" style="text-align:left">{{item.name}}</td>
                                <td class="teal--text">{{ (item.F).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.y).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.M).toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td class="blue--text">{{ (design.stability.F).toFixed(2) }}</td>
                                <td></td>
                                <td class="blue--text">{{ (design.stability.OM).toFixed(2) }}</td>
                            </tr>
                        </table>
                    </v-tab-item>
                    <!-- RESISTING MOMENT -->
                    <v-tab-item>
                        <table style="width:100%">
                            <tr>
                                <th class="green--text" style="text-align:left">Name</th>
                                <th class="green--text">W (k)</th>
                                <th class="green--text">x (ft)</th>
                                <th class="green--text">M<sub>r</sub> (k-ft)</th>
                            </tr>
                            <tr v-for="(item,i) in design.resistingParameters" :key="i">
                                <td class="teal--text" style="text-align:left">{{item.name}}</td>
                                <td class="teal--text">{{ (item.W).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.x).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.M).toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td class="blue--text">{{ (design.stability.W).toFixed(2) }}</td>
                                <td></td>
                                <td class="blue--text">{{ (design.stability.RM).toFixed(2) }}</td>
                            </tr>
                        </table>
                    </v-tab-item>
                    <!-- BASE PRESSURE -->
                    <v-tab-item>
                        <table style="width:100%">
                            <tr>
                                <th class="green--text" style="text-align:left">Name</th>
                                <th class="green--text">e (in)</th>
                                <th class="green--text">x<sub>r</sub> (ft)</th>
                                <th class="green--text">L<sub>b</sub> (ft)</th>
                                <th class="green--text">q<sub>max</sub> (ksf)</th>
                                <th class="green--text">q<sub>min</sub> (ksf)</th>
                            </tr>
                            <tr v-for="(item,i) in design.basePressureParameters" :key="i">
                                <td class="teal--text" style="text-align:left">{{item.name}}</td>
                                <td class="teal--text">{{ (item.e).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.xr).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.Lb).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.qmax).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.qmin).toFixed(2) }}</td>
                            </tr>
                        </table>
                    </v-tab-item>
                    <!-- DESIGN CHECKS -->
                    <v-tab-item>
                        <table style="width:100%">
                            <tr>
                                <th class="green--text" style="text-align:left">Name</th>
                                <th class="green--text">M<sub>u</sub> (k-ft)</th>
                                <th class="green--text">V<sub>u</sub> (k)</th>
                                <th class="green--text">&phi;V<sub>n</sub> (k)</th>
                                <th class="green--text">S<sub>b</sub> (in)</th>
                                <th class="green--text">L<sub>d</sub> (in)</th>
                            </tr>
                            <tr v-for="(item,i) in design.designParameters" :key="i">
                                <td class="teal--text" style="text-align:left">{{item.name}}</td>
                                <td class="teal--text">{{ (item.Mu).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.Vu).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.fVn).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.Sb).toFixed(0) }}</td>
                                <td class="teal--text">{{ (item.Ld).toFixed(0) }}</td>
                            </tr>
                        </table>
                    </v-tab-item>
                    <!-- STEM DESIGN -->
                    <v-tab-item>
                        <table style="width:100%">
                            <tr>
                                <th class="green--text" style="text-align:left">Name</th>
                                <th class="green--text">F<sub>u</sub> (k)</th>
                                <th class="green--text">y<sub>u</sub> (ft)</th>
                                <th class="green--text">M<sub>u</sub> (k-ft)</th>
                            </tr>
                            <tr v-for="(item,i) in design.stemParameters" :key="i">
                                <td class="teal--text" style="text-align:left">{{item.name}}</td>
                                <td class="teal--text">{{ (item.Fu).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.yu).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.Mu).toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td class="blue--text">{{ (design.stem.Vu).toFixed(2) }}</td>
                                <td></td>
                                <td class="blue--text">{{ (design.stem.Mu).toFixed(2) }}</td>
                            </tr>
                        </table>
                    </v-tab-item>
                    <!-- HEEL DESIGN -->
                    <v-tab-item>
                        <table style="width:100%">
                            <tr>
                                <th class="green--text" style="text-align:left">Name</th>
                                <th class="green--text">W<sub>u</sub> (k)</th>
                                <th class="green--text">x<sub>u</sub> (ft)</th>
                                <th class="green--text">M<sub>u</sub> (k-ft)</th>
                            </tr>
                            <tr v-for="(item,i) in design.heelParameters" :key="i">
                                <td class="teal--text" style="text-align:left">{{item.name}}</td>
                                <td class="teal--text">{{ (item.Wu).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.xu).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.Mu).toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td class="blue--text">{{ (design.heel.Vu).toFixed(2) }}</td>
                                <td></td>
                                <td class="blue--text">{{ (design.heel.Mu).toFixed(2) }}</td>
                            </tr>
                        </table>
                    </v-tab-item>
                    <!-- TOE DESIGN -->
                    <v-tab-item>
                        <table style="width:100%">
                            <tr>
                                <th class="green--text" style="text-align:left">Name</th>
                                <th class="green--text">W<sub>u</sub> (k)</th>
                                <th class="green--text">x<sub>u</sub> (ft)</th>
                                <th class="green--text">M<sub>u</sub> (k-ft)</th>
                            </tr>
                            <tr v-for="(item,i) in design.toeParameters" :key="i">
                                <td class="teal--text" style="text-align:left">{{item.name}}</td>
                                <td class="teal--text">{{ (item.Wu).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.xu).toFixed(2) }}</td>
                                <td class="teal--text">{{ (item.Mu).toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td class="blue--text">{{ (design.toe.Vu).toFixed(2) }}</td>
                                <td></td>
                                <td class="blue--text">{{ (design.toe.Mu).toFixed(2) }}</td>
                            </tr>
                        </table>
                    </v-tab-item>
            </v-tabs>
           
        </template>
    </module-card>
</template>

<script>
import ModuleCard from '@/components/ModuleCard.vue'
import OutputCapsule from '@/components/OutputCapsule.vue'
import ParametersList from '@/components/ParametersList.vue'
import CheckCapsule from '@/components/CheckCapsule.vue'
import ToggleButton from '@/components/ToggleButton.vue'

import {concrete} from '@/mixins/concreteMixin'
import RetainingWall from '@/classes/foundation/clsRetainingWall'

import {split,get,find} from 'lodash'

import {deciToPercent} from '@/library/mathLib'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard,OutputCapsule, CheckCapsule, ParametersList, ToggleButton
        },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                isDebug:false,
                tw : 14,
                Hs : 14,
                tb : 14,
                Lt : 3,
                Lh : 7,

                rho_s : 120,
                phi_s : 30,
                nu_s : 0.3,
                HBF : 10,
                HTF : 3,
                SBC : 3,

                PX : 0.05,
                PY : 0,
                SCL : 250,
                WLE : 0,

                fc : 3000,
                rebarSizeStem : "#5",
                rebarSizeHeel : "#5",
                rebarSizeToe : "#5",
                rebarSizeTemp : "#5",

                isOverturning : false,
                isResisting : false,
                isBearing : false,
                isDesign : false,
                isShearCheck : false,
                isRebarSpacing : false,
                isDevelopmentLength : false,
               
                inputCards :[
                    {xs : 3, md : 3, title : "wall"},
                    {xs : 3, md : 3, title : "soil"},
                    {xs : 3, md : 3, title : "loads"},
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
                    tw : this.tw,
                    Hs : this.Hs, 
                    HBF : this.HBF, 
                    HTF : this.HTF,
                    Lt : this.Lt,
                    Lh : this.Lh,
                    tb : this.tb,
                    rho_s : this.rho_s,
                    phi_s : this.phi_s,
                    nu_s : this.nu_s,

                    PX : this.PX,
                    PY : this.PY,
                    SCL : this.SCL,
                    WLE : this.WLE,
                    
                    SBC : this.SBC, 
                    fc : this.fc,
                    rebarSizeStem : this.rebarSizeStem,
                    rebarSizeHeel : this.rebarSizeHeel,
                    rebarSizeToe : this.rebarSizeToe,
                    rebarSizeTemp : this.rebarSizeTemp,
                
                }

                let obj = new RetainingWall(objData)

                return{
                    //DEBUGGING PARAMETERS
                    active : obj.active(),
                    surcharge : obj.surcharge(),
                    water : obj.water(),
                    lateral : obj.lateral(),
                    backfill : obj.backfill(),
                    toefill : obj.toefill(),
                    passive : obj.passive(),
                    stem : obj.stem(),
                    base : obj.base(),
                    gravity : obj.gravity(),
                    heel : obj.heel(),
                    toe : obj.toe(),
                    basePressure : obj.basePressure(),
                    stability : obj.stability(),
                    design1 : obj.design(),
                    //OUTPUT
                    SlidingCheck : obj.slidingStability(),
                    OverturningCheck : obj.overturningStability(),
                    BearingCheck : obj.basePressure().qmax,

                    StemRebarSpacing : obj.stem().Sb,
                    HeelRebarSpacing : obj.heel().Sb,
                    ToeRebarSpacing: obj.toe().Sb,
                
                    StemShearCheck : deciToPercent(obj.stem().Vu/obj.stem().fVn),
                    HeelShearCheck : deciToPercent(obj.heel().Vu/obj.heel().fVn),
                    ToeShearCheck : deciToPercent(obj.toe().Vu/obj.toe().fVn),

                    StemRebarLengthCheck : deciToPercent(obj.stem().Ldp),
                    HeelRebarLengthCheck : deciToPercent(obj.heel().Ldp),
                    ToeRebarLengthCheck : deciToPercent(obj.toe().Ldp),
                    
                    overturningParameters : obj.overturningParameters(),
                    resistingParameters : obj.resistingParameters(),
                    basePressureParameters : obj.basePressureParameters(),
                    designParameters : obj.designParameters(),
                    stemParameters : obj.stemParameters(),
                    heelParameters : obj.heelParameters(),
                    toeParameters : obj.toeParameters(),
                }

            }//DESIGN
        },//COMPUTED
        methods:{
            
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>