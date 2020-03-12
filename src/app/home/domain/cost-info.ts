export interface CostInfo {
    id?: string;//自增
    name?: string; //成本名称
    priceCn?: number; //价格（CNY）
    priceUs?: number;   //价格（USD）
    unit?: string;  //单位
    orderIndex?: number;  //序号
    deleted?: boolean;  //是否被删除,0-未删除，1-删除
    remarks?: string; //备注
    status?: string; //状态，0-有效，1-无效
    active?: boolean; //是否启用，false-未启用，true-启用
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}
