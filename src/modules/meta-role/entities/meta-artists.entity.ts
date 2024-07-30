import { Cascade, Entity, EntityRepositoryType, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { MetaRole_Ety } from "./meta-role.entity";
import { MetaArtists_Repository } from "./meta-artists.repository.service";
import { Meta_Artist_I } from "@tesis-project/dev-globals/dist/modules/profile/interfaces";
import { MetaArtist_Models } from "@tesis-project/dev-globals/dist/modules/profile/models";


@Entity({
    tableName: 'user_meta_artist',
    collection: 'user_meta_artist',
    repository: () => MetaArtists_Repository,
})
export class MetaArtist_Ety extends Schema_key {

    [EntityRepositoryType]?: MetaArtists_Repository;

    @Property({
        type: 'jsonb',
        default: JSON.stringify( (new MetaArtist_Models()).set_artistMeta_Blank() )
    })
    skills: Meta_Artist_I['skills'];

    @OneToOne(() => MetaRole_Ety, { cascade: [Cascade.ALL] })
    meta_role: Rel<MetaRole_Ety>;

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at? = new TempoHandler().date_now()

}