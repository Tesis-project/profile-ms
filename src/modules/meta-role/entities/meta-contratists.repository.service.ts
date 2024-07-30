import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";
import { _Process_Save_I, _Find_Many_I, _Process_Delete_I, _Process_Update_I } from "@tesis-project/dev-globals/dist/core/interfaces";

import { Pagination_Dto } from "@tesis-project/dev-globals/dist/core/dto";
import { MetaContratist_Ety } from "./meta-contratists.entity";


@Injectable()
export class MetaContratists_Repository extends EntityRepository<MetaContratist_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), MetaContratist_Ety);
    }

    async create_metaContratists({ save, _em }: _Process_Save_I<MetaContratist_Ety>): Promise<MetaContratist_Ety> {

        const new_metaContratists = await _em.create(MetaContratist_Ety, save);
        await _em.persist(new_metaContratists);
        return new_metaContratists;

    }

    async find_all({ find, options, _em }: _Find_Many_I<MetaContratist_Ety, 'MetaContratist_Ety'>, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<MetaContratist_Ety>> {

        if (!Pagination_Dto) {
            return {
                data: await this.find(find, options),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(MetaContratist_Ety, find);

        const data = await _em.find(MetaContratist_Ety, find, {
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

    async delete_metaContratists({ find, _em }: _Process_Delete_I<MetaContratist_Ety>): Promise<boolean> {

        const user_find = await this.findOne(find);

        if (!user_find) {
            throw new Error('Meta contratists not found');
        }

        await _em.nativeDelete(MetaContratist_Ety, {
            _id: user_find._id
        });
        return true;

    }

    async update_metaContratists({ find, update, _em }: _Process_Update_I<MetaContratist_Ety>): Promise<MetaContratist_Ety> {

        const user_find = await this.findOne(find);

        if (!user_find) {
            throw new Error('Meta contratists not found');
        }

        Object.assign(user_find, update);
        await _em.persist(user_find);
        return user_find;

    }


}
