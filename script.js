// ملف JavaScript لتحليل النتائج وبناء البطاقات ديناميكيًا

async function loadData() {
  const response = await fetch('grades_sh2_term2_with_total_and_grade.json');
  const data = await response.json();
  document.getElementById("loadingCard").style.display = "none";
  const container = document.getElementById("cardsContainer");

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

  const p1_mean = mean(period1), f_mean = mean(final);
  const p1_median = median(period1), f_median = median(final);
  const p1_mode = mode(period1), f_mode = mode(final);
  const p1_std = stddev(period1, p1_mean), f_std = stddev(final, f_mean);
  const p1_var = p1_std ** 2, f_var = f_std ** 2;

  // سيتم بناء البطاقات هنا (1 إلى 12)
  // ... 

  // بعد إدراج البطاقات، يمكن ربطها بإدراجات الرسم والبيانات
  // مثال للبطاقة 1 تم تضمينه سابقًا، والبقية يتم إضافتها هنا تدريجيًا حسب التصميم
}

// استدعاء الدالة
loadData();

