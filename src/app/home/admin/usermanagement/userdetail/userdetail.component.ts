import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../../../uilib/services';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {SysUser} from '../../../domain/user';
import {UserDetail} from '../../../domain/user-detail';
import {SysRole} from '../../../domain/role';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.less']
})
export class UserdetailComponent implements OnInit {

  validateForm: FormGroup;

  @Input()
  user: SysUser;

  @Input()
  readonly: boolean;

  @Output()
  afterSave = new EventEmitter();

  selectRoles: SysRole[] = [];

  userDetailConfig = [
    {
      title: 'Code',
      key: 'codeid',
      span: 1
    }, {
      title: '雇员ID',
      key: 'staffid',
      span: 1
    }, {
      title: 'PM Code',
      key: 'pmCode',
      span: 1
    }, {
      title: '性别',
      key: 'gender',
      span: 1
    }, {
      title: '年龄',
      key: 'age',
      span: 1
    }, {
      title: '生日',
      key: 'birthday',
      span: 1
    }, {
      title: '大区',
      key: 'district',
      span: 1
    }, {
      title: '部门',
      key: 'category',
      span: 1
    }, {
      title: '直属上级',
      key: 'direct',
      span: 1
    }, {
      title: '级别',
      key: 'grade',
      span: 1
    }, {
      title: '角色',
      key: 'userrole',
      span: 1
    }, {
      title: '位置',
      key: 'position',
      span: 1
    }, {
      title: '传真',
      key: 'fax',
      span: 1
    }, {
      title: '紧急联络',
      key: 'emergency',
      span: 1
    }, {
      title: '紧急邮件',
      key: 'emergencyemail',
      span: 1
    }, {
      title: '是否工程师',
      key: 'isengineer',
      span: 1
    }, {
      title: '模式',
      key: 'modality',
      span: 1
    }, {
      title: '状态',
      key: 'lmemail',
      span: 1
    }, {
      title: '加入日期',
      key: 'joindate',
      span: 1
    }, {
      title: '省',
      key: 'province',
      span: 1
    }, {
      title: '市',
      key: 'city',
      span: 1
    }, {
      title: '区',
      key: 'area',
      span: 1
    }, {
      title: 'FSE',
      key: 'fseid',
      span: 1
    }, {
      title: '标记',
      key: 'remark',
      span: 1
    }, {
      title: '是否被移除',
      key: 'isdelete',
      span: 1
    }, {
      title: '成本中心',
      key: 'costcenter',
      span: 1
    }
  ];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
    hidePreviewIconInNonImage: true
  };
  fileList: any[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private msg: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.showUploadList.showRemoveIcon = !this.readonly;
    this.selectRoles = this.user.roles ? this.user.roles : [];
    this.validateForm = this.fb.group({
      username: [{value: this.user.username, disabled: this.readonly}],
      lastname: [{value: this.user.name, disabled: this.readonly}],
      phoneNumber: [{value: this.user.phoneNumber, disabled: this.readonly}],
      mail: [{value: this.user.mail, disabled: this.readonly}],
      roles: [{value: this.user.roles ? this.user.roles : [], disabled: this.readonly}]
    });
    // 获取用户详情
    this.apiService.getJson(`appbiz/user/detail/${this.user.id}`).subscribe(res => {
      if (res && res.success) {
        const userDetail = res.result;
        this.user.detail = {...userDetail} as UserDetail;
        console.log(userDetail.avatar);
        this.fileList = userDetail ? [{
          uid: -1,
          name: 'photo',
          status: 'done',
          url: userDetail.avatar ? userDetail.avatar : "./assets/img/user.png",
        }] : [];
      } else {
        this.msg.error(res.data);
      }
    }, (err) => {
      this.msg.error('action failed.');
    });
  }

  submitForm = (event: any) => {
    event.preventDefault();
    const rawValue = {
      ...this.user,
      ...this.validateForm.getRawValue(),
      detail: {
        ...this.user.detail,
        avatar: this.fileList[0] ? this.fileList[0]['url'] : null
      }
    };
    this.apiService.postJSON(`appbiz/staffUser/updateUser`, {...this.user, ...rawValue}).subscribe(res => {
      if (res.success) {
        this.msg.success('提交成功！');
        this.afterSave.emit(true);
      } else {
        this.msg.error(res.result);
      }
    }, error => {
      this.msg.error(error);
    });
  };

  closeTabWithoutSave(event) {
    event.preventDefault();
    this.afterSave.emit(this.user);
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  searchRole = (keyword) => {
    keyword && this.apiService.get(`appbiz/role/findBy/${keyword}`).subscribe(res => {
      if (res.success) {
        let roles: SysRole[] = [];
        let roleMap: any = {};
        this.user.roles.forEach(item => {
          roleMap[item.id] = item;
        });
        res.result.forEach(item => {
          roleMap[item.id] = item;
        });
        for (let key in roleMap) {
          roles.push(roleMap[key]);
        }
        this.selectRoles = [...roles];
      }
    });
  };

  beforeUpload = (file): boolean => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      const newFile = {
        uid: -1,
        name: file.name,
        status: 'done',
        url: e.currentTarget['result'],
      };
      this.fileList = [];
      this.fileList = this.fileList.concat(newFile);
    };
    return false;
  };

}
