---
title: "λ-Calculus Telegram Bot"
date: 2023-06-13T06:00:23+06:00
description: Lambda Calculus Interpreter
theme: Toha
menu:
  sidebar:
    name: λ-Calculus Bot
    identifier: lambdacalculusbot
    parent: education
    weight: 500
draft: false
tags: ["ANTLR4", "Bot", "Python", "Telegram", "Education"]
math: true
thumbnail: hero.png
---

## The statement
We were asked to make a lambda-calculus interpreter created by [Alonzo Church](https://en.wikipedia.org/wiki/Alonzo_Church). This interpreter had also to support the definition and use of macros, a variable name for another expression. Those macros had to be evaluated in an infix (if it's a symbol) or a prefix mode (otherwise). On top of that, our interpreter had to run in a [Telegram](https://telegram.org/) chat. Finally, we had to add the capability to print our expression as a tree in an image.

The full statement can be found below or in the following [site](https://gebakx.github.io/lp-achurch-23/). Note that the statement is in Catalan.

<div style="position:relative;padding-bottom:55.66%;     zoom: 1;
    -moz-transform: scale(1);">
 <iframe style="width:100%;height:100%;position:absolute; margin-left: 0%; marginheight: 0%"
 frameborder="0"
 src="
https://gebakx.github.io/lp-achurch-23/
"
mozallowfullscreen="true" allow="autoplay; fullscreen" style="border:0px #000000 none;" name="LambdaCalculusStatement" scrolling="yes" msallowfullscreen="true" allowfullscreen="true" webkitallowfullscreen="true" allowtransparency="true"
>
</iframe>
</div>

{{< line_break >}}

## Getting Started

### Method 1: Try telegram bot

You'll need to have telegram installed and an account. For more information, please visit [telegram.org](https://telegram.org/).

You can access the bot through the [@lambda_calculus_bot](https://t.me/lambda_calculus_bot) account.

### Method 2: Build own telegram bot

#### 1. Install dependencies
The following dependencies are required:
- python3       version 3.7 or later
- pip
- antlr4        version 4.10 or later
- graphviz
- telegram

After the installation of those packages, we'll install the following python packages:

```bash
pip install antlr4-tools                # version 4.10 or later
pip install antlr4-python3-runtime      # version 4.10 or later
pip install python-telegram-bot         # version 20.0 or later
pip install pydot
```

#### 2. Get source code
To get the source code, you can simply download the zip file, or you can clone this repository by typing: 

```bash
git clone https://github.com/BernatBC/Lambda-Calculus-Telegram-Bot.git
```

#### 3. Setting up a Telegram Bot
Message the Telegram account [@BotFather](https://t.me/botfather) and follow its instructions to create your own bot.

After that, create a file `token.txt` inside the repository directory and paste the token generated by the [@BotFather](https://t.me/botfather) account.

For more information, please visit the [Telegram Bot Guide](https://core.telegram.org/bots#how-do-i-create-a-bot).

#### 4. Run locally
From the repository directory, run the following command:

```bash
python3 achurch.py
```

Finally, you can chat with the bot created.

### Method 3: Execute from terminal

#### 1. Install dependencies
The following dependencies are required:
- python3       version 3.7 or later
- pip
- antlr4

After the installation of those packages, we'll install the following python packages:

```bash
pip install antlr4-tools                # version 4.10 or later
pip install antlr4-python3-runtime      # version 4.10 or later
```

#### 2. Get source code
To get the source code, you can simply download the zip file, or you can clone this repository by typing: 

```bash
git clone https://github.com/BernatBC/Lambda-Calculus-Telegram-Bot.git
```

#### 3. Run locally
Finally, from the repository directory, run the following command:

```bash
python3 achurch.py terminal
```

### [Chat with λ-Calculus Bot in <i class="fa-brands fa-telegram"></i>Telegram](https://t.me/lambda_calculus_bot) 
### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Lambda-Calculus-Telegram-Bot) 
