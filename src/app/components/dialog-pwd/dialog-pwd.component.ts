import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AuxBtService } from '../../service/aux-bt.service'
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../common/util/user'
import { regular } from '../../common/util/regular'
@Component({
  selector: 'app-dialog-pwd',
  templateUrl: './dialog-pwd.component.html',
  styleUrls: ['./dialog-pwd.component.scss']
})
export class DialogPwdComponent implements OnInit {
  pwd: String;
  pwdFlag: boolean = false;

  @Input() config;
  @Input() onDialogClose;

  constructor(
    public auxBt: AuxBtService,
		public translate: TranslateService,
		public user: User,
		public reg: regular,
  ) {

   }

  ngOnInit() {
  }

  focusInput(flag?:boolean){
    if (!this.pwd) this.pwdFlag = !!flag
  }
  sub_send(){
    this.config.callback(this.pwd);
  }
  close(){
    this.onDialogClose();
  }

}
