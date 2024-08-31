
import { Controller, ParseUUIDPipe } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Auth_User_I_Dto } from "@tesis-project/dev-globals/dist/modules/auth/dto";
import { Update_Meta_Artist_Dto } from "@tesis-project/dev-globals/dist/modules/profile/dto";
import { MetaArtistsService } from '../services/meta-artists.service';


@Controller()
export class MetaArtists_Controller {

    constructor(
        private readonly _MetaArtistsService: MetaArtistsService
    ) { }

    @MessagePattern('profile.meta.artists.set')
    set_metaContratist(
        @Payload('meta') createMetaRoleDto: Update_Meta_Artist_Dto,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {

        return this._MetaArtistsService.set_artistsMeta(createMetaRoleDto, user_auth);

    }


    @MessagePattern('profile.meta.artists.get.identify')
    get_artist_identify(
        @Payload('profile_id', ParseUUIDPipe) profile_id: string
    ) {

        return this._MetaArtistsService.get_artist_identify(profile_id);
    }


}