- 面试官看中什么？
  - 自学能力，钻研的精神
  - 涉猎知识的广度
  - 底层知识的了解程度



- 面试官你好，我叫赖经涛，本科来自江西财经大学软件与物联网工程学院，专业是软件工程
- 在校期间，在去年学期结束时，结束完我们学院硕导算法课题后开始接触前端，目前自己开发了三个项目，参与了学院的一个大型创业项目，在学习前端的过程中同时对底层原理很感兴趣，通过看书和在自己的技术博客上总结，构建前端的知识框架，希望通过在贵公司实习收获更多知识。
- 谢谢面试官老师，这是我的自我介绍。


# 测试
在 C++ 编程中，经常需要编写测试代码以确保程序的正确性。有许多测试框架可供选择，其中最受欢迎的是 Google Test（也称为 GTest）和 Catch2。

**Google Test** 是 Google 开源的 C++ 单元测试框架，它支持完整的 xUnit 测试模式，并提供了各种功能，如：

- 自动发现测试用例
- 参数化测试
- 针对异常和死锁的测试
- 可重复执行的测试
- 支持线程安全的并行测试
- 使用 Google Test，您可以轻松编写测试用例，并在编译时生成测试结果报告。以下是一个简单的示例：

```c++
#include "gtest/gtest.h"

TEST(MyTest, T

est1) {
  EXPECT_EQ(2 + 2, 4);
}

TEST(MyTest, Test2) {
  EXPECT_TRUE(2 < 3);
}

int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}

```
# 测试报告
```c++
[==========] Running 2 tests from 1 test suite.
[----------] Global test environment set-up.
[----------] 2 tests from MyTest
[ RUN      ] MyTest.Test1
[       OK ] MyTest.Test1 (0 ms)
[ RUN      ] MyTest.Test2
[       OK ] MyTest.Test2 (0 ms)
[----------] 2 tests from MyTest (0 ms total)

[----------] Global test environment tear-down
[==========] 2 tests from 1 test suite ran. (0 ms total)
[  PASSED  ] 2 tests.

```
# go nodejs Python
- nodejs
  - 非阻塞I/O模型，处理高并发，较低的系统资源消耗
  - 单线程模型无法充分利用多核CPU
- go
  - 静态类型语言
  - 编译速度快
  - CSP模型，处理高并发
- python
  - 第三方库和框架很丰富
  - 动态类型语言
  - 全局解释器锁GIL



