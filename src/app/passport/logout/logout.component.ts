import { Component} from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.less']
})
export class UserLogoutComponent  {

    oauth_server = environment.oauth_server;
    login() {
        window.open(this.oauth_server, '_self');
    }
}
