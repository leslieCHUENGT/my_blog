# 类型推断

# 定义类型
```ts
interface User {
  name: string;
  id: number;
}
// ---分割线---
const user: User = {
  name: "Hayes",
  id: 0,
};
// 接口声明和类

interface User {
  name: string;
  id: number;
}
 
class UserAccount {
  name: string;
  id: number;
 
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
 
const user: User = new UserAccount("Murphy", 1);

// 函数
interface User {
  name: string;
  id: number;
}
// ---分割线---
function getAdminUser(): User {
  //...
}
 
function deleteUser(user: User) {
  // ...
}
```









