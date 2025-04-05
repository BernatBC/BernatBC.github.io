---
title: "MiniChef AR"
date: 2024-12-19T06:00:23+06:00
description: MiniChef AR
theme: Toha
menu:
  sidebar:
    name: MiniChef AR
    identifier: minichefar
    parent: education
    weight: 500
draft: false
tags: ["AR", "C#", "Education", "Unity"]
math: true
thumbnail: hero.jpg
---

## The statement
We were asked to develop an Augmented Reality application using [Unity](https://unity.com/) and either [AR Toolkit](https://www.artoolkitx.org/), [Vuforia](https://developer.vuforia.com/), [EasyAR](https://www.easyar.com/) or [ARFoundation](https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@6.0/manual/index.html). The app needed to have the following features:
- Possibility of detection of more than one marker at the same time, or the use of more than one virtual object recorded in the real world.
- The user must be able to apply some geometric transformations to each of them virtual objects relative to their initial position (or marker). You can apply these geometric transformations, if you want, doing some animation with (or between) the virtual objects, as long as this animation has been programmed by you.
- Presence of an animated 3D character (humanoid) with which the user can interact somehow. This character must make sense within the context of the project.
- Offer the user some interaction mechanism (apart from the already included tracking), both with the virtual objects (directly or indirectly) as with application control.

## What we've made

We've decided to go with [ARFoundation](https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@6.0/manual/index.html) as it seemed to be the recommended one by [Unity](https://unity.com/), as it was already preinstalled when selecting the AR template. 
In the video below you can take a look at the resulting app. To sum it up, we're tracking a Menu, where you can check the available dishes alongside its information. Afterwards, you can tell the chef to cook a certain dish, and a few seconds later, the dish will appear in a 3rd tracker.

{{< youtube n8KnyEHTFLk>}}

### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/AR-Project)

### [<i class="fa-solid fa-cloud-arrow-down"></i> APK for <i class="fa-brands fa-android"></i>Android](https://github.com/BernatBC/AR-Project/releases/download/v1.0/miniChefAR.apk)
