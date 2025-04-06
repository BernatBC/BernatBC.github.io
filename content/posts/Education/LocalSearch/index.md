---
title: "Grid Power Optimization"
date: 2022-10-24T06:00:23+06:00
description: Grid Power Optimization
theme: Toha
menu:
  sidebar:
    name: Local Search
    identifier: localsearch
    parent: education
    weight: 500
draft: false
tags: ["AI", "Education", "Java"]
math: true
thumbnail: hero.png
---

## The statement
Given a set of Power plants and Clients, find an assignation for each Client where the total benefit is the maximum. Each power plant is represented by coordinates in a map, the total production and the cost when it's stopped and running. Each client is represented by coordinates in a map, the power consumed, the price it pays for each Mw and a compensation in the case he doesn't get power. Also, power gets drained if the distance between a power plant and a client is farther than a certain value.

They ask us to solve the problem using [Hill Climbing](https://en.wikipedia.org/wiki/Hill_climbing) and [Simulated Annealing](https://en.wikipedia.org/wiki/Simulated_annealing). We also have to study how each parameter in this algorithm varies the solution and the time efficiency.

The full statement is in the document below. Note that the statement is in Spanish.

<embed src="PracticaBusqueda-local.pdf" width="100%" height="700" type="application/pdf">

## Our solution
[@alexland7219](https://github.com/alexland7219), [@Loparc](https://github.com/Loparc) and I were allowed to use [AIMA](https://github.com/aimacode/aima-java), a library where both algorithms are implemented. For each algorithm we had to determine the state representation, the initial state generation, the operands and the heuristic function. By trying and studying different options, we selected the following ideas:

### State Representation
We chose to represent a state with an array of c positions, where c is the number of clients. Each position represents a client and each value the power plant which the client is assigned to (can be empty). This representation is enough, but we decided to store certain parameters, so the program can run faster. We added the benefit that solution has, and some parameters needed for the heuristic function (will be explained later).

### Operands
As we need a set of operands that can reach any possible solution, we started using 3 operands: Assign, unassign and swap. Assign and unassign operators are self-explanatory. Assign sets a power plant to a client (can overwrite a previous power plant assigned). Unassign removes a power plant from a client. Swap operator switches two power plants between two clients. Of course, each time we have to apply an operator, we check if it's possible to apply it.

Later we found that the unassign operator was never used, so we decided to remove it. That made the execution time go down a couple of seconds.

### Initial State Generation
We had to make two strategies to generate the initial state, so we can compare them later on the project. As there's a type of clients that have to have a power plant, we decided to assign all clients of this kind to a power plant.

The first strategy is to assign each "guaranteed" client to the closest power plant. The second one is also to assign each "guaranteed" client to a random power plant. There are cases where the initial state is not a valid solution, so we indicate to the heuristic function how many "guaranteed" clients don't have a power plant assigned.

### Heuristic Function
Our first guess was to use the benefit as the heuristic function. This worked fairy well until we noticed that the algorithm shut down all power plants. A better option would be to provide energy to as many clients as possible. After testing a lot of functions, we got

$$
\begin{aligned}
 & h = (dist * \log(dist) + energy) *(nonAssignedG + 1) \newline
 & dist = \sum_{n=1}^{numPowerPlants}\sum_{m=1}^{numClients}
 \begin{cases}
 distance(powerPlants[n], clients[m]) &\text{if } assigned(powerPlants[n], clients[m]) \newline
 0 &\text{else }
 \end{cases} \newline
& energy = \sum_{n=1}^{numPowerPlants} powerPlants[n].energyLeft² \newline
& where, \newline
& powerPlants[] \to \text{an array containing power plants} \newline
& clients[] \to \text{an array containing clients} \newline
& numPowerPlants \to \text{number of power plants} \newline
& numClients \to \text{number of clients} \newline
& energyLeft \to \text{energy the specified power plant has available}
\end{aligned}
$$

### [View Code and report on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/LocalSearch) 
