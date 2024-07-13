import { Migration } from '@mikro-orm/migrations';

export class Migration20240712101708_setup_profile extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "profile" ("_id" uuid not null default gen_random_uuid(), "artistic_name" varchar(255) null, "bio_short" varchar(255) null, "profile_pic" jsonb null, "cover_pic" jsonb null, "credentials" jsonb null default \'{"identity_file":{},"profesional_file":{}}\', "media" jsonb null default \'{"image_gallery":[],"video_gallery":[]}\', "socials" jsonb null default \'{"facebook":"","twitter":"","instagram":"","youtube":"","tiktok":""}\', "user" varchar(255) not null, "updated_at" timestamptz not null default \'2024-07-12 06:17:08\', constraint "profile_pkey" primary key ("_id"));');
    this.addSql('alter table "profile" add constraint "profile_user_unique" unique ("user");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "profile" cascade;');
  }

}
