<template>
    <v-btn icon :color="btnColor" :class="btnTextColor" @click="_toggleState">
        <v-icon>bug_report</v-icon>
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