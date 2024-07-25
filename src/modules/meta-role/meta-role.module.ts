import { Module } from '@nestjs/common';
import { MetaRoleService } from './meta-role.service';
import { MetaRoleController } from './meta-role.controller';

@Module({
  controllers: [MetaRoleController],
  providers: [MetaRoleService],
})
export class MetaRoleModule {}
