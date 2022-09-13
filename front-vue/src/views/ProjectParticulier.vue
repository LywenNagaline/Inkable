<template>
  <section class=" gradient-custom">
    <div class="container py-5 h-100">
      <div
        v-if="notif"
        ref="notifs"
        class=" top-0 badge m-1"
      >
        <button
          type="button"
          class="btn-close m-1 bg-light"
          aria-label="Close"
          @click="deleteNotif"
        />
          
        <p
          v-for="n in project.notifs"
          :key="n.id"
          class="d-block"
        >
          <span
            v-if="n.code!=='msg_consumer'"
            class="badge bg-danger m-1 fs-6"
          >{{ n.name }}</span>
        </p>
      </div>
      <div
        class="card bg-dark text-white"
        style="border-radius: 1rem;"
      >
        <div class="card-body">
          <h3><strong>Tatoueur : </strong>{{ pro_name }}</h3>
        </div>
        
        
        <div class="card-body">
          <h1 class="card-title">
            {{ project.title }}
          </h1>
          <br>
          <h3 class="card-subtitle mb-2 text-muted">
            Description du projet
          </h3>
          <p class="card-text">
            {{ project.description }}
          </p>
        </div>

        <div class="card-body">
          <!-- Division en 2 colonnes -->
          <div class="d-flex ">
            <!-- Côté gauche -->
            <div class="flex-grow-1 ms-3">
              <!-- Titre --> 
              <h3 class="card-subtitle mb-2 text-muted">
                Zone à tatouer
              </h3>
              <!-- Zone où doit apparaitre le text écrit dans le formulaire -->
              <p class="card-text">
                {{ project.area }}
              </p>
            </div>

            <!-- Côté droit -->
            <div class="flex-grow-1 ms-3">
              <!-- Titre -->
              <h3 class="card-subtitle mb-2 text-muted">
                Coloration
              </h3>
              <p class="card-text">
                {{ project.color }}
              </p>
            </div>
          </div>
        </div>

        <!-- Statut -->
        <div class="card-body">
          <!-- Titre -->
          <h3 class="card-subtitle mb-2 text-muted">
            Statut
          </h3>
          <!-- Label statut -->
          <div>
            <span class="badge text-bg-light">{{ project.status }}</span>
          </div>
        </div>    

        <div class="card-body">
          <p class="text-muted">
            Pour modifier votre projet, prenez contact avec votre tatoueur
          </p>
        </div>
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
        <!--Conteneur des messages à dupplique en cas de nouveau message-->
        <div
          v-for="message in project.messages"
          :key="message.id"
          class="container_messages py-3 h-100"
        >
          <div class="card-body">
            <div
              class="d-flex rounded-3 text-black"
              style="background-color: #efefef;"
            >
              <!-- Côté gauche -->
              <div
                class="flex-grow-0 ms-3 mt-3 "
                style="min-width:300px"
              >
                <p class="text-start">
                  <strong> De : </strong>{{ (message.consumer!==null)?`${message.consumer?.last_name}  ${message.consumer?.first_name}`:message.pro.studio_name }}
                </p>

                <p class="text-start">
                  <strong> Le : </strong> {{ new Date(message.createdAt).toLocaleTimeString('fr-FR',{ weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour:'numeric',minute:'numeric'}) }}
                </p>
              </div>

              <!-- Côté droit -->
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

        <div class="card-body">
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
              />
            </div>

            <p class="text-success">
              {{ messageSuccess }}
            </p>
            <p class="text-danger">
              {{ messageError }}
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
    name: 'ProjectParticulier',
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {
            newMessage: {

            },
            notif:false,
            messageSuccess: null,
            messageError: null,
            calendarApi: null,
            project_id:null,
            pro_name:null,
            project: {},
            calendarOptions: {
                plugins: [listPlugin, dayGridPlugin, interactionPlugin],
                initialView: 'listYear',
                height: 300,
                headerToolbar: {
                    start: '', // will normally be on the left. if RTL, will be on the right
                    center: '',
                    end: ''
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

    async mounted() {
        setTimeout(() => {
            this.scrollToBottom()
        
        }, 100);
        this.axios
            .get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/projet/${this.$route.params.id}`)
            .then((response) => {
                this.project=response.data;
                this.pro_name=response.data.pro.studio_name;
                this.statusColor();
                console.log(this.project)
                
                response.data.notifs.forEach((notif)=>{
                    if(notif.code!=='msg_consumer') this.notif=true;
                })
                if (response.data.color)
                    this.project.color = "Couleur";
                else
                    this.project.color = "Noir et blanc";

                const rdvs = this.project.appointments;
                console.log(this.$refs)

                this.calendarApi = this.$refs.list.getApi();
                console.log(this.calendarApi)

                rdvs.forEach(rdv => {
                    this.calendarApi.addEvent({
                        id: rdv.id,
                        title: `RDV avec "${this.project.pro.studio_name}"  ${rdv.note?'pour : '+rdv.note:''}`,
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
        async deleteNotif(e){
            try {
                
                await this.axios.post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/projet/${this.$route.params.id}/notifs`,{role:'consumer'});   
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
        validFormMessage() {
            console.log(this.newMessage);
            const idProject=this.$route.params.id;
            const consumerId=this.$store.state.user.id;
            const requestObj={
                content: this.newMessage.content,
                project_id: idProject,
                consumer_id: consumerId,
            };
    
            this.axios
                .post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/message`, requestObj)
                .then((response) => {

                    this.newMessage={};
                    this.messageSuccess="Votre message a bien été envoyé";
                    setTimeout(() => {
                        this.messageSuccess=null;
                    },2000)
                    setTimeout(() => {
                        this.scrollToBottom()
                    }, 100);
                    this.messageError=null;
                    response.data.consumer=this.$store.state.user;
                    console.log('response data', response.data)
                    this.project.messages.push(response.data);
        
                })
                .catch((err)=>{
                    console.log(err)
                    this.messageSuccess=null;
                    this.messageError=err.response.data.message;
                })
        },

        statusColor(){
            const statut = this.project.status;
            console.log('statut',statut)
            if(statut==='accepté') {
                document.querySelector(".text-bg-light").classList.add("text-bg-success");
                document.querySelector(".text-bg-light").classList.remove("text-bg-light");
            }
            if(statut==='refusé') {
                document.querySelector(".text-bg-light").classList.add("text-bg-danger");
                document.querySelector(".text-bg-light").classList.remove("text-bg-light");
            }
        }
    },
}
</script>
<style>

.gradient-custom {
/* fallback for old browsers */
background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))
};
.messages{
  max-height: 600px;
  overflow-y: scroll;
}
</style>