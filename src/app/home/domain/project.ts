export interface Project {
  id ? : string;
  code ? : string; //项目编号 P-<系统编号>-<商机号>
  name ? : string; //项目名称
  startDate ? : Date; //预计开始时间
  endDate ? : Date; //预计结束时间
  description ? : string; //描述信息
  status ? : string; //项目状态
  managerId ? : string; //项目经理id
  totalManday ? : number; //总工时

  // order_index?: number// 排序
  active ? : boolean;
  deleted ? : boolean;
  remarks ? : string;
  insertUser ? : string;
  insertTime ? : Date;
  updateUser ? : string;
  updateTime ? : Date;
}
