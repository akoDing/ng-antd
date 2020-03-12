export interface Crm {
    id?: string;//自增
    crmId?: string; //crm标识
    opportunityId?: string;//商机号
    customer?: string;//客户名称
    solution?: string;
    needSow?: boolean;//是否需要sow 0不需要 1需要
    expectOrderDate?: string;//预计进单日期
    publicBiddingDate?: string;//公开招标日期
    purchaseOrderReceivingDate?: string;//采购订单接收日期
    probabilityPercent?: string;//商机概率
    opportunityOwner?: string;//商机负责人
    salesType?: string; //销售类型
    country?: string;//国家
    district?: string;//区域
    city?: string;//城市
    status?: string;//状态
    request?: string;//需求
    nameOfAgent?: string;//代理商名称
    remarks?: string;
    active?: boolean;
    deleted?: boolean;
    orderIndex?: number// 排序
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}
