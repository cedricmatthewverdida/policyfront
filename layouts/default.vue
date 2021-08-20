<template>
  <v-app style="background-color:#f3f3f3;">

    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      flat
      color="white"
    >
      <v-icon class="mr-2">mdi-newspaper-variant-outline</v-icon>
      <v-toolbar-title class="overline" v-text="title" />
      <v-spacer></v-spacer>
      <v-btn
      depressed
      text
      @click="LogOut()"
      v-if="$auth.loggedIn"
      >
        Logout
      </v-btn>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'JBS Policy'
    }
  },
  methods:{
    LogOut() {
      this.$auth.logout();
      this.$router.push('/login')
    },
  }
}
</script>
