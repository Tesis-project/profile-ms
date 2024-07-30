import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";
import { _Process_Save_I, _Find_Many_I, _Process_Delete_I, _Process_Update_I } from "@tesis-project/dev-globals/dist/core/interfaces";

import { Pagination_Dto } from "@tesis-project/dev-globals/dist/core/dto";
import { MetaArtist_Ety } from "./meta-artists.entity";


@Injectable()
export class MetaArtists_Repository extends EntityRepository<MetaArtist_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), MetaArtist_Ety);
    }

    async create_metaArtists({ save, _em }: _Process_Save_I<MetaArtist_Ety>): Promise<MetaArtist_Ety> {

        const new_metaArtists = await _em.create(MetaArtist_Ety, save);
        await _em.persist(new_metaArtists);
        return new_metaArtists;

    }

    async find_all({ find, options, _em }: _Find_Many_I<MetaArtist_Ety, 'MetaArtist_Ety'>, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<MetaArtist_Ety>> {

        if (!Pagination_Dto) {
            return {
                data: await this.find(find, options),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(MetaArtist_Ety, find);

        const data = await _em.find(MetaArtist_Ety, find, {
            ...options,
            limit,
            offset: (page - 1) * limit,
        });

        const meta: Pagination_I['meta'] = pagination_meta(page, limit, totalRecords);

        return {
            data,
            meta
        }

    }

    async delete_metaArtists({ find, _em }: _Process_Delete_I<MetaArtist_Ety>): Promise<boolean> {

        const meta_find = await this.findOne(find);

        if (!meta_find) {
            throw new Error('Meta artists not found');
        }

        await _em.nativeDelete(MetaArtist_Ety, {
            _id: meta_find._id
        });
        return true;

    }

    async update_metaArtists({ find, update, _em }: _Process_Update_I<MetaArtist_Ety>): Promise<MetaArtist_Ety> {

        const meta_find = await this.findOne(find);

        if (!meta_find) {
            throw new Error('Meta artists not found');
        }

        Object.assign(meta_find, update);
        await _em.persist(meta_find);
        return meta_find;

    }


}
