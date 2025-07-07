import dayjs from "dayjs";

export const TimeHoursMinters = (timestamp: number) => {
  const date = new Date(timestamp);

  // 自动使用系统本地时区
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const hhmm = `${hours}:${minutes}`;
  return hhmm;
};


// 处理时间戳为年月日
export function renderTimeToYear(time?: string | number) {
  if (!time) {
    return "--:--";
  }
  const date = dayjs(Number(time));
  const currentYear = dayjs().year();
  if (date.year() < currentYear) {
    return date.format("YYYY-MM-DD HH:mm");
  } else {
    return date.format("MM-DD HH:mm");
  }
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
