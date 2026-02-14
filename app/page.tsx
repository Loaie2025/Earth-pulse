"use client";

import { useState } from "react";

export default function Home() {
  const [area, setArea] = useState("");
  const [trees, setTrees] = useState("");
  const [yieldPerTree, setYieldPerTree] = useState("80");
  const [pricePerKg, setPricePerKg] = useState("4");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const a = parseFloat(area);
    const t = parseFloat(trees);
    const y = parseFloat(yieldPerTree);
    const p = parseFloat(pricePerKg);

    if (!a || !t || !y || !p) return;

    const totalProduction = t * y;
    const revenue = totalProduction * p;

    const waterCostPerHectare = 3000;
    const totalWaterCost = a * waterCostPerHectare;
    const waterSaved = totalWaterCost * 0.27;

    const extraYield = revenue * 0.18;

    setResult({
      revenue,
      waterSaved,
      extraProfit: extraYield,
    });
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-12">

        {/* Trust Badge */}
        <div className="text-right mb-6">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            ✓ TRL-9 – تجربة ميدانية مثبتة
          </span>
        </div>

        <h1 className="text-4xl font-bold text-right mb-3">
          نبض أرضك يتحول إلى أرباح
        </h1>

        <p className="text-gray-600 text-right mb-4 text-lg">
          احسب العائد المتوقع + التوفير في المياه خلال أقل من دقيقة
        </p>

        <p className="text-green-600 text-right mb-10 font-medium">
          وفر حتى 27٪ من المياه وزد الإنتاج 18٪
        </p>

        {/* Calculator */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <input
            type="number"
            placeholder="المساحة بالهكتار"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border p-4 rounded-xl focus:ring-2 focus:ring-black text-right"
          />

          <input
            type="number"
            placeholder="عدد النخل"
            value={trees}
            onChange={(e) => setTrees(e.target.value)}
            className="border p-4 rounded-xl focus:ring-2 focus:ring-black text-right"
          />

          <input
            type="number"
            placeholder="إنتاجية النخلة (كجم)"
            value={yieldPerTree}
            onChange={(e) => setYieldPerTree(e.target.value)}
            className="border p-4 rounded-xl focus:ring-2 focus:ring-black text-right"
          />

          <input
            type="number"
            placeholder="سعر الكيلو (ريال)"
            value={pricePerKg}
            onChange={(e) => setPricePerKg(e.target.value)}
            className="border p-4 rounded-xl focus:ring-2 focus:ring-black text-right"
          />

        </div>

        <button
          onClick={calculate}
          className="w-full bg-black text-white text-xl py-5 rounded-2xl hover:bg-gray-800 transition mb-10"
        >
          احسب الآن
        </button>

        {/* Results */}
        {result && (
          <div className="bg-gray-900 text-white rounded-2xl p-8 mb-12">

            <h2 className="text-2xl font-bold text-center mb-6">
              النتائج المتوقعة
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-center">

              <div>
                <p className="text-gray-400">العائد السنوي</p>
                <p className="text-xl font-bold">
                  {result.revenue.toLocaleString()} ريال
                </p>
              </div>

              <div>
                <p className="text-gray-400">توفير المياه</p>
                <p className="text-xl font-bold">
                  {result.waterSaved.toLocaleString()} ريال
                </p>
              </div>

              <div>
                <p className="text-gray-400">زيادة الأرباح</p>
                <p className="text-xl font-bold">
                  {result.extraProfit.toLocaleString()} ريال
                </p>
              </div>

            </div>

            <div className="text-center mt-8">
              <a
                href="https://wa.me/966532610591"
                target="_blank"
                className="bg-green-500 px-8 py-4 rounded-xl text-lg hover:bg-green-600 transition"
              >
                احجز تقييم مجاني عبر واتساب
              </a>
            </div>

          </div>
        )}

        {/* Lead Capture */}
        <div className="border-t pt-10 mt-10">

          <h3 className="text-2xl font-bold text-right mb-6">
            اطلب دراسة تفصيلية مجانية
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="الاسم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-4 rounded-xl text-right"
            />

            <input
              type="text"
              placeholder="رقم الجوال"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-4 rounded-xl text-right"
            />

          </div>

          <button
            className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition"
          >
            إرسال الطلب
          </button>

        </div>

        {/* Investor Section */}
        <div className="mt-16 text-right">
          <h3 className="text-2xl font-bold mb-4">
            للمستثمرين والجهات
          </h3>

          <p className="text-gray-600 leading-relaxed">
            Earth Pulse يعمل في سوق زراعي ضخم في المملكة.
            تقليل استهلاك المياه ورفع الإنتاجية يخلق عائد استثماري قوي،
            مع قابلية توسع عالية على مستوى المناطق الزراعية.
          </p>

        </div>

      </div>
    </main>
  );
}
