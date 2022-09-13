<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div
            class="card bg-dark text-white"
            style="border-radius: 1rem;"
          >
            <div class="card-body p-5 text-center">
              <div class="mb-md-5 mt-md-4 pb-5">
                <h2 class="fw-bold mb-2 text-uppercase">
                  Connexion
                </h2>
                <p class="text-white-50 mb-5">
                  Entrez vos identifiants de connexion
                </p>
              
                <form>
                  <div class="form-outline form-white mb-4">
                    <label
                      class="form-label"
                      for="email"
                    >Email</label><span class="text-danger"> * </span>
                    <input
                      id="email"
                      v-model="user.email"
                      type="email"
                      class="form-control form-control-lg"
                    >
                  </div>

                  <div class="form-outline form-white mb-4">
                    <label
                      class="form-label"
                      for="password"
                    >Mot de passe</label><span class="text-danger"> * </span>
                    <input
                      id="password"
                      v-model="user.password"
                      type="password"
                      class="form-control form-control-lg"
                    >
                  </div>

                  <p class="small mb-5 pb-lg-2">
                    <a
                      class="text-white-50"
                      href="#!"
                    >Mot de passe oublié</a>
                  </p>
                  <p class="text-danger">
                    {{ errorMessage }}
                  </p>
                  <input
                    type="button"
                    class="btn btn-outline-light btn-lg px-5"
                    value="Se connecter"
                    @click="connect"
                  >
                </form>

                <div class="d-flex justify-content-center text-center mt-4 pt-1">
                  <a
                    href="#!"
                    class="text-white"
                  ><i class="fab fa-facebook-f fa-lg" /></a>
                  <a
                    href="#!"
                    class="text-white"
                  ><i class="fab fa-twitter fa-lg mx-4 px-2" /></a>
                  <a
                    href="#!"
                    class="text-white"
                  ><i class="fab fa-google fa-lg" /></a>
                </div>
              </div>
            
              <div>
                <p class="mb-0">
                  Pas de compte ? <router-link
                    :to="{name:'InscriptionConsumer'}"
                    class="text-white-50 fw-bold"
                  >
                    S'inscrire
                  </router-link>
                </p>
              </div>

              <div>
                <p class="mb-0">
                  Vous êtes tatoueur ? <router-link
                    :to="{name:'InscriptionPro'}"
                    class="text-white-50 fw-bold"
                  >
                    S'inscrire en tant que tatoueur
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
    name:'Connexion',
    
    data(){
        return {
            errorMessage:null,
            user:{ 
            }
        }
    },
    methods:{
        connect:function(){
           
            this.axios
                .post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}login`,this.user)
                .then((response) => {
                    console.log(response.data);
                    this.user={};
                    this.$router.push('/');
                    localStorage.setItem("token",response.data.accessToken);
                    this.axios.defaults.headers.common['Authorization']=`Bearer ${response.data.accessToken}`;
                    this.$store.dispatch('check');
                })
                .catch((err)=>{
                  
                    console.log(err.response.data.message);
                    this.errorMessage=err.response.data.message;
                })

      
            
            
        }
    }
}


</script>

<style>

.gradient-custom {
/* fallback for old browsers */
background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))
};

input{
    height: 3em;
    margin:1em;
};

container-max-widths{
   xs: 0;
  sm: 540px;
  md: 720px;
  lg: 960px;
  xl: 1140px;
  xxl: 1320px
};
</style>
