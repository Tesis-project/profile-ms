import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProfileService } from './profile.service';

import { Create_Profile_Dto, Update_Profile_Dto } from "@tesis-project/dev-globals/dist/modules/profile/dto";

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

}
