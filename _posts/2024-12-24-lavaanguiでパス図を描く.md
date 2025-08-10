---
layout: post
title: "lavaanguiでパス図を描く"
date: 2024-12-24 20:28:51 +0900
categories: [r]
tags: [lavaan, lavaangui, R]
slug: "5"
---

[lavaangui](https://github.com/karchjd/lavaangui)とは、lavaanで作成したモデルをパス図として出力するためのパッケージです。

### インストール

CRANで公開されているので、`install.packages()`でインストールできます。

```r
install.packages("lavaangui")
```

### 使用するパッケージ

今回使用するパッケージはlavaanとlavaanguiです。

```r
library(lavaan)
library(lavaangui)
```

### 使用するデータ

lavaanパッケージの`HolzingerSwineford1939`を使用します。

```r
data(HolzingerSwineford1939, package = "lavaan")
head(HolzingerSwineford1939)
```

今回はx1-x9の9変数を使用するので、それ以外の変数を削除して使用します。

```r
dat <- HolzingerSwineford1939[, -c(1:6)]
```

### 基本的な使い方

まずはlavaanでモデルを作成します。

```r
model <- "
  visual  =~ 1*x1 + x2 + x3
  textual =~ 1*x4 + x5 + x6
  speed   =~ 1*x7 + x8 + x9
"

fit <- cfa(model, dat)
```

次に、`lavaangui()`でGUIを起動します。

`fit`で`lavaan()`, `sem()`, `cfa()`のいずれかによって作成したモデルを指定します。なお、`fit`を指定しない場合、空白のキャンパスが表示されます。

```r
lavaangui(fit)
```

あるいは、`plot_lavaan()`で出力することもできます。

`fit`でlavaanのmodelを指定し、`where`でパス図を表示する場所を指定します。デフォルト値の`gadget`ではRstudioで表示し、`browser`を指定するとブラウザで表示されます。

ブラウザ版は先ほどと同じなので、ここでは`gadget`を指定します（何も指定しなくても構いません）。

```r
plot_lavaan(fit, where = "gadget")
```
