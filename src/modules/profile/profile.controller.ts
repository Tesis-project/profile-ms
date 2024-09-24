import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProfileService } from './profile.service';

import { Create_Profile_Dto, Update_Profile_Dto } from "@tesis-project/dev-globals/dist/modules/profile/dto";
import { Create_Media_Dto } from '@tesis-project/dev-globals/dist/modules/media/dto/create-media.dto';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';

@Controller()
export class ProfileController {

    constructor(
        private readonly profileService: ProfileService
    ) { }

    @MessagePattern('profile.create')
    create(@Payload() Create_Profile_Dto: Create_Profile_Dto) {

        return this.profileService.create(Create_Profile_Dto);

    }

    @MessagePattern('profile.findOne')
    findOne(@Payload(ParseUUIDPipe) id: string) {

        return this.profileService.findOne(id);

    }

    @MessagePattern('profile.update')
    update(@Payload() Update_Profile_Dto: Update_Profile_Dto) {
        return this.profileService.update(Update_Profile_Dto._id, Update_Profile_Dto);
    }

    @MessagePattern('profile.profile_pic.media')
    profile_pic(
        @Payload('file') file: Express.Multer.File,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.profileService.set_profile_pic(file, user_auth);
    }

    @MessagePattern('profile.profile_cover.media')
    profile_cover(
        @Payload('file') file: Express.Multer.File,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.profileService.set_profile_cover(file, user_auth);
    }

    @MessagePattern('profile.credentials_identity_file.media')
    credentials_identity_file(
        @Payload('file') file: Express.Multer.File,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.profileService.set_credentials_identity_file(file, user_auth);
    }

    @MessagePattern('profile.profesional_file.media')
    profesional_file(
        @Payload('file') file: Express.Multer.File,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.profileService.set_profesional_file(file, user_auth);
    }

    @MessagePattern('profile.image_gallery.media.add')
    add_image_gallery(
        @Payload('file') file: Express.Multer.File,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.profileService.add_image_gallery(file, user_auth);
    }

    @MessagePattern('profile.image_gallery.media.remove')
    remove_image_gallery(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.profileService.remove_image_gallery(_id, user_auth);
    }

    @MessagePattern('profile.video_gallery.media.add')
    add_video_gallery(
        @Payload('file') file: Express.Multer.File,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {

        return this.profileService.add_video_gallery(file, user_auth);

    }

    @MessagePattern('profile.video_gallery.media.remove')
    remove_video_gallery(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.profileService.remove_video_gallery(_id, user_auth);
    }


}
