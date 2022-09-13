<template>
  <section class=" gradient-custom">
    <div class="container py-5 h-100">
      <div
        v-if="notif"
        ref="notifs"
        class="top-0 badge m-1"
      >
        <button
          
          type="button"
          class="btn-close m-1 bg-light"
          aria-label="Close"
          @click="deleteNotif"
        />
          
        <p
          v-for="n in editProject.notifs"
          :key="n.id"
          class=" d-block"
        >
          <span
            v-if="n.code==='msg_consumer'"
            class="badge bg-danger fs-6 m-1"
          >{{ n.name }}</span>
        </p>
      </div>
      <div
        class="card bg-dark text-white"
        style="border-radius: 1rem;"
      >
        <div class="card-body">
          <h3><strong>Client :</strong> {{ first_name_client }} {{ last_name_client }}</h3>
        </div>

        <form>
          <div class="card-body">
            <div class="form-outline form-white mb-4">
              <label
                class="form-label"
                for="typeText"
              >Titre du projet</label>
              <input
                id="typeText"
                v-model="editProject.title"
                data-field="title"
                type="text"
                class="form-control form-control-lg"
                @change="handleChange"
              >
            </div>
          </div>

          <div class="card-body">
            <div class="form-outline form-white mb-4">
              <!-- <input v-model="editProject.description" type="text" id="typeText" class="form-control form-control-lg" />-->
              <label
                class="form-label"
                for="typeText"
              >Description</label>
              <textarea
                id="typeText"
                v-model="editProject.description"
                data-field="description"
                type="text"
                class="form-control form-control-lg"
                @change="handleChange"
              />
            </div>
          </div>

        
          <div class="card-body">
            <!-- Division en 2 colonnes -->
            <div class="d-flex ">
              <!-- Côté gauche -->
              <div class="flex-grow-1 ms-3">
                <!-- Zone à tatouer -->
                <div class="form-outline form-white mb-4">
                  <label
                    class="form-label"
                    for="typeText"
                  >Zone à tatouer</label>
                  <input
                    id="typeText"
                    v-model="editProject.area"
                    data-field="area"
                    type="text"
                    class="form-control form-control-lg"
                    @change="handleChange"
                  >
                </div>
              </div>

              <!-- Côté droit -->
              <div class="flex-grow-1 ms-3">
                <label
                  class="form-label"
                  for="typeText"
                >Coloration</label>

                <div class="flex-grow-1 ms-3">
                  <!-- Coloration -->
                  <div class="form-outline form-white mb-4 form-check-inline">
                    <input 
                      id="flexRadioDefault1"
                      ref="inputTest"
                      v-model="editProject.color"
                      class="form-check-input m-1 me-2"
                      type="radio"
                      data-field="color"
                      name="flexRadioDefault"
                      value="black_and_white"
                      @change="handleChange"
                    >
                    <label
                      class="form-check-label"
                      for="flexRadioDefault"
                    > Noir et blanc</label>
                  </div>

                  <div class="form-outline form-white mb-4 form-check-inline">
                    <input
                      id="flexRadioDefault2"
                      v-model="editProject.color"
                      class="form-check-input m-1 me-2"
                      type="radio"
                      data-field="color"
                      name="flexRadioDefault"
                      value="color"
                      @change="handleChange"
                    >
                    <label
                      class="form-check-label"
                      for="flexRadioDefault"
                    >
                      Couleur
                    </label>
                  </div>
                </div> 
              </div>
            </div>
          </div>

          <div class="form-outline form-white mb-4">
            <label
              class="mr-sm-2"
              for="inlineFormCustomSelect"
            >Statut : </label>
            <select
              id="inlineFormCustomSelect"
              v-model="editProject.status"
              data-field="status"
              class="w-50 m-auto form-select"
              @change="handleChange"
            >
              <option
                ref="accepted"
                style="background-color: lightgreen;"
                value="accepté"
              >
                Accepté
              </option>
              <option
                ref="waiting"
                style="background-color:lightgray;"
                value="en attente"
              >
                En attente
              </option>
              <option
                ref="refused"
                style="background-color:lightcoral;"
                value="refusé"
              >
                Refusé
              </option>
            </select>
          </div>

          <!-- Bouton modifier -->
          <div class="form-outline form-white mb-4">
            <input
              class="btn btn-outline-light btn-lg px-5"
              value="Modifier"
              type="button"
              @click="editProjectForm"
            >
          </div>
          <div class="form-outline form-white mb-4">
            <!-- <router-link
              :to="{name:'Planning',params:{id:$route.params.id,projectId:editProject.id}}"
              class="btn btn-outline-light btn-lg px-5"
              @click="editProjectForm"
            >
              Fixer un RDV
            </router-link> -->
            <button
              class="btn btn-outline-light btn-lg px-5"
              @click="fixAppointment"
            >
              Fixer un RDV
            </button>
          </div>

          <p class="text-success">
            {{ successMessage }}
          </p>
          <p class="text-danger">
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </div>
  </section>

  <!-- Section des RDV -->

  <section class="gradient-custom">
    <div class="container py-5 h-100">
      <div class="card ">
        <!-- Titre -->
        <div class="card-body">
          <h1 class="card-title">
            RDV
          </h1>
        </div>
        <!-- Informations du RDV -->

        <div class="card-body">
          <FullCalendar
            ref="list"
            :options="calendarOptions"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Section des Messages -->

  <section class="gradient-custom">
    <div class="container py-5 h-100">
      <div class="card-body text-white bg-dark">
        <h1 class="card-title">
          Messages
        </h1>
      </div>
      <div class="card bg-dark text-white messages">
        <!-- Conteneur des messages à dupplique en cas de nouveau message-->
        <div
          v-for="message in editProject.messages"
          :key="message.id"
          lass="container_messages py-3 h-100"
        >
          <div class="card-body">
            <div
              class="d-flex rounded-3 text-black"
              style="background-color: #efefef;"
            >
              <div
                class="flex-grow-0 ms-3 mt-3"
                style="min-width:300px"
              >
                <p class="text-start">
                  <strong> De : </strong> {{ (message.consumer!==undefined && message.consumer!==null)?`${message.consumer?.last_name}  ${message.consumer?.first_name}`:message.pro.studio_name }}
                </p>

                <p class="text-start">
                  <strong> Le : </strong>{{ new Date(message.createdAt).toLocaleTimeString('fr-FR',{ weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour:'numeric',minute:'numeric'}) }}
                </p>
              </div>

              
              <div
                class="flex-grow-1 ms-3 rounded-3"
                style="background-color:white;"
              >
                <p class="text-start ms-3 mt-3">
                  {{ message.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-body msg">
          <form>
            <div class="form-outline form-white mb-4">
              <label
                for="exampleFormControlTextarea1"
                class="form-label"
              >Nouveau message</label>
              <textarea
                id="exampleFormControlTextarea1"
                v-model="newMessage.content"
                class="form-control"
                rows="3"
              >test</textarea>
            </div>
            
            <p class="text-success">
              {{ messageOk }}
            </p>
            <p class="text-danger">
              {{ messageNotOk }}
            </p>
            <input
              class="btn btn-primary btn-lg px-5"
              value="Envoyer"
              type="button"
              @click="validFormMessage"
            >
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
    name: 'Project',
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {

            newMessage: {

            },
            notif:false,
            messageOk:null,
            messageNotOk:null,
            successMessage: null,
            errorMessage: null,
            calendarApi: null,
            first_name_client:null,
            last_name_client:null,
            project_id:null,
            editProject: {},
            reqObject:{},
            calendarOptions: {
                plugins: [listPlugin, dayGridPlugin, interactionPlugin],
                initialView: 'listYear',
                height: 300,
                headerToolbar: {
                    start: '', // will normally be on the left. if RTL, will be on the right
                    center: '',
                    end:''
                },
                titleFormat: // will produce something like "Tuesday, September 18, 2018"
        {
            weekday: 'long',
            month: 'long',
            year: 'numeric',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        },
                locale: 'fr-FR',
                selectable: true,
                timeZone: 'locale',
                slotMinTime: "07:00:00",
                slotMaxTime: "20:00:00",
                expandRows: true,
                select: this.handleSelect,
                eventContent: this.formateEvent,
            }
        }
    },
    mounted() { 
        setTimeout(() => {
            this.scrollToBottom()
        
        }, 100);
       
        this.axios
            .get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/projet/${this.$route.params.id}`)
            .then((response) => {
               
                response.data.notifs.forEach((notif)=>{
                    if(notif.code==='msg_consumer') this.notif=true;
                })
                this.project_id=response.data.id;
                this.first_name_client=response.data.consumer.first_name;
                this.last_name_client=response.data.consumer.last_name;
                this.editProject = response.data;
                if (response.data.color)
                    this.editProject.color = "color";
                else
                    this.editProject.color = "black_and_white";
                
                if (response.data.status === "accepté")
                    this.$refs.accepted.setAttribute("selected", true);
                else if (response.data.status === "en attente")
                    this.$refs.waiting.setAttribute("selected", true);
                if (response.data.status === "refusé")
                    this.$refs.refused.setAttribute("selected", true);
                
                const rdvs = this.editProject.appointments;
                
                this.calendarApi = this.$refs.list.getApi();
                rdvs.forEach(rdv => {
                    this.calendarApi.addEvent({
                        id: rdv.id,
                        title: rdv.title,
                        extendedProps: {
                            description: rdv.note,
                        },
                        start: new Date(rdv.beginning_hour),
                        end: new Date(rdv.ending_hour)
                    });
                });
            })
            .catch(err=>console.log(err));
       
    },
    methods: {
        fixAppointment(e){
            e.preventDefault()
            this.editProjectForm();
        

            this.$router.push(`/dashboard-pro/project/${this.$route.params.id}/planning`)
        },
        async deleteNotif(e){
            try {
                
                await this.axios.post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/projet/${this.$route.params.id}/notifs`,{role:'pro'});   
                this.notif=false;
            } catch (error) {
                console.log(error);
            }
        },
        scrollToBottom(){
            let messageElm = document.querySelector(".messages");
            messageElm.scrollTop+=messageElm.scrollHeight
            console.log(messageElm.scrollTop)
        },
        handleChange(e){
            switch (e.target.getAttribute("data-field")) {
            case "title":
                this.reqObject.title=this.editProject.title;
                break;
            case "description":
                this.reqObject.description=this.editProject.description;
                break;
            case "area":
                this.reqObject.area=this.editProject.area;
                break;
            case "color":
                this.reqObject.color=this.editProject.color;
                this.reqObject.color=this.reqObject.color=== "color" ? true : false;
                break;
            case "status":
                this.reqObject.status=this.editProject.status;
                break;
            default:
                break;
            }
            console.log(this.reqObject)
        },
        validFormMessage() {
            console.log(this.newMessage);
            const idProject=this.$route.params.id;
            const proId=this.$store.state.user.id;
            console.log(idProject,proId);
            const requestObj={
                content: this.newMessage.content,
                project_id: idProject,
                pro_id: proId,
            };
       

            this.axios
                .post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/message`, requestObj)
                .then((response) => {

                    this.newMessage={};
                    this.messageOk="Votre message a bien été envoyé";
                    setTimeout(() => {
                        this.messageOk=null;
                    },2000)
                    setTimeout(() => {
                        this.scrollToBottom()
        
                    }, 100);
                    this.messageNotOk=null;
                    response.data.pro=this.$store.state.user;
                    console.log('response data', response.data)
                    this.editProject.messages.push(response.data);
        
                })
                .catch((err)=>{
                    console.log(err)
                    this.messageOk=null;
                    this.messageNotOk=err.response.data.message;
                })
        },

        editProjectForm() {

            
            this.axios
                .patch(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/projet/${this.project_id}`, this.reqObject)
                .then((response) => {
                    console.log(response.data);
                    this.errorMessage = null;
                    this.successMessage = "Vos informations ont bien été modifiées.";
                    setTimeout(() => { 
                        this.successMessage = null;
                    }, 1000);
                })
                .catch((err) => {
                    console.log(err);
                    this.successMessage = null;
                    this.errorMessage = err.response.data.message;
                    return
                })
        },
    }
}




</script>
<style>
.gradient-custom {
  /* fallback for old browsers */
  background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))
};

.flex-row {
  padding-right:500px
}

.messages{
  display: block;
  max-height: 600px;
  overflow-y: scroll;
}

;
</style>