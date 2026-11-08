# Smart Resource Allocation & Scheduling System

A web-based resource booking and scheduling system designed to help users reserve shared resources while preventing overlapping bookings.

## 🚀 Features

- User registration and login
- User dashboard
- Resource search and booking
- Conflict detection for overlapping bookings
- Booking confirmation and cancellation
- My Bookings management
- Admin dashboard
- Resource management
- View and manage bookings
- User management
- Responsive web interface
- Database storage using MySQL

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST APIs

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Git
- GitHub
- MySQL Workbench

## ⚙️ How It Works

1. Users register and log in to the system.
2. Users view available resources.
3. A user selects a resource, date, and time slot.
4. The system checks whether the selected resource is already booked.
5. If there is no time conflict, the booking is confirmed.
6. If the resource is already booked for that time, the system prevents the booking.
7. Users can view or cancel their bookings.
8. Administrators can manage resources, bookings, and users.

## 📁 Project Structure

```text
Smart-Resource-Scheduling/
│
├── backend/
│   ├── src/main/java/com/scheduler/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── user-dashboard.html
│   ├── book-resources.html
│   ├── my-bookings.html
│   ├── admin-dashboard.html
│   ├── manage-resources.html
│   ├── view-bookings.html
│   └── users.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
└── README.md
```

## 🔐 Booking Conflict Detection

The system checks the selected resource, booking date, and time range before confirming a booking.

If an overlapping booking already exists, the system rejects the new booking and displays a conflict message.

## 🎨 UI Design

The application uses a professional corporate color theme based on:

- Mocha Brown
- Champagne Gold
- Burnt Amber

The interface is designed to be responsive and user-friendly.

## ▶️ How to Run

### Backend

Open the `backend` folder in a terminal and run:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

The Spring Boot application runs on:

```text
http://localhost:8080
```

### Database

Create a MySQL database named:

```sql
CREATE DATABASE smart_scheduler;
```

Configure the MySQL username and password in:

```text
backend/src/main/resources/application.properties
```

### Frontend

Open the frontend pages using VS Code and connect them to the running Spring Boot backend.

## 🔮 Future Enhancements

- Spring Security authentication
- Password encryption
- Advanced availability calendar
- Email notifications
- Improved admin controls
- Deployment to a cloud platform
- Role-based authorization
- Reporting and analytics

## 👨‍💻 Project

**Smart Resource Allocation & Scheduling System**

Built using HTML, CSS, JavaScript, Java, Spring Boot, and MySQL.