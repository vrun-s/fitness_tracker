const fs = require('fs')

const data = JSON.parse(fs.readFileSync('data/log.json', 'utf8'))

data.entries.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
})

let tableRows = ''

for (const entry of data.entries) {
    const workoutStatus = entry.workout.done ? '✅' : '❌'
    const calories = entry.total_calories > 0 
    ? `${entry.total_calories} / ${entry.target_calories}` 
    : '--'

    
    const dateObj = new Date(entry.date)

    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })

    tableRows += `| ${formattedDate} |      ${workoutStatus}        |     ${entry.workout.duration_min}     | ${entry.workout.type} | ${calories}  |\n`
}

const header = `| Date | Workout Status | Duration | Type | Calories |\n|------|----------------|----------|------|----------|\n`

const dashboard = `<!-- DASHBOARD_START -->
${header}${tableRows}
<!-- DASHBOARD_END -->`


const readme = fs.readFileSync('README.md', 'utf8')
const updated = readme.replace(
    /<!-- DASHBOARD_START -->[\s\S]*?<!-- DASHBOARD_END -->/,
    dashboard
)
fs.writeFileSync('README.md', updated)

console.log('README updated successfully')