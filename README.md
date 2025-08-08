# CollabCanvas - Real-Time Collaborative Whiteboard

![CollabCanvas Landing Page](./client/src/assets/images/collabcanvas-landingpage.png)

A full-stack, real-time collaborative whiteboard application built with the MERN stack and WebSockets. This project allows multiple users to create shared rooms, draw together instantly, and save their work.

---

## ✨ Features

-   **Real-Time Collaboration:** Drawings appear on all users' screens instantly using WebSockets.
-   **User Authentication:** Secure user registration and login system with JWT.
-   **Room-Based System:** Users can create and join unique, private rooms with shareable links.
-   **Advanced Drawing Toolkit:** Includes a pen, eraser, color picker, and brush size controls.
-   **Persistence:** Canvas state is saved to a MongoDB database and can be reloaded at any time.
-   **"Who's Online" List:** See a live list of all users currently in the room.

---

## 🛠️ Tech Stack

-   **Frontend:** React, Vite, Tailwind CSS, `lucide-react`
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB (with Mongoose)
-   **Real-Time Communication:** WebSockets (`ws` library)
-   **Authentication:** JSON Web Tokens (JWT)
-   **Containerization:** Docker, Docker Compose

---

## 🚀 Getting Started

### Prerequisites

-   Node.js
-   npm or yarn
-   Docker Desktop

### Setup and Run

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/HL2303/CollabCanvas.git](https://github.com/HL2303/CollabCanvas.git)
    cd collabCanvas
    ```

2.  **Server Setup:**
    - Create a `.env` file in the `/server` directory with your `MONGO_URI` and `JWT_SECRET`.

3.  **Run with Docker Compose:**
    - From the root directory, run:
    ```bash
    docker-compose up --build
    ```
    The application will be available at `http://localhost`.

---
