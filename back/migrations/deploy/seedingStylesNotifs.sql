-- Deploy inkable:seedingStylesNotifs to pg

BEGIN;

INSERT INTO "style" ("name")
VALUES ('floral'), ('tribal'), ('aquarelle'),('lettrage'),('japonais');
INSERT INTO "notif" ("code","name")
VALUES ('msg_pro','Nouveau(x) message(s) tatoueur'), ('msg_consumer','Nouveau(x) message(s) client'), ('new_rdv','Nouveau(x) RDV'),('edit_rdv','Modification RDV'),('delete_rdv','RDV annulé'),('edit_project','Modification projet'),('accepted_project','Projet accepté'),('denied_project','Projet refusé'),('ended_project','Projet terminé'),('deleted_project','Projet supprimé'),('archived_project','Projet archivé');

COMMIT;
