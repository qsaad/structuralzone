<template>
    <v-container grid-list-md text-xs-center class="pt-2 px-0 pb-0 ma-0">
       <v-layout row wrap justify-center>
            <v-flex xs12 md8>
                <v-toolbar dark color="teal">
                    <v-toolbar-title class="white--text ma-0 pa-0">{{capitalizeTitle(title)}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <debug-button @toggleState="$parent.isDebug = $event"></debug-button>
                    <v-btn icon>
                    <v-icon>print</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-container fluid grid-list-md class="pa-0 ma-0">
                   <v-layout row wrap justify-center>
                        <v-flex v-bind="{[`xs${item.xs} md${item.md}`]: true}" shrink v-for="(item,i) in inputCards" :key="i">
                             <v-card hover height="100%" class="mr-1 mt-2 pb-2">
                                <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 teal--text font-weight-bold">{{capitalizeTitle(item.title)}}</v-card-title>
                                <v-card-text class="text-xs-center pa-3">
                                    <slot :name="i"></slot>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex  grow>
                            <v-card hover height="100%" class="ml-1 mt-2">
                                <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 teal--text font-weight-bold">RESULTS</v-card-title>
                                <v-card-text class="text-xs-center pa-3">
                                    <v-layout row wrap justify-center align-top fill-height>
                                        <slot name="buttons"></slot>
                                    </v-layout>
                                    <v-container grid-list-md fluid class="pa-0 ma-0">
                                        <v-layout row wrap justify-center align-top fill-height>
                                            <slot></slot>
                                        </v-layout>
                                        <v-layout row wrap justify-center align-center>
                                            <slot name="calculations"></slot>
                                        </v-layout>
                                            
                                            <slot name="warnings"></slot>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                   </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import DebugButton from '@/components/DebugButton.vue'

export default {
    name:'ModuleCard',
    components:{
        DebugButton
    },//COMPONENTS
    props:{
        title:{type:String,default:''},
        inputCards:{type:Array,default:[]},
    },
    mixins : [],
    data(){
        return{
        }
    },
    computed:{
       
    },
    methods:{
        capitalizeTitle(title){
            return title.toUpperCase()
        }
    }
}
</script>

<style>

</style>
