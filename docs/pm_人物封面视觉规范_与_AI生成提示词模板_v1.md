# 拾荒者·人物集
## 人物封面视觉规范 + AI生成提示词模板 v1

适用目标：
- 为《拾荒者·人物集》生成统一风格的人物封面
- 适用于首页、列表页、发现页、人物详情页头图
- 适用于 Aura / Midjourney / ChatGPT 图像生成 / 即梦 / 通义万相 / Stable Diffusion 类工具

---

# 一、核心原则

你这个产品的封面图，不是“找一张人物图片”。

它的作用是：

1. 先让用户**感到这个人**
2. 再让用户进入详情理解这个人
3. 保持整个产品视觉统一

所以封面图必须满足三点：

- **统一风格**
- **人物气质明确**
- **不依赖剧照拼贴**

---

# 二、推荐封面策略

## 主策略：统一风格的人物主题海报

每张封面都包含 4 个层次：

1. **人物主形象**
2. **情绪色调**
3. **象征意象**
4. **统一留白与构图**

这不是传统头像，也不是纯插画立绘，而是：

**人物气质海报 / 人物精神封面**

---

# 三、统一视觉规范

## 1. 尺寸比例

推荐两种：

### 列表卡 / 发现页
- `3:4`

### 详情页头图 / 首页大卡
- `4:5`

首批建议统一生成：
- 900 × 1200
或
- 1200 × 1600

---

## 2. 构图规则

### 构图要求
- 主体明确
- 人物占画面 50%~70%
- 背景不要杂乱
- 上方或侧边留适当空区，便于前端叠字
- 不要做复杂多人群像
- 一个人物一张图只讲一个气质

### 推荐构图
- 半身像
- 近景 + 象征背景
- 轻海报感
- 有情绪，不要纯证件照

---

## 3. 风格要求

推荐统一为：

- cinematic poster
- moody
- low saturation
- elegant
- introspective
- semi-realistic
- high detail but not noisy

中文理解：

- 电影海报感
- 情绪化
- 低饱和
- 克制
- 稍微文艺
- 半写实
- 细节足够，但不乱

---

## 4. 色彩规则

每个人物控制在 **1主色 + 1辅色 + 1点缀色**

### 推荐色系示例
- 林黛玉：青灰 / 冷白 / 暗青
- 孙悟空：赤金 / 黑 / 雷电白
- 哈姆雷特：黑 / 灰蓝 / 冷银
- 乔峰：土褐 / 黑 / 暗金
- 甄嬛：深绿 / 金 / 暗红

### 原则
- 不要高饱和荧光色
- 不要花花绿绿
- 不要每个人都做成同一种颜色

---

## 5. 光影规则

推荐：
- 强氛围光
- 柔和但有方向的侧光
- 背景可有雾、雨、火光、窗影、夜色等

避免：
- 白底棚拍感
- 平光
- 电商海报感
- 过亮

---

# 四、封面字段与视觉映射关系

建议你的每张封面，都由下面这些人物字段驱动：

- `name`
- `one_line_definition`
- `core_identity`
- `emotional_tone`
- `symbolic_images`
- `colors`
- `elements`
- `work`
- `cultural_region`

也就是：

## 人物封面 = 人物理解的视觉翻译

---

# 五、统一提示词模板（通用版）

下面这套是主模板。

## 中文模板

```text
请为“{人物名}”生成一张统一风格的人物主题封面海报，用于人物收藏类 APP《拾荒者·人物集》。

要求：
- 竖版构图，3:4 或 4:5
- 电影海报感，情绪化，低饱和，克制，高级
- 半写实风格，细节丰富但不杂乱
- 主体为单个人物，形象清晰，气质鲜明
- 背景融入人物象征意象，不要复杂人群
- 画面需要留出适合前端叠加标题和文案的空间
- 不要做成电商海报，不要夸张二次元，不要廉价炫光
- 不要在图中加入英文或中文文字

人物信息：
- 人物名：{人物名}
- 所属作品：{作品名}
- 核心身份：{core_identity}
- 一句话理解：{one_line_definition}
- 情绪底色：{emotional_tone}
- 象征意象：{symbolic_images}
- 元素：{elements}
- 代表颜色：{colors}

输出目标：
这不是普通头像，而是一张“人物精神封面”，让人一眼感到这个人物的气质和命运感。
```

---

## 英文模板（更适合多数图像模型）

```text
Create a vertical character cover poster for the app "拾荒者·人物集" (Character Archive).

Requirements:
- vertical composition, 3:4 or 4:5
- cinematic poster style
- moody, elegant, low saturation
- semi-realistic
- one single character as the clear subject
- expressive atmosphere
- symbolic background elements related to the character
- leave some clean space for UI title overlay
- high detail but not visually noisy
- not anime poster style unless the character is from anime
- no text on image
- not commercial advertising style
- not cheap fantasy glow

Character:
- Name: {name}
- Work: {work}
- Core identity: {core_identity}
- One-line interpretation: {one_line_definition}
- Emotional tone: {emotional_tone}
- Symbolic imagery: {symbolic_images}
- Elements: {elements}
- Color palette: {colors}

Goal:
This should feel like a psychological and emotional cover image for the character, not just a portrait.
```

---

# 六、负面提示词（很重要）

生成时建议加一段负面限制。

## 通用负面提示词

```text
low quality, blurry, oversaturated, crowded composition, too many people, text, watermark, logo, poster typography, cheap fantasy style, plastic skin, flat lighting, messy background, overexposed, low detail face, duplicated limbs, distorted hands
```

## 中文理解
- 低质量
- 模糊
- 过饱和
- 构图拥挤
- 多人物
- 水印
- logo
- 廉价奇幻风
- 塑料皮肤
- 平光
- 背景杂乱
- 过曝
- 五官低质量
- 手部畸形

---

# 七、不同人物类型的提示词差异

## 1. 历史人物
关键词加：
- historical
- epic
- dignified
- period atmosphere
- power / strategy / destiny

避免太二次元。

## 2. 文学人物
关键词加：
- poetic
- introspective
- emotional
- symbolic
- literary atmosphere

更适合做“气质海报”。

## 3. 影视人物
关键词加：
- cinematic
- dramatic
- character study
- screen-inspired atmosphere

注意不要直接写演员名，尽量写人物气质。

## 4. 动漫人物
关键词加：
- stylized but unified
- anime-inspired cinematic poster
- strong silhouette
- symbolic world-building

注意：动漫人物也要保持整个产品风格统一，不要突然变成另一套审美。

---

# 八、首批人物可直接用的提示词

下面这些是你可以直接拿去生成的。

---

## 1. 林黛玉

```text
Create a vertical character cover poster for the app "拾荒者·人物集".

Character:
- Name: Lin Daiyu
- Work: Dream of the Red Chamber
- Core identity: a highly sensitive and proud bearer of true emotion
- One-line interpretation: She is not fragile; she is someone who is overly sensitive, overly clear-minded, and overly devoted to true feeling.
- Emotional tone: cold, melancholic, delicate
- Symbolic imagery: falling flowers, light rain, bamboo shadows, lonely lamp
- Elements: wind, rain, mist
- Color palette: blue-gray, pale white, dark cyan

Style:
cinematic poster, poetic, introspective, moody, elegant, low saturation, semi-realistic, delicate emotional atmosphere, one single female figure, East Asian classical literary mood, soft rain light, subtle sorrow, leave space for UI title overlay, no text
```

---

## 2. 孙悟空

```text
Create a vertical character cover poster for the app "拾荒者·人物集".

Character:
- Name: Sun Wukong
- Work: Journey to the West
- Core identity: an untamed rebel of freedom
- One-line interpretation: He does not simply break rules; he refuses to be trapped by unreasonable order.
- Emotional tone: fiery, rebellious, intense
- Symbolic imagery: clouds, thunder, fire, golden staff, mountain stone
- Elements: fire, wind, thunder
- Color palette: crimson, gold, black

Style:
cinematic poster, mythic Chinese fantasy atmosphere, semi-realistic, strong motion energy, rebellious spirit, powerful silhouette, dramatic lighting, thunderclouds, fire sparks, heroic but not cartoonish, low saturation, premium poster style, leave space for UI title overlay, no text
```

---

## 3. 哈姆雷特

```text
Create a vertical character cover poster for the app "拾荒者·人物集".

Character:
- Name: Hamlet
- Work: Hamlet
- Core identity: an over-reflective bearer of revenge
- One-line interpretation: He does not fail to act because he is weak; he thinks so deeply that action itself becomes unbearable.
- Emotional tone: dark, doubtful, tragic, cold
- Symbolic imagery: bell, mirror, throne, shadow, castle corridor
- Elements: night, fog, cold air
- Color palette: black, gray, cold blue, silver

Style:
cinematic tragic poster, Shakespearean atmosphere, moody, elegant, semi-realistic, one male figure, introspective and haunted expression, shadowy palace background, subtle symbolic imagery, low saturation, premium dark visual, leave space for UI title overlay, no text
```

---

## 4. 乔峰

```text
Create a vertical character cover poster for the app "拾荒者·人物集".

Character:
- Name: Qiao Feng
- Work: Demi-Gods and Semi-Devils
- Core identity: a lonely guardian holding on to righteousness through identity fracture
- One-line interpretation: He is not just a hero; he is someone who bears fate, loyalty, and isolation alone.
- Emotional tone: vast, tragic, heroic, lonely
- Symbolic imagery: northern wind, horse, wilderness, strong liquor, dusk
- Elements: wind, earth, cold sky
- Color palette: dark brown, black, muted gold

Style:
martial arts cinematic poster, epic but restrained, semi-realistic, one strong male figure, northern wilderness atmosphere, wind and dust, lonely heroic mood, low saturation, premium Chinese wuxia poster aesthetic, leave space for UI title overlay, no text
```

---

## 5. 甄嬛

```text
Create a vertical character cover poster for the app "拾荒者·人物集".

Character:
- Name: Zhen Huan
- Work: Empresses in the Palace
- Core identity: a woman transformed from tenderness into cold clarity through palace struggle
- One-line interpretation: She is not born for power; she is forced by fate to grow sharp enough to survive.
- Emotional tone: restrained, elegant, cold, strategic
- Symbolic imagery: palace corridor, candlelight, green robe, screen shadow, winter branches
- Elements: still air, candlelight, winter
- Color palette: dark green, muted gold, deep red

Style:
cinematic palace poster, elegant and restrained, semi-realistic, one female figure, Qing dynasty court atmosphere, subtle power tension, low saturation, premium Chinese historical drama visual, leave space for UI title overlay, no text
```

---

# 九、资源路径规范（生成后落地）

你前端现在已经是本地资源化方向，所以建议统一命名：

## 人物封面
```text
/public/assets/images/characters/{slug}.jpg
```

例如：
```text
/public/assets/images/characters/lin-daiyu.jpg
/public/assets/images/characters/sun-wu-kong.jpg
```

## 作品封面
```text
/public/assets/images/works/{slug}.jpg
```

## 创作者封面
```text
/public/assets/images/creators/{slug}.jpg
```

## 主题集封面
```text
/public/assets/images/themes/{slug}.jpg
```

## 歌曲封面
```text
/public/assets/images/songs/{song-slug}.jpg
```

---

# 十、批量生成建议

## 第一轮先生成这些
- 人物：20 张
- 作品：10 张
- 创作者：10 张
- 主题集：8 张
- 歌曲：20 张

## 生成顺序建议
1. 先人物
2. 再主题集
3. 再作品
4. 再创作者
5. 最后歌曲

因为人物封面决定主基调。

---

# 十一、质量验收标准

每张图过不过关，只看这 5 条：

1. 一眼能不能感到这个人的气质
2. 有没有明显统一风格
3. 背景有没有服务人物，而不是喧宾夺主
4. 是否适合前端叠字
5. 是否有廉价 AI 图感

如果有廉价 AI 感，就重生，不要将就。

---

# 十二、最推荐你的实际做法

## 方案
先不要一次生成太多。

### 第一步
先生成 5 张：
- 林黛玉
- 孙悟空
- 哈姆雷特
- 乔峰
- 甄嬛

### 第二步
你把结果拿来比：
- 谁最像产品气质
- 哪种风格最统一

### 第三步
定下来后，再批量扩到 20~30 张

这样不会走歪。

---

# 十三、我建议你现在直接这样干

你现在最需要的不是更多理论，而是 **能直接粘贴使用的生成文本**。

所以这份文件已经给你：
- 统一规范
- 主模板
- 负面提示词
- 首批 5 个人物可直接用的提示词
- 本地资源命名规则

下一步最合理的是继续做：

## 《首批 20 个人物封面生成提示词包》
直接把你前端里那批人物，一人一条提示词全写好。
