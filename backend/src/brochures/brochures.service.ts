import { Injectable } from '@nestjs/common';
import { SalesforceService } from '../salesforce/salesforce.service';
import { Brochure } from './types';


@Injectable()
export class BrochuresService {
  constructor(private salesforce: SalesforceService) {}

  async getOrderedBrochures(): Promise<Brochure[]> {
    const brochures = [];
    let result = await this.salesforce.getQuery(
      'select Id, Position__c, SectionTitle__c, Title__c, Subtitle__c,' +
      ' Url__c, ActionUrl__c, isPromoted__c, StartDate__c, EndDate__c' +
      ' FROM Brochure__c WHERE StartDate__c <= TODAY AND EndDate__c >= TODAY ORDER BY Position__c',
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
    return brochures;
  }

  async getBrochures() {
    return await this.getOrderedBrochures();
  }
}
