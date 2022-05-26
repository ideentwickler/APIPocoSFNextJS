import { Injectable } from '@nestjs/common';
import { SalesforceService } from '../salesforce/salesforce.service';

@Injectable()
export class StartService {
  constructor(private salesforce: SalesforceService) {}

  async getStart() {
    const getSection = async (section: string) => {
      const mySection = {};
      let result = await this.salesforce.getQuery(
        `select Id, ActionUrl__c, EndDate__c, SectionTitle__c, StartDate__c, Subtype__c, Type__c, Url__c, Position__c  FROM Teaser__c WHERE StartDate__c <= TODAY AND Type__c='${section}' ORDER BY Position__c`,
      );
      let { records } = result;

      if (records[0]['Position__c'] === 1) {
        mySection['id'] = records[0]['Id'];
        mySection['type'] =
          records[0]['Subtype__c'].toLowerCase();
        mySection['title'] = records[0]['SectionTitle__c'];
        mySection['content'] = [
          {
            id: records[0]['Id'],
            url: records[0]['Url__c'],
            actionUrl: records[0]['ActionUrl__c'],
          },
        ];

        records.map((content, index) => {
          if (index !== 0) {
            mySection['content'].push({
              id: content['Id'],
              url: content['Url__c'],
              actionUrl: content['ActionUrl__c'],
            });
          }
        });
      }
      return mySection;
    };

    const heros = await getSection('Heros');
    const news = await getSection('News');
    const inspiration = await getSection('Inspiration');
    const social = await getSection('FooterSocialMedia');
    const nativeMyPOS = {
      id: '1337',
      type: 'nativeMyPOS',
    };
    const nativePOCOMastercard = {
      id: '7331',
      type: 'nativePOCOMastercard',
    };

    const filteredList = [
      heros,
      news,
      nativeMyPOS,
      nativePOCOMastercard,
      inspiration,
      social,
    ].filter((n) => n);

    return filteredList;
  }
}
