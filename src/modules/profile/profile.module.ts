import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile_Ety } from './entities/profile.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Profile_RepositoryService } from './entities/profile.repository.service';
import { NatsModule } from '../../core/transports/nats.module';

@Module({
    controllers: [ProfileController],
    providers: [
        ProfileService,
        Profile_RepositoryService
    ],
    imports: [
        MikroOrmModule.forFeature([
            Profile_Ety
        ]),


    ]
})
export class ProfileModule { }
