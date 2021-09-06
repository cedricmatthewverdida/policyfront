<template>
    

                <v-form v-model="valid">
                  <v-container>
                   

                        <v-text-field
                          v-model="userInfo.email"
                          :rules="emailRules"
                          label="E-mail"
                          required
                          outlined
                          rounded
                          prepend-inner-icon="mdi-account-outline"
                        ></v-text-field>

                        <v-text-field
                          v-model="userInfo.password"
                          :rules="nameRules"
                          label="Password"
                          required
                          outlined
                          rounded
                          prepend-inner-icon="mdi-lock-outline"
                          :type="passwordType ? 'text' : 'password'"
                          :append-icon="passwordType ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="passwordType = !passwordType"
                        ></v-text-field>
                      
                        
                    <v-btn
                    block
                    color="primary"
                    x-large
                    rounded
                    @click="submitForm(userInfo)"
                    :disabled="!valid"
                    >
                      {{ buttonText }}
                    </v-btn>
                  </v-container>
                </v-form>
    

</template>

<script>
    export default {
        data: () => ({
            valid: false,
            passwordType: false,
            userInfo : {
                email: 'test@gmail.com',
                password: 'test',
            },
            
            nameRules: [
                v => !!v || 'Password is required'
            ],
            
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
        }),

        props:[
            "submitForm",
            "buttonText",
            "hasName"
        ]
    }
</script>

<style lang="scss" scoped>

</style>