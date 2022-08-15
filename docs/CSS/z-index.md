**z-index属性值越大，盒子在层叠中的次序就越靠近用户的眼睛。**

### 开始文章前，上两道面试真题：

1. z-index值大的元素一定在值小的上面吗？
2. 如何实现父元素覆盖子元素？

**先公布一下答案：**

1. z-index不一定会生效，生效了也不一定是值大的在上面，主要取决于**层叠上下文**；
2. 给父元素设置一个**很大的z-index不能实现覆盖子元素**，但是把**子元素的z-index设置成负数**却可以满足要求。

这两个题的考点都是层叠上下文，本文会讲清为什么。

顾名不难思义，**层叠上下文是把元素以三维的视角，放在不同层级来判断最后的堆叠关系**，它由z-index这个属性来决定“等级“。

# 如何让z-index生效

**z-index是用于规定元素在z轴的高度，其值越大，离用户越近，越在“上面”。**

使用时可能会感觉这个属性不太听话：给元素设置的z-index好像没有生效，它没有按照预期跑到其他元素上面。**因为它单独使用时不生效，一定要配合定位属性一起**，即只**对指定了position属性的元素**生效——只要**不是默认值static**，其他的absolute、relative、fixed都可以使z-index生效。

如图1所示，在粉色的父元素下有有两个绝对定位的子元素1和2，两个子元素都没有设置z-index，通过top/left属性控制他们的位置，让他们发生重叠，可以看到2在1的上面。因为两者都没有设置z-index，其层叠等级都可以看作是0，**同级的元素会根据其在HTML中的出现顺序出现顺序决定堆叠结果**。

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeIZYHan3TqhnDahgxfucBYQibS3TcxYua2CnXV76PMqFtKRf7W9ytmEyw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)（图1）

> 公众号后台回复103获取在线代码地址

如果我们希望1在2的上面，如图2所示，可以给元素1加上z-index:1，而没有指定z-index的元素2的z-index依旧可以当作0对待，按照大小关系，元素1在元素2上面了。

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeISmohYheb2YNibOKgKPepqGwcGd8xzxAWIB1A0oAhbtTmUn0BpH8Mtfw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)（图2）

> 公众号后台回复104获取在线代码地址

目前为止，都没什么难度，不过是大小比较而已。但很多时候会发现，层叠结果只用单纯的数值大小解释不了：

- 如图3所示，粉色背景下有两个子元素1和2，2中有一个子元素3。三个元素都是绝对定位，其中元素3的z-index值最大，但是却被压在元素1下面了。

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeIrJOzlqCbGMiavUqJibiaEUHqCgrXibrSDZlJcExsbfTvGvAsdiaJ4MYK05A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)（图3）

> 公众号后台回复105获取在线代码地址

- 稍微修改一下，只把2号元素的的z-index去掉。如图4所示，元素3又跑上来，盖在1号、2号元素上面了。

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeIbAgEOgJmX3tYmibNTSy5levz9ejA5uOZ0xFFqbmgTkxkL0SnwHDnDHw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)（图4）

> 公众号后台回复106获取在线代码地址

要想搞懂这些问题，需要了解层叠上下文。

```css
        .box {
            width: 200px;
            height: 200px;
            background-color: pink;
        }

        .one {
            position: relative;
            z-index: 2;
            left: 66px;
            top: 166px;
        }

        .two {
            position: relative;
            left: 33px;
            top: 33px;
            background-color: blue;
        }

        .three {
            position: relative;
            z-index: 3;
            width: 100px;
            height: 100px;
            left: 50px;
            top: 50px;
            background-color: aqua;
        }
```



`ans：因为最一开始2号卡片的z-index是1，他会和他的子元素3号卡片结合成一起，形成一个层面，然后再和1号相比，此时1号在上面；`

`如果后面3号浮上来是因为我们先处理z-index最小的1号卡片，(这里先不看没写z-index的2号卡片)在处理3号卡片`

# 什么是层叠上下文

层叠上下文听起来比较抽象，你可以把它想象成一个三维空间，这个空间内有很多个平面。

最大的层叠上下文就是由文档根元素——html形成的：它自身连同它的子元素就形成了一个最大的层叠上下文，也就是说，我们写的所有代码都是在根层叠上下文里的。

**层叠上下文包含多个平面，具体来说：每个z-index的值形成一个平面，普通的无定位的块级元素也是一个平面，浮动元素也是一个平面，正是这些平面形成了层叠上下文。**

除此之外，**每个有z-index数值的元素也会连同它的子元素一起(写了z-index数值才处理子元素，这里第二种情况没写就不处理2号和3号)，生成一个小的层叠上下文，这个小层叠上下文和父级一样，拥有多个平面。**

去处理这些上下文时，我们可以按照从小到大的顺序递归：**先把最小的堆叠上下文中元素的顺序理好，拍成一片——当做一个整体，再与父级的堆叠上下文中其他元素比较。**

不知道你有没有见过小吃街上的甲骨文仙贝：在一个大的压片的锅里放上面糊，在面糊上放上一个小虾，最后合上盖子夹紧，变成扁扁的一小片，可以清晰的看到上面虾的样子。

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeIyB2jSk3tficq6WuWK1BV1mibdCVDPGfHN6N2L8AHQxQFj3QF57zxmUwg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)（截图自网络）

这个用来压片的锅就是层叠上下文，面糊、虾就是不同层级的html元素。他们在被压扁之前按照明确的上下顺序摆放，但最后都会形成薄薄的一片小饼干。这片小饼干可以被放进一个更大的锅里，和其他的食材，一起作为原料，继续做成一片大饼干，但在大锅眼里，这片小饼干诞生时是面糊在上还是虾子在上，根本不重要，因为现在它是一个整体，只有讨论这片小饼干在第二口锅中，与其他食材的摆放顺序才有意义。记住在这个模型，层级判断就很简单了。

我们在面对一些难以判断的层级关系时，可以整理出一棵“层叠上下文树”，有点类似于dom树的结构。从小到大，把一个层叠上下文的内的不同平面的元素堆叠好，拍平，再放到父级的堆叠上下文树中。

下面会用几个例子加深理解，都附有在线链接，可以先点进去看看，试试自己能否解释最后的呈现结果：

## demo1

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeISmEfuZppMHcsiasNzibgceg4Q5V6kxT8tVJ6T15V1YcX4icUEiasFJjd9A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

> 公众号后台回复107获取在线代码地址

其中DOM的层级关系如下

- container1:absolute

- - 1号:absolute z-index: 1
  - 2号:absolute z-index: 2

- container2:absolute

- - 3号:absolute z-index: 3

container1和container2虽然都是绝对定位，但是没有设置z-index，不形成层叠上下文。所以只有根元素形成的这一个。

> 1、2、3号元素当然也形成了层叠上下文，但是没有子元素，所以不讨论，后面的例子也一样

形成的层叠上下文树如下：

- 根层叠上下文

- - 1号:absolute z-index: 1
  - 2号:absolute z-index: 2
  - 3号:absolute z-index: 3

最后的层叠关系不难判断，从下到上是`1号`-`2号`-`3号`

## demo2

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeIwlBicpibLgwHQialnFK2pyZf0A7QItBrouAWxhANgl1TbiaTmlW3b2N06g/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

> 公众号后台回复108获取在线代码地址

在demo1基础上稍加修改，给container1、container2加上z-index，现在DOM的层级关系变为：

- container1:absolute z-index: 4

- - 1号:absolute z-index: 1
  - 2号:absolute z-index: 2

- container2:absolute z-index: 1

- - 3号:absolute z-index: 3

container1和container2都设置了z-index，加上根元素形成的层叠上下文，一共是三个。

形成的层叠上下文树如下：

- 根层叠上下文

- - 3号:absolute z-index: 3
  - 1号:absolute z-index: 1
  - 2号:absolute z-index: 2
  - container1:absolute z-index: 4
  - container2:absolute z-index: 1

先看container1形成的层叠上下文，此时不管它本身的z-index是多少，形成层叠上下文的元素，都在当前这个上下文的底部，再是1号元素、2号。

然后是container2形成的层叠上下文，只有一个3号元素，没什么好说。

最后是根层叠上下文，它眼中container1和container2是一个整体，container2在下，container1在上。

所以最后的顺序从下到上是：`container2(3号)`-`container1(1号-2号)`

## demo3

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeI20Via1WfSe6l9iajfnazR9CvdhkR71pKhs0vHU7jnic0uzXwCEpK1zdpA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

> 公众号后台回复109获取在线代码地址

之前的container在视觉上看不到，现在给它一个颜色。container2的z-index设置为0，现在DOM的层级关系变为：

- container1:absolute

- - 1号:absolute z-index: 2

- container2:absolute z-index: 0

- - 2号:absolute z-index:-1

现在可以看到，从下到上分别是`container1`-`container2`-`2号`-`1号`，

这个例子比较难理解了，用层叠上下文树分析一下，一共有两个层叠上下文，一个是根元素形成的，另一个是container2

- 根层叠上下文

- - 2号:absolute z-index:-1
  - container1:absolute
  - 1号:absolute z-index: 2
  - container2:absolute z-index: 0

在container2形成的层叠上下文中，只有一个元素2，即使他的z-index是负数，也会放在container2之上，之前也说过，形成层叠上下文的元素在当前层叠上下文中总是最底下的。我们把他们两个拍平，合成一个整体。

在根层叠上下文中，有container1、container2和1号三个元素。container1没有设置z-index，可以看作0，和container2层级相同，当层级相同时，按照在html中出现的先后顺序决定，所以是container1-container2；1号的层级最高，所以最后的层级是container1-container2-1号。

最后把container2中的其他元素展开，得到最后的层叠关系`container1`-`container2(2号)`-`1号`

# 层叠上下文规律

通过这三个例子应该能清楚感受到什么是层叠上下文了，总结一下他的规律：

只有明确指定了z-index的值（不是auto）的定位元素才会生产一个层叠上下文，在这个层叠上下文中，内部元素层级都在它之上，哪怕是负数。

如果是一个没有指定z-index（即为auto）的定位元素，那么虽然它不能形成一个层叠上下文，但是比较层级时，和z-index:0的等级是一样的。

如果把浮动元素也放进来，我们可以得到一个完整的层叠等级：

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeIvQutvAAOEfiaL96vDbH7GxNQgB7pEcFdlPBicOJPoKUjf1Niaun048VDQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

这个图看起来复杂，其实不用背，可以一个个来看：

1. 首先看块级元素，我们写的大部分代码都是它，比如div，我们能看到它们，就是因为块级元素是在层叠上下文根元素之上的。
2. 接着是浮动元素和文字，而浮动本身是为了实现环绕效果的，所以是浮动元素和文字是同一级，这样才不会遮挡。
3. 然后是定位元素，我们知道，不指定z-index，即为auto时，是会在浮动元素之上的，在层级关系中其实相当于0；可以继续推出，z-index>0的会在z-index=0之上。
4. 唯一要特意记忆的是z-index<0，他的层级关系是在块元素之下，形成层叠上下文的根元素之上的。

其中，当多个层叠等级相同的元素重叠时，按照html中出现的顺序决定堆叠上下关系，后出现的在上面。

# CSS3的新特性

除了被定位的z-index元素，CSS3还提供另外的方法能生成一个层叠上下文。

特别偏门的不列举了，意义不大，开发中可能会用到的有：

1. 弹性布局的子项（父元素display:flex|inline-flex)，并且z-index不是auto时
2. opacity非1的元素
3. transform非none的元素
4. filter非none的元素

这些都能生成层叠上下文，flex子元素还可以使用z-index，近一步精确设置层级，其余三个设置z-index不生效，但在比较层级关系是被当作z-index:0对待。

# 结语

层叠上下文和z-index两个概念是分不开的。一个层叠上下文是由许多拥有z-index属性元素形成的平面构成的；有z-index属性的元素又会形成一个子层叠上下文。当然，这里的z-index必须是被有效设置的，在以前是指被定位的元素——position为absolute/relative等，现在它还可以是flex的子元素。

在比较复杂元素的层叠顺序时，主要是要整理出一棵层叠上下文树，一个元素的层叠等级只在当前这个层叠上下文中有意义。

回到开头的两个问题，答案也不难理解了。

1. z-index大的元素不一定在小的元素之上。因为它不一定生效，通常需要是一个定位元素才生效，在CSS3之后，弹性元素的子元素也可以生效；在z-index生效之后，也不是单纯的大小比较，因为这个数值只在当前的层叠上下文中才有意义。
2. 要实现父元素覆盖子元素，去给父元素设置一个很大的z-index是没有用的。因为这样他就成为一个层叠上下文的根元素了，无论子元素被如何设置都会在这个层叠上下文根元素之上。正确的解法是把子元素的z-index设置为负数，这样父元素是一个块级元素，z-index<0 的子元素会在块级元素之下，就可以实现我们想要的效果。