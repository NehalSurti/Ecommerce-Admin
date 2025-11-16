# Ecommerce Admin

A React-based admin dashboard for managing products, users, and orders in an e-commerce application. This repository contains the admin frontend built with React, Redux and Firebase utilities for image upload and auth integration.

## ✨ Features
- 📊 **Dashboard Analytics** — Reusable, dynamic charts powered by Recharts  
- 🔄 **Global state management** — Redux Toolkit + Redux Persist
- 🔐 **JWT-authentication** — Secure protected routes 
- ☁️ **Firebase image uploads** — Scalable media handling  
- 👥 **User Management** — List, edit, delete, and create users  
- 🎁 **Order Management** — Order listing and details 
- 📦 **Product Management** — Product lists, sales charts, stock/update forms  
- 🎨 **Clean Component Architecture** — Reusable widgets, charts, tables  
- 🧩 **Custom DataGrid Cells** — Avatar rendering, action buttons, status indicators  

## 🧰 Tech Stack

| Category | Technologies | Description |
|---------|--------------|-------------|
| **Frontend** | React.js | Component-driven UI layer |
| **UI Components** | Material UI, MUI Icons, MUI DataGrid | Icons, tables, responsive UI elements |
| **Charts** | Recharts | Data visualization for analytics |
| **Styling** | Plain CSS, Flexbox | Simple, scalable, no CSS frameworks |
| **Routing** | React Router DOM | Client-side navigation |
| **State** | Redux Toolkit | Global state management |
| **Backend** | Node.js / Express / MongoDB | To support CRUD operations |

## 🏗️ Architecture Overview

### 📘 High-Level System Flow
```mermaid
flowchart LR
  A[Frontend: React Admin UI] --> B[Routing / Navigation]
  B --> C[Dashboard]
  B --> D[Users Module]
  B --> E[Products Module]

  C --> C1[Charts / Widgets]
  D --> D1[User List]
  D --> D2[User Detail / Edit]
  D --> D3[Create User]

  E --> E1[Product List]
  E --> E2[Product Detail / Edit]
  E --> E3[Create Product]

  A --> F[(Future API Server)]
  F --> G[(Database)]
  
  ```

## 🎥 Demo Videos

https://github.com/user-attachments/assets/007f0af5-4826-4059-a266-95f9c329575e

https://github.com/user-attachments/assets/72eb4e50-d003-4a63-9c37-438520d3f9f0
