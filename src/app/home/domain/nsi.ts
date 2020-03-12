export interface Nsi {
  id ? : string;
  requestor ? : number;
  requestCostCenterId ? : string;
  title ? : string;
  description ? : string;
  costOwnerEmailAddress ? : string;
  psInternalExternal ? : string;
  hasBcEmail ? : string;
  financeApprovalStatus ? : string;
  needNotification ? : boolean; //重点关注

  state?: string;
  insertUser?: string;
  insertTime?: Date;
  updateUser?: string;
  updateTime?: Date;
}
