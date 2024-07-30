import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MetaArtists_Controller, MetaContratists_Controller, MetaRoleController } from './controllers';
import { MetaArtist_Ety, MetaContratist_Ety, MetaRole_Ety } from './entities';
import { MetaArtistsService, MetaContratistsService, MetaRoleService } from './services';


@Module({
    controllers: [
        MetaRoleController,
        MetaArtists_Controller,
        MetaContratists_Controller
    ],
    providers: [
        MetaArtistsService,
        MetaContratistsService,
        MetaRoleService,
    ],
    imports: [
        MikroOrmModule.forFeature([
            MetaRole_Ety,
            MetaContratist_Ety,
            MetaArtist_Ety
        ]),

    ]
})
export class MetaRoleModule { }
