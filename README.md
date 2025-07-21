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
 ## Screenshots



<img width="1483" height="871" alt="mainPage" src="https://github.com/user-attachments/assets/30636287-dabe-4714-916f-9e5a06eba0b4" />

<img width="1201" height="810" alt="questions2" src="https://github.com/user-attachments/assets/8c76fb01-7ccb-4dea-b0d3-dd454f6b6294" />

<img width="483" height="546" alt="participants" src="https://github.com/user-attachments/assets/4b08ccce-a39d-40cc-bc97-f1acba24a7fd" />

<img width="502" height="562" alt="kickout" src="https://github.com/user-attachments/assets/bb6ff71b-22c4-4d48-9afc-7e74a232b3fb" />

<img width="505" height="498" alt="chatbot" src="https://github.com/user-attachments/assets/560b23e5-348b-4894-b8b7-f13686564df1" />

<img width="1487" height="860" alt="results" src="https://github.com/user-attachments/assets/9dacd17f-badb-46cd-a339-d35b7fbb17b2" />

<img width="1700" height="933" alt="questiosnpage" src="https://github.com/user-attachments/assets/0424be54-d56f-4061-a148-cb9f8df95fae" />

<img width="1552" height="937" alt="screen" src="https://github.com/user-attachments/assets/0d3c7e14-1e74-4ee5-a8d6-b2fcc53653dd" />
