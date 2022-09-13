-- Deploy inkable:notif to pg

BEGIN;

CREATE TABLE
    "notif" (
        "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "code" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ
    );

CREATE TABLE
    "project_has_notif" (
        "project_id" INT NOT NULL REFERENCES "project" ("id") ON DELETE CASCADE,
        "notif_id" INT NOT NULL REFERENCES "notif" ("id") ON DELETE CASCADE,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("project_id", "notif_id") -- on crée une clé composite, une clé composée de plusieurs colonnes, ça garantit l'unicité de la combinaison
    );

COMMIT;
