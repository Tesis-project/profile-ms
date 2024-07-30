import { Cascade, Entity, EntityRepositoryType, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { MetaRole_Ety } from "./meta-role.entity";
import { Meta_Contratist_I } from "@tesis-project/dev-globals/dist/modules/profile/interfaces";
import { MetaContratists_Repository } from "./meta-contratists.repository.service";
import { MetaContratists_Models } from "@tesis-project/dev-globals/dist/modules/profile/models";

@Entity({
    tableName: 'user_meta_contratist',
    collection: 'user_meta_contratist',
    repository: () => MetaContratists_Repository,
})
export class MetaContratist_Ety extends Schema_key {

    [EntityRepositoryType]?: MetaContratists_Repository;

    @Property({
        type: 'jsonb',
        default: JSON.stringify( (new MetaContratists_Models()).set_contratistsMeta_Blank() )
    })
    institutes_companies: Meta_Contratist_I['institutes_companies'];

    @OneToOne(() => MetaRole_Ety, { cascade: [Cascade.ALL] })
    meta_role: Rel<MetaRole_Ety>;

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at? = new TempoHandler().date_now()

}