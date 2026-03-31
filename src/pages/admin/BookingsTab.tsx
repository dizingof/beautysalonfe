import { useState, useEffect, useCallback } from 'react';
import type { Master } from '../../types';
import {
  adminGetMasters,
  adminGetBookings,
  adminUpdateBookingStatus,
  type AdminBooking,
} from '../../api/adminClient';
import styles from './BookingsTab.module.css';
import tableStyles from './TabTable.module.css';

const STATUS_LABELS: Record<string, string> = {
  Pending: 'Очікує',
  Confirmed: 'Підтверджено',
  Cancelled: 'Скасовано',
  Completed: 'Завершено',
};

const STATUS_COLORS: Record<string, string> = {
  Pending: '#e67e22',
  Confirmed: '#27ae60',
  Cancelled: '#e74c3c',
  Completed: '#7f8c8d',
};

function getWeekDays(baseDate: Date): string[] {
  const monday = new Date(baseDate);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const DAY_NAMES = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];
const SLOTS = Array.from({ length: 23 }, (_, i) => {
  const h = Math.floor(i / 2) + 9;
  const m = i % 2 === 0 ? '00' : '30';
  return `${h.toString().padStart(2, '0')}:${m}`;
});

export default function BookingsTab() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [selectedMaster, setSelectedMaster] = useState('');
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    return now;
  });
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const weekDays = getWeekDays(weekStart);

  useEffect(() => {
    adminGetMasters().then((m) => {
      setMasters(m);
      if (m.length > 0) setSelectedMaster(m[0].id);
    });
  }, []);

  const loadBookings = useCallback(async () => {
    if (!selectedMaster) return;
    setLoading(true);
    try {
      const all = await Promise.all(
        weekDays.map((date) => adminGetBookings({ masterId: selectedMaster, date }))
      );
      setBookings(all.flat());
    } finally {
      setLoading(false);
    }
  }, [selectedMaster, weekDays.join(',')]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const getBookingAt = (date: string, slot: string) =>
    bookings.find((b) => b.date === date && b.timeSlot === slot && b.status !== 'Cancelled');

  const shiftWeek = (dir: number) => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
  };

  const goToday = () => setWeekStart(new Date());

  const handleStatusChange = async (booking: AdminBooking, newStatus: string) => {
    await adminUpdateBookingStatus(booking.id, newStatus);
    await loadBookings();
    setSelectedBooking(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
  };

  return (
    <div className={styles.wrap}>
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.masterSelect}>
          <label className={styles.label}>Майстер:</label>
          <select
            className={styles.select}
            value={selectedMaster}
            onChange={(e) => setSelectedMaster(e.target.value)}
          >
            {masters.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.weekNav}>
          <button className={styles.navBtn} onClick={() => shiftWeek(-1)}>← Тиждень</button>
          <button className={styles.todayBtn} onClick={goToday}>Сьогодні</button>
          <button className={styles.navBtn} onClick={() => shiftWeek(1)}>Тиждень →</button>
        </div>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className={tableStyles.loading}>Завантаження...</div>
      ) : (
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <div className={styles.timeCol}></div>
            {weekDays.map((d, i) => {
              const isToday = d === new Date().toISOString().slice(0, 10);
              return (
                <div key={d} className={`${styles.dayCol} ${isToday ? styles.today : ''}`}>
                  <span className={styles.dayName}>{DAY_NAMES[i]}</span>
                  <span className={styles.dayDate}>{formatDate(d)}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.calendarBody}>
            {SLOTS.map((slot) => (
              <div key={slot} className={styles.row}>
                <div className={styles.timeCell}>{slot}</div>
                {weekDays.map((d) => {
                  const booking = getBookingAt(d, slot);
                  if (!booking) {
                    return <div key={d} className={styles.cell} />;
                  }
                  return (
                    <div
                      key={d}
                      className={styles.cellBooked}
                      style={{ borderLeftColor: STATUS_COLORS[booking.status] ?? '#ccc' }}
                      onClick={() => setSelectedBooking(booking)}
                      title={`${booking.clientName} — ${booking.serviceName}`}
                    >
                      <span className={styles.bookingClient}>{booking.clientName}</span>
                      <span className={styles.bookingService}>{booking.serviceName}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking detail popup */}
      {selectedBooking && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}>
          <div className={styles.popup}>
            <h3 className={styles.popupTitle}>Деталі запису</h3>
            <div className={styles.popupGrid}>
              <span className={styles.popupLabel}>Клієнт:</span>
              <span>{selectedBooking.clientName}</span>
              <span className={styles.popupLabel}>Телефон:</span>
              <a href={`tel:${selectedBooking.clientPhone.replace(/\s/g, '')}`}>
                {selectedBooking.clientPhone}
              </a>
              <span className={styles.popupLabel}>Послуга:</span>
              <span>{selectedBooking.serviceName}</span>
              <span className={styles.popupLabel}>Дата:</span>
              <span>{formatDate(selectedBooking.date)}, {selectedBooking.timeSlot}</span>
              <span className={styles.popupLabel}>Статус:</span>
              <span style={{ color: STATUS_COLORS[selectedBooking.status], fontWeight: 600 }}>
                {STATUS_LABELS[selectedBooking.status] ?? selectedBooking.status}
              </span>
            </div>
            <div className={styles.popupActions}>
              {selectedBooking.status === 'Pending' && (
                <button className={styles.confirmBtn} onClick={() => handleStatusChange(selectedBooking, 'Confirmed')}>
                  ✓ Підтвердити
                </button>
              )}
              {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && (
                <>
                  <button className={styles.completeBtn} onClick={() => handleStatusChange(selectedBooking, 'Completed')}>
                    ✓ Завершити
                  </button>
                  <button className={styles.cancelBtn} onClick={() => handleStatusChange(selectedBooking, 'Cancelled')}>
                    ✕ Скасувати
                  </button>
                </>
              )}
              <button className={styles.closeBtn} onClick={() => setSelectedBooking(null)}>Закрити</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
