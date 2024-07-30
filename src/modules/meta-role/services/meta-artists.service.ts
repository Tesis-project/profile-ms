import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Update_Meta_Artist_Dto } from '@tesis-project/dev-globals/dist/modules/profile/dto';
import { ExceptionsHandler } from '../../../core/helpers';
import { EntityManager } from '@mikro-orm/core';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { MetaRole_Repository } from '../entities/meta-role.repository.service';
import { Profile_Ety } from '../../profile/entities/profile.entity';
import { RpcException } from '@nestjs/microservices';
import { MetaArtists_Repository } from '../entities/meta-artists.repository.service';
import { MetaArtist_Ety } from '../entities/meta-artists.entity';
import { MetaArtist_Models } from '@tesis-project/dev-globals/dist/modules/profile/models';

import * as uuid from 'uuid';


@Injectable()
export class MetaArtistsService {

    private readonly logger = new Logger('MetaArtistsService');
    ExceptionsHandler = new ExceptionsHandler();
    service: string = 'MetaArtistsService';

    constructor(
        private readonly _MetaRole_Repository: MetaRole_Repository,
        private readonly _MetaArtists_Repository: MetaArtists_Repository,
        private readonly em: EntityManager,
    ) {

    }

    async set_artistsMeta(createMetaRoleDto: Update_Meta_Artist_Dto, user_auth: Auth_User_I_Dto): Promise<_Response_I<MetaArtist_Ety>> {

        let _Response: _Response_I;

        const {
            skills
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
                populate: ['meta_artist']
            });

            if (!meta_role) {

                const meta_role_id: string = uuid.v4();

                let _sk = (new MetaArtist_Models()).set_artistMeta_Blank();

                if (skills.singer) {

                    _sk = {
                        ..._sk,
                        singer: {
                            ...skills.singer
                        }
                    }

                }

                if (skills.instrumentist) {

                    _sk = {
                        ..._sk,
                        instrumentist: {
                            ...skills.instrumentist
                        }
                    }

                }

                if (skills.orquests_director) {

                    _sk = {
                        ..._sk,
                        orquests_director: {
                            ...skills.orquests_director
                        }
                    }

                }

                if (skills.scenes_director) {

                    _sk = {
                        ..._sk,
                        scenes_director: {
                            ...skills.scenes_director
                        }
                    }

                }

                meta_role = {
                    meta_contratist: {
                        _id: uuid.v4()
                    } as any,
                    meta_artist: {
                        _id: uuid.v4(),
                        skills: _sk
                    } as any,
                    profile: profile,
                    _id: meta_role_id
                }

                const metaRoleSaved = await this._MetaRole_Repository.create_metaRole({
                    save: meta_role,
                    _em: f_em
                });

                f_em.flush();

                _Response = {
                    ok: true,
                    data: {
                        ...skills
                    },
                    statusCode: HttpStatus.CREATED,
                };

            } else {

                let prev_skills = meta_role.meta_artist.skills;

                if (skills.singer) {

                    prev_skills = {
                        ...prev_skills,
                        singer: {
                            ...skills.singer
                        }
                    }

                }

                if (skills.instrumentist) {

                    prev_skills = {
                        ...prev_skills,
                        instrumentist: {
                            ...skills.instrumentist
                        }
                    }

                }

                if (skills.orquests_director) {

                    prev_skills = {
                        ...prev_skills,
                        orquests_director: {
                            ...skills.orquests_director
                        }
                    }

                }

                if (skills.scenes_director) {

                    prev_skills = {
                        ...prev_skills,
                        scenes_director: {
                            ...skills.scenes_director
                        }
                    }

                }

                await this._MetaArtists_Repository.update_metaArtists({
                    find: meta_role.meta_artist,
                    update: {
                        skills: {
                            ...prev_skills,
                        }
                    },
                    _em: f_em
                });


                f_em.flush();
                _Response = {
                    ok: true,
                    data: {
                        ...skills
                    },
                    statusCode: HttpStatus.OK,
                };

            }

            _Response = {
                ..._Response,
                message: 'Meta artista actualizada'
            };

        } catch (error) {

            console.log('error', error);
            this.logger.error(`[Set meta artists] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.set_artistsMeta`);

        }

        return _Response;

    }

}