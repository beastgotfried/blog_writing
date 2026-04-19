---
title: Talking about OpenCV
date: 2026-04-18
tags: Computer Vision,OpenCV
excerpt: Diving Deep into what and how the library functions with its components!
---

## INTRODUCTION

1. OpenCV is a python library and now we will be divine into what OpenCV is and how OpenCV works and talk a little about the functions that are integrated into it by default for edge detection and template matching

2. This documentation will talk about 2 very important edge detection alogrithms used wdiely in todays world in computer vision.

---

## FLOW OF THE DOCUMENTATION

1. The flow of this documentation is going to be derived from the flow of how the initial documentation of openCV was created by the creators and will have addons and inferences that I made whilst learning this. I will also take reference from a repository with each major section of learning OpenCV highlighted into it. I will be attaching the repository for reference at the top.. now without any further delay lets get into it.

---

## PART 1 - GETTING INTO OPENCV

OpenCV works on two principles that revolve mainly around computer vision and artificial intelligence, both will work in tandem to give us our desired results. OpenCV is a very vast and easy to use language become everything is sort of compiled in a very simple manner already with easter eggs kept all around.

### Reading an Image

So the first step of using this library would definitel be importing it.. we do that by ```import cv2``` to call the library to use in the code, this will enable us to use all the functions without making anymore external inputs unlike libraries sklearn which require component-wise imports due to their vast size

Coming to how we read images in OpenCV, its literally what we speak it to be which is:

```
img=cv2.imread('image-name',color)
```

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

The thing inside '' stands for what will be displayed as the name of the new window that will be opened to display the image that we have rendered into the system

### Storing Image Data

The entire image is stored in a numpy array with colors defined for each pixel and we can adjust each color as per our will with the ```img([][])``` command where we will define new pretext sizes for the image in pixels and the array will be sliced in the necessary pattern

---

## PART 2 - DIVING INTO EDGE DETECTION

All of this is part of image processing and we will be using such edge detection methods to derive our final product. I am not going to talk about the steps before using edge detection since this blog is primarily going to be around talking about edge detection algorithms and how they work

Edge detection generally only works in images that have been converted to grayscale because when looking at rgb or bgra image styles, they generally add a lot of noise to the image due to the presence of heavy amount of gradients and color combinations which can distort image processing since edge detection only needs to differentiate between yes or no generally

### Understanding Edges in Images

Edges are generally caused by 4 main things:

1. Object Boundaries
2. Surface Orientation
3. Texture Changes
4. Lighting Variations

Now there are a lot of methods to find edges in images, and how they work but i will be focusing around the ones i am confident in and have used prior in past projects to talk about

In this documentation i will be talking about 2 major edge detection algorithms that i have learnt and a implemented which are:

1. GoodFeaturesToTrack
2. Sobel Method

---

## METHOD 1 - GOODFEATURESTOTRACK

### Explanation

So this method is exactly what it says, it looks for features in the image and tracks them, it uses the Shi-Tomasi corner detection algorithm (WHAT IS THAT??!!), dont worry its not that hard..

Shi Tomasi algorithm is basically used to find the strongest and most representable corners in an image for tracking and matching and is more reliable than almost any detection algorithm because of its ability to train itself, and the math behind it which we will dive into soon. It is commonly used in motion tracking and object recognition

***Shi-Tomasi Corner Detector =>     R = min(λ₁,λ₂)***

lets talk about it now, these values of λ are taken from the gradient co-varience matrix which is basically a matrix taken by pixels. I'll make this easier to understand

Lets say you have an image with 400 pixels in it, it will divide the image into blocks of 20 images and traverse over each block one by one, while traversing through this block it will run the coordinates of each point through a matrix. The summations of this matrix are taken around a pixel and the matrix will give us a either positive or negative value

Now the λ₁,λ₂ will be taken and if the values of them are both bigger than a threshold value that block of 20 pixels will now be considered an edge

for reference here 20 pixels is a huge amount considering the size of the image is just 400 pixels, the real block size will be much smaller and in fact the size of the block will be key towards determining the accuracy of the algorithm for detecting an edge

### Implementation

```python
import cv2
import numpy as np
import random

cap = cv2.VideoCapture(0)

while (True):
    ret, frame= cap.read()
    width = int(cap.get(3))
    height= int(cap.get(4))
    
    img = cv2.imread('Chessboard.jpg',)
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    corners = cv2.goodFeaturesToTrack(gray,100,0.01,10)  #corner detection algorithm
    corners= corners.astype(int) #converting corners to int datavalues
    
    
    for corner in corners:
        x,y = corner.ravel() #convert 3d arrays into 2d by flattening them
        cv2.circle(img,(x,y),20,(255,0,0),-1)   #draw circle from x,y taking corners as center
    
    for i in range(len(corners)):  #traversing between corners
        for j in range(i+1,len(corners)):  #traversing between missed corners so that 2 corners dont collide
            corner1=tuple(corners[i][0])   #converting corners into tuple so that data can be easily taken from
            corner2=tuple(corners[j][0])
            color= tuple(map(lambda x:int (x), np.random.randint(254,255,size=1)))   #randomise values from 0,254 and apply  int values to all of them and then convert them into a tuple becuase thats what opencv accepts
            cv2.line(img,corner1,corner2,color,3)
    
    
    cv2.imshow('output', img)
    
    
    if cv2.waitKey(1)==ord('q'):
        break
    
    
cap.release()
cv2.destroyAllWindows()
```

and that should be it.. for this algorithm, moving to the next one

---

## METHOD 2 - SOBEL METHOD

### Explanation

***Sobel Method=> G = √(Gx² + Gy²)***

this is also another method that is used for edge detection in image processing and it works by applying convulation filters that work on analysing the gradient in both horizontal and vertical directions

lets talk about how it works, this method primarily works around the same principle as shi tomasi where it will take a small section in the image and snipe a small piece inside it

it will take the small piece starting from the top left section and traverse through it creating a sliding window inside the entire image

This method works on gradient and convolution(oh this word traumatises me all thanks to NTL), lets first understand what these 2 words mean..

**Gradient** - Gradient is basically the slope of anything, lets say you are traversing in a cartesian plane, there is a point moving along x and y axis and you are trying to find the slope of that point by creating a line from (0,0). This slope is known as the gradient

How is this being used here, the gradient of each point by partially differentiating them with respect ot x and y 

I_x = ∂I/∂x,   I_y = ∂I/∂y

**Convolution Layer** - Convolution layers are basically sectioning the entire plane, so this is exactly what this method does when i was talking about sliding windows and stuff..

The convolution layer is what makes the difference in the 2 methods apart form analysing the gradient in the 2 planes

The convolution layer forms small kernels which is the boxes im talking about, it analyses the gradient of the kernel by storing the kernel into a matrix, the determinant of the matrix is then calculated in both x and y and we use simple eulers formula after there

G = √(Gx² + Gy²)

Gx = [ [-1, 0, 1],
       [-2, 0, 2],
       [-1, 0, 1] ]  (example of sample sobel kernel stored as a numpy 3d array)

Gy = [ [-1, -2, -1],
       [ 0,  0,  0],
       [ 1,  2,  1] ]

### Implementation

```python
import cv2 

img = cv2.imread('Chessboard.jpg', cv2.IMREAD_GRAYSCALE) #reading the image

sobelx = cv2.Sobel(img, cv2.CV_64F, 1, 0 ,ksize=5) #implementing sobel edge matching for x axis
sobely= cv2.Sobel(img, cv2.CV_64F, 0,1, ksize= 5) #implementing sobel edge matching for y axis
 
sobel_magnitude= cv2.magnitude(sobelx,sobely) #finding magnitude and computing gradient for x and y plane

sobel_magnitude= cv2.convertScaleAbs(sobel_magnitude) #converting back to units for readable output

cv2.imshow("Original",img)
cv2.imshow("Sobelx", cv2.convertScaleAbs(sobelx))  #converting back to units for readable output as well as printing it for x axis
cv2.imshow("Sobely", cv2.convertScaleAbs(sobely))   #converting back to units for readable output as well as printing it for y axis

cv2.waitKey(0)
cv2.destroyAllWindows()
```

---

and with this the explanation of both the methods is completed, hope you guys had an informative and fun read!!

p.s its my first writeup so forgive me for any errors.. :)