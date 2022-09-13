-- Revert inkable:notif from pg

BEGIN;

DROP TABLE
    "notif",
    "project_has_notif";

COMMIT;
