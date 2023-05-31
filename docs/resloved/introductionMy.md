- 面试官看中什么？
  - 自学能力，钻研的精神
  - 涉猎知识的广度
  - 底层知识的了解程度


    - 我系统学习前端已经一年多，主要是通过结合经典书籍、技术博客和优秀开源项目构建了自己的整个前端知识框架
    - 我的学习从HTML、CSS、js开始，搭建了一个简单的小程序项目
    - 然后带着对底层机制的好奇就学习了计网有关前端的内容、js编译执行的原理、浏览器的工作原理和数据结构
    - 学完这些，就对前端整个框架有了更深的认识，接着学vue，途中遇到很多问题
    - 我就带着问题去学了ES6、webpack、typescript、axios、ajax、express、koa
    - 了解了前端可视化threejs、Echarts、WebGL2d/3d
    - 搭建全栈项目，就对vue框架的底层就更加好奇了
    - 学习了一部分vue的源码、关于响应式原型和设计虚拟DOM算法的理解，还有axios的源码，Promise A+规范源码
    - 现在也正在学习使用nuxt SSR开发和熟悉hooks编程
    - 但是自学毕竟有限，想通过实习有机会和前辈们交流，学习到更多的知识
    - 谢谢，这就是我的自我介绍。

- 系统学习前端快一年了，无论是学习基本的前端知识还是写项目，基本都围绕着三个点，学会用，为什么这样用，自己能不能写出min版本的。通过这几点来构建前端的知识框架。整体的学习方向是朝向全栈开发，但自学毕竟是闭门造车，想通过去实习，有机会和前辈们交流，学习到更多的知识。

- TDD(测试驱动开发)
- 测试用例越全 代码越准确 对TDD测试敏捷开发方式很感兴趣 初学阶段


- 面试官你好，我叫赖经涛，本科来自江西财经大学软件与物联网工程学院，专业是软件工程
- 我在校期间担任过班长和班主任助理，参与过学院研究生导师研究课题，实验室主要是负责了测试和数据处理的工作
- 我是在去年10月份确定走前端方向的，期间学习了前端的基础知识，简单搭建了小程序项目
- 过年期间学了vue2和vue3，就仿着app做了纯前端的vue3项目
- 因为对知识都只停留在表面，所以翻了一些书籍、文档和技术博客
- 去了解vue的源码、axios源码、学习node框架koa和他的源码、还有浏览器的工作原理
- 最近做了一个全栈的项目、也在掘金发文章记录学习
- 可能是我在大一的时候学c语言，翁恺老师的那句话：现在我们不知道是怎么实现的，但这些都是人写的，我们最终也可以理清到底是怎么回事。
- 影响了我，所以面对难题刨根问底，对代码特别有热情
- 希望可以通过实习提升自己的能力，谢谢

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

TEST(MyTest, Test1) {
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




