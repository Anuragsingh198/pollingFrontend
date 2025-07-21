# Live Polling System

A real-time polling application with two user roles: **Teacher** and **Student**. Built with **React**, **Express.js**, and **Socket.IO**, it supports live question broadcasting, timed responses, and instant result visualization.

 **Live Demo**: [polling-frontend-kappa.vercel.app](https://polling-frontend-kappa.vercel.app)

---

##  Teacher Features

-  Create new poll questions
-  Ask a new question only if no active question exists or all students have answered
-  View real-time poll results
-  Set a time limit for answering each question *(Good to have)*
-  Kick students from the session *(Good to have)*
-  View past poll results *(Bonus task)*

---

## Student Features

- 🧾 Enter a unique name per tab (session-scoped)
- 📝 Submit answers only when a question is active
- ⏲️ 60 seconds max to answer a question (auto-expires)
- 📊 See live results after submitting or after time expiry
- 💬 Chat with teacher (Bonus task)

---

## Tech Stack

| Layer       | Tech                 |
|-------------|----------------------|
| Frontend    | React, Context API / Redux |
| Backend     | Node.js, Express.js  |
| Real-Time   | Socket.IO            |
| Hosting     | Vercel (Frontend), railway(backend)|
| Styling     | Tailwind CSS / CSS Modules |

---
 Screenshots
Upload screenshots by dragging them here or committing them to a /screenshots folder.



