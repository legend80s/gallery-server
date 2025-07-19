import {
  BadRequestException,
  Injectable,
  Logger,
  type PipeTransform,
} from '@nestjs/common';
import { flattenError, treeifyError, ZodError, type ZodType } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  private readonly logger = new Logger(ZodPipe.name);
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    this.logger.log(`value to parse:`, value);
    try {
      return this.schema.parse(value);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          // ...treeifyError(error),
          errors: flattenError(error).fieldErrors,
          // errors: error.issues.map((issue) => ({
          //   path: issue.path.join('.'),
          //   message: issue.message,
          // })),
        });
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
