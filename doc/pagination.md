# 分頁功能實作說明

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

form 加上 with-pagination class

```
form.form-horizontal.with-pagination(name="searchProducts", action="/admin/goods", method="get")
```

form 增加 hidden fields

```
input(type='hidden', name='page', value=page)
input(type='hidden', name='limit', value=limit)
```

查詢筆數限制下拉選單

```
select#pagination-limit.form-control
  option(selected=(limit==10)) 10
  option(selected=(limit==20)) 20
  option(selected=(limit==30)) 30
  option(selected=(limit==40)) 40
  option(selected=(limit==50)) 50
```

頁數顯示和上下頁按鈕範例（按鈕的重點是 id 必須是 pagination-prev 或 pagination-next）

```
ul.list-inline.m-bottom-0.m-top-1
  li.border-right-1.p-right-2
    a(href='#' id='pagination-prev') 上一頁
  li.border-right-1.p-right-2 #{page + 1} / #{totalPages}
  li
    a(href='#' id='pagination-next') 下一頁
```

最後記得引入 js
最後記得引入 js
最後記得引入 js

```
block js
  script(src='/javascripts/common/pagination.js')
```

END
