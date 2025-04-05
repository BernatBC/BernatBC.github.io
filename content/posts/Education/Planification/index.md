---
title: "Mars Planification"
date: 2023-01-14T06:00:23+06:00
description: Mars Planification
theme: Toha
menu:
  sidebar:
    name: Planification
    identifier: planifcation
    parent: education
    weight: 500
draft: false
tags: ["AI", "PDDL", "Education"]
math: true
thumbnail: hero.png
---

## The statement
We are in the year 2075 and the first colonizers of Mars have established a network of bases throughout the geography of the planet that can be of two types, settlements (where the settlers live) and warehouses (where supplies arrive from the Earth). Moving between these bases is done by rovers that can move supplies and specialized personnel. It is not possible to always go directly from one base to another, we have a map (connected graph) that tells us which movements are possible.

To cover the needs of the settlements, they request both specialized personnel and supplies to a centralized hub. Each request is for a supply unit or a person, if you want more you can make several requests. This hub is in charge of planning the movements of the rovers from the base where they are parked, to pick up the supplies and the necessary personnel and finally to leave them in the place where the request has been made. We will assume to make things simpler that there are always more requests for supplies and personnel of those that can be used (life on Mars is very hard).

In this project, they ask to write a [PDDL](https://planning.wiki/) script alongside with the [Metric-FF](https://fai.cs.uni-saarland.de/hoffmann/metric-ff.html) planning system to solve the problem. We had to make both the domain and problem files.

The full statement is in the document below. Note that the statement is in Spanish.

<embed src="PracticaPlanificacion.pdf" width="100%" height="700" type="application/pdf">

## Our solution
[@alexland7219](https://github.com/alexland7219), [@Loparc](https://github.com/Loparc) and I started making the domain file, starting with a script that allowed us to assign the requests to the bases. Once this worked, we added a limitation to the number of supplies and personnel that could fit in a rover (rovers don't have infinite seats and trunk space). Then we added to the problem gas levels. First, the planification system tried not to burn more gas than the available, and then me made a modification to try to burn the least amount of gas as possible. Finally, we added a priority to each request. When a supply/personnel has more than one request, the one with the highest priority will get it. Our final solution, the planification system tried to assign the highest priority requests together with optimizing the usage of the fuel.

### Objects

```java
rover - object
base - object
asentamiento almacen - base
localizable - object
persona carga - localizable
```

### Predicates

```java
(esta-en ?loc - localizable ?b - base)
```
Indicates if a personnel/supply unit is in the indicate base.
{{< line_break >}}

```java
(aparcado-en ?rov - rover ?b - base)
```
Indicates if a rover is in the indicate base.
{{< line_break >}}

```java
(esta-en-rover ?loc - localizable ?rov - rover)
```
Indicates if a personnel/supply unit is in the indicate rover.
{{< line_break >}}

```java
(esta-en ?loc - localizable ?b - base)
```
Indicates if a personnel/supply unit is in the indicate base.
{{< line_break >}}

```java
(servido ?loc - localizable)
```
Indicates if a personnel/supply unit has reached its destination.
{{< line_break >}}

```java
(important-petition ?loc - localizable ?b - base)
(medium-petition ?loc - localizable ?b - base)
(low-petition ?loc - localizable ?b - base)
```
Indicates if there's a petition for a certain personnel/supply unit to the indicated base.

### Functions

```java
(current-capacity ?rov - rover)
```
Returns the load capacity of the rover.
{{< line_break >}}

```java
(gas-level ?rov - rover)
```
Returns the available gas of the rover.
{{< line_break >}}

```java
(sum-petitions)
```
Returns a value that indicates how we're respecting the priorities. If we've assigned the important requests, this value will be higher. Otherwise will be lower.

### Operations

```java
entrar (?loc - localitable, ?b - base)
```
Sets the personnel/supply unit to served.
{{< line_break >}}

```java
mover_rover (:?rov - rover, ?from - base, ?to - base)
```
Moves the rover between two bases.
{{< line_break >}}

```java
load_persona (?rov - rover, ?loc - persona, ?b - base)
```
Loads a personnel to the rover.
{{< line_break >}}

```java
load_carga (?rov - rover, ?loc - carga, ?b - base)
```
Loads a supply unit to the rover.
{{< line_break >}}

```java
unload_persona(?rov - rover, ?loc - persona, ?b - base)
```
Unloads a personnel from the rover.
{{< line_break >}}

```java
unload_carga (?rov - rover, ?loc - persona, ?b - base)
```
Unloads a supply unit from the rover.

### [View Code and report on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/Planification) 
