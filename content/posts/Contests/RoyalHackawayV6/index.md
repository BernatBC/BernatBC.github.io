---
title: "Royal Hackaway v6"
date: 2023-02-07T06:00:23+06:00
description: Royal Hackaway v6
theme: Toha
menu:
  sidebar:
    name: Royal Hackaway v6
    identifier: royalhackawayv6
    parent: contests
    weight: 500
draft: false
tags: ["AI", "Contest", "C#", "PDDL", "Unity", "Videogame"]
thumbnail: hero.png
---

## About Royal Hackaway
[Royal Hackaway](https://royalhackaway.com/) is [Royal Holloway's](https://www.royalholloway.ac.uk/) annual hackathon.
Open to students from all around the world, in this two-day hackathon you'll work as a team to build a project. You'll pick up new skills, try out new tech, and meet new people.

This is our sixth time running this event, and we're excited to create a more inclusive and rewarding event for all. You can join us in-person, or online!


## Our project
### Inspiration
When [@alexland7219](https://github.com/alexland7219), [@loparc](https://github.com/Loparc), [@miquelt9](https://github.com/miquelt9) and I discovered that a Shark Plushie was one of the prizes of the Hackaway we realized that the Hackathons UK needed a way to optimally distribute the shark flushies across the country.

### What it does
You can create cities, with a number of sharks already on them, a number of sharks that they require and their name. Then you can link cities with roads choosing the _gas spent_ of traveling by them. Last, but not least, you may select one or more cities to have a plushie van, with its own capacity for shark plushies, which will travel through, and only through, linked cities loading and unloading plushies in order to satisfy the demands of each city. When you have everything you want just press the __Run__ button.

### How we built it
The graphical side of the project, and the one that the user sees, is made with Unity.
The main algorithms and the search of an optimized solution is made with Metric-FF, using the Planning Domain Definition Langauge (PDDL). It uses A* to guide itself to the optimal solution. If finding such solution becomes algorithmically expensive, then the heuristic will change in a way that we will find an optimized solution, maybe not the most optimized, but it will get it in a reasonable amount of time.
Finally, the communication between the graphical side and the PDDL one is made by C# code (how could be otherwise).

### Challenges we ran into
We had problems related to the OS that was going to be used. Some code had to be remade to work with C# and Unity in order to work with Windows. Also, we had trouble with large number of cities and connections will were resolved using by decrementing the optimism of the heuristic function.

### Accomplishments that we're proud of
Mainly, we made it work! We found ourselves stuck several times during the project, finding new bugs. It is true that it is usually always the same process: you solve one bug, you get three more! But given the limited time we thought to ourselves, during the beginning of the night, that we may not get anything working at all. But, after all, we found our way through and with patience and hard work we ended up getting where we wanted. Such a relief.

### What we learned
We have improved our c# coding skills and learned how to communicate Unity, c#, pdll and testing c++ files.

### What's next for Plushistics
We would like to not only expand Plushistics to new countries, but also make it playable.    
Everyone around the world deserves a shark plushie. 


{{< youtube -YuJQaDd6i0 >}}

## [View Project on Devpost](https://devpost.com/software/plushistics)

## [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Plushistics)

## [<i class="fa-solid fa-cloud-arrow-down"></i> for <i class="fa-brands fa-windows"></i>Windows 64bit](https://github.com/Loparc/Plushistics/releases/download/release-1.1/Plushistics.zip)