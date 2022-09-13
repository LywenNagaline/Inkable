<template>
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
            Confirmation suppression de compte
          </h5>
        </div>
        <div class="modal-body">
          <p>Voulez-vous vraiment supprimer votre compte ?</p>
          <button
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
            class="close ok-delete btn btn-primary m-1"
            data-dismiss="modal"
            aria-label="Close"
            @click="toggleModal"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'ModalDeleteCount',
    data(){
        return{ 
            modalTitle:null,
            modalText:null,
            confirm:false,
            active: false,
            show: false,}
    },
    methods:{
        toggleModal(e) {
           
            const body = document.querySelector("body");
            this.active = !this.active;
            this.active
                ? body.classList.add("modal-open")
                : body.classList.remove("modal-open");
            setTimeout(() => (this.show = !this.show), 10);
            
           
           
        },
    }
}
</script>