
const API_URL = "PASTE_YOUR_LAMBDA_FUNCTION_URL_HERE";

const form = document.getElementById("attendanceForm");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("message");
const dateInput = document.getElementById("date");

const today = new Date();
const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

document.getElementById("todayDate").textContent =
    today.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

dateInput.value = localDate;

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (
        API_URL === "PASTE_YOUR_ACTUAL_LAMBDA_FUNCTION_URL_HERE" ||
        !API_URL.startsWith("https://")
    ) {
        showMessage("Please add your actual AWS Lambda Function URL in script.js.", "error");
        return;
    }

    const attendance = {
        studentId: document.getElementById("studentId").value.trim(),
        name: document.getElementById("name").value.trim(),
        date: dateInput.value,
        status: document.getElementById("status").value
    };

    if (!attendance.studentId || !attendance.name || !attendance.date) {
        showMessage("Please complete all fields.", "error");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    message.className = "message";
    message.textContent = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attendance)
        });

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error("The server returned an unreadable response.");
        }

        if (!response.ok) {
            throw new Error(result.message || "Unable to save attendance.");
        }

        showMessage(
            `Success! Attendance saved for ${attendance.name} (${attendance.studentId}) on ${attendance.date}.`,
            "success"
        );

        form.reset();
        dateInput.value = localDate;
        document.getElementById("status").value = "Present";
        await loadAttendanceRecords();
    } catch (error) {
        console.error("Attendance submission failed:", error);
        showMessage(
            "Could not submit attendance. Check your internet connection and AWS Function URL/CORS settings, then try again.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit Attendance <span>→</span>';
    }
});

/* ===== Load Saved Attendance Records ===== */

const recordsBody = document.getElementById("recordsBody");
const recordsMessage = document.getElementById("recordsMessage");
const refreshButton = document.getElementById("refreshButton");

async function loadAttendanceRecords() {
    refreshButton.disabled = true;
    recordsMessage.textContent = "Loading attendance records...";
    recordsBody.replaceChildren();

    try {
        const response = await fetch(API_URL, {
            method: "GET"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to load attendance records."
            );
        }

        const records = result.records || [];

        if (records.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.textContent = "No attendance records found.";

            row.appendChild(cell);
            recordsBody.appendChild(row);
        } else {
            for (const record of records) {
                const row = document.createElement("tr");

                // Add student ID, name and date.
                for (const value of [
                    record.studentId,
                    record.name,
                    record.date
                ]) {
                    const cell = document.createElement("td");
                    cell.textContent = value || "";
                    row.appendChild(cell);
                }

                // Display Present or Absent as a badge.
                const statusCell = document.createElement("td");
                const badge = document.createElement("span");

                badge.className =
                    record.status === "Present"
                        ? "status-badge status-present"
                        : "status-badge status-absent";

                badge.textContent = record.status || "Unknown";

                statusCell.appendChild(badge);
                row.appendChild(statusCell);

                recordsBody.appendChild(row);
            }
        }

        recordsMessage.textContent =
            `${records.length} attendance record(s) loaded.`;

    } catch (error) {
        console.error("Unable to load records:", error);

        recordsMessage.textContent =
            "Could not load records. Check your Lambda GET handler and CORS settings.";

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "Records could not be loaded.";

        row.appendChild(cell);
        recordsBody.appendChild(row);

    } finally {
        refreshButton.disabled = false;
    }
}

// Refresh when the user clicks the button.
refreshButton.addEventListener("click", loadAttendanceRecords);

// Load records when the page opens.
loadAttendanceRecords();
