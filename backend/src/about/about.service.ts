import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { About } from '@prisma/client';
import { SalesforceService } from '../salesforce/salesforce.service';

@Injectable()
export class AboutService {
  constructor(
    private prisma: PrismaService,
    private salesforce: SalesforceService,
  ) {}

  async getAbout() {
    let result = await this.salesforce.getQuery(
      "SELECT Id, Title__c, Type__c, Subtitle__c, Url__c, Content__c FROM PocoAppPage__c WHERE Type__c='About'",
    );
    let { records } = result;

    const response = [];
    records.map((rec) => {
      let r = {
        id: rec['Id'],
        title: rec['Title__c'],
        subtitle: rec['Subtitle__c'],
        url: rec['Url__c'],
      };
      response.push(r);
    });

    return response;
  }

  async getLegal() {
    let result = await this.salesforce.getQuery(
      "SELECT Id, Title__c, Type__c, Subtitle__c, Url__c, Content__c FROM PocoAppPage__c WHERE Type__c='Legal'",
    );
    let { records } = result;

    const response = [];
    records.map((rec) => {
      let r = {
        id: rec['Id'],
        title: rec['Title__c'],
        subtitle: rec['Subtitle__c'],
        content: rec['Content__c'],
      };
      response.push(r);
    });

    return response;
  }
}
