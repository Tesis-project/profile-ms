import { Migration } from '@mikro-orm/migrations';

export class Migration20240727121958_set_metaRole extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "profile_meta_role" ("_id" uuid not null default gen_random_uuid(), "profile__id" uuid null, constraint "profile_meta_role_pkey" primary key ("_id"));');
    this.addSql('alter table "profile_meta_role" add constraint "profile_meta_role_profile__id_unique" unique ("profile__id");');

    this.addSql('create table "user_meta_contratist" ("_id" uuid not null default gen_random_uuid(), "institutes_companies" jsonb not null default \'{"name":"","rif_nif":"","direction":{"address":"","city":"","state":""},"position":"","phone":""}\', "meta_role__id" uuid null, "updated_at" timestamptz not null default \'2024-07-27 08:19:57\', constraint "user_meta_contratist_pkey" primary key ("_id"));');
    this.addSql('alter table "user_meta_contratist" add constraint "user_meta_contratist_meta_role__id_unique" unique ("meta_role__id");');

    this.addSql('create table "user_meta_artist" ("_id" uuid not null default gen_random_uuid(), "skills" jsonb not null default \'{"singer":{"voice_specialty":[],"voice_type":[]},"instrumentist":{"categories":[],"position":[],"specialty":[]},"orquests_director":{"repertoire":[],"specialty":[]},"scenes_director":{"specialty":[],"repertoire":[]}}\', "meta_role__id" uuid null, "updated_at" timestamptz not null default \'2024-07-27 08:19:57\', constraint "user_meta_artist_pkey" primary key ("_id"));');
    this.addSql('alter table "user_meta_artist" add constraint "user_meta_artist_meta_role__id_unique" unique ("meta_role__id");');

    this.addSql('alter table "profile_meta_role" add constraint "profile_meta_role_profile__id_foreign" foreign key ("profile__id") references "profile" ("_id") on update cascade on delete cascade;');

    this.addSql('alter table "user_meta_contratist" add constraint "user_meta_contratist_meta_role__id_foreign" foreign key ("meta_role__id") references "profile_meta_role" ("_id") on update cascade on delete cascade;');

    this.addSql('alter table "user_meta_artist" add constraint "user_meta_artist_meta_role__id_foreign" foreign key ("meta_role__id") references "profile_meta_role" ("_id") on update cascade on delete cascade;');

    this.addSql('alter table "profile" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "profile" alter column "updated_at" set default \'2024-07-27 08:19:57\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_meta_contratist" drop constraint "user_meta_contratist_meta_role__id_foreign";');

    this.addSql('alter table "user_meta_artist" drop constraint "user_meta_artist_meta_role__id_foreign";');

    this.addSql('drop table if exists "profile_meta_role" cascade;');

    this.addSql('drop table if exists "user_meta_contratist" cascade;');

    this.addSql('drop table if exists "user_meta_artist" cascade;');

    this.addSql('alter table "profile" alter column "updated_at" type timestamptz(6) using ("updated_at"::timestamptz(6));');
    this.addSql('alter table "profile" alter column "updated_at" set default \'2024-07-12 06:17:08+00\';');
  }

}
