---
title: "Minesweeper"
date: 2022-02-11T06:00:23+06:00
description: Minesweeper
theme: Toha
menu:
  sidebar:
    name: Minesweeper
    identifier: minesweeper
    parent: videogames
    weight: 500
draft: false
tags: ["C#", "Unity", "Videogame"]
thumbnail: hero.png
---

<div style="position:relative;padding-bottom:55.66%;     zoom: 0.6;
    -webkit-transform: scale(0.6);
    -moz-transform: scale(0.6);
    transform: scale(0.6)">
 <iframe style="width:166%;height:174%;position:absolute; margin-left: -33%; marginheight: -50%"
 frameborder="0"
 src="
/webgl/MinesweeperWebGL/index.html
"
mozallowfullscreen="true" allow="autoplay; fullscreen" style="border:0px #000000 none;" name="MinesWeeper" scrolling="no" msallowfullscreen="true" allowfullscreen="true" webkitallowfullscreen="true" allowtransparency="true"
>
</iframe>
</div>

{{< line_break >}}
{{< line_break >}}
{{< line_break >}}
{{< line_break >}}
{{< line_break >}}
{{< line_break >}}
{{< line_break >}}
{{< line_break >}}


## The project
Before making this project, I'd used [<i class="fa-brands fa-unity"></i>Unity](https://unity.com/) game engine for making a couple of games like Tetris by following some Youtube tutorials. Also, I made [Space Shooter](/posts/competitions/hackupc2021/) during [HackUPC2021](https://hackupc.com/), but I wasn't on my own. Now I wanted to do a project on my own and decided to start with a simple game. Minesweeper was a good candidate as it didn't seem too complex. I didn't reinvent the wheel and made a clone of minesweeper.

## How it works
Basically I defined a matrix with a fixed size and with the help of a random number generator, mines are placed randomly across the board. Each cell has some parameters like a boolean to check if it has a flag, if it's opened, an integer that determines the number of mines next to it, etc. Each state of the cell has its own sprite. When the game detects a mouse click in a cell, the game updates the cell state and shows a new sprite corresponding to its new state. This was the most complex part of this project, it wasn't too hard. To open the adjacent cells when there's no mine in a cell, I made a dfs algorithm.

{{< youtube JId6stZPivI>}}

### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Minesweeper) 

### [<i class="fa-solid fa-cloud-arrow-down"></i> for <i class="fa-brands fa-windows"></i>Windows 64bit](https://github.com/BernatBC/Minesweeper/raw/main/MinesWeeper.zip)
