export interface SolutionBase {
  id ? : string;
  solutionType ? : string; //Does it include educational consultation
  requestor?: number;
  requestorDepartment?: string;
  requestCostCenterId?: string;
  crm?: string;
  needSow?: boolean;
  expectedStartTime?: Date;
  requestDescription?: string;
  supportType?: string;

  state?: string;
  insertUser?: string;
  insertTime?: Date;
  updateUser?: string;
  updateTime?: Date;
}
