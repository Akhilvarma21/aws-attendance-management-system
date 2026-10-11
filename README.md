
# AttendEase — Serverless Attendance Management System

AttendEase is a cloud-based attendance management prototype built using HTML, CSS, JavaScript, Python, AWS Lambda, and Amazon DynamoDB.

## Features

- Submit attendance as Present or Absent
- Validate required fields and date formats
- Store attendance records in DynamoDB
- Retrieve saved attendance through an API
- Display attendance history in a dashboard
- Refresh saved records from the dashboard

## Architecture

```text
Frontend
HTML, CSS, JavaScript
        |
        | HTTP GET / POST
        v
AWS Lambda Function URL
        |
        | Read / Write
        v
Amazon DynamoDB
AttendanceRecords
```

## Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Python, AWS Lambda
- **Database:** Amazon DynamoDB
- **API:** AWS Lambda Function URL
- **Permissions:** AWS IAM
- **Development tools:** Visual Studio Code, Git, GitHub

## Project Structure

```text
aws-attendance-management-system/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── lambda/
│   └── lambda_function.py
├── docs/
├── screenshots/
│   ├── dashboard.png
│   ├── attendance-records.png
│   └── dynamodb-records.png
├── .gitignore
└── README.md
```

## Screenshots

### Attendance Dashboard

![AttendEase dashboard](screenshots/dashboard.png)

### Saved Attendance Records

![Saved attendance records](screenshots/attendance-records.png)

### Amazon DynamoDB Records

![DynamoDB attendance records](screenshots/dynamodb-records.png)

## How It Works

1. A user enters a student ID, name, date, and attendance status.
2. The frontend sends an HTTP POST request to the Lambda Function URL.
3. Lambda validates the submitted data.
4. Valid attendance records are stored in DynamoDB.
5. The frontend sends a GET request to retrieve saved records.
6. The dashboard displays the returned attendance data.

## Local Setup

1. Clone or download this repository.
2. Open the project in Visual Studio Code.
3. Configure an AWS Lambda Function URL in `frontend/script.js`.
4. Deploy the Lambda function and create the DynamoDB table in your AWS account.
5. Configure the required IAM permissions and Function URL CORS settings.
6. Open `frontend/index.html` using VS Code Live Server.

An AWS backend is required for attendance submission and record retrieval.

## Security Notes

This is a learning and portfolio prototype, not a production attendance system.

- The current API does not implement authentication.
- Use fictional student records only.
- Never commit AWS access keys, secret keys, credentials, or tokens.
- Do not publish a publicly accessible endpoint without reviewing its security implications.
- Configure appropriate access controls before using real student information.

## Learning Outcomes

- Building a serverless web application
- Integrating an HTTP API with AWS Lambda
- Reading and writing records in DynamoDB
- Implementing input validation and error handling
- Documenting and testing a cloud project

## Future Improvements

- User authentication and role-based access
- Attendance search and filtering
- Attendance summaries and reports
- More efficient database queries and pagination
- Infrastructure as code using Terraform
- Automated deployment workflows
