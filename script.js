// script.js

function loadData() {
  const data = studentData;
  const container = document.getElementById("cardsContainer");

  // === البطاقة 1 ===
  const period1 = data.map(s => s.period1_total);
  const final = data.map(s => s.final_practical + s.final_written);

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

  const p1_mean = mean(period1), f_mean = mean(final);
  const p1_median = median(period1), f_median = median(final);
  const p1_mode = mode(period1), f_mode = mode(final);
  const p1_std = stddev(period1, p1_mean), f_std = stddev(final, f_mean);
  const p1_var = p1_std ** 2, f_var = f_std ** 2;

  const card1 = document.createElement("div");
  card1.className = "card";
  card1.innerHTML = `
    <h2>البطاقة 1: إحصائية مفصلة للفترتين</h2>
    <table><thead><tr><th>المؤشر الإحصائي</th><th>الفترة الأولى</th><th>نهاية الفصل</th></tr></thead><tbody>
      <tr><td>عدد الطلاب</td><td>${period1.length}</td><td>${final.length}</td></tr>
      <tr><td>مجموع الدرجات</td><td>${period1.reduce((a,b)=>a+b,0).toFixed(2)}</td><td>${final.reduce((a,b)=>a+b,0).toFixed(2)}</td></tr>
      <tr><td>المتوسط الحسابي</td><td>${p1_mean.toFixed(2)}</td><td>${f_mean.toFixed(2)}</td></tr>
      <tr><td>الوسيط</td><td>${p1_median.toFixed(2)}</td><td>${f_median.toFixed(2)}</td></tr>
      <tr><td>المنوال</td><td>${p1_mode}</td><td>${f_mode}</td></tr>
      <tr><td>الانحراف المعياري</td><td>${p1_std.toFixed(2)}</td><td>${f_std.toFixed(2)}</td></tr>
      <tr><td>التباين</td><td>${p1_var.toFixed(2)}</td><td>${f_var.toFixed(2)}</td></tr>
    </tbody></table>`;
  container.appendChild(card1);

  // === البطاقة 2 ===
  const indicators = [
    { label: "المتوسط", p1: p1_mean, f: f_mean, max: 60 },
    { label: "الوسيط", p1: p1_median, f: f_median, max: 60 },
    { label: "المنوال", p1: p1_mode, f: f_mode, max: 60 },
    { label: "الانحراف المعياري", p1: p1_std, f: f_std, max: 60 },
    { label: "التباين", p1: p1_var, f: f_var, max: 3600 }
  ];

  const labels = indicators.map(i => i.label);
  const p1Data = indicators.map(i => ((i.p1 / i.max) * 100).toFixed(2));
  const fData = indicators.map(i => ((i.f / (i.label === "التباين" ? 1600 : 40)) * 100).toFixed(2));

  const card2 = document.createElement("div");
  card2.className = "card";
  card2.innerHTML = `<h2>البطاقة 2: مقارنة المؤشرات كنسب مئوية مطبعة</h2><canvas id="comparisonChart"></canvas>`;
  container.appendChild(card2);

  new Chart(document.getElementById("comparisonChart").getContext("2d"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: "الفترة الأولى", data: p1Data, backgroundColor: '#3498db' },
        { label: "نهاية الفصل", data: fData, backgroundColor: '#e74c3c' }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => ctx.dataset.label + ': ' + ctx.raw + '%'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: value => value + '%'
          },
          title: { display: true, text: 'النسبة المئوية (%)' }
        }
      }
    }
  });

  // === البطاقة 3 ===
  const gradeCounts = {};
  data.forEach(s => {
    const grade = s["التقدير"] || "غير محدد";
    gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
  });

  const grades = ["ممتاز مرتفع", "ممتاز", "جيد جدًا مرتفع", "جيد جدًا", "جيد مرتفع", "جيد", "مقبول مرتفع", "مقبول", "ضعيف"];
  const symbols = ["+A", "A", "+B", "B", "+C", "C", "+D", "D", "F"];
  const ranges = ["100 - 95", "94 - 90", "89 - 85", "84 - 80", "79 - 75", "74 - 70", "69 - 65", "64 - 60", "59 وأقل"];

  const card3 = document.createElement("div");
  card3.className = "card";
  card3.innerHTML = `<h2>البطاقة 3: توزيع الطلاب حسب التقدير</h2>
    <table><thead><tr><th>التقدير</th><th>الرمز</th><th>النطاق</th><th>عدد الطلاب</th><th>النسبة</th></tr></thead><tbody>
      ${grades.map((g, i) => {
        const count = gradeCounts[g] || 0;
        const percent = ((count / data.length) * 100).toFixed(1) + "%";
        return `<tr><td>${g}</td><td>${symbols[i]}</td><td>${ranges[i]}</td><td>${count}</td><td>${percent}</td></tr>`;
      }).join("")}
    </tbody></table>`;
  container.appendChild(card3);

  // === البطاقة 4 ===
  // === البطاقة 4 === (نسخة تعمل دون ChartDataLabels مؤقتًا)
  const card4 = document.createElement("div");
  card4.className = "card";
  card4.innerHTML = `
    <h2>البطاقة 4: الرسم الكعكي لتوزيع الطلاب حسب التقدير</h2>
    <canvas id="gradeDoughnut" width="400" height="400"></canvas>
  `;
  container.appendChild(card4);

  // تعريف البيانات يدويًا لتجريب الرسم
  const doughnutLabels = ['ممتاز مرتفع','ممتاز','جيد جدًا مرتفع','جيد جدًا','جيد مرتفع','جيد','مقبول مرتفع','مقبول','ضعيف'];
  const doughnutValues = [3, 2, 3, 2, 5, 1, 3, 2, 13]; // مؤقتًا
  const doughnutColors = [
    '#27ae60','#2ecc71','#3498db','#5dade2',
    '#f1c40f','#f7dc6f','#e67e22','#edbb99','#e74c3c'
  ];

  const total = doughnutValues.reduce((a, b) => a + b, 0);

  const gradeCtx = document.getElementById('gradeDoughnut').getContext('2d');
  new Chart(gradeCtx, {
    type: 'doughnut',
    data: {
      labels: doughnutLabels,
      datasets: [{
        data: doughnutValues,
        backgroundColor: doughnutColors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: ctx => {
              const percent = (ctx.parsed / total * 100).toFixed(1);
              return `${ctx.label}: ${ctx.parsed} طالب (${percent}%)`;
            }
          }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", loadData);


document.addEventListener("DOMContentLoaded", loadData);
