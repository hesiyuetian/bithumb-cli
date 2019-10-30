import { Injectable } from '@angular/core';
import axiosService from './axios';
import { AuxBtService } from '../../service/aux-bt.service'
import { CONFIG } from './config'

import axios from 'axios'

@Injectable()
export class service {
    static userAddress =   `${CONFIG.apiUrl}/v1/account`;
    static assetAddress =  `${CONFIG.apiUrl}/v1/asset`;
    static ordersAddress = `${CONFIG.apiUrl}/v1/orders`;
    static marketAddress = `${CONFIG.apiUrl}/v1/market`;
    static commonAddress = `${CONFIG.apiUrl}/v1/common`;

    //服务器时间戳
    time: string;
    constructor(
        private auxBt: AuxBtService
    ){

    }

    /**
     *
     */
    timestamp() {
        let config = {
            url: `${service.commonAddress}/timestamp`,
            method: "get",
            params: {}
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
                .then((data) => {
                    resolve(data.data);
                    if(data.data.status === 0) this.time = data.data.data.toString()
                })
                .catch()
        })
    }

    /**
     * new登录
     */
    async newLogin(data:any) {
        await this.timestamp();

        const channel = CONFIG.channel;
        let paramsData = {
            timestamp: this.time,
            channel: channel,
            sig: this.auxBt.loginSign(this.time,data.user,channel)
        };
        let config = {
            url: `${service.userAddress}/authorize`,
            method: 'post',
            data: Object.assign(paramsData, data)
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 提现
     */
    withdraw(data:object) {
        let config = {
            url: `${service.assetAddress}/withdraw`,
            method: "post",
            data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 获取所有币种
     */
    coins(data?:object) {
        let config = {
            url: `${service.commonAddress}/coins`,
            method: "get",
            params: {}
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 获取所有交易对
     */
    pairs(data?:object) {
        let config = {
            url: `${service.commonAddress}/pairs`,
            method: "get",
            params: {}
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 委托下单
     */
    create(data:object) {
        let config = {
            url: `${service.ordersAddress}/create`,
            method: 'post',
            data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

     /**
     * 订单历史
     */
    list(data:object) {
        let config = {
            url: `${service.ordersAddress}/list`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 交易历史
     */
    transactionHistory(data:object) {
        let config = {
            url: `${service.ordersAddress}/trade/history`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 获取二十条交易记录
     */
    newTrade(data:object) {
        let config = {
            url: `${service.marketAddress}/trade`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 所有交易对行情
     */
    getPairsList(data:object) {
        let config = {
            url: `${service.marketAddress}/tickers`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 收藏交易对
     */
    collectPair(data:object) {
        let config = {
            url: `${service.userAddress}/collect`,
            method: 'post',
            data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 查询深度全量
     *
     */
    depthData(data:object) {
        let config = {
            url: `${service.marketAddress}/depth`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 获取收藏的交易对
     */
    getCollectPair(data:object) {
        let config = {
            url: `${service.userAddress}/collect/list`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 委托单撤单
     */
    cancel(data:object) {
        let config = {
            url: `${service.ordersAddress}/cancel`,
            method: 'post',
            data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }


    /**
     * 委托单列表
     */
    tradeList(data:object) {
        let config = {
            url: `${service.ordersAddress}/trade`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 资产列表
     */
    assetList() {
        let config = {
            url: `${service.assetAddress}/list`,
            method: 'get',
            params: {}
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 资产列表更新
     */
    getBalance(data:object) {
        let config = {
            url: `${service.assetAddress}/balance`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 资产详情
     */
    assetDetail(data:object) {
        let config = {
            url: `${service.assetAddress}/detail`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 资产充值/提现记录
     */
    assetHistory(data:object) {
        let config = {
            url: `${service.assetAddress}/history`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 资产充值/提现记录 详情
     */
    assetHistoryDetail(data:object) {
        let config = {
            url: `${service.assetAddress}/history/detail`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 交易对比率
     */
    async parils(params) {
        let config = {
            url: `${service.commonAddress}/priceConversion`,
            method: 'get',
            params: params
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        })
    }

    /**
     * 获取BTC--->USD汇率
     */
    getOkexTime(){
        return axios.get('https://min-api.cryptocompare.com/data/price', {
        　　params: {
                fsym: 'BTC',
                tsyms: 'USDT',
            }
        })
    }

    /**
     *
     */
    authorizations() {
        // /api/v2/help_center/{locale}/categories.json
        // https：// {subdomain} .zendesk.com / api / sunshine / objects / records
        // https://btdex.zendesk.com/api/v2/groups.json
        // https://support.bitrabbit.com/hc/api/v2/zh-cn/sections/${section_id}/articles.json
        // curl https://btdex.zendesk.com/api/v2/help_center/en-us/articles.json -v -u zhouqiangmin@apbc.space:Zh12345
        // curl https://btdex.zendesk.com/api/v2/help_center/en-us/articles.json -v -u zhouqiangmin@apbc.space:Zh12345
        // curl https://btdex.zendesk.com/api/v2/help_center/en-us/categories.json -v -u zhouqiangmin@apbc.space:Zh12345
        // curl https://btdex.zendesk.com/api/v2/help_center/en-us/sections.json -v -u zhouqiangmin@apbc.space:Zh12345
        // curl https://btdex.zendesk.com/api/sunshine/objects/records -v -u zhouqiangmin@apbc.space:Zh12345
        // curl https://support.bitrabbit.com/hc/api/v2/zh-cn/sections/360002441854/articles.json -v -u zhouqiangmin@apbc.space:Zh12345
        // curl https://btdex.zendesk.com/api/v2 -v -u zhouqiangmin@apbc.space:Zh12345
        // const headers = {
        //
        // };
        // const params = {
        //     response_type: 'code',
        //     redirect_uri:
        // };
        // axios.get('https://btdex.zendesk.com/oauth/authorizations/new',{params,headers})
        // .then(data=>{
        //     console.log(data)
        //     let response = data.data
        //     if(response.code == 0){ //上传成功
        //
        //     }else{
        //
        //     }
        // })
    }
}
