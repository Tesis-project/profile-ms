import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { ProfileModule } from './modules/profile/profile.module';
@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        ProfileModule
        ],
    controllers: [],
    providers: [],
})
export class AppModule { }
