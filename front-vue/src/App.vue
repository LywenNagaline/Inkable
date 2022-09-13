<template>
  <!-- Création de ligne -->
  <div class="row d-flex align-items-center h-100 mx-4">
    <!-- Première colonne -->
    <div class="d-flex col-xl-3 col-md-4 ">
      <router-link to="/">
        <img
          src="https://res.cloudinary.com/dmoacy4yl/image/upload/c_thumb,w_200,g_face/v1661781662/inkable_rectangle_but7iu.png"
          alt=""
        >
      </router-link>
    </div>
    
    <!-- Deuxiemme colonne -->
    <div class="d-flex col-xl-6 col-md-auto justify-content-center">
      <ul class="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
        <li>
          <router-link
            v-if="$store.state.user.role==='pro'"
            class="text-decoration-none"
            :to="{name :'ProfilPro', params: {id:$store.state.user.id}}"
          >
            <div class="nav-link text-dark">
              Mon profil
            </div>
          </router-link>
        </li>

        <li>
          <router-link
            v-if="$store.state.user.role==='pro'"
            to="/dashboard-pro"
            class="text-decoration-none"
          >
            <div class="nav-link text-dark position-relative">
              Dashboard
              <i
                v-if="$store.state.hasNotif"
                class="bi bi-circle-fill text-danger"
              />
            </div>
          </router-link>
        </li>

        <li>
          <router-link
            v-if="$store.state.user.role==='consumer'"
            to="/dashboard-particulier"
            class="text-decoration-none"
          >
            <div class="nav-link text-dark">
              Dashboard
              <i
                v-if="$store.state.hasNotif"
                class="bi bi-circle-fill text-danger"
              />
            </div>
          </router-link>
        </li>

        <li>
          <router-link
            v-if="$store.state.user.role==='pro'"
            to="/planning"
            class="text-decoration-none"
          >
            <div class="nav-link text-dark">
              Planning
            </div>
          </router-link>
        </li>

        <li>
          <router-link
            v-if="$store.state.user.role==='pro'"
            to="/compte-pro"
            class="text-decoration-none"
          >
            <div class="nav-link text-dark">
              Mon Compte
            </div>
          </router-link>
        </li>

        <li>
          <router-link
            v-if="$store.state.user.role==='consumer'"
            to="/compte-particulier"
            class="text-decoration-none"
          >
            <div class="nav-link text-dark">
              Mon Compte
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Troisieme colonne -->
    <div class="d-flex col-xl-3 col-md-4 justify-content-end">
      <router-link to="/connexion">
        <button
          v-if="$store.state.user.role==='anonyme'"
          type="button"
          class="btn btn-light text-dark me-2 "
        >
          Se connecter
        </button>
      </router-link>
          
      <button
        v-if="$store.state.user.role==='consumer'||$store.state.user.role==='pro'"
        type="button"
        class="btn btn-light text-dark me-2"
        @click="deconnect"
      >
        Se déconnecter
      </button>
         
      <router-link to="/inscriptionConsumer">
        <button
          v-if="$store.state.user.role==='anonyme'"
          type="button"
          class="btn btn-primary me-2"
        >
          Créer compte
        </button>
      </router-link>
      <router-link to="/inscriptionPro">
        <button
          v-if="$store.state.user.role==='anonyme'"
          type="button"
          class="btn btn-primary"
        >
          Vous êtes tatoueur ?
        </button>
      </router-link>
    </div>
  </div>

  <div class="row d-flex align-items-center h-100 mx-3 ">
    <div class="d-flex col-xl-3 col-md-4 ">
      <AmBreadcrumbs>
        <template #crumb="{ crumb }">
          <router-link
            class="my-custom-crumb"
            :to="crumb.link"
          >
            {{ crumb.label }} /
          </router-link>
        </template>
      </AmBreadcrumbs>
    </div>
  </div>

  <router-view />

  <footer class="text-center text-lg-start bg-light text-muted">
    <!-- Copyright -->
    <div
      class="text-center p-4"
      style="background-color:white;"
    >
      © 2022 Copyright:
      <a
        class="text-reset fw-bold"
        href="/createurs"
      >Créateurs du projet Inkable</a>
    </div>
  <!-- Copyright -->
  </footer>
</template>

<script>



export default {
    name: 'App',
    components:{},
  
    computed:{
        user() {
            return this.$store.state.user
        },
        cities(){
            return this.$store.state.cities
        }
    },
 
    updated(){
        console.log("updated");
    },
    async created(){  
        // console.log(AmBreadcrumbs)
        const token=localStorage.getItem("token");
        //met le token dans le header 
        this.axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
        // try {
        //     await this.$store.dispatch('getUser');
        //     console.log(await this.$store.state.user)
        // } catch (error) {
        //     console.log(error)
        // }
        // console.log(this.$store.state.user)
        this.$store.dispatch('getAllStyles');
        this.$store.dispatch('getAllCities');


    },
    methods:{
        deconnect(){

            this.$store.dispatch('logout');
        }
    }
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  
}

.bi {
  color: white;

}


/* style="background-color: rgba(37, 117, 252, 1 */
</style>
