import { useState, useEffect, useMemo } from 'react';
import { X, Check } from 'lucide-react';
import { services, masters, categoryNames, generateTimeSlots } from '../../data/mockData';
import type { ServiceCategory, BookingData } from '../../types';
import styles from './BookingModal.module.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string | null;
  preselectedMasterId?: string | null;
  preselectedCategory?: ServiceCategory | null;
}

const STEPS = ['service', 'master', 'datetime', 'contacts', 'confirm'] as const;
type Step = (typeof STEPS)[number];

const stepTitles: Record<Step, string> = {
  service: 'Оберіть послугу',
  master: 'Оберіть майстра',
  datetime: 'Оберіть дату та час',
  contacts: 'Ваші контакти',
  confirm: 'Підтвердження',
};

export default function BookingModal({
  isOpen,
  onClose,
  preselectedServiceId,
  preselectedMasterId,
  preselectedCategory,
}: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [booking, setBooking] = useState<BookingData>({
    serviceId: null,
    masterId: null,
    date: null,
    timeSlot: null,
    clientName: '',
    clientPhone: '',
  });
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');
  const [success, setSuccess] = useState(false);

  // Reset and apply preselections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setCurrentStep('service');
      setBooking({
        serviceId: preselectedServiceId || null,
        masterId: preselectedMasterId || null,
        date: null,
        timeSlot: null,
        clientName: '',
        clientPhone: '',
      });
      setCategoryFilter(preselectedCategory || 'all');

      if (preselectedServiceId) {
        setCurrentStep('master');
      }
      if (preselectedMasterId && !preselectedServiceId) {
        setCurrentStep('service');
      }
    }
  }, [isOpen, preselectedServiceId, preselectedMasterId, preselectedCategory]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const selectedService = services.find((s) => s.id === booking.serviceId);
  const selectedMaster = masters.find((m) => m.id === booking.masterId);

  const filteredServices = categoryFilter === 'all'
    ? services
    : services.filter((s) => s.category === categoryFilter);

  // Filter masters by selected service category
  const availableMasters = selectedService
    ? masters.filter((m) => m.specializations.includes(selectedService.category))
    : masters;

  const today = new Date().toISOString().split('T')[0];
  const timeSlots = useMemo(
    () => (booking.date ? generateTimeSlots(booking.date) : []),
    [booking.date]
  );

  const currentStepIndex = STEPS.indexOf(currentStep);

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 'service':
        return !!booking.serviceId;
      case 'master':
        return !!booking.masterId;
      case 'datetime':
        return !!booking.date && !!booking.timeSlot;
      case 'contacts':
        return booking.clientName.trim().length >= 2 && booking.clientPhone.trim().length >= 10;
      default:
        return true;
    }
  };

  const goNext = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
    }
  };

  const goBack = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1]);
    }
  };

  const handleConfirm = () => {
    // In the future, this will call the API
    console.log('Booking data:', booking);
    setSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>
            {success ? 'Готово!' : 'Запис онлайн'}
          </h2>
          <button className={styles['modal-close']} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles['modal-body']}>
          {success ? (
            <div className={styles['success-screen']}>
              <div className={styles['success-icon']}>
                <Check size={40} />
              </div>
              <h3 className={styles['success-title']}>Ви записані!</h3>
              <p className={styles['success-text']}>
                {selectedService?.name} у майстра {selectedMaster?.name}<br />
                {booking.date} о {booking.timeSlot}<br /><br />
                Ми надішлемо підтвердження на ваш телефон.
              </p>
              <button className="btn btn-primary btn-lg" onClick={onClose}>
                Чудово!
              </button>
            </div>
          ) : (
            <>
              {/* Steps Indicator */}
              <div className={styles['steps-indicator']}>
                {STEPS.map((step, idx) => (
                  <div
                    key={step}
                    className={`${styles['step-dot']} ${
                      idx === currentStepIndex ? styles.active : ''
                    } ${idx < currentStepIndex ? styles.completed : ''}`}
                  />
                ))}
              </div>

              <h3 className={styles['step-title']}>{stepTitles[currentStep]}</h3>

              {/* Step 1: Service */}
              {currentStep === 'service' && (
                <>
                  <div className={styles['category-tabs']}>
                    <button
                      className={`${styles['category-tab']} ${categoryFilter === 'all' ? styles.active : ''}`}
                      onClick={() => setCategoryFilter('all')}
                    >
                      Усі
                    </button>
                    {(['sugaring', 'manicure', 'pedicure', 'brows'] as ServiceCategory[]).map((cat) => (
                      <button
                        key={cat}
                        className={`${styles['category-tab']} ${categoryFilter === cat ? styles.active : ''}`}
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {categoryNames[cat]}
                      </button>
                    ))}
                  </div>
                  <div className={styles['service-list']}>
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        className={`${styles['service-option']} ${
                          booking.serviceId === service.id ? styles.selected : ''
                        }`}
                        onClick={() => setBooking((prev) => ({ ...prev, serviceId: service.id }))}
                      >
                        <div className={styles['service-option-info']}>
                          <div className={styles['service-option-name']}>{service.name}</div>
                          <div className={styles['service-option-duration']}>{service.duration} хв</div>
                        </div>
                        <div className={styles['service-option-price']}>{service.price} грн</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Step 2: Master */}
              {currentStep === 'master' && (
                <div className={styles['master-list']}>
                  {availableMasters.map((master) => (
                    <div
                      key={master.id}
                      className={`${styles['master-option']} ${
                        booking.masterId === master.id ? styles.selected : ''
                      }`}
                      onClick={() => setBooking((prev) => ({ ...prev, masterId: master.id }))}
                    >
                      <div className={styles['master-option-photo']}>
                        {master.name[0]}
                      </div>
                      <div className={styles['master-option-name']}>{master.name}</div>
                      <div className={styles['master-option-rating']}>
                        <span>★</span> {master.rating.toFixed(1)} ({master.reviewsCount})
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Date & Time */}
              {currentStep === 'datetime' && (
                <>
                  <div className={styles['date-input-wrapper']}>
                    <label>Дата</label>
                    <input
                      type="date"
                      min={today}
                      value={booking.date || ''}
                      onChange={(e) =>
                        setBooking((prev) => ({
                          ...prev,
                          date: e.target.value,
                          timeSlot: null,
                        }))
                      }
                    />
                  </div>
                  {booking.date && (
                    <>
                      <label style={{ display: 'block', fontWeight: 500, fontSize: '0.9rem', marginBottom: '8px' }}>
                        Час
                      </label>
                      <div className={styles['time-slots-grid']}>
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            className={`${styles['time-slot']} ${
                              booking.timeSlot === slot.time ? styles.selected : ''
                            } ${!slot.available ? styles.disabled : ''}`}
                            onClick={() => {
                              if (slot.available) {
                                setBooking((prev) => ({ ...prev, timeSlot: slot.time }));
                              }
                            }}
                            disabled={!slot.available}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Step 4: Contacts */}
              {currentStep === 'contacts' && (
                <>
                  <div className={styles['form-group']}>
                    <label>Ваше ім&apos;я</label>
                    <input
                      type="text"
                      placeholder="Введіть ваше ім'я"
                      value={booking.clientName}
                      onChange={(e) =>
                        setBooking((prev) => ({ ...prev, clientName: e.target.value }))
                      }
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Телефон</label>
                    <input
                      type="tel"
                      placeholder="+380 (XX) XXX-XX-XX"
                      value={booking.clientPhone}
                      onChange={(e) =>
                        setBooking((prev) => ({ ...prev, clientPhone: e.target.value }))
                      }
                    />
                  </div>
                </>
              )}

              {/* Step 5: Confirm */}
              {currentStep === 'confirm' && (
                <div className={styles.summary}>
                  <div className={styles['summary-item']}>
                    <span className={styles['summary-label']}>Послуга</span>
                    <span className={styles['summary-value']}>{selectedService?.name}</span>
                  </div>
                  <div className={styles['summary-item']}>
                    <span className={styles['summary-label']}>Майстер</span>
                    <span className={styles['summary-value']}>{selectedMaster?.name}</span>
                  </div>
                  <div className={styles['summary-item']}>
                    <span className={styles['summary-label']}>Дата</span>
                    <span className={styles['summary-value']}>{booking.date}</span>
                  </div>
                  <div className={styles['summary-item']}>
                    <span className={styles['summary-label']}>Час</span>
                    <span className={styles['summary-value']}>{booking.timeSlot}</span>
                  </div>
                  <div className={styles['summary-item']}>
                    <span className={styles['summary-label']}>Ім&apos;я</span>
                    <span className={styles['summary-value']}>{booking.clientName}</span>
                  </div>
                  <div className={styles['summary-item']}>
                    <span className={styles['summary-label']}>Телефон</span>
                    <span className={styles['summary-value']}>{booking.clientPhone}</span>
                  </div>
                  <div className={styles['summary-total']}>
                    <span>До сплати</span>
                    <span>{selectedService?.price} грн</span>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className={styles['modal-actions']}>
                {currentStepIndex > 0 && (
                  <button className="btn btn-outline" onClick={goBack}>
                    Назад
                  </button>
                )}
                {currentStep === 'confirm' ? (
                  <button className="btn btn-primary btn-lg" onClick={handleConfirm}>
                    Підтвердити запис
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={goNext}
                    disabled={!canGoNext()}
                    style={{ opacity: canGoNext() ? 1 : 0.5 }}
                  >
                    Далі
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
