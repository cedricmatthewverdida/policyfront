<template>
  <div>

    <transition name="home" mode="out-in"></transition>

      <div class="d-flex justify-center mt-15">
         <v-card
         width="500px"
         class="pa-5"
         >
            <v-card-text>
               Authentication
            </v-card-text>
            <LoginForm buttonText="Login" :submitForm="loginUser"/>
         </v-card>
      </div>
      

       <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          :color="color"
        >
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

  </div>
</template>

<script>

  import LoginForm from '~/components/authform'
  export default {
    transition: {
      name: 'home',
      mode: 'out-in'
    },
    components: {
      LoginForm
    },
    data: () => ({
      loading: false,
      snackbar: false,
      text: '',
      color: '',
      timeout: 2000,
    }),
    methods: {
      async remove () {
        this.loading = true

        await new Promise(resolve => setTimeout(resolve, 3000))

        this.loading = false
      },
      async loginUser(loginInfo){
        
        try{
          await this.$auth.loginWith('local',{
              data: loginInfo
          })
          this.text = "Login successfuly!"
          this.color="success"
          this.snackbar = true;
          this.$router.push('/');


         if(this.$auth.user.role == "user"){
            this.$router.push('/')
         }else if(this.$auth.user.role == "admin"){
            this.$router.push('/admin')
         }
        }catch{
          this.text = "Wrong email or password."
          this.color="red"
          this.snackbar = true;
        }

        
      }
    },
    created(){
      if(this.$auth.loggedIn){
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss" scoped>
.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

.home-enter-active, .home-leave-active { transition: opacity .5s; }
.home-enter, .home-leave-active { opacity: 0; }

</style>