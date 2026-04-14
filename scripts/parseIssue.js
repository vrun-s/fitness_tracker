const fs = require('fs')

const issue_body = process.env.ISSUE_BODY

function extractField(body, fieldName) {
    const regex = new RegExp(`### ${fieldName}\\n\\n(.+)`)
    const match = body.match(regex)
    return match ? match[1].trim() : null
}

const workout_stat = extractField(issue_body, 'Workout done?')
const workout_duration = extractField(issue_body, 'Duration \\(minutes\\)')
const workout_type = extractField(issue_body, 'Workout type')
const workout_totalcal = extractField(issue_body, 'Total calories consumed')
const workout_targetcal = extractField(issue_body, 'Target calories')
const workout_date = extractField(issue_body, 'Date')

const entry = {
    "date": workout_date || new Date().toISOString().split('T')[0],
    "workout": {
        "done": workout_stat === "Done",
        "duration_min": parseInt(workout_duration),
        "type": workout_type 
    },
    "total_calories": parseInt(workout_totalcal),
    "target_calories": parseInt(workout_targetcal)
}

const data = JSON.parse(fs.readFileSync("./data/log.json", "utf8"))

data.entries = data.entries.filter(e => e.date !== entry.date);
data.entries.push(entry)

fs.writeFileSync(
  "data/log.json",
  JSON.stringify(data, null, 2)
);



