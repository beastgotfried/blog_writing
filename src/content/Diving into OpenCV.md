---
title: Talking about OpenCV
date: 2026-04-18
tags: Computer Vision,OpenCV
excerpt: Diving Deep into what and how the library functions with its components!
---

## INTRODUCTION

   1. OpenCV is a python library and now we will be divine into what OpenCV is and how OpenCV works and talk a little about the functions that are integrated into it by default for edge detection and template matching

   2. This documentation will spam vast from moving into computer vision and end with how we can integrate other tools like mediapipe along with OpenCV into making it deeper into computer vision and hopefully creating something that can be of utility to someone

---

## FLOW OF THE DOCUMENTATION

   1. The flow of this documentation is going to be derived from the flow of how the initial documentation of openCV was created by the creators and will have addons and inferences that I made whilst learning this. I will also take reference from a repository with each major section of learning OpenCV highlighted into it. I will be attaching the repository for reference at the top.. now without any further delay lets get into it.

---

## PART 1 - GETTING INTO OPENCV

   OpenCV works on two principles that revolve mainly around computer vision and artificial intelligence, both will work in tandem to give us our desired results. OpenCV is a very vast and easy to use language become everything is sort of compiled in a very simple manner already with easter eggs kept all around.

### Reading an Image

   So the first step of using this library would definitel be importing it.. we do that by ```import cv2``` to call the library to use in the code, this will enable us to use all the functions without making anymore external inputs unlike libraries sklearn which require component-wise imports due to their vast size

   Coming to how we read images in OpenCV, its literally what we speak it to be which is
```img=cv2.imread('image-name',color)```

   So now, lets talk about the components of this, while importing an image we can do 2 things.

   1. Define the image we are importing by storing them in a local folder and providing the realtive path to the image
   2. Define the color scale of the image and the color grading of the image to be saved in.

   In OpenCV we can define how an image can be read which would be in 3 major methods revolving around BGR, HSL and RGBA. 

   All these have their own utility which we will come to later but for now:
   - **BGR** = default reading style
   - **HSL** = used for major functions in template matching
   - **RGBA** = used for some smaller functions and playing with the display of the image due to 4 available features to play with

   We can also play with an image once we have rendered it in, by rotating it

### Displaying an Image

   Displaying an image is as simple as reading it by simply being ```cv2.imshow('name on top left', img_name)```

   The thing inside '' stands for what will be displayed as the na eof the new window that will be opened to display the image that we have rendered into the system

### Storing Image Data

   The entire image is stored in a numpy array with colors defined for each pixel and we can adjust each color as per our will with the ```img([][])``` command where we will define new pretext sizes for the image in pixels and the array will be sliced in the necessary pattern
```