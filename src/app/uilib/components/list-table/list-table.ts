export class DataColumn {
  key: string;
  label: string;
  /** text click event */
  clickEvent?: Function;
  translate?: boolean;
  /** convert text */
  formatContent?: Function;
  formatWhenEmpty?: Function;
}

export class ButtonColumn {
  /** button column head title */
  label: string;
  buttons: TableButton[];
}

export class TableButton {
  label: string;
  /** button click event */
  event: Function;
  /** button show event */
  icon?: string;
  isVisible: Function;
  confirm?: boolean;
  confirmTitle?: string;
}

export class TableInfo {
  frontPaging?: boolean;
  showPaging?: boolean;
  size?: string;
  total?: number;
  pageIndex?: number;
  sizeOption?: number[];
  pageSize?: number;
  isEmptyTableVisible?: boolean;
  showSizeChanger?: boolean;
  loading?: boolean;
  dataColumns: DataColumn[];
  buttonColumn?: ButtonColumn;
  data: any[];
}
