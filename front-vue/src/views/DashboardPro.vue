
<template>
  <section class=" gradient-custom">
    <div class="container py-5 h-10">
      <h3 class="text-white mb-4">
        Bienvenue sur votre dashboard {{ pro.studio_name }}
      </h3>
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-8">
          <div
            class="card bg-dark text-white"
            style="border-radius: 1rem;"
          >
            <div class="card-body p-4 text-center">
              <div class="mb-3">
                <label
                  for="file"
                  class="form-label"
                >Ajouter une photo dans ma galerie </label>
                <input
                  ref="pictureInput"
                  class="form-control form-control-lg"
                  type="file"
                  @change="handleFile"
                >
                <input
                  type="button"
                  class="btn btn-primary m-3"
                  value="Ajouter"
                  @click="sendPicture"
                >
                <p class="text-success m-3">
                  {{ successMessage }}
                </p>
                <p class="text-warning m-3">
                  {{ waitingMessage }}
                </p>
                <p class="text-danger m-3">
                  {{ errorMessage }}
                </p>
                <p class="fst-italic">
                  Conseil : Pour un affichage optimal, choisissez des photos 300 * 300 pixels
                </p>
              </div>
            </div>
          </div>
          <button
            ref="btnGallery"
            class="btn btn-primary m-3"
            @click="displayGallery"
          >
            Afficher la galerie
          </button>
        </div>
        <div
          ref="gallery"
          class="container visually-hidden"
        >
          <div class="row">
            <div class="col-12">
              <h1 class="page-title">
                Ma Galerie
              </h1>
        
              <div class="row">
                <div
                  v-for="tattoo in pro.tattoos"
                  :key="tattoo.id"
                  class="col-lg-3 col-md-4 col-6 my-3"
                >
                  <a
                    :href="tattoo.tattoo_picture_path"
                    data-toggle="lightbox"
                    data-gallery="example-gallery"
                  >
                    <img
                      :src="tattoo.tattoo_picture_path"
                      class="img-fluid card"
                    >
                  </a>
                  <button
                    :id="tattoo.id"
                    class="btn btn-danger m-2"
                    @click="deletePictureGallery"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-1 h-10">
      <div class="container py-1 h-10">
        <router-link
          :to="{name:'Planning'}"
          class="btn btn-primary my-3"
        >
          Vue d'ensemble de votre planning
        </router-link>
        <div
          class="card"
          style="border-radius: 1rem;"
        >
          <FullCalendar
            ref="list"
            :options="calendarOptions"
          />
          <p> Si vous souhaitez modifier ou annuler un rendez-vous, rendez-vous sur la page du projet en question</p>
          <p> Pensez à prévenir votre client</p>
        </div>
      </div>
      <!-- Lien ves le planning du pro -->
      
      
      <!-- Première carte projet -->
      <div class="container py-5 h-10">
        <h4 class="text-white text-center">
          Projets
        </h4>
        <p v-if="!$store.state.user.projects.length">
          Vous n'avez pas encore de projets en cours
        </p> 
        <div
          v-for="projet in pro.projects"
          :key="projet.id"
          class="container py-4"
        >
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-8">
              <div
                class="card bg-dark text-white position-relative"
                style="border-radius: 1rem;"
              >
                <div class="d-inline-flex flex-wrap m-3">
                  <p 
                    v-for="notif in projet.notifs"
                    :key="notif.id"
                    class="badge bg-danger m-1"
                  >
                    <span v-if="notif.code==='msg_consumer'">{{ notif.name }}</span>
                  </p>
                </div>
                <span
                  v-if="projet.status==='en attente'"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger p-2"
                >
                  NEW
                  <span class="visually-hidden">unread messages</span>
                </span>
                <div class="card-body p-4">
                  <h5 style="color:burlywood">
                    <strong>
                      {{ projet.title }}
                    </strong>
                  </h5>
                  <!-- <span
                    v-if="projet.status=='accepté'"
                    class="badge rounded-pill bg-success m-3"
                  >
                    {{ projet.status }}
                  </span>
                  <span
                    v-if="projet.status=='refusé'"
                    class="badge rounded-pill bg-danger m-3"
                  >
                    {{ projet.status }}
                  </span>
                  <span
                    v-if="projet.status==='en attente'"
                    class="badge rounded-pill bg-light text-dark m-3"
                  >
                    {{ projet.status }}
                  </span> -->
                  <p>Zone de tatouage : {{ projet.area }}</p>
                  <p>Envoyé par : {{ projet.consumer.first_name }} {{ projet.consumer.last_name }}</p>
                  
                  <!-- ce boutton amène sur la page de projet modifiable ATTENTION Penser à dynamyser avec un params id du projet-->
                  <router-link
                    :data-projectId="
                      projet.id"
                    :to="{name:'Project', params:{id:projet.id}}"
                    class="btn btn-primary"
                    @click="deleteNotif"
                  >
                    Détail du projet
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import listDayPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {
            successMessage:null,
            errorMessage:null,
            waitingMessage:null,
            picture:false,
            pro:{},
            calendar:{},
            rdv:{},
            calendarOptions: {
                plugins: [ listDayPlugin, interactionPlugin],
                initialView: 'listDay',
                height: 300,
                titleFormat: // will produce something like "Tuesday, September 18, 2018"
                {
                    weekday: 'long',
                    month: 'long',
                    year: 'numeric',
                    day: '2-digit'
                },
                views: {
                    listDay: { buttonText: 'Journée' },
                    listWeek: { buttonText: 'Semaine' },
                    listMonth: { buttonText: 'Mois' }
                },
                headerToolbar: {
                    start: 'listDay listWeek listMonth',
                    center: 'title'
                   
                },
                titleFormat: // will produce something like "Tuesday, September 18, 2018"
                {
                    weekday: 'short',
                    month: 'long',
                    year: 'numeric',
                    day: '2-digit',
                },
                locale: 'fr-FR',
                selectable: true,
                timeZone: 'locale',
                slotMinTime: "07:00:00",
                slotMaxTime: "20:00:00",
                expandRows: true,
                select: this.handleSelect,
                eventContent:this.formateEvent,
            }
        }
    },
    created(){
 
        console.log(this.$store.state.user)
        //récupération du pro en bdd;
        this.axios
            .get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}`)
            .then((response) => {
                this.pro=response.data;  
                console.log(response.data);
                this.pro.projects.forEach((project,indexProject)=>{
                    project.notifs.forEach((notif,indexNotif)=>{
                        console.log(notif,indexProject,indexNotif)
                          
                    })
                })
            })
            .catch((err)=>{
                console.log(err);       
                return
            })

    },
    mounted(){
        this.getListRdv();
    },
    methods:{
        async deleteNotif(e){
            console.log("test")
            try {
                const projectId=e.target.getAttribute('data-projectId');
                await this.axios.post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/projet/${projectId}/notifs`,{role:'pro'});   
            } catch (error) {
                console.log(error);
            }
        },
        formateEvent: function (arg) {
            const rdvElm=document.createElement('div');
            const linkElm=document.createElement('a');
            rdvElm.textContent=`${arg.event.title} ${arg.event.extendedProps.description?arg.event.extendedProps.description:''}`;
            if(arg.event.extendedProps.project_id)
            {
                linkElm.classList.add('link-project');
              
                linkElm.textContent="lien vers le projet";
                linkElm.setAttribute("href",`${this.$route.path}/project/${arg.event.extendedProps.project_id}`)
            }
            let arrayOfDomNodes = [rdvElm,linkElm]
            return {
                domNodes: arrayOfDomNodes
            }
        },
        setDay(){
            this.$refs.list.getApi().setOption('initialView','listDay');
            console.log(this.$refs.list.getApi().getOption('initialView'));
        },
        setMonth(){
            this.$refs.list.getApi().setOption('initialView','listMonth');
            console.log(this.$refs.list.getApi().getOption('initialView'));
        },
        setWeek(){
            this.$refs.list.getApi().setOption('initialView','listWeek');
        },
        displayGallery(){
            this.$refs.gallery.classList.toggle("visually-hidden");
            if(this.$refs.gallery.classList.contains("visually-hidden"))
                this.$refs.btnGallery.textContent="Afficher la galerie";
            else
                this.$refs.btnGallery.textContent="Masquer la galerie";

        },
        async deletePictureGallery(e){
            //route: /api/pro/:idPro/tatouages/:idTattoo
            try {
                const response= await this.axios.delete(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/tatouages/${e.target.id}`);
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }
            try {
                const response= await this.axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/tatouages`);
                this.pro.tattoos=response.data;
            } catch (error) {
                console.log(error)
            }
      
        },
    
        handleFile(e){
            this.$store.dispatch('resetRequestObj');
            this.$store.dispatch('createRequestObjForCloudinary',e);
            this.errorMessage=null;
            this.picture=true;
        },
        async sendPicture(){
      

            //si une photo a été ajoutée
            if(this.picture)
            {
                this.errorMessage=null;
                this.successMessage = null;
                this.waitingMessage="Veuillez patientez SVP ...";
                let img;
                try {
                    img = await this.$store.dispatch('handleUploadToCloudinary')
                } catch (error) {
                    this.errorMessage="Erreur d'envoi de la photo"; 
                }
                await this.$store.dispatch('transformImg',img);
                this.axios
                    .post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/tatouages`,{pro_id:this.$store.state.user.id,tattoo_picture_path:this.$store.state.url})
                    .then(async (res)=>{
                        this.errorMessage=null;
                        this.waitingMessage=null;
                        this.successMessage="Votre photo a bien été envoyée";
                        setTimeout(() => {
                            this.successMessage=null;
                        }, 1000);
                        this.$refs.pictureInput.value=null;
                        this.picture=false;
                        try {
                            const response= await this.axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/tatouages`);
                            this.pro.tattoos=response.data;
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    .catch((err)=>{
                        this.successMessage=null;
                        this.waitingMessage=null;
                        this.errorMessage="Erreur serveur";
                        console.log(this.$store.state.url)
                    })
            }else{
                this.successMessage=null;
                this.errorMessage="Vous n'avez pas ajouté de photo";
            }

        },
        async getListRdv() {
            try {
                console.log(this.$refs)
                let calendarApi = this.$refs.list.getApi()
                const response=await this.axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/rdv`,this.rdv);
                const rdvs = response.data;
                rdvs.forEach(rdv => {
                    console.log(rdv)
                    calendarApi.addEvent({
                        id: rdv.id,
                        title: rdv.title,
                        extendedProps: {
                            description: rdv.note,
                            project_id: rdv.project_id
                        },
                        start: new Date(rdv.beginning_hour),
                        end: new Date(rdv.ending_hour)
                    });
                });
      
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
<style>
.link-project{
  text-decoration: underline !important;
}
</style>