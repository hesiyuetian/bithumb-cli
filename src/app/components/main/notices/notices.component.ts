import { Component, OnInit } from '@angular/core';


declare var $;

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class NoticesComponent implements OnInit {

    noticeList: Array<any> = [
        "公告11111","公告22222","公告33333","公告44444",
    ];
    scrollElement: any;
    scrollTimer: any;

    constructor() { }

    ngOnInit() {
        this.init();
    }

    init() {
        setTimeout(() => {
            this.slideNotice();
        }, 1);
    }
    
    //设置公告滚动
    slideNotice() {
        let _this = this;
        $(function () {
            _this.scrollElement = $(".notice-main");
            //开始时运行一次
            scrollNews();
            _this.scrollElement.hover(function () {
                //鼠标移入时终止滚动
                clearInterval(_this.scrollTimer);
            }, function () {
                //鼠标移出时运行一次
                scrollNews();
            });

            function scrollNews() {
                _this.scrollTimer = setInterval(function () {
                    let $self = _this.scrollElement.find("ul");
                    let lineHeight = $self.find("li:first").height();
                    $self.animate({
                        "marginTop": -lineHeight + "px"
                    }, 600, function () {
                        let first = $self.find('li:first');
                        $self.append(first);
                        $self.css({'marginTop': 0});
                    })
                }, 2500);
            }
        })
    }

}
