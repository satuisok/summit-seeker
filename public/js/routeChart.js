// routeChart.js
function createRouteChart(rock) {
    const ctx = document.getElementById('myChart');

    // Extract the route grades from the rock data and calculate the grade counts
    const grades = ['3', '4', '5', '5+', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c', '9a'];
    const gradeCounts = {};
    rock.routes.forEach(route => {
        const grade = route.grade;
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });

    // Define custom colors for each grade range
    const colors = grades.map(grade => {
        if (grade === '3') return '#607D8B';
        if (parseInt(grade) <= 5) return '#009688';
        if (parseInt(grade) <= 6) return '#FF9800';
        if (parseInt(grade) <= 7) return '#F44336';
        if (parseInt(grade) <= 8) return '#464162';
        return '#2B2B42';
    });



    // Your Chart.js code to update the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: grades,
            datasets: [{
                label: 'Available Routes',

                data: grades.map(grade => gradeCounts[grade] || 0),
                backgroundColor: colors, // Set the bar colors
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: 0,
                    max: 60,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
