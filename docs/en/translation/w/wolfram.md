---
outline: deep
prev: false
next: false
---
# Wolfram

Since the version 14.1, installation of Wolfram Mathematica was included in the installation of Wolfram. 

## Installation

Install it as on a usual x86/arm machine. 

## Modifying the scripts

Under the path to install (such as the normal installation path `/usr/local/Wolfram/Wolfram/14.2` for version 14.2), find the folder `Executables`, for all scripts in it (`math`, `MathKernel`, `mcc`, `wolfram`, `WolframKernel`, `wolframnb`, `WolframNB`), modify them as shown below:

at the beginning of those scripts

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

add a case for loongarch64, such as 

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

save it and exit. After checking your `$PATH` includes `/usr/local/bin`, run `math` or `wolfram` in your console to launch Wolfram Cli interface. 

```bash
resbi@la464v:~ $ wolfram
Wolfram 14.2.0 Kernel for Linux x86 (64-bit)
Copyright 1988-2024 Wolfram Research, Inc.

In[1]:=   
```

After updated your LATX to version 1.6, you could run `WolframNB` or `wolframnb` in your console to launch Wolfram Notebook. 

## Compatibility

Only listing tested versions. 

| Version  | Release/Upgrade Date | Compatibility        | Notes                                                                |
| -------- | -------------------- | -------------------- | -------------------------------------------------------------------- |
| 14.2     | 2025.1.23            | <Compatible />       | Wolfram Notebook runs normally with LATX 1.6.                        |
| 14.0     | 2024.1.9             | <Compatible />       | Cli interface runs normally, Wolfram Notebook wasn't been tested.    |

## Notices

Under the installation path of your Wolfram, at the same level of `Executables`, there's a folder called `SystemFiles`, find a folder called `Java` inside of it, and you'll see a folder called `Linux-x86-64`, it's a JDK21 binary package for x86_64. You could replace it with the Loongarch native version of OpenJDK-21, remember to rename the folder to `Linux-x86-64`. By which you will gain around 10% of performance boost. But need to notice that this modification might cause the `Export[]` function unable to save files normally (or totally not working).
