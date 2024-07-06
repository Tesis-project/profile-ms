
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Update_Profile_Dto, Create_Profile_Dto } from '@tesis-project/dev-globals/dist/modules/profile/dto';
import { EntityManager } from '@mikro-orm/postgresql';

import { ExceptionsHandler } from '../../core/helpers';
import { Profile_RepositoryService } from './entities/profile.repository.service';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { RpcException } from '@nestjs/microservices';
import * as uuid from 'uuid';

@Injectable()
export class ProfileService {

    private readonly logger = new Logger('ProfileService');

    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _Profile_RepositoryService: Profile_RepositoryService,
           private readonly em: EntityManager,
    ) {

    }

    async create(createProfileDto: Create_Profile_Dto) {

        let _Response: _Response_I;

        const {
            user
        } = createProfileDto;

        try {

            const f_em = this.em.fork();
            const resp_user = await this._Profile_RepositoryService.findOne( user );

            if (resp_user) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `El perfil ya existe`,
                }
                throw new RpcException(_Response)
            }

            const new_profile = await this._Profile_RepositoryService.create_profile({
                save: {
                    ...createProfileDto,
                    _id: uuid.v4()
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: HttpStatus.CREATED,
                message: 'Perfil creado correctamente',
                data: {
                    ...new_profile
                }
            }

        } catch (error) {

            this.logger.error(`[Create profile] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.create');

        }

        return _Response;

    }

    async findOne(_id: string) {
     let _Response: _Response_I;

        try {

            const f_em = this.em.fork();
            const profile = await this._Profile_RepositoryService.findOne(
                { _id }
            );

            if (!profile) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Perfil no encontrado'
                })
            }

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Perfil encontrado',
                data: {
                    ...profile
                }
            }

        } catch (error) {
            this.logger.error(`[Find profile by id] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.findOne');
        }

        return _Response;
    }

    async update(_id: string, updateProfileDto: Update_Profile_Dto) {

        let _Response: _Response_I;

        try {

            const f_em = this.em.fork();
            const resp_profile = await this._Profile_RepositoryService.findOne({ _id });

            if (!resp_profile) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Perfil no encontrado'
                })
            }

            const updated_user = await this._Profile_RepositoryService.update_profile({
                find: { _id },
                update: updateProfileDto,
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Perfil actualizado correctamente',
                data: {
                    ...updated_user
                }
            }

        } catch (error) {

            this.logger.error(`[Update profile] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.update');

        }

        return _Response;
    }


}
