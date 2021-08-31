<template>
  
  <v-data-table
    :loading="load"
    :headers="headers"
    :items="categories"
    :search="search"
    class="elevation-2 pa-5 modifiedCard"
  >


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
              depressed
              rounded
              class="primary mb-2"
              v-bind="attrs"
              v-on="on"
              style="text-transform:none;"
              :disabled="categories.length == 0"
            >
              <v-icon small class="mr-2">
                  mdi-pen
              </v-icon> Create Category
            </v-btn>

          </template>
          <v-card shaped>
            <v-card-title>
              <span class="overline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>

                    <v-text-field
                      filled
                      rounded
                      v-model="editedItem.name"
                      label="Category Name"
                      hide-details
                    ></v-text-field>
                    
                    
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
            <v-card-title class="overline justify-center">Are you sure you want to delete</v-card-title>
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
  import _ from 'lodash'
  export default {
    data: () => ({
      load:false,
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: [
        {
          text: 'Category Name',
          align: 'start',
          value: 'name',
        },
        { text: 'Actions', value: 'actions'},
      ],
      categories: [],
      editedIndex: -1,
      editedItem: {
        name: ''
      },
      defaultItem: {
        name: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Register' : 'Update'
      },
      required_field : function (){
        if(this.editedItem.name != '' ){
          return true
        }
        return false;
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

    

      async load_categories () {
          this.load = true;
          const send = await this.$axios.get('/backend/category');
          if(send.status == 200){
            const respond = await send.data
            this.categories = respond.data
            this.load = false;
          }else{
            alert("Failed Loading Please Reload");
          }
      },

      editItem (item) {
        this.editedIndex = this.categories.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = _.findIndex(this.categories, item);
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        if(this.delete_data()){
        this.categories.splice(this.editedIndex, 1)
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
            Object.assign(this.categories[this.editedIndex], this.editedItem)
          }else{
            alert('Failed to Update')
          }
        } else {
          if(this.save_data()){
          this.categories.push(this.editedItem)
          }else{
            alert("Failed to Create")
          }
        }
        this.close()
      },

      async save_data (){
        const send =  await this.$axios.post('/backend/category', {
            name: this.editedItem.name,
        })
        const response = await send.data.success
        console.log(response)
        return response
      },

      async update_data (){
        const send =  await this.$axios.patch('/backend/category/'+`${this.editedItem.id}`+'', {
            name: this.editedItem.name,
        })
        const response = await send.data.success
        return response
      },

      async delete_data (){
        const send =  await this.$axios.delete('/backend/category/'+`${this.editedItem.id}`)
        const response = await send.data.success
        return response
      }
    },

    created(){
        this.load_categories();
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