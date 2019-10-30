import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {User} from '../../common/util/user';
import {service} from '../../common/util/service';
import {regular} from '../../common/util/regular';
import {resetData} from '../../common/util/resetData';
import {ScokeIoService} from '../../service/scoke-io.service';
declare var $
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    subServe: Subscription = new Subscription();

    public explainList: Array<any> = [
        {name: 'n1', val: 'n1t'},
        {name: 'n2', val: 'n2t'},
        {name: 'n3', val: 'n3t'},
        {name: 'n4', val: 'n4t'},
        {name: 'n5', val: 'n5t'},
    ];

    public menuList: Array<any> = [
        {
            title: 'AboutAyra',
            list: [
                {val: 'apiDoc',link: 'http://doc.lyra.site:4567'},
                {val: 'xstar',link: ''},
                {val: 'dexContract',link: 'http://doc.lyra.site:4567/#dex-contract'},
                {val: 'aboutAssets',link: 'http://doc.lyra.site:4567/#about-asset'},
                {val: 'aboutOrders',link: 'http://doc.lyra.site:4567/#about-order'}
            ]
        },
        {
            title: 'aboutUS',
            list: [
                {val: 'company',link: ''},
                {val: 'joinUs',link: ''},
                {val: 'contactUs',link: ''}
            ]
        },
        {
            title: 'customerSupport',
            list: [
                {val: 'support',link: ''},
                {val: 'termsService',link: ''},
                {val: 'disclosures',link: ''},
                {val: 'privacyPolicy',link: ''}
            ]
        }
    ];

    // TickerList
    public tickerList: Array<any> = [];
    public tickerListObj: any = {};

    // 所有交易对精度对象
    pairObj: Object = {};

    // CoinList
	coinListObj: Object = {};

    explainActIndex: number = 0;

    btcToUsdt: number = null;
    raleUsdtTime: any = null;

    constructor(
        public router: Router,
        private user: User,
        public scoket: ScokeIoService,
        private service: service,
        public regular: regular,
        private reset: resetData,
    ) {

    }

    ngOnInit(): void {
        this.subWsServe();
        this.getPairsList();
        setTimeout(() => this.scoket.subscribeTicker(), 2000)
    }

    ngOnDestroy(): void {
        clearInterval(this.raleUsdtTime);
        this.scoket.wsCloseSocket();
        this.subServe.unsubscribe();
    }

    /**
     * 订阅ws服务
     */
    subWsServe(): void {
        this.subServe.add(this.scoket.getSubObservable().subscribe(res => {
            if (res.type === 'ticker' && !!res.result.data.pair) {
                this.setWSPrice(res.result.data)
            }
        }))
    }

    /**
     * ws推送价格
     * @param data
     */
	setWSPrice(data) {
		if (!this.tickerList || this.tickerList.length == 0) {
			return
		}
		// let findIndex = this.tickerList.findIndex((val) => {
		// 	return val.pair === data.pair;
		// });
		// if (findIndex != -1 && this.tickerList[findIndex].v < data.v) {
		// 	this.tickerList[findIndex].close = data.close;
		// 	this.tickerList[findIndex].change = data.change;
		// 	this.tickerList[findIndex].base_vol = data.base_vol;
		// } this.pairObj[item.pair]
        this.tickerListObj[data.pair] = {
            close: this.regular.numFormat( this.regular.toFixed(data.close, Number(this.pairObj[`${data.pair}`].split("_")[1] || 4)) ),
            base_vol: this.regular.numFormat( this.regular.toFixed(data.base_vol, Number(this.pairObj[`${data.pair}`].split("_")[0] || 4)) ),
            change: data.change,
        }
	}

    /**
     * 获取Coin、Pair
     */
	async getPairsList(){
		let pairData, coinData;
		await this.reset.getPairs().then(res => { pairData = JSON.parse(JSON.stringify(res)) });
        await this.reset.getCoins().then(res => { coinData = JSON.parse(JSON.stringify(res)) });

        for(let item of coinData) { this.coinListObj[item.symbol] = item }
		for(let item of pairData){ this.pairObj[item.pair] = (item.amount_precision || 0) +'_'+ (item.price_precision || 0) }
		this.getTickersList();
    }

    /**
     * 获取交易对 - new
     */
	getTickersList() {
		let data = {};
		this.service.getPairsList(data).then((res: any) => {
			if (res.status == 0) {
				for(let item of res.data){
                    const base = this.splitPair(item.pair, 0);
					item['amountPrecision'] = Number(this.pairObj[`${item.pair}`].split("_")[0] || 4);
					item['priciPrecision'] = Number(this.pairObj[`${item.pair}`].split("_")[1] || 4);
					item['name'] = this.coinListObj[base].name;
					// item['base_vol'] = this.regular.numFormat( this.regular.toFixed(item.base_vol, item['amountPrecision']) );
					// item['close'] = this.regular.numFormat( this.regular.toFixed(item.close, item['priciPrecision']) );
                    item['USDT'] = null;
                    this.tickerListObj[item.pair] = {
                        close: this.regular.numFormat( this.regular.toFixed(item.close, item['priciPrecision']) ),
                        base_vol: this.regular.numFormat( this.regular.toFixed(item.base_vol, item['amountPrecision']) ),
                        change: item.change
                    }
				}
                this.tickerList = res.data;
				// this.raleUSD();
                // this.raleUsdtTime = setInterval(() => {
                //     this.raleUSD();
                // }, 3000)
			}
		})
	}

    /**
     * raleUSD
     */
    async raleUSD(){
       if(!this.btcToUsdt) this.btcToUsdt = await this.reset.getUsdt();
        for(let item of this.tickerList){
            item['USDT'] = this.reset.raleUsdt(item.pair.split("_")[0],this.tickerList, 1, this.btcToUsdt, item.pair);
        }
    }

    go(link){
        if(link) window.open(link);
    }

    link(path){
        let url = path;
        if(path == 'trade'){
            let pairs = this.user.getItem('defaultSymbol');
            url = 'trade/' + pairs
        }
        this.router.navigateByUrl(url);
    }

    /**
     * splitPair
     * @param pair
     * @param num
     */
    splitPair(pair:String, num:any){
        return pair.split('_')[num]
    }

    /**
     * banner action animation
     * @param type
     */
    action(type: string): void{
        $("#home-explain-con-box").animate({
            marginLeft: type === 'add' ? "+=1160px" : "-=1160px"
        },1000);
        type === 'add' ? this.explainActIndex-- : this.explainActIndex++ ;
    }

}
