
import { Entity, Property } from "@mikro-orm/core";
import { TempoHandler } from '@tesis-project/dev-globals/dist/core/classes';
import { Schema_key } from "../../../core/entities_global";

import { Profile_I } from "@tesis-project/dev-globals/dist/modules/profile/interfaces";
import { Media_I } from "@tesis-project/dev-globals/dist/modules/media/interfaces";


@Entity({
    tableName: 'profile',
    collection: 'profile'
})
export class Profile_Ety extends Schema_key {

    @Property({
        type: 'varchar',
        nullable: true
    })
    artistic_name?: string;

    @Property({
        type: 'varchar',
        nullable: true
    })
    bio_short?: string;

    @Property({
        type: 'jsonb',
        nullable: true,
    })
    profile_pic?: Media_I;

    @Property({
        type: 'jsonb',
        nullable: true,
    })
    cover_pic?: Media_I;

    @Property({
        type: 'jsonb',
        nullable: true,
        default: JSON.stringify({
            "identity_file": {},
            "profesional_file": {}
        })
    })
    credentials?: Profile_I['credentials'];

    @Property({
        type: 'jsonb',
        nullable: true,
        default: JSON.stringify({
            "image_gallery": [],
            "video_gallery": []
        })
    })
    media?: Profile_I['media'];

    @Property({
        type: 'jsonb',
        nullable: true,
        default: JSON.stringify({
            "facebook": "",
            "twitter": "",
            "instagram": "",
            "youtube": "",
            "tiktok": "",
        })
    })
    socials?: Profile_I['socials'];

    @Property({
        type: 'varchar',
        unique: true
    })
    user: any;

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at = new TempoHandler().date_now()

}