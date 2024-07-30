import { Cascade, Entity, EntityRepositoryType, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { Profile_Ety } from "../../profile/entities/profile.entity";
import { MetaContratist_Ety } from "./meta-contratists.entity";
import { MetaArtist_Ety } from "./meta-artists.entity";
import { MetaRole_Repository } from "./meta-role.repository.service";


@Entity({
    tableName: 'profile_meta_role',
    collection: 'profile_meta_role',
    repository: () => MetaRole_Repository
})
export class MetaRole_Ety extends Schema_key {

    [EntityRepositoryType]?: MetaRole_Repository;

    @OneToOne(() => MetaArtist_Ety, meta => meta.meta_role, { mappedBy: 'meta_role', orphanRemoval: true })
    meta_artist: Rel<MetaArtist_Ety>;

    @OneToOne(() => MetaContratist_Ety, meta => meta.meta_role, { mappedBy: 'meta_role', orphanRemoval: true })
    meta_contratist: Rel<MetaContratist_Ety>;

    @OneToOne(() => Profile_Ety, { cascade: [Cascade.ALL] })
    profile: Rel<Profile_Ety>;

}