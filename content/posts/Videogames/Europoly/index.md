---
title: "Europoly"
date: 2022-11-26T06:00:22+06:00
description: Europoly
theme: Toha
menu:
  sidebar:
    name: Europoly
    identifier: europoly
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
/webgl/Europoly_WebGL/index.html
"
mozallowfullscreen="true" allow="autoplay; fullscreen" style="border:0px #000000 none;" name="Monopoly" scrolling="no" msallowfullscreen="true" allowfullscreen="true" webkitallowfullscreen="true" allowtransparency="true"
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
After making the [Minesweeper](/posts/videogames/minesweeper/), I wanted to create something more elaborated. I decided to make a clone of Monopoly. Almost everybody has played at least one time to Monopoly, so I don't need to make an introduction.

## How it works
I started with the player movement and the dice. When everything was smooth and playable, I started to make the cards. One thing I like about them is the fact that they aren't images. Cards are rendered based in the info assigned to its cell. With this method I don't need to be hours making each card, and if I want to change a value, I just do it once and the card will change automatically. The cash flow of each player is pretty easy to implement. The jail cell has given me headaches with the go to jail movement and several bugs I've already fixed. Houses and hotels were also very buggy, especially when you sold them. I also had troubles implementing the functionality of some Chance and Community Chest cards, as I had to change the way I made some functions. With the functionality of mortgages/unmortgages I learnt to access to a child object parameter in Unity. It's a little different from most common programming languages. Be in mind that now you can have negative cash due to testing.

The main functionality of the game, trading, has been implemented after spending long hours in front of the computer. It wasn't difficult, but it took a long time. The panel where you can select which properties you want to trade is generated each time using the information of the game at that stage.

## What's next?
Actions will be implemented in the future. I will also make the UI as it deserves. Now it's just a couple of text boxes and buttons. I will also add a computer player by making some kind of AI. Now the bot is dumb and does not trade nor sell houses nor mortgaging. Finally, I might try to add multiplayer, probably Peer 2 Peer.
  

### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Europoly)

### [<i class="fa-solid fa-cloud-arrow-down"></i> for <i class="fa-brands fa-windows"></i>Windows 64bit](https://github.com/BernatBC/Europoly/releases/download/Pre-release-0.8/Europoly_Windows64.zip)

### [<i class="fa-solid fa-cloud-arrow-down"></i> for <i class="fa-brands fa-android"></i></i>Andorid](https://github.com/BernatBC/Europoly/releases/download/Pre-release-0.8/Europoly_Android.apk)