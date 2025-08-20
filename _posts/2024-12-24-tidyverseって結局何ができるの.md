---
layout: null
title: "tidyverseって結局何ができるの？"
date: 2024-12-24 21:09:53 +0900
categories: [r]
tags: [R, tidyverse]
slug: "4"
---

# 工事中です！

[`tidyverse`](https://tidyverse.tidyverse.org/)は、Rでデータ分析をする際に必ずと言っても良いほど用いられるパッケージ群です。実際、私もよく使います。

一方で、`tidyverse`で一体何ができるのかを体系的に学んだことが無いなと思ったので、本記事では`tidyverse`パッケージについて整理してみようと思います。

(目次が欲しい。)

### `tidyverse`とは

### インストール

インストールはCRANから

```r
install.package("tidyverse")
```

### 読み込み

パッケージを読み込むと、以下のようにインストールされたパッケージと他のパッケージと衝突する関数が出力されます。

```r
> library(tidyverse)
── Attaching core tidyverse packages ────────────────── tidyverse 2.0.0 ──
✔ dplyr     1.1.4     ✔ readr     2.1.5
✔ forcats   1.0.0     ✔ stringr   1.5.1
✔ ggplot2   3.5.1     ✔ lubridate 1.9.4
✔ tibble    3.2.1     ✔ purrr     1.0.2
✔ tidyr     1.3.1
── Conflicts ──────────────────────────────────── tidyverse_conflicts() ──
✖ dplyr::filter() masks stats::filter()
✖ dplyr::lag()    masks stats::lag()
ℹ Use the conflicted package to force all conflicts to become errors
```

#### パッケージ一覧

コアパッケージとして以下の9つがあります。

- ggplot2：データの視覚化
- dplyr：データの操作
- tidyr：データの整理
- readr：データのインポート
- purrr：関数プログラミング
- tibble：データの形式
- stringr：文字列
- forcats：要因
- lubridate：日付・時刻

コアパッケージ以外にも以下のパッケージが同時にインストールされていますが、ここではその紹介だけにとどめておきます。

### ggplot2

#### ggplot2とは

#### 基本的な使い方

まずはggplot2のサンプルデータである`mpg`を使用して散布図を描きます。`ggplot()`を使用してキャンパスを作成し、`geom_point()`でその上に散布図を描きます。

ggplot2では以下に示すように、`+`を用いて情報を追加します。

```r
ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point()
```

#### aes()による調整

`aes()`では、以下のような要素を指定できます。

- 変数の指定
  - `x`, `y`
  - `xmin`, `xmax`, `xend`, `ymin`, `ymax`, `yend`
- 色の指定
  - `color`：点・線の色の指定。条件ごとの色分け
  - `fill`：塗りつぶしの色の指定
  - `alpha`：不透明度を指定
- 大きさの指定
  - `size`：点の大きさ、線の太さを指定
  - `shape`：点の形を指定
  - `linetype`：線の種類を指定
- 単にグループ分けする
  - `group`：色や形を保持して条件分け

例えば、`color = drv`を指定すると次のようになります。

#### グラフの種類

ggplot2では、`geom_**()`を用いてさまざまなグラフを作成できます。以下にその一覧を示します。

- 散布図
  - `geom_point()`
- 折れ線グラフ
  - `geom_line()`
  - `geom_path()`
  - `geom_step()`
- 面グラフ
  - `geom_ribbon()`
  - `geom_area()`
- ヒストグラム
  - `geom_histogram()`
  - `geom_freqploy()`
  - `geom_density()`
  - `geom_bin2d()`
  - `geom_hex()`
- 棒グラフ
  - `geom_bar()`
  - `geom_col()`
- 箱ひげ図
  - `geom_box_plot()`
- バイオリンプロット
  - `geom_violin()`
- ドットプロット
  - `geom_dotplot()`
- ヒートマップ
  - `geom_tile()`
  - `geom_raster()`
- エラーバー
- 関数
- 回帰直線

#### グラフの設定

#### `theme()`の設定

### dplyr
