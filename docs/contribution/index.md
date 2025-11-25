---
sidebar: true
layout: doc
aside: false
prev: false
next: false
---
# 参与贡献

## 提交方式

目前可以选择以下三种方式提供数据：

1. 根据类型查看左侧对应的指引，之后 fork 一份[本仓库](https://github.com/loongson-community/loong123)，修改完毕后向我发起一个PR
2. [在这里](https://github.com/loongson-community/loong123/issues)发起一份issue，选择`硬件信息/translation/libLoL`对应的`Form`，根据摸板提示填写对应的表单提交
3. (**仅针对硬件信息**) 通过 `hw-probe` 工具执行以下命令：

> **注意：hw-probe 会将收集到的日志也一并上传，请酌情考虑该方式**

```bash
sudo hw-probe -all -upload

# 将会得到以下输出
Probe for hardware ... Ok
Reading logs ... Ok
Uploaded to DB, Thank you!

Probe URL: https://linux-hardware.org/?probe=(生成的id)
```

然后[在这里](https://github.com/loongson-community/loong123/issues)发起一个 `(Markdown) 添加硬件信息 / Add Hardware Info` 模板 issue，提交 Probe URL 即可


## 额外内容

若fork添加硬件或软件需要正式文档以说明兼容情况，请根据以下内容修改文件：

首先请根据类型到 `/docs/.vitepress/config_files/sidebar_<hardwares/translation/liblol>.js` 下填写链接地址和文档标题，范例如下：

```js
{ text: '<文档标题>', link: '<文档地址>' }
```

其中 `link` 的值与 `.yml` 文件下的 `link` 相同。
