<template>
  <!-- Premier système de rows et colonnes pour l'image de prfils , le nom et la ville du tatoueur -->
   
      
  <section class="gradient-custom">
    <div class="container py-4">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-6">
          <div
            class="card bg-dark text-white"
            style="border-radius: 1rem;"
          >
            <div class="card-body p-4">
              <div class="d-flex flex-wrap align-items-center">
                <div class="flex-shrink-0  img-fluid">
                  <img
                    :src="pro.profile_picture_path_pro"
                    alt="Generic placeholder image"
                    class="img-fluid"
                    style="width: 11.25rem; border-radius: 10px;"
                  >
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="d-flex justify-content-start rounded-3 mt-2">
                    <h5 class="">
                      {{ pro.studio_name }}
                    </h5>
                  </div>

                  <div class="d-flex justify-content-start rounded-3">
                    <p
                      class="text-white"
                      style="color: #2b2a2a;"
                    >
                      {{ pro.city }}
                    </p>
                  </div>


                  <div class="d-flex justify-content-start rounded-3 mb-1 flex-wrap">
                    <div
                      v-for="style in pro.styles"
                      :key="style.id"
                    >
                      <span class="badge m-1 text-bg-light">{{ style.name }}</span>
                    </div>
                  </div>
                  <div class="d-flex justify-content-start rounded-3 mb-2  flex-wrap ">
                    <div>
                      <span class="badge text-bg-secondary me-3">{{ pro.color?"Couleur":null }}</span>
                    </div>
                    <div class="">
                      <span class="badge text-bg-secondary">{{ pro.black_and_white?"Noir et blanc":null }}</span>
                    </div>
                  </div>



                  <div class="d-flex mt-3 flex-wrap">
                    <a
                      v-if="pro.instagram"
                      class="link-insta me-3"
                      :href="pro.instagram"
                      target="_blank"
                    >
                      <button
                        type="button"
                        class="btn btn-outline-light me-1 mb-2 flex-grow-1"
                      >
                        Instagram
                      </button>
                    </a>

                    <router-link
                      v-if="$store.state.user.role!=='pro'"
                      :to="{name:'FormulaireProject'}"
                      class="btn btn-outline-dark text-light flex-grow-1 mb-2"
                      style="background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1));"
                    >
                      Prendre rendez-vous
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="container py-5">
    <div class="row">
      <h3>Description</h3>
      <p class=" ">
        {{ pro.description }}
      </p>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="page-title">
            Galerie
          </h1>
        
          <div class="row">
            <a
              v-for="tattoo in pro.tattoos"
              :key="tattoo.id"
              :href="tattoo.tattoo_picture_path"
              data-toggle="lightbox"
              data-gallery="example-gallery"
              class="col-lg-3 col-md-4 col-6 my-3"
            >
              <img
                :src="tattoo.tattoo_picture_path"
                class="img-fluid card"
              >
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>


export default {
    name:'DashboardPro',
    data(){
        return{
            pro:{}
        }
    },
    async updated(){
        this.getPro();
    },
    async mounted(){
        this.getPro();
    },
    methods:{
        async getPro(){
            try {
                const response=await this.axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$route.params.id}`);
                this.pro=response.data;
                //  console.log(this.pro);
            } catch (error) {
                console.log("error")
            }
        }
    }
 
    
}
</script>
<style>
.link-insta{
  text-decoration: none;
  
}

</style>