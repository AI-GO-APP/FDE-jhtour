'use client';
/** 員工出勤 — 重導向至差假狀況表 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AttendanceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/master-data/attendance/leave');
  }, [router]);
  return null;
}
