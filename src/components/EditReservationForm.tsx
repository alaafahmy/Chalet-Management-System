"use client";

import { useState, useEffect } from "react";
import { Edit2, X } from "lucide-react";
import { updateReservationDetails } from "@/app/actions";
import { validateAmount, validateDateRange } from "@/lib/validation";

type Client = { id: string; name: string };
type Chalet = { id: string; name: string; pricePerNight: number; status?: string };

interface ReservationData {
  id: string;
  clientId: string;
  chaletId: string;
  checkIn: Date;
  checkOut: Date;
  discount: number;
  totalCost: number;
  notes: string | null;
  status: string;
}

export default function EditReservationForm({ reservation, clients, chalets, userRole }: { reservation: ReservationData, clients: Client[], chalets: Chalet[], userRole: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxDiscount = (userRole === "admin" || userRole === "reservation_manager") ? 100 : 20;

  // Form State
  const [clientId, setClientId] = useState(reservation.clientId);
  const [chaletId, setChaletId] = useState(reservation.chaletId);
  
  const formatDateForInput = (d: Date) => d.toISOString().split('T')[0];
  
  const [checkIn, setCheckIn] = useState(formatDateForInput(reservation.checkIn));
  const [checkOut, setCheckOut] = useState(formatDateForInput(reservation.checkOut));
  const [discount, setDiscount] = useState((reservation.discount || 0).toString());
  const [totalPrice, setTotalPrice] = useState(reservation.totalCost.toString());
  const [originalPrice, setOriginalPrice] = useState(0);
  const [notes, setNotes] = useState(reservation.notes || "");

  // Errors State
  const [dateError, setDateError] = useState("");
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setClientId(reservation.clientId);
      setChaletId(reservation.chaletId);
      setCheckIn(formatDateForInput(reservation.checkIn));
      setCheckOut(formatDateForInput(reservation.checkOut));
      setDiscount((reservation.discount || 0).toString());
      setTotalPrice(reservation.totalCost.toString());
      setNotes(reservation.notes || "");
      
      // Calculate original price roughly
      const inD = new Date(reservation.checkIn);
      const outD = new Date(reservation.checkOut);
      const nights = Math.max(1, Math.ceil((outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24)));
      const ch = chalets.find(c => c.id === reservation.chaletId);
      if (ch) {
        setOriginalPrice(ch.pricePerNight * nights);
      }

      setError(null);
      setDateError("");
      setPriceError("");
    }
  }, [isOpen, reservation]);

  function validateForm(): boolean {
    let valid = true;

    const dateCheck = validateDateRange(checkIn, checkOut);
    if (!dateCheck.valid) {
      setDateError(dateCheck.message!);
      valid = false;
    } else {
      setDateError("");
    }

    const priceCheck = validateAmount(Number(totalPrice), "المبلغ الإجمالي");
    if (!priceCheck.valid) {
      setPriceError(priceCheck.message!);
      valid = false;
    } else {
      setPriceError("");
    }

    return valid;
  }

  function recalculateTotal(inDate: string, outDate: string, chId: string, disc: string) {
    if (inDate && outDate && chId) {
      const inD = new Date(inDate);
      const outD = new Date(outDate);
      if (outD > inD) {
        const nights = Math.ceil((outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24));
        const ch = chalets.find(c => c.id === chId);
        if (ch) {
          const basePrice = ch.pricePerNight * nights;
          setOriginalPrice(basePrice);
          const dVal = parseFloat(disc) || 0;
          const finalPrice = Math.max(0, basePrice - (basePrice * dVal / 100));
          setTotalPrice(finalPrice.toString());
          return;
        }
      }
    }
    setOriginalPrice(0);
    setTotalPrice("");
  }

  function handleDateChange(inDate: string, outDate: string, chId: string) {
    setCheckIn(inDate);
    setCheckOut(outDate);
    setChaletId(chId);
    recalculateTotal(inDate, outDate, chId, discount);
  }

  function handleDiscountChange(val: string) {
    let dVal = parseFloat(val) || 0;
    if (dVal > maxDiscount) dVal = maxDiscount;
    if (dVal < 0) dVal = 0;
    const strVal = val === "" ? "" : dVal.toString();
    setDiscount(strVal);
    recalculateTotal(checkIn, checkOut, chaletId, strVal);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("id", reservation.id);
    formData.append("chaletId", chaletId);
    formData.append("checkIn", checkIn);
    formData.append("checkOut", checkOut);
    formData.append("totalPrice", totalPrice);
    formData.append("discount", discount || "0");
    formData.append("notes", notes);

    const res = await updateReservationDetails(formData);
    setPending(false);
    
    if (res.error) {
      setError(res.error);
    } else {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-blue-400 transition-colors"
        title="تعديل الحجز"
      >
        <Edit2 size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 w-full max-w-2xl relative animate-in fade-in zoom-in duration-200 text-right">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-[#8b92a5] hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">تعديل الحجز</h3>
            
            {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm font-bold border border-red-500/30">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8b92a5] mb-1">العميل</label>
                  <select 
                    value={clientId}
                    disabled
                    className="w-full bg-[var(--color-bg-input)]/50 border border-[var(--color-border-subtle)] rounded-lg p-3 text-[#8b92a5] cursor-not-allowed"
                  >
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <p className="text-xs text-[#8b92a5] mt-1">لا يمكن تغيير العميل بعد إنشاء الحجز.</p>
                </div>
                <div>
                  <label className="block text-sm text-[#8b92a5] mb-1">الشاليه <span className="text-red-500">*</span></label>
                  <select 
                    value={chaletId}
                    onChange={(e) => handleDateChange(checkIn, checkOut, e.target.value)}
                    required 
                    className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border-subtle)] rounded-lg p-3 text-white focus:outline-none focus:border-[#d4a853]"
                  >
                    <option value="">اختر الشاليه...</option>
                    {chalets.map(c => (
                      <option key={c.id} value={c.id} disabled={c.status === "تحت الصيانة" && reservation.chaletId !== c.id}>
                        {c.name} ({c.pricePerNight} ر.س/ليلة) {c.status === "تحت الصيانة" && reservation.chaletId !== c.id ? "- 🛠️ تحت الصيانة" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8b92a5] mb-1">تاريخ الدخول <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => {
                      handleDateChange(e.target.value, checkOut, chaletId);
                      if (dateError) setDateError("");
                    }}
                    onBlur={() => {
                      if (checkIn && checkOut) {
                        const check = validateDateRange(checkIn, checkOut);
                        if (!check.valid) setDateError(check.message!);
                      }
                    }}
                    required 
                    dir="ltr"
                    className={`w-full bg-[var(--color-bg-input)] border ${dateError ? 'border-red-500' : 'border-[var(--color-border-subtle)]'} rounded-lg p-3 text-white text-right focus:outline-none focus:border-[#d4a853] [color-scheme:dark]`} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8b92a5] mb-1">تاريخ الخروج <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => {
                      handleDateChange(checkIn, e.target.value, chaletId);
                      if (dateError) setDateError("");
                    }}
                    onBlur={() => {
                      if (checkIn && checkOut) {
                        const check = validateDateRange(checkIn, checkOut);
                        if (!check.valid) setDateError(check.message!);
                      }
                    }}
                    required 
                    dir="ltr"
                    className={`w-full bg-[var(--color-bg-input)] border ${dateError ? 'border-red-500' : 'border-[var(--color-border-subtle)]'} rounded-lg p-3 text-white text-right focus:outline-none focus:border-[#d4a853] [color-scheme:dark]`} 
                  />
                </div>
              </div>
              {dateError && <p className="text-red-400 text-xs mt-1">{dateError}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8b92a5] mb-1">نسبة الخصم (%)</label>
                  <input 
                    type="number" 
                    value={discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    min="0"
                    max={maxDiscount}
                    className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border-subtle)] rounded-lg p-3 text-white focus:outline-none focus:border-[#d4a853]" 
                    placeholder={`الحد الأقصى ${maxDiscount}%`} 
                  />
                  <p className="text-[10px] text-[#8b92a5] mt-1">
                    الحد الأقصى المسموح لك: {maxDiscount}%
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-[#8b92a5] mb-1">الإجمالي (ر.س) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={totalPrice}
                    readOnly
                    className="w-full bg-[var(--color-bg-input)]/50 border border-[var(--color-border-subtle)] rounded-lg p-3 text-[#cacedb] cursor-not-allowed" 
                  />
                  {originalPrice > 0 && parseFloat(discount) > 0 && (
                    <p className="text-[10px] text-emerald-400 mt-1 line-through opacity-70">
                      السعر قبل الخصم: {originalPrice} ر.س
                    </p>
                  )}
                  {priceError && <p className="text-red-400 text-xs mt-1">{priceError}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8b92a5] mb-1">ملاحظات الحجز</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2} 
                  className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border-subtle)] rounded-lg p-3 text-white focus:outline-none focus:border-[#d4a853]" 
                  placeholder="طلبات خاصة..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-[var(--color-bg-input)] text-white p-3 rounded-lg hover:bg-[var(--color-border-subtle)] transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={pending}
                  className="flex-1 bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {pending ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
