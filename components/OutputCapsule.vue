<template>
    <v-layout column wrap justify-center align-center class="ma-1">
        <v-flex>
            <v-card dark tile hover color="purple darken-2" min-width="150">
                <v-card-text :class="titleTextSize" class="px-0 ma-0 py-1">
                    <span v-html="title"></span> 
                </v-card-text>
            </v-card>
            <v-card dark tile :color="displayColor" min-width="150">
                <v-card-text :class="valueTextSize" class="px-0 ma-0 py-2 yellow--text" v-if="value > 0 || value != ''">
                    {{displayValue(value)}}
                </v-card-text>
                <v-card-text :class="valueTextSize" class="px-0 ma-0 py-2 yellow--text" v-else>
                    {{displayRatio()}}
                </v-card-text>
            </v-card>
            <v-card dark tile hover color="teal darken-3" min-width="150">
                <v-card-text :class="descriptionTextSize" class="px-0 ma-0 py-1 grey--text text--lighten-1">
                    <span v-html="unit"></span>
                </v-card-text>
            </v-card>
        </v-flex>       
    </v-layout>
</template>

<script>
import {isString} from 'lodash'

    export default {
        props:{
            value:{type:[Number,String],default:0},
            actual:{type:Number,default:0},
            allowable:{type:Number,default:0},
            decimal:{type:Number,default:0},
            title:{type:String,default:''},
            description:{type:String,default:''},
            symbol:{type:String,default:''},
            unit:{type:String,default:''},
            subscript:{type:String,default:''},
            superscript:{type:String,default:''},
        },
        data(){
            return{
              
            }//RETURN
        },//DATA
        created(){
            
        },//CREATED
        mounted(){
            
        },//MOUNTED
        computed:{
            symbolTextSize () {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return 'body-2'
                    case 'sm': return 'body-2'
                    case 'md': return 'subheading'
                    case 'lg': return 'title'
                    case 'xl': return 'title'
                }
           },//SYMBOL TEXT SIZE
            titleTextSize () {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return 'title'
                    case 'sm': return 'title'
                    case 'md': return 'headline'
                    case 'lg': return 'display-1'
                    case 'xl': return 'display-1'
                }
           },//TITLE TEXT SIZE
           valueTextSize () {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return 'title'
                    case 'sm': return 'title'
                    case 'md': return 'headline'
                    case 'lg': return 'display-1'
                    case 'xl': return 'display-1'
                }
           },//TITLE TEXT SIZE
           descriptionTextSize () {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return 'body-1'
                    case 'sm': return 'body-1'
                    case 'md': return 'subheading'
                    case 'lg': return 'title'
                    case 'xl': return 'headline'
                }
           },//TITLE TEXT SIZE
        //    myWidth (arr) {
        //        console.log(this.$vuetify.breakpoint.name)
        //         switch (this.$vuetify.breakpoint.name) {
        //             case 'xs': return arr[0]
        //             case 'sm': return arr[0]
        //             case 'md': return arr[1]
        //             case 'lg': return arr[1]
        //             case 'xl': return arr[1]
        //         }
        //    },//MIN WIDTH

        //    minWidth () {
        //         switch (this.$vuetify.breakpoint.name) {
        //             case 'xs': return '100'
        //             case 'sm': return '100'
        //             case 'md': return '75'
        //             case 'lg': return '100'
        //             case 'xl': return '150'
        //         }
        //    },//MIN WIDTH
        //    maxWidth () {
        //         switch (this.$vuetify.breakpoint.name) {
        //             case 'xs': return '100'
        //             case 'sm': return '100'
        //             case 'md': return '75'
        //             case 'lg': return '100'
        //             case 'xl': return '150'
        //         }
        //    },//MAX WIDTH
           displayColor(){
                return this.actual > this.allowable ? "red darken-4" : "teal darken-4"
            }
        },//COMPUTED
        methods:{
            displayValue(val){
                return isString(val) ? val : val.toFixed(this.decimal)
            },
            displayRatio(){
                return ((this.actual/this.allowable) * 100).toFixed(0) + '%'
            }
            
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>