---
title: Agenta in its true meaning
slug: agenta-in-its-true-meaning
date: 2026-06-22
tags: AI,Agents,LangGraph,LLMs
excerpt: A pretty deep dive into agenta, the agent orchestrator I am currently building
new: true
---

Hey!, welcome back

So this is going to be a pretty deep dive into a project which i am currently working on under the name agenta

this project is a probably one of my biggest projects covering everything i have learnt over the period of time i have spent with my laptop

---

## Architecture

![Architecture](/images/architecture-agenta.png)

---

## Techstack

**Frontend:**

- Next.js
- SSE Clients

**Frameworks:**

- Langgraph
- DDGS Api
- FastAPI
- starlette
- pydantic

**DBS:**

- SQLite
- Chroma/Pinecone

---

## What it does

So if you probably havent guessed till now this is going to be an **agent orchestrator**

In short what this project is supposed to do is to take input from a user, use the tools provided channeled by the orchestrator and use them to iterate over the task until the task is complete

These tasks can be as simple as creating a file to as complex as creating full stacks apps

The utility and usabilitiy of this project will increase as i spend more money and burn my saving onto it, and the task complexity can be increased as required

---

## Diving deeper into the architecture

Lets dive deeper into the architecture now,
The user fires a prompt, based on this prompt a goal is assigned to the system.

now the user is considered void and only the goal is what matters, the goal is now split into two different probably structures

One structure is going to create an autonomous agent loop where the agent will work on completing the task, and the second loop is going to constantly save the memory into a db to create context on the user and understand them

the thinking is then going to be fired to 6 fastapi flags being `/start`, `/analyse`, `/create`, `/execute`, `/summarize`, `/chat`

They are all going to be fired at the requirements of the llm orchestrator through langgraph which is going to use these as required and as necessary. In the current scope of the project im going to resort to `llama-3.3-70b-versatile` for analyze, `llama-3.1-8b-instant` for execute

Going to migrate to OpenAI once testing is complete, lets see how that goes

This project is adapted from agent make which is a typescript based package,
One big change that i made all the thinking and running the agent loop in a closed sandbox on a remote server, currently wired through railway. will shift to ec2 instances once i have the required resources for it

will keep this place updated as i go by

---

## Current status

Current status of this project would be mapped to creating a shell for the tools to live in, creating a sandbox agent with no tool calls yet

```
Plan -> pick task -> analyse -> execute -> creating tasks -> summarize
```

More work on the backend soon

CHEERS!
