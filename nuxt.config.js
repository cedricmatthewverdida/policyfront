import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - front',
    title: 'front',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/auth-next'
  ],

  axios: {
    proxy: true,
    credentials: true,
    baseURL:"https://fast-everglades-24609.herokuapp.com/api/",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  router: {
    middleware: ['auth']
  },

  proxy: {
    '/backend': { target: 'http://127.0.0.1:8000/api/', pathRewrite: {'^/backend': ''} },
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/backend/login', method: 'post', propertyName: 'token' },
          logout: { url: '/backend/logout', method: 'post' },
          user: { url: '/backend/verify', method: 'get' , propertyName: 'user'}
        },
      },
      tokenType: '',
    },
    redirect: {
      home: false,
      callback: false,
      logout: false
    }
  },


  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  ssr:false
}
