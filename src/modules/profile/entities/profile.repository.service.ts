/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';

import { Pagination_I, pagination_meta } from '@tesis-project/dev-globals/dist/core/helpers';
import { Profile_Ety } from './profile.entity';


@Injectable()
export class Profile_RepositoryService extends EntityRepository<Profile_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em, Profile_Ety);
    }


    async create_profile(profile: Partial<Profile_Ety>, em?: EntityManager): Promise<Profile_Ety> {

        const _em = em ?? this.em;
        const new_profile = await _em.create(Profile_Ety, profile);
        await _em.persistAndFlush(new_profile);
        return new_profile;

    }

    async find_one(profile: Partial<Profile_Ety>, em?: EntityManager): Promise<Profile_Ety> {

        const _em = em ?? this.em;
        return await _em.findOne(Profile_Ety, profile);

    }

    async find_all(em?: EntityManager, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<Profile_Ety>> {

        const _em = em ?? this.em;

        if (!Pagination_Dto) {
            return {
                data: await _em.find(Profile_Ety, {}),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Profile_Ety, {});

        const data = await _em.find(Profile_Ety, {}, {
            limit,
            offset: (page - 1) * limit,
        });

        const meta: Pagination_I['meta'] = pagination_meta(page, limit, totalRecords);

        return {
            data,
            meta
        }

    }


    async delete_profile(profile: Partial<Profile_Ety>, em?: EntityManager): Promise<boolean> {

        const _em = em ?? this.em;
        const profile_find = await this.find_one(profile, _em);

        if (!profile_find) {
            throw new Error('profile not found');
        }

        await _em.removeAndFlush(profile_find);
        return true;

    }

    async update_profile(profile: Partial<Profile_Ety>, updateData: Partial<Profile_Ety>, em?: EntityManager): Promise<Profile_Ety> {

        const _em = em ?? this.em;

        const profile_find = await this.find_one(profile, _em);

        if (!profile_find) {
            throw new Error('profile not found');
        }

        Object.assign(profile_find, updateData);
        await _em.persistAndFlush(profile_find);
        return profile_find;

    }


}
