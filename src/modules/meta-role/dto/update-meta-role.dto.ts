import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaRoleDto } from './create-meta-role.dto';

export class UpdateMetaRoleDto extends PartialType(CreateMetaRoleDto) {
  id: number;
}
