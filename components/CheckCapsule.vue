<template>
    <v-card dark tile hover color="green darken-4 mx-1">
        <v-card-text :class="textSize" class="px-0 ma-0 py-1">
            <span v-html="title"></span>
            <span> : </span>
            <span>{{actual.toFixed(decimal)}}</span>
            <span v-if="actual <= allowable"> &lt; </span>
            <span v-else> &gt; </span>
            <span>{{allowable.toFixed(decimal)}}</span>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        props:{
            title:{type:String,default:''},
            actual:{type:Number,default:0},
            allowable:{type:Number,default:0},
            decimal:{type:Number,default:0},
            unit:{type:String,default:''},
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
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>