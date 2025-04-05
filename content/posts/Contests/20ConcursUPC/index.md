---
title: "Vintè Concurs de Programació de la UPC - Semifinal 2022"
date: 2022-06-15T06:00:23+06:00
description: Vintè Concurs de Programació de la UPC - Semifinal 2022
theme: Toha
menu:
  sidebar:
    name: 20th UPC Contest
    identifier: 20concursupc
    parent: contests
    weight: 500
draft: false
tags: ["Contest", "C++"]
thumbnail: hero.png
---

## About the contest
Each year, [School of Mathematics and Statistics](https://fme.upc.edu/en) from [Universitat Politècnica de Catalunya](https://www.upc.edu/en?set_language=en) organizes a coding competition for all students enrolled to [UPC](https://www.upc.edu/en?set_language=en). During 4 hours, the contestants try to solve as many coding problems as possible. A rank is made considering the number of solved problems and penalization points. For each wrong submission, they add 20 minutes to the total of time used for each solved problem. So the sooner you solve them, the better. 

All 9 problems given are in the document below:

<embed src="concurs.pdf" width="100%" height="700" type="application/pdf">

## My submissions
After reading all 9 problems, I decided to start with the last one as it was the easiest. It consisted of comparing two numbers, but with a twist. A number could have up to 10k digits. Because of the rush, I didn't read this last part well and compared to Integers. I sent it, and I got a Wrong Answer. After reading it again, I understood well the problem and made the comparison using strings.

Then I decided to try the problem number 2 in the list, which the goal was to simulate Snakes and Ladders table game. This one was straightforward to make, but a single number made me send an incorrect submission. I assigned a ladder to a wrong cell and after this fix I got it correct.

I carried on with the fourth problem. Given a number sequence, we'd to output the maximum difference between the average and the median when excluding a number of the sequence. My first approach consisted of calculating for each sequence (after excluding each number) the median and the average. This approach gave the correct answer, but it failed, it was too inefficient. My second approach was to calculate the average one time and subtracting the 'average value' for each number. After this optimization, I got the problem correct. 

The last problem that I could solve was number 7. The goal was to count the number of [arithmetic derivatives](https://en.wikipedia.org/wiki/Arithmetic_derivative) contained into a given interval. My first approach was to solve it using recursion, and worked. But once again it wasn't efficient. After making some tests, I encountered that arithmetic derivatives follow a pattern. A number is an arithmetic derivative if it equals to a prime number powered to itself. So my second approach was just calculating the arithmetic derivatives from each prime number and checking if it follows inside the interval.

Among these four problems, I tried to solve two more. The eight problem consisted of implementing  a data structure to insert, erase and reset strings. It also had to count the number of strings contained into in that contained a given suffix. I made it using sets, but once again it was inefficient. After the competition, some students said that they solved using trees. The third problem consisted of painting every node from a tree either blue or red. Painting in blue costs 1 per node, while painting in red costs 2 per node. The goal was to minimize the total cost of painting the tree. There is just one restriction: Each node can have, at most, one adjacent node with the same color as itself. Once again, I read the statement too fast and solved the problem without considering the restriction. I tried to apply the restriction, but I ran out of time.

At the end I got 4 problems right with a penalization time of 545 (including wrong submissions). I placed 16th out of 74 participants, and 13th out of 55 UPC students.

You can check the full rankings [here](https://contest.jutge.org/watch/Jutge:Semifinal2022/static).


### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Coding-Competitions/tree/main/Vint%C3%A8%20Concurs%20de%20Programaci%C3%B3%20de%20la%20UPC%20-%20Semifinal%202022)