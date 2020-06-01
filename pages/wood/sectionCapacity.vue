<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-combobox label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Grade" :items="gradeList" v-model="grade" v-if="type == 'Glulam'" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Species" :items="speciesItems" v-model="species" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Grade" :items="categoryList" v-model="category" v-if="type == 'Glulam'" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:1>
            <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Moisture" :items="moistureList" v-model="moisture" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Temperature" :items="temperatureList" v-model="temperature" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Duration" :items="durationList" v-model="duration" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:2>
            <v-text-field label="L (ft)" v-model="L" v-if="type == 'Glulam'" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Lu (ft)" v-model.number="Lu" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Lx (ft)" v-model="Lx" class="pa-0 ma-0"></v-text-field>
            <v-text-field label="Ly (ft)" v-model="Ly" class="pa-0 ma-0"></v-text-field>
        </template>
        <template v-slot:3>
            <v-text-field label="Spacing (in)" v-model="spacing" class="pa-0 ma-0"></v-text-field> 
            <v-text-field label="Bearing (in)" v-model="bearing" class="pa-0 ma-0"></v-text-field> 
            <v-combobox label="Incision" :items="incisionList" v-model="incision" class="pa-0 ma-0"></v-combobox>
            <v-combobox label="Flatwise" :items="flatList" v-model="flat" class="pa-0 ma-0"></v-combobox>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <!-- <parameters-table title="Factor" :list="design.adjustmentFactors" v-if="isDebug"></parameters-table> -->
            <parameters-list title="Flexure" :list="design.flexureParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Axial" :list="design.axialParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Shear" :list="design.shearParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Bearing" :list="design.bearingParams" v-if="isDebug"></parameters-list>
            <parameters-list title="Tension" :list="design.tensionParams" v-if="isDebug"></parameters-list>
            <output-capsule
                title="&phi;M<sub>nx</sub>"
                :value="design.fMnx"
                :decimal=0
                unit="k-ft"
                v-if="!isDebug"
            ></output-capsule>

            <output-capsule
                title="&phi;M<sub>ny</sub>"
                :value="design.fMny"
                :decimal=0
                unit="k-ft"
                v-if="!isDebug"
            ></output-capsule>

            <output-capsule
                title="&phi;P<sub>n</sub>"
                :value="design.fPn"
                :decimal=0
                unit="k"
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
    import ParametersTable from '@/components/ParametersTable.vue'

    import * as SawnSpecies from '@/data/WoodSawnSpecies'
    import * as EngineeredSpecies from '@/data/WoodEngineeredSpecies'
    import * as GlulamSpecies from '@/data/WoodGlulamSpecies'
    import * as GlulamHardwoodSpecies from '@/data/WoodGlulamHardwoodSpecies'

    import * as SawnSize from '@/data/WoodSawnSize' 
    import * as EngineeredSize from '@/data/WoodEngineeredSize'
    import * as GlulamSouthernSize from '@/data/WoodGlulamSouthernSize'
    import * as GlulamWesternSize from '@/data/WoodGlulamWesternSize'

    import SawnLumber from '@/classes/wood/clsSawnLumber'
    import Glulam from '@/classes/wood/clsGlulam'
    import Engineered from '@/classes/wood/clsEngineered'

    import {split,get,find,forEach,map,omit} from 'lodash'

    import {wood} from '@/mixins/woodMixin'
    import {deciToPercent} from '@/library/mathLib'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule, CheckCapsule, ParametersList, ParametersTable    
        },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                isDebug : false,
                inputCards :[
                    {xs : 3, md : 3, title : "section"},
                    {xs : 3, md : 3, title : "loads"},
                    {xs : 3, md : 3, title : "lengths"},
                    {xs : 3, md : 3, title : "parameters"},
                ],
                gradeList : ['Hardwood','Softwood'],
                grade : 'Softwood',
                categoryList : ['Western','Southern'],
                category : 'Western',
                typeList : ['Sawn','Glulam','Engineered'],
                type : 'Sawn',
                speciesList:[],
                species :'DFL#2',
                sizeList:[],
                size :'2x4',
                noPlyList : [1,2,3,4,5,6],
                noPly : 1,
                spacing : 24,
                bearing : 3.5,
                incisionList : ['Yes','No'],
                incision : 'No',
                flatList : ['Yes','No'],
                flat : 'No',
                L : 12,
                Lu : 12,
                Lx : 12,
                Ly : 12,
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
            forEach(SawnSize.List,item =>{
                this.sizeList.push(item)
            }) 
            forEach(SawnSpecies.List,item =>{
                this.speciesList.push(item)
            }) 
        },//MOUNTED
        computed:{
            speciesItems(){
                this.speciesList = []
                switch(this.type){
                    case ('Sawn'):
                        forEach(SawnSpecies.List,item =>this.speciesList.push(item)) 
                        this.species = 'DFL#2'
                        break
                    case ('Glulam'):
                        forEach(GlulamSpecies.List,item =>this.speciesList.push(item)) 
                        this.species = '24F-1.8E'
                        this.grade = 'Softwood'
                        this.category = 'Western'
                        break
                    case ('Engineered'):
                       forEach(EngineeredSpecies.List,item =>this.speciesList.push(item)) 
                       this.species = '2.0E Microllam LVL'
                        break
                }
                return map(this.speciesList, 'species')
            },//ITEMS
            sizeItems(){
                this.sizeList = []
                switch(this.type){
                    case ('Sawn'):
                        forEach(SawnSize.List,item =>this.sizeList.push(item)) 
                        this.size = '2x4'
                        break
                    case ('Glulam'):
                        if(this.category == 'Western'){
                            forEach(GlulamWesternSize.List,item =>this.sizeList.push(item)) 
                            this.size = '5-1/8 x 18'
                            break
                        }
                        else{
                            forEach(GlulamSouthernSize.List,item =>this.sizeList.push(item)) 
                            this.size = '5-1/8 x 16-1/2'
                            break
                        }
                    case ('Engineered'):
                       forEach(EngineeredSize.List,item =>this.sizeList.push(item)) 
                       this.size = '1-3/4 x 11-1/4'
                    break
                }
                return map(this.sizeList, 'size')
            },//ITEMS

            sizeProperties(){
                return omit(find(this.sizeList, {'size': this.size}),['size'])
            },

            speciesProperties(){
                return omit(find(this.speciesList, {'species': this.species}),['species'])
            },
          
            design(){

                let objData = {
                    method : this.method,
                    species : this.speciesProperties,
                    size : this.sizeProperties,
                    noPly : this.noPly,
                    grade : this.grade,
                    category : this.category,
                    duration : this.duration,
                    moisture : this.moisture,
                    temperature : this.temperature,
                    spacing : this.spacing,
                    bearing : this.bearing,
                    incision : this.incision == 'Yes' ? true : false,
                    flat : this.flat == 'Yes' ? true : false,
                    L : this.L,
                    Lu : this.Lu,
                    Lx : this.Lx,
                    Ly : this.Ly,
                    radius : this.radius,
                }

                let obj = {}

                switch(this.type){
                    case ('Sawn'):
                        obj = new SawnLumber(objData)
                        break
                    case ('Glulam'):
                        obj = new Glulam(objData)
                        break
                    case ('Engineered'):
                        obj = new Engineered(objData)
                        break
                }//SWITCH

               
                return {
                     //DEBUGGING
                    adjustmentFactors : obj.adjustmentFactors(),
                    flexureParams : obj.flexureParams(),
                    axialParams : obj.axialParams(),
                    shearParams : obj.shearParams(),
                    bearingParams : obj.bearingParams(),
                    tensionParams : obj.tensionParams(),
                    //OUTPUT
                    fMnx : obj.fMnx(),
                    fMny : obj.fMny(),
                    fVnx : obj.fVnx(),
                    fVny : obj.fVny(),
                    fPn : obj.fPn(),
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>