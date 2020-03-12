export interface SetmealService {
  id?: string;//自增
  seqNo?: bigint; //序列号
  types?: string; //类型（1-套餐，2-服务）
  name?: string; //名称
  desciption?: string; //描述
  priceCn?: number; //成本（CNY）
  priceUs?: number; //成本（USD）
  grossProfitrate?: number; //毛利率
  taxRate?: number; //税率
  totalPricecn?: number; //总价（CNY）
  totalPriceus?: number; //总价（USD）
  aftertaxPrice?: number; //税后价格
  taxexclusivePrice?: number; //不含税价格
  remarks?: string; //备注
  active?: string; //是否启用，0-未启用，1-启用
  deleted?: boolean;  //是否被删除,0-未删除，1-删除
  beginTime?: Date; //开始时间
  endTime?: Date; //结束时间
  insertUser?: string;
  insertTime?: Date;
  updateUser?: string;
  updateTime?: Date;
}
