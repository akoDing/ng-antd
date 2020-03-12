export interface ApprovalConfig {
    id?: string;//自增
    approvalName?: string;//审批名称
    approvalType?: string;//审批类型
    needUpload?: string;//是否需要上传
    active?: boolean;
    deleted?: boolean;
    remarks?: string;
    insertUser?: string;
    insertTime?: Date;
    updateUser?: string;
    updateTime?: Date;
}
