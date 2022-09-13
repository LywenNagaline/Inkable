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
                  Votre projet tatouage
                </h2>
                <p class="text-warning m-5">
                  Une fois le formulaire envoyé, le tatoueur vous contactera pour fixer un RDV s'il accepte votre projet.
                </p>
                <form>
                  <div class="form-outline form-white mb-4">
                    <label
                      class="form-label"
                      for="typeText"
                    >Titre du projet <span class="text-danger"> * </span></label>
                    <input
                      id="typeText"
                      v-model="newProject.title"
                      type="text"
                      class="form-control form-control-lg"
                    >
                  </div>

                  <div class="form-outline form-white mb-4">
                    <!-- <input v-model="newProject.description" type="text" id="typeText" class="form-control form-control-lg" />-->
                    <label
                      class="form-label"
                      for="typeText"
                    >Description <span class="text-danger"> * </span></label> 
                    <textarea
                      id="typeText"
                      v-model="newProject.description"
                      type="text"
                      class="form-control form-control-lg"
                    />
                  </div>

                  <div class="form-outline form-white mb-4">
                    <label
                      class="form-label"
                      for="typeText"
                    >Zone à tatouer <span class="text-danger"> * </span></label>
                    <input
                      id="typeText"
                      v-model="newProject.area"
                      type="text"
                      class="form-control form-control-lg"
                    >
                  </div>
           
            
                  <div class="form-outline form-white mb-4 form-check-inline">
                    <input
                      id="flexRadioDefault1"
                      v-model="newProject.color"
                      class="form-check-input me-2"
                      type="radio"
                      name="flexRadioDefault"
                      value="black_and_white"
                    >
                    <label
                      class="form-check-label"
                      for="flexRadioDefault"
                    >
                      Noir et blanc
                    </label>
                  </div>

                  <div class="form-outline form-white mb-4 form-check-inline">
                    <input
                      id="flexRadioDefault2"
                      v-model="newProject.color"
                      class="form-check-input me-2"
                      type="radio"
                      name="flexRadioDefault"
                      value="color"
                    >
                    <label
                      class="form-check-label"
                      for="flexRadioDefault"
                    >
                      Couleur
                    </label>
                  </div>
                  <p class="text-success">
                    {{ messageSuccess }}
                  </p>
                  <p class="text-danger">
                    {{ messageError }}
                  </p>
                  <input
                    class="btn btn-outline-light btn-lg px-5"
                    value="Prendre rendez-vous"
                    type="button"
                    @click="validForm"
                  >
                </form>
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
    name:'FormulaireProject',
    data(){
        return {
            
            newProject:{
              
            },
            messageSuccess:null,
            messageError:null,
        }
    },
    created(){
      
    },
    methods:{
        validForm:function(){ 
            if(this.newProject.color!==undefined)   
                this.newProject.color=this.newProject.color==='color'?true:false;
            this.newProject.pro_id=this.$route.params.id;
            this.newProject.consumer_id=this.$store.state.user.id; 
      
            this.axios
                .post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/projet`,this.newProject) 
                .then((response) => {

                    this.newProject={};
                    this.messageSuccess="Votre projet a bien été enregistré, vous allez être redirigé vers votre page de projet.";
                    setTimeout(() => {
                        this.$router.push(`/dashboard-particulier/project-particulier/${response.data.id}`)
                    }, 1000);
                    this.messageError=null;
                })
                .catch((err)=>{
                    console.log(err)
                    this.messageSuccess=null;
                    this.messageError=err.response.data.message;
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

</style>