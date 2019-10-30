import {Injectable} from '@angular/core';
import {User} from './user';
import {service} from './service';
import {regular} from './regular';

@Injectable()
export class resetData {
    public pairPromise: any;
    public coinPromise: any;

    constructor(
        private service: service,
        private user: User,
        private regular: regular
    ) {
        this.pairs();
        this.coins()
    }


    /**
     * 获取所有交易对
     */
    pairs() {
        this.pairPromise = new Promise((resolve, reject) => {
            this.service.pairs()
                .then((res: any) => {
                    if (res.status === 0) {
                        resolve(res.data);
                        if (!this.user.getItem('defaultSymbol') && res.data.length > 0) {
                            this.user.setItem('defaultSymbol', res.data[0].pair);
                        }
                    }
                })
        });
    }

    async getPairs() {
        return await this.pairPromise;
    }

    /**
     * 获取所有币种
     */
    coins() {
        this.coinPromise = new Promise((resolve, reject) => {
            this.service.coins().then((res: any) => {
                if (res.status === 0) {
                    resolve(res.data);
                }
            });
        });
    }

    async getCoins() {
        return await this.coinPromise;
    }


    /**
     *
     * BTC==> USDT 估值处理
     *
     */


    /**
     * 匹配交易对  获取并计算该币对应BTC的价格
     * @param symbol  币种
     * @param tickerList  行情列表
     * @param available 可用余额
     */
    matchPair(symbol, tickerList, available) {
        if (!!!available) {
            available = 0;
        }
        let _tickerList = JSON.parse(JSON.stringify(tickerList));

        // 特殊处理资产列表BTC估值
        if (symbol === 'BTC') {
            return available;
        }

        // 计算 USDT对应BTC价格   USDT为quote
        const list1 = _tickerList.filter(ele => {
            return ele.pair === 'BTC_USDT';
        });
        let _price = (list1[0] && list1[0].close != 0 && this.regular.toDividedByAry([1, list1[0].close], 8)) || 0;

        const list2 = tickerList.filter(ele => {
            return symbol === ele.pair.split('_')[0] && ele.pair.split('_')[1] === 'USDT';
        });
        if (list2.length > 0) {
            let _p = this.regular.toBigsells([list2[0].close, _price, available], 8);
            return this.regular.comparedTo(_p, 0) == 1 ? _p : '--';
        }

        // 计算 ETH对应BTC价格  ETH为quote
        const list3 = _tickerList.filter(ele => {
            return ele.pair === 'ETH_USDT';
        });
        let _price1 = (list3[0] && list3[0].close != 0 && this.regular.toDividedByAry([1, list3[0].close], 8)) || 0;

        const list4 = tickerList.filter(ele => {
            return symbol === ele.pair.split('_')[0] && ele.pair.split('_')[1] === 'ETH';
        });
        if (list4.length > 0) {
            let _p = this.regular.toBigsells([list4[0].close, _price1, available], 8);
            return this.regular.comparedTo(_p, 0) == 1 ? _p : '--';
        }

        // 计算 BTC为quote
        const list5 = _tickerList.filter(ele => {
            return ele.pair.split('_')[1] === 'BTC';
        });

        const list6 = tickerList.filter(ele => {
            return symbol === ele.pair.split('_')[0] && ele.pair.split('_')[1] === 'BTC';
        });
        if (list6.length > 0) {
            let _p = this.regular.toBigsells([list6[0].close, list5[0].close, available], 8);
            return this.regular.comparedTo(_p, 0) == 1 ? _p : '--';
        }

        // 特殊处理 usdt
        if (symbol === 'USDT' && this.regular.comparedTo(available, 0) == 1) {
            return this.regular.toBigsells([_price, available], 8);
        }

        return '--';
    }

    /**
     * 计算BTC ==> USDT的价格
     * @param symbol  币种
     * @param tickerList  行情列表
     * @param available 可用余额
     * @param usdtPrice 1BTC对应的USDT价格
     * @param pair 交易页面估值传入的交易对
     */
    raleUsdt(symbol, tickerList, available, usdtPrice, pair?) {
        if (!!!available) {
            available = 0;
        }

        let btcPrice = this.matchPair(symbol, tickerList || '', 1);

        // 特殊处理资产列表USDT、BTC估值
        if (symbol === 'USDT' && !pair) {
            return available;
        }
        if (symbol === 'BTC' && !pair) {
            return this.regular.toBigsells([usdtPrice, available], 4);
        }

        // 特殊处理 交易页面 两大quote下面的估值
        const ary = tickerList.filter(ele => {
            return ele.pair === `${symbol}_USDT`;
        });
        const aryBtc = tickerList.filter(ele => {
            return ele.pair === `${symbol}_BTC` && ele.pair === pair;
        });

        // 特殊处理 交易页面  BTC
        if (aryBtc[0] && pair) {
            return this.regular.toBigsells([aryBtc[0].close, usdtPrice, available], 4);
        }

        // 特殊处理 交易页面  USDT
        if (ary[0] && pair) {
            return this.regular.toBigsells([ary[0].close, available], 4);
        } else {
            return btcPrice != '--' ? this.regular.toBigsells([btcPrice, usdtPrice, available], 4) : '--';
        }
    }

    /**
     * 获取 BTC ==> USDT的价格
     */
    getUsdt() {
        return this.service.getOkexTime().then(res => {
            return res.data.USDT || 1;
        })
    }

    /**
     * 获取行情数据 - new
     */
    getPairsList() {
        return this.service.getPairsList({}).then((res: any) => {
            return (res.status === 0 && res.data) || []
        })
    }


}
