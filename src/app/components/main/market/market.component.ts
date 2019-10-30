import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { service } from '../../../common/util/service';

import BigNumber from "bignumber.js";
import { User } from '../../../common/util/user';
import { DialogController } from '../../../controller/dialog';
import { ConterAlertComponent } from '../../alert/conter-alert/conter-alert.component';
import { ScokeIoService } from '../../../service/scoke-io.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {

    marketList: Array<any>;
    marketShowList: Array<any>;

    active: string;
    tokenName: string;
    kind: string = '';
    step: string;
    type: boolean;

    //币种列表
    symbolList: Array<any>;
    tickerData: Array<any>;
    tickerList: Array<any>;

    constructor(
        private service: service,
        private router: Router,
        private user: User,
        private dialog: DialogController,
        private scoket: ScokeIoService,
        public translate: TranslateService,
    ) { }

    ngOnInit() {
        this.init();  
    }

    init(){
        this.getPairsList();

    }
    //切换状态
    activated(active){
        if(this.active == 'optional'){
            this.active = active;
            this.getPairsList();
            
        }else{
            this.active = active;
            if(active == 'optional'){
                this.getCollectPair();
            }else{
                this.analysisTicker();
            }
        }
        
        
       
    }
    //选中自选
    check(i, active){
        if(this.user.token()){
            this.checkTicker(i.pair, active);
        }else{
            this.unLogin();
        }
    }
    alert(config){
        this.dialog.createFromComponent(ConterAlertComponent,config)
    }

    unLogin(){
        
        const config = {
            tip: this.translate.instant('Login.isGoLoginTip1'),
            tipKey: this.translate.instant('Login.isGoLoginTip2'),
            callbackSure: ()=>{
                this.router.navigateByUrl('/user/login')
            },
            callbackCancel: ()=>{ },
        }
        this.alert(config);
    }
    //查看交易对详情
    goTo(ticker){
        this.router.navigateByUrl('trade/'+ticker);
    }
    //排序
    tickerSort(active){
        this.step = active;
        this.type = this.kind != active ? false : true;
        this.sort(active, this.type);
        this.kind = !this.type ? active : '' ;
    }
    sort(column, type){
        if (!this.marketShowList) return;
        this.marketShowList.sort((pre, next) => {
            let result: boolean;
            if (column == 'pair') {
                result = pre[column] > next[column];
            } else {
                result = new BigNumber(pre[column]).isGreaterThan(new BigNumber(next[column])) || (new BigNumber(pre[column]).isEqualTo(new BigNumber(next[column])) && pre['tokenName'] > next['tokenName']);
            }
            if (result) {
                return type ? 1 : -1;
            } else {
                return type ? -1 : 1;
            }
        })
    }
    //搜索关键字变化后
    onTokenNameChange() {
        this.marketShowList = this.marketList.filter(data => {
            return data.pair.toLocaleLowerCase().indexOf(this.tokenName.toLocaleLowerCase()) !== -1;
        }).filter(data => {
            return this.active === 'optional' ? true : data.baseName = this.active;
        });
    }

    //获取交易对 - new
    getPairsList(){
        let data = {};
        this.service.getPairsList(data).then((res:any)=>{
            
            if(res.status == 0){
                this.tickerList = res.data;
                let defaultSymbol = (res.data[0].pairs[0].pair || 'RNT_ETH').replace(/\//g, '_');
                this.user.setItem('defaultSymbol', defaultSymbol);
                this.analysisTicker();
            }
        })
    }
    //解析基础货币 与 交易对
    analysisTicker(){
        this.symbolList = [];
        if(this.tickerList && this.tickerList.length > 0){
            this.active = this.active ? this.active  : this.tickerList[0].symbol;
            for(let i of this.tickerList){
                this.symbolList.push(i.symbol);
                if(this.active == i.symbol){
                    this.marketList = [].concat(JSON.parse(JSON.stringify(i.pairs)));

                    if(this.tokenName){
                        this.onTokenNameChange();
                    }else{
                        this.marketShowList = this.marketList;
                    }
                }
            }
        }
    }
    
    //存储选中的交易对
    checkTicker(ticker, active){
        let data = {
            pair: ticker,
            collect: active
        }
        this.service.collectPair(data).then((res:any)=>{
            if(this.active == 'optional'){
                this.getCollectPair();
            }else{
                this.getPairsList();
            }
            
        })
    }
    //查看收藏交易对
    getCollectPair(){
        let data = {}
        if(this.user.getItem('account')){
            this.service.getCollectPair(data).then((res:any)=>{
                if(res.status == 0){
                    this.marketList = [].concat(JSON.parse(JSON.stringify(res.data)));
                    if(this.tokenName){
                        this.onTokenNameChange();
                    }else{
                        this.marketShowList = this.marketList;
                    }
                }
            })
        }else{
            this.marketShowList = [];
        }
        
    }

    



}
