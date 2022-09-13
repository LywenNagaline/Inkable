
<template>
  <!-- Section avec background -->
  <section class=" gradient-custom">
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
                  <p class="mb-3 fs-4">
                    Les informations de votre studio
                  </p>

                  <div class="col-sm-6">
                    <label
                      for="studioNmae"
                      class="form-label"
                    >Nom du studio <span class="text-danger"> * </span></label>
                    <input
                      id="studioName"
                      v-model="newPro.studio_name"
                      type="text"
                      class="form-control"
                      placeholder=""
                      required
                    >
                  </div>

                  <div class="col-sm-6">
                    <label
                      for="city"
                      class="form-label"
                    >Ville <span class="text-danger"> * </span></label>
                    <input
                      id="city"
                      v-model="newPro.city"
                      type="text"
                      class="form-control"
                      placeholder=""
                      required
                    >
                    <div class="invalid-feedback">
                      Ville requise.
                    </div>
                  </div>

                  <div class="container py-5 h-10">
                    <p class="fs-4">
                      Les couleurs de tatouage
                    </p>
                    <div class="form-check-inline p-2">
                      <input
                        id="color"
                        v-model="newPro.color"
                        type="checkbox"
                        class="form-check-input me-2"
                      >
                      <label
                        class="form-check-label "
                        for="color"
                      >Tatouages couleur</label>
                    </div>

                    <div class="form-check-inline p-2">
                      <input
                        id="blackAndWhite"
                        v-model="newPro.black_and_white"
                        type="checkbox"
                        class="form-check-input me-2"
                      >
                      <label
                        class="form-check-label"
                        for="blackAndWhite"
                      >Tatouages noir et blanc</label>
                    </div>

                    <div class="container pt-5 h-10">
                      <p class="fs-4">
                        Les styles de tatouage
                      </p>

                      <div
                        v-for="style in $store.state.styles" 
                        :key="style.id"
                        class="form-check-inline p-2"
                      >
                        <input
                          :id="style"
                          v-model="newPro.styles"
                          type="checkbox"
                          class="form-check-input me-2"
                          :value="style"
                        >
                        <label
                          class="form-check-label"
                          :for="style"
                        >{{ style }}</label>
                      </div>
                    </div>
                  </div>
                </div>
                  

                <div class="card-body p-2 text-center">
                  <p class="mb-3 fs-4">
                    Vos informations de connexion
                  </p>

                  <div class="col-12">
                    <label
                      for="email"
                      class="form-label"
                    >Email <span class="text-danger"> * </span></label>
                    <input
                      id="email"
                      v-model="newPro.email"
                      type="email"
                      class="form-control"
                      placeholder="studio@example.com"
                      required
                    >
                    <div class="invalid-feedback">
                      Email valide requis
                    </div>
                  </div>

                  <div class="col-12">
                    <label
                      for="username"
                      class="form-label"
                    >Mot de passe <span class="text-danger"> * </span></label>
                    <input
                      id="password"
                      v-model="newPro.password"
                      type="password"
                      class="form-control"
                      required
                    >
                    <div class="invalid-feedback">
                      Mot de passe requis.
                    </div> 
                  </div>

                  <div class="col-12">
                    <label
                      for="username"
                      class="form-label"
                    >Confirmer le mot de passe <span class="text-danger"> * </span></label>
                    <input
                      id="confirmedPassword"
                      v-model="newPro.passwordConfirm"
                      type="password"
                      class="form-control"
                      required
                    >
                    <div class="invalid-feedback">
                      Mot de passe requis.
                    </div> 
                  </div>
                </div> 

                <div class="card-body p-5 text-center">
                  <p class="mb-3 fs-4 text-wrap">
                    Vos informations complémentaires
                  </p>

                  <div class="mb-3">
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
                    
                  <div class="mb-3">
                    <label
                      for="address"
                      class="form-label"
                    >URL de votre compte Instagram</label>
                    <input
                      id="instagram"
                      v-model="newPro.instagram"
                      type="text"
                      class="form-control"
                    >
                  </div>

                  <div class="mb-3">
                    <label
                      for="description"
                      class="form-label"
                    >Une courte description de votre salon</label>
                    <textarea
                      id="description"
                      v-model="newPro.description"
                      class="form-control"
                    />
                  </div>
                </div> 

                <button
                  class="btn btn-primary btn-lg"
                  type="submit"
                  @click="addPro"
                >
                  Valider l'inscription
                </button>
                <p class="text-warning m-3">
                  {{ waitingMessage }}
                </p>
                <p class="text-success m-5">
                  {{ successMessage }}
                </p>
                <p class="text-danger m-5">
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
            newPro:{
                color:false,
                black_and_white:false,
                styles:[]
            },
            successMessage:null,
            errorMessage: null,
            waitingMessage: null,
            picture:false
        }
    },
    methods:{
        async handleFile(e){
            await this.$store.dispatch('createRequestObjForCloudinary',e);
            this.picture=true
        },
        async addPro(e){
            e.preventDefault()
            this.successMessage=null;
            this.errorMessage=null;
            this.waitingMessage="Veuillez patientez SVP ...";
            if(this.picture){
                try {
                    let img=await this.$store.dispatch('handleUploadToCloudinary');
                    await this.$store.dispatch('transformImg',img);
                    this.newPro.profile_picture_path_pro=this.$store.state.url;
                } catch (error) {
                    console.log(error)
                    this.waitingMessage=null;
                    this.errorMessage="Erreur d'envoi de la photo"
                }
            }else{
                //image par défaut
                this.newPro.profile_picture_path_pro='https://res.cloudinary.com/dmoacy4yl/image/upload/c_fill,h_300,w_300/g1yyeusdp7vh82ibpcf3?_a=ATO2BAA0'
            }
            this.axios
                .post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}signupPro`,this.newPro)
                .then((response) => {
                    this.newPro={};
                    this.waitingMessage=null;
                    this.successMessage= "Vous êtes bien inscrit! Vous allez être redirigé vers la page de connexion";	
                    setTimeout(() => {
                        this.$router.push('/connexion');
                    }, 2000);
            
                    
                })
                .catch((err)=>{
                    console.log(err);
                    this.waitingMessage=null;
                    this.errorMessage=err.response.data.message;
                    return
                })
            
            
        }
    }
}


</script>

<!-- <style>

      .nav-scroller {
        position: relative;
        z-index: 2;
        height: 2.75rem;
        overflow-y: hidden;
      }

      .nav-scroller .nav {
        display: flex;
        flex-wrap: nowrap;
        padding-bottom: 1rem;
        margin-top: -1px;
        overflow-x: auto;
        text-align: center;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
      }

      body {
        display: flex;
        align-items: center;
        padding-top: 40px;
        padding-bottom: 40px;
        background-color: #f5f5f5;
      }

      .form-signin {
        max-width: 330px;
        padding: 15px;
      }

      .form-signin .form-floating:focus-within {
        z-index: 2;
      }

      .container {
        align-items: center;
      }

    </style> -->

<!-- 1er style de fait -->

<!-- <style>
.container {
  padding-top: 5em;
}

h4 {
  padding-top: 1em;
}

@media (min-width: 768px) {

}
</style> -->