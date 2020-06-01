<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-combobox label="Select Type" :items="TypeList" v-model="Type" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Select Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Fy (ksi)" :items="FyList" v-model="Fy" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:1>
            <v-text-field label="DL (k/ft)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="LL (k/ft)" v-model.number="LL" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="WL (k/ft)" v-model.number="WL" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:2>
            <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
            <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Type" :items="LevelList" v-model="Level" class="pa-0 ma-0"></v-combobox>
            <!-- <v-combobox label="Web" :items="WebList" v-model="Web" v-if="Type == 'WT'"></v-combobox> -->
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <parameters-list title="Mx" :list="design.MxParams" v-if="isDebug"></parameters-list>
            <parameters-list title="My" :list="design.MyParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Dx" :list="design.DxParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Dy" :list="design.DyParams" v-if="isDebug"></parameters-list>

            <output-capsule
                title="M"
                :value="design.M"
                :decimal=0
                unit="&nbsp;"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="V"
                :value="design.V"
                :decimal=0
                unit="&nbsp;"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="&delta;<sub>x</sub>"
                :value="design.Dx"
                :decimal=2
                unit="in"
                v-if="!isDebug"
            ></output-capsule>
            <output-capsule
                title="&delta;<sub>y</sub>"
                :value="design.Dy"
                :decimal=2
                unit="in"
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
    import * as Data_WT from '@/data/Data_WT' 
    import * as Data_HSS from '@/data/Data_HSS'
    import * as Data_C from '@/data/Data_C'
    import * as Data_MC from '@/data/Data_MC'
    import * as Data_Pipe from '@/data/Data_Pipe'
    import * as Data_HSR from '@/data/Data_HSR'
    import * as Data_LLBB from '@/data/Data_LLBB'
    import * as Data_LU from '@/data/Data_LU'

    import SimpleBeam from '@/classes/analysis/clsSimpleBeam'
    import SteelW from '@/classes/steel/clsSteelW'
    //import SteelWT from '@/classes/steel/clsSteelWT'
    import SteelHSS from '@/classes/steel/clsSteelHSS'
    import SteelC from '@/classes/steel/clsSteelC'
    import SteelMC from '@/classes/steel/clsSteelMC'
    import SteelPipe from '@/classes/steel/clsSteelPipe'
    import SteelHSR from '@/classes/steel/clsSteelHSR'
    // import SteelLLBB from '@/classes/steel/clsSteelLLBB'
    // import SteelLU from '@/classes/steel/clsSteelLU'

    import {split,get,find,forEach,map,omit} from 'lodash'

    import {steel} from '@/mixins/steelMixin'
    import {deciToPercent} from '@/library/mathLib'

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
                    {xs : 4, md : 4, title : "section"},
                    {xs : 4, md : 4, title : "loads"},
                    {xs : 4, md : 4, title : "parameters"},
                ],
                //TypeList : ['W','WT','HSS','C','MC','Pipe','HSR','LLBB','LU'],
                TypeList : ['W','HSS','C','MC','Pipe','HSR'],
                Type : 'W',
                ShapeList:[],
                Shape :'W16X26',
                FyList : [36,50],
                Fy : 50,
                LevelList : ['Floor','Roof'],
                Level : 'Floor',
                DL : 1,
                LL : 1,
                WL : 0.15,
                L : 8,
                Cb : 1,
                // E : 29000,
                // Ix : 0,
                // Iy : 0,
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
                switch(this.Type){
                    case ('W'):
                        forEach(Data_W.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 50
                        this.Shape = "W16X26"
                        break
                    // case ('WT'):
                    //     forEach(Data_WT.ShapeList,item =>this.ShapeList.push(item)) 
                    //     this.FyList = [36,50]
                    //     this.Fy = 50
                    //     this.Shape = "WT6X25"
                    //     break
                    case ('HSS'):
                        forEach(Data_HSS.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [46]
                        this.Fy = 46
                        this.Shape = "HSS6X6X3/8"
                        break
                    case ('C'):
                        forEach(Data_C.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = "C10X15.3"
                        break
                    case ('MC'):
                        forEach(Data_MC.ShapeList,item =>this.ShapeList.push(item))
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = "MC6X16.3" 
                        break
                    case ('Pipe'):
                        forEach(Data_Pipe.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [35]
                        this.Fy = 35
                        this.Shape = "PIPE3STD"
                        break
                    case ('HSR'):
                        forEach(Data_HSR.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [42]
                        this.Fy = 42
                        this.Shape = "HSS6X.250"
                        break
                    // case ('LLBB'):
                    //     forEach(Data_LLBB.ShapeList,item =>this.ShapeList.push(item)) 
                    //     this.FyList = [36,50]
                    //     this.Fy = 36
                    //     this.Shape = "2L5X3-1/2X5/16LLBB"
                    //     break
                    // case ('LU'):
                    //     forEach(Data_LU.ShapeList,item =>this.ShapeList.push(item)) 
                    //     this.FyList = [36,50]
                    //     this.Fy = 36
                    //     this.Shape = "L5X3-1/2X5/16"
                    //     break
                }
                return map(this.ShapeList, 'Shape')
            },//ITEMS
            properties(){
                return omit(find(this.ShapeList, {'Shape': this.Shape}),['Shape'])
            },
            design(){
                console.log(this.ShapeList)

                let objData = {
                    method : this.method,
                    section : this.properties,
                    Fy : this.Fy,
                    Lu : this.L,
                    //web : this.web,
                    Cb : this.Cb
                }

                let obj = {}

                let sect = find(this.ShapeList, {'Shape': this.Shape})

                switch(this.Type){
                    case ('W'):
                        obj = new SteelW(objData)
                        break
                    // case ('WT'):
                    //     obj = new SteelWT(objData)
                    //     break
                    case ('HSS'):
                        obj = new SteelHSS(objData)
                        break
                    case ('C'):
                        obj = new SteelC(objData)
                        break
                    case ('MC'):
                        obj = new SteelMC(objData) 
                        break
                    case ('Pipe'):
                        obj = new SteelPipe(objData)
                        break
                    case ('HSR'):
                        obj = new SteelHSR(objData)
                        break
                    // case ('LLBB'):
                    //     obj = new SteelLLBB(objData)
                    //     break
                    // case ('LU'):
                    //     obj = new SteelLU(objData)
                    //     break
                }//SWITCH

                this.DLF = this.method == "ASD" ? 1 : 1.2
                this.LLF = this.method == "ASD" ? 1 : 1.6

                //FACTORED LOADS
                let wxf = this.DLF*this.DL + this.LLF*this.LL
                let wyf = this.LLF*this.WL
                //UNFACTORED LOAD
                let wx = this.DL + this.LL
                let wy = this.WL
                //FORCES 
                let SBXF = new SimpleBeam({L : this.L, I : obj.IX, w : wxf })
                let SBYF = new SimpleBeam({L : this.L, I : obj.IY, w : wyf })
                //DEFLECTION
                let SBX = new SimpleBeam({L : this.L, I : obj.IX, w : wx })
                let SBY = new SimpleBeam({L : this.L, I : obj.IY, w : wy })
               
                return {
                    //DEBUG
                    MxParams : SBXF.flexureParams(),
                    MyParams : SBYF.flexureParams(),
                    DxParams : SBX.deflectionParams(),
                    DyParams : SBY.deflectionParams(),
                    //OUTPUT
                    fMnx : obj.fMnx(),
                    fMny : obj.fMny(),
                    fVnx : obj.fVnx(),
                    fVny : obj.fVny(),
                    Mrx : SBXF.Mmax(),
                    Vrx : SBXF.Vmax(),
                    Dx : SBX.Dmax(),
                    Mry : SBYF.Mmax(),
                    Vry : SBYF.Vmax(),
                    Dy : SBY.Dmax(),
                    M : deciToPercent(SBXF.Mmax()/obj.fMnx() + SBYF.Mmax()/obj.fMny()),
                    V : deciToPercent(SBXF.Vmax()/obj.fVnx() + SBYF.Vmax()/obj.fVny())
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>