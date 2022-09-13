<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-10">
      <div class="row g-5">
        <div class="d-flex">
          <!-- Carte noire -->
          <div
            class="card bg-dark text-white"
            style="border-radius: 1rem;"
          >
            <form
              class="needs-validation"
              novalidate
            >
              <!-- Alignement des informations -->
              <div class="card-body p-5 text-center">
                <div class="row g-3">
                  <h4 class="mb-3">
                    Les informations de votre profil
                  </h4>

                  <div class="col-sm-6">
                    <label
                      for="firstName"
                      class="form-label"
                    >Prénom <span class="text-danger"> * </span></label>
                    <input
                      id="firstName"
                      v-model="newConsumer.first_name"
                      type="text"
                      class="form-control"
                      placeholder="Votre prénom"
                      required
                    >
                    <div class="invalid-feedback">
                      Prénom requis.
                    </div>
                  </div>

                  <div class="col-sm-6">
                    <label
                      for="lastName"
                      class="form-label"
                    >Nom <span class="text-danger"> * </span></label>
                    <input
                      id="lastName"
                      v-model="newConsumer.last_name"
                      type="text"
                      class="form-control"
                      placeholder="Votre nom"
                      required
                    >
                    <div class="invalid-feedback">
                      Nom requis.
                    </div>
                  </div>

                  <div class="col-sm-6">
                    <label
                      for="dateOfBirth"
                      class="form-label"
                    >Date de naissance <span class="text-danger"> * </span></label>
                    <input
                      id="dateOfBirth"
                      v-model="newConsumer.date_of_birth"
                      type="date"
                      class="form-control"
                      placeholder="jj/mm/aaaa"
                      required
                    >
                  </div>

                  <div class="col-sm-6">
                    <label
                      for="file"
                      class="form-label"
                    >Selectioner une photo de profil</label>
                    <input
                      id="formFile"
                      class="form-control form-control-lg"
                      type="file"
                      @change="handleFile"
                    >
                  </div>
                </div>

                <div class="card-body p-5 text-center">
                  <h4 class="mb-3">
                    Vos informations de connexion
                  </h4>



                  <div class="col-12">
                    <label
                      for="email"
                      class="form-label"
                    >Email <span class="text-danger"> * </span></label>
                    <input
                      id="email"
                      v-model="newConsumer.email"
                      type="email"
                      class="form-control"
                      placeholder="prenom@example.com"
                      required
                    >
                  </div>

                  <div class="col-12">
                    <label
                      for="password"
                      class="form-label"
                    >Mot de passe <span class="text-danger"> * </span></label>
                    <input
                      id="password"
                      v-model="newConsumer.password"
                      type="password"
                      class="form-control"
                      placeholder="8 caractères obligatoires"
                      required
                    >
                  </div>
                  <div class="col-12">
                    <label
                      for="confirmedPassword"
                      class="form-label"
                    >Confirmer le mot de passe <span class="text-danger"> * </span></label>
                    <input
                      id="confirmedPassword"
                      v-model="newConsumer.passwordConfirm"
                      type="password"
                      class="form-control"
                      placeholder="8 caractères obligatoires"
                      required
                    >
                    <div class="invalid-feedback">
                      Mot de passe requis.
                    </div> 
                  </div>
                </div>

                <input
                  class="btn btn-primary btn-lg"
                  value="Valider l'inscription"
                  type="button"
                  @click="addConsumer"
                >
                <p class="text-warning m-3">
                  {{ waitingMessage }}
                </p>
                <p class="text-success m-3">
                  {{ successMessage }}
                </p>
                <p class="text-danger m-3">
                  {{ errorMessage }}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>


export default {
    name:'Inscriptions',
    data(){
        return {
            picture:false,
            newConsumer:{
                  
            },
            successMessage:null,
            errorMessage:null,
            waitingMessage:null
           
        }
    },
    created(){
        this.$store.dispatch('resetRequestObj');
    },
    methods:{
        handleFile:function(e){
            this.$store.dispatch('createRequestObjForCloudinary',e); 
            this.picture=true; 
        },
        addConsumer:async function(){
            this.errorMessage=null;
            this.successMessage=null;
            this.waitingMessage="Veuillez patientez SVP ...";
            if(this.picture){
                try {
                    let img=await this.$store.dispatch('handleUploadToCloudinary')
                    await this.$store.dispatch('transformImg',img);
                    this.newConsumer.profile_picture_path_consumer=this.$store.state.url;
                } catch (error) {
                    console.log(error)
                }
            }
            else{
                //image par défaut
                this.newConsumer.profile_picture_path_consumer='https://res.cloudinary.com/dmoacy4yl/image/upload/c_fill,h_300,w_300/g1yyeusdp7vh82ibpcf3?_a=ATO2BAA0'
            }
            if(new Date(this.newConsumer.date_of_birth)> new Date())
            {	
                this.waitingMessage=null;
                this.errorMessage='Date de naissance invalide';
                return;
            }
            
               
            const diff=new Date()-new Date(this.newConsumer.date_of_birth);
            const dateDiff=new Date(diff);
            if(Math.abs(dateDiff.getUTCFullYear()-1970)<18)
            {	
                this.waitingMessage=null;
                this.errorMessage='Vous devez être majeur pour vous inscrire';
                return;
            }
           
            this.axios
                .post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}signupConsumer`,this.newConsumer)
                .then((response) => {
                    console.log(response.data);
                    this.newConsumer={};
                    this.$store.dispatch('resetRequestObj');
                    this.errorMessage=null;
                    this.waitingMessage=null;
                    this.successMessage= "Vous êtes bien inscrit! Vous allez être redirigé vers la page de connexion";	
                    setTimeout(() => {
                        this.$router.push('/connexion');   
                    }, 2000);
                    this.picture=false;
                })
                .catch((err)=>{
                    console.log(err);
                    this.successMessage=null;
                    this.waitingMessage=null;
                    this.errorMessage=err.response.data.message;
                    return
                })    
        }
    }
}


</script>

<style>
.container {
  padding-top: 5em;
}
</style>