// 'use client';
import  { useEffect, useMemo, useRef, useState } from 'react';
import { IoNotificationsOutline, IoVolumeHighOutline, IoCheckmarkCircle } from 'react-icons/io5';

// ======= Configuración de Mercados =======
// Si quieres cambiar horarios, edítalos aquí (hora:minuto en horario local del mercado).
type MarketKey = 'london' | 'frankfurt' | 'tokyo' | 'hongkong' | 'sydney' | 'newyork';
type MarketConfig = {
  key: MarketKey;
  label: string;
  emoji: string;           // Flag emoji for visual identification
  timezone: string;        // IANA TZ
  openHour: number;        // local hour (0-23)
  openMinute: number;      // local minute (0-59)
};
const MARKETS: MarketConfig[] = [
  { key: 'newyork',   label: 'New York',  emoji: '🇺🇸', timezone: 'America/New_York',  openHour: 9,  openMinute: 30 },
  { key: 'london',    label: 'London',    emoji: '🇬🇧', timezone: 'Europe/London',     openHour: 8,  openMinute: 0 },
  { key: 'tokyo',     label: 'Tokyo',     emoji: '🇯🇵', timezone: 'Asia/Tokyo',        openHour: 9,  openMinute: 0 },
  { key: 'sydney',    label: 'Sydney',    emoji: '🇦🇺', timezone: 'Australia/Sydney',  openHour: 10, openMinute: 0 },
  { key: 'frankfurt', label: 'Frankfurt', emoji: '🇩🇪', timezone: 'Europe/Berlin',     openHour: 9,  openMinute: 0 },
  { key: 'hongkong',  label: 'Hong Kong', emoji: '🇭🇰', timezone: 'Asia/Hong_Kong',    openHour: 9,  openMinute: 30 },
];

// ======= Sonido por defecto (campanilla suave, WAV) =======
// Puedes reemplazar por tu URL (mp3/wav/ogg) en el prop `soundUrl`.
const DEFAULT_CHIME_BASE64 ="../assets/data/bell-sound.mp3"
// ======= Helpers de tiempo =======
const isBusinessDayInTZ = (tz: string, d = new Date()) => {
  // Construimos fecha en tz y miramos su día de la semana
  const local = new Date(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(d)
  );
  const dow = local.getDay(); // 0=Sun,6=Sat
  return dow >= 1 && dow <= 5;
};

const nextBusinessDayInTZ = (tz: string, from = new Date()) => {
  let n = 0;
  while (n < 7) {
    const d = new Date(from.getTime() + n * 24 * 60 * 60 * 1000);
    if (isBusinessDayInTZ(tz, d)) return d;
    n++;
  }
  return from;
};

const buildDateInTZ = (tz: string, base: Date, hour: number, minute: number) => {
  // Tomamos la fecha local de ese TZ y fijamos hh:mm exactos.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(base);
  const y = Number(parts.find(p => p.type === 'year')?.value);
  const m = Number(parts.find(p => p.type === 'month')?.value);
  const d = Number(parts.find(p => p.type === 'day')?.value);

  // Creamos ISO como si fuese local del TZ y dejamos al motor convertir a UTC.
  // Truco: usamos string con offset calculado por Intl:
  const localIso = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00`;
  // Para obtener el UTC real de ese local time, pedimos el timestamp formateando con el tz y reparseando:
  const millis = Date.parse(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(new Date(localIso))
  );
  return new Date(millis);
};

const getNextOpenUTC = (m: MarketConfig, now = new Date()) => {
  // 1) Fecha candidata = hoy a hora de apertura en TZ del mercado
  const openTodayUTC = buildDateInTZ(m.timezone, now, m.openHour, m.openMinute);

  // 2) ¿Hoy es hábil en ese TZ y aún no pasó?
  const isBizToday = isBusinessDayInTZ(m.timezone, now);
  if (isBizToday && openTodayUTC.getTime() > now.getTime()) {
    return openTodayUTC;
  }
  // 3) Si ya pasó o no es hábil: próximo día hábil
  const nextBiz = nextBusinessDayInTZ(m.timezone, new Date(now.getTime() + 24*60*60*1000));
  return buildDateInTZ(m.timezone, nextBiz, m.openHour, m.openMinute);
};

// ======= Hook principal =======
function useMarketOpenAlarms(enabledKeys: MarketKey[], soundUrl?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const enabledMap = useMemo(() => new Set(enabledKeys), [enabledKeys]);

  // Prepara audio tras interacción del usuario
  const enableAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl || DEFAULT_CHIME_BASE64);
      audioRef.current.preload = 'auto';
    }
    // Un play corto para desbloquear en iOS/Chrome (puede fallar silencioso)
    audioRef.current.play().then(() => {
      audioRef.current?.pause();
      audioRef.current!.currentTime = 0;
      setReady(true);
    }).catch(() => {
      // Si falla, igual marcamos ready y se habilitará al siguiente intento tras click
      setReady(true);
    });
  };

  useEffect(() => {
    // Chequeo cada 15s para capturar el minuto exacto incluso si la pestaña no estaba en foco
    const iv = setInterval(() => {
      const now = new Date();
      MARKETS.forEach(m => {
        if (!enabledMap.has(m.key)) return;

        // Si el tiempo actual (UTC) está dentro del mismo minuto de la apertura -> disparar
        const openUTC = getNextOpenUTC(m, new Date(now.getTime() - 60*1000)); 
        // Abrirá dentro del próximo minuto si la apertura es <= now < now+60s
        const diff = openUTC.getTime() - now.getTime();
        if (diff >= 0 && diff < 15000) {
          // Edge: solo dispara si estamos exactamente en el minuto de apertura (tolerancia 15s)
          audioRef.current = audioRef.current || new Audio(soundUrl || DEFAULT_CHIME_BASE64);
          audioRef.current.play().catch(() => {/* ignore */});
          // Notificación visual opcional
          if (Notification && Notification.permission === 'granted') {
            new Notification(`📈 ${m.label} market is now OPEN`);
          }
        }
      });
    }, 15000);
    return () => clearInterval(iv);
  }, [enabledMap, soundUrl]);

  // Helper para pedir permiso de notificaciones (opcional)
  const requestNotify = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch {}
    }
  };

  return { enableAudio, ready, requestNotify };
}

// ======= UI de ejemplo =======
export default function MarketOpenAlarmWidget({
  soundUrl,                       // opcional: tu mp3/ogg/wav
  defaultEnabled = ['newyork','london','tokyo'] as MarketKey[]
}: { soundUrl?: string; defaultEnabled?: MarketKey[] }) {

  const [enabled, setEnabled] = useState<Set<MarketKey>>(new Set(defaultEnabled));
  const { enableAudio, ready, requestNotify } = useMarketOpenAlarms(Array.from(enabled), soundUrl);

  const toggle = (k: MarketKey) => {
    setEnabled(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  return (
    <div className="bg-gradient-to-br from-darkblack-700 to-darkblack-800 rounded-xl border border-gray-700/50 p-4 sm:p-6 shadow-xl backdrop-blur-sm mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <IoNotificationsOutline className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Market Open Alerts</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Get notified when markets open</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={enableAudio}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              ready
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-600/30'
            }`}
            title="Enable sound (required by browsers)"
          >
            {ready ? (
              <>
                <IoCheckmarkCircle className="text-base" />
                <span className="hidden sm:inline">Sound Ready</span>
              </>
            ) : (
              <>
                <IoVolumeHighOutline className="text-base" />
                <span className="hidden sm:inline">Enable Sound</span>
              </>
            )}
          </button>
          <button
            onClick={requestNotify}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30 text-sm font-medium hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200"
          >
            <IoNotificationsOutline className="text-base" />
            <span className="hidden sm:inline">Notifications</span>
          </button>
        </div>
      </div>

      {/* Market Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {MARKETS.map(m => {
          const isEnabled = enabled.has(m.key);
          return (
            <label 
              key={m.key} 
              className={`relative flex flex-col items-center justify-center gap-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                isEnabled
                  ? 'bg-gradient-to-br from-teal-500/30 to-teal-600/30 border-2 border-teal-500/50 shadow-lg shadow-teal-500/20'
                  : 'bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/50 hover:border-gray-500/70 hover:from-gray-700/40 hover:to-gray-800/40'
              }`}
            >
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => toggle(m.key)}
                className="sr-only"
              />
              
              {/* Flag and Label */}
              <div className="text-center">
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className={`text-xs sm:text-sm font-semibold ${isEnabled ? 'text-white' : 'text-gray-300'}`}>
                  {m.label}
                </div>
                <div className={`text-[10px] sm:text-xs mt-1 ${isEnabled ? 'text-teal-300' : 'text-gray-500'}`}>
                  {String(m.openHour).padStart(2,'0')}:{String(m.openMinute).padStart(2,'0')}
                </div>
              </div>

              {/* Active Indicator */}
              {isEnabled && (
                <div className="absolute top-1.5 right-1.5">
                  <IoCheckmarkCircle className="text-teal-400 text-base" />
                </div>
              )}
            </label>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <p className="text-xs text-gray-500 text-center">
          Active Monday–Friday • Respects daylight saving time • Major holidays not included
        </p>
      </div>
    </div>
  );
}
