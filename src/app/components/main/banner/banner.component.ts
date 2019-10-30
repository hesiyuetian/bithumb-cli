import { Component, OnInit } from '@angular/core';

declare var Swiper;

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

    bannerList: Array<any> = [
        "../../../../assets/images/banner/1.png",
        "../../../../assets/images/banner/2.png",
        "../../../../assets/images/banner/3.png",
        "../../../../assets/images/banner/4.png",
    ];
    scrollElement: any;
    scrollTimer: any;

    constructor() { }

    ngOnInit() {
        this.init();
    }

    init() {
        setTimeout(() => {
            this.setSwiper();
        }, 1);
    }

    //设置滚动
    setSwiper() {
        let swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
        if(this.bannerList.length < 2){
            swiper.autoplay.stop();
        }else{
            swiper.autoplay.start();
        }
    }
  

}
