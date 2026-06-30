---
title: Agenta in its true meaning
slug: agenta-in-its-true-meaning
date: 2026-06-22
tags: AI,Agents,LangGraph,LLMs
excerpt: A deep dive into Agenta, the agent orchestrator I am currently building
new: true
---

Hey, welcome back.

This is going to be a pretty deep dive into a project that I am currently working on under the name **Agenta**.

This project is probably one of my biggest builds so far, covering almost everything I have learned over the time I have spent with my laptop.

> **Core idea:** Agenta is an agent orchestrator that moves the main agent loop into a server-side LangGraph runtime, so runs can stream live progress, save state, pause, resume, and manage context more cleanly.

---

## Architecture

![Architecture](/images/architecture-agenta.png)

The architecture is built around one simple flow:

**user goal -> frontend -> FastAPI backend -> LangGraph agent brain -> tools + persistence**

The goal is not to make the browser do all the thinking. The browser should mostly collect the goal, show the live trace, and let the backend own the actual run.

---

## Tech Stack

### Frontend

- **React + Vite** for the web interface
- **SSE client** for live run updates
- **Vercel** for frontend hosting

### Backend and Agent Framework

- **FastAPI** for the API layer
- **LangGraph** for the agent loop
- **sse-starlette** for streaming events
- **Pydantic** for typed API schemas
- **DDGS / DuckDuckGo** for free search

### Data and Persistence

- **SQLite** for run state, chat history, and checkpoints
- **Railway volume** for durable backend storage
- **Chroma / Pinecone** as possible future memory layers

---

## What It Does

So if you probably have not guessed till now, this is going to be an **agent orchestrator** focused on **server-side runtime orchestration and better memory management**.

In short, this project takes input from a user, sends it through the orchestrator, chooses the right tools, and keeps iterating over the task until the task is complete.

These tasks can be as simple as creating a file, or as complex as creating full-stack apps.

The utility and usability of this project will increase as I spend more money and burn my savings on it, and the task complexity can be increased as required.

### The important features

- **Live execution trace:** every major step is streamed back to the frontend.
- **Server-side agent loop:** the backend owns the run instead of relying on a browser tab.
- **Pause, resume, and cancel:** the user can control a running agent.
- **Tool choice per task:** the agent decides whether to reason, search, code, or conclude.
- **Optional follow-up tasks:** the agent can create more tasks if the first plan was not enough.
- **Completed-run chat:** once a run is done, the user can ask questions about the result.
- **Checkpointing:** run state can be saved and restored instead of being lost.

---

## Diving Deeper Into The Architecture

Let us take a deeper look at how the architecture works.

### 1. User Input and Frontend State

The architecture starts at the obvious top: **user input**.

Once the user enters a prompt, the frontend turns it into a goal and checks the run settings, such as language, loop count, and whether task expansion is enabled.

From there, the frontend creates a live **SSE trace**. This is what allows the user to see the run unfold step by step, while also giving them controls to **pause**, **resume**, or **cancel** the run.

### 2. FastAPI Run Layer

The input is then sent to the **FastAPI server**, which creates a run with a unique `run_id`.

This backend layer is responsible for:

- creating the initial `AgentState`
- starting or resuming the LangGraph run
- streaming run updates through SSE
- storing every important state update
- handling pause, resume, and cancel requests
- answering chat questions once the run is complete

Instead of firing random disconnected API calls, the backend treats the task as one complete **run**.

### 3. LangGraph Agent Brain

Once the request reaches the LangGraph agent brain, it moves through a small set of graph nodes. These are not external tools. They are the internal stages of the agent loop.

#### `plan`

The `plan` node looks at the goal once and creates the first task queue. This is fired at the start of every run.

#### `pick_task`

The `pick_task` node is the main distribution point. It decides which task should be handled next after planning.

This is where the agent starts moving through the task queue in the correct order.

#### `analyze`

The `analyze` node decides how the current task should be handled.

It looks at the task, thinks about what kind of action is needed, and chooses the best tool from the tool registry.

#### `execute`

The `execute` node does exactly what it sounds like: it runs the selected tool.

The important idea here is separation. The heavier thinking happens before execution, and execution can stay focused on doing the actual task.

This idea is inspired by how stronger models can be used for thinking, while lighter models can be used for direct execution.

#### `create_tasks`

The `create_tasks` node is probably the most interesting part.

It works with the existing plan and is used for one main purpose: if a task is technically marked complete, but the agent realizes the goal still needs more work, it can create an optional follow-up task.

This is what makes the run adaptive instead of being locked to the first plan forever.

#### `summarize`

The `summarize` node is the final output stage.

It takes the completed tasks, tool results, thinking, and artifacts, then turns them into the final summary that the user sees.

---

## Tool Registry and Model Layer

The graph nodes control the flow. The **tools** are the actual capabilities the agent can choose from.

Right now, the tool layer is simple and focused:

- **`reason`** for general thinking
- **`search`** for DDGS / DuckDuckGo research
- **`code`** for implementation help
- **`conclude`** for finishing a task cleanly

Each task gets analyzed before execution, so the agent can choose the tool that fits the task instead of using the same action every time.

The model layer powers reasoning, code help, summaries, and completed-run chat.

---

## Persistence and Checkpoints

The database runs on **SQLite** through a Railway volume.

The main files are:

- **`runs.sqlite`** - saves run status, `AgentState`, results, and chat messages
- **`checkpoints.sqlite`** - saves LangGraph checkpoints for restoration

This is what makes the project feel more like a real agent system and less like a one-shot prompt.

If a run pauses or needs to resume, the backend can use the stored state and checkpoints to continue from the correct point.

---

## What Comes Next

Godspeed to this tool.

I am looking forward to adding a better memory layer once I figure out how it should work. The next big goal is managing context better, because that is where agents start becoming genuinely useful instead of just being long prompt chains.
