---
title: Basic Introduction to Workers
createTime: 2026/01/08 21:57:22
permalink: /en/tools/cloudflare/introduction/
icon: devicon:cloudflareworkers
---

Simply put, **Cloudflare Workers** is a **serverless execution environment**. It allows you to run JavaScript, Rust, C, and C++ code on Cloudflare’s global edge network (data centers in more than 300 cities worldwide).

If traditional servers are like a “central warehouse far away in a big city,” then Workers are like a “convenience store at your doorstep,” able to handle requests directly at the location closest to the user.

## Core Roles of Workers

### 1. Edge computing (handle logic closest to the user)

Traditional servers might be in North America; for users in China, requests must cross the ocean, resulting in high latency. Workers code runs on edge nodes only a few milliseconds away from users.

- **Use cases:** Display different languages based on the user’s location, redirect traffic, or optimize images based on device type.

### 2. Enhance and modify HTTP requests

Workers are like an “intelligent filter” placed between the user’s browser and the origin server.

- **Use cases:** Security: filter malicious requests and add custom firewall rules.
- **Header modification:** Automatically add security headers to pages (such as HSTS, CSP) or remove sensitive information.
- **Authentication:** Check whether a user’s token is valid before the request reaches your origin server.

### 3. Build complete APIs and microservices

Because Workers integrates with D1 (database), KV (key-value storage), and Durable Objects (state storage), you can build applications without traditional servers.

- **Use cases:** Create a simple URL shortener, a commenting system, or a real-time chat backend.

### 4. Optimize website performance

- **Use cases:** Dynamically inject scripts or content into pages without modifying the source code.
- **Custom caching strategies:** More flexible than standard CDN caching; you can use complex logic to decide what should be cached and what shouldn’t.

## What are the main uses?

- Low-latency request handling: Receive HTTP requests and return responses at edge nodes, reducing cross-region round-trip latency.
- Reverse proxy and gateway: Forward/rewrite requests and responses according to your rules (URL, Header, Cookie, Body) for canary releases, A/B testing, and dynamic routing.
- Security and risk control: Perform authentication, signature verification, rate limiting, blocking, bot detection integration, etc. before reaching the origin.
- Caching and acceleration: Fine-grained control of edge caching strategies (Cache API), custom cache keys, cache penetration protection, conditional caching.
- Authentication and sessions: Implement JWT/OAuth callback handling, SSO entry points, session validation; move auth to the edge to reduce origin load.
- Lightweight backend APIs: Provide simple API services, or aggregate multiple backends into a single interface (BFF).
- Static site enhancements: With Cloudflare Pages/static assets, do dynamic rendering fragments, rewrites, internationalization, and personalization at the edge.
- Integration with Cloudflare storage/queues: Such as KV (key-value), D1 (database), R2 (object storage), Durable Objects (stateful objects), Queues, etc., for persistence and async tasks.

## Pricing plans

| **Service Item**    | **Free Plan (Free)**                    | **Paid Plan (Paid - from $5/month)**      | **Additional Usage Billing (after quota)**   |
| ------------------- | --------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| **Base requests**   | 100,000 / day                           | **10,000,000 / month**                    | $0.30 / million requests                     |
| **CPU time**        | 10 ms / request                         | **30,000,000 ms / month**                 | $0.02 / million ms                           |
| **Workers logs**    | Unavailable / extremely limited         | **20,000,000 events (7-day retention)**   | Included in the plan                         |
| **D1 database**     | 5GB storage / 5M reads / 100k writes    | **5GB storage / 25B reads / 50M writes**  | Reads: $0.001/million; Writes: $1.00/million |
| **KV storage**      | 1GB storage / 100k reads / 1,000 writes | **1GB storage / 10M reads / 100k writes** | Reads: $0.50/million; Writes: $5.00/million  |
| **Durable Objects** | Unavailable                             | **1,000,000 requests / 40GB-s duration**  | Requests: $0.15/million; Storage: $0.20/GB   |
| **Queues**          | Unavailable                             | **1,000,000 standard operations**         | $0.40 / million operations                   |
| **AI Gateway logs** | Limited                                 | **200,000 logs stored**                   | -                                            |
| **Logpush**         | Unavailable                             | **10,000,000 Trace Events**               | $0.05 / million logs                         |