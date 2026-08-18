import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/ui/select";

interface CascadingDateTimeInputProps {
  id: string;
  value: string; // "YYYY-MM-DDTHH:mm", matches <input type="datetime-local"> format
  onChange: (value: string) => void;
  required?: boolean;
}

interface Parts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
}

function parseValue(value: string): Parts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
  };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatValue({ year, month, day, hour, minute }: Parts) {
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

export function CascadingDateTimeInput({ id, value, onChange, required }: CascadingDateTimeInputProps) {
  const { t } = useTranslation();
  const months = t("datetime.months", { returnObjects: true }) as string[];
  const now = new Date();
  const parsed = parseValue(value);
  const current: Parts = parsed ?? {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  };

  const years = useMemo(() => {
    const thisYear = now.getFullYear();
    return Array.from({ length: 17 }, (_, i) => thisYear + 1 - i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = useMemo(
    () => Array.from({ length: daysInMonth(current.year, current.month) }, (_, i) => i + 1),
    [current.year, current.month],
  );

  function update(patch: Partial<Parts>) {
    const next: Parts = { ...current, ...patch };
    next.day = Math.min(next.day, daysInMonth(next.year, next.month));
    onChange(formatValue(next));
  }

  const v = (n: number) => (parsed ? String(n) : "");

  return (
    <div dir="ltr" className="flex flex-wrap items-center gap-1">
      <Select
        id={id}
        aria-label="Day"
        required={required}
        value={v(current.day)}
        onChange={(e) => update({ day: Number(e.target.value) })}
        className="w-[4.2rem] px-1.5"
      >
        {!parsed ? <option value="" disabled>{t("datetime.day")}</option> : null}
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Month"
        required={required}
        value={v(current.month)}
        onChange={(e) => update({ month: Number(e.target.value) })}
        className="w-[4.6rem] px-1.5"
      >
        {!parsed ? <option value="" disabled>{t("datetime.month")}</option> : null}
        {months.map((label, i) => (
          <option key={label} value={i + 1}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Year"
        required={required}
        value={v(current.year)}
        onChange={(e) => update({ year: Number(e.target.value) })}
        className="w-[5rem] px-1.5"
      >
        {!parsed ? <option value="" disabled>{t("datetime.year")}</option> : null}
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
      <span className="text-muted-foreground">·</span>
      <Select
        aria-label="Hour"
        required={required}
        value={v(current.hour)}
        onChange={(e) => update({ hour: Number(e.target.value) })}
        className="w-[3.6rem] px-1.5"
      >
        {!parsed ? <option value="" disabled>{t("datetime.hour")}</option> : null}
        {Array.from({ length: 24 }, (_, h) => (
          <option key={h} value={h}>
            {pad(h)}
          </option>
        ))}
      </Select>
      <span className="text-muted-foreground">:</span>
      <Select
        aria-label="Minute"
        required={required}
        value={v(current.minute)}
        onChange={(e) => update({ minute: Number(e.target.value) })}
        className="w-[3.6rem] px-1.5"
      >
        {!parsed ? <option value="" disabled>{t("datetime.minute")}</option> : null}
        {Array.from({ length: 60 }, (_, m) => (
          <option key={m} value={m}>
            {pad(m)}
          </option>
        ))}
      </Select>
    </div>
  );
}
