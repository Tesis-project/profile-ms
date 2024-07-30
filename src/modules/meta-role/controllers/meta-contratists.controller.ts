
import { Controller } from "@nestjs/common";
import { MetaContratistsService } from '../services/meta-contratists.service';
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Auth_User_I_Dto } from "@tesis-project/dev-globals/dist/modules/auth/dto";
import { Update_Meta_Contratist_Dto } from "@tesis-project/dev-globals/dist/modules/profile/dto";


@Controller()
export class MetaContratists_Controller {


    constructor(
        private readonly _metaContratistService: MetaContratistsService
    ) { }

    @MessagePattern('profile.meta.contratist.set')
    set_metaContratist(
        @Payload('meta') createMetaRoleDto: Update_Meta_Contratist_Dto,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {

        return this._metaContratistService.set_contratistMeta(createMetaRoleDto, user_auth);

    }

}