import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  constructor(private config: ConfigService) {
    super(
      {
        header: 'X-API-KEY',
        prefix: '',
      },
      true,
      async (apiKey, done) => {
        return this.validate(apiKey, done);
      },
    );
  }

  public validate = (
    apiKey: string,
    done: (error: Error, data) => {},
  ) => {
    if (this.config.get<string>('API_KEY') === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  };
}
