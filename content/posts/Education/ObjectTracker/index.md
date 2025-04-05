---
title: "Object Tracker"
date: 2023-06-23T06:00:23+06:00
description: Object Tracker for Long-Term Visual Object Tracking Benchmark
theme: Toha
menu:
  sidebar:
    name: Object Tracker
    identifier: objecttracker
    parent: education
    weight: 500
draft: false
tags: ["AI", "Computer Vision", "Matlab", "Python", "Education"]
math: true
thumbnail: hero.png
---

## The statement
[Long-Term Visual Object Tracking Benchmark](https://amoudgl.github.io/tlp/) is a dataset to benchmark object tracking algorithms. We were asked to implement four different algorithms. Two using tracking techniques, and two using recognition. For each technique, we had to implement one from scratch (an algorithm made for us) and another one extracted from the internet. 

Given a series of frames and a bounding box corresponding to the object to track, the algorithm should follow the object. To evaluate the precision, we used the overlapping ratio between the computed bounding box and the optimal bounding box (which was given via a txt file).

The full statement is in the document below. Note that the statement is in Catalan.

<embed src="ShortProjectQP2023.pdf" width="100%" height="700" type="application/pdf">

## Algorithms and methods

The four algorithms are the following:

### Tracking by histogram comparison

The idea of this method is to find the most similar crop of the whole frame. To achieve it, we decided to compute the distance between the color histograms of both crops. Normalized color histograms are a 2D matrix where each cell represents an interval of color proportion from each component of RGB. One axis belongs to the red component, and the other one belongs to the green component. The blue component can be found by B = 1 - R - G.

We decided to use the [Chi-squared](https://en.wikipedia.org/wiki/Chi-squared_test) distance between two histograms, as it is quite efficient and returns a pretty good value.

Obviously, this method is not efficient as it needs to compute 1280×720 possible crops. We had to reduce the number of comparisons, sacrificing precision. The first optimization was to only look for crops near the position of the object from the last frame. We decided to only check for crops that overlapped the previous bounding box. We accomplished drastically reducing the number of comparisons, but it wasn't enough. The second optimization was about doing comparisons every certain number of pixels. For example, if we checked every 5 pixels, we would reduce the number of comparisons by 25 times. We found that we could afford to check more frequently on smaller bounding boxes, so the value of the interval is computed depending on the size.

As you can read in the report, this was the best tracking method, as it consistently tracked the object, even though sometimes the precision is not there. Also, it's the second-best method after `Recognition using Yolov8 trained by ourselves`.

### Tracking by SIFT and RANSAC

The idea of this method is to find keypoints and their descriptors using the [Harris corner detector](https://en.wikipedia.org/wiki/Harris_corner_detector) and the[Scale-invariant feature transform (SIFT)](https://en.wikipedia.org/wiki/Scale-invariant_feature_transform) from both the crop of the object and the whole frame. After the keypoints and their descriptors are extracted, points are matched by distance, and we obtain the best matching using the [Random sample consensus (RANSAC)](https://en.wikipedia.org/wiki/Random_sample_consensus).


The results of this method weren't what we expected. This was the one that performed the worst, and by quite a bit. We detected two major faults. The first one is that if the object is not detailed, we couldn't find many keypoints, leading to a low number of matchings. RANSAC needs at least 3 pairs in order to compute the best matching. In some cases, even 3 pairs weren't enough, so [RANSAC](https://en.wikipedia.org/wiki/Random_sample_consensus) could not return a matching. The other fault was if the background was detailed and weighted. The algorithm detected many points in the background, and the matching produced was always made in the starting position (the algorithm was matching the background but not the object).

### Recognition using [Yolov8](https://docs.ultralytics.com/)

We found a neural network named [Yolov8](https://docs.ultralytics.com/), that could detect several objects in an image. This network includes 80 different types of objects that can be distinguished. We just used it, but then we had the issue that we had to filter the results obtained. We manually selected the type of object to detect, and in some cases, more than one instance was recognized. Likewise, we made the decision to select the object that had the greatest confidence level.

The results of this method were pretty good, but a little lower than `Tracking by histogram comparison` and `Recognition using Yolov8 trained by ourselves`. The main issue was that there were a couple objects that the network didn't support, like `fish` and `faces`. Another issue found was not from the neural network; it was from our 'selection method' when we detected multiple instances. An example could be found in the video `Boxing2`. We had to detect a certain boxer, and even though the network recognized it, it also recognized the opponent, and with a greater confidence level.

### Recognition using [Yolov8](https://docs.ultralytics.com/) trained by ourselves

In this method, we decided to train [Yolov8](https://docs.ultralytics.com/) with our own dataset. The professor allowed us to "cheat", and add crops of the videos in order to train the network. We added 5 crops from each object to detect to our neural network, and after some failures, we got a pretty good recognition network for our videos. 

Obviously, the results were the best ones, but we have to consider that when using it in other samples, the results will not be the ones we got. This network is specifically trained to recognize objects from this dataset only.

## Getting Started

### Tracking by histogram comparison
#### 1. Install dependencies
The following dependencies are required:
- Matlab (latest version not necessary but recommended)

#### 2. Get the source code
To get the source code, you can simply download the zip file, or you can clone this repository by typing:

```bash
git clone https://github.com/BernatBC/ObjectTracker.git
```

#### 3. Launch Matlab and run code
You'll need to execute Matlab. Then you just open `tracking_nostre.mlx`, and press the Button Run. 

Make sure you have `TinyTLP` folder in the same directory as the `tracking_nostre.mlx`.

### Tracking by SIFT and RANSAC
You need to follow the same steps as `Tracking by histogram comparison`, but with the source code file `tracking_internet.mlx`.

### Recognition using [Yolov8](https://docs.ultralytics.com/)
#### 1. Install dependencies
The following dependencies are required:
- python3
- pip

After the installation of those packages, we'll install the following python packages:
```bash
pip install ultralytics
```

#### 2. Get the source code
To get the source code, you can simply download the zip file, or you can clone this repository by typing:

```bash
git clone https://github.com/BernatBC/ObjectTracker.git
```

#### 3. Run python script
From the repository directory, run the following command:

```bash
python3 reconeixament_internet.py
```
Make sure you have `TinyTLP` folder in the same directory as the `reconeixament_internet.py`.

### Recognition using [Yolov8](https://docs.ultralytics.com/) trained by ourselves
You need to follow the steps 1 and 2 from `Recognition using Yolov8`.

#### 3. Run python script
From the repository directory, run the following command:

```bash
python3 reconeixament_nostre.py
```
Make sure you have `TinyTLP` folder in the same directory as the `reconeixament_nostre.py`.

### [View Code and report on <i class="fab fa-github"></i>Github](https://github.com/bernatbc/objecttracker) 
