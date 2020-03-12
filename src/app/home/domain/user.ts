import {UserDetail} from './user-detail';
import {SysRole} from './role';

export interface SysUser {
  id?: number,
  username: string,
  name: string,
  phoneNumber: string,
  mail: string,
  disable: boolean,
  description?: string,
  detail?: UserDetail
  roles?: SysRole[]
}
