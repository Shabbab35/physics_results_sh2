async function loadData() {
  const response = await fetch('grades_sh2_term2_with_total_and_grade.json');
  const data = await response.json();
  document.getElementById("loadingCard").style.display = "none";
  const container = document.getElementById("cardsContainer");

  // دوال مساعدة
  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const median = arr => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  };
  const mode = arr => {
    const freq = {};
    arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    return parseFloat(Object.keys(freq).find(k => freq[k] === maxFreq));
  };
  const stddev = (arr, avg) => Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length);

  const period1 = data.map(s => s["period1_total"]);
  const final = data.map(s => s["final_practical"] + s["final_written"]);
  const total = data.map(s => s["المجموع الكلي"]);

  const p1_mean = mean(period1), f_mean = mean(final);
  const p1_median = median(period1), f_median = median(final);
  const p1_mode = mode(period1), f_mode = mode(final);
  const p1_std = stddev(period1, p1_mean), f_std = stddev(final, f_mean);
  const p1_var = p1_std ** 2, f_var = f_std ** 2;

  // === البطاقة 1 ===
  container.appendChild(createStatsCard(period1, final, p1_mean, f_mean, p1_median, f_median, p1_mode, f_mode, p1_std, f_std, p1_var, f_var));

  // === البطاقة 2 ===
  container.appendChild(createComparisonChart(p1_mean, f_mean, p1_median, f_median, p1_mode, f_mode, p1_std, f_std, p1_var, f_var));

  // === البطاقة 3 ===
  const gradeCounts = {};
  data.forEach(s => {
    const grade = s["التقدير"] || "غير محدد";
    gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
  });
  container.appendChild(createGradeTable(gradeCounts, data.length));

  // === البطاقة 4 ===
  container.appendChild(createGradeDoughnut(gradeCounts));

// === البطاقة 5 ===
const card5 = document.createElement("div");
card5.className = "card";
card5.innerHTML = `
  <h2>البطاقة 5: مقارنة توزيع التقديرات (الرسم البياني الشريطي الأفقي)</h2>
  <canvas id="gradesBarChart"></canvas>
`;
container.appendChild(card5);

const gradeLabels5 = grades;
const gradeValues5 = gradeLabels5.map(g => gradeCounts[g] || 0);

new Chart(document.getElementById("gradesBarChart").getContext("2d"), {
  type: 'bar',
  data: {
    labels: gradeLabels5,
    datasets: [{
      label: 'عدد الطلاب',
      data: gradeValues5,
      backgroundColor: '#2980b9'
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ctx.raw + ' طالب'
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'عدد الطلاب'
        }
      }
    }
  }
});
  
