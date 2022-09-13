<template>
  <ModalDeleteCount ref="modale" />
  <section class="border-bottom pb-3 mb-3 gradient-custom">
    <div class="container py-5 h-10">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-8">
          <div
            class="card bg-dark text-white"
            style="border-radius: 1rem;"
          >
            <div class="card-body p-4 text-center">
              <div class="flex-shrink-0">
                <img
                  :src="editConsumer.profile_picture_path_consumer"
                  alt="Generic placeholder image"
                  class="img-fluid"
                  style="width: 180px; border-radius: 10px;"
                >
              </div>

              <h3>{{ consumer.first_name }}</h3>

              <h3>{{ consumer.last_name }}</h3>
            </div>

            <h4>Changer mes informations</h4>

            <div class="card-body p-4 text-center">
              <form>
                <div class="mb-3">
                  <label
                    for="email"
                    class="form-label"
                  >Nouvel Email</label>
                  <input
                    id="email"
                    v-model="editConsumer.email"
                    type="email"
                    class="form-control"
                  >
                </div>

                <div class="mb-3">
                  <label
                    for="password"
                    class="form-label"
                  >Nouveau mot de passe</label>
                  <input
                    id="password"
                    v-model="editConsumer.password"
                    type="password"
                    class="form-control"
                  >
                </div>

                <div class="mb-3">
                  <label
                    for="confirmPassword"
                    class="form-label"
                  >Confirmer le nouveau mot de
                    passe</label>
                  <input
                    id="confirmPassword"
                    v-model="editConsumer.passwordConfirm"
                    type="password"
                    class="form-control"
                  >
                </div>

                <div class="mb-3">
                  <label
                    for="file"
                    class="form-label"
                  >Selectioner une nouvelle photo de
                    profil</label>
                  <input
                    id="formFile"
                    class="form-control"
                    type="file"
                    @change="handleFile"
                  >
                </div>


                <button
                  type="submit"
                  class="btn btn-primary"
                  @click="editProfile"
                >
                  Modifier mes
                  informations
                </button>
              </form>
            </div>
            <p class="text-success m-3">
              {{ successMessage }}
            </p>
            <p class="text-danger m-3">
              {{ errorMessage }}
            </p>
            <p class="text-warning m-3">
              {{ waitingMessage }}
            </p>
            <!-- Bouton supprimer -->
            <div class="card-body p-4 text-center">
              <button
                type="button"
                class="btn btn-danger"
                @click="deleteProfile"
              >
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--Message de contact  -->
      <div class="card-body p-4 text-center text-white">
        <p>
          Pour signaler tout problèmes de comportement, images inappropriées ou bug technique, merci de nous
          contacter à : superequipe@onestcool.com
        </p>
      </div>
    </div>
  </section>
</template>


<script>
import ModalDeleteCount from '../components/ModalDeleteCount.vue';
export default {
    name: 'CompteParticulier',
    components:{ ModalDeleteCount},
    data() {
        return {
            mail: null,
            picture: false,
            editConsumer: {
            },
            consumer: {},
            successMessage: null,
            errorMessage: null,
            waitingMessage: null,
        }
    },
    mounted() {
        this.axios
            .get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/consumer/${this.$store.state.user.id}`)
            .then((response) => {
                this.consumer = response.data;
                this.editConsumer.email = response.data.email;
                // this.editConsumer.password=response.data.password;
                // this.editConsumer.passwordConfirm=this.editPro.password;
                this.editConsumer.profile_picture_path_consumer = response.data.profile_picture_path_consumer;
                this.editConsumer.email = response.data.email;
                this.mail = response.data.email;
            })
            .catch((err) => {
                console.log(err);
                return
            })
        document.querySelector('.ok-delete').addEventListener("click",()=>{
            this.axios
                .delete(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/consumer/${this.$store.state.user.id}`, )
                .then((response) => {
                    console.log(response.data);
                    this.errorMessage = null;
                    this.waitingMessage=null;
                    this.successMessage = "Votre compte a bien été supprimé, vous allez être redirigé vers la page d'accueil";
                    setTimeout(() => {
                        this.$store.dispatch('logout');
                        this.$router.push('/');   
                    }, 2000);
                })
                .catch((err) => {
                    console.log(err);
                    this.successMessage=null;
                    this.waitingMessage=null;
                    this.errorMessage = err.response.data.message;
                })
        })

    },
    methods: {
        handleFile: function (e) {
            this.$store.dispatch('createRequestObjForCloudinary', e);
            this.picture = true;
            this.errorMessage=null;
        },
        async editProfile(e) {
            e.preventDefault();
            this.successMessage=null;
            this.waitingMessage = null;
            this.errorMessage=null;
            if (this.editConsumer.password === '')
                delete this.editConsumer.password;
            if (this.editConsumer.passwordConfirm === '')
                delete this.editConsumer.passwordConfirm;
            if (this.editConsumer.password !== undefined && this.editConsumer.passwordConfirm === undefined) {
                this.errorMessage = " Vous devez  confirmer votre mot de passe"
            }
            else {
                this.waitingMessage="Veuillez patientez SVP ...";
                if (this.picture) {
                    let img;
                    try {
                        img = await this.$store.dispatch('handleUploadToCloudinary')
                        await this.$store.dispatch('transformImg',img);
                        this.editConsumer.profile_picture_path_consumer = this.$store.state.url;
                    } catch (error) {
                        console.log(error)
                    }
                }
                // si le mail n'a pas été modifié il faut supprimer la donnée car sinon on aura une erreur d'utilisateur déjà existant côté back
                if (this.editConsumer.email === this.mail)
                    delete this.editConsumer.email;
                else
                    this.mail=this.editConsumer.email;
                this.axios
                    .patch(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/consumer/${this.$store.state.user.id}`, this.editConsumer)
                    .then((response) => {
                        console.log(response.data);
                        this.errorMessage = null;
                        this.waitingMessage = null;
                        this.successMessage = "Vos informations ont bien été modifiées.";
                        if(this.picture)
                            this.successMessage+="Mise à jour de votre page...";
                        this.picture = false;
                        this.editConsumer.email = this.mail;
                        setTimeout(() => {
                            this.successMessage = null;
                        }, 2000);
                        this.editConsumer.email = this.mail;
                    })
                    .catch((err) => {
                        console.log(err);
                        this.editConsumer.email = this.mail;
                        this.successMessage=null;
                        this.waitingMessage = null;
                        this.errorMessage = err.response.data.message;
                        return
                    })
            }
        },

        async deleteProfile(e) {
            e.preventDefault();
            this.$refs.modale.toggleModal();
        },
    }
}


</script>
