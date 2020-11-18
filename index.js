function Page(id) {
    this.random = "-container-" + Math.floor(Math.random() * 10000);
    this.num = 5;
    this.index;
    this.count;
    this.rows;
    this.pages;
    this.id = id; // 容器id
    this.callback;
}

Page.prototype = {

    /** 
     * 内置方法：通过参数获取分页配置
    */
    config({ index, count, rows }) {
        // index count rows 必传
        this.index = Number(index);
        this.count = Number(count);
        this.rows = Number(rows);
        this.pages = Math.ceil(this.rows / this.count);
        // 中间数 this.num的中间
        let mid,
            // 视口的最大页标和最小页标
            max,
            min,
            config = [];
        // 不大于最小显示页数时
        if (this.pages <= this.num) {
            min = 1;
            max = this.pages;
        } else {
            // 显示所有页标
            if (this.num % 2 == 0) {
                // 偶数
                mid = this.num / 2;
                min = this.index - mid + 1;
                max = this.index + mid;
            } else {
                // 奇数
                mid = Math.ceil(this.num / 2);
                min = this.index - mid + 1;
                max = this.index + mid - 1;
            }
            // 求得最小值和最大值
            if (min < 1) { // 向前溢出
                min = 1;
                max = this.num;
            } else if (max > this.pages) { // 向后溢出
                max = this.pages;
                min = max - this.num + 1;
            }
        }
        // 通过index min max获取分页配置
        for (let i = min; i <= max; i++) {
            config.push(i);
        }
        return config;
    },
    /**
     * 解释器
     *  */
    interpreter(list) {
        let html = [],
            prevDis = this.index == 1 ? 'z-page-disabled' : '',
            nextDis = this.index == this.pages ? 'z-page-disabled' : '';
        html.push("<div class='z-page-container' id='" + this.id + this.random + "'>")
        html.push(
            "<ul class='z-page-wrapper'" +
            "data-index='" + this.index + "'" +
            "data-rows='" + this.rows + "'" +
            "data-count='" + this.count + "'" +
            "data-pages='" + this.pages + "'" +
            "data-num='" + this.num + "'" +
            ">"
        );
        html.push(
            "<li class='z-page-equal z-page-text'>共</li>"
        );
        html.push(
            "<li class='z-page-equal z-page-text'>" + this.pages + "</li>"
        );
        html.push(
            "<li class='z-page-equal z-page-text'>页</li>"
        );
        html.push(
            "<li class='z-page-equal z-page-prev " + prevDis + "' data-active='" + (this.index - 1) + "' >上一页</li>"
        );
        list.forEach((num, idx) => {
            html.push(
                `<li class='z-page-equal z-page-num ${num == this.index ? 'z-page-active' : ''}' data-active='${num}'>${num}</li>`
            )
        });
        html.push(
            "<li class='z-page-equal z-page-next " + nextDis + "' data-active='" + (this.index + 1) + "' >下一页</li>"
        )
        html.push(
            "<li class='z-page-equal z-page-text'>前往</li>"
        );
        html.push(
            "<li class='z-page-equal z-page-input'>" +
            "<input value='" + this.index + "'>" +
            "</li>"
        );
        html.push(
            "<li class='z-page-equal z-page-text'>页</li>"
        );
        html.push(
            "</ul>" +
            "</div>"
        )
        return html.join('');
    },
    bind() {
        let container = document.querySelector('#' + this.id),
            numDom = container.querySelectorAll('.z-page-num'),
            prevDom = container.querySelector('.z-page-prev'),
            nextDom = container.querySelector('.z-page-next'),
            skipDom = container.querySelector('.z-page-input>input'),
            handler = {
                config: {
                    capture: true,
                    passive: true,
                    once: false,
                },
                handleClick: (e) => {
                    let currentTarget = e.currentTarget,
                        active = currentTarget.dataset.active;
                    active >= 1 && active <= this.pages && this.callback({ index: Number(active), count: this.count });
                },
                handleKeyup: (e) => {
                    if (e.keyCode == 13) {
                        let currentTarget = e.currentTarget,
                            active = currentTarget.value;
                        active >= 1 && active <= this.pages && this.callback({ index: Number(active), count: this.count });
                    }

                }
            }
        numDom.forEach(dom => dom.addEventListener('click', handler.handleClick, handler.config));
        prevDom.addEventListener('click', handler.handleClick, handler.config);
        nextDom.addEventListener('click', handler.handleClick, handler.config);
        skipDom.addEventListener('keyup', handler.handleKeyup, handler.config);

    },
    /**
     * 渲染分页方法
     *  */
    render({ index, count, rows }) {
        // 获取配置
        let list = this.config({ index, count, rows })
        // 添加到页面
        document.querySelector('#' + this.id).innerHTML = this.interpreter(list);
        // 绑定事件
        this.bind();
    },
    /**
     * 设置num方法
     *  */
    setNum(num) {
        this.num = num;
    },
    /**
     * 页面跳转回调
     *  */
    skip(callback) {
        return new Promise((resolve, reject) => {
            this.callback = function ({ index, count }) {
                resolve(callback && callback.call(this, {
                    index, count
                }))
            }
        })
    }

}
