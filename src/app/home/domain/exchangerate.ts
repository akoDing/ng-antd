export interface MasterdataExchangeRate {
  id?: string;
  exchangeRate?: number;
  currency?: string;
  startTime?: Date;
  endTime?: Date;
  active?: boolean;
  updateTime?: Date;
  updateUser?: Date;
  deleted?:  boolean;
}

