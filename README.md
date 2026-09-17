# 🧠 QuizMicroService

A full-stack **quiz platform** built on a production-grade **microservice architecture** using Spring Boot, Spring Cloud, and React. Each domain concern lives in its own independently deployable service, communicating through a service registry — making the system resilient, scalable, and easy to maintain.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Microservices Deep Dive](#-microservices-deep-dive)
- [Why Microservices?](#-why-microservices)
- [Scaling Strategy](#-scaling-strategy)
- [Tech Stack](#-tech-stack)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Frontend](#-frontend)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)

---

## 🌐 Overview

QuizMicroService allows users to:

- 📝 **Create quizzes** by specifying a category, title, and number of questions
- 📋 **Fetch quiz questions** (with options, no correct answers exposed)
- ✅ **Submit answers** and instantly receive a score

The platform is divided into isolated backend services, each with its own responsibility, database table, and lifecycle — a textbook implementation of the **Single Responsibility Principle** at the service level.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Frontend                          │
│                    (Vite + React, Port 5173)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │  HTTP via Vite Dev Proxy
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Quiz-Service                              │
│                (Spring Boot REST, Port 8081)                    │
│          Handles quiz creation, question fetch & result         │
└──────────────┬──────────────────────────────┬───────────────────┘
               │  OpenFeign (HTTP)            │  Eureka Client
               │  Service-to-Service calls    │
               ▼                              ▼
┌──────────────────────────┐    ┌─────────────────────────────────┐
│    Questions-Service     │    │         Server-Service          │
│  (Spring Boot, Port 8080)│    │  (Netflix Eureka, Port 8761)    │
│  Stores & manages all    │    │  Service Registry & Discovery   │
│  questions, scoring logic│    │  Dashboard: /eureka             │
└──────────────────────────┘    └─────────────────────────────────┘
          │                                  ▲
          │ JPA / PostgreSQL                 │ register
          ▼                                  │
   ┌─────────────┐              All services register themselves
   │  PostgreSQL │              and discover each other through
   │  Database   │              Eureka — no hardcoded IPs needed
   └─────────────┘
```

### Communication Flow — Quiz Submission

```
User submits answers
      │
      ▼
React Frontend  ──POST /quiz/result──▶  Quiz-Service
                                              │
                                              │  OpenFeign call
                                              ▼
                                     Questions-Service
                                     (compares answers,
                                      returns score)
                                              │
                                              ▼
                                        Score returned
                                        to frontend
```

---

## 🔬 Microservices Deep Dive

### 1. 🖥️ Server-Service — Eureka Registry (Port 8761)

The **nerve center** of the entire system. All other services register with it on startup and query it to discover peers — no hardcoded hostnames or ports needed.

| Role | Detail |
|---|---|
| Type | Netflix Eureka Server |
| Purpose | Service registry & health dashboard |
| URL | `http://localhost:8761/eureka` |
| Spring Cloud | `2025.1.3` |

```java
@EnableEurekaServer  // one annotation turns any Spring Boot app into a registry
```

---

### 2. ❓ Questions-Service — Question Domain (Port 8080)

Owns everything related to **questions**: storing them, selecting random subsets for quizzes, serving them to Quiz-Service, and calculating scores.

| Responsibility | Endpoint |
|---|---|
| Add a question | `POST /question/addques` |
| Get all questions | `GET /question/allquestion` |
| Select N random questions by category | `POST /question/createQuiz` |
| Fetch questions by IDs | `POST /question/getques` |
| Calculate score | `POST /question/getResult` |

**Key design**: The Questions-Service is the **single source of truth** for question data and scoring logic. The Quiz-Service never touches the question database directly — it always delegates through OpenFeign.

---

### 3. 🧩 Quiz-Service — Quiz Orchestrator (Port 8081)

The **public-facing backend**. Receives requests from the frontend, orchestrates calls to Questions-Service via Feign, and stores quiz metadata.

| Responsibility | Endpoint |
|---|---|
| Create a quiz | `POST /quiz/create` |
| Get questions for a quiz | `GET /quiz/questions?id={id}` |
| Submit answers & get score | `POST /quiz/result` |

**Key design**: Quiz-Service stores only quiz metadata (title + list of question IDs). Actual question data lives exclusively in Questions-Service — perfect separation of concerns.

---

### 4. 💻 quiz-frontend — React SPA (Port 5173)

A React + Vite single-page application. Uses a Vite dev proxy to forward all `/quiz/*` requests to the Quiz-Service, avoiding CORS issues in development.

---

## ✨ Why Microservices?

This project demonstrates several core advantages of a microservice approach over a traditional monolith:

### 🔒 Fault Isolation
If the **Questions-Service** crashes, the Quiz-Service can still handle metadata operations. In a monolith, one failing module brings down the entire app.

### 🚀 Independent Deployment
Each service can be built, tested, and deployed independently. Updating the scoring algorithm in Questions-Service requires **zero downtime** for the Quiz-Service or the frontend.

### 🧰 Technology Freedom
Each service is free to evolve independently. Questions-Service could switch to MongoDB in the future without touching Quiz-Service at all. Services only care about each other's API contracts, not internals.

### 🔍 Single Responsibility
- **Questions-Service** = all question logic and scoring
- **Quiz-Service** = quiz orchestration and metadata
- **Server-Service** = service discovery

Every developer knows exactly where to look for each concern — no more sifting through a 100k-line monolith.

### 📊 Granular Observability
Each service exposes its own logs, metrics, and health endpoints. You can pinpoint exactly which service is the bottleneck without untangling shared state across the whole application.

### 🔑 Team Autonomy
Different teams can own different services. The Questions team can release updates without coordinating with the Quiz team, as long as API contracts remain stable.

---

## 📈 Scaling Strategy

The architecture is designed from the ground up to scale horizontally. Here's how each layer scales:

### Horizontal Scaling with Eureka (Zero Config)

Because services register with Eureka and are discovered by logical name (e.g., `QUESTIONS-SERVICE`), you can spin up **multiple instances** of any service and Eureka automatically load-balances across them.

```
Eureka Registry
      │
      ├── QUESTIONS-SERVICE  instance 1  (port 8080)
      ├── QUESTIONS-SERVICE  instance 2  (port 8082)  ← just start another instance
      └── QUESTIONS-SERVICE  instance 3  (port 8083)  ← and another
```

Quiz-Service's Feign client will automatically round-robin between all registered instances — **no configuration change needed**.

### Scale What's Hot, Not Everything

| Scenario | Bottleneck | Action |
|---|---|---|
| High quiz submission volume | Scoring logic | Scale **Questions-Service** only |
| High quiz creation traffic | Orchestration | Scale **Quiz-Service** only |
| Service discovery overload | Registry | Scale **Server-Service** (Eureka cluster) |
| All traffic spikes | Frontend delivery | Add CDN in front of static assets |

This targeted scaling is impossible in a monolith — you'd waste resources scaling parts you don't need.

### Adding an API Gateway (Production)

For production, add **Spring Cloud Gateway** or **Nginx** in front:

```
Internet ──▶ Nginx / Spring Cloud Gateway ──▶ Quiz-Service (N instances)
                                           └──▶ Questions-Service (N instances)
```

The gateway also provides rate limiting, SSL termination, and request routing in one place.

### Database Scaling

Each service can independently scale its database:

| Service | Strategy |
|---|---|
| **Questions-Service** | Read replicas for `GET` queries; shard `questionData` by `category` |
| **Quiz-Service** | Lightweight `quizdata` table, cache quiz metadata with Redis |

### Container Orchestration — The Production Path

```
Development              Staging              Production
─────────────────────────────────────────────────────────
Docker Compose      →   Docker Compose   →   Kubernetes
(single machine)        (single server)      (cluster)
                                                 │
                                    ┌────────────┼────────────┐
                               Questions      Quiz         Server
                               Service        Service      Service
                               (3 pods)       (2 pods)     (2 pods)
                                 │                │
                            HorizontalPod     HorizontalPod
                            Autoscaler        Autoscaler
                            (CPU > 70%)       (CPU > 70%)
```

Kubernetes `HorizontalPodAutoscaler` can automatically add/remove pods based on CPU or custom metrics — the system adapts to traffic without any manual intervention.

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 25 | Primary language |
| Spring Boot | 4.1.1 | Application framework |
| Spring Cloud | 2025.1.3 | Microservice infrastructure |
| Netflix Eureka Server | Spring Cloud | Service registry (Server-Service) |
| Netflix Eureka Client | Spring Cloud | Service self-registration |
| Spring Cloud OpenFeign | Spring Cloud | Declarative HTTP client between services |
| Spring Data JPA | Spring Boot | ORM / database abstraction |
| PostgreSQL | latest | Relational database |
| Lombok | latest | Boilerplate reduction (`@Data`, `@NoArgsConstructor`, etc.) |
| Maven | 3.x | Build & dependency management |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18+ | UI framework |
| Vite | latest | Build tool & dev server with proxy |
| JavaScript (ES6+) | — | Application logic |
| Vanilla CSS | — | Styling |
| Fetch API | — | HTTP calls to Quiz-Service |

---

## 📡 API Reference

All frontend requests go through the Vite proxy at `http://localhost:5173` → forwarded to `http://localhost:8081`.

### Quiz-Service Public Endpoints

#### `POST /quiz/create`
Create a new quiz by specifying category, title, and number of questions.

**Request Body:**
```json
{
  "title": "Java Basics",
  "category": "Java",
  "noOfQuestion": 5
}
```
**Response:** `"Success"` *(200 OK)*

---

#### `GET /quiz/questions?id={quizId}`
Fetch the questions for a given quiz. Correct answers are **never** included in the response.

**Response:**
```json
[
  {
    "id": 1,
    "questionTitle": "What is JVM?",
    "op1": "Java Virtual Machine",
    "op2": "Java Variable Method",
    "op3": "Java Verified Module",
    "op4": "Just VM"
  }
]
```

---

#### `POST /quiz/result`
Submit answers and receive a score.

**Request Body:**
```json
[
  { "id": 1, "ansSub": "Java Virtual Machine" },
  { "id": 2, "ansSub": "Inheritance" }
]
```
**Response:** `3` *(Integer — number of correct answers)*

---

### Questions-Service Endpoints (Internal / Admin)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/question/addques` | Add a new question to the bank |
| `GET` | `/question/allquestion` | Retrieve all questions |
| `POST` | `/question/createQuiz?type={cat}&noOfQues={n}` | Select N random questions by category |
| `POST` | `/question/getques` | Fetch full question details by list of IDs |
| `POST` | `/question/getResult` | Calculate and return score from submitted answers |

---

## 🗃️ Data Models

### QuestionModel (`questionData` table)

```
id              Integer   PK, auto-generated
category        String    e.g. "Java", "Python", "DSA"
questionTitle   String    The question text
difficultyLevel String    "Easy", "Medium", "Hard"
op1             String    Option 1
op2             String    Option 2
op3             String    Option 3
op4             String    Option 4
rightAnswer     String    Correct option text (never sent to frontend)
```

### QuizModel (`quizdata` table)

```
id    Long           PK, auto-generated
title String         Quiz display title
ids   List<Integer>  IDs of the questions in this quiz
```

### SubmitModel (DTO — answer submission)

```
id      Integer   Question ID
ansSub  String    User's submitted answer
```

---

## 💻 Frontend

The React SPA has four pages:

| Page | Route | Description |
|---|---|---|
| **Home** | `/` | Landing page — enter quiz ID to begin |
| **Create Quiz** | `/create` | Form to create a new quiz (title, category, count) |
| **Quiz** | `/quiz/:id` | Displays questions with radio button options |
| **Result** | `/result` | Shows final score after submission |

The Vite dev proxy (`vite.config.js`) transparently forwards `/quiz/*` to the Spring Boot Quiz-Service, eliminating CORS issues during development.

---

## 🚀 Getting Started

### Prerequisites

- Java 25+
- Maven 3.8+
- Node.js 18+ & npm
- PostgreSQL (running locally or via Docker)

### 1. Database Setup

```sql
CREATE DATABASE questionsdb;
CREATE DATABASE quizdb;
```

Configure credentials in each service's `application.properties`:

```properties
# Questions-Service
spring.datasource.url=jdbc:postgresql://localhost:5432/questionsdb
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Quiz-Service
spring.datasource.url=jdbc:postgresql://localhost:5432/quizdb
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 2. Start the Services (in this order)

```bash
# Step 1 — Start Eureka Registry FIRST
cd Server-Service && ./mvnw spring-boot:run
# Eureka Dashboard: http://localhost:8761

# Step 2 — Start Questions-Service
cd Questions-Service && ./mvnw spring-boot:run

# Step 3 — Start Quiz-Service
cd Quiz-Service && ./mvnw spring-boot:run

# Step 4 — Start the React frontend
cd quiz-frontend && npm install && npm run dev
# App: http://localhost:5173
```

### 3. Seed Some Questions

```bash
curl -X POST http://localhost:8080/question/addques \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Java",
    "questionTitle": "What does JVM stand for?",
    "difficultyLevel": "Easy",
    "op1": "Java Virtual Machine",
    "op2": "Java Variable Method",
    "op3": "Java Verified Module",
    "op4": "Just VM",
    "rightAnswer": "Java Virtual Machine"
  }'
```

### 4. Create and Take a Quiz

1. Open `http://localhost:5173`
2. Navigate to **Create Quiz** — fill in category, title & number of questions
3. Note the returned quiz ID
4. Go back to Home, enter the quiz ID and start the quiz
5. Answer the questions and submit — your score appears instantly!

---

## 📁 Project Structure

```
QuizMicroService/
│
├── Server-Service/              # Eureka Service Registry (Port 8761)
│   └── src/main/java/
│       └── ServerServiceApplication.java   (@EnableEurekaServer)
│
├── Questions-Service/           # Question domain microservice (Port 8080)
│   └── src/main/java/
│       ├── Model/
│       │   ├── QuestionModel.java          (JPA Entity — questionData table)
│       │   ├── ResponseModel.java          (DTO — options only, no rightAnswer)
│       │   └── SubmitModel.java            (DTO — user's submitted answer)
│       ├── Repository/
│       │   └── QuestionRepository.java     (Spring Data JPA)
│       ├── Service/
│       │   └── QuestionService.java        (Business logic + scoring)
│       └── QuestionController/
│           └── QuestionControl.java        (REST endpoints)
│
├── Quiz-Service/                # Quiz orchestrator microservice (Port 8081)
│   └── src/main/java/
│       ├── Model/
│       │   ├── QuizModel.java              (JPA Entity — quizdata table)
│       │   ├── DtoModel.java               (DTO — create quiz request)
│       │   ├── ResponseModel.java          (DTO — question for client)
│       │   └── SubmitModel.java            (DTO — answer submission)
│       ├── Repository/
│       │   └── QuizRepository.java         (Spring Data JPA)
│       ├── Service/
│       │   └── QuizService.java            (Orchestration via Feign)
│       ├── Controller/
│       │   └── QuizController.java         (Public REST API)
│       ├── Config/
│       │   └── CorsConfig.java             (CORS configuration)
│       └── ImpleFeign.java                 (@FeignClient → Questions-Service)
│
└── quiz-frontend/               # React + Vite SPA (Port 5173)
    └── src/
        ├── api.js                          (Fetch calls to Quiz-Service)
        ├── App.jsx                         (Router setup)
        └── pages/
            ├── HomePage.jsx
            ├── CreateQuizPage.jsx
            ├── QuizPage.jsx
            └── ResultPage.jsx
```

---

## 👤 Author

**Ashutosh** — Built with ❤️ using Spring Boot Microservices & React

---

> *"Microservices are not about making things small — they are about making things independently evolvable."*
