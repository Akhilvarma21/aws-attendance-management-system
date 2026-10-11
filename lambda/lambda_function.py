
import json
import re
import boto3
from datetime import date
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("AttendanceRecords")


def response(status_code, payload):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(payload)
    }


def lambda_handler(event, context):
    method = (
        event.get("requestContext", {})
        .get("http", {})
        .get("method", "")
        .upper()
    )

    try:
        # GET: retrieve saved attendance records
        if method == "GET":
            items = []
            result = table.scan()

            items.extend(result.get("Items", []))

            while result.get("LastEvaluatedKey"):
                result = table.scan(
                    ExclusiveStartKey=result["LastEvaluatedKey"]
                )
                items.extend(result.get("Items", []))

            items.sort(
                key=lambda item: (
                    item.get("date", ""),
                    item.get("studentId", "")
                ),
                reverse=True
            )

            return response(200, {
                "records": items,
                "count": len(items)
            })

        # POST: create or update an attendance record
        if method != "POST":
            return response(405, {
                "message": "Method not allowed"
            })

        raw_body = event.get("body")

        if isinstance(raw_body, str):
            body = json.loads(raw_body)
        elif isinstance(raw_body, dict):
            body = raw_body
        else:
            return response(400, {
                "message": "A JSON request body is required"
            })

        student_id = str(body.get("studentId", "")).strip()
        name = str(body.get("name", "")).strip()
        record_date = str(body.get("date", "")).strip()
        status = str(body.get("status", "")).strip()

        if not student_id or not name or not record_date or not status:
            return response(400, {
                "message": "All fields are required"
            })

        if len(student_id) > 50 or len(name) > 100:
            return response(400, {
                "message": "Student ID or name is too long"
            })

        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", record_date):
            return response(400, {
                "message": "Date must use YYYY-MM-DD format"
            })

        try:
            date.fromisoformat(record_date)
        except ValueError:
            return response(400, {
                "message": "Invalid calendar date"
            })

        if status not in ("Present", "Absent"):
            return response(400, {
                "message": "Status must be Present or Absent"
            })

        table.put_item(
            Item={
                "studentId": student_id,
                "date": record_date,
                "name": name,
                "status": status
            }
        )

        return response(200, {
            "message": "Attendance submitted successfully",
            "studentId": student_id,
            "date": record_date,
            "status": status
        })

    except json.JSONDecodeError:
        return response(400, {
            "message": "Invalid JSON request body"
        })

    except ClientError:
        print("DynamoDB operation failed")
        return response(500, {
            "message": "Unable to process the attendance request"
        })

    except Exception:
        print("Unexpected error while processing attendance")
        return response(500, {
            "message": "An unexpected server error occurred"
        })
