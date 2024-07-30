import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Update_Meta_Contratist_Dto } from '@tesis-project/dev-globals/dist/modules/profile/dto';
import { ExceptionsHandler } from '../../../core/helpers';
import { EntityManager } from '@mikro-orm/core';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { MetaRole_Repository } from '../entities/meta-role.repository.service';
import { Profile_Ety } from '../../profile/entities/profile.entity';
import { RpcException } from '@nestjs/microservices';
import { MetaRole_Ety } from '../entities';

@Injectable()
export class MetaRoleService {

    private readonly logger = new Logger('MetaRoleService');
    ExceptionsHandler = new ExceptionsHandler();
    service: string = 'MetaRoleService';

    constructor(
        private readonly _MetaRole_Repository: MetaRole_Repository,
        private readonly em: EntityManager,
    ) {

    }

    /*   create(createMetaRoleDto: CreateMetaRoleDto) {
        return 'This action adds a new metaRole';
      } */

    async find_oneMetaRole(user_auth: Auth_User_I_Dto): Promise<_Response_I<MetaRole_Ety>> {

        let _Response: _Response_I<MetaRole_Ety>;

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

            const meta_role = await this._MetaRole_Repository.findOne({
                profile: profile
            }, {
                populate: ['meta_artist', 'meta_contratist']
            });

            if (!meta_role) {

                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Meta rol no encontrado'
                }
                throw new RpcException(_Response)

            }

            _Response = {
                ok: true,
                data: meta_role,
                statusCode: HttpStatus.OK,
                message: 'Meta rol encontrado'
            }

        } catch (error) {

            console.log('error', error);

            this.logger.error(`[Set contratist meta] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.set_metaContratist`);

        }

        return _Response;

    }



}
