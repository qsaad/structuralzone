<template>
    <p>
        {{stressPath}}
    <svg id="graph" :width="width" :height="height" 
        version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    >
       <line :x1="X1" :y1="Y1" :x2="X2" :y2="Y2" :stroke="memberColor" stroke-width="2"/> 
       <path :d="stressPath" fill="red" :stroke="memberColor" stroke-width="2"/>               
    </svg>
    </p>
             
</template>

<script>
import {map, first, last, maxBy, toNumber, filter, compact} from 'lodash'
import {colors} from '@/mixins/colorsMixin'

    export default {
        props:{
            title:{type:String,default:"Flexure"},
            width:{type:Number,default:300},
            height:{type:Number,default:300},
            length:{type:Number,default:12},
            orientation:{type:String,default:"Horizontal"},
            q1 :{type:Number,default:0},
            v1:{type:String,default:"1"},
            q2 :{type:Number,default:0},
            v2:{type:String,default:"2"},
        },
        mixins : [colors],
        data(){
            return{
                offset : 20,
                SF : 10
            }//RETURN
        },//DATA
        created(){
            
        },//CREATED
        mounted(){
           
        },//MOUNTED
        computed:{
            X1(){
                return this.orientation == "Horizontal" ? this.offset : this.width/2
            },
            Y1(){
                return this.orientation == "Horizontal" ? this.height/2 : this.height - this.offset
            },
            X2(){
                return this.orientation == "Horizontal" ? this.width - this.offset : this.width/2
            },
            Y2(){
                return this.orientation == "Horizontal" ? this.height/2 : this.offset
            },
            stressPath(){
                return `M${this.X1} ${this.Y1} L${this.X1} ${(this.X1 + this.q1*this.SF).toFixed(0)} L${this.X2} ${(this.Y2 + this.q2*this.SF).toFixed(0)} L${this.X2} ${this.Y2}`
            }
           

        },//COMPUTED
        methods:{
           
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>