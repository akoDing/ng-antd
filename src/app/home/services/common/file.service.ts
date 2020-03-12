import { Injectable } from '@angular/core';
import { ApiService } from '../../../uilib/services/api.service';

@Injectable()
export class FileService {

    constructor(
        private apiService: ApiService,
    ) { }

    transferFiles2(data, type) {
        const fileList = [];
        data.forEach(element => {
            const file = new File();
            file.id = element.id;
            file.name = element.name;
            file.fileType = type;
            file.url = this.apiService.getFullHref(`appbiz/file2/${element.id}`);
            fileList.push(file);
        });
        return fileList;
    }


    transferFiles(data) {
        const fileList = [];
        data.forEach(element => {
            const file = new File();
            file.id = element.id;
            file.name = element.name;
            file.url = this.apiService.getFullHref(`appbiz/file2/${element.id}`);
            fileList.push(file);
        });
        return fileList;
    }

    transferFile(id: string, name: string) {
        const file = new File();
        file.id = id;
        file.name = name;
        file.url = this.apiService.getFullHref(`appbiz/file2/${id}`);
        return file;
    }
}

class File {
    id = '';
    name = '';
    status = 'done';
    fileType = '';
    response = '{"status": "success"}';
    url = '';
}
