<template>
  <section class="border-bottom pb-3 mb-3 gradient-custom">
    <div class="container py-5 h-10">
      <!-- Partie recherche -->
      <div
        class="card bg-dark text-white"
        style="border-radius: 1rem;"
      >
        <div class="card-body p-4 text-center">
          <!-- Formulaire de recherche -->
          <form>
            <!-- Ville -->
            <div class="mb-3">
              <select
                v-model="searchForm.city"
                class="form-select"
                aria-label="Default select example"
              >
                <option value="default">
                  Choisissez une ville
                </option>
                <option
                  v-for="city in $store.state.cities"
                  :key="city.id"
                  :value="city"
                >
                  {{ city }}
                </option>
              </select>
            </div>

            <!-- Style -->
            <div class="mb-3">
              <select
                v-model="searchForm.style"
                class="form-select"
                aria-label="Default select example"
              >
                <option value="default">
                  Choisissez un style
                </option>
                <option
                  v-for="style in $store.state.styles"
                  :key="style.id"
                  :value="style"
                >
                  {{ style }}
                </option>
              </select>
            </div>

            <!-- Checkbox -->
            <div class="mb-3">
              <div class="form-check-inline">
                <input
                  id="colorTatoo"
                  v-model="searchForm.color"
                  class="form-check-input me-2"
                  type="checkbox"
                >
                <label
                  class="form-check-label"
                  for="flexCheckDefault"
                >
                  Couleur
                </label>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-check-inline">
                <input
                  id="bAndWTatto"
                  v-model="searchForm.black_and_white"
                  class="form-check-input me-2"
                  type="checkbox"
                >
                <label
                  class="form-check-label"
                  for="flexCheckChecked"
                >
                  Noir et Blanc
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="btn btn-primary"
                @click="search"
              >
                Filtrer
              </button>
            </div>
          </form>
          <br>
          <h4 style="color:red">
            {{ message }}
          </h4>
        </div>
      </div>
    </div>


    <!-- Container des cartes -->

    <!-- <div class="container py-5 h-10"> -->
    <div class="container py-4 h-10">
      <!-- <div class="row row-cols-2 row-cols-md-5 g-4"> -->
      <div class="row row-cols-2 row-cols-md-4 g-4">
        <div
          v-for="p in pros"
          :key="p.id"
          class="col"
        >
          <div class="card bg-dark text-white container-card">
            <img
              :src="p.profile_picture_path_pro"
              class="card-img-top"
              alt="image tatoueur"
            >
            
            <div class="card-body">
              <h5 class="card-title">
                {{ p.studio_name }}
              </h5>
              <p class="card-text">
                {{ p.city }}
              </p>
              <div class="d-flex justify-content-start flex-column">
                <p>
                  <span
                    v-for="style in p.styles"
                    :key="style.id"
                    class="badge bg-light text-dark m-1"
                  >{{ style.name }}</span>
                </p>
              </div>
              <router-link
                :to="{name:'ProfilPro',params:{id:p.id}}"
                class="btn btn-primary"
              >
                Voir plus
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

export default {
    name:'Home',
    data(){
        return{
            searchForm:{
                style:'default',
                city:'default'
            },
            cities:[],
            styles:[],
            stylesByIdPro:{},
            pros:[],
            message: null   
        }
    },
    async mounted(){
        try {
            const response=await this.axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro`);
            this.pros=response.data;
            this.pros.forEach((pro)=>{
                this.stylesByIdPro[pro.id]=pro.styles;
            })
            
        } catch (error) {
            console.log(error)
        }
        await this.$store.dispatch('getAllCities');
        await this.$store.dispatch('getAllStyles');
    },
    methods:{
        async search(e){
            e.preventDefault();
            this.message=null
            const requestObj={}
            if( this.searchForm.city!='default')
                requestObj.city=this.searchForm.city;
            if( this.searchForm.style!='default')
                requestObj.style=this.searchForm.style;
            if( this.searchForm.color)
                requestObj.color=this.searchForm.color;
            if( this.searchForm.black_and_white)
                requestObj.black_and_white = this.searchForm.black_and_white ;
            
            if(!Object.keys(requestObj).length){
                try {
                    const response=await this.axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro`)
                    this.pros=response.data;
                    return
                } catch (error) {
                    console.log(error);
                }
            }
            try {
                const response= await this.axios.post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/search`,requestObj);

                this.pros=response.data;
                this.pros.forEach(pro=>{
                    pro.styles=this.stylesByIdPro[pro.id];
                  
                })
                if(this.pros.length === 0){
                    this.message="Pas de résultats, relancez votre recherche";
                }
            } catch (error) {
                console.log(error);
        
            }

      
        }
    }
    
}
</script>
<style>
  .container-card{
    min-height: 550px;
  }

</style>