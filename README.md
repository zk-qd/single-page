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

# 版本

- v1.0
