export interface M12ncCode {
  id?: string;//自增
  m12ncCode?: string; //12nc码
  description?: string; //描述
  deleted?: boolean;  //是否被删除,0-未删除，1-删除
  mag?: string;
  productHierarchy?: string;
  thirdParty?: string;
  remarks?: string;
  insertUser?: string;
  insertTime?: Date;
  updateUser?: string;
  updateTime?: Date;
}
