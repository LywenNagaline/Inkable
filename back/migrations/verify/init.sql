-- Verify inkable:init on pg

BEGIN;

SELECT id FROM "pro" WHERE false;

SELECT id FROM "consumer" WHERE false;

SELECT id FROM "project" WHERE false;

SELECT id FROM "tatoo" WHERE false;

SELECT id FROM "appointment" WHERE false;

SELECT id FROM "message" WHERE false;

SELECT id FROM "style" WHERE false;

SELECT id FROM "city" WHERE false;

SELECT id FROM "categorise" WHERE false;


ROLLBACK;
