import { calculateET0, calculateDemand } from "./water-demand";

test("ET0 is non-negative", () => {
  expect(calculateET0({ temperatureC: 30, relativeHumidityPct: 40, windSpeedMps: 3, solarRadiationMjM2Day: 20 })).toBeGreaterThanOrEqual(0);
});

test("ETc responds to Kc", () => {
  const input = { weather: { temperatureC: 30, relativeHumidityPct: 40, windSpeedMps: 3, solarRadiationMjM2Day: 20 }, soil: { moisture15cmPct: 50, moisture30cmPct: 50 }, kc: 1, rootZoneMm: 0, rainfallMm: 0, irrigationEfficiency: 0.9, dailyAppliedMm: 0, maxDailyMm: 10 };
  const a = calculateDemand(input).etcMmDay;
  const b = calculateDemand({ ...input, kc: 0.5 }).etcMmDay;
  expect(b).toBeLessThan(a);
});
