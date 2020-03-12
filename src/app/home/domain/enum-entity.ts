export interface EnumEntity {
  id?: string;
  name?: string;
  code?: string;
  display?: string;
  key?: string;
  parentKey?: string;
  indexof?: number;
  //below for tree-table
  zh?: string;
  en?: string;
  level?: number;
  expand?: boolean;
  parent?: EnumEntity;
  children?: EnumEntity[];
}