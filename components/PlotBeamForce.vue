<template>
    <v-layout column wrap justify-center align-center class="pa-0 my-2">
        <v-flex>
            <v-card dark tile>
                <!-- <v-card-title v-html="title" class="display-1 yellow--text ma-0 px-2 py-0"></v-card-title> -->
               {{SupportCoord}}
               
                <v-card-text class="pa-0 ma-0 ">
                    <svg 
                        id="graph" :width="width" :height="height" 
                        version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    >
                        <!-- POINT LOAD SYMBOL -->
                        <symbol id="pointload">
                            <!-- <line x1="0" y1="0" x2="0" y2="20" stroke="#529fca" /> -->
                            <path d="L0 -10 M0 0 L-5 -5 M0 0 L5 5" fill="#59fa81" stroke="#d85b49" stroke-width="1" />
                        </symbol>

                        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                        <!-- CANVAS -->
                        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                        <g>
                            <!-- BORDER -->
                            <rect x="0" y="0" :width="width" :height="height" :fill="canvasColor" />
                             <!-- TICK LINE -->
                            <!-- <line :x1="item.x" :y1="height/2 + 10" :x2="item.x" :y2="height/2" v-for="(item,i) in computedTickData" :key="i"  stroke="#FFF888" stroke-width="1"/> -->
                            <!-- BASE LINE -->
                            
                        </g>
                        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                        <!-- LOADS -->
                        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                        <g v-if="title == 'Load' && computedPointLoadData.length > 0">
                            <path :d="arrow(item.x, height/2-2.2*offset)" v-for="item in computedPointLoadData" :key="item.y" :fill="loadColor" :stroke="loadColor" stroke-width="2"/>
                            <text :x="item.x+10"  :y="height/2-3*offset" v-for="item in computedPointLoadData" :key="item.y" font-size="20px" :fill="loadColor">
                                    {{item.y}} k
                            </text>
                        </g>
                        <g>
                            <template v-if="title == 'Load'">   
                                <line x1="30" :y1="height/2" :x2="width-30" :y2="height/2" :stroke="memberColor" stroke-width="8"/>
                                <!-- POINT LOAD -->
                                <!-- <use xlink:href="#pointload" :x="item.x" y="height/2-1.2*offset" v-for="item in computedPointLoadData" :key="item.x"/> -->
                                
                                <!-- <path :d="arrow(item.x, height/2-2.2*offset)" v-for="item in computedPointLoadData" :key="item.y" :fill="loadColor" :stroke="loadColor" stroke-width="2"/>
                                <text :x="item.x+10"  :y="height/2-3*offset" v-for="item in computedPointLoadData" :key="item.y" font-size="20px" :fill="loadColor">
                                    {{item.y}} k
                                </text> -->
                                <!-- UNIFORM LOAD -->
                                <rect :x="offset" :y="height/2-0.75*offset" :width="width-2*offset" :height="10" :fill="loadColor" :stroke="loadColor" stroke-width="1" />
                                
                                 <!-- LEFT SUPPORT -->
                                <circle :cx="XO" :cy="height/2+10" :r="10" :fill="memberColor" :stroke="memberColor" stroke-width="1" />
                                <!-- RIGHT SUPPORT -->
                                <circle :cx="XE" :cy="height/2+10" :r="10" :fill="memberColor" :stroke="memberColor" stroke-width="1" />
                            </template>
                        </g>

                        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                        <!-- CAPACITY -->
                        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                        <g>
                            <template v-if="title != 'Load'">
                                <polyline :points="capacityDataPoints"  fill="none" :stroke="capacityColor" stroke-dasharray="10,10" stroke-width="2" v-if="title =='Deflection'"/> 
                                <polyline :points="capacityDataPoints"  :fill="capacityColor" :stroke="capacityColor" stroke-width="2" v-else/> 
                            </template>
                        </g>
                       
                        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                        <!-- FORCES -->
                        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                        <g>
                            <template v-if="title != 'Load'">
                                <line x1="30" :y1="height/2" :x2="width-30" :y2="height/2" :stroke="memberColor" stroke-width="1"/>
                                <!-- FORCE VALUES -->
                                <text :x="item.x" :y="item.y" v-for="item in computedTextData" :key="item.value" font-size="20px" fill="red" v-show="title != 'Load'">
                                    {{ item.value }} {{ item.unit}}
                                </text>
                                <!-- FORCE PLOT -->
                                <polyline :points="forceDataPoints"  fill="none" :stroke="forceColor" stroke-dasharray="10,10" stroke-width="2" v-if="title =='Deflection'" />
                                <polyline :points="forceDataPoints"  :fill="forceColor" :stroke="forceColor" stroke-width="2" v-else />
                            </template>
                        </g>
                        
                   </svg>
                </v-card-text>
            </v-card>
        </v-flex>       
    </v-layout>
</template>

<script>
import {map, first, last, maxBy, toNumber, filter, compact} from 'lodash'
import {colors} from '@/mixins/colorsMixin'

    export default {
        props:{
            title:{type:String,default:"Flexure"},
            type:{type:String,default:"Simple"},
            width:{type:Number,default:500},
            height:{type:Number,default:300},
            length:{type:Number,default:12},
            leftCantilever :{type:Number,default:0},
            rightCantilever :{type:Number,default:0},
            plotForce:{type:Array,default:[]},
            plotCapacity:{type:Array,default:[]},
        },
        mixins : [colors],
        data(){
            return{
                offset : 30,
                XO : 0,
                YO : 0,
                XE : 0,
                YE : 0,
                XL : 0,
                XR : 0,
                LS : 0,
                RS : 0,
            }//RETURN
        },//DATA
        created(){
            
        },//CREATED
        mounted(){
            this.XO = this.offset
            this.YO = this.height/2
            this.XE = this.width - this.offset
            this.YE = this.height/2

            this.Xcoords()

        },//MOUNTED
        computed:{
            SupportCoord(){
                switch(this.type){
                    case "Simple" || "Propped" || "Fixed" || "Cantilever": 
                        return {
                            x : this.offset,
                            y : this.width - this.offset
                        }
                        break
                    case "SingleOverhang": 
                       return {
                            x : this.offset,
                            y : this.width - this.offset - this.rightCantilever * this.XF()
                        }
                        break
                    case "DoubleOverhang": 
                        return {
                            x : this.offset + this.leftCantilever * this.XF(),
                            y : this.width - this.offset - this.rightCantilever * this.XF()
                        }
                        break
                }
            },
            
            computedPointLoadData(){
                if(this.plotForce.length > 0){
                    let coords = map(this.plotForce, item =>{
                        return {
                            x : toNumber((item.x* this.XF() + this.XO).toFixed(0)),
                            y : item.y
                        }
                    })
                    return coords
                }
                else{
                    return null
                }
                
            },
           
            computedTextData(){
                let unit = ''
                let decimal = 2
                let VL,XL,YL = 0
                let VM,XM,YM = 0
                let VR,XR,YR = 0
                let VCL,XCL,YCL = 0
                let VCR,XCR,YCR = 0

                switch(this.type){
                    case "Single Overhang":
                        VCL = 0
                        XCL = 0
                        YCL = 0

                        VL = toNumber(first(this.plotForce).y)
                        XL = this.offset
                        YL = toNumber(VL) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset
                        

                        VM = this.title == "Shear" ? 0 : toNumber(Math.max(...map(this.plotForce, item => item.y)))
                        XM = this.width/2 - this.offset
                        YM = toNumber(VM) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset
                        
                    
                        VR = toNumber(find(this.plotForce, item => item.x == this.length).y)
                        XR = 500
                        YR = toNumber(VR) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset

                        VCR = toNumber(last(this.plotForce).y)
                        XCR = this.width - 3*this.offset
                        YCR = toNumber(VCR) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset
                        break
                    case "Double Overhang":
                        VCL = toNumber(first(this.plotForce).y)
                        XCL = this.offset
                        YCL = toNumber(VCL) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset

                        VL = toNumber(find(this.plotForce, item => item.x == this.leftCantilever).y)
                        XL = 200
                        YL = toNumber(VL) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset
                        

                        VM = this.title == "Shear" ? 0 : toNumber(Math.max(...map(this.plotForce, item => item.y)))
                        XM = this.width/2 - this.offset
                        YM = toNumber(VM) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset
                        
                    
                        VR = toNumber(find(this.plotForce, item => item.x == this.leftCantilever + this.length).y)
                        XR = 500
                        YR = toNumber(VR) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset

                        VCR = toNumber(last(this.plotForce).y)
                        XCR = this.width - 3*this.offset
                        YCR = toNumber(VCR) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset

                        break
                    default:
                        VCL = 0
                        XCL = 0
                        YCL = 0

                        VL = toNumber(first(this.plotForce).y)
                        XL = this.offset
                        YL = toNumber(VL) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset
                        

                        VM = this.title == "Shear" || this.type == "Cantilever" ? 0 : toNumber(Math.max(...map(this.plotForce, item => item.y)))
                        XM = this.width/2 - this.offset
                        YM = toNumber(VM) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset
                        
                    
                        VR = toNumber(last(this.plotForce).y)
                        XR = this.width - 3*this.offset
                        YR = toNumber(VR) > 0 ? this.height/2 - this.offset : this.height/2 + this.offset

                        VCR = 0
                        XCR = 0
                        YCR = 0
                        break

                }
               
                switch(this.title){
                    case "Flexure": 
                        unit = 'k-ft'
                        decimal = 2
                        break
                    case "Shear": 
                        unit = 'k'
                        decimal = 2
                        break
                    case "Deflection": 
                        unit = 'in'
                        decimal = 4
                        break
                }

                let arr =  [
                    {x : XCL, y : YCL, value : VCL.toFixed(decimal), unit : unit},
                    {x : XL, y : YL, value : VL.toFixed(decimal), unit : unit},
                    {x : XM, y : YM, value : VM.toFixed(decimal), unit : unit},
                    {x : XR, y : YR, value : VR.toFixed(decimal), unit : unit},
                    {x : XCR, y : YCR, value : VCR.toFixed(decimal), unit : unit},
                ]

                return filter(arr, item => toNumber(item.value) != 0)
            },//TEXT DATA
            forceDataPoints(){
                let path = []
              
                if(this.type != "Cantilever"){
                    path.push(`${this.XO} ${this.YO}`)
                }

                path.push(map(this.plotForce, item =>{
                        return (item.x* this.XF() + this.XO) + ' ' + (item.y*this.YF() + this.YO)
                }))

                if(this.title != "Deflection"){
                    path.push(`${this.XE} ${this.YE}`)
                    path.push(`${this.XO} ${this.YO}`)
                }
                
                return path
          },//FORCE DATA

          capacityDataPoints(){
                let path = []
               
                if(this.type != "Cantilever"){
                    path.push(`${this.XO} ${this.YO}`)
                }

                path.push(map(this.plotCapacity, item =>{
                        return (item.x* this.XF() + this.XO) + ' ' + (item.y*this.YF() + this.YO)
                }))

                if(this.title != "Deflection"){
                    path.push(`${this.XE} ${this.YE}`)
                    path.push(`${this.XO} ${this.YO}`)
                }
                
                return path
          },//FORCE DATA


        },//COMPUTED
        methods:{
            //PLOT ARROW FOR POINT LOAD
            arrow(x,y){
               return `M${x} ${y} l0 -30 M${x} ${y} l-5 -5 M${x} ${y} l5 -5`
            },
            XF(){
                return (this.width-2*this.offset)/(this.leftCantilever + this.length + this.rightCantilever)
            },
            YF(){
                switch(this.title){
                    case "Flexure": return  0.5
                    case "Shear": return 2
                    case "Deflection": return 50
                }
            },
            
            Xcoords(){
                switch(this.type){
                    case "Simple" || "Propped" || "Fixed" || "Cantilever": 
                        this.XO = this.offset
                        this.YO = this.height/2
                        this.XE = this.width - this.offset
                        this.YE = this.height/2
                        this.XL = 0
                        this.XR = 0
                        break
                    case "SingleOverhang": 
                        this.XO = this.offset
                        this.YO = this.height/2
                        this.XE = this.width - this.offset
                        this.YE = this.height/2
                        this.XL = this.offset + this.leftCantilever * this.XF()
                        this.XR = 0
                        break
                    case "DoubleOverhang": 
                        this.YO = this.height/2
                        this.XE = this.width - this.offset
                        this.YE = this.height/2
                        this.XL = this.offset + this.leftCantilever * this.XF()
                        this.XR = this.offset + (this.leftCantilever + this.length) * this.XF()

                        break
                }
            },
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>