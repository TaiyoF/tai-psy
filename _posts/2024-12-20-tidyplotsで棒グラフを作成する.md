---
layout: post
title: "tidyplotsで棒グラフを作成する"
date: 2024-12-20 14:29:28 +0900
categories: [r]
tags: [R, tidyplots, 棒グラフ]
slug: "1"
---

[tidyplots](https://tidyplots.org/)を試してみたので、その跡をここに残しておきます。

### インストール

CRANで公開されているため、`install.packages()`でインストールします。

```r
install.packages("tidyplots")
```

私は使用していませんが、以下のようにgithubからもインストールできます。

```r
devtools::install_github("jbengler/tidyplots")
```

### 棒グラフの作成

#### パッケージの読み込み

まずはパッケージを読み込みましょう。

```r
library(tidyplots)
```

#### データ

今回使用するデータは`tidyplots`に付属されている`study`を使用します。  
中身を確認してみましょう。

```r
> dplyr::glimpse(study)
Rows: 20
Columns: 7
$ treatment   <chr> "A", "A", "A", "A", "A",…
$ group       <chr> "placebo", "placebo", "p…
$ dose        <chr> "high", "high", "high", …
$ participant <chr> "p01", "p02", "p03", "p0…
$ age         <dbl> 23, 45, 32, 37, 24, 23, …
$ sex         <chr> "female", "male", "femal…
$ score       <dbl> 2, 4, 5, 4, 6, 9, 8, 12,…
```

二要因分散分析の結果を描きたかったので、今回はgroupとdoseを独立変数、scoreを従属変数とした棒グラフを作成していきます。

#### Create

それでは、`tidyplot()`でプロットを作成します。  
`tidyplots`で作成したグラフはやや小さかったので、ここでは大きさを調整しています。

```r
study %>%
  tidyplot(x = group, y = score, color = dose, width = 80, height = 80)
```

#### Add

続いて、`add_*()`でグラフに指定した要素を加えます。  
今回は棒グラフに標準誤差のエラーバーを付けたいので、`add_mean_bar()`と`add_sem_bar()`を使用します。

```r
study %>%
  tidyplot(x = group, y = score, color = dose, width = 80, height = 80) %>%
# add
  add_mean_bar(dodge_width = 0.9, width = 0.9) %>%
  add_sem_errorbar(dodge_width = 0.9, width = 0.3, color = "black")
```

#### Adjust

`adjust_*()`で作成したグラフを調整することができます。  
y軸の名前（`adjust_y_axis_title()`）と範囲（`adjust_y_axis()`）、フォントサイズ（`adjust_font()`）と条件ごとの色（`adjust_colors()`）を指定しましょう。

```r
study %>%
  tidyplot(x = group, y = score, color = dose, width = 80, height = 80) %>%
# add
  add_mean_bar(dodge_width = 0.9, width = 0.9) %>%
  add_sem_errorbar(dodge_width = 0.9, width = 0.3, color = "black") %>%
# adjust
  adjust_y_axis_title("得\n点\n（点）") %>%
  adjust_y_axis(limits = c(0, 50))  %>%
  adjust_font(fontsize = 11) %>%
  adjust_colors(new_colors=c("grey","grey30"))
```

#### Rename

`rename_*()`で各条件の名前を変えてみます。

```r
study %>%
  tidyplot(x = group, y = score, color = dose, width = 80, height = 80) %>%
# add
  add_mean_bar(dodge_width = 0.9, width = 0.9) %>%
  add_sem_errorbar(dodge_width = 0.9, width = 0.3, color = "black") %>%
# adjust
  adjust_y_axis_title("得\n点\n（点）") %>%
  adjust_y_axis(limits = c(0, 50))  %>%
  adjust_font(fontsize = 11) %>%
  adjust_colors(new_colors=c("grey","grey30")) %>%
# rename
  rename_x_axis_labels(new_names = c("placebo"="対照群","treatment"="介入群")) %>%
  rename_color_labels(new_names = c("high"="低用量","low"="高用量"))
```

#### Remove

グラフに不要な要素は`remove_*()`で取り除きます。

```r
study %>%
  tidyplot(x = group, y = score, color = dose, width = 80, height = 80) %>%
# add
  add_mean_bar(dodge_width = 0.9, width = 0.9) %>%
  add_sem_errorbar(dodge_width = 0.9, width = 0.3, color = "black") %>%
# adjust
  adjust_y_axis_title("得\n点\n（点）") %>%
  adjust_y_axis(limits = c(0, 50))  %>%
  adjust_font(fontsize = 11) %>%
  adjust_colors(new_colors=c("grey","grey30")) %>%
# rename
  rename_x_axis_labels(new_names = c("placebo"="対照群","treatment"="介入群")) %>%
  rename_color_labels(new_names = c("high"="低用量","low"="高用量")) %>%
# remove
  remove_x_axis_title() %>%
  remove_x_axis_ticks() %>%
  remove_legend_title()
```

#### Helpers

`tidyplots`に搭載されていない（あるいは私が見つけれなかった）要素の調整は、`add()`で`ggplot2`の関数を使用します。ここでは`ggplot2::theme()`を用いています。  
ちなみに、「これを使うのなら最初から`ggplot2`でよくない？」はなしです。

```r
study %>%
  tidyplot(x = group, y = score, color = dose, width = 80, height = 80) %>%
# add
  add_mean_bar(dodge_width = 0.9, width = 0.9) %>%
  add_sem_errorbar(dodge_width = 0.9, width = 0.3, color = "black") %>%
# adjust
  adjust_y_axis_title("得\n点\n（点）") %>%
  adjust_y_axis(limits = c(0, 50))  %>%
  adjust_font(fontsize = 11) %>%
  adjust_colors(new_colors=c("grey","grey30")) %>%
# rename
  rename_x_axis_labels(new_names = c("placebo"="対照群","treatment"="介入群")) %>%
  rename_color_labels(new_names = c("high"="低用量","low"="高用量")) %>%
# remove
  remove_x_axis_title() %>%
  remove_x_axis_ticks() %>%
  remove_legend_title() %>%
# add
  add(theme(legend.position = c(0.3, 1),
            legend.justification = c(1, 1),
            axis.title.y = element_text(angle = 0,hjust = 0.5, vjust = 0.5),
            axis.text.y = element_text(size = 11)))
```

#### Output

グラフを保存するときは`save_plot()`を使用します。

以下のコードでファイル名（Figureとします）を指定して、コードの最後に添付しましょう。

```r
# save
  save_plot("Figure.pdf")
```

### おわりに

今回は`tidyplots`を使用して棒グラフを作成してみました。

`tidyplots`の良い点としては、以下の点が挙げられると思います。

- パイプ演算子を使用して、データから直接グラフを作成できる点
- `add`、`adjust`、`remove`など関数が直観的に分かりやすい点
- あまり細かい調整をせずに見やすいグラフを作れる点

やる気があれば他のグラフでも試してみようかなと思います。
