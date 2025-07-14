# Job Board Application

A full-stack job board application built for Agmo's Technical Assessment 2025. Employers can post, manage, and view job applications, while applicants can browse and apply with resumes. Built with Laravel (backend) and React (frontend), featuring RESTful APIs, user authentication, resume uploads, and email notifications.

## Features

### User Authentication

- Register as employer or applicant.
- Login with email/password.
- Password reset via email (Mailtrap).

### Employer Dashboard

- Create, update, delete jobs.
- View applicant lists with close button ("X").
- Pagination (5 jobs per page).

### Applicant Dashboard

- Browse and apply to active jobs with message and PDF resume.
- View applied jobs (all statuses).
- Pagination (5 jobs per page).
- Tooltip for input validation.

### Resume Upload

- Secure PDF uploads stored in `public/storage/resumes`.
- Accessible via unique URLs.

### RESTful API

- Stateless JWT authentication (Laravel Passport).
- Endpoints: `/api/register`, `/api/login`, `/api/forgot-password`, `/api/reset-password`, `/api/jobs`, etc.
- JSON responses with validation and error handling.

### CORS

- Handled by Laravel built-in CORS middleware (`Illuminate\Http\Middleware\HandleCors`).

## Tech Stack

- **Backend**: Laravel 10.3.3, PHP 8.1.4, MySQL, Laravel Passport
- **Frontend**: React 19.1.0, React Router 7.6.3, React Bootstrap 2.10.10, Axios
- **Tools**: XAMPP, Node.js 22.14.0, Composer 2.8.10, Postman, Git 2.48.1
- **Mail**: Mailtrap (SMTP)

## Prerequisites

- Windows 11
- XAMPP (PHP 8.1.4, MySQL)
- Node.js 22.14.0, npm 11.1.0
- Composer 2.8.10
- Git 2.48.1
- Postman
- Mailtrap account

## Setup Instructions

### Clone Repository

```bash
cd /c/xampp/htdocs
git clone https://github.com/JoniChiew/job-board.git
cd job-board
```

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
```

Edit `backend/.env`:

```env
APP_NAME=JobBoard
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=job_board
DB_USERNAME=root
DB_PASSWORD=
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=<your_mailtrap_username>
MAIL_PASSWORD=<your_mailtrap_password>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="no-reply@jobboard.com"
MAIL_FROM_NAME="Job Board"
QUEUE_CONNECTION=sync
```

Run:

```bash
php artisan key:generate
php artisan migrate
php artisan passport:install
php artisan storage:link
php artisan serve
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

### API Testing

- Import `backend/api-collection.json` into Postman.
- Test endpoints: `/api/register`, `/api/login`, `/api/forgot-password`, `/api/reset-password`, `/api/jobs`, etc.

### Verify

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: Check `job_board` tables (`users`, `jobs`, `applications`, `password_reset_tokens`).
- Mailtrap: Verify emails at https://mailtrap.io.

## Usage

### Register/Login

- Visit http://localhost:3000/register to create an account (employer or applicant).
- Login at http://localhost:3000/login.

### Employer

- Access http://localhost:3000/employer/dashboard to manage jobs and view applications.

### Applicant

- Access http://localhost:3000/applicant/dashboard to browse and apply to jobs.

### Password Reset

- Request reset at http://localhost:3000/forgot-password.
- Check Mailtrap for reset link, then reset at http://localhost:3000/reset-password.

## Project Status

### Completed

- User authentication (register, login, password reset).
- Employer job CRUD and application viewing.
- Applicant job listing and application with resume upload.
- CORS handling with Laravel built-in middleware.
- Frontend pagination (5 items per page).
- Git setup and `.env` protection.
- Postman collection (`api-collection.json`).

### Pending

- Backend unit tests.

## Contributing

This project is for evaluation purposes. Contact cpl4_kl@student.wou.edu.my for permission to use or modify the code.

## License

No license applied. For evaluation only.
