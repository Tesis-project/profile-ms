
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { MetaRoleService } from '../services/meta-role.service';

@Controller()
export class MetaRoleController {

    constructor(private readonly metaRoleService: MetaRoleService) { }

    @MessagePattern('profile.meta.get')
    set_metaContratist(
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {

        return this.metaRoleService.find_oneMetaRole(user_auth);
    }

}