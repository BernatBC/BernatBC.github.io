---
title: "Monopoly"
date: 2022-07-05T06:00:22+06:00
description: Monopoly
theme: Toha
menu:
  sidebar:
    name: Monopoly
    identifier: monopoly
    parent: videogames
    weight: 500
hero: monopoly2.png
draft: false
tags: ["C#", "Unity", "Videogame"]
---
## The project
After making the [minesweeper](https://bernatbc.tk/posts/videogames/minesweeper/) I wanted to create something more elaborated. I decided to make a clone of Monopoly. Almost everybody has played at least one time to monolpoly, so I don't need to make an introduction.

## How it works
I started with the player movement and the dice. When everything was smooth and playable I started to make the cards. One thing I like about them is the fact that they aren't images. Cards are rendered based in the info assigned to its cell. With this method I don't need to be hours making each card, and if I want to change a value, I just do it once and the card will change automatically. The cash flow of each player it is pretty easy to implement. The jail cell has given me headaches with the go to jail movement and several bugs I've already fixed. Houses and hotels were also very buggy, especially when you selled them. I also had troubles implementing the functionality of some Chance and Community Chest cards as I had to change the way I made some functions. With the functionality of mortgages/unmortgages I learnt to access to a child object parameter in Unity. It's a little different than on most common programming languages. Be in mind that now you can have negative cash due to testing.

## What's next?
I still have to implement the fundamental mechanich, __trading__. Actions will also be implemented in the future. Finally I will make the UI as it deserves. Now it's just a couple of text boxes and buttons. I will also add the capability to play against the computer by making some kind of AI.
 
{{< figure src="monopoly4.png" height="360" width="640">}}
 
{{< figure src="monopoly1.png" height="360" width="640">}}
 
{{< figure src="monopoly3.png" height="360" width="640">}}

### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Monopoly)

### [Download executable file for Windows 64bit](https://github.com/BernatBC/Monopoly/raw/main/Demo.zip)