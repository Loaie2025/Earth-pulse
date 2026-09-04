export type WeatherInput = {
  temperatureC: number;
  relativeHumidityPct: number;
  windSpeedMps: number;
  solarRadiationMjM2Day: number;
};

export type SoilInput = {
  moisture15cmPct: number;
  moisture30cmPct: number;
};

export type DemandInput = {
  weather: WeatherInput;
  soil: SoilInput;
  kc: number;
  rootZoneMm: number;
  rainfallMm: number;
  irrigationEfficiency: number;
  dailyAppliedMm: number;
  maxDailyMm: number;
  elevationM?: number;
};

const saturationVaporPressure = (t: number) =>
  0.6108 * Math.exp((17.27 * t) / (t + 237.3));

const slopeVaporPressureCurve = (t: number) => {
  const es = saturationVaporPressure(t);
  return (4098 * es) / Math.pow(t + 237.3, 2);
};

const atmosphericPressure = (elevationM = 0) =>
  101.3 * Math.pow((293 - 0.0065 * elevationM) / 293, 5.26);

export function calculateET0(weather: WeatherInput, elevationM = 0) {
  const t = weather.temperatureC;
  const rh = Math.min(100, Math.max(0, weather.relativeHumidityPct));
  const u2 = Math.max(0, weather.windSpeedMps);
  const es = saturationVaporPressure(t);
  const ea = es * (rh / 100);
  const delta = slopeVaporPressureCurve(t);
  const gamma = 0.000665 * atmosphericPressure(elevationM);
  const rn = weather.solarRadiationMjM2Day * 0.77;

  const numerator =
    0.408 * delta * rn +
    gamma * (900 / (t + 273)) * u2 * (es - ea);
  const denominator = delta + gamma * (1 + 0.34 * u2);

  return Math.max(0, numerator / denominator);
}

export function calculateDemand(input: DemandInput) {
  const et0 = calculateET0(input.weather, input.elevationM);
  const etc = Math.max(0, et0 * Math.max(0, input.kc));

  // Initial conservative model. Soil contribution must be calibrated against
  // field capacity/wilting point before production automatic irrigation.
  const averageSoilMoisture =
    (input.soil.moisture15cmPct + input.soil.moisture30cmPct) / 2;
  const soilSignal = Math.min(1, Math.max(0, (50 - averageSoilMoisture) / 30));
  const effectiveRain = Math.min(Math.max(0, input.rainfallMm), etc);
  const soilContribution =
    Math.max(0, input.rootZoneMm) * Math.min(1, Math.max(0, soilSignal));
  const efficiency = Math.min(1, Math.max(0.1, input.irrigationEfficiency));
  const netNeed = Math.max(0, etc - effectiveRain - soilContribution);
  const grossNeed = netNeed / efficiency;
  const remainingDaily = Math.max(0, input.maxDailyMm - input.dailyAppliedMm);
  const allowedNeed = Math.min(grossNeed, remainingDaily);

  let decision: "NO_IRRIGATION" | "NORMAL_IRRIGATION" | "URGENT_IRRIGATION" | "BLOCKED_BY_DAILY_LIMIT";
  if (remainingDaily <= 0 && grossNeed > 0) decision = "BLOCKED_BY_DAILY_LIMIT";
  else if (allowedNeed <= 0.5) decision = "NO_IRRIGATION";
  else if (allowedNeed <= input.maxDailyMm * 0.5) decision = "NORMAL_IRRIGATION";
  else decision = "URGENT_IRRIGATION";

  return {
    et0MmDay: Number(et0.toFixed(2)),
    etcMmDay: Number(etc.toFixed(2)),
    effectiveRainMm: Number(effectiveRain.toFixed(2)),
    soilSignal: Number(soilSignal.toFixed(2)),
    netIrrigationNeedMm: Number(grossNeed.toFixed(2)),
    allowedNeedMm: Number(allowedNeed.toFixed(2)),
    decision,
  };
}
