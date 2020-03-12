export interface CommentTemplate {
    id?: string;//自增
    name?: string;
    orderIndex?: number;
    active?: boolean;
    deleted?: boolean;
    remarks?:string;
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}