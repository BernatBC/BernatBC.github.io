---
title: "Monopoly"
date: 2022-11-25T06:00:22+06:00
description: Monopoly
theme: Toha
menu:
  sidebar:
    name: Monopoly
    identifier: monopoly
    parent: videogames
    weight: 500
draft: false
tags: ["C#", "Unity", "Videogame"]
---

{{< alert type="danger" >}}
Pictures on this post are outdated. I will update them soon.
{{< /alert >}}

## The project
After making the [Minesweeper](https://bernatbc.tk/posts/videogames/minesweeper/), I wanted to create something more elaborated. I decided to make a clone of Monopoly. Almost everybody has played at least one time to Monopoly, so I don't need to make an introduction.

## How it works
I started with the player movement and the dice. When everything was smooth and playable, I started to make the cards. One thing I like about them is the fact that they aren't images. Cards are rendered based in the info assigned to its cell. With this method I don't need to be hours making each card, and if I want to change a value, I just do it once and the card will change automatically. The cash flow of each player is pretty easy to implement. The jail cell has given me headaches with the go to jail movement and several bugs I've already fixed. Houses and hotels were also very buggy, especially when you sold them. I also had troubles implementing the functionality of some Chance and Community Chest cards, as I had to change the way I made some functions. With the functionality of mortgages/unmortgages I learnt to access to a child object parameter in Unity. It's a little different from most common programming languages. Be in mind that now you can have negative cash due to testing.

The main functionality of the game, trading, has been implemented after spending long hours in front of the computer. It wasn't difficult, but it took a long time. The panel where you can select which properties you want to trade is generated each time using the information of the game at that stage.

## What's next?
Actions will be implemented in the future. I will also make the UI as it deserves. Now it's just a couple of text boxes and buttons. Finally, I will add the capability to play against the computer by making some kind of AI.
 
{{< figure src="monopoly4.png">}}
 
{{< figure src="monopoly1.png">}}
 
{{< figure src="monopoly3.png">}}

### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Monopoly)

### [<i class="fa-solid fa-cloud-arrow-down"></i> for Windows 64bit](https://github.com/BernatBC/Monopoly/releases/download/Pre-release-0.2/Monopoly.zip)