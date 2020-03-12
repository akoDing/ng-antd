export interface TeamMember {
    id?: string;//自增
    sysUserId?: string;
    teamId?: string;
    remarks?: string;
    active?: boolean;
    deleted?: boolean;
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}
