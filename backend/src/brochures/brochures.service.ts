import { Injectable, Logger } from '@nestjs/common';
import { SalesforceService } from '../salesforce/salesforce.service';
import { Brochure } from './types';


@Injectable()
export class BrochuresService {
  constructor(private salesforce: SalesforceService) {}

  // https://docs.nestjs.com/techniques/logger#using-the-logger-for-application-logging=
  private readonly logger = new Logger(BrochuresService.name)

   async getOrderedBrochures(): Promise<Brochure[]> {
    const brochures: Brochure[] = [];

    try {
      let result = await this.salesforce.getQuery(
        'select Id, Position__c, SectionTitle__c, Title__c, Subtitle__c, ' +
        'Url__c, ActionUrl__c, isPromoted__c, StartDate__c, EndDate__c ' +
        'FROM Brochure__c WHERE StartDate__c <= TODA AND EndDate__c >= TODA ORDER BY Position__c',
      );
      let { records } = result;

      records.map((brochure) => {
        brochures.push({
          id: brochure['Id'],
          sectionTitle: brochure['SectionTitle__c'],
          title: brochure['Title__c'],
          subtitle: brochure['Subtitle__c'],
          url: brochure['Url__c'],
          actionUrl: brochure['ActionUrl__c'],
          isPromoted: brochure['IsPromoted__c'],
          startDate: brochure['StartDate__c'],
          endDate: brochure['EndDate__c'],
        });
      });
    } catch {
      this.logger.error('Error while fetching Data from Salesforce');
    }

    return brochures;
  }

  async getBrochures() {
    return await this.getOrderedBrochures();
  }
}
