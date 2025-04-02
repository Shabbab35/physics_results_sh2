// script.js

function loadData() {
  const data = studentData;
  const container = document.getElementById("cardsContainer");

  // === البطاقة 1 ===
// === البطاقة 1: إحصائية مفصلة للفترتين ===
const period1 = studentData.map(s => s.period1_total);
const final = studentData.map(s => s.final_practical + s.final_written);

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
cardsContainer.appendChild(card1);

  // === البطاقة 2 ===
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

  // === البطاقة 3 ===
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

  // === البطاقة 4 === باستخدام Plotly
// === البطاقة 4: الرسم الكعكي لتوزيع الطلاب حسب التقدير (Plotly.js) ===
const card4 = document.createElement("div");
card4.className = "card";
card4.innerHTML = `
  <h2>البطاقة 4: الرسم الكعكي لتوزيع الطلاب حسب التقدير</h2>
  <div id="gradeDoughnutPlot" style="height:400px;"></div>
`;
container.appendChild(card4);

// تحضير البيانات
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

// رسم الرسم الكعكي بـ Plotly
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

  // === البطاقة 5 === جدول الدرجات
  // ... (كود البطاقة 5)

  // === البطاقة 6 === توزيع الفترة الأولى - Plotly
  // ... (كود البطاقة 6)

  // === البطاقة 7 === توزيع نهاية الفصل - Plotly
  // ... (كود البطاقة 7)

  // === البطاقة 8 === مقارنة التوزيعين - Plotly
  // ... (كود البطاقة 8)

  // === البطاقة 9 === تفسير النتائج الإحصائية
  // ... (كود البطاقة 9)

  // === البطاقة 10 === تصنيف الطلاب حسب التقدير
  // ... (كود البطاقة 10)

  // === البطاقة 11 === رسم بياني دائري للتقدير
  // ... (كود البطاقة 11)

  // === البطاقة 12 === توزيع الطلاب حسب الجنسية
  // ... (كود البطاقة 12)
}

document.addEventListener("DOMContentLoaded", loadData);
