<template>
<module-card :title="title" :inputCards="inputCards">
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- INPUTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template v-slot:0>
            <v-text-field label="fc (psi)" v-model.number="fc" color="green" class="pa-0 ma-0 text-xs-center"></v-text-field>
        </template>
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <!-- RESULTS -->
        <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
        <template>
            <output-capsule
                title="E<sub>c</sub>"
                :value="design.Ec"
                :decimal=0
                unit="ksi"
            ></output-capsule>
            <output-capsule
                title="F<sub>r</sub>"
                :value="design.Fr"
                :decimal=0
                unit="psi"
            ></output-capsule>
            <output-capsule
                title="G<sub>c</sub>"
                :value="design.Gc"
                :decimal=0
                unit="ksi"
            ></output-capsule>
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
import Concrete from '@/classes/concrete/clsConcrete'

import {split,get,find} from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, OutputCapsule
        },//COMPONENTS
        mixins : [],
        data(){
            return{
                inputCards :[
                    {xs : 4, md : 4, title : "parameters"},
                ],
                fc : 3000,
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
                let obj = new Concrete({fc:this.fc})

                return{
                    Ec : obj.Ec(),
                    Fr : obj.Fr(),
                    Gc : obj.Gc(),
                    n : obj.n(),
                    nu : obj.nu(),
                    wt : 150, 
                }
            }//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>