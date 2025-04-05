---
title: "Workout Planner"
date: 2022-12-19T06:00:23+06:00
description: KnowledgeBasedSystems
theme: Toha
menu:
  sidebar:
    name: Workout Planner
    identifier: knowledgebasedsystems
    parent: education
    weight: 500
draft: false
tags: ["AI", "Clips", "Education"]
math: true
thumbnail: hero.png
---

## The statement
The progressive aging of the population is showing the importance of maintaining a set of healthy habits and promote physical exercise throughout life. When you reach a certain age it is necessary to have help to determine what types of exercises and activities are the most appropriate taking into account all factors that may affect the performance of those activities.

Basically, we had to make a [CLIPS](https://clipsrules.net/) script that after given certain information about a person, we had to output an exercise planning suitable for him/her. We were given a bunch of documents about exercises for elder people where we had to extract the information. 

The full statement is in the document below. Note that the statement is in Spanish.

<embed src="PracticaSBC.pdf" width="100%" height="700" type="application/pdf">

## Our solution
[@alexland7219](https://github.com/alexland7219), [@Loparc](https://github.com/Loparc) and I started making the ontology using [Protégé](https://protege.stanford.edu/), an ontology editor for building intelligent systems. We specified all items involved in the problem, like the different illnesses, body parts, properties, etc. Once we had our ontology done, with the help of [owl2else](https://pypi.org/project/owl2else/) to convert our .owl file to a [CLIPS](https://clipsrules.net/) script. Since none of us had used [CLIPS](https://clipsrules.net/), we watched a lot of videos to understand what the h*** [CLIPS](https://clipsrules.net/) was and how to use it. Neither of us used a language similar in any aspect to [CLIPS](https://clipsrules.net/). At the beginning we were so lost that nothing worked. I don't know how suddenly our script was reading the questions the user inputs. After reading these questions, we assigned properties and relations in our ontology.

Now is when everything we tried didn't work. We tried to print the exercisies suitable for the user, and we learned how slots worked in [CLIPS](https://clipsrules.net/). We tried many forum solutions and none worked except for one. Thankfully, that worked, but we noticed that there were repetitions. We decided we would check if that exercise was already in the slot before inserting it. We could make this work after spending 3 or 4 hours in front of the code. 

The remaining tasks were easier, as we already knew (more or less) how clips worked. We used some formulas to decide the amount of days that user had to exercise, the amount of repetitions and the duration.

We calculated the number of days a week the user has to exercise using the following formula:


$$
\begin{aligned}
& days = 3 + 4 * (0.3 * \frac{activeGrade - 1}{3} + 0.1 * notSmoker + 0.6 * \frac{110 - age}{110 - 65}) \newline
& where, \newline
& activeGrade \to \text{is a number between 1 and 5 that indicates how active a person is. 1: not active, 5: very active.} \newline
& notSmoker \to \text{1: if the user does NOT smoke. 0: if the user DOES smoke.} \newline
& age \to \text{age of the user.}
\end{aligned}
$$

{{< line_break >}}
{{< line_break >}}

To calculate the amount of repetitions the user will do, we used the following one:

$$
\begin{aligned}
& repetitions = \lfloor 20 + 10 * \frac{activeGrade}{exerciseIntensity} \rfloor \newline
& where, \newline
& activeGrade \to \text{is a number between 1 and 5 that indicates how active a person is. 1: not active, 5: very active.} \newline
& excerciseIntensity \to \text{is a number between 1 and 5 that indicates how intense an exercise is. 1: not intense, 5: very intense.} \newline
\end{aligned}
$$

{{< line_break >}}
{{< line_break >}}

To calculate the duration of a certain exercise the user will do, we used the following formula:

$$
\begin{aligned}
& duration = 
 \begin{cases}
 \frac{baseDuration}{2} &\text{if first exercise of the day}\newline
  \frac{baseDuration}{1.5} &\text{if second exercise of the day}\newline
   \frac{baseDuration}{3} &\text{if third exercise of the day}
 \end{cases} \newline
 & baseDuration = \lfloor 20 + 10 * \frac{activeGrade}{exerciseIntensity} \rfloor \newline
 & where, \newline
& activeGrade \to \text{is a number between 1 and 5 that indicates how active a person is. 1: not active, 5: very active.} \newline
& excerciseIntensity \to \text{is a number between 1 and 5 that indicates how intense an exercise is. 1: not intense, 5: very intense.} \newline
\end{aligned}
$$

{{< line_break >}}
{{< line_break >}}

### [View Code and report on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/KnowledgeBasedSystems) 
