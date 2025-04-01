
  // === البطاقة 3: توزيع الطلاب حسب التقدير ===
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

  // === البطاقة 4: الرسم الكعكي لتوزيع الطلاب حسب التقدير ===
  const card4 = document.createElement("div");
  card4.className = "card";
  card4.innerHTML = `<h2>البطاقة 4: الرسم الكعكي لتوزيع الطلاب حسب التقدير</h2><canvas id="gradeDoughnutChart"></canvas>`;
  container.appendChild(card4);

  const orderedGrades = [
    { grade: "ممتاز مرتفع", color: '#1abc9c' },
    { grade: "ممتاز", color: '#2ecc71' },
    { grade: "جيد جدًا مرتفع", color: '#3498db' },
    { grade: "جيد جدًا", color: '#9b59b6' },
    { grade: "جيد مرتفع", color: '#f1c40f' },
    { grade: "جيد", color: '#e67e22' },
    { grade: "مقبول مرتفع", color: '#e74c3c' },
    { grade: "مقبول", color: '#95a5a6' },
    { grade: "ضعيف", color: '#34495e' }
  ];

  const doughnutLabels = [], doughnutValues = [], doughnutColors = [];

  orderedGrades.forEach(({ grade, color }) => {
    const count = gradeCounts[grade] || 0;
    if (count > 0) {
      doughnutLabels.push(grade);
      doughnutValues.push(count);
      doughnutColors.push(color);
    }
  });

  const total = doughnutValues.reduce((a, b) => a + b, 0);
  const ctx4 = document.getElementById("gradeDoughnutChart").getContext("2d");

  Chart.register(ChartDataLabels);

  new Chart(ctx4, {
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
        legend: { position: 'bottom', rtl: true, labels: { textDirection: 'rtl' } },
        datalabels: {
          color: '#fff',
          font: { weight: 'bold' },
          formatter: (value, context) => {
            const percent = (value / total * 100).toFixed(1);
            return `${percent}%`;
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });

  // يتم إدراج البطاقات 5 إلى 12 لاحقًا بنفس النمط
}

// استدعاء الدالة
loadData();
