"use client";

import { useState } from "react";
import { calculateDemand } from "../lib/water-demand";

export default function Home() {
  const [area, setArea] = useState("");
  const [trees, setTrees] = useState("");
  const [yieldPerTree, setYieldPerTree] = useState("80");
  const [pricePerKg, setPricePerKg] = useState("4");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);

  const [weather, setWeather] = useState({
    temperatureC: 30,
    relativeHumidityPct: 40,
    windSpeedMps: 3,
    solarRadiationMjM2Day: 20,
  });
  const [soil, setSoil] = useState({ moisture15cmPct: 22, moisture30cmPct: 25 });
  const [kc, setKc] = useState(1.0);
  const [rainfallMm, setRainfallMm] = useState(0);

  const calculate = () => {
    const a = parseFloat(area);
    const t = parseFloat(trees);
    const y = parseFloat(yieldPerTree);
    const p = parseFloat(pricePerKg);
    if (!a || !t || !y || !p) return;

    const totalProduction = t * y;
    const revenue = totalProduction * p;
    const waterCostPerHectare = 3000;
    const waterSaved = a * waterCostPerHectare * 0.27;
    const extraYield = revenue * 0.18;

    const waterDemand = calculateDemand({
      weather,
      soil,
      kc,
      rootZoneMm: 20,
      rainfallMm,
      irrigationEfficiency: 0.9,
      dailyAppliedMm: 0,
      maxDailyMm: 10,
      elevationM: 700,
    });

    setResult({ revenue, waterSaved, extraProfit: extraYield, waterDemand });
  };

  const updateWeather = (key: keyof typeof weather, value: string) =>
    setWeather((v) => ({ ...v, [key]: Number(value) }));
  const updateSoil = (key: keyof typeof soil, value: string) =>
    setSoil((v) => ({ ...v, [key]: Number(value) }));

  return (
    <main dir="rtl" className="min-h-screen bg-gray-950 text-gray-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 md:p-12">
        <div className="text-left mb-6">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            ✓ Earth Pulse — Water Demand Intelligence
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-3">نبض أرضك يتحول إلى قرار ري ذكي</h1>
        <p className="text-gray-600 mb-4 text-lg">ET₀ + ETc + الطقس + رطوبة التربة + الذكاء الاصطناعي</p>
        <p className="text-green-600 mb-8 font-medium">27.1% توفير مياه • 18% زيادة إنتاج • تجربة ميدانية • جاهزية TRL-9 حسب بيانات المشروع المعتمدة</p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5">Water Demand Intelligence</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              ["Temperature °C", "temperatureC", weather.temperatureC],
              ["RH %", "relativeHumidityPct", weather.relativeHumidityPct],
              ["Wind m/s", "windSpeedMps", weather.windSpeedMps],
              ["Solar MJ/m²/day", "solarRadiationMjM2Day", weather.solarRadiationMjM2Day],
            ].map(([label, key, value]) => (
              <label key={String(key)} className="border rounded-xl p-3 text-sm">
                {label}
                <input className="w-full mt-2 border rounded-lg p-2" type="number" value={Number(value)} onChange={(e) => updateWeather(key as keyof typeof weather, e.target.value)} />
              </label>
            ))}
            <label className="border rounded-xl p-3 text-sm">Soil 15 cm<input className="w-full mt-2 border rounded-lg p-2" type="number" value={soil.moisture15cmPct} onChange={(e) => updateSoil("moisture15cmPct", e.target.value)} /></label>
            <label className="border rounded-xl p-3 text-sm">Soil 30 cm<input className="w-full mt-2 border rounded-lg p-2" type="number" value={soil.moisture30cmPct} onChange={(e) => updateSoil("moisture30cmPct", e.target.value)} /></label>
            <label className="border rounded-xl p-3 text-sm">Crop Kc<input className="w-full mt-2 border rounded-lg p-2" type="number" step="0.01" value={kc} onChange={(e) => setKc(Number(e.target.value))} /></label>
            <label className="border rounded-xl p-3 text-sm">Rainfall mm<input className="w-full mt-2 border rounded-lg p-2" type="number" value={rainfallMm} onChange={(e) => setRainfallMm(Number(e.target.value))} /></label>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <input type="number" placeholder="المساحة بالهكتار" value={area} onChange={(e) => setArea(e.target.value)} className="border p-4 rounded-xl" />
          <input type="number" placeholder="عدد النخل" value={trees} onChange={(e) => setTrees(e.target.value)} className="border p-4 rounded-xl" />
          <input type="number" placeholder="إنتاجية النخلة (كجم)" value={yieldPerTree} onChange={(e) => setYieldPerTree(e.target.value)} className="border p-4 rounded-xl" />
          <input type="number" placeholder="سعر الكيلو (ريال)" value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} className="border p-4 rounded-xl" />
        </section>

        <button onClick={calculate} className="w-full bg-black text-white text-xl py-5 rounded-2xl hover:bg-gray-800 transition mb-10">احسب الآن</button>

        {result && (
          <section className="space-y-6">
            <div className="bg-gray-900 text-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Water Demand Engine</h2>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <Metric label="ET₀" value={`${result.waterDemand.et0MmDay} mm/day`} />
                <Metric label="ETc" value={`${result.waterDemand.etcMmDay} mm/day`} />
                <Metric label="Net Irrigation Need" value={`${result.waterDemand.netIrrigationNeedMm} mm`} />
                <Metric label="Decision" value={result.waterDemand.decision} />
              </div>
              <div className="mt-6 text-center text-gray-300">Soil signal: {result.waterDemand.soilSignal} • Effective rain: {result.waterDemand.effectiveRainMm} mm</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-center mb-6">القيمة التجارية الحالية</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <Metric label="العائد السنوي" value={`${result.revenue.toLocaleString()} ريال`} />
                <Metric label="توفير المياه" value={`${result.waterSaved.toLocaleString()} ريال`} />
                <Metric label="زيادة الأرباح" value={`${result.extraProfit.toLocaleString()} ريال`} />
              </div>
            </div>
          </section>
        )}

        <div className="border-t pt-10 mt-10">
          <h3 className="text-2xl font-bold mb-6">اطلب دراسة تفصيلية مجانية</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} className="border p-4 rounded-xl" />
            <input type="text" placeholder="رقم الجوال" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-4 rounded-xl" />
          </div>
          <button className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl">إرسال الطلب</button>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-gray-500 text-sm mb-1">{label}</p><p className="text-xl font-bold">{value}</p></div>;
}
