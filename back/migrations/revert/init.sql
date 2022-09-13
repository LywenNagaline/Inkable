-- Revert inkable:init from pg

BEGIN;

DROP TABLE
    "categorise",
    "style",
    "message",
    "appointment",
    "tattoo",
    "project",
    "consumer",
    "pro";

DROP DOMAIN "zipcode", "email";

COMMIT;