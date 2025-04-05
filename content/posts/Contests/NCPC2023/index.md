---
title: "Nordic Collegiate Programming Contest 2023"
date: 2023-10-07T06:00:23+06:00
description: Nordic Collegiate Programming Contest 2023
theme: Toha
menu:
  sidebar:
    name: NCPC 2023
    identifier: ncpc2023
    parent: contests
    weight: 500
draft: false
tags: ["Contest", "C++"]
thumbnail: hero.jpg
---

## About NCPC 2023
The [Nordic Collegiate Programming Contest (NCPC)](https://nordic.icpc.io/ncpc2023/) is an annual team-based programming competition aimed at university and college students from the Nordic and Baltic countries. NCPC is suitable for programmers of all skill levels, from beginner to expert. The contest features a well-rounded problem set with a mix of easy and challenging problems.

Teams are allowed only one computer, and are not allowed to surf through the internet.

## Problems Solved

### Problem C: Converting Romans
[Statement of Problem C: Converting Romans](https://ncpc23.kattis.com/contests/ncpc23/problems/convertingromans)
{{< line_break >}}
Once I read this problem, I directly went to code it in the computer as it seemed easy. I coded the usual roman to decimal converter, but then I noticed that they asked for a simpler version of the problem: "we will subtract any digit written to the left of a larger digit, even if they are not directly adjacent." making the problem easier. I had a couple of little issues with the slight modification of the problem, but eventually I managed to solve it. This was the first problem we managed to get it right.
### Problem D: Die Hard
[Statement of Problem D: Die Hard](https://ncpc23.kattis.com/contests/ncpc23/problems/diehard)
{{< line_break >}}
After getting the first problem correct, one of my teammates [@miquelt9](https://github.com/miquelt9) had already made a sketch on how to solve it. I just implemented a brute-force algorithm, and for each possibility I computed a function given by [@miquelt9](https://github.com/miquelt9) if that option was valid or not. With little effort we could make it work, and accepted on the judging system.

### Problem J: Jamboree
[Statement of Problem J: Jamboree](https://ncpc23.kattis.com/contests/ncpc23/problems/jamboree)
{{< line_break >}}
[@miquelt9](https://github.com/miquelt9) also figured out the strategy for this problem while I was coding [Problem C: Converting Romans](#problem-c-converting-romans) and [Problem D: Die Hard](#problem-d-die-hard). He had an implementation in mind, but a different from the one I figured out. We code both implementations alongside in the same computer, and when I was thinking why mine was wrong, he was coding a fix for his one and the other way around. [@miquelt9](https://github.com/miquelt9)  managed to make his implementation work before me, so we submitted his implementation, and it worked.

### Problem K: Karl Coder
[Statement of Problem K: Karl Code](https://ncpc23.kattis.com/contests/ncpc23/problems/karlcoder)
{{< line_break >}}
Together we thought that this problem was doable. It was just a binary search. Even though the algorithm is easy, we had lots of troubles using the "interactive" way of doing the queries. Instead of searching through an array in the memory, we had to output the query in the command line, and read the result from there. This made testing a little challenging, but eventually we could get it correct.

## Close Calls
After we managed to solve the previous problems, we tried more difficult ones without success.

### Problem A: Aperiodic Appointments
Our third member of the team spent almost the whole contest trying to solve this problem. The idea was right, and all examples seemed to work. After spending hours trying to figure out why it wasn't accepted in the judging system, we found that there were cases that we should do a recursion while finding the solution. We spend all remaining time trying to fix it, but we ran out of time.

At the end, we managed to solve 4/11 problems with a total time of 644 minutes (including penalization for wrong submissions) we ranked 74th place out of 160 [ICPC](https://icpc.global/) eligible teams.

You can check the full rankings [here](https://ncpc23.kattis.com/contests/ncpc23/standings?filter=5254).

### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Coding-Competitions/tree/main/NCPC2023)