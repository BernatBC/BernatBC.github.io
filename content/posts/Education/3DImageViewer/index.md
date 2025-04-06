---
title: "3D Image Viewer"
date: 2024-07-01T06:00:23+06:00
description: 3D Image Viewer
theme: Toha
menu:
  sidebar:
    name: 3D Image Viewer
    identifier: 3dimageviewer
    parent: education
    weight: 500
draft: false
tags: ["Education", "JavaScript", "OpenSeaDragon", "ThreeJS"]
math: true
thumbnail: hero.png
---

## Introduction
This project was made for my bachelor thesis. You can take a look the full report [here](https://upcommons.upc.edu/handle/2117/411671) (note that's in catalan).                          

## Abstract

Since the arrival of the photographic camera, humans have seen the need to find a way to organize photographs. Nowadays, the ease and simplicity of taking a photograph causes large quantities of them to accumulate. The most popular photo viewers and galleries display one image after another, in a list or grid, making it difficult to organize and searching them.

One area in which they are aware of this problem is the digitization of cultural heritage. In this area, historians and professional photographers take a large number of photographs at cultural sites and monuments around the world. This area brings added difficulty. In order to preserve the details of the site of interest, the photographs taken are of high quality, requiring an efficient system for less powerful devices.

This project aims to propose a solution to facilitate the work of searching and organizing images of a place of interest in an efficient manner, such as the church of Sant Quirze de Pedret. I will study the relationship that exists between two-dimensional images and the 3D space where they were captured. Also, the relationship between physical collection spaces and three-dimensional models will be studied.

With these studies carried out, it is intended to visualize these images taking into account the 3D environment, together with 3D models of the church. The high quality of the photographs makes the fluidity of the solution an important factor to take into account, requiring important optimizations to be applied to the developed product.

## Gallery

{{< figure src="hero.png">}}
<p style="text-align: center;">An overview of the 3D environment created with ThreeJS.</p>

{{< figure src="sphere2.png">}}
<p style="text-align: center;">An overview of the image viewer created with OpenSeaDragon.</p>

## Getting Started (South Apse with full model)

### 1. Create directory structure
You'll need to create a `public` directory in the root of the project. This folder will contain the images, models and data files. The structure of this directory needs to be the following:

- public
    - images
        - low_res
        - Sant Quirze de Pedret by Zones
    - models
        - pedret
    - out-files
        - MNAC-AbsidiolaSud

### 2. Add full resolution pictures
Now, add the pictures inside `public/images/Sant Quirze de Pedret by Zones`. Inside `MNAC - South Apse` you'll find a directory called `Pictoric details and architecture`. Please place those pictures into `public/images/Sant Quirze de Pedret by Zones/MNAC - South Apse`.

### 3. Create low resolution pictures
Copy your `public/images/Sant Quirze de Pedret by Zones` into `public/images/low_res/Sant Quirze de Pedret by Zones`. Then copy `reducesize.sh` inside `public/images/low_res/Sant Quirze de Pedret by Zones/MNAC - South Apse` and run the script.

```bash
chmod +x reducesize.sh # Give execution permissions
./reducesize.sh # Run the script
```

*IMPORTANT:* This script will override the pictures, so make sure you are running the script against the files located into *low_res* directory.

### 4. Create dzi pictures
Now, install [deepzoom.py](https://github.com/openzoom/deepzoom.py) following the repo guide. After the installation is completed, please, copy `image-to-dzi.py` and `makeDZI.sh` files inside `public/images/Sant Quirze de Pedret by Zones`. Now, run `makeDZI.sh`.

```bash
chmod +x makeDZI.sh # Give execution permissions
./makeDZI.sh # Run the script
```

### 5. Place your model
Now, add your model `pedret_XII_text4K.glb` into `public/models/pedret`. In the case you have a different one, you'll need to change the model name inside `main.js`.

### 6. Place your Bundler files
Now, place your `MNAC-AbsSud-CamerasRegistration.out` inside `public/out-files/MNAC-AbsidiolaSud`. Then modify the paths of your `MNAC-AbsSud-CamerasList.lst`. To do so execute `convert_picture_list.py`. Before running it, modify the paths inside `convert_picture_list.py` to fit your needs. Place the outputted file into `public/out-files/MNAC-AbsidiolaSud`.

```bash
python3 convert_picture_list.py # Run the script
```

### Proper structure
Your `public` directory should be similar to:

- public
    - images
        - low_res
            - Sant Quirze de Pedret by Zones
                - MNAC - South Apse
                    - *.jpg (10% resolution)
        - Sant Quirze de Pedret by Zones
            - MNAC - South Apse
                - *.jpg
                - *.dzi
    - models
        - pedret
            - pedret_XII_text4K.glb
    - out-files
        - MNAC-AbsidiolaSud
            - MNAC-AbsSud-CamerasRegistration.out
            - MNAC-AbsSud-CamerasList-converted.lst

### 7. Install dependencies
Install node dependencies. Run the following command in the root of the project.

```bash
npm install
```

### 8. Run the application
Finally you'll need to start your server, running:

```bash
npx vite
```

Once it's loaded, you can open your browser and navigate to `http://localhost:5173/`. Your URL might be different, so pay attention to the `npx vite` output.

## Demo

{{< youtube 4iaSXIId2zU>}}

### [View Code on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/visualitzador-de-fotografies-en-3D) 
### [Download the report in <i class="fa-solid fa-file-pdf"></i>PDF](https://upcommons.upc.edu/handle/2117/411671) 