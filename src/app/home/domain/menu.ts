export interface SysMenu {
  id?: string,
  key?: string,
  title?: string,
  name?:string,
  parentId?: number,
  parentKey?: number,
  path?: string,
  sourceUrl?: string,
  indexof?: number,
  icon?: string,
  level?: number,
  expand?: boolean,
  children?: SysMenu[]
  parent?: SysMenu,
  button?: boolean,
}
