export interface CostCenter {
    id?: string;//自增
    costCenterName?: string;//成本中心名称
    costOwner?:string;//负责人
    costOwnerEmail?:string;//负责人邮箱
    controller?:string;
    controllerEmail?:string;//controller邮箱
    order_index?: number// 排序
    active?: boolean;
    deleted?: boolean;
    remarks?: string;
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}