import { Injectable } from '@nestjs/common';
import { CreateMetaRoleDto } from './dto/create-meta-role.dto';
import { UpdateMetaRoleDto } from './dto/update-meta-role.dto';

@Injectable()
export class MetaRoleService {
  create(createMetaRoleDto: CreateMetaRoleDto) {
    return 'This action adds a new metaRole';
  }

  findAll() {
    return `This action returns all metaRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metaRole`;
  }

  update(id: number, updateMetaRoleDto: UpdateMetaRoleDto) {
    return `This action updates a #${id} metaRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} metaRole`;
  }
}
