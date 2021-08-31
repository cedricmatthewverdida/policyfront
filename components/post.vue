<template>
  
  <v-data-table
    :loading="load"
    :headers="headers"
    :items="policies"
    :search="search"
    class="elevation-2 pa-5 modifiedCard"
  >

  <template v-if="policies.length != 0 && categories.length != 0" v-slot:item.category="{ item }">
    {{ load_post_category(item.category) }}
  </template>


    <template v-slot:top>
      <v-toolbar
        flat
      >


      <v-row no-gutters class="mb-7">
      <v-col
       cols="6"
        md="4"

      >
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :disabled="policies.length == 0"
              depressed
              rounded
              class="primary mb-2"
              v-bind="attrs"
              v-on="on"
              style="text-transform:none;"
            >
              <v-icon small class="mr-2">
                  mdi-pen
              </v-icon> Create Post
            </v-btn>

          </template>
          <v-card shaped>
            <v-card-title>
              <span class="overline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>

                    <v-select
                      v-model="editedItem.category"
                      :items="categories"
                      item-value="id"
                      item-text="name"
                      filled
                      rounded
                      label="Category"
                      hide-details
                      class="mb-3"
                    ></v-select>

                    <v-text-field
                      filled
                      rounded
                      v-model="editedItem.title"
                      label="Policy Title"
                      hide-details
                      class="mb-3"
                    ></v-text-field>

                    <v-textarea
                    filled
                    rounded
                    label="Policy Body"
                    v-model="editedItem.body"
                    placeholder="[Check for tutorial](Check https://www.markdowntutorial.com/)"
                    ></v-textarea>
                    

                    <span v-html="marked"></span>
                    
                    
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
                :disabled="!required_field"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
      <v-col

         cols="12"
        sm="6"
        md="8"
      >
        <v-text-field
          filled
          rounded
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
        


        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="overline justify-center">Are you sure you want to delete this</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>

  </v-data-table>

</template>


<script>
  import markdown from 'marked';
  import _ from 'lodash'
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      load:false,
      search: '',
      headers: [
        {
          text: 'Category',
          align: 'start',
          value: 'category',
        },
        { text: 'Policy Title', value: 'title' },
        { text: 'Actions', value: 'actions'},
      ],
      
      policies: [],
      categories: [],
      editedIndex: -1,
      editedItem: {
        category: '',
        title: '',
        body: '',
      },
      defaultItem: {
        category: '',
        title: '',
        body: '',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Register' : 'Update'
      },


      required_field : function (){
        if(this.editedItem.category != '' && this.editedItem.title != '' && this.editedItem.body != ''){
          return true
        }
        return false;
      },

      marked : function () {
            return markdown(this.editedItem.body)
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      }
    },

    methods: {

    
      async load_policies () {
          this.load = true;
          const send = await this.$axios.get('/backend/post');
          if(send.status == 200){
            const respond = await send.data
            this.policies = respond.data
            this.load = false;
            this.load_categories();
          }else{
            alert("Failed Loading Please Reload");
          }
      },

      async load_categories () {
          const send = await this.$axios.get('/backend/category');
          const respond = await send.data
          this.categories = respond.data
      },

      load_post_category : function (id) {
        const category =  _.find(this.categories, { 'id': id});
        return category.name
      },

      editItem (item) {
        this.editedIndex = this.policies.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = _.findIndex(this.policies, item);
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        if(this.delete_data()){
        this.policies.splice(this.editedIndex, 1)
        this.closeDelete()
        }else{
          alert("Failed to Delete")
        }
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          if(this.update_data()) {
            Object.assign(this.policies[this.editedIndex], this.editedItem)
          }else{
            alert('Failed to Update')
          }
        } else {
          if(this.save_data()){
          this.policies.push(this.editedItem)
          }else{
            alert("Failed to Create")
          }
        }
        this.close()
      },

      async save_data (){
        const send =  await this.$axios.post('/backend/post', {
            category: this.editedItem.category,
            title: this.editedItem.title,
            body: this.editedItem.body,
        })
        const response = await send.data.success
        console.log(response)
        return response
      },

      async update_data (){
        const send =  await this.$axios.patch('/backend/post/'+`${this.editedItem.id}`+'', {
            category: this.editedItem.category,
            title: this.editedItem.title,
            body: this.editedItem.body,
        })
        const response = await send.data.success
        return response
      },

      async delete_data (){
        const send =  await this.$axios.delete('/backend/post/'+`${this.editedItem.id}`)
        const response = await send.data.success
        return response
      }
    },

    created(){
        this.load_policies();
    }
  }
</script>

<style>

  .modifiedCard{
    border-radius: 20px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  .v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
  }

</style>