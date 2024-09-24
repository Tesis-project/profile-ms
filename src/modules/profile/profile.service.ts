
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from '@mikro-orm/postgresql';

import { Update_Profile_Dto, Create_Profile_Dto } from '@tesis-project/dev-globals/dist/modules/profile/dto';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Create_Media_Dto } from '@tesis-project/dev-globals/dist/modules/media/dto';
import { Media_I, Media_Reference_Enum, Media_Type_Enum } from '@tesis-project/dev-globals/dist/modules/media/interfaces';

import { ExceptionsHandler } from '../../core/helpers';
import { Profile_RepositoryService } from './entities/profile.repository.service';
import { MediaService_GW } from '../media';
import { Profile_Ety } from './entities/profile.entity';

import * as uuid from 'uuid';

@Injectable()
export class ProfileService {

    private readonly logger = new Logger('ProfileService');

    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _Profile_RepositoryService: Profile_RepositoryService,
        private readonly _MediaService_GW: MediaService_GW,
        private readonly em: EntityManager,
    ) {

    }

    async remove_video_gallery(_id: string, user_auth: Auth_User_I_Dto): Promise<_Response_I<Profile_Ety>> {

        let _Response: _Response_I<Profile_Ety>;

        try {

            const f_em = this.em.fork();
            let profile = await this._Profile_RepositoryService.findOne({
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

            let { media } = profile;

            if (!media.video_gallery) {
                media = {
                    ...media,
                    video_gallery: [] as Media_I[]
                }
            }

            const exist_file = media.video_gallery.find(video => video._id === _id);

            if (!exist_file) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Video no encontrado'
                }
                throw new RpcException(_Response);
            }

            const deleted_file = await this._MediaService_GW.delete_media(_id, user_auth);

            if (deleted_file.statusCode != 200) {

                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error al eliminar el video'
                }
                throw new RpcException(_Response);

            }

            media.video_gallery = media.video_gallery.filter(video => video._id !== _id);

            profile.media = {
                ...media
            };

            await this._Profile_RepositoryService.update_profile({
                find: { _id: profile._id },
                update: profile,
                _em: f_em
            });

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Video eliminado correctamente',
                data: {
                    ...profile
                }
            }

            f_em.flush();

        } catch (error) {

            this.logger.error(`[Remove video gallery] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.remove_video_gallery');

        }

        return _Response;

    }

    async add_video_gallery(file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Profile_Ety>> {

        let _Response: _Response_I<Profile_Ety>;

        let Create_Media_Dto: Create_Media_Dto = {
            reference: Media_Reference_Enum.PROFILE_MEDIA_VIDEO_GALLERY,
            type: Media_Type_Enum.VIDEO,
            reference_id: ''
        }

        try {

            const f_em = this.em.fork();
            let profile = await this._Profile_RepositoryService.findOne({
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

            let { media } = profile;

            if (!media.video_gallery) {
                media = {
                    ...media,
                    video_gallery: [] as Media_I[]
                }
            }

            Create_Media_Dto.reference_id = profile._id;

            const uploaded_file: _Response_I<Media_I> = await this._MediaService_GW.create_media(file, Create_Media_Dto, user_auth);

            profile.media = {
                ...media,
            };

            profile.media.video_gallery.push({
                _id: uploaded_file.data._id,
            });

            profile.media.video_gallery = profile.media.video_gallery.map(video => ({
                _id: video._id
            }));


            await this._Profile_RepositoryService.update_profile({
                find: { _id: profile._id },
                update: profile,
                _em: f_em
            });

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Galería de videos actualizada correctamente',
                data: {
                    ...profile
                }
            }

            f_em.flush();

        } catch (error) {

            this.logger.error(`[Add video gallery] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.add_video_gallery');

        }

        return _Response;

    }

    async remove_image_gallery(_id: string, user_auth: Auth_User_I_Dto): Promise<_Response_I<Profile_Ety>> {

        let _Response: _Response_I<Profile_Ety>;

        try {

            const f_em = this.em.fork();
            let profile = await this._Profile_RepositoryService.findOne({
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

            let { media } = profile;

            if (!media.image_gallery) {
                media = {
                    ...media,
                    image_gallery: [] as Media_I[]
                }
            }

            const exist_file = media.image_gallery.find(img => img._id === _id);

            if (!exist_file) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Imagen no encontrada'
                }
                throw new RpcException(_Response);
            }

            const deleted_file = await this._MediaService_GW.delete_media(_id, user_auth);

            if (deleted_file.statusCode != 200) {

                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error al eliminar la imagen'
                }
                throw new RpcException(_Response);

            }

            media.image_gallery = media.image_gallery.filter(img => img._id !== _id);

            profile.media = {
                ...media
            };

            await this._Profile_RepositoryService.update_profile({
                find: { _id: profile._id },
                update: profile,
                _em: f_em
            });

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Imagen eliminada correctamente',
                data: {
                    ...profile
                }
            }

            f_em.flush();

        } catch (error) {

            this.logger.error(`[Remove image gallery] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.remove_image_gallery');

        }

        return _Response;

    }

    async add_image_gallery(file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Profile_Ety>> {

        let _Response: _Response_I<Profile_Ety>;

        let Create_Media_Dto: Create_Media_Dto = {
            reference: Media_Reference_Enum.PROFILE_MEDIA_IMAGE_GALLERY,
            type: Media_Type_Enum.IMAGE,
            reference_id: ''
        }

        try {

            const f_em = this.em.fork();
            let profile = await this._Profile_RepositoryService.findOne({
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

            let { media } = profile;

            if (!media.image_gallery) {
                media = {
                    ...media,
                    image_gallery: [] as Media_I[]
                }
            }

            Create_Media_Dto.reference_id = profile._id;

            const uploaded_file: _Response_I<Media_I> = await this._MediaService_GW.create_media(file, Create_Media_Dto, user_auth);

            profile.media = {
                ...media,
            };

            profile.media.image_gallery.push({
                _id: uploaded_file.data._id,
            });

            profile.media.image_gallery = profile.media.image_gallery.map(img => ({
                _id: img._id
            }))


            await this._Profile_RepositoryService.update_profile({
                find: { _id: profile._id },
                update: profile,
                _em: f_em
            });

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Galería de imágenes actualizada correctamente',
                data: {
                    ...profile
                }
            }

            f_em.flush();

        } catch (error) {

            this.logger.error(`[Set image gallery] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.set_image_gallery');

        }

        return _Response;

    }

    async set_profesional_file(file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Profile_Ety>> {

        let _Response: _Response_I<Profile_Ety>;

        let Create_Media_Dto: Create_Media_Dto = {
            reference: Media_Reference_Enum.PROFILE_CREDENTIAL_PROFESSIONAL,
            type: Media_Type_Enum.DOCUMENT,
            reference_id: ''
        }

        try {

            const f_em = this.em.fork();
            let profile = await this._Profile_RepositoryService.findOne({
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

            let { credentials } = profile;

            if (!credentials.profesional_file) {
                credentials = {
                    ...credentials,
                    profesional_file: {} as Media_I
                }
            }

            Create_Media_Dto.reference_id = profile._id;

            let uploaded_file: _Response_I<Media_I>;

            if (!credentials?.profesional_file || !credentials?.profesional_file?._id) {

                uploaded_file = await this._MediaService_GW.create_media(file, Create_Media_Dto, user_auth);

            } else {

                const id: string = credentials.profesional_file?._id || credentials.profesional_file?.cloud_file_id;
                uploaded_file = await this._MediaService_GW.update_media(id, file, user_auth);

            }

            profile.credentials = {
                ...credentials,
                profesional_file: {
                    _id: uploaded_file.data._id,
                }
            };

            await this._Profile_RepositoryService.update_profile({
                find: { _id: profile._id },
                update: profile,
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Documento profesional actualizado correctamente',
                data: {
                    ...profile
                }
            }

            return _Response;

        } catch (error) {

            this.logger.error(`[Set profesional file] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.set_profesional_file');

        }


        return _Response;

    }

    async set_credentials_identity_file(file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Profile_Ety>> {

        let _Response: _Response_I<Profile_Ety>;

        let Create_Media_Dto: Create_Media_Dto = {
            reference: Media_Reference_Enum.PROFILE_CREDENTIAL_IDENTITY,
            type: Media_Type_Enum.DOCUMENT,
            reference_id: ''
        }

        try {

            const f_em = this.em.fork();
            let profile = await this._Profile_RepositoryService.findOne({
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

            let { credentials } = profile;

            if (!credentials.identity_file) {
                credentials = {
                    ...credentials,
                    identity_file: {} as Media_I
                }
            }

            Create_Media_Dto.reference_id = profile._id;

            let uploaded_file: _Response_I<Media_I>;

            if (!credentials?.identity_file || !credentials?.identity_file?._id) {

                uploaded_file = await this._MediaService_GW.create_media(file, Create_Media_Dto, user_auth);

            } else {

                const id: string = credentials.identity_file?._id || credentials.identity_file?.cloud_file_id;
                uploaded_file = await this._MediaService_GW.update_media(id, file, user_auth);

            }

            profile.credentials = {
                ...credentials,
                identity_file: {
                    _id: uploaded_file.data._id,
                }
            };

            await this._Profile_RepositoryService.update_profile({
                find: { _id: profile._id },
                update: profile,
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Documento de identidad actualizado correctamente',
                data: {
                    ...profile
                }
            }

            return _Response;

        } catch (error) {

            this.logger.error(`[Set credentials identity file] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.set_credentials_identity_file');

        }
    }

    async set_profile_cover(file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Profile_Ety>> {

        let _Response: _Response_I<Profile_Ety>;

        let Create_Media_Dto: Create_Media_Dto = {
            reference: Media_Reference_Enum.PROFILE_COVER_PIC,
            type: Media_Type_Enum.IMAGE,
            reference_id: ''
        };

        try {

            const f_em = this.em.fork();
            let profile = await this._Profile_RepositoryService.findOne({
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

            const { cover_pic } = profile;

            Create_Media_Dto.reference_id = profile._id;

            let uploaded_pic: _Response_I<Media_I>;

            if (!cover_pic || !cover_pic?._id) {

                uploaded_pic = await this._MediaService_GW.create_media(file, Create_Media_Dto, user_auth);

            } else {

                const id: string = cover_pic?._id || cover_pic?.cloud_file_id;
                uploaded_pic = await this._MediaService_GW.update_media(id, file, user_auth);

            }

            profile.cover_pic = {
                _id: uploaded_pic.data._id,
            };

            await this._Profile_RepositoryService.update_profile({
                find: { _id: profile._id },
                update: profile,
                _em: f_em
            });


            f_em.flush();

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Foto de portada actualizada correctamente',
                data: {
                    ...profile
                }
            }

        } catch (error) {

            this.logger.error(`[Set profile cover] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.set_profile_cover');

        }

        return _Response;

    }

    async set_profile_pic(file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Profile_Ety>> {

        let _Response: _Response_I<Profile_Ety>;

        let Create_Media_Dto: Create_Media_Dto = {
            reference: Media_Reference_Enum.PROFILE_PROFILE_PIC,
            type: Media_Type_Enum.IMAGE,
            reference_id: ''
        };

        try {

            const f_em = this.em.fork();
            let profile = await this._Profile_RepositoryService.findOne({
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

            const { profile_pic } = profile;

            Create_Media_Dto.reference_id = profile._id;

            let uploaded_pic: _Response_I<Media_I>;

            if (!profile_pic || !profile_pic?._id) {

                uploaded_pic = await this._MediaService_GW.create_media(file, Create_Media_Dto, user_auth);


            } else {

                const id: string = profile_pic?._id;
                uploaded_pic = await this._MediaService_GW.update_media(id, file, user_auth);

            }

            profile.profile_pic = {
                _id: uploaded_pic.data._id,
            };

            await this._Profile_RepositoryService.update_profile({
                find: { _id: profile._id },
                update: profile,
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Foto de perfil actualizada correctamente',
                data: {
                    ...profile
                }
            }

        } catch (error) {

            this.logger.error(`[Set profile pic] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'ProfileService.set_profile_pic');

        }

        return _Response;

    }

    async create(createProfileDto: Create_Profile_Dto) {

        let _Response: _Response_I;

        const {
            user
        } = createProfileDto;

        try {

            const f_em = this.em.fork();
            const resp_user = await this._Profile_RepositoryService.findOne(user);

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

            let profile = await this._Profile_RepositoryService.findOne(
                {
                    $or: [
                        { _id },
                        { user: _id }
                    ]
                },
                {
                    populate: [ 'meta.meta_artist', 'meta.meta_contratist']
                }
                ,
            );

            if (profile.profile_pic?._id) {
                const profile_pic = await this._MediaService_GW.get_mediaMeta(profile.profile_pic?._id);
                profile.profile_pic = {
                    ...profile_pic.data
                }
            }

            if (profile.cover_pic?._id) {
                const cover_pic = await this._MediaService_GW.get_mediaMeta(profile.cover_pic?._id);
                profile.cover_pic = {
                    ...cover_pic.data
                }
            }

            if(profile.credentials) {

                const cred = profile.credentials;
                if(cred.identity_file?._id) {
                    const identity_file = await this._MediaService_GW.get_mediaMeta(cred.identity_file?._id);
                    cred.identity_file = {
                        ...identity_file.data
                    }
                }
                if(cred.profesional_file?._id) {
                    const profesional_file = await this._MediaService_GW.get_mediaMeta(cred.profesional_file?._id);
                    cred.profesional_file = {
                        ...profesional_file.data
                    }
                }

                profile.credentials = {
                    ...cred
                }

            }

            if(profile.media) {

                const media = profile.media;

                if(media.image_gallery) {
                    media.image_gallery = await Promise.all(media.image_gallery.map(async img => {
                        const image = await this._MediaService_GW.get_mediaMeta(img._id);
                        return {
                            ...image.data
                        }
                    }))
                }

                if(media.video_gallery) {
                    media.video_gallery = await Promise.all(media.video_gallery.map(async video => {
                        const vid = await this._MediaService_GW.get_mediaMeta(video._id);
                        return {
                            ...vid.data
                        }
                    }))
                }

                profile.media = {
                    ...media
                }

            }

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
