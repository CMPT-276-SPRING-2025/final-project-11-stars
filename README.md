# Project Title: BrainGoated

[![BrainGoated Status](https://img.shields.io/uptimerobot/status/m799396409-636acff0ba0f55d0904943e0?label=BrainGoated%20Status&style=flat-square)](https://stats.uptimerobot.com/I4KtZdeNvh)

---

## Project Preview

> Deployed at: [https://braingoated.netlify.app](https://braingoated.netlify.app)  

---

## Description:

**🌱BrainGoated** is an interactive educational trivia quiz platform designed for children aged 8–16, offering fun and engaging quizzes across a variety of topics and difficulty levels. It addresses the challenge of keeping young learners engaged by turning traditional study into a playful, curiosity-driven experience. Designed with accessibility in mind, it allows users to explore subjects like Science, History, and Sports by selecting quiz type (image or text), difficulty, and language—powered by The Trivia API. For deeper personalization, users can also create their own quizzes by entering a topic of their choice, with questions dynamically generated using the OpenAI API.

What makes BrainGoated stand out is its AI-powered learning layer. After each question, students receive a fun fact to deepen their understanding. They can also chat with Bud-E, the built-in AI assistant, to ask follow-up questions and explore topics at their own pace.

With support for multiple languages, dark/light mode, confetti celebrations, and mobile responsiveness, BrainGoated makes learning enjoyable whether at home or in the classroom.

---

## Key Features

- **Quiz Customization** – Users can choose from various categories (e.g., Science, History, Sports), difficulty levels (Easy, Medium, Hard), and question formats (text or image), powered by **The Trivia API**.
- **Language Selection** – Quizzes can be taken in multiple languages, made possible through **The Trivia API**'s language support.
- **Instant AI Feedback** – After each question, fun facts and explanations are automatically generated using the **OpenAI API**, helping reinforce learning.
- **Bud-E Chatbot Assistant** – A friendly, interactive chatbot powered by **OpenAI** that lets users ask follow-up questions and continue exploring the topic.
- **Responsive Design** – The app is designed to work smoothly across a variety of screen sizes for both desktop and mobile users.


---

## Tech Stack

| Layer         | Tools Used                             |
|---------------|----------------------------------------|
| Frontend      | React 19, Redux, React Router DOM      |
| Styling       | CSS                                    |
| APIs          | OpenAI, The Trivia API                 |
| API Layer     | Netlify Functions (`/netlify/functions`) |
| Utilities     | Axios, dotenv, canvas-confetti         |
| Deployment    | Netlify, Netlify CLI                   |
| Testing       | Jest, React Testing Library            |

---

## Getting Started

Follow the instructions below to run BrainGoated on your computer.

## Prerequisites

Before you begin, make sure the following tools are installed on your system:

#### 1. Code Editor

- Download and install **[Visual Studio Code](https://code.visualstudio.com/)** (recommended).
- Open it once installed — you'll use this to edit and run the project.

### System Requirements by OS

#### Windows
1. **Install Node.js**  
   - Go to: https://nodejs.org  
   - Download and install the **LTS version**

2. **Install Git**  
   - Go to: https://git-scm.com/downloads  
   - Download and install Git

3. **Verify Installations**  
   Open **Command Prompt** and run:
   ```bash
   node -v
   npm -v
   git --version
   ```
---

#### macOS
1. **Install Node.js**  
   - Go to: https://nodejs.org  
   - Download and install the **LTS version**

2. **Install Git**  
   - Download from: https://git-scm.com/downloads or use Homebrew

3. **Verify Installations**  
   Open **Terminal** and run:
   ```bash
   node -v
   npm -v
   git --version
   ```
---

#### Linux (Ubuntu/Debian)
Open **Terminal** and run:
```bash
sudo apt update
sudo apt install -y nodejs npm git
```

Verify installations:
```bash
node -v
npm -v
git --version
```

---

## Installation Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/CMPT-276-SPRING-2025/final-project-11-stars.git
cd final-project-11-stars
```

---

### 2. Install Project Dependencies
```bash
npm install
```

---

### 3. Create Environment Variables
Create a file named `.env` in the root folder and add the following:
```env
OPENAI_API_KEY=given-openai-key-here
TRIVIA_API_KEY=given-trivia-api-key-here
```
> **Note**: These keys are required to connect to OpenAI and The Trivia API. Do **not** share them publicly.

---

### 4. Run the Development Server

```bash
npm run dev
```
> This command uses `netlify dev` to serve both the React frontend and backend functions locally.
> Note: The app uses Netlify Functions and won’t work properly with `npm start`. Please use `npm run dev`.

> If successful, Netlify CLI will show:
```bash
Server now ready on http://localhost:8888
```
---

## Testing (Optional)
This project includes a basic Jest testing setup.

To run all tests once (without entering watch mode), use:
```bash
npm test -- --watchAll=false
```
This will:

- Run all available test files once.
- Exit automatically after running, without requiring keyboard input.
---

## ⚖️ License
This project is licensed under the **MIT License**.  
For educational and academic use only.

---