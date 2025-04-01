// === تحميل البيانات ===
async function loadData() {
  const response = await fetch('grades_sh2_term2_with_total_and_grade.json');
  const data = await response.json();
  document.getElementById("loadingCard").style.display = "none";
  const container = document.getElementById("cardsContainer");

  // أدوات تحليل البيانات
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
    return parseFloat(Object.keys(freq).find(k => freq[k] == maxFreq));
  };
  const stddev = (arr, avg) => Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length);

  // البيانات
  const period1 = data.map(s => s["period1_total"]);
  const final = data.map(s => s["final_practical"] + s["final_written"]);
  const grades = ["ممتاز مرتفع", "ممتاز", "جيد جدًا مرتفع", "جيد جدًا", "جيد مرتفع", "جيد", "مقبول مرتفع", "مقبول", "ضعيف"];
  const gradeCounts = {};
  data.forEach(s => {
    const grade = s["التقدير"] || "غير محدد";
    gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
  });

  // === البطاقة 1 ===
  const p1_mean = mean(period1), f_mean = mean(final);
  const p1_median = median(period1), f_median = median(final);
  const p1_mode = mode(period1), f_mode = mode(final);
  const p1_std = stddev(period1, p1_mean), f_std = stddev(final, f_mean);
  const p1_var = p1_std ** 2, f_var = f_std ** 2;
  const card1 = document.createElement("div");
  card1.className = "card";
  card1.innerHTML = `
    <h2>البطاقة 1: إحصائية مفصلة للفترتين</h2>
    <table><thead><tr><th>المؤشر</th><th>الفترة الأولى</th><th>نهاية الفصل</th></tr></thead>
    <tbody>
      <tr><td>عدد الطلاب</td><td>${period1.length}</td><td>${final.length}</td></tr>
      <tr><td>مجموع الدرجات</td><td>${period1.reduce((a,b)=>a+b,0).toFixed(2)}</td><td>${final.reduce((a,b)=>a+b,0).toFixed(2)}</td></tr>
      <tr><td>المتوسط</td><td>${p1_mean.toFixed(2)}</td><td>${f_mean.toFixed(2)}</td></tr>
      <tr><td>الوسيط</td><td>${p1_median.toFixed(2)}</td><td>${f_median.toFixed(2)}</td></tr>
      <tr><td>المنوال</td><td>${p1_mode}</td><td>${f_mode}</td></tr>
      <tr><td>الانحراف المعياري</td><td>${p1_std.toFixed(2)}</td><td>${f_std.toFixed(2)}</td></tr>
      <tr><td>التباين</td><td>${p1_var.toFixed(2)}</td><td>${f_var.toFixed(2)}</td></tr>
    </tbody></table>`;
  container.appendChild(card1);

  // === البطاقة 2 ===
  const indicators = [
    { label: "المتوسط", p1: p1_mean, f: f_mean },
    { label: "الوسيط", p1: p1_median, f: f_median },
    { label: "المنوال", p1: p1_mode, f: f_mode },
    { label: "الانحراف المعياري", p1: p1_std, f: f_std },
    { label: "التباين", p1: p1_var, f: f_var }
  ];
  const maxVal = Math.max(...indicators.flatMap(i => [i.p1, i.f]));
  const labels2 = indicators.map(i => i.label);
  const p1Data = indicators.map(i => ((i.p1 / maxVal) * 100).toFixed(2));
  const fData = indicators.map(i => ((i.f / maxVal) * 100).toFixed(2));
  const card2 = document.createElement("div");
  card2.className = "card";
  card2.innerHTML = `<h2>البطاقة 2: مقارنة المؤشرات (نسب مئوية)</h2><canvas id="comparisonChart"></canvas>`;
  container.appendChild(card2);
  new Chart(document.getElementById("comparisonChart").getContext("2d"), {
    type: 'bar',
    data: {
      labels: labels2,
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
          }
        }
      }
    }
  });

  // باقي البطاقات 3 إلى 12 ... (يتم إضافتها لاحقًا بنفس التنسيق)
}
