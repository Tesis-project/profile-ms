

import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';

import { Pagination_I, pagination_meta } from '@tesis-project/dev-globals/dist/core/helpers';
import { Profile_Ety } from './profile.entity';
import { _Find_Many_I, _Find_One_I, _Process_Save_I, _Process_Update_I, _Process_Delete_I } from '@tesis-project/dev-globals/dist/core/interfaces';


@Injectable()
export class Profile_RepositoryService extends EntityRepository<Profile_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), Profile_Ety);
    }


    async create_profile({ save, _em }: _Process_Save_I<Profile_Ety>): Promise<Profile_Ety> {

        const new_profile = await _em.create(Profile_Ety, save);
        await _em.persist(new_profile);
        return new_profile;

    }

    async find_all( { find = {}, options, _em }: _Find_Many_I<Profile_Ety, 'Profile_Ety'>, Pagination_Dto: Pagination_Dto ): Promise<Pagination_I<Profile_Ety>> {


        if (!Pagination_Dto) {
            return {
                data: await _em.find(Profile_Ety, find, options),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Profile_Ety, find);

        const data = await _em.find(Profile_Ety, find, {
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


    async delete_profile({ find, _em }: _Process_Delete_I<Profile_Ety>): Promise<boolean> {

        const profile_find = await this.findOne(find);

        if (!profile_find) {
            throw new Error('profile not found');
        }

         await _em.nativeDelete(Profile_Ety, {
            _id: profile_find._id
        });
        return true;
    }

    async update_profile({ find, update, _em}: _Process_Update_I<Profile_Ety>): Promise<Profile_Ety> {


        const profile_find = await this.findOne(find);

        if (!profile_find) {
            throw new Error('profile not found');
        }

        Object.assign(profile_find, update);
        await _em.persist(profile_find);
        return profile_find;

    }


}
