<template>
  <v-app light>
    <v-navigation-drawer :mini-variant.sync="miniVariant" :clipped="clipped" v-model="drawer" fixed app>
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-text-field v-model="search" solo clearable prepend-inner-icon="search">
            </v-text-field>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile router :to="item.link" :key="i" v-for="(item, i) in filteredItems" exact>
          <v-list-tile-action>
            <v-img :src="item.image" max-width=20></v-img>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-btn icon  @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn> -->
       
      <v-btn icon to="/">
        <v-img src="/logo.svg" max-width="20"></v-img>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container grid-list-md fluid>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>

import {PagesList} from '@/data/pages' 

  export default {
  
    data () {
      return {
        clipped: false,
        drawer: true,
        search : '',
        fixed : true,
        miniVariant: false,
        title: 'StructuralZone',
      }
    },//DATA

    computed:{
      fullPagesList(){
        return PagesList
      },
      filteredItems(){
        let items = PagesList
        if(this.search != '' && this.search != null){
          return items.filter((item)  => {
            return item.title.toLowerCase().includes(this.search.toLowerCase()) 
          })
        }
        else{
          return items
        }
       
      }//FILTERED ITEMS
    },//COMPUTED

    methods:{

    }//METHODS
  }//EXPORT DEFAULT
</script>
