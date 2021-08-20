<template>


  <div>
    <v-card
    class="pa-2"
    outlined
    style="
    backdrop-filter: blur(21px) saturate(180%);
    -webkit-backdrop-filter: blur(21px) saturate(180%);
    background-color: rgba(255, 255, 255, 1);
    border-radius: 12px;
    border: 1px solid rgba(209, 213, 219, 0.3);
    "
    >
      <v-tabs
      grow
      show-arrows
      >
        <v-tab style="text-transform:none;" @click="loadall()">All</v-tab>
        <v-tab class="caption" style="text-transform:none;" v-for="(cat,key) in categories" :key="key" @click="load_post(cat.id)">{{cat.name}}</v-tab>
      </v-tabs>
    </v-card>

    <v-card
    class="mt-3"
    v-for="(post,key) in loaded" :key="key"
    style="
    backdrop-filter: blur(21px) saturate(180%);
    -webkit-backdrop-filter: blur(21px) saturate(180%);
    background-color: rgba(255, 255, 255, 1);
    border-radius: 12px;
    border: 1px solid rgba(209, 213, 219, 0.3);
    "
    outlined
    >
      <v-card-title class="overline">
        {{post.title}}
      </v-card-title>

      <v-card-text class="pa-5" v-html="marked(post.body)"/>
    </v-card>


  </div>


</template>

<script>
  import _ from 'lodash'
  import markdown from 'marked';
  export default {
    data: () => ({
      categories: [],
      policies: [],
      loaded: []
    }),

    methods:{

      async init_policies(){
        const call = await this.$axios.get('/backend/post')
        const respond = await call.data
        this.policies = respond.data;
        this.loaded = respond.data
      },

      marked : function (string) {
        return markdown(string)
      },

      async init_categories(){
        const call = await this.$axios.get('/backend/category')
        const respond = await call.data
        this.categories = respond.data;
      },

      load_post : function (id) {
        const post =  this.policies.filter(key => key.category == id)
       
        this.loaded = post
      },

      loadall : function (){ 
        this.loaded = this.policies
      }

      
    },
    created(){
      if(!this.$auth.loggedIn){
        this.$router.push('/login')
      }else{
        this.init_policies()
        this.init_categories()
      }
    }
    
  }
</script>
