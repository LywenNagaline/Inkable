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
                  :src="editPro.profile_picture_path_pro"
                  alt="Generic placeholder image"
                  class="img-fluid"
                  style="width: 180px; border-radius: 10px;"
                >
              </div>

              <h3>{{ editPro.studio_name }}</h3>

              <h3>{{ editPro.city }}</h3>
            </div>

            <h4>Modifier mes informations</h4>

            <div class="card-body p-4 text-center">
              <form>
                <div class="mb-3">
                  <label
                    for="studioName"
                    class="form-label"
                  >Nouveau nom de studio</label>
                  <input
                    id="studioName"
                    v-model="editPro.studio_name"
                    type="text"
                    class="form-control "
                  >
                </div>

                <div class="mb-3">
                  <label
                    for="city"
                    class="form-label"
                  >Nouvelle ville</label>
                  <input
                    id="city"
                    v-model="editPro.city"
                    type="text"
                    class="form-control"
                  >
                </div>

                <div class="mb-3">
                  <label
                    for="email"
                    class="form-label"
                  >Nouvel Email</label>
                  <input
                    id="email"
                    v-model="editPro.email"
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
                    v-model="editPro.password"
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
                    v-model="editPro.passwordConfirm"
                    type="password"
                    class="form-control"
                  >
                </div>

                <div class="mb-3">
                  <label
                    for="file"
                    class="form-label"
                  >Selectionner une nouvelle photo de
                    profil</label>
                  <input
                    id="formFile"
                    class="form-control form-control-lg"
                    type="file"
                    @change="handleFile"
                  >
                </div>

                <div class="mb-3">
                  <label
                    for="description"
                    class="form-label"
                  >Une courte description de votre
                    salon</label>
                  <textarea
                    id="description"
                    v-model="editPro.description"
                    class="form-control"
                  />
                </div>

                <div class="mb-3">
                  <label
                    for="instagram"
                    class="form-label"
                  >Nouveau compte Instagram</label>
                  <input
                    id="instagram"
                    v-model="editPro.instagram"
                    type="text"
                    class="form-control"
                  >
                </div>

                <!-- Colroation des tatouages -->
                <div class="mb-3">
                  <h4>Coloration des tatouages</h4>

                  <div class="form-outline form-white mb-4 form-check-inline">
                    <input
                      id="color"
                      v-model="editPro.color"
                      class="form-check-input me-2"
                      type="checkbox"
                      value="color"
                    >
                    <label
                      class="form-check-label-inline"
                      for="color"
                    >
                      Tatouages couleur
                    </label>
                  </div>

                  <div class="form-outline form-white mb-4 form-check-inline">
                    <input
                      id="bAndW"
                      v-model="editPro.black_and_white"
                      class="form-check-input me-2"
                      type="checkbox"
                      value="bAndW"
                    >
                    <label
                      class="form-check-label-inline"
                      for="bAndW"
                    >
                      Tatouages noir et blanc
                    </label>
                  </div>
                </div>

                <!-- Style des tatouages -->
                <div class="mb-3">
                  <h4>Styles de tatouages</h4>
                  <div
                    v-for="style in $store.state.styles"
                    :key="style.id"
                    class="form-outline form-white mb-4 form-check-inline"
                  >
                    <input
                      :id="style"
                      v-model="editPro.styles"
                      class="form-check-input me-2"
                      type="checkbox"
                      :value="style"
                    >
                    <label
                      class="form-check-label-inline"
                      :for="style"
                    >
                      {{ style }}
                    </label>
                  </div>
                </div>


                <button
                  type="submit"
                  class="btn btn-primary"
                  @click="editProfile"
                >
                  Modifier mes
                  informations
                </button>

                <p class="text-success m-3">
                  {{ successMessage }}
                </p>
                <p class="text-danger m-3">
                  {{ errorMessage }}
                </p>
                <p class="text-warning m-3">
                  {{ waitingMessage }}
                </p>
              </form>
            </div>

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
    name: "ComptePro",
    components: { ModalDeleteCount},
    data() {
        return {
            mail: null,
            picture: false,
            editPro: {
                styles: [],
                color: false,
                black_and_white: false
            },
            pro: {},
            successMessage: null,
            errorMessage: null,
            waitingMessage: null
        };
    },
    async created() {
        this.axios
            .get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}`)
            .then((response) => {
                console.log(response.data);
                this.editPro.studio_name = response.data.studio_name;
                this.editPro.black_and_white = response.data.black_and_white;
                this.editPro.color = response.data.color;
                this.editPro.city = response.data.city;
                // this.editPro.password=response.data.password;
                // this.editPro.passwordConfirm=this.editPro.password;
                this.editPro.email = response.data.email;
                this.mail = response.data.email;
                this.editPro.description = response.data.description;
                this.editPro.instagram = response.data.instagram;
                this.editPro.profile_picture_path_pro = response.data.profile_picture_path_pro;
                this.editPro.styles = response.data.styles.map((item) => item.name);
            })
            .catch((err) => {
                console.log(err);
                return;
            });
    },
    mounted(){
        document.querySelector('.ok-delete').addEventListener("click",()=>{
            console.log("supprimer")
            this.axios
                .delete(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}`)
                .then((response) => {
                    console.log(response.data);
                    this.errorMessage = null;
                    this.waitingMessage = null;
                    this.successMessage = "Votre compte a bien été supprimé, vous allez être redirigé vers la page d'accueil";
                    setTimeout(() => {
                        this.$store.dispatch("logout");
                        this.$router.push("/");
                    },2000)

                        
                })
                .catch((err) => {
                    console.log(err);
                    this.successMessage = null;
                    this.waitingMessage = null;
                    this.errorMessage = err.response.data.message;
                });


        })
    },
    methods: {
        addInputPicture: function () {
            const parentElm = this.$refs.containerInputs;
            const inputElm = document.createElement("input");
            inputElm.setAttribute("type", "file");
            inputElm.classList.add("form-control");
            inputElm.addEventListener("change", this.handleFile);
            parentElm.appendChild(inputElm);
        },
        handleFile: async function (e) {
            this.$store.dispatch("createRequestObjForCloudinary", e);
            this.picture = true;
        },
        async editProfile(e) {
            e.preventDefault();
            this.successMessage = null;
            this.errorMessage = null;
            this.waitingMessage = "Veuillez patientez SVP ...";
            console.log(this.editPro);
            if (this.editPro.password === "")
                delete this.editPro.password;
            if (this.editPro.passwordConfirm === "")
                delete this.editPro.passwordConfirm;
            if (this.editPro.password !== undefined && this.editPro.passwordConfirm === undefined) {
                this.waitingMessage = null;
                this.successMessage = null;
                this.errorMessage = " Vous devez confirmer votre mot de passe";
            }
            else {
                if (this.picture) {
                    let img;
                    try {
                        img = await this.$store.dispatch("handleUploadToCloudinary");
                        await this.$store.dispatch("transformImg", img);
                        this.editPro.profile_picture_path_pro = this.$store.state.url;
                    }
                    catch (error) {
                        this.waitingMessage = null;
                        this.errorMessage = "Erreur d'envoi de la photo";
                        console.log(error);
                    }
                }
                // si le mail n'a pas été modifié il faut supprimer la donnée car sinon on aura une erreur d'utilisateur déjà existant côté back
                if (this.editPro.email === this.mail)
                    delete this.editPro.email;
                else
                    this.mail = this.editPro.email;
                this.axios
                    .patch(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.$store.state.user.id}`, this.editPro)
                    .then((response) => {
                        this.errorMessage = null;
                        this.waitingMessage = null;
                        this.successMessage = "Vos informations ont bien été modifiées.";
                        if (this.picture)
                            this.successMessage += "Mise à jour de votre page...";
                        this.picture = false;
                        this.editPro.email = this.mail;
                        setTimeout(() => {
                            this.successMessage = null;
                            this.waitingMessage = null;
                        }, 2000);
                    })
                    .catch((err) => {
                        console.log(err);
                        this.editPro.email = this.mail;
                        this.successMessage = null;
                        this.waitingMessage = null;
                        this.errorMessage = err.response.data.message;
                    });
            }
        },
        async deleteProfile(e) {
            e.preventDefault();
            this.$refs.modale.toggleModal();
        },
    }
}


</script>