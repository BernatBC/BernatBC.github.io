---
title: "Google Code Jam 2021"
date: 2021-03-27T06:00:23+06:00
description: Google Code Jam 2021
theme: Toha
menu:
  sidebar:
    name: Google Code Jam 2021
    identifier: codejam2021
    parent: contests
    weight: 500
draft: false
tags: ["Contest", "C++"]
thumbnail: hero.png
---

## About Google Code Jam
Google’s longest running global coding competition, [Google Code Jam](https://codingcompetitions.withgoogle.com/codejam), calls on programmers around the world to solve challenging, algorithmic puzzles against the clock. Contestants advance through four online-hosted rounds to compete at the annual Code Jam World Finals that is held at a different international Google office each year. Each round brings new challenges, and in the end 25 contestants will have the ultimate chance to put their skills to the test, vying for cash prizes and the coveted championship title at the World Finals.

## My submissions
I started with the [first problem](https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d0a5c). The goal was to compute the cost of applying reversort to a sequence of numbers. I just implemented the reversort algorithm and calculate the overall cost.

The [second](https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d1145) one, given a sequence of 'C', 'J' and '?', and two values representing the cost of having CJ and JC on the sequence, we had to compute the minimum cost of the sequence when replacing the question mark for Cs or Js. My first attempt was to calculate every single possible sequence, but it was too slow. Afterwards, I noticed that by putting the same character as the front one or the behind one, you always get the minimum cost.

The [third problem](https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d12d7) was related to the first one. We had to give the result of reversort after a given sequence size and number of iterations. I just used the first problem file and added some modifications. It worked well without any struggles.

I found the [fourth problem](https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d1284) very challenging. After given an array size and a number of questions, we had to make a median sort but with a twist. We had to guess the initial order of the sequence by asking out of three numbers what the median was. I spent hours writing in my notebook all kinds of possibilities, and finally I got an algorithm that kind of solved the problem. It uses a lot of questions and sometimes repeats itself. But at least I got some points in that problem.

I ended so exhausted from the fourth problem, I was running out of time and it seemed so difficult that I decided not to solve the [fifth problem](https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d1155).

Submissions of all problems can be checked [here](https://codingcompetitions.withgoogle.com/codejam/submissions/000000000043580a/0000000000644c43).

At the end, I got 59/100 points after 25h and 37 minutes of time penalization. I ranked 5773rd out of 37000-38000 participants. 

You can check the full rankings [here](https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a).

### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Coding-Competitions/tree/main/GoogleCodeJam2021/Qualification)