---
outline: deep
prev: false
next: false
---
# 软件转译信息

## 开始

复制模板文件 `template_translation.yml` 到 `/docs/data/translation` 下，根据软件的英文首字母存放，若开头为数字则存放到 `0to9` 文件夹下。

这是一份模板文件的内容：

```yaml
name:  #软件名称
vendor:  #软件厂商
version:  #软件版本号
lat_or_box64:   #LAT 或 Box64
lat_version:   #LAT 版本号
box64_version: #Box64 版本号
date: 
lat_status:   #LAT 兼容状态 -1=不兼容 0=未知 1=兼容  2=有限兼容 3=已有原生龙架构版本无需转译
box64_status: #Box64 兼容状态 -1=不兼容 0=未知 1=兼容  2=有限兼容 3=已有原生龙架构版本无需转译
notes:  #备注
notes_en: 
link:   #链接
link_en: 
```

## name

此处填写软件名称，语言不限

## vendor

此处填写软件厂商，限英语

## version

此处填写软件的运行版本

## lat_or_box64

软件运行使用的运行库，需参考软件当前的架构，若使用 LAT 运行则填写 `LAT`，若使用 Box64 运行则填写 `Box64`。

## lat_version & box64_version

此处填写运行该软件时使用的 LAT 运行库版本或 Box64 版本，对于 LAT 填写范例为：

```yaml
1.5.3-rc1
```

对于 Box64 填写范例为：

```yaml
12580e5
```

若该软件为 Windows 软件，还需要填写 Wine 运行库版本，填写范例为：

```yaml
1.5.3-rc1 + wine-9.9-staging
```

## date

软件的更新日期，若有多个版本请填写 `1` 并新建一个 Markdown 文档进行说明。

## lat_status & box64_status

填写该软件目前的兼容状态，此处均为整数（不是字符串），数值与对应关系如下表所示：

| 数字 | 对应值   |
| ---- | -------- |
| 0    | 未知     |
| 1    | 兼容     |
| 2    | 有限兼容 |
| 3    | 原生可用 |
| -1   | 不兼容   |

若只测试了其中一种，请将另一种填写为 `0`（即 `未知`）

## notes

该软件需要注意的简短备注信息。

过长的内容或有必要通过长文进行解释的请编写为文档，并在 `link` 中填写文档地址。

## link

若该软件需要正式文档以说明兼容情况，请在 `/docs/translation/` 下存放 Markdown 文件。

该值的填写格式如下（**请注意文件名不能使用中文，请使用全英文**）：

```yaml
/translation/<所写的markdown文件名>
```

之后根据[此处](#external-docs)的指示将文档展示在指定位置。
