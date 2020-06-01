<template>
    <v-btn :color="btnColor" :class="btnTextColor" @click="_toggleState">
        {{ title }}
    </v-btn>
</template>

<script>
    export default {
        props:{
            title:{type:String,default:''},
        },
        data(){
            return{
              state : false,
            }//RETURN
        },//DATA
        created(){
            
        },//CREATED
        mounted(){
            
        },//MOUNTED
        computed:{
            textSize () {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return 'body-2'
                    case 'sm': return 'body-2'
                    case 'md': return 'subheading'
                    case 'lg': return 'title'
                    case 'xl': return 'title'
                }
           },//SYMBOL TEXT SIZE
           
           btnColor(){
                return this.state == true ? "orange" : "teal darken-3"
            },
            btnTextColor(){
                return this.state == true ? "white--text" : "teal--text darken-2"
            },
        },//COMPUTED
        methods:{
            _toggleState(){
                this.state = !this.state
                this.$emit('toggleState',this.state)
            }
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>