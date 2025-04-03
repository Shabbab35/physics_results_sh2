function loadData() {
  const data = student_data;
  const container = document.getElementById("cardsContainer");
  container.innerHTML = ""; // مسح البطاقات السابقة إن وجدت

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

  let p1_mean = mean(period1), f_mean = mean(final);
  let p1_median = median(period1), f_median = median(final);
  let p1_mode = mode(period1), f_mode = mode(final);
  let p1_std = stddev(period1, p1_mean), f_std = stddev(final, f_mean);
  let p1_var = p1_std ** 2, f_var = f_std ** 2;

  const card1 = document.createElement("div");
  card1.className = "card";
  card1.innerHTML = `
    <h2>البطاقة 1: إحصائية مفصلة للفترتين</h2>
    <table>
      <thead>
        <tr>
          <th>المؤشر الإحصائي</th>
          <th>الفترة الأولى</th>
          <th>نهاية الفصل</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>عدد الطلاب</td><td>${period1.length}</td><td>${final.length}</td></tr>
        <tr><td>مجموع الدرجات</td><td>${period1.reduce((a,b)=>a+b,0).toFixed(2)}</td><td>${final.reduce((a,b)=>a+b,0).toFixed(2)}</td></tr>
        <tr><td>المتوسط الحسابي</td><td>${p1_mean.toFixed(2)}</td><td>${f_mean.toFixed(2)}</td></tr>
        <tr><td>الوسيط</td><td>${p1_median.toFixed(2)}</td><td>${f_median.toFixed(2)}</td></tr>
        <tr><td>المنوال</td><td>${p1_mode}</td><td>${f_mode}</td></tr>
        <tr><td>الانحراف المعياري</td><td>${p1_std.toFixed(2)}</td><td>${f_std.toFixed(2)}</td></tr>
        <tr><td>التباين</td><td>${p1_var.toFixed(2)}</td><td>${f_var.toFixed(2)}</td></tr>
      </tbody>
    </table>`;
  container.appendChild(card1);

  // === البطاقة 2: مقارنة المؤشرات كنسب مئوية مطبعة ===
  const indicators = [
    { label: "المتوسط", p1: p1_mean, f: f_mean, max: 60 },
    { label: "الوسيط", p1: p1_median, f: f_median, max: 60 },
    { label: "المنوال", p1: p1_mode, f: f_mode, max: 60 },
    { label: "الانحراف المعياري", p1: p1_std, f: f_std, max: 60 },
    { label: "التباين", p1: p1_var, f: f_var, max: 3600 }
  ];

  const p1Data = indicators.map(i => ((i.p1 / i.max) * 100).toFixed(2));
  const fData = indicators.map(i => ((i.f / (i.label === "التباين" ? 1600 : 40)) * 100).toFixed(2));
  const labels = indicators.map(i => i.label);

  const card2 = document.createElement("div");
  card2.className = "card";
  card2.innerHTML = `<h2>البطاقة 2: مقارنة المؤشرات كنسب مئوية مطبعة</h2><div id="comparisonPlot"></div>`;
  container.appendChild(card2);

  Plotly.newPlot("comparisonPlot", [
    {
      x: labels,
      y: p1Data,
      name: "الفترة الأولى",
      type: "bar",
      marker: { color: "#3498db" }
    },
    {
      x: labels,
      y: fData,
      name: "نهاية الفصل",
      type: "bar",
      marker: { color: "#e74c3c" }
    }
  ], {
    barmode: 'group',
    margin: { t: 30 },
    yaxis: {
      title: "النسبة المئوية (%)",
      ticksuffix: "%",
      range: [0, 100]
    },
    legend: {
      x: 0,
      y: 1.2,
      orientation: 'h'
    }
  });

  // === البطاقة 3: توزيع الطلاب حسب التقدير ===
  const gradeCounts = {};
  data.forEach(s => {
    const grade = s["التقدير"] || "غير محدد";
    gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
  });

  const grades = [
    "ممتاز مرتفع", "ممتاز", "جيد جدًا مرتفع", "جيد جدًا", 
    "جيد مرتفع", "جيد", "مقبول مرتفع", "مقبول", "ضعيف"
  ];
  const symbols = ["+A", "A", "+B", "B", "+C", "C", "+D", "D", "F"];
  const ranges = ["100 - 95", "94 - 90", "89 - 85", "84 - 80", "79 - 75", "74 - 70", "69 - 65", "64 - 60", "59 وأقل"];

  const card3 = document.createElement("div");
  card3.className = "card";
  card3.innerHTML = `<h2>البطاقة 3: توزيع الطلاب حسب التقدير</h2>
    <table>
      <thead>
        <tr>
          <th>التقدير</th>
          <th>الرمز</th>
          <th>النطاق</th>
          <th>عدد الطلاب</th>
          <th>النسبة</th>
        </tr>
      </thead>
      <tbody>
        ${grades.map((g, i) => {
          const count = gradeCounts[g] || 0;
          const percent = ((count / data.length) * 100).toFixed(1) + "%";
          return `
            <tr>
              <td>${g}</td>
              <td>${symbols[i]}</td>
              <td>${ranges[i]}</td>
              <td>${count}</td>
              <td>${percent}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>`;
  container.appendChild(card3);

  // === البطاقة 4: الرسم الكعكي لتوزيع الطلاب حسب التقدير (Plotly.js) ===
  const card4 = document.createElement("div");
  card4.className = "card";
  card4.innerHTML = `
    <h2>البطاقة 4: الرسم الكعكي لتوزيع الطلاب حسب التقدير</h2>
    <div id="gradeDoughnutPlot" style="height:400px;"></div>
  `;
  container.appendChild(card4);

  // تحضير البيانات للرسم الكعكي
  const doughnutLabels = [];
  const doughnutValues = [];
  const doughnutColors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f',
    '#e67e22', '#e74c3c', '#95a5a6', '#34495e'
  ];

  grades.forEach((g, i) => {
    const count = gradeCounts[g] || 0;
    if (count > 0) {
      doughnutLabels.push(g);
      doughnutValues.push(count);
    }
  });

  Plotly.newPlot('gradeDoughnutPlot', [{
    type: "pie",
    labels: doughnutLabels,
    values: doughnutValues,
    hole: 0.45,
    textinfo: "label+percent",
    marker: { colors: doughnutColors }
  }], {
    title: "نسبة توزيع الطلاب حسب التقدير",
    showlegend: true
  }, { responsive: true });

  // === البطاقة 5: جدول درجات طلاب فيزياء ١ - شعبة ٢ ===
  const card5 = document.createElement("div");
  card5.className = "card";
  card5.innerHTML = `
    <h2>البطاقة 5: جدول درجات طلاب فيزياء ١ - شعبة ٢</h2>
    <div style="overflow-x:auto">
      <table>
        <thead>
          <tr>
            <th>اسم الطالب</th>
            <th>الواجبات</th>
            <th>المشاريع</th>
            <th>النشاطات</th>
            <th>المشاركة</th>
            <th>اختبارات قصيرة تحريرية</th>
            <th>تطبيق عملي</th>
            <th>مجموع الفترة الأولى</th>
            <th>اختبار نهائي عملي</th>
            <th>اختبار نهائي تحريري</th>
            <th>مجموع نهاية الفصل</th>
            <th>المجموع الكلي</th>
            <th>التقدير</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(s => `
            <tr>
              <td>${s.student_name}</td>
              <td>${s.assignments}</td>
              <td>${s.projects}</td>
              <td>${s.activities}</td>
              <td>${s.participation}</td>
              <td>${s.short_written}</td>
              <td>${s.short_practical}</td>
              <td>${s.period1_total}</td>
              <td>${s.final_practical}</td>
              <td>${s.final_written}</td>
              <td>${(s.final_practical + s.final_written).toFixed(2)}</td>
              <td>${s.total_score}</td>
              <td>${s["التقدير"]}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
  container.appendChild(card5);


// === البطاقة 6: الفترة الأولى – مقارنة التوزيع الفعلي مع التوزيع الطبيعي (محوران) ===
const card6 = document.createElement("div");
card6.className = "card";
card6.innerHTML = `
  <h2>البطاقة 6: الفترة الأولى – مقارنة التوزيع الفعلي مع التوزيع الطبيعي</h2>
  <div id="period1DistributionChart" style="width: 100%; height: 400px;"></div>
`;
container.appendChild(card6);

// التوزيع الفعلي: عدد الطلاب في كل فئة
const actualTrace = {
  x: period1,
  type: "histogram",
  // histnorm: "count",  // القيمة الافتراضية هي count
  opacity: 0.6,
  name: "التوزيع الفعلي",
  marker: {
    color: "#3498db",
    line: {
      color: "black",
      width: 1
    }
  },
  autobinx: false,
  xbins: {
    start: 0,
    end: 60,
    size: 5
  }
};

// حساب منحنى التوزيع الطبيعي (PDF)
const normalX = [];
const normalY = [];
for (let x = 0; x <= 60; x += 1) {
  const pdf = (1 / (p1_std * Math.sqrt(2 * Math.PI))) *
              Math.exp(-Math.pow(x - p1_mean, 2) / (2 * Math.pow(p1_std, 2)));
  normalX.push(x);
  normalY.push(pdf);
}

// منحنى التوزيع الطبيعي يُرسم على المحور الثاني (yaxis2)
const normalTrace = {
  x: normalX,
  y: normalY,
  type: "scatter",
  mode: "lines",
  name: "التوزيع الطبيعي (PDF)",
  line: { color: "red", width: 2 },
  yaxis: "y2" // استخدم المحور الثاني
};

Plotly.newPlot("period1DistributionChart", [actualTrace, normalTrace], {
  barmode: "overlay",
  title: "توزيع درجات الفترة الأولى",
  xaxis: { title: "الدرجة من 60" },
  // المحور الأول (يسار) للهيستوغرام: عدد الطلاب
  yaxis: {
    title: "عدد الطلاب" 
  },
  // المحور الثاني (يمين) للمنحنى: الكثافة الاحتمالية (PDF)
  yaxis2: {
    title: "الكثافة الاحتمالية (PDF)",
    overlaying: "y",   // اجعله فوق نفس الرسم
    side: "right"      // عرضه في الجانب الأيمن
  },
  legend: { orientation: "h", x: 0.25, y: -0.2 }
});

  
  // === البطاقة 7: نهاية الفصل – مقارنة التوزيع الفعلي مع التوزيع الطبيعي ===
  const card7 = document.createElement("div");
  card7.className = "card";
  card7.innerHTML = `
    <h2>البطاقة 7: نهاية الفصل – مقارنة التوزيع الفعلي مع التوزيع الطبيعي</h2>
    <div id="finalDistributionChart" style="width: 100%; height: 400px;"></div>
  `;
  container.appendChild(card7);

  // استخدام البيانات الموجودة مسبقاً (final, f_mean, f_std)
  const finalActualTrace = {
    x: final,
    type: "histogram",
    opacity: 0.6,
    name: "التوزيع الفعلي",
    marker: { color: '#9b59b6' },
    autobinx: false,
    xbins: {
      start: 0,
      end: 40,
      size: 5
    }
  };

  const finalNormalX = [];
  const finalNormalY = [];
  for (let x = 0; x <= 40; x += 1) {
    const y = (1 / (f_std * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - f_mean, 2) / (2 * Math.pow(f_std, 2)));
    finalNormalX.push(x);
    finalNormalY.push(y * final.length * 5);
  }

  const finalNormalTrace = {
    x: finalNormalX,
    y: finalNormalY,
    type: "scatter",
    mode: "lines",
    name: "التوزيع الطبيعي",
    line: { color: 'red', width: 2 }
  };

  Plotly.newPlot("finalDistributionChart", [finalActualTrace, finalNormalTrace], {
    barmode: "overlay",
    title: "توزيع درجات نهاية الفصل",
    xaxis: { title: "الدرجة من 40" },
    yaxis: { title: "عدد الطلاب" },
    legend: { orientation: "h", x: 0.25, y: -0.2 }
  });

  // === البطاقة 8: مقارنة التوزيعين (الفترة الأولى × نهاية الفصل) ===
  const card8 = document.createElement("div");
  card8.className = "card";
  card8.innerHTML = `
    <h2>البطاقة 8: مقارنة التوزيعين - الفترة الأولى × نهاية الفصل</h2>
    <div id="comparisonDistributionChart" style="width: 100%; height: 400px;"></div>
  `;
  container.appendChild(card8);

  const p1Trace = {
    x: period1,
    type: "histogram",
    name: "الفترة الأولى",
    opacity: 0.6,
    marker: { color: "#3498db" },
    xbins: {
      start: 0,
      end: 60,
      size: 5
    }
  };

  const finalTrace = {
    x: final,
    type: "histogram",
    name: "نهاية الفصل",
    opacity: 0.6,
    marker: { color: "#e74c3c" },
    xbins: {
      start: 0,
      end: 40,
      size: 5
    }
  };

  Plotly.newPlot("comparisonDistributionChart", [p1Trace, finalTrace], {
    barmode: "overlay",
    title: "مقارنة التوزيع الفعلي للفترتين",
    xaxis: { title: "الدرجة" },
    yaxis: { title: "عدد الطلاب" },
    legend: { orientation: "h", x: 0.25, y: -0.2 }
  });

// === البطاقة 9: تفسير النتائج الإحصائية (عرض في جدول) ===
const card9 = document.createElement("div");
card9.className = "card";
card9.innerHTML = `
  <h2>البطاقة 9: تفسير النتائج الإحصائية</h2>
  <table class="card9-table">
    <thead>
      <tr>
        <th>المؤشر</th>
        <th>التفسير</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>المتوسط الحسابي</td>
        <td>
          الفترة الأولى: <strong>${p1_mean.toFixed(2)}</strong> من 60<br>
          نهاية الفصل: <strong>${f_mean.toFixed(2)}</strong> من 40
        </td>
      </tr>
      <tr>
        <td>فرق المتوسط</td>
        <td>${p1_mean > f_mean ? "تفوق في الفترة الأولى" : "تحسن في نهاية الفصل"}</td>
      </tr>
      <tr>
        <td>الانحراف المعياري</td>
        <td>
          الفترة الأولى: <strong>${p1_std.toFixed(2)}</strong><br>
          نهاية الفصل: <strong>${f_std.toFixed(2)}</strong>
        </td>
      </tr>
      <tr>
        <td>الوسيط والمنوال</td>
        <td>تعكس مدى تمركز الدرجات حول القيم المتوسطة</td>
      </tr>
      <tr>
        <td>التوزيع العام للدرجات</td>
        <td>${p1_std < 10 && f_std < 10 ? "قريب من التوزيع الطبيعي" : "بعيد عن التوزيع الطبيعي"}</td>
      </tr>
    </tbody>
  </table>
`;
container.appendChild(card9);




  // === البطاقة 10: تصنيف الطلاب حسب التقدير (جداول منفصلة) ===
  const card10 = document.createElement("div");
  card10.className = "card";
  card10.innerHTML = `<h2>البطاقة 10: تصنيف الطلاب حسب التقدير</h2>`;
  container.appendChild(card10);

  const gradeGroups = [
    { title: "ممتاز مرتفع وممتاز", grades: ["ممتاز مرتفع", "ممتاز"], color: "#2ecc71" },
    { title: "جيد جدًا مرتفع وجيد جدًا", grades: ["جيد جدًا مرتفع", "جيد جدًا"], color: "#3498db" },
    { title: "جيد مرتفع وجيد", grades: ["جيد مرتفع", "جيد"], color: "#f39c12" },
    { title: "مقبول مرتفع ومقبول", grades: ["مقبول مرتفع", "مقبول"], color: "#95a5a6" },
    { title: "ضعيف", grades: ["ضعيف"], color: "#e74c3c" }
  ];

  gradeGroups.forEach(group => {
    const studentsInGroup = data.filter(s => group.grades.includes(s["التقدير"]));
    if (studentsInGroup.length > 0) {
      const table = `
        <div class="grade-header" style="background-color: ${group.color};">
          ${group.title} (${studentsInGroup.length} طلاب)
        </div>
        <table>
          <thead><tr><th>اسم الطالب</th><th>التقدير</th><th>المجموع الكلي</th></tr></thead>
          <tbody>
            ${studentsInGroup.map(s => `<tr><td>${s.student_name}</td><td>${s["التقدير"]}</td><td>${s.total_score}</td></tr>`).join("")}
          </tbody>
        </table>
      `;
      const subCard = document.createElement("div");
      subCard.className = "card";
      subCard.innerHTML = table;
      card10.appendChild(subCard);
    }
  });

  // === البطاقة 11: الرسم الدائري لتوزيع الطلاب حسب التقدير ===
  const card11 = document.createElement("div");
  card11.className = "card";
  card11.innerHTML = `
    <h2>البطاقة 11: النسبة المئوية لتوزيع الطلاب حسب التقدير</h2>
    <div id="gradePieChart" style="height:400px;"></div>
  `;
  container.appendChild(card11);

  const orderedGrades11 = [
    "ممتاز مرتفع", "ممتاز", "جيد جدًا مرتفع", "جيد جدًا",
    "جيد مرتفع", "جيد", "مقبول مرتفع", "مقبول", "ضعيف"
  ];
  const gradeColors11 = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
    '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#34495e'
  ];

  const gradeCounts11 = {};
  data.forEach(s => {
    const grade = s["التقدير"] || "غير محدد";
    gradeCounts11[grade] = (gradeCounts11[grade] || 0) + 1;
  });

  const labels11 = [];
  const values11 = [];
  const colors11 = [];

  orderedGrades11.forEach((grade, i) => {
    const count = gradeCounts11[grade] || 0;
    if (count > 0) {
      labels11.push(grade);
      values11.push(count);
      colors11.push(gradeColors11[i]);
    }
  });

  Plotly.newPlot("gradePieChart", [{
    values: values11,
    labels: labels11,
    type: "pie",
    marker: { colors: colors11 },
    textinfo: "label+percent",
    insidetextorientation: "radial"
  }], {
    title: "توزيع الطلاب حسب التقدير (Pie Chart)",
    legend: { orientation: "h", x: 0, y: -0.2 }
  });

  // === البطاقة 12: توزيع الطلاب حسب الجنسية (كعكي) ===
  const card12 = document.createElement("div");
  card12.className = "card";
  card12.innerHTML = `
    <h2>البطاقة 12: الرسم الكعكي لتوزيع الطلاب حسب الجنسية</h2>
    <div id="nationalityChart" style="height:400px;"></div>
  `;
  container.appendChild(card12);

  let nationalityCounts = { "سعودي": 0, "غير سعودي": 0 };
  data.forEach(student => {
    const idStr = student.student_id.toString();
    if (idStr.startsWith("1")) {
      nationalityCounts["سعودي"]++;
    } else {
      nationalityCounts["غير سعودي"]++;
    }
  });

  const labels12 = Object.keys(nationalityCounts);
  const values12 = Object.values(nationalityCounts);
  const colors12 = ['#27ae60', '#c0392b'];

  Plotly.newPlot("nationalityChart", [{
    values: values12,
    labels: labels12,
    type: "pie",
    hole: 0.4,
    marker: { colors: colors12 },
    textinfo: "label+percent",
    insidetextorientation: "radial"
  }], {
    title: "توزيع الطلاب حسب الجنسية",
    legend: { orientation: "h", x: 0, y: -0.2 }
  });
}

document.addEventListener("DOMContentLoaded", loadData);
