import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Update_Meta_Contratist_Dto } from '@tesis-project/dev-globals/dist/modules/profile/dto';
import { ExceptionsHandler } from '../../../core/helpers';
import { EntityManager } from '@mikro-orm/core';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { MetaRole_Repository } from '../entities/meta-role.repository.service';
import { Profile_Ety } from '../../profile/entities/profile.entity';
import { RpcException } from '@nestjs/microservices';
import { MetaContratist_Ety, MetaContratists_Repository } from '../entities';
import * as uuid from 'uuid';

@Injectable()
export class MetaContratistsService {

    private readonly logger = new Logger('MetaContratistsService');
    ExceptionsHandler = new ExceptionsHandler();
    service: string = 'MetaContratistsService';

    constructor(
        private readonly _MetaRole_Repository: MetaRole_Repository,
        private readonly _MetaContratist_Repository: MetaContratists_Repository,
        private readonly em: EntityManager,
    ) {

    }

    async set_contratistMeta(createMetaRoleDto: Update_Meta_Contratist_Dto, user_auth: Auth_User_I_Dto): Promise<_Response_I<MetaContratist_Ety>> {

        let _Response: _Response_I;

        const {
            institutes_companies
        } = createMetaRoleDto;

        try {

            const f_em = this.em.fork();
            const _profile_repository = await f_em.getRepository(Profile_Ety);

            const profile = await _profile_repository.findOne({
                user: user_auth.user
            });

            if (!profile) {

                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Perfil no encontrado'
                }
                throw new RpcException(_Response)

            }

            let meta_role = await this._MetaRole_Repository.findOne({
                profile: profile
            }, {
                populate: ['meta_contratist']
            });

            if (!meta_role) {

                const meta_role_id: string = uuid.v4();

                meta_role = {
                    meta_artist: {
                        _id: uuid.v4()
                    } as any,
                    meta_contratist: {
                        _id: uuid.v4(),
                        institutes_companies: {
                            ...institutes_companies
                        }
                    } as any,
                    profile: profile,
                    _id: meta_role_id

                }

                const metaRoleSaved = await this._MetaRole_Repository.create_metaRole({
                    save: meta_role,
                    _em: f_em
                })

            f_em.flush();
                _Response = {
                    data: metaRoleSaved,
                    ok: true,
                    statusCode: HttpStatus.CREATED,
                };

            } else {

                const metaRoleSaved = await this._MetaContratist_Repository.update_metaContratists({
                    find: meta_role.meta_contratist,
                    update: {
                        institutes_companies: {
                            ...institutes_companies
                        }
                    },
                    _em: f_em
                });

            f_em.flush();
                 _Response = {
                    data: metaRoleSaved,
                    ok: true,
                    statusCode: HttpStatus.OK,
                };

            }

            _Response = {
                ..._Response,
                message: 'Meta contratista actualizada'
            };

        } catch (error) {

            console.log('error', error);
            this.logger.error(`[Set meta contratists] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.set_contratistMeta`);

        }

        return _Response;

    }

}
