import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MetaRoleService } from './meta-role.service';
import { CreateMetaRoleDto } from './dto/create-meta-role.dto';
import { UpdateMetaRoleDto } from './dto/update-meta-role.dto';

@Controller()
export class MetaRoleController {
    constructor(private readonly metaRoleService: MetaRoleService) { }

    @MessagePattern('createMetaRole')
    create(@Payload() createMetaRoleDto: CreateMetaRoleDto) {
        return this.metaRoleService.create(createMetaRoleDto);
    }

}
