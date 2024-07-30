import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MediaModule } from './modules/media';
import { MetaRoleModule } from './modules/meta-role/meta-role.module';

@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        ProfileModule,
        MetaRoleModule,
        MediaModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
