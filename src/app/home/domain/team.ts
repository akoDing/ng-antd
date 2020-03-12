export interface Team {
    id?: string;//自增
    teamName?: string;
    teamLeader?: any;
    region?: string;
    remarks?: string;
    active?: boolean;
    deleted?: boolean;
    orderIndex?: number// 排序
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}
