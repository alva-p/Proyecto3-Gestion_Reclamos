import { PartialType } from '@nestjs/mapped-types';
import { CreateCriticidadDto } from '../create-criticidad.dto/create-criticidad.dto';

export class UpdateCriticidadDto extends PartialType(CreateCriticidadDto) {}
