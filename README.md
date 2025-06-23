<!-- [https://focusflow-client.vercel.app](https://focusflow-client.vercel.app)
[https://focusflow-api.onrender.com](https://focusflow-api.onrender.com)     -->

## 📄 README: FocusFlow - AI Productivity & Eisenhower Task Manager

### 🚀 Live Demo

* Frontend: 
* Backend:

 
  
    

  

---

### 🧠 About FocusFlow

**FocusFlow** is an AI-powered productivity and distraction management application designed for students and self-learners. It allows users to organize tasks using the Eisenhower Matrix, track focus sessions, and prioritize effectively — all secured with Clerk-based authentication.

---

### 📚 Features

* 🔐 **Clerk Authentication** (User-specific tasks)
* 🧩 **Eisenhower Matrix**: Drag & drop task categorization
* ⏱️ **Focus Sessions**: Timer-based deep work sessions
* 📦 **User-Specific Storage** using MongoDB
* ⚡ Optimistic UI updates on drag
* 🎨 Tailwind CSS styled modern UI

---

### 🛠️ Tech Stack

* **Frontend**: React, Tailwind CSS, Axios, Clerk, @hello-pangea/dnd
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (with Mongoose)
* **Auth**: Clerk

---

### 🔗 Project Structure

```
├── client
│   ├── components
│   ├── pages
│   ├── utils
├── server
│   ├── models/Task.js
│   ├── routes/taskRoutes.js
│   └── index.js
```

---

### 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/focusflow.git
cd focusflow

# Start backend
cd server
npm install
npm run dev

# Start frontend
cd ../client
npm install
npm run dev
```

---

### ⚙️ API Routes

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | /api/tasks?userID=123 | Fetch user tasks     |
| POST   | /api/tasks            | Add new task         |
| PUT    | /api/tasks/\:id       | Update task quadrant |
| DELETE | /api/tasks/\:id       | Delete task          |

---

### 📃 License

MIT License


