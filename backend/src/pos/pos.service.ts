import { Injectable } from '@nestjs/common';
import { SalesforceService } from '../salesforce/salesforce.service';
import { BusinessHours, SpecialOpeningByState } from './types';
import { SpecialOpening } from './types';

@Injectable()
export class PosService {
  constructor(private salesforce: SalesforceService) {}

  async getPOS() {
    const getBusinessHours = (data: string): BusinessHours[] => {
      // we get this data in JSON format, so let's convert this to an Object.
      const businessHours: BusinessHours[] = JSON.parse(data);
      businessHours.map((day, index) => {
        // we have to manually add a "Z" to the times
        businessHours[index]['opensTime'] += 'Z';
        businessHours[index]['closesTime'] += 'Z';
        // create "weekday" with value of "day"
        businessHours[index]['weekday'] = businessHours[index]['day'];
        // remove as unnecessary in response
        delete businessHours[index]['day'];
        delete businessHours[index]['type'];
      });
      return businessHours;
    };

    const getNationalHolidays = async (): Promise<SpecialOpening[]> => {
      const nationalHolidays: SpecialOpening[] = [];
      let result = await this.salesforce.getQuery(
        'SELECT Id, Name, Date__c FROM Holiday__c WHERE IsNationwide__c=true',
      );
      let { records } = result;
      records.map((day) => {
        nationalHolidays.push({
          specialOpeningDate: day['Date__c'],
          specialOpeningText: day['Name'],
          opensTime: null,
          closesTime: null,
        });
      });
      return nationalHolidays;
    };

    const getHolidaysByState = async (): Promise<SpecialOpeningByState> => {
      // Here we create an object with name of state as key and a Array of SpecialOpening`s as value
      const holidaysByState: SpecialOpeningByState = {};
      let result = await this.salesforce.getQuery(
        'SELECT Id, Name, Date__c, States__c FROM Holiday__c WHERE IsNationwide__c=false',
      );
      let { records } = result;
      records.map((day) => {
        const states: string = day['States__c'];
        // we get one or more "states" in a string, seperated by a semicolon. so we have to split them!
        states.split(';').map((state) => {
          if (!holidaysByState[state]) holidaysByState[state] = [];
          holidaysByState[state].push({
            specialOpeningDate: day['Date__c'],
            specialOpeningText: day['Name'],
            opensTime: null,
            closesTime: null,
          });
        });
      });
      return holidaysByState;
    };

    const getSpecialOpeningDates = async () => {
      const specialOpeningDates = {};
      let result = await this.salesforce.getQuery(
        `SELECT Id, PosMarket__c, Date__c, ClosingTime__c, Note__c, OpeningTime__c from SpecialOpeningHour__c`,
      );
      let { records } = result;
      records.map((day) => {
        if (!specialOpeningDates[day['PosMarket__c']])
          specialOpeningDates[day['PosMarket__c']] = [];
        specialOpeningDates[day['PosMarket__c']].push({
          specialOpeningDate: day['Date__c'],
          specialOpeningText: day['Note__c'],
          opensTime: day['OpeningTime__c'], // Todo: Hier wird Time direkt mit "Z" am Ende ausgespielt?
          closesTime: day['ClosingTime__c'],
        });
      });
      return specialOpeningDates;
    };

    const getWarehouseAdressesByPosId = async () => {
      const warehouseAdresses = {};
      let result = await this.salesforce.getQuery(
        `select Id, Warehouse__r.City__c, Warehouse__r.Street__c, Warehouse__r.ZipCode__c, Warehouse__r.PosGeolocation__Latitude__s, Warehouse__r.PosGeolocation__Longitude__s, Warehouse__r.Name, Pos__r.PosId__c, Warehouse__r.WarehouseID__c FROM PosWarehouseRelation__c`,
      );
      let { records } = result;
      records.map((warehouse) => {
        if (!warehouseAdresses[warehouse['Pos__r']['PosId__c']]) {
          warehouseAdresses[warehouse['Pos__r']['PosId__c']] = [];
        }
        warehouseAdresses[warehouse['Pos__r']['PosId__c']].push({
          id: warehouse['Warehouse__r']['WarehouseID__c'], // Todo: wrong
          type: warehouse['Warehouse__r']['Name'],
          street: warehouse['Warehouse__r']['Street__c'],
          postalCode: warehouse['Warehouse__r']['ZipCode__c'],
          locationLat: warehouse['Warehouse__r']['PosGeolocation__Latitude__s'],
          locationLong:
            warehouse['Warehouse__r']['PosGeolocation__Longitude__s'],
        });
      });
      return warehouseAdresses;
    };

    const specialHolidaysNationwide = await getNationalHolidays();
    const specialHolidaysByState = await getHolidaysByState();
    const specialOpeningDates = await getSpecialOpeningDates();
    const warehouseAdressesByPosId = await getWarehouseAdressesByPosId();

    const mappedResult = [];

    const result = await this.salesforce.getQuery(
      'SELECT Id, PosId__c, Name, BillingCity, BillingPostalCode, ' +
        'BillingState, BillingStreet, PosGeolocation__Latitude__s, ' +
        'PosGeolocation__Longitude__s, InfoText__c, OpeningHours__c, ' +
        'PosGraphic__c, Email__c, Phone, LocationManager__c, AdditionalInfoText__c ' +
        "FROM Account WHERE PosStatus__c = 'open'",
    );
    const { records } = result;

    records.map((rec) => {
      let specialStoreDates = [];
      if (specialOpeningDates.hasOwnProperty(rec['Id'])) {
        specialStoreDates = [...specialOpeningDates[rec['Id']]];
      }

      let warehouseAdresses = [];
      if (warehouseAdressesByPosId[rec['PosId__c']]) {
        warehouseAdresses = [...warehouseAdressesByPosId[rec['PosId__c']]];
      }

      let r = {
        id: rec['PosId__c'],
        salesforceId: rec['Id'],
        name: rec['Name'],
        prominentInfoText: rec['InfoText__c'],
        additionalInfoText: rec['AdditionalInfoText__c'],
        locationLat: rec['PosGeolocation__Latitude__s'],
        locationLong: rec['PosGeolocation__Longitude__s'],
        graphicsUrl: rec['PosGraphic__c'],
        locationManager: rec['LocationManager__c'],
        phone: rec['Phone'],
        businessHours: getBusinessHours(rec['OpeningHours__c']),
        specialHours: [
          ...specialHolidaysNationwide,
          ...specialHolidaysByState[rec['BillingState']],
          ...specialStoreDates,
        ],
        addresses: [
          {
            type: 'Einrichtungsmarkt',
            street: rec['BillingStreet'],
            postalCode: rec['BillingPostalCode'],
            city: rec['BillingCity'],
            country: null,
          },
          ...warehouseAdresses,
        ],
      };
      mappedResult.push(r);
    });

    return mappedResult;
  }
}
