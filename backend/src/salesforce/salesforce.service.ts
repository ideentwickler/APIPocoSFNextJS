import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sf from 'jsforce';

@Injectable()
export class SalesforceService {
  constructor(private config: ConfigService) {}

  async getQuery(query: string): Promise<{
    totalSize: number;
    done: boolean;
    records: object[];
  }> {
    const _config = this.config;
    const _logger = new Logger(SalesforceService.name);
    return new Promise((resolve, reject) => {
      const conn = new sf.Connection({
        loginUrl: _config.get('SF_LOGIN_URL'),
      });
      conn.login(
        _config.get('SF_USERNAME'),
        _config.get('SF_PASSWORD') + _config.get('SF_TOKEN'),
        function (err, res) {
          if (err) {
            reject(err);
          }
          // console.log(res);
          conn.query(query, function (err, res) {
            if (err) {
              console.log(err);
              _logger.error(err);
              reject(err);
            }
            resolve(res);
          });
        },
      );
    });
  }
}
