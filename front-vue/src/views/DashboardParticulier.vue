<template>
  <section class=" gradient-custom">
    <div class="container py-5 h-10">
      <div class="container py-5 h-10">
        <h4 class="text-white">
          Prochains rendez-vous
        </h4>
        <div
          class="card"
          style="border-radius: 1rem;"
        >
          <FullCalendar
            ref="fullCalendar"
            :options="calendarOptions"
          />
          <p> Si vous souhaitez modifier ou annuler un rendez-vous, contactez votre tatoueur</p>
        </div>
      </div>

      <!-- Première carte projet -->
      <div class="container py-5 h-10">
        <h4 class="text-white">
          Projets
        </h4>
        <p v-if="!$store.state.user.projects.length">
          Vous n'avez pas encore de projets en cours.
        </p> 
        <div
          v-for="project in $store.state.user.projects"
          :key="project.id"
          class="container py-4"
        >
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-8">
              <div
                class="card bg-dark text-white"
                style="border-radius: 1rem;"
              >
                <div class="d-inline-flex flex-wrap m-3">
                  <p 
                    v-for="notif in project.notifs"
                    :key="notif.id"
                    class="badge bg-danger m-1"
                  >
                    <span v-if="notif.code!=='msg_consumer'">{{ notif.name }}</span>
                  </p>
                </div>
                <div class="card-body p-4">
                  <h5 style="color:burlywood">
                    <strong>
                      {{ project.title }}
                    </strong>
                  </h5>
                  <!-- <span
                    v-if="project.status=='accepté'"
                    class="badge rounded-pill bg-success m-3"
                  >
                    {{ project.status }}
                  </span>
                  <span
                    v-if="project.status=='refusé'"
                    class="badge rounded-pill bg-danger m-3"
                  >
                    {{ project.status }}
                  </span>
                  <span
                    v-if="project.status==='en attente'"
                    class="badge rounded-pill bg-light text-dark m-3"
                  >
                    {{ project.status }}
                  </span> -->
                  <p>Zone de tatouage : {{ project.area }}</p>
                  <p> Tatoueur : {{ project.pro.studio_name }}</p>
                  <!-- Ce bouton amène sur la page de projet non modifiable, seul le pro peut le faire -->
                  <router-link
                    class="btn btn-primary"
                    :data-projectId="project.id"
                    :to="{ name:'ProjectParticulier', params: {id:project.id} }"
                    role="button"
                    @click="deleteNotif"
                  >
                    Détails du projet
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
            calendar: {},
            rdv: {},
            calendarOptions: {
                plugins: [listDayPlugin, interactionPlugin],
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
    // await this.$store.dispatch('getUser');
        this.addEvents();
   
    },
    methods:{
        async deleteNotif(e){
            console.log("test")
            try {
                const projectId=e.target.getAttribute('data-projectId');
                console.log(await this.axios.post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/projet/${projectId}/notifs`,{role:'consumer'}));   
            } catch (error) {
                console.log(error);
            }
        },
        addEvents(){
            const rdvs=[];
            const projects=this.$store.state.user.projects;
            projects?.forEach(project => {
                console.log(project.appointments)
                const rdvsProject=project.appointments;
                rdvsProject?.forEach(rdv => {
                    console.log(rdv)
                    rdv.pro=project.pro.studio_name;
                    rdv.nameProject=project.title;
                    if (new Date(rdv.beginning_hour)>=new Date())
                        rdvs.push(rdv);
                });
        
            });
            console.log(rdvs)
            rdvs.forEach(rdv => {
                console.log(rdv)
                
                this.$refs.fullCalendar.getApi().addEvent({
                    id: rdv.id,
                    title: `RDV avec "${rdv.pro}" pour le projet "${rdv.nameProject}"`,
                    start: new Date(rdv.beginning_hour),
                    end: new Date(rdv.ending_hour)
                });
            });
            console.log(rdvs)
        }
    }
}
</script>