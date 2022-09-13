<template>
  <!-- Vertically centered scrollable modal -->
  <div
    ref="modal"
    class="modal fade"
    :class="{show, 'd-block': active}"
    tabindex="-1"
    role="dialog"
  >
    <div
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ modalTitle }}
          </h5>
        </div>
        <div class="modal-body">
          <p>{{ modalText }}</p>
          <button
            v-if="confirm"
            type="button"
            class="close cancel btn btn-primary m-1"
            data-dismiss="modal"
            aria-label="Close"
            @click="toggleModal"
          >
            Annuler
          </button>
          <button
            type="button"
            class="close ok btn btn-primary m-1"
            data-dismiss="modal"
            aria-label="Close"
            @click="edit"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="active"
    class="modal-backdrop fade show"
  />
  <section class=" gradient-custom">
    <div class="container py-5 h-10">
      <div class="container py-5 h-10">
        <div
          class="card"
          style="border-radius: 1rem;"
        >
          <FullCalendar
            ref="fullCalendar"
            :options="calendarOptions"
          />


          <form
            ref="formElm"
            class="form-rdv card bg-dark text-white"
          >
            <p
              ref="dataElm"
              class="data-rdv"
            >
              Date
            </p>
            <div class="form-outline form-white mb-4">
              <input
                id="titre"
                v-model="rdv.title"
                name="titre"
                type="text"
                class="form-control form-control-lg"
              >
              <label
                for="titre"
                class="form-label"
              >
                Titre du rdv
              </label>
            </div>
            <div class="form-outline form-white mb-4">
              <input
                id="description"
                v-model="rdv.note"
                name="description"
                type="text"
                class="form-control form-control-lg"
              >
              <label
                for="titre"
                class="form-label"
              >
                Description du rdv
              </label>
            </div>
            <div class="form-outline form-white mb-4">
              <label
                class="mr-sm-2 form-label"
                for="inlineFormCustomSelect"
              >Projet : </label>
              <select
                id="inlineFormCustomSelect"
                v-model="rdv.project_id"
                class="custom - select mr - sm - 2 form-control form-control-lg"
              >
                <option value="null">
                  Aucun Projet associé au RDV
                </option>
                <option
                  v-for="project in projects"
                  :key="project.id"
                  ref="accepted"
                  class="form-control form-control-lg"
                  :value="project.id"
                >
                  {{ `${project.consumer.first_name} ${project.consumer.last_name} ${project.title}`
                  }}
                </option>
              </select>
            </div>




            <input
              id="startInput"
              v-model="rdv.beginning_hour"
              name="start"
              type="hidden"
            >

            <input
              id="endInput"
              v-model="rdv.ending_hour"
              name="end"
              type="hidden"
            >

            <input
              type="button"
              class="btn btn-outline-light btn-lg px-5"
              value="ANNULER"
              @click="cancel"
            >

            <input
              ref="buttonValid"
              type="button"
              class="btn btn-outline-light btn-lg px-5"
              value="VALIDER"
              hidden
              @click="valid"
            >

            <input
              ref="buttonEdit"
              type="button"
              class="btn btn-outline-light btn-lg px-5"
              value="MODIFIER"
              hidden
              @click="modify"
            >

            <p class="text-success">
              {{ successMessage }}
            </p>
            <p class="text-danger">
              {{ errorMessage }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { end } from '@cloudinary/url-gen/qualifiers/textAlignment'

export default {
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {
            id: null,
            calendar: {},
            rdv: {},
            projects: null,
            modalTitle:null,
            modalText:null,
            confirm:false,
            active: false,
            requestObj : {},
            show: false,
            idrdv:null,
            rdvConfirm:false,
            successMessage: null,
            errorMessage: null,
            startRange: new Date(),
            endRange: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
                initialView: 'timeGrid',
                visibleRange: {
                    start: new Date(),
                    end: new Date().setDate(new Date().getDate() + 7)
                },
                customButtons: {
                    myCustomButtonToday: {
                        text: "Aujourd'hui",
                        click: this.goToday
                    },
                    myCustomButtonForward: {
                        text: '▶',
                        click: this.moveForwardOneDay
                    },
                    myCustomButtonBack: {
                        text: '◀',
                        click: this.moveBackOneDay
                    }
                },
                headerToolbar: {
                    start: 'title', // will normally be on the left. if RTL, will be on the right
                    center: '',
                    end: 'myCustomButtonToday myCustomButtonBack myCustomButtonForward'
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
                editable: true,
                timeZone: 'locale',
                slotMinTime: "07:00:00",
                slotMaxTime: "20:00:00",
                expandRows: true,
                select: this.handleSelect,
                eventDrop: this.handleEditEvent,
                eventResize: this.handleEditEvent,
                eventContent: this.formateEvent,
            }
        }
    },
    computed: {
        user() {
            return this.$store.state.user
        },
    },

    async mounted() {
        if (this.$route.params.projectId)
            this.rdv.project_id = this.$route.params.projectId;
        try {

            const response = await this.axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/projet`)
            this.projects = response.data;
            console.log(this.projects);
        } catch (error) {
            console.log(error);
        }
        try {

            const rdvs = this.$store.state.user.appointments;
            rdvs?.forEach(rdv => {
                this.$refs.fullCalendar.getApi().addEvent({
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
    },
    methods: {
        edit(e){
            console.log(e)
            if(e?.target.classList.contains('ok')){
                console.log("rdv enregistrement");
                this.axios
                    .patch(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/rdv/${this.idRdv}`, this.requestObj)
                    .then((response) => {
                        console.log(response.data)
                        this.toggleModal();
                    })
                    .catch((err) => {
                        console.log(err)
                        this.errorMessage = "Votre RDV n'a pas pu être modifié"
                        this.toggleModal();
                    });
            }


        },
        toggleModal(e) {
           
            const body = document.querySelector("body");
            this.active = !this.active;
            this.active
                ? body.classList.add("modal-open")
                : body.classList.remove("modal-open");
            setTimeout(() => (this.show = !this.show), 10);
            
            
            
        },
        goToday: function () {
            this.startRange = new Date();
            this.endRange = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            this.$refs.fullCalendar.getApi().setOption('visibleRange', {
                start: this.startRange,
                end: this.endRange
            });
        },
        moveBackOneDay: function () {
            console.log(this.startRange, this.endRange);
            this.startRange.setDate(this.startRange.getDate() - 1);
            this.endRange.setDate(this.endRange.getDate() - 1);
            this.$refs.fullCalendar.getApi().setOption('visibleRange', {
                start: this.startRange,
                end: this.endRange
            });
        },
        moveForwardOneDay: function (e) {
            this.startRange.setDate(this.startRange.getDate() + 1);
            this.endRange.setDate(this.endRange.getDate() + 1);
            this.$refs.fullCalendar.getApi().setOption('visibleRange', {
                start: this.startRange,
                end: this.endRange
            });
        },
        formateEvent: function (arg) {
            var event = arg.event;
            // console.log(arg.event.extendedProps);
            let title = document.createElement('div')
            title.classList.add("titleRdv");
            let description = document.createElement('div');
            description.classList.add("descriptionRdv");
            let del = document.createElement('div');
            let edit = document.createElement('i');
            let seeMore = document.createElement('div');
            del.classList.add("btn-del");
            seeMore.classList.add("btn-seeMore");
            seeMore.classList.add("plus");
            seeMore.id = event.id;
            seeMore.textContent = "+"
            del.id = event.id;
            del.textContent = "❌";
            let projet = document.createElement('a');
            projet.classList.add("classLink");
            projet.setAttribute("data-projectId",arg.event.extendedProps.project_id);
            projet.setAttribute("href", `${this.$route.path}/project/${arg.event.extendedProps.project_id}`);
            projet.textContent = arg.event.extendedProps.project_id ? "lien vers le projet" : "";
            edit.id = event.id;
            edit.classList.add("btn-edit");
            edit.classList.add("bi");
            edit.classList.add("bi-pencil-fill");
            edit.classList.add("btn-outline-secondary");
            edit.addEventListener("click", this.editInfoRdv);

            //----------------------------------------------gestion de l'affichage des rdv dans une pop up
            seeMore.setAttribute("data-bs-toggle", "popover");
            let popoverContent=`<p>${arg.event.title}</p>`
            if(arg.event.extendedProps.description)
                popoverContent+=`<p> ${arg.event.extendedProps.description} </p>`  
            if(arg.event.extendedProps.project_id)
            {
                popoverContent+=`<a href="/project/${`${arg.event.extendedProps.project_id}`}">Lien vers le projet</a>`
            }

            seeMore.setAttribute("data-bs-content",popoverContent);
            seeMore.setAttribute("data-bs-placement", "top");
            seeMore.setAttribute("data-triger", "hover");
            seeMore.setAttribute("data-bs-title", "RDV");
            new bootstrap.Popover(seeMore, {
                container: 'body',
                html: true
            })
            seeMore.addEventListener("click", this.displayMore)
            //----------------------------------------------------
            title.textContent = arg.event.title;
            description.textContent = arg.event.extendedProps.description;
            del.addEventListener("click", this.deleteRdv);
            seeMore.addEventListener("click", this.displayMore);
            let arrayOfDomNodes = [title, description, projet, del, edit, seeMore]
            return {
                domNodes: arrayOfDomNodes
            }
        },
        displayMore(e) {
            e.target.classList.toggle("moins");
            e.target.classList.toggle("plus");
            if (e.target.classList.contains("moins")) e.target.textContent = "-";
            else if (e.target.classList.contains("plus")) e.target.textContent = "+";
        },
        editInfoRdv(e) {
            this.$refs.formElm.style.display = "block";
            this.errorMessage = null;
            this.$refs.buttonEdit.removeAttribute("hidden");
            this.$refs.buttonEdit.id = e.target.id;
            this.$refs.buttonValid.setAttribute("hidden", "hidden");
            const rdvElm = e.target.parentNode;
            const event = this.$refs.fullCalendar.getApi().getEventById(e.target.id)._instance.range
            console.log(rdvElm)

            this.$refs.dataElm.textContent = `${this.format(event.start)} - ${this.format(event.end)}`
            this.rdv.title = rdvElm.querySelector(".titleRdv").textContent;
            this.rdv.note = rdvElm.querySelector(".descriptionRdv").textContent;
            this.rdv.project_id=rdvElm.querySelector('.classLink').getAttribute("data-projectId");


        },
        deleteRdv(e) {
            this.$refs.fullCalendar.getApi().getEventById(e.target.id).remove();
            this.axios
                .delete(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/rdv/${e.target.id}`)
                .then((response) => {
                    console.log(response.data)
                    document.querySelector(".bs-popover-auto")?.remove();
                })
                .catch((err) => {
                    console.log(err);
                    alert("erreur lors de la suppression du message.");
                });

        },
        handleSelect(info) {
            this.calendar.apiCalendar = info.view.calendar;
            let isFree = true
            this.calendar.apiCalendar.getEvents().forEach(e => {
                isFree = !isFree ? false : this.free(new Date(this.calendar.apiCalendar.getEventById(e._def.publicId)._instance
                    .range.start), new Date(info.start), this.calendar.apiCalendar
                    .getEventById(e._def.publicId)._instance.range.end,
                new Date(info.end));
            })
            if (!isFree)
            {    
                this.modalTitle="Attention"
                this.modalText="Chevauchement de rdv détecté."
                this.toggleModal();
            }
            this.errorMessage = null;
            this.$refs.formElm.style.display = "block"
            this.$refs.buttonValid.removeAttribute("hidden")
            this.$refs.buttonEdit.setAttribute("hidden", "hidden");

            // this.$refs.formElm.style.top = info.jsEvent.y+ "px";
            // this.$refs.formElm.style.left = info.jsEvent.x+ "px";

            this.$refs.dataElm.textContent = `${this.format(info.start)} - ${this.format(info.end)}`
            this.rdv.beginning_hour = info.start
            this.rdv.ending_hour = info.end;
        },
        async handleEditEvent(info) {

            console.log(info)
            this.requestObj = {}
            this.requestObj.beginning_hour = new Date(info.event._instance.range.start);
            this.requestObj.ending_hour = new Date(info.event._instance.range.end);
            console.log("changement rdv")
            this.idRdv = info.event._def.publicId
            this.modalTitle="Confirmation"
            this.modalText="Voulez vous valider la modification de rdv?"
            this.confirm=true
            this.toggleModal()
            
            //const isOk = confirm("Voulez vous valider la modification de rdv?");
           
            

        },
        free(dateStart, dateEventStart, dateEnd, dateEventEnd) {
            console.log(dateStart, dateEventEnd)
            if (dateEventEnd.getTime() > dateStart.getTime() && dateEventStart < dateEnd)
                return false

            return true
        },
        format(date) {
            return this.$refs.fullCalendar.getApi().formatDate(date, {
                weekday: 'short',
                month: 'short',
                year: 'numeric',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        cancel(e) {
            e.preventDefault();
            
            this.$refs.formElm.style.display = 'none';
            this.rdv={}
            console.log("test")
        },

        async valid(e) {

            this.rdv.pro_id = this.$store.state.user.id;
          
           
            if(this.rdv.project_id==="null")
                delete this.rdv.project_id;
           
            //enregistrement bdd
            try {
                const response = await this.axios.post(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/rdv`, this.rdv);

                console.log("rdv enregistré", this.rdv);
                this.rdv.id = response.data.id;
                //ajout sur le calendrier
                this.calendar.apiCalendar.addEvent({
                    id: this.rdv.id,
                    title: this.rdv.title,
                    extendedProps: {
                        description: this.rdv.note !== undefined ? this.rdv.note : '',
                        project_id: this.rdv.project_id !== undefined ? this.rdv.project_id : null
                    },
                    start: this.rdv.beginning_hour,
                    end: this.rdv.ending_hour,
                })
                this.$refs.formElm.style.display = 'none';
                this.rdv = {};

            } catch (error) {
                console.log(error)
                this.errorMessage = error.response.data.message;
            }


        },
        async modify(e) {
            this.$refs.formElm.style.display = 'none';
            console.log(this.rdv);
            if(this.rdv.project_id==='null'||this.rdv.project_id===undefined)
                this.rdv.project_id=null;
            //enregistrement bdd
            try {
                const response = await this.axios.patch(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}/rdv/${e.target.id}`, this.rdv);
                console.log("rdv enregistré", response);


            } catch (error) {
                console.log(error)
                this.errorMessage = error.message
            }
            const event = this.$refs.fullCalendar.getApi().getEventById(e.target.id);
            event.setProp("title", this.rdv.title);
            event.setExtendedProp("description", this.rdv.note)
            event.setExtendedProp("project_id", this.rdv.project_id)
            this.rdv = {}

        },
        async getListRdv() {
            const userId = await this.user
            console.log(userId)

            try {
                let calendarApi = this.$refs.fullCalendar.getApi()
                const response = await this.axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.id}/rdv`, this.rdv);
                const rdvs = response.data;
                console.log(rdvs);
                rdvs.forEach(rdv => {
                    console.log(rdv)
                    const rd = calendarApi.addEvent({
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
                console.log(error.message)
                console.log(`${this.$store.state.user.id}`)
            }
        }
    }
}
</script>

<style>
/* input{
    width: 500px;
    height:50px;
    display: block;
} */

/* label{
    display: block;
} */

.form-rdv {
    display: none;
    padding: 2em;
    background-color: #fff;
    border: 1px solid black;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}

.btn-del {
    width: 20px;
    height: 20px;

    background-color: rgb(255, 255, 255);
    color: rgb(242, 6, 53);
    position: absolute;
    border-radius: 5px;
    margin-bottom: 1px;
    margin-right: 1px;
    text-align: center;
    right: 0;
    bottom: 0;
}

.btn-seeMore {
    width: 20px;
    height: 20px;
    background-color: rgb(255, 255, 255);
    color: rgb(71, 87, 229);
    position: absolute;
    margin-bottom: 1px;
    border-radius: 5px;
    margin-right: 1px;
    text-align: center;
    right: 50px;
    bottom: 0;
}

.classLink {
    color: #fff;

}

.btn-edit {
    width: 20px;
    height: 20px;
    background-color: #fff;
    color: rgb(41, 205, 33);
    position: absolute;
    border-radius: 5px;
    margin-right: 1px;
    margin-bottom: 1px;
    text-align: center;
    right: 25px;
    bottom: 0;
}

.fc-timegrid-event-harness {
    overflow: hidden;
    border: #fff 1px solid;
}

body {
    font-size: large;
}

#calendar-listview {
    width: 30%;
}
</style>