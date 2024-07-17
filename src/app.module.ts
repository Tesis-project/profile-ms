import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MediaModule } from './modules/media';

@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        ProfileModule,
        MediaModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
