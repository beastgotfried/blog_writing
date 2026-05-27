---
title: Transformers with BLMs
date: 2026-05-27
tags: AI,LLMs,Transformers
excerpt: Exploratory analysis on transformers and BLMs
repoUrl: https://github.com/beastgotfried/gpt
---
 
# Transformers with BLMs
 
okay so this is going to be yet another documentation where we are going to talk about BLMs and Transformers and what i learnt while building a GPT
 
Lets first understand the core concept and definitions of what transformers and Bigram Language models are:
 
- **Bigram Language Models** are token based models which predict the next token based on their inference or understanding of the previous token. We will be diving deeper into this further into the documentation.
- **A Transformer** is a neural architecture that was formulated post a really famous research paper, *Attention is all you need* that was published in 2017 which talks about how we can retain attention of models and proposed various attention mechanisms which will be demonstrated in this read.
Lets now dive into the design architecture of the system step by step.
 
---
 
## Complete System Architecture
 
![Architecture](/images/architecture_final.png)
 
---
 
## Step 1: Data Ingestion & Preprocessing
 
![Step 1 Architecture](/images/step1_arch.png)
 
So like always we will be taking input of the dataset. A few interesting things will happen in this step:
 
1. Post loading the dataset we will form a set to get the non duplicated concise list of characters in the dataset. This is really important for future encoding processes.
2. We will now be tokenizing the set that we have created through `stoi` and `itos` methods. This is the method i have used there are other implementation methods of how we can encode data as well.
3. Post this we can wrap our entire dataset into a tensor with encoded int values and split the dataset like usual. In my case i split it into a **90-10 train-val split**.
---
 
## Step 2: Model Foundations
 
![Step 2 Architecture](/images/step2_arch.png)
 
Now lets walk into the actual deeper functioning of how we are going to build and preposition our data to easily walk into the neural net we will create for attention modules and feed into the language model.
 
### 2.1 Loss Evaluator
 
The loss evaluator is what will give us inference about if the model is actually doing well or learning bogus. It helps determine between overfitting and underfitting of models as well.
 
- This works by calculating the loss over x amount of iterations and giving a mean of it.
- There are various different methods to do this, one of which we will add while building the language model as well.
### 2.2 Multi Headed Neurons
 
In this we are going to iterate through the calculations of multiple single headed neurons, with the goal of building a network that can find the best possible successive token for the training made on the preceding token.
 
**Getting into the functioning & maths of it** lets consider an array `[a, b, c, d, e, f, g]`. How this neuron structure will work is it wants to create targets for itself:
 
- The letter `a` will have target `b`
- The combination `a, b` will have target `c`
- and so on and so forth
With this we will end up with a matrix of size `[B, T]`:
- **B** — batch size, which in the model i have created is 4
- **T** — time, stands for the number of elements inside one batch
> The nomination T is a subset of B where multiple tokens exist in one batch.
 
### 2.3 Feed Forward
 
- Convert matrix to `[B, T]`
- Call the ReLU activation function to constrain values from 0 to x
- Add another dropout layer
---
 
## Step 3: The Bigram Language Model
 
![Bigram](/images/bigram.png)
 
A deeper dive into the bigram model suggests that it works predicting token by token. In this case the token defined by us is a single character.
 
1. It returns the chance of each token being the next token as **logits** , these are weighted values that range from −∞ to ∞.
2. We will then apply **softmax** on these logits to get the probabilistic values of each token to predict which is the best.
> You might wonder why we don't just use the logits to predict the maximum likelihood. This is because logits are raw unweighted values output from the model and need to be tuned to a valid probabilistic scale.
 
3. Post applying softmax we will now have a matrix of size `[B, T, C]`.
The bigram language model comprises the following steps:
 
1. Create positional embedding
2. Create token embedding
3. Compute matrices of both to find the maximum likelihood
4. Apply softmax on the logits to get weights
5. Softmax output for positional and token embedding combined into one
6. Maximum likelihood decided for next token
---
 
## Step 4: Cross Entropy
 
Cross entropy felt like the most important part of this. It is the actual val loss validator throughout the model which will later be used to take inference for the optimizer as well.
 
One problem faced while implementing cross entropy is that as per the research paper that constructed the algorithm, it requires the third dimension of the matrix we have created, which is context, to actually be the second dimension. Hence:
 
- Instead of a `[B, T, C]` matrix it wants a `[B, C, T]` matrix.
- This problem can be easily solved by clubbing the batch and tokens into one component, since tokens are at the end of the day a subset of the batch we have.
- Hence we ended up creating a `[B*T, C]` matrix.
---
 
## Step 5: Self Attention
 
Lets get into a few methods of self attention that have been proposed by the research paper and perform some analysis on them.
 
### Method 1: Averaging Out Context
 
![Method 1](/images/method1.png)
 
The first method suggests averaging out context. How self attention works is that we want it to have context of the values it has already iterated through, not the values we want to iterate it to.
 
Lets consider the array `[1, 2, 3, 4, 5]`. Now consider that we have to analyse token number 4 — when predicting the value of the next token we want it to only know the information about tokens at position 1, 2, 3 and **not** position 5, since it is in the future and cannot be predicted.
 
### Method 2: Batch Matrix Multiply
 
![Method 2](/images/method2.png)
 
This method is a little more efficient than the previous one since the time complexity of the previous method is O(n²), which is higher than what we want when creating a model of this scale.
 
Whatever we are doing in the first method can be automated and made faster by converting everything into a matrix and then performing matrix multiplication on it:
 
1. Initialize a triangle matrix of size `[T, C]`, this matrix is going to be a lower triangular matrix.
2. Calculate every cell inside the matrix by running it through the bigram language model and convert it into logits.
3. On these logits we will now divide by the sum of the total values inside the batch.
4. The second matrix will be our `[B, T, C]` matrix. The multiplication will be a `[3×3] × [2,2]` matrix — but as per basic laws of maths this isn't actually possible. Hence PyTorch when we run this code will add a column of size B on its own, converting it into a `[3×3] × [3,2]` allowing for the resultant to be a `[3×2]` matrix.
### Method 3: Softmax (Used in this model)
 
![Method 3](/images/Method3.png)
 
Softmax here can do wonders while designing the self attention mechanism:
 
1. Initialize a matrix of size `[T, T]` ,this will be a zero matrix where the upper triangle of the matrix will be `-inf`.
2. This `-inf` will allow the algorithm to know that these positions are bogus and don't need values assigned to themselves.
3. These values are bogus because they are future values and are not meant to be taken into context by the model while learning, hence they don't require attention.
> In the model i have created I have used the softmax method to gain attention since it is the most efficient for larger datasets and higher batch sizes.
 
---
 
## Step 6: Optimization
 
- Use **AdamW optimizer** to optimize the learning curve of the model
- Call **cross entropy** to verify loss and eval
---
 
With this the documentation for the model comes to an end, hope this was a fun read to go through. In case of any iterations or doubts you can reach out on my discord or twitter where i am fairly active at.
 
Thank you for reading. Highlight any errors you find or any doubts you have, ill try to clear whatever i can with the knowledge i have.
