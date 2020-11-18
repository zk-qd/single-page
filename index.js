function Page(id, { request }) {
    this.random = "page-container-" + Math.floor(Math.random() * 10000);
    this.nums = 5;
    this.index;
    this.count;
    this.rows;
    this.pages;
    this.list;
    this.id = id; // 容器id
    this.request = request;
}
Page.prototype = {
    init({ index, count, rows, nums = Number(this.nums) }) {
        // index count rows 必传
        this.nums = Number(nums);
        this.index = Number(index);
        this.count = Number(count);
        this.rows = Number(rows);
        this.pages = Math.ceil(this.rows / this.count);
        // 中间数 this.nums的中间
        let mid,
            // 视口的最大页标和最小页标
            max,
            min,
            config = [];
        // 不大于最小显示页数时
        if (this.pages <= this.nums) {
            min = 1;
            max = this.pages;
        } else {
            // 显示所有页标
            if (this.nums % 2 == 0) {
                // 偶数
                mid = this.nums / 2;
                min = this.index - mid + 1;
                max = this.index + mid;
            } else {
                // 奇数
                mid = Math.ceil(this.nums / 2);
                min = this.index - mid + 1;
                max = this.index + mid - 1;
            }
            // 求得最小值和最大值
            if (min < 1) { // 向前溢出
                min = 1;
                max = this.nums;
            } else if (max > this.pages) { // 向后溢出
                max = this.pages;
                min = max - this.nums + 1;
            }
        }
        // 通过index min max获取分页配置
        for (let i = min; i <= max; i++) {
            config.push(i);
        }
        this.list = config;
        return this;
    },
    render({ index, count, rows, nums }) {
        this.init({ index, count, rows, nums })
        // 解释器
        let html = this.interpreter(this.list);
        document.querySelector('#' + this.id).insertAdjacentHTML("afterbegin", html);
        this.bind();
    },
    interpreter(list) {
        console.log(list)
        let html = [],
            prevDis = list[0] == 1 ? 'z-page-disabled' : '',
            nextDis = list.slice(-1)[0] == this.pages ? 'z-page-disabled' : '';
        html.push("<div class='z-page-container' id='" + this.id + this.random + "'>")
        html.push(
            "<ul class='z-page-wrapper'" +
            "data-index='" + this.index + "'" +
            "data-rows='" + this.rows + "'" +
            "data-count='" + this.count + "'" +
            "data-pages='" + this.pages + "'" +
            "data-nums='" + this.nums + "'" +
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
                `<li class='z-page-equal z-page-nums ${num == this.index ? 'z-page-active' : ''}' data-active='${num}'>${num}</li>`
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
            numsDom = container.querySelectorAll('.z-page-nums'),
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
                    active >= 1 && active <= this.pages && this.request({ index: Number(active), count: this.count });
                },
                handleKeyup: (e) => {
                    if (e.keyCode == 13) {
                        let currentTarget = e.currentTarget,
                            active = currentTarget.value;
                        active >= 1 && active <= this.pages && this.request({ index: Number(active), count: this.count });
                    }

                }
            }
        numsDom.forEach(dom => dom.addEventListener('click', handler.handleClick, handler.config));
        prevDom.addEventListener('click', handler.handleClick, handler.config);
        nextDom.addEventListener('click', handler.handleClick, handler.config);
        skipDom.addEventListener('keyup', handler.handleKeyup, handler.config);

    }
}
