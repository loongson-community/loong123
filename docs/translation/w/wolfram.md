---
outline: deep
prev: false
next: false
---
# Wolfram

自 14.1 版本后, Wolfram Mathematica 的安装被包含在了 Wolfram 的安装中, 官方也以 Wolfram 的名字描述之. 

## 安装

照常运行安装程序并按要求配置安装路径即可

## 修改启动脚本

在 Wolfram 安装路径下 (如版本 14.2 的默认安装路径`/usr/local/Wolfram/Wolfram/14.2`), 找到 `Executables` 文件夹, 对其中的脚本文件 (`math`, `MathKernel`, `mcc`, `wolfram`, `WolframKernel`, `wolframnb`, `WolframNB`) 做如下相同的更改:

在脚本开头处

```bash
    ...
        case `uname -s` in
                Linux)
                        case `uname -m` in
                                i?86)
                                        SystemIDList="Linux";;
                                x86_64)
                                        if [ "${_SystemID}" = "Linux" ]; then
                                                SystemIDList="Linux Linux-x86-64"
                                        else
                                                SystemIDList="Linux-x86-64 Linux"
                                        fi;;
                                armv?l)
                                        SystemIDList="Linux-ARM";;
                                aarch64)
                                        SystemIDList="Linux-ARM64 Linux-ARM";;
                                loongarch64)
                                        SystemIDList="Linux-x86-64 Linux";; 
                                *)
                                        SystemIDList="Unknown";;
                        esac;;
                *)
                        SystemIDList="Unknown";;
        esac
    ...
```

往aarch64的case后面 (其实加在前面也可以) 添加一个loongarch64的case, 如: 

```bash
                                ...
                                aarch64)
                                        SystemIDList="Linux-ARM64 Linux-ARM";;
                                loongarch64)
                                        SystemIDList="Linux-x86-64 Linux";;
                                *)
                                        SystemIDList="Unknown";;
                                ...
```

保存退出. 在确保已经将 `/usr/local/bin` 添加到 `$PATH` 环境变量中后, 在终端里执行 `math` 或 `wolfram` 即可启动 Wolfram 的cli交互界面. 

```bash
resbi@la464v:~ $ wolfram
Wolfram 14.2.0 Kernel for Linux x86 (64-bit)
Copyright 1988-2024 Wolfram Research, Inc.

In[1]:=   
```

在将 LATX 更新至 1.6 版本后, 可以在命令行终端里运行 `WolframNB` 运行启动 Wolfram Notebook. 

## 兼容情况

此处仅列出我测试过的版本

| 版本  | 发布/更新日期 | 兼容情况        | 备注                                                           |
| ----- | ------------ | -------------- | ---------------------------------------------------------------- |
| 14.2  | 2025.1.23    | <Compatible /> | cli模式可正常使用, 使用 LATX 1.6 可以启动 Wolfram Notebook       |
| 14.0  | 2024.1.9     | <Compatible /> | cli模式可正常使用, Wolfram Notebook 未测试                       |

## 注记

### Wolfram 自带 Java 二进制文件

在 Wolfram 安装目录下的 `SystemFiles` 文件夹中有一个 `Java` 文件夹, 其中包含一个 `Linux-x86-64` 文件夹, 这是一个完整的 x86_64 的 JDK21. 您可以用龙芯原生的 OpenJDK-21 将其替换, 但注意要将文件夹命名为 `Linux-x86-64`. 此做法可以将部分任务的性能提升大约10%. 但是这个操作可能会导致程序中的 `Export[]` 函数无法正常保存文件(或是完全无法保存文件). 
