# 分頁功能實作說明（後台限定）

## Controller

取得分頁參數

```
let limit = await pagination.limit(req);
let page = await pagination.page(req);
let offset = await pagination.offset(req);
```

將 limit 與 offset 用於 DB 查詢，並且記得用 findAndCountAll 同時取得資料筆數

```
let productsWithCount = await db.Product.findAndCountAll({
  where: WHERE_CONDITIONS_BLAH_BLAH_BLAH,
  offset: offset,
  limit: limit
});
```

將以下參數帶給 View

```
let result = {
  ...
  limit: limit,
  page: page,
  totalPages: Math.ceil(productsWithCount.count / limit),
  totalRows: productsWithCount.count
};
```

## View (Jade)

最上面要 include mixins ...

```
include ../mixins/pagination
```

form 要加上 with-pagination class

範例：

```
form.form-horizontal.with-pagination(name="searchProducts", action="/admin/goods", method="get")
```

然後在 form 增加 hidden fields

```
+pagination-fields(page, limit)
```

加入查詢筆數限制下拉選單

```
+pagination-limit
```

頁數顯示和上下頁按鈕範例（按鈕的重點是 id 必須是 pagination-prev 或 pagination-next）

```
+pagination-simple-pager(page, totalPages)
```

最後記得引入 js
最後記得引入 js
最後記得引入 js

```
block js
  script(src='/javascripts/common/pagination.js')
```

END
