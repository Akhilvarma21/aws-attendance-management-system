
# AttendEase — Serverless Attendance Management System

A serverless attendance management prototype built with HTML, CSS, JavaScript, Python, AWS Lambda, and Amazon DynamoDB.

## Overview

AttendEase allows users to submit student attendance and view saved attendance records through a web dashboard.

## Features

- Mark students as Present or Absent
- Validate required fields and date formats
- Save attendance records in Amazon DynamoDB
- Retrieve records through an HTTP API
- View attendance history in a responsive dashboard
- Refresh the records table

## Architecture

```text
Web Dashboard
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

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, AWS Lambda |
| API | Lambda Function URL |
| Database | Amazon DynamoDB |
| Permissions | AWS IAM |
| Tools | VS Code, Git, GitHub |

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


## How It Works

1. The user enters a student ID, name, date, and attendance status.
2. The frontend sends an HTTP POST request to the Lambda Function URL.
3. Lambda validates the submitted data.
4. Valid attendance records are stored in DynamoDB.
5. The frontend sends an HTTP GET request to retrieve records.
6. The dashboard displays the returned attendance data.

## Run Your Own Deployment

This repository contains the application source code. To run it with AWS:

1. Create an Amazon DynamoDB table named `AttendanceRecords`.
2. Deploy `lambda/lambda_function.py` as an AWS Lambda function.
3. Configure the required IAM permissions for DynamoDB access.
4. Create a Lambda Function URL and configure CORS for your frontend origin.
5. Set your own Function URL in `frontend/script.js`.
6. Open `frontend/index.html` using VS Code Live Server.

The frontend requires a deployed backend to submit and retrieve records.

## Security

This is a learning and portfolio prototype, not a production attendance system.

- The demo API does not implement authentication.
- Use fictional student records only.
- Never commit AWS credentials, secret keys, tokens, or passwords.
- Review access permissions before deploying a public endpoint.
- Do not use real student information without appropriate security controls.

## What I Learned

- Building a serverless web application
- Integrating an HTTP API with AWS Lambda
- Reading and writing records in DynamoDB
- Implementing input validation and error handling
- Documenting and testing a cloud project

## Future Improvements

- Authentication and role-based access
- Attendance search and filtering
- Attendance summaries and reports
- More efficient database queries and pagination
- Infrastructure as code using Terraform
- Automated deployment workflows
