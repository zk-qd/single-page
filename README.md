# single-page

分页插件

# 使用

```js
<link rel="stylesheet" href="./css/index.css">
<script src="./js/index.js"></script>
const page = new Page("page");
page.skip(function ({ index, count }, render) {
  // api获取分页数据
  render({ index, count, rows: 50 });
});
// or
page.skip(function ({ index, count }) {
  this.render({ index, count, rows: 50 });
});
```

# 重复创建

```js
// 重复在同一个元素中创建-后者覆盖前者
const page1 = new Page("page");
page1.skip(function ({ index, count }, render) {
  render({ index, count, rows: 50 });
});

const page2 = new Page("page");
page2.skip(function ({ index, count }, render) {
  render({ index, count, rows: 50 });
});

// 在不同元素中创建-多例模式
const page1 = new Page("page1");
page1.skip(function ({ index, count }, render) {
  render({ index, count, rows: 50 });
});
const page2 = new Page("page2");
page2.skip(function ({ index, count }, render) {
  render({ index, count, rows: 50 });
});
```

# 版本

- v1.0

