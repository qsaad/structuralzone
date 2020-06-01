<template>
    <module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-combobox label="Select Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
        </template>
        <template v-slot:1>
            <v-combobox label="Select Section" :items="items" v-model="species" class="pa-0 ma-0"></v-combobox>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
           <v-container grid-list-md fluid class="pa-0 mt-3">
                    <v-layout row wrap>
                        <v-flex xs12 v-if="speciesList.length < 0">
                            No List Found
                        </v-flex>
                        <v-flex xs6 sm4 md3 v-else v-for="(value, key) in properties" :key="key">
                            <v-card hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs6 class="body-1 font-weight-thin blue--text">{{key}}</v-flex>
                                        <v-flex xs6 class="body-1 font-weight-thin yellow--text">{{value}}</v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
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

import * as SawnSpecies from '@/data/WoodSawnSpecies'
import * as EngineeredSpecies from '@/data/WoodEngineeredSpecies'
import * as GlulamSpecies from '@/data/WoodGlulamSpecies'

import {split,get,find,forEach,map,omit} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard,   
        },//COMPONENTS
        mixins : [],
        data(){
            return{
                inputCards :[
                    {xs : 6, md : 6, title : "type"},
                    {xs : 6, md : 6, title : "species"},
                ],
                typeList : ['Sawn','Glulam','Engineered'],
                type : 'Sawn',
                speciesList:[],
                species :'DFL#2'
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
            forEach(SawnSpecies.List,item =>{
                this.speciesList.push(item)
            }) 
        },//MOUNTED
        computed:{
            items(){
                this.speciesList = []
                switch(this.type){
                    case ('Sawn'):
                        forEach(SawnSpecies.List,item =>this.speciesList.push(item)) 
                        this.species = 'DFL#2'
                        break
                    case ('Glulam'):
                        forEach(GlulamSpecies.List,item =>this.speciesList.push(item)) 
                        this.species = '24F-1.8E'
                        break
                    case ('Engineered'):
                       forEach(EngineeredSpecies.List,item =>this.speciesList.push(item)) 
                       this.species = '2.0E Microllam LVL'
                        break
                }
                return map(this.speciesList, 'species')
            },//DATA
            properties(){
                return omit(find(this.speciesList, {'species': this.species}),['species','name'])
            },//PROPERTIES
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>