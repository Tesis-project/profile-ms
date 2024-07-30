import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { MetaRole_Ety } from "./meta-role.entity";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";
import { _Process_Save_I, _Find_Many_I, _Process_Delete_I, _Process_Update_I } from "@tesis-project/dev-globals/dist/core/interfaces";

import { Pagination_Dto } from "@tesis-project/dev-globals/dist/core/dto";


@Injectable()
export class MetaRole_Repository extends EntityRepository<MetaRole_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), MetaRole_Ety);
    }

    async create_metaRole({ save, _em }: _Process_Save_I<MetaRole_Ety>): Promise<MetaRole_Ety> {

        const new_metaRole = await _em.create(MetaRole_Ety, save);
        await _em.persist(new_metaRole);
        return new_metaRole;

    }

    async find_all({ find, options, _em }: _Find_Many_I<MetaRole_Ety, 'MetaRole_Ety'>, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<MetaRole_Ety>> {

        if (!Pagination_Dto) {
            return {
                data: await this.find(find, options),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(MetaRole_Ety, find);

        const data = await _em.find(MetaRole_Ety, find, {
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

    async delete_metaRole({ find, _em }: _Process_Delete_I<MetaRole_Ety>): Promise<boolean> {

        const user_find = await this.findOne(find);

        if (!user_find) {
            throw new Error('Meta role not found');
        }

        await _em.nativeDelete(MetaRole_Ety, {
            _id: user_find._id
        });
        return true;

    }

    async update_metaRole({ find, update, _em }: _Process_Update_I<MetaRole_Ety>): Promise<MetaRole_Ety> {

        const user_find = await this.findOne(find);

        if (!user_find) {
            throw new Error('Meta role not found');
        }

        Object.assign(user_find, update);
        await _em.persist(user_find);
        return user_find;

    }


}
