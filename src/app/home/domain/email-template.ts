export interface EmailTemplate {
    id?: string;//自增
    title?: string;
    content?: string;
    orderIndex?: number;
    active?: boolean;
    deleted?: boolean;
    remarks?:string;
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}