# props
- colmuns
```js
const columns = [
  {
    title: '业务线',
    dataIndex: 'bizLine',
    width: 100,
    table: false,
  },
  {
    title: '推送目标',
    dataIndex: 'target',
    width: 100,
    form: false,
  },
  {
    title: '订阅消息类型',
    dataIndex: 'messageTypeCode',
    width: 100,
  },
  {
    title: '推送类型',
    dataIndex: 'pushType',
    width: 100,
  },
  {
    title: '联动项',
    dataIndex: 'targetReq',
    form: true,
    table: false,
    width: 100,
  },
  {
    title: '订阅人',
    dataIndex: 'admin',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'actions',
    align: 'center',
    scopedSlots: { customRender: 'actions' },
    form: false,
    width: 80,
    fixed: 'right',
  },
]
```
- 插槽实现形式
    - 通过遍历 props里的数据，用 useSolts()来获取到本次插槽的内容

- tablePorps
```js
{ scroll: { x: 1000 }, autoHeight: false, otherHeight: 332 }
```
- 










