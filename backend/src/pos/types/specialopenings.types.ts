export interface SpecialOpening {
  specialOpeningDate: string;
  specialOpeningText: string;
  opensTime: null;
  closesTime: null;
}

export interface SpecialOpeningByState {
  [state: string]: SpecialOpening[];
}

export interface SpecialOpeningByPOSSalesforceId {
  [pos: string]: SpecialOpening[];
}
