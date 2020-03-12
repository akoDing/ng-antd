import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChildren } from '@angular/core';
import { EnumEntity } from '../../../domain';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../../../uilib/services';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { generateTree } from '../../../../uilib/util/TreeUtil';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-enum-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class EnumTableComponent implements OnInit {

  dataList: EnumEntity[] = [];
  tmpList: EnumEntity[] = [];
  _operatingFlag: boolean = false;
  mapOfExpandedData: { [id: string]: EnumEntity[] } = {};

  @Output()
  onEdit = new EventEmitter();

  @Output()
  onCreate = new EventEmitter();

  @Output()
  onInsert = new EventEmitter();

  @Input() reload: Subject<boolean>;

  searchForm: FormGroup;
  controlNameList = ['name', 'display','displayName'];
  pageSize: number = 10;
  pageIndex: number = 1;

  constructor(private fb: FormBuilder, private apiService: ApiService, private msg: NzMessageService, private translateService: TranslateService) {
    this.searchForm = this.fb.group({});
    for (let item of this.controlNameList) {
      this.searchForm.addControl(item, new FormControl())
    }
    this.loadTable();

  }

  ngOnInit() {
    this.reload.subscribe(res => {
      console.log('reload data', res);
      if (res === true) {
        this.loadTable();
      }
    });
    
  }

  loadTable(pageNumber?: number) {
    // this.loadFakeData();
    const uri = 'appbiz/enum/findAll';//EnumEntity 不分页
    // const param = {
    //   'advQuery': {
    //     'deleted': 0
    //   },
    // };
    this._operatingFlag = true;
    this.apiService.callApi(this.apiService.get(uri),
      async (res: any) => {
        console.log(res);
        if (res && res.success) {
          console.log('success');
          this.tmpList = [...res.result];


          const zhDict = await this.translateService.getTranslation('zh').toPromise();
          const zhBackendDict = (zhDict && zhDict.backend) ? zhDict.backend : {};
          const enDict = await this.translateService.getTranslation('en').toPromise();
          const enBackendDict = (enDict && enDict.backend) ? enDict.backend : {};
          
          this.tmpList.forEach(item => {
            item.zh = zhBackendDict[item.name] || '';
            item.en = enBackendDict[item.name] || '';
          })

          console.log('tmpList after translate', this.tmpList);
          

          // this.dataList = [...res.result];
          this.doSearch();
          console.log('after doSearch', this.dataList);
          if (pageNumber) {
            this.pageIndex = pageNumber;
          }
          
          
        } else {
          console.log('failed', res);
        }
        this._operatingFlag = false;
      }, (res: any) => {
        this._operatingFlag = false;
      }
    );

  }

  doSearch(e?) {
    if (e) {
      e.preventDefault();
    }

    // main search functionality
    let filterRows = this.tmpList;
    for (let key in this.searchForm.controls) {
      const currentFiltername = key;
      const userInput = this.searchForm.controls[key].value ? this.searchForm.controls[key].value.toLowerCase() : null;
      let keyOfRowList = [];
      keyOfRowList.push(key);
      if (key === 'displayName') {
        keyOfRowList = ['zh', 'en'];
      }

      let tmpResultRows = [];
      for(let itemKey of keyOfRowList) {
        let partlyRows = filterRows.filter(item => {
          if (!item[itemKey] && '' !== item[itemKey]) {
            return false;
          } else return item[itemKey].toLowerCase().indexOf(userInput) !== -1 || !userInput; 
        });

        tmpResultRows = tmpResultRows.concat(partlyRows).filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.key === item.key)));
      }
      filterRows = tmpResultRows;
    }

    //find all parents node in the raw filterRows
    let leftList = this.subtractArrays(this.tmpList, filterRows);
    console.log('leftList', leftList);
    this.getAllParentNode(leftList, filterRows);

    // update the rows
    this.dataList = filterRows;
    console.log('dataList', this.dataList);

    // Whenever the filter changes, always go back to the first page
    this.pageIndex = 1;

    let tree: EnumEntity = {};
    generateTree(this.dataList, null, tree);
    console.log('tree', tree);
    this.dataList = [];
    if (tree.children && tree.children.length > 0) {
      this.dataList = [...tree.children]
    }
    this.mapOfExpandedData = {};
    this.dataList.forEach(item => {
      this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
    });

    
  }

  //subtract a2 from a1
  subtractArrays(a1, a2) {
    let arr = [];
    a1.forEach((o1) => {
      let found = false;
      a2.forEach((o2) => {
        if (o1.key === o2.key) {
          found = true;
        }
      });
      if (!found) {
        arr.push(o1);
      }
    })
    return arr;
  }

  getAllParentNode(remainList: any[], finalList:any[]) {
    let newFinalItems = [];
    for(const item of finalList) {
      if(item.parentKey) {
        let pid = item.parentKey;
        remainList = remainList.filter(el => {
          if(el.key === pid) {
            newFinalItems.push(el);
            return false;
          } else {
            return true;
          }
        });
      }
    }
    newFinalItems.forEach(el => {
      finalList.push(el);
    })
    if(newFinalItems.length > 0) {
      this.getAllParentNode(remainList, finalList);
    }
  }

  doReset(e) {
    e.preventDefault();
    this.searchForm.reset();
  }

  convertTreeToList(root: EnumEntity): EnumEntity[] {
    const stack: EnumEntity[] = [];
    const array: EnumEntity[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });
    while (stack.length !== 0) {
      const node: EnumEntity = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: true, parent: node });
        }
      }
    }
    return array;
  }

  visitNode(node: EnumEntity, hashMap: { [id: number]: any }, array: EnumEntity[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  collapse(array: EnumEntity[], data: EnumEntity, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  delete(item) {
    const className = 'net.mopos.admin.entity.EnumEntity';
    const uri = 'appbiz/i18n/remove/' + className + ':' + item.id;
    this.apiService.delete(uri).subscribe(res => {
      if (res && res.success) {
        this.msg.success('Done.');
        this.translateService.reloadLang(this.translateService.currentLang || 'zh');
        this.loadTable(1);
      } else {
        this.msg.error('action failed.');
      }
    }, err => {
      this.msg.error('action failed.');
      console.log(err);
    });
  }

  edit(item: EnumEntity) {
    this.onEdit.emit(item);
  }

  insert(item: EnumEntity) {
    this.onInsert.emit(item);
  }

  create() {
    this.onCreate.emit();
  }

  ngOnDestroy(): void {
    // console.log('menutree instance destroyed!');
    this.reload.unsubscribe();
  }

}
