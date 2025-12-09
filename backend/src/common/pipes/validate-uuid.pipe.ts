import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class ValidateUUIDPipe implements PipeTransform {
  transform(value: string) {
    if (!validateUUID(value)) {
      throw new BadRequestException(`"${value}" is not a valid UUID`);
    }
    return value;
  }
}
