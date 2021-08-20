<template>
    <div class="mt-10">
        
        <v-card >
            <v-tabs v-model="active" class="mb-2">
                <v-tab>Policy</v-tab>
                <v-tab>Category</v-tab>
                <v-tab>Accounts</v-tab>
            </v-tabs>
        </v-card>
        
        <Table v-if="active == 0"/>
        <Categorie v-if="active == 1"/>
        <User v-if="active == 2"/>
    </div>
</template>

<script>
    import Table from '~/components/post.vue'
    import Categorie from '~/components/category.vue'
    import User from '~/components/users.vue'
    export default {
        components:{
            Table,
            Categorie,
            User
        },
        data () {
            return {
                active: null,
            }
        },
        created(){
            if(this.$auth.loggedIn){
                if(this.$auth.user.role != "admin"){
                    this.$router.push("/");
                }
            }else{
                this.$router.push("/");
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>