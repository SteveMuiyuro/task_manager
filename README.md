# 🗂️ Task Manager App

A full-stack task management web application built with **Django REST
Framework**, **PostgreSQL**, and a **Vite + React + TypeScript +
Tailwind** frontend.

## 📌 Live Demo

🔗 http://tasksmanager.duckdns.org/

## 👤 Admin Login

-   **Username:** tasksadmin
-   **Password:** Maxi2025

## 🚀 Features

-   JWT authentication\
-   Role-based access\
-   Task creation, editing, deletion\
-   Filtering/sorting\
-   Responsive UI (React + TS + Tailwind + shadcn)\
-   Backend served with Nginx + Gunicorn\
-   PostgreSQL database

## 📁 Project Structure

    TASK_MANAGER/
    ├── backend/
    │   ├── config/
    │   ├── core/
    │   ├── tasks/
    │   ├── users/
    │   ├── manage.py
    │   ├── requirements.txt
    │   └── venv/
    ├── frontend/
    │   ├── dist/
    │   ├── node_modules/
    │   ├── src/
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.ts
    └── README.md

## 🛠 Backend Setup

    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver

## 🛠 Frontend Setup

    cd frontend
    npm install
    npm run dev
    npm run build

## 🌐 Deployment

-   Gunicorn socket\
-   Nginx serving frontend & proxying backend\
-   Static build in `/frontend/dist/` copied to Nginx web root

## ⚙ Environment Variables

### Backend `.env`

    SECRET_KEY=<your_secret_key>
    DATABASE_URL=postgres://user:pass@localhost:5432/team_tasks
    DEBUG=False

### Frontend `.env`

    VITE_API_URL=http://tasksmanager.duckdns.org/api/

## 🧪 API Overview

-   `/api/auth/login/`
-   `/api/auth/register/`
-   `/api/tasks/`
-   `/api/users/`

## 🚧 Current Limitations

-   HTTPS not configured (DuckDNS DNS restrictions)

## 📄 License

For assessment/educational use.
