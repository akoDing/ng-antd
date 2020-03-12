export interface Region {
    id?: string;//自增
    region?:string;//区域 //enum中region的name，单个
    province?: string;//省份 enum中province的name，多个，链接符号','
    leader?: any;
    // order_index?: number// 排序
    active?: boolean;
    deleted?: boolean;
    remarks?: string;
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}
