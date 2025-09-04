# HTML/CSS

## 1.`CSS`权重及其引入方式

**CSS权重计算规则**

CSS权重由四部分组成，从左到右依次是：`!important`声明、内联样式、ID选择器、类选择器和属性选择器、标签选择器和伪元素选择器。这四个部分可以看作是一个四位数，每个部分都有其对应的值：

- `!important` 声明：无穷大（覆盖所有其他规则）
- 内联样式：1000
- ID 选择器：0100
- 类选择器、属性选择器、伪类：0010
- 标签选择器、伪元素：0001

例如：

- `#header .title` 的权重为 0100 + 0010 = 0110。
- `.main p` 的权重为 0010 + 0001 = 0011。
- `p` 的权重为 0001。

如果两个选择器具有相同的权重，则后定义的样式将被应用。

**CSS引入方式**

CSS可以通过以下几种方式引入到HTML文档中：

**1. 行内样式 (Inline Styles)**

直接在HTML元素上使用`style`属性来添加CSS样式。

```html
<p style="color: red; font-size: 16px;">这是一个段落。</p>
```

**2. 内部样式 (Internal Styles)**

在HTML文档的`<head>`部分使用`<style>`标签来定义CSS样式。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>内部样式示例</title>
    <style>
        body {
            background-color: lightblue;
        }
        h1 {
            color: white;
            text-align: center;
        }
        p {
            font-family: verdana;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <h1>我的第一个标题</h1>
    <p>我的第一个段落。</p>
</body>
</html>
```

**3. 外部样式 (External Styles)**

通过`<link>`标签引用外部的CSS文件。

首先创建一个名为`styles.css`的CSS文件：

```css
/* styles.css */
body {
    background-color: lightblue;
}
h1 {
    color: white;
    text-align: center;
}
p {
    font-family: verdana;
    font-size: 20px;
}
```

然后在HTML文档中引用这个CSS文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>外部样式示例</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <h1>我的第一个标题</h1>
    <p>我的第一个段落。</p>
</body>
</html>
```

## 2.`<a></a>`标签全部作用

**1. 创建超链接**

`<a> `标签最基本的作用是创建一个指向其他网页或资源的超链接。

```html
<a href="https://www.example.com">访问示例网站</a>
```

**2. 链接到同一页面内的锚点**

可以使用 `#` 符号链接到同一页面内的某个特定位置（锚点）。

```html
<!-- 页面顶部 -->
<a href="#section1">跳转到第一节</a>

<!-- 页面中的某个部分 -->
<h2 id="section1">第一节</h2>
```

**3. 下载文件**

通过设置 `href` 属性为文件的 `URL`，并添加 `download` 属性，可以让用户下载文件。

```html
<a href="path/to/file.zip" download>下载文件</a>
```

**4. 发送电子邮件**
通过设置 `href` 属性为 `mailto: 协议`，可以创建一个发送电子邮件的链接。

```html
<a href="mailto:example@example.com">发送邮件</a>
```

**5. 打电话**

通过设置 `href` 属性为 `tel: 协议`，可以创建一个拨打电话的链接。

```html
<a href="tel:+1234567890">拨打这个号码</a>
```

**6. 使用 JavaScript**

可以通过 `href` 属性结合 `javascript: 协议` 来执行 JavaScript 代码。

```html
<a href="javascript:alert('Hello, World!')">点击弹出提示框</a>
```

**7. 设置目标窗口**

通过 `target` 属性，可以指定链接打开的目标窗口或框架。

- `_self`：默认值，在当前窗口打开链接。
- `_blank`：在新窗口或标签页中打开链接。
- `_parent`：在父框架中打开链接。
- `_top`：在整个窗口中打开链接。

```html
<a href="https://www.example.com" target="_blank">在新窗口打开</a>
```

**8. 添加标题和样式**

可以通过 `title` 属性为链接添加描述性文本，通过 CSS 添加样式。

```html
<a href="https://www.example.com" title="访问示例网站" style="color: blue; text-decoration: none;">示例网站</a>
```

**9. 禁用链接**

通过 `disabled` 属性（虽然这不是标准属性，但可以通过 CSS 和 JavaScript 实现类似效果）。

```html
<a href="https://www.example.com" class="disabled" onclick="return false;">禁用的链接</a>

<style>
.disabled {
    pointer-events: none;
    color: gray;
}
</style>
```

**10. 添加自定义数据属性**

可以通过 `data-*` 属性为链接添加自定义数据。

```html
<a href="https://www.example.com" data-custom="value">带有自定义数据的链接</a>
```

## 3.用`CSS`画三角形

**1.向上三角形**

```css
.up-triangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;  /* 左边框透明 */
    border-right: 50px solid transparent; /* 右边框透明 */
    border-bottom: 100px solid red;       /* 底部边框红色 */
}
```

**2. 向左三角形**

```css
.left-triangle {
    width: 0;
    height: 0;
    border: 50px solid transparent;/* 边框透明 */
    border-left: 50px solid green;      /* 左边框绿色 */
}
```

## 4.未知宽高元素水平垂直居中(方案及比较)

**1. 使用 Flexbox**

Flexbox 是现代布局中最灵活且易于使用的方法之一。它允许你轻松地控制容器内项目的对齐方式。

**HTML**:

```html
<div class="container">
    <div class="centered-element">内容</div>
</div>
```

**CSS**:

```css
.container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    height: 100vh;           /* 容器高度为视口高度 */
}

.centered-element {
    /* 你的样式 */
}
```

**优点**：

- 简单易用。
- 兼容性好（除了非常老的浏览器）。
- 不需要知道子元素的具体尺寸。

**缺点**：

- 对于IE9及以下版本不支持。

**2. 使用 Grid 布局**
CSS Grid 提供了另一种强大的布局方式，可以更精细地控制页面布局。

**HTML**:

```html
<div class="grid-container">
    <div class="grid-item">内容</div>
</div>
```

**CSS**:

```css
.grid-container {
    display: grid;
    place-items: center;  /* 同时设置水平和垂直居中 */
    height: 100vh;         /* 容器高度为视口高度 */
}

.grid-item {
    /* 你的样式 */
}
```

**优点**：

- 非常强大且灵活。
- 可以同时处理多行多列布局。
- 不依赖于子元素的尺寸。

**缺点**：

- 浏览器兼容性比Flexbox稍差一些，但大多数现代浏览器都已支持。

**3. 使用绝对定位与 transform**
这种方法适用于那些不支持Flexbox或Grid的老式浏览器。

**HTML**:

```html
<div class="positioned-container">
    <div class="absolutely-centered">内容</div>
</div>
```

**CSS**:

```css
.positioned-container {
    position: relative;
    height: 100vh;  /* 或者其他固定高度 */
}

.absolutely-centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  /* 将元素向左上方移动自身宽度的一半 */
}
```

**优点**：

- 良好的浏览器兼容性。
- 不需要知道元素的确切大小。

**缺点**：

- 相对于前两种方法来说稍微复杂一点。
- 如果父级容器没有设定明确的高度，则可能无法正确工作。

## 5.元素种类的划分

HTML（超文本标记语言）中的元素可以根据其功能和用途被划分为几大类。以下是主要的分类方式及其简要说明：

- **块级元素 (Block-level Elements)**

    - 这些元素在页面上表现为一个独立的区块，通常会从新的一行开始，并且可以包含其他内联或块级元素。
    - 常见的例子包括 `<div>`, `<p>`, `<h1>` 到 `<h6>`, `<ul>`, `<ol>`, `<li>`, `<table>`, `<form>` 等。

- **内联元素 (Inline Elements)**

    - 内联元素不会导致换行，它们只占据必要的宽度，允许在同一行显示多个这样的元素。
    - 例子有 `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, `<input>`, `<label>` 等。

- **表单控件 (Form Controls)**

    - 专门用于创建用户输入界面的元素。
    - 包括 `<input>`, `<textarea>`, `<select>`, `<option>`, `<button>` 等。
- **表格相关 (Table-related Elements)**

    - 用于构建数据表格结构。
    - 如 `<table>`, `<tr>`, `<td>`, `<th>`, `<thead>`, `<tbody>`, `<tfoot>` 等。

- **语义化元素 (Semantic Elements)**

    - HTML5 引入了一些新的标签来更好地描述文档的内容结构，这些被称为语义化标签。
    - 例如 `<header>`, `<footer>`, `<article>`, `<section>`, `<nav>`, `<aside>`, `<main>` 等。
- **多媒体元素 (Multimedia Elements)**

    - 支持音频、视频等多媒体内容的嵌入。
    - 包括 `<audio>`, `<video>`, `<source>`, `<track>` 等。

- **元信息元素 (Meta Information Elements)**

    - 提供关于文档本身的额外信息，如字符集声明、作者信息等。
    - 例如 `<meta>`, `<link>`, `<style>`, `<script>` 等。

- **交互式元素 (Interactive Elements)**

    - 允许与用户进行更复杂的互动。
    - 比如 `<details>`, `<summary>`, `<dialog>`, `<menu>` 等。

## 6.盒子模型及其理解

盒子模型（Box Model）是CSS布局的基础概念之一，它定义了HTML元素如何被显示以及如何相互作用。每个HTML元素都可以看作是一个矩形的盒子，这个盒子由四个部分组成：内容区域（content）、内边距（padding）、边框（border）和外边距（margin）。理解盒子模型对于掌握网页布局至关重要。

**盒子模型的组成部分**

- **内容区域 (Content)**
    - 这是盒子中实际放置文本或图像的部分。
    - 宽度和高度可以通过`width`和`height`属性来设置。
- **内边距 (Padding)**
    - 内边距是内容区域与边框之间的空间。
    - 可以通过`padding`属性来设置，可以分别设置上、右、下、左四个方向的内边距。
- **边框 (Border)**
    - 边框是围绕在内边距和内容区域周围的线条。
    - 可以通过`border`属性来设置边框的宽度、样式和颜色。
- **外边距 (Margin)**
    - 外边距是盒子与其他盒子之间的空间。
    - 可以通过`margin`属性来设置，可以分别设置上、右、下、左四个方向的外边距。
- **标准盒子模型 vs IE盒子模型**
    - 标准盒子模型：盒子的总宽度 = `width` + `padding` + `border` + `margin`。
    - IE盒子模型：盒子的总宽度 = `width`（已经包含了`padding`和`border`）+ `margin`。
    - 可以通过设置`box-sizing`属性来选择使用哪种盒子模型：
        - `box-sizing: content-box;`（默认值，标准盒子模型）
        - `box-sizing: border-box;`（IE盒子模型）

**示例代码**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Box Model Example</title>
    <style>
        .box {
            width: 200px;
            height: 200px;
            background-color: lightblue;
            padding: 20px;
            border: 5px solid blue;
            margin: 20px;
            box-sizing: border-box; /* 使用IE盒子模型 */
        }
    </style>
</head>
<body>
    <div class="box">
        This is a box with content.
    </div>
</body>
</html>
```

在这个示例中：

- `.box` 的宽度和高度都是200px。
- 内边距是20px。
- 边框是5px宽的蓝色实线。
- 外边距是20px。
- 使用了`box-sizing: border-box`;，所以盒子的总宽度仍然是200px（包括了内边距和边框）。

## 7.定位方式及其区别(文档流)

**1. `static`**
- **定义**：这是所有元素默认的定位方式。元素按照其在HTML中的顺序正常排列。
- **特点**：不可以通过`top`, `bottom`, `left`, `right`等属性来改变位置。

**示例**：

```css
.static {
    position: static;
    border: 2px solid red;
}
```

**2. `relative`**
- **定义**：相对定位。相对于元素自身原本应该所在的位置进行偏移。
- **特点**：使用`top`, `bottom`, `left`, `right`属性可以调整元素的位置，但不会影响其他元素的位置。

**示例**：

```css
.relative {
    position: relative;
    top: 20px; /* 向下移动20像素 */
    left: 30px; /* 向右移动30像素 */
    border: 2px solid blue;
}
```

**3. `absolute`**
- **定义**：绝对定位。相对于最近的非`static`定位祖先元素进行定位；如果没有这样的祖先，则相对于初始包含块（通常是视口）。
- **特点**：从正常的文档流中移除，因此不会占据空间，可能覆盖其他元素。同样使用`top`, `bottom`, `left`, `right`属性来设置位置。

**示例**：

```css  
.parent {
    position: relative; /* 确保子元素以这个为参考点 */
    width: 200px;
    height: 200px;
    border: 2px solid green;
}

.absolute {
    position: absolute;
    top: 50px; /* 距离父容器顶部50像素 */
    right: 50px; /* 距离父容器右侧50像素 */
    border: 2px solid orange;
}
```

**4. `fixed`**
- **定义**：固定定位。总是相对于浏览器窗口定位，即使页面滚动也不会改变位置。
- **特点**：类似于absolute，但是参照物是视口而非任何祖先元素。常用于创建始终可见的导航条或按钮。

**示例**：

```css
.fixed {
    position: fixed;
    bottom: 0; /* 固定在底部 */
    right: 0; /* 固定在右侧 */
    border: 2px solid purple;
}
```

**5. `sticky`**
- **定义**：粘性定位。结合了relative和fixed的特点。当元素在屏幕内时表现为relative，一旦滚动到特定阈值则变为fixed。
- **特点**：需要至少一个方向上的`top`, `bottom`, `left`, `right`属性来指定何时开始“粘住”。

**示例**：

```css
.sticky {
    position: -webkit-sticky; /* Safari兼容 */
    position: sticky;
    top: 0; /* 当到达顶部时开始固定 */
    background-color: yellow;
    padding: 10px;
}
```

## 8.`margin`塌陷及合并问题

**1. 相邻块级元素之间的`margin`塌陷**

当两个相邻的块级元素在垂直方向上都有`margin`时，它们的`margin`会合并为一个较大的`margin`，其值等于两者中的较大者。

**示例代码**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Margin Collapse Example</title>
    <style>
        .box {
            width: 200px;
            height: 100px;
            background-color: lightblue;
            margin-bottom: 50px; /* 下边距 */
        }
        .box2 {
            width: 200px;
            height: 100px;
            background-color: lightgreen;
            margin-top: 30px; /* 上边距 */
        }
    </style>
</head>
<body>
    <div class="box"></div>
    <div class="box2"></div>
</body>
</html>
```

在这个例子中，`.box`和`.box2`之间的实际间距是50px，而不是80px（50px + 30px）。这是因为它们的`margin`发生了塌陷。

**2. 嵌套块级元素之间的margin塌陷**

当一个块级元素包含另一个块级元素，并且内部元素的`margin`超过了外部元素的边界时，外部元素的`margin`也会受到影响。

**示例代码**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Margin Collapse Example</title>
    <style>
        .container {
          background-color: lightblue;
        }
        .inner-box {
            width: 100px;
            height: 100px;
            background-color: lightcoral;
            margin-top: 50px; /* 上边距 */
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="inner-box"></div>
    </div>
</body>
</html>
```

在这个例子中，`.inner-box`的`margin-top`会使`.container`的顶部边界向下移动50px，而不是保持在原来的位置。

**解决方法**

**1. 使用`padding`代替`margin`**

通过给父元素添加`padding`来避免·塌陷。

**示例代码**：

```css
.container {
    border: 1px solid black;
    padding: 10px 10px 60px 10px; /* 添加底部padding */
}
.inner-box {
    width: 100px;
    height: 100px;
    background-color: lightcoral;
    margin-top: 50px; /* 上边距 */
}
```

**2. 使用`overflow: hidden`或`overflow: auto`**

通过设置父元素的`overflow`属性为`hidden`或`auto`来防止`margin`塌陷。

**示例代码**：

```css
.container {
    border: 1px solid black;
    overflow: hidden; /* 或者使用 overflow: auto */
}
.inner-box {
    width: 100px;
    height: 100px;
    background-color: lightcoral;
    margin-top: 50px; /* 上边距 */
}
```

**3. 使用`border`或`inline-block`**

通过给父元素添加`border`或将其显示模式改为`inline-block`来防止`margin`塌陷。

**示例代码**：

```css  
.container {
    border: 1px solid transparent; /* 透明边框 */
}
.inner-box {
    width: 100px;
    height: 100px;
    background-color: lightcoral;
    margin-top: 50px; /* 上边距 */
}
或者：

```css
.container {
    display: inline-block;
}
.inner-box {
    width: 100px;
    height: 100px;
    background-color: lightcoral;
    margin-top: 50px; /* 上边距 */
}
```

## 9.浮动模型及清除浮动的方法

**浮动模型**

在CSS中，可以通过`float`属性来设置元素的浮动。`float`属性有以下几个值：

- `left`：元素向左浮动。
- `right`：元素向右浮动。
- `none`：默认值，元素不浮动。
- `inherit`：从父元素继承float属性的值。

**示例代码**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Float Example</title>
    <style>
        .container {
            border: 2px solid #000;
            padding: 10px;
            overflow: auto; /* 清除浮动 */
        }
        .box {
            width: 100px;
            height: 100px;
            margin: 10px;
            background-color: lightblue;
        }
        .box-left {
            float: left;
        }
        .box-right {
            float: right;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box box-left">Left</div>
        <div class="box box-right">Right</div>
        <p>这段文本会环绕浮动的盒子。</p>
    </div>
</body>
</html>
```

**清除浮动的方法**

浮动会导致父元素的高度塌陷，即父元素的高度无法包裹住浮动的子元素。为了解决这个问题，可以使用以下几种方法来清除浮动：

**1. 使用`overflow: auto`或`overflow: hidden`**

在父元素上设置`overflow: auto`或`overflow: hidden`，可以强制父元素包含其浮动的子元素。

```css
.container {
    overflow: auto; /* 或者 overflow: hidden; */
}
```

**2. 使用`:after`伪元素**

通过在父元素的`:after`伪元素上添加清除浮动的样式。

```css
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}
```

**3. 使用`clear`属性**

在浮动元素之后添加一个空的`<div>`，并设置`clear: both`。

```html
<div class="container">
    <div class="box box-left">Left</div>
    <div class="box box-right">Right</div>
    <div style="clear: both;"></div>
    <p>这段文本会环绕浮动的盒子。</p>
</div>
```

**完整示例代码**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clear Float Example</title>
    <style>
        .container {
            border: 2px solid #000;
            padding: 10px;
            overflow: auto; /* 清除浮动 */
        }
        .box {
            width: 100px;
            height: 100px;
            margin: 10px;
            background-color: lightblue;
        }
        .box-left {
            float: left;
        }
        .box-right {
            float: right;
        }
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
    </style>
</head>
<body>
    <h2>使用 overflow: auto 清除浮动</h2>
    <div class="container">
        <div class="box box-left">Left</div>
        <div class="box box-right">Right</div>
        <p>这段文本会环绕浮动的盒子。</p>
    </div>

    <h2>使用 :after 伪元素清除浮动</h2>
    <div class="container clearfix">
        <div class="box box-left">Left</div>
        <div class="box box-right">Right</div>
        <p>这段文本会环绕浮动的盒子。</p>
    </div>

    <h2>使用 clear 属性清除浮动</h2>
    <div class="container">
        <div class="box box-left">Left</div>
        <div class="box box-right">Right</div>
        <div style="clear: both;"></div>
        <p>这段文本会环绕浮动的盒子。</p>
    </div>
</body>
</html>
```

## 10.`CSS`定位属性

CSS定位属性是用于控制HTML元素在页面上的位置。主要有以下几种定位方式：

- **Static（静态）**：默认值，元素按照正常的文档流进行布局。
- **Relative（相对定位）**：相对于其正常位置进行定位，使用`top`、`right`、`bottom`和`left`属性来调整位置。
- **Absolute（绝对定位）**：相对于最近的非`static`定位的祖先元素进行定位，如果没有这样的祖先元素，则相对于初始包含块（通常是视口）。同样使用`top`、`right`、`bottom`和`left`属性来调整位置。
- **Fixed（固定定位）**：相对于视口进行定位，即使页面滚动，元素的位置也不会改变。
- **Sticky（粘性定位）**：结合了相对定位和固定定位的特点。元素在跨越特定阈值前为相对定位，之后变为固定定位。

**示例代码**

```html
深色版本
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Positioning Example</title>
    <style>
        .container {
            position: relative;
            width: 100%;
            height: 100vh;
            background-color: #f0f0f0;
            padding: 20px;
            box-sizing: border-box;
        }
        .box {
            width: 200px;
            height: 200px;
            margin: 10px;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            line-height: 200px;
            font-size: 20px;
        }
        .static {
            /* 默认静态定位 */
        }
        .relative {
            position: relative;
            top: 50px;
            left: 50px;
        }
        .absolute {
            position: absolute;
            top: 100px;
            right: 100px;
        }
        .fixed {
            position: fixed;
            bottom: 0;
            right: 0;
        }
        .sticky {
            position: -webkit-sticky; /* Safari */
            position: sticky;
            bottom: 0;
            background-color: #ff9800;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CSS Positioning Example</h1>
        <div class="box static">Static</div>
        <div class="box relative">Relative</div>
        <div class="box absolute">Absolute</div>
        <div class="box fixed">Fixed</div>
        <div class="box sticky">Sticky</div>
    </div>

    <!-- 添加一些内容以便于滚动查看固定定位和粘性定位的效果 -->
    <div style="height: 2000px;"></div>
</body>
</html>
```

## 11.`display`及相关属性

- **block**：块级元素，独占一行，宽度默认为父元素的100%。
- **inline**：内联元素，和其他内联元素在同一行显示，宽度仅包含内容。
- **inline-block**：内联块级元素，结合了 `inline` 和 `block` 的特性，可以在同一行显示，但可以设置宽度和高度。
- **none**：隐藏元素，不占据任何空间。
- **flex**：弹性盒子布局，用于创建灵活的响应式布局。
- **grid**：网格布局，用于创建复杂的二维布局。
- **table、table-row、table-cell 等**：模拟表格布局。

## 12.`IFC`与`BFC`

**1. IFC (Inline Formatting Context)**

定义：

- `IFC`是指在一行中从左到右排列的元素形成的格式化上下文。
- 在`IFC`中，元素按照文本流的方向（通常是水平方向）进行排列。
- IFC中的元素可以是`<span>`、`<a>`、`<strong>`等内联元素。

**特点**：

- 内联元素会尽可能地在同一行内排列，直到遇到换行符或容器宽度不够为止。
- 内联元素的宽度由其内容决定，高度由字体大小决定。
- 垂直方向上的对齐方式可以通过`vertical-align`属性控制。

**创建IFC的方式**：

- 包含内联元素的块级元素会自动创建一个`IFC`。
- 使用`display: inline-block`或`inline-table`也会创建`IFC`。

**示例代码**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IFC Example</title>
    <style>
        .container {
            border: 2px solid black;
            padding: 10px;
        }
        .inline-element {
            display: inline;
            background-color: lightblue;
            padding: 5px;
            margin: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <span class="inline-element">Inline Element 1</span>
        <span class="inline-element">Inline Element 2</span>
        <span class="inline-element">Inline Element 3</span>
    </div>
</body>
</html>
```

**2. BFC (Block Formatting Context)**

**定义**：

- `BFC`是指块级元素之间相互独立的布局区域。
- `在BFC`中，每个块级元素都会垂直排列，不会影响其他`BFC`中的元素。

**特点**：

- `BFC`中的元素不会与外部元素发生重叠。
- `BFC`可以包含浮动元素，但不会被浮动元素所影响。
- `BFC`可以防止外边距折叠。

**创建`BFC`的方式**：

- 根元素（`<html>`）。
- 浮动元素（`float` 不为 `none`）。
- 绝对定位元素（`position` 为 `absolute` 或 `fixed`）。
- 行内块元素（`display: inline-block`）。
- `overflow` 为 `hidden`、`auto`、`scroll` 的元素。
- `display` 为 `flow-root` 的元素。
- `display` 为 `table-cell`、`table-caption`、`flex`、`grid` 的元素。

**示例代码**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BFC Example</title>
    <style>
        .container {
            border: 2px solid black;
            padding: 10px;
        }
        .bfc-element {
            float: left;
            width: 100px;
            height: 100px;
            background-color: lightgreen;
            margin: 10px;
        }
        .clear-bfc {
            overflow: hidden; /* 创建BFC */
            border: 2px solid red;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="bfc-element"></div>
        <div class="bfc-element"></div>
        <div class="clear-bfc">
            <p>This is a paragraph inside a BFC.</p>
        </div>
    </div>
</body>
</html>
```

## 13.圣杯布局和双飞翼布局的实现

**圣杯布局**

圣杯布局的特点是中间的内容区域优先加载，并且左右两侧的侧边栏可以自适应高度。以下是使用HTML和CSS实现的圣杯布局代码：

**`flex` 实现圣杯布局**:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>圣杯布局flex实现</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      body {
        display: flex;
        flex-direction: column;
        height: 100vh;
        /* background-color: pink; */
        font-size: 24px;
      }
      .header-layout,
      .footer-layout {
        height: 80px;
      }
      .header-layout {
        background-color: red;
      }
      .footer-layout {
        background-color: yellow;
      }
      .body-layout {
        flex-grow: 2;
        display: flex;
        /* align-items: stretch; */
      }
      .main-layout {
        flex-grow: 1;
        background-color: gray;
      }
      .nav-layout {
        width: 200px;
        background-color: green;
        order: -1;
      }
      .aside-layout {
        width: 200px;
        background-color: lightblue;
      }
      /* 垂直水平居中 */
      .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <header class="header-layout flex-center">头部</header>
    <div class="body-layout">
      <main class="main-layout flex-center">主体部分</main>
      <nav class="nav-layout flex-center">导航</nav>
      <aside class="aside-layout flex-center">侧栏</aside>
    </div>
    <footer class="footer-layout flex-center">底部</footer>
  </body>
</html>
```

**`grid` 实现圣杯布局**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>圣杯布局</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    .center {
      display: grid;
      justify-items: center;
      align-items: center;
    }
    body {
      display: grid;
      grid-template-rows: 80px 1fr 80px;
      grid-template-columns: 200px auto 200px;
      height: 100vh;
      grid-template-areas:
        'header header header'
        'nav main asider'
        'footer footer footer';
    }
    .header-layout {
      background-color: blue;
      grid-area: header;
    }
    .nav-layout {
      background-color: red;
      grid-area: nav;
    }
    .main-layout {
      background-color: orange;
      grid-area: main;
    }
    .aside-layout {
      background-color: pink;
      grid-area: asider;
    }
    .footer-layout {
      background-color: yellow;
      grid-area: footer;
    }
  </style>
</head>
<body>
  <header class="header-layout center">头部</header>
  <nav class="nav-layout center">导航</nav>
  <main class="main-layout center">主体部分</main>
  <aside class="aside-layout center">侧栏</aside>
  <footer class="footer-layout center">页脚</footer>
</body>
</html>

```

**双飞翼布局**

双飞翼布局的特点是中间的内容区域被分成两部分，左侧的部分用于填充左侧边栏的宽度，右侧的部分用于显示实际内容。这样可以确保中间的内容区域始终在视觉上位于最左边。以下是使用HTML和CSS实现的双飞翼布局代码：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>双飞翼布局</title>
    <style type="text/css">
        body {
            /* Changed min-width from 550px to 600px */
            min-width: 600px;
        }
        .col {
          float: left;
        }
        #main {
            /* Changed width from 100% to 98% */
            width: 98%;
            /* Changed height from 200px to 220px */
            height: 220px;
            /* Changed background-color from #ccc to #ddd */
            background-color: #ddd;
        }
        #main-wrap {
            /* Changed margin from 0 190px 0 190px to 0 200px 0 200px */
            margin: 0 200px 0 200px;
        }
        #left {
            /* Changed width from 190px to 200px */
            width: 200px;
            /* Changed height from 200px to 220px */
            height: 220px;
            background-color: #0000FF;
            /* Changed margin-left from -100% to -98% */
            margin-left: -98%;
        }
        #right {
            /* Changed width from 190px to 200px */
            width: 200px;
            /* Changed height from 200px to 220px */
            height: 220px;
            background-color: #FF0000;
            /* Changed margin-left from -190px to -200px */
            margin-left: -200px;
        }
    </style>
</head>
<body>
    <div id="main" class="col">
        <div id="main-wrap">
            this is main
        </div>
    </div>
    <div id="left" class="col">
        this is left
    </div>
    <div id="right" class="col">
        this is right
    </div>
</body>
</html>
```

## 14.`Flex`布局

**Flex布局的基本概念**

- **容器**：应用了`display: flex`;或`display: inline-flex`;的元素被称为Flex容器。
- **项目**：直接位于Flex容器中的每个子元素都是一个Flex项目。

**主要属性**

**容器属性**

- `flex-direction`：定义主轴方向（即项目的排列方向）。
  - `row`（默认值）：从左到右。
  - `row-reverse`：从右到左。
  - `column`：从上到下。
  - `column-reverse`：从下到上。
- `flex-wrap`：定义当一行放不下所有项目时如何换行。
  - `nowrap`（默认值）：不换行。
  - `wrap`：换行，第一行在上方。
  - `wrap-reverse`：换行，第一行在下方。
- `justify-content`：定义项目在主轴上的对齐方式。
  - `flex-start`（默认值）：靠左对齐。
  - `flex-end`：靠右对齐。
  - `center`：居中对齐。
  - `space-between`：两端对齐，项目之间的间隔相等。
  - `space-around`：每个项目两侧的间隔相等。
- `align-items`：定义项目在交叉轴上的对齐方式。
  - `stretch`（默认值）：拉伸以适应容器。
  - `flex-start`：靠顶部对齐。
  - `flex-end`：靠底部对齐。
  - `center`：居中对齐。
  - `baseline`：基线对齐。
- `align-content`：定义多根轴线的对齐方式。如果只有一根轴线，则该属性不起作用。
  - `stretch`（默认值）：轴线被拉伸以占满整个交叉轴。
  - `flex-start`：轴线靠交叉轴起点对齐。
  - `flex-end`：轴线靠交叉轴终点对齐。
  - `center`：轴线居中对齐。
  - `space-between`：轴线两端对齐，轴线之间的间隔相等。
  - `space-around`：每根轴线两侧的间隔相等。

**项目属性**

- `order`：定义项目的排列顺序。数值越小，排列越靠前，默认为0。
- `flex-grow`：定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
- `flex-shrink`：定义项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
- `flex-basis`：定义在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
- `flex`：是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0` `1` `auto`。后两个属性可选。
- `align-self`：允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

## 15.`px`、`em`、`rem`的区别

**1. `px` (像素)**

- **定义**：`px` 是绝对单位，表示屏幕上的一个物理像素点。
- **特点**：
   - 不受其他元素或父元素的影响。
   - 在不同设备上显示的大小是固定的。
- **适用场景**：
   - 当需要精确控制元素的尺寸时，例如图标、边框等。
   - 在不需要响应式设计的情况下。
**2. `em`**
- **定义**：`em` 是相对单位，相对于当前元素的字体大小（`font-size`）。
- **特点**：
   - 受当前元素的字体大小影响。
   - 如果没有明确设置字体大小，则会继承父元素的字体大小。
   - 适用于创建可缩放的布局。
- **计算方式**：
  - `1em` 等于当前元素的字体大小。
  - 例如，如果当前元素的字体大小是 `16px`，那么 `1em` 就等于 `16px`。
- **适用场景**：
  - 创建响应式布局，特别是当需要根据字体大小进行缩放时。
  - 设置元素的内边距、外边距等。
**3. `rem`**
- **定义**：`rem` 也是相对单位，但它是相对于根元素（即 `<html>` 元素）的字体大小。
- **特点**：
   - 受根元素的字体大小影响。
   - 不受其他元素的字体大小影响。
   - 适用于创建全局一致的响应式布局。
- **计算方式**：
  - `1rem` 等于根元素的字体大小。
  - 例如，如果根元素的字体大小是 `16px`，那么 `1rem` 就等于 `16px`。
- **适用场景**：
  - 创建全局一致的响应式布局。
  - 设置全局样式，如全局字体大小、间距等。

**示例代码**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Units Example</title>
    <style>
        /* 设置根元素的字体大小 */
        html {
            font-size: 16px;
        }
        .container {
            font-size: 20px; /* 20px */
        }
        .px-example {
            width: 100px; /* 固定宽度 */
            height: 50px; /* 固定高度 */
            background-color: lightblue;
        }
        .em-example {
            width: 5em; /* 5 * 20px = 100px */
            height: 2.5em; /* 2.5 * 20px = 50px */
            background-color: lightgreen;
        }
        .rem-example {
            width: 6.25rem; /* 6.25 * 16px = 100px */
            height: 3.125rem; /* 3.125 * 16px = 50px */
            background-color: lightcoral;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="px-example">PX Example</div>
        <div class="em-example">EM Example</div>
        <div class="rem-example">REM Example</div>
    </div>
</body>
</html>
```

## 16.`Less`预处理语言

**主要特性**
- **变量**：可以定义可重用的值。
- **嵌套规则**：可以在选择器中嵌套其他选择器，使代码更清晰。
- **混合（Mixins）**：可以定义一组样式并在多个地方重用。
- **函数**：可以使用内置函数或自定义函数进行计算和操作。
- **运算符**：可以对数值进行加减乘除等运算。
- **作用域**：支持局部变量和全局变量。
- **导入**：可以导入其他 Less 文件，便于模块化管理。

**示例代码**

假设我们要创建一个简单的网站布局，包括一个导航栏、一个内容区域和一个页脚。我们将使用 Less 来编写样式。

**1. 定义变量**
```less
// 变量
@primary-color: #3498db;
@secondary-color: #2ecc71;
@background-color: #ecf0f1;
@font-size: 16px;
```

**2. 嵌套规则**
```less
// 嵌套规则
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    background-color: @primary-color;
    color: white;
    padding: 20px;
    text-align: center;
  }

  .content {
    background-color: @background-color;
    padding: 20px;
    min-height: 400px;
  }

  .footer {
    background-color: @secondary-color;
    color: white;
    padding: 20px;
    text-align: center;
  }
}
```

**3. 混合（Mixins）**
```less
// 混合
.button(@color) {
  background-color: @color;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.primary-button {
  .button(@primary-color);
}

.secondary-button {
  .button(@secondary-color);
}
```
**4. 函数**
```less
// 函数
.lighten(@color, @amount) {
  @h: hsl(hue(@color), saturation(@color), lightness(@color) + @amount);
  return @h;
}

.darken(@color, @amount) {
  @h: hsl(hue(@color), saturation(@color), lightness(@color) - @amount);
  return @h;
}

// 使用函数
.lighter-primary {
  background-color: lighten(@primary-color, 10%);
}

.darker-secondary {
  background-color: darken(@secondary-color, 10%);
}
```

**5. 运算符**
```less
// 运算符
.font-size(@size) {
  font-size: @size * 1px;
}

.large-text {
  .font-size(24); // 24px
}

.medium-text {
  .font-size(18); // 18px
}

.small-text {
  .font-size(12); // 12px
}
```
**6. 导入**

假设我们有一个单独的文件 variables.less 包含所有变量定义，我们可以这样导入：

```
**6. 导入**
```less
@import "variables.less";
// 其他样式
```

**完整的 `Less` 文件**

将上述所有部分组合在一起，形成一个完整的 `Less` 文件：

```less
// variables.less
@primary-color: #3498db;
@secondary-color: #2ecc71;
@background-color: #ecf0f1;
@font-size: 16px;

// main.less
@import "variables.less";

// 嵌套规则
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    background-color: @primary-color;
    color: white;
    padding: 20px;
    text-align: center;
  }

  .content {
    background-color: @background-color;
    padding: 20px;
    min-height: 400px;
  }

  .footer {
    background-color: @secondary-color;
    color: white;
    padding: 20px;
    text-align: center;
  }
}

// 混合
.button(@color) {
  background-color: @color;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.primary-button {
  .button(@primary-color);
}

.secondary-button {
  .button(@secondary-color);
}

// 函数
.lighten(@color, @amount) {
  @h: hsl(hue(@color), saturation(@color), lightness(@color) + @amount);
  return @h;
}

.darken(@color, @amount) {
  @h: hsl(hue(@color), saturation(@color), lightness(@color) - @amount);
  return @h;
}

// 使用函数
.lighter-primary {
  background-color: lighten(@primary-color, 10%);
}

.darker-secondary {
  background-color: darken(@secondary-color, 10%);
}

// 运算符
.font-size(@size) {
  font-size: @size * 1px;
}

.large-text {
  .font-size(24); // 24px
}

.medium-text {
  .font-size(18); // 18px
}

.small-text {
  .font-size(12); // 12px
}
```

**编译 `Less` 文件**

你可以使用 `Less` 编译工具（如 `lessc` 命令行工具或在线编译器）将 `main.less` 文件编译成 `main.css` 文件。例如，使用 `lessc` 命令行工具：

```sh
lessc main.less main.css
```

## 17.媒体查询

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>媒体查询的语法</title>
    <style>
      /* 1.什么是媒体查询 Media querys */
      /* 一套样式很难适应各种大小的屏幕 */
      /* 针对各种大小的屏幕写样式，让我们的页面在不同大小的屏幕上都能正常显示 */

      /* 是屏幕设备并且屏幕宽度 >= 320px（断点 Breakpoint） */
      /* @media screen and (min-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* 2.媒体类型 */
      /* all（所有设备 默认值） / screen（屏幕设备） / print（打印设备） / speech（屏幕阅读器，一般供残障人士使用） */
      /* all 和 screen 比较常用 */
      /* @media screen and (min-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* @media all and (min-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* @media (min-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* 3.媒体查询中的逻辑 */
      /* 与( and )  / 或( , ) / 非( not ) */

      /* 3.1.与( and ) */
      /* 查询条件全部为真时生效 */

      /* screen 并且屏幕宽度 >=320px 且 <= 375px */
      /* @media screen and (min-width: 320px) and (max-width: 375px) {
        body {
          background-color: red;
        }
      } */

      /* 3.2.或( , ) */
      /* 查询条件中的任意一个为真时生效 */

      /* (screen 并且屏幕宽度 >= 375px) 或 (屏幕宽度 <= 320px) */
      /* @media screen and (min-width: 375px), (max-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* (screen 并且屏幕宽度 >=375px) 或 (all 并且屏幕宽度 <= 320px) */
      /* @media screen and (min-width: 375px), all and (max-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* 3.3.非( not ) */
      /* 对当前查询条件取反 */

      /* 当 not 与 and 同时出现，not 对整个媒体查询生效 */
      /* 取反(screen 并且屏幕宽度 >=320px 且 <= 375px) */
      /* @media not screen and (min-width: 320px) and (max-width: 375px) {
        body {
          background-color: red;
        }
      } */

      /* not 与逗号分隔的多个媒体查询同时存在时，not 只对它所在的那个查询生效 */
      /* 取反(screen 并且屏幕宽度 >=375px) 或 (all 并且屏幕宽度 <= 320px) */
      /* @media not screen and (min-width: 375px), all and (max-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* 4.媒体特性 */
      /* width / max-width / min-width */
      /* -webkit-device-pixel-ratio / -webkit-max-device-pixel-ratio / -webkit-min-pixel-ratio */
      /* orientation: landscape / portrait */
      /* @media screen and (min-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* @media screen and (width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* dpr <= 2 且屏幕水平方向 */
      @media (-webkit-max-device-pixel-ratio: 2) and (orientation: landscape) {
        body {
          background-color: red;
        }
      }
    </style>
  </head>
  <body>
    <script>
      // 获取 dpr
      // console.log(window.devicePixelRatio);
    </script>
  </body>
</html>
```

```css
      /* 1.如何设置断点 Breakpoint */
      /* @media screen and (min-width: 320px) {
        body {
          background-color: red;
        }
      } */

      /* 1.1.经验总结 */
      /*
        Bootstrap 的断点
          xs: < 576px 超小屏
          sm: 576px ~ 768px 小屏
          md: 768px ~ 992px 中屏
          lg: 992px ~ 1200px 大屏
          xl: >= 1200px 超大屏
      */

      /* 1.2.改变屏幕大小，当页面显示不正常（或不符合要求）的时候，就需要设置断点了 */

      /* 2.媒体查询的书写位置 */
      /* 2.1.样式表（style 标签或单独的 CSS 文件）中（推荐） */
      /* 2.2.样式外链 link 中（不推荐） */
      /* 不论媒体查询的条件是否满足，都会下载样式文件 */
```

## 18.`vh`与`vw`

`vw`/`vh`/`vmax`/`vmin`  可以用来布局

相对单位，视口单位

`1vw`= 视口宽度的 1%

`1vh`= 视口高度的 1%

`vmin`：当前 `vw` 和 `vh` 中较小的一个值

`vmax`：当前 `vw` 和 `vh` 中较大的一个值

## 19.`H5`的语义化作用及语义化标签

**H5 语义化的作用**

- **提高可读性和可维护性**：通过使用语义化的标签，开发者可以更容易理解页面结构，从而简化了代码的维护工作。
- **增强SEO效果**：搜索引擎能够更好地理解页面的内容和结构，有助于提升网站在搜索结果中的排名。
- **改善无障碍访问**：对于使用辅助技术浏览网页的用户来说，语义化的标签提供了更多的上下文信息，帮助他们更好地理解页面内容。
- **更好的设备兼容性**：随着移动设备和其他新型上网设备的普及，语义化的`HTML5`标签可以帮助确保内容在不同平台上的一致显示。

**H5 常用的语义化标签**

- **`header`**：定义文档的页眉（介绍性的内容）
- **`nav`**：定义导航链接的容器
- **`section`**：定义文档中的节（section、区段）
- **`article`**：定义独立的文章
- **`aside`**：定义页面的侧边栏内容
- **`footer`**：定义文档的页脚（版权信息等）
- **`main`**：定义文档的主要内容
- **`span`**：定义文档中的行内元素
- **`strong`**: 定义重要的文本
- **`em`**: 定义强调的文本
- **`mark`**: 定义标记的文本

## 20.`Web Worker` 和 `Web Socket`

**1. Web Worker**

**Web Worker** 允许你在浏览器后台线程中运行脚本，而不会阻塞用户界面。这对于执行计算密集型任务或长时间运行的任务非常有用，因为它可以保持页面的响应性。

**主要特点**：

- **多线程**：Web Worker 在独立的线程中运行，与主线程分离。
- **无阻塞**：不会阻塞主线程，从而保持页面的响应性。
- **通信**：通过 `postMessage` 和 `onmessage` 进行消息传递。

**示例代码**：

**main.js **(主线程)

```javascript
// 创建一个新的 Web Worker
const worker = new Worker('worker.js');

// 监听来自 Worker 的消息
worker.onmessage = function(event) {
    console.log('Received message from worker:', event.data);
};

// 向 Worker 发送消息
worker.postMessage({ type: 'start', data: [1, 2, 3, 4, 5] });

// 终止 Worker
// worker.terminate();
```

**worker.js** (Worker 线程)

```javascript
// 监听来自主线程的消息
self.onmessage = function(event) {
    const { type, data } = event.data;

    if (type === 'start') {
        // 执行一些计算密集型任务
        const result = data.map(x => x * x);
        // 将结果发送回主线程
        self.postMessage(result);
    }
};
```

**2. Web Socket**
Web Socket 提供了一种在单个 TCP 连接上进行全双工通信的协议。它允许服务器主动向客户端推送数据，非常适合实时应用，如聊天、在线游戏和实时通知等。

**主要特点**：
- **全双工通信**：可以在一个连接上同时进行双向通信。
- **低延迟**：相比 HTTP 请求，WebSocket 的延迟更低。
- **持久连接**：一旦建立连接，可以持续保持打开状态，直到一方关闭。

**示例代码**：

**client.html** (客户端)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WebSocket Client</title>
</head>
<body>
    <h1>WebSocket Client</h1>
    <input type="text" id="messageInput" placeholder="Enter a message">
    <button onclick="sendMessage()">Send</button>
    <ul id="messages"></ul>

    <script>
        const socket = new WebSocket('ws://localhost:8080');

        // 监听连接打开事件
        socket.onopen = function() {
            console.log('WebSocket connection established');
        };

        // 监听消息接收事件
        socket.onmessage = function(event) {
            const messagesList = document.getElementById('messages');
            const messageItem = document.createElement('li');
            messageItem.textContent = event.data;
            messagesList.appendChild(messageItem);
        };

        // 监听连接关闭事件
        socket.onclose = function() {
            console.log('WebSocket connection closed');
        };

        // 监听错误事件
        socket.onerror = function(error) {
            console.error('WebSocket error:', error);
        };

        // 发送消息到服务器
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value;
            socket.send(message);
            input.value = '';
        }
    </script>
</body>
</html>
```

**server.js** (服务器端 - 使用 Node.js 和 ws 库)

```javascript
const WebSocket = require('ws');

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    // 监听客户端发送的消息
    ws.on('message', function incoming(message) {
        console.log('Received message:', message);

        // 广播消息给所有连接的客户端
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // 监听客户端断开连接
    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
```

## 21.`CSS3` 及相关动画

**1. 过渡 (Transitions)**

过渡允许你定义一个元素在状态改变时如何平滑地从一种样式过渡到另一种样式。常见的触发过渡的状态改变包括 `:hover`, `:focus`, `:active` 等。

**基本语法**

```css
selector {
  transition: property duration timing-function delay;
}
```

- **`property`**：指定应用过渡效果的 CSS 属性。
- **`duration`**：过渡效果花费的时间。
- **`timing-function`**：过渡效果的速度曲线。
- **`delay`**：过渡效果开始前的延迟时间。

*示例*

假设我们有一个按钮，当鼠标悬停在按钮上时，按钮的颜色会平滑地从蓝色变为红色。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Transition Example</title>
  <style>
    .button {
      background-color: blue;
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      transition: background-color 0.5s ease, color 0.5s ease;
    }
    .button:hover {
      background-color: red;
      color: yellow;
    }
  </style>
</head>
<body>
  <button class="button">Hover me!</button>
</body>
</html>
```

**2. 动画 (Animations)**

动画允许你创建更复杂的动画效果，可以通过 `@keyframes` 规则来定义动画的关键帧。

**基本语法**
```css
@keyframes animation-name {
  from { /* 初始状态 */ }
  to { /* 结束状态 */ }
}

selector {
  animation: animation-name duration timing-function delay iteration-count direction fill-mode;
}
```

- **`animation-name`**：`@keyframes` 规则中定义的动画名称。
- **`duration`**：动画完成一个周期所花费的时间。
- **`timing-function`**：动画的速度曲线。
- **`delay`**：动画开始前的延迟时间。
- **`iteration-count`**：动画重复次数。
- **`direction`**：动画播放方向。
- **`fill-mode`**：动画在关键帧之外的状态。

*示例*

假设我们有一个方块，它会在页面加载后不断地上下移动。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Animation Example</title>
  <style>
    .box {
      width: 100px;
      height: 100px;
      background-color: green;
      position: relative;
      animation: moveUpDown 2s ease-in-out infinite alternate;
    }

    @keyframes moveUpDown {
      from {
        top: 0;
      }
      to {
        top: 200px;
      }
    }
  </style>
</head>
<body>
  <div class="box"></div>
</body>
</html>
```

## 22.如何实现响应式布局

响应式布局是指网页能够根据不同设备的屏幕尺寸和分辨率，自动调整布局和元素大小，以提供最佳的用户体验。

**响应式布局的实现**

1. **使用`flexbox`布局**
   - `flexbox` 是一种一维布局模型，用于在容器中对齐和分布元素。
   - 它可以轻松实现响应式布局，无需使用浮动或定位。

2. **使用`grid`布局**
   - `grid` 是一种二维布局模型，用于创建复杂的网格布局。
   - 它可以用于实现响应式布局，同时支持响应式导航菜单和响应式图片。

3. **使用媒体查询**
   - 媒体查询是一种 CSS 技术，用于根据设备的屏幕尺寸和分辨率应用不同的样式。
   - 它可以用于实现响应式布局，根据不同的屏幕尺寸和分辨率应用不同的样式。

## 23.`SEO`的概念及实现

**`SEO`的概念**

`SEO`（Search Engine Optimization）是指通过优化网站的结构、内容和技术，提高网站在搜索引擎结果页面（如 Google、百度等）的排名和流量的过程。

**`SEO`的实现**

1. **优化网站结构**
   - 使用语义化的 HTML 标签，如 `<header>`, `<nav>`, `<article>`, `<footer>` 等。
   - 确保网站的 URL 结构清晰、易读，避免使用复杂的参数或动态 URL。

2. **优化网站内容**
   - 提供有价值、有意义的内容，符合用户需求。
   - 包含关键词的标题、描述和标签，避免使用堆砌关键词的方式。
   - 优化图片 alt 属性，包含关键词。

3. **优化网站技术**
   - 使用 HTTPS 协议，确保网站安全。
   - 优化网站加载速度，使用压缩技术（如 Gzip 压缩）。
   - 确保网站的响应式设计，适应不同设备的访问。

## 24.`HTML5`的新特性

HTML5 引入了许多新的元素和属性，用于增强网页的功能和用户体验。以下是一些主要的新特性：

1. **语义化元素**
   - `<header>`, `<nav>`, `<article>`, `<section>`, `<aside>`, `<footer>` 等。

2. **多媒体元素**
   - `<audio>` 和 `<video>` 元素，用于嵌入音频和视频。
   - `<source>` 元素，用于指定多个视频源。

3. **表单元素**
   - 新增的输入类型，如 `email`, `url`, `number`, `range`, `date`, `time`, `datetime`, `datetime-local`, `month`, `week` 等。
   - 新增的表单属性，如 `required`, `placeholder`, `pattern`, `min`, `max`, `step` 等。

4. **Canvas 元素**
   - `<canvas>` 元素，用于绘制图形和动画。

5. **SVG 元素**
   - SVG（Scalable Vector Graphics）元素，用于绘制矢量图形。

6. **本地存储**
   - `localStorage` 和 `sessionStorage`，用于在浏览器端存储数据。

7. **Web Workers**
   - 用于在后台线程中运行脚本，避免阻塞主线程。

8. **拖放 API**
   - 用于实现拖放功能，如将文件从文件系统拖放到网页中。

9. **Geolocation API**
   - 用于获取用户的地理位置信息。

10. **Web Storage API**
    - 用于在浏览器端存储数据，与 `localStorage` 和 `sessionStorage` 类似。

## 25.`Less`和`Sass`的区别及使用场景

**`Less`和`Sass`的区别**

- **语法**：`Less`使用类似 CSS 的语法，而 `Sass`使用缩进语法。
- **变量**：`Less`支持变量，而 `Sass`也支持变量。
- **Mixin**：`Less`支持 Mixin，而 `Sass`也支持 Mixin。
- **函数**：`Less`支持函数，而 `Sass`也支持函数。
- **嵌套**：`Less`支持嵌套，而 `Sass`也支持嵌套。
- **导入**：`Less`支持导入，而 `Sass`也支持导入。

**`Less`和`Sass`的使用场景**

- **`Less`**：适用于小型项目或个人项目，因为它的语法简单，易于学习和使用。
- **`Sass`**：适用于大型项目或团队项目，因为它的语法更加强大，支持更多的功能，如变量、Mixin、函数、嵌套和导入等。
