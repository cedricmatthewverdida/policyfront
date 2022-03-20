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
      <v-card-actions>
        <v-btn style="text-transform: none;" text @click="opencomment(post)">
            <v-icon class="mr-2">
              mdi-comment-outline
            </v-icon>
            Comment
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="opendialog"
      >
        <v-card>
          <v-card-title>
            {{post.title}}
          </v-card-title>
          <v-card-subtitle>
            {{commentsObj.length}} Comments
          </v-card-subtitle>
          <v-card-text>

            <v-text-field
            v-model="comment"
            label="Add Comment"
            filled
            rounded
            v-on:keyup.enter="createComment()"
            />


            <div v-for="(item,key) in commentsObj" :key="key">
              <v-card outlined class="card my-2">
                <v-card-title>
                  {{item.name}}
                </v-card-title>
                <v-card-text class="pa-5">
                  {{item.body}}
                </v-card-text>
              </v-card>
            </div>

          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="opendialog = false"
            >Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>


  </div>


</template>

<script>
  import _ from 'lodash'
  import markdown from 'marked';
  export default {
    data: () => ({
      categories: [],
      policies: [],
      loaded: [],
      opendialog: false,
      post: [],
      comment: '',
      commentsObj: []
    }),

    methods:{

      async createComment () {
        const send = await this.$axios.post('/backend/comment',{
          postid: this.post.id,
          name: this.$auth.user.email,
          body: this.comment
        });

        if(send.status == 200){
          this.commentsObj.unshift({
            postid: this.post.id,
            name: this.$auth.user.email,
            body: this.comment
          })
        }else{
          alert("Failed to comment");
        }
      },

      async viewComment (id){
        const comments = await this.$axios.get('/backend/comment/'+ id);
        if(comments.status == 200){
          const response = await comments.data;
          this.commentsObj = response.data
        }
      },

      opencomment : function (obj){
        this.opendialog = true;
        this.post = obj;
        this.viewComment(obj.id)
      },

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
        const post =  this.policies.filter(key => key.category == id);
        this.loaded = post;
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
<style scoped>
.card {
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    background-color: rgba(255, 255, 255, 0.75);
    border-radius: 12px;
    border: 1px solid rgba(209, 213, 219, 0.3);
}
</style>