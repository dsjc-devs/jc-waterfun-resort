# Website Reservation System for John Cezar Waterfun Resort

_A full-stack MERN application that modernises bookings and internal operations for John Cezar Waterfun Resort._

---

## ✨ Project Overview

John Cezar Waterfun Resort currently relies on traditional, paper-based booking workflows. This project delivers a responsive web application that enables guests to reserve rooms online, while providing staff with an intuitive admin portal for managing reservations, rooms, and user accounts.

> **Goal** Create a seamless digital experience that benefits customers, staff, and the business by automating reservations, payments, and room availability in real time.

---

## 🚀 Features

| Module              | Key Capabilities                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| **Authentication**  | JWT login / registration, bcrypt-hashed passwords, role-based access (Master Admin, Receptionist, Staff) |
| **User Management** | CRUD endpoints, Express-Validator input checks, Azure DevOps CI/CD pipelines                             |
| **Room Management** | Create / edit room details, amenities & pricing, upload thumbnails and galleries to Cloudinary           |
| **Reservation**     | Real-time availability, date-range search, automatic conflict prevention                                 |
| **Dashboard**       | Stats & charts (occupancy, revenue), pagination & filters with Material-UI                               |
| **Notifications**   | Email confirmations via Nodemailer (with ICS attachment and Moment.js time-zone handling)                |
| **Responsive UI**   | Figma-inspired layouts, Material-UI components, dark/light mode                                          |

---

## 🛠 Tech Stack

| Layer        | Tools / Libraries                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **Frontend** | React 18, Material-UI v5, React Router 6, Axios, Formik + Yup, FullCalendar, Dropzone, Moment.js             |
| **Backend**  | Node 18, Express 4, MongoDB 6, Mongoose 7, Cloudinary SDK, Multer, bcryptjs, express-validator, jsonwebtoken |
| **Dev Ops**  | Azure DevOps Boards & Pipelines, ESLint + Prettier, Husky, Git + Conventional Commits                        |

---

## 📂 Folder Structure (monorepo)

```
root/
├── client/          # React app
│   ├── src/
│   └── ...
├── server/          # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── ...
└── README.md
```

---

## ⚙️ Environment Variables

Create **`.env`** files in both `server` and `client` (if needed). Example for **server/.env**:

```env
NODE_ENV=development
PORT=5000
API_VERSION=v1
PROJECT_NAME="JC Waterfun Resort"
MONGO_URI="mongodb+srv://<USER>:<PASSWORD>@cluster0.mi4nswc.mongodb.net/JCResort?retryWrites=true&w=majority"
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 🖥️ Local Setup

```bash
# 1. Clone the repo
$ git clone https://github.com/your-org/jc-waterfun-resort.git
$ cd jc-waterfun-resort

# 2. Install server & client dependencies
$ npm install        # root uses workspaces - optional
$ cd server && npm install
$ cd ../client && npm install

# 3. Configure environment variables (see above)

# 4. Run apps
$ npm run dev        # Runs both client and server concurrently

# Or run separately
$ cd server && npm run server     # Runs server only
$ cd client && npm run start      # Runs client only
```

The API runs at **`http://localhost:5000/api/v1`** (configurable), and the React app at **`http://localhost:3000`**.

---

## 🌐 API Reference (v1)

| Method   | Route                     | Description                         |
| -------- | ------------------------- | ----------------------------------- |
| `POST`   | `/users`                  | Create user                         |
| `GET`    | `/users`                  | List users (paginated)              |
| `GET`    | `/users/:userId`          | Get user by ID                      |
| `PATCH`  | `/users/:userId`          | Update user (partial)               |
| `DELETE` | `/users/:userId`          | Delete user                         |
| ...      | `/rooms`, `/reservations` | See full Swagger docs → `/api-docs` |

> Swagger / OpenAPI documentation is auto-generated via `swagger-jsdoc` and hosted at `/api-docs`.

---

## 🤝 Contributing

1. Fork the repo & create your branch: `git checkout -b feature/awesome`
2. Commit with Conventional Commits (`feat:`, `fix:`)
3. Push & open a Pull Request (automated CI checks will run)
4. Assign reviewers via Azure DevOps Boards.

---

## 📄 License

This project is licensed under the **MIT License** — see the `LICENSE` file for details.

---

## 📬 Contact

- **Project Lead:** Darryle Miles Bacay
- **Email:** [dmilesbacay@gmail.com](mailto:dmilesbacay@gmail.com)
- **Dev Team:**

  - Darryle Miles Bacay
  - Shannon Paul Giron
  - Christian Len Sarabia
  - Jhon Ace Sasutona

> Built with ❤️ using the Agile Systems Development Life Cycle (ASDLC).
