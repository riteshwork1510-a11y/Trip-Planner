"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getTrips, type Trip } from "@/lib/api/trips";
import { getExpenses, getExpenseStats, createExpense, deleteExpense, type Expense, type ExpenseStats, type ExpenseCategory } from "@/lib/api/expenses";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, staggerItem, StringCountUp, CountUp } from "@/components/animations/animation-utils";

const categories = ["Hotels", "Food", "Transportation", "Activities", "Shopping", "Miscellaneous"] as const;

const categoryMeta: Record<ExpenseCategory, { emoji: string; badgeVariant: "success" | "warning" | "info" | "default" | "danger"; barColor: "green" | "orange" | "blue" | "red" }> = {
  Hotels: { emoji: "🏨", badgeVariant: "info", barColor: "blue" },
  Food: { emoji: "🍔", badgeVariant: "warning", barColor: "orange" },
  Transportation: { emoji: "🚗", badgeVariant: "default", barColor: "green" },
  Activities: { emoji: "🎯", badgeVariant: "success", barColor: "green" },
  Shopping: { emoji: "🛍️", badgeVariant: "danger", barColor: "red" },
  Miscellaneous: { emoji: "📦", badgeVariant: "default", barColor: "blue" },
};

const currencyOptions = [
  { label: "INR (₹)", value: "INR" },
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "AED (د.إ)", value: "AED" },
];

const ratesToINR: Record<string, number> = { INR: 1, USD: 83.5, EUR: 91.2, GBP: 105.8, AED: 22.7 };
const currencySymbols: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "د.إ" };

function convertCurrency(amount: number, from: string, to: string): number {
  if (!amount || amount <= 0) return 0;
  return (amount * ratesToINR[from]) / ratesToINR[to];
}

const categoryOptions = categories.map((c) => ({ label: c, value: c }));

interface NewExpenseForm { tripId: string; category: ExpenseCategory | ""; description: string; amount: string; date: string; notes: string; }
const emptyForm: NewExpenseForm = { tripId: "", category: "", description: "", amount: "", date: "", notes: "" };

export default function ExpensesPage() {
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenseStats, setExpenseStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NewExpenseForm>(emptyForm);
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [convertAmount, setConvertAmount] = useState("");
  const { addToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [expensesRes, tripsRes, statsRes] = await Promise.all([
        getExpenses(),
        getTrips(),
        getExpenseStats(),
      ]);
      if (expensesRes.success && expensesRes.data) setExpenseList(expensesRes.data);
      if (tripsRes.success && tripsRes.data) setTrips(tripsRes.data);
      if (statsRes.success && statsRes.data) setExpenseStats(statsRes.data);
    } catch {
      addToast("Failed to load expenses data", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalBudget = useMemo(() => trips.reduce((sum, t) => sum + t.budget, 0), [trips]);
  const totalSpent = expenseStats?.total_spent ?? expenseList.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const cat of categories) totals[cat] = expenseList.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return totals;
  }, [expenseList]);

  const maxCategoryAmount = useMemo(() => Math.max(...Object.values(categoryTotals), 1), [categoryTotals]);
  const conversionResult = useMemo(() => convertCurrency(Number(convertAmount) || 0, fromCurrency, toCurrency), [convertAmount, fromCurrency, toCurrency]);

  const summaryValues = { budget: totalBudget, spent: totalSpent, remaining, count: expenseList.length };

  const tripOptions = trips.map((t) => ({ label: t.destination, value: t.id }));
  function getTripName(tripId: string) { return trips.find((t) => t.id === tripId)?.destination ?? "Unknown"; }
  function handleFormChange(field: keyof NewExpenseForm, value: string) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function handleSave() {
    if (!form.tripId || !form.category || !form.description || !form.amount || !form.date) { addToast("Please fill in all required fields", "warning"); return; }
    try {
      const res = await createExpense({
        trip_id: form.tripId,
        category: form.category as ExpenseCategory,
        description: form.description,
        amount: Number(form.amount),
        date: form.date,
        currency: "INR",
      });
      if (res.success && res.data) {
        setExpenseList((prev) => [res.data!, ...prev]);
        setModalOpen(false); setForm(emptyForm); addToast("Expense added successfully", "success");
        fetchData();
      }
    } catch {
      addToast("Failed to add expense", "error");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await deleteExpense(id);
      if (res.success) {
        setExpenseList((prev) => prev.filter((e) => e.id !== id));
        addToast("Expense deleted", "success");
        fetchData();
      }
    } catch {
      addToast("Failed to delete expense", "error");
    }
  }

  const summaryCards = [
    { label: "Total Budget", key: "budget" as const, icon: <svg className="h-6 w-6 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, bgColor: "bg-[#E8F0E9]" },
    { label: "Total Spent", key: "spent" as const, icon: <svg className="h-6 w-6 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, bgColor: "bg-orange-100" },
    { label: "Remaining", key: "remaining" as const, icon: <svg className="h-6 w-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>, bgColor: "bg-blue-100" },
    { label: "Total Expenses", key: "count" as const, icon: <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>, bgColor: "bg-purple-100" },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Expenses & Budget" breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Expenses" }]}>
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B4332] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Expenses & Budget" breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Expenses" }]}>
      <div className="space-y-8">
        <ScrollReveal>
          <div>
            <h1 className="text-2xl font-bold text-[#2D3436]">Expenses & Budget</h1>
            <p className="mt-1 text-sm text-gray-500">Track your travel expenses and stay on budget.</p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <motion.div key={card.label} variants={staggerItem}>
              <Card variant="elevated" padding="md" className="relative overflow-hidden">
                <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full blur-2xl bg-[#1B4332]/[0.04]" />
                <div className="relative flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}>{card.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-[#2D3436]">
                      {card.key === "count" ? (
                        <CountUp value={summaryValues[card.key]} duration={1400} />
                      ) : (
                        <StringCountUp targetText={formatCurrency(summaryValues[card.key])} duration={1600} />
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.1}>
          <Card variant="elevated" padding="lg">
            <h2 className="mb-6 text-lg font-semibold text-[#2D3436]">Budget by Category</h2>
            <div className="space-y-5">
              {categories.map((cat, idx) => {
                const meta = categoryMeta[cat];
                const amount = categoryTotals[cat];
                const percentage = maxCategoryAmount > 0 ? (amount / maxCategoryAmount) * 100 : 0;
                return (
                  <motion.div
                    key={cat}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06, duration: 0.4 }}
                  >
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#2D3436]">{cat}</span>
                        <span className="text-sm font-semibold text-gray-700">{formatCurrency(amount)}</span>
                      </div>
                      <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className={`absolute inset-y-0 left-0 rounded-full ${
                            meta.barColor === "green" ? "bg-green-500" :
                            meta.barColor === "orange" ? "bg-[#E85D04]" :
                            meta.barColor === "blue" ? "bg-blue-500" :
                            "bg-red-500"
                          }`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card variant="elevated" padding="lg">
            <h2 className="mb-6 text-lg font-semibold text-[#2D3436]">Currency Converter</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select label="From" options={currencyOptions} value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} />
              <Input label="Amount" type="number" placeholder="Enter amount" value={convertAmount} onChange={(e) => setConvertAmount(e.target.value)} min={0} />
              <Select label="To" options={currencyOptions} value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} />
            </div>
            {convertAmount && Number(convertAmount) > 0 && (
              <motion.div
                className="mt-5 rounded-xl bg-[#E8F0E9] p-4 text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-gray-600">Converted Amount</p>
                <p className="mt-1 text-2xl font-bold text-[#1B4332]">
                  {currencySymbols[toCurrency]}{" "}
                  {conversionResult.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {currencySymbols[fromCurrency]}{Number(convertAmount).toLocaleString("en-US")} {fromCurrency} → {toCurrency}
                </p>
              </motion.div>
            )}
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2D3436]">All Expenses</h2>
              <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Expense
              </Button>
            </div>

            <Card variant="elevated" padding="none">
              <div className="hidden border-b border-gray-100 px-6 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
                <span className="col-span-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</span>
                <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</span>
                <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</span>
                <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</span>
                <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Trip</span>
                <span className="col-span-1 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Action</span>
              </div>

              {expenseList.length === 0 ? (
                <div className="px-6 py-12 text-center"><p className="text-sm text-gray-500">No expenses recorded yet.</p></div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {expenseList.map((expense, idx) => (
                    <motion.div
                      key={expense.id}
                      className="px-6 py-4 transition-colors hover:bg-gray-50 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.03, duration: 0.35 }}
                    >
                      <div className="col-span-4 mb-2 sm:mb-0"><p className="text-sm font-medium text-[#2D3436]">{expense.description}</p></div>
                      <div className="col-span-2 mb-2 sm:mb-0"><Badge variant={categoryMeta[expense.category]?.badgeVariant || "default"} size="sm">{expense.category}</Badge></div>
                      <div className="col-span-2 mb-2 sm:mb-0"><span className="text-sm font-semibold text-[#1B4332]">{formatCurrency(expense.amount)}</span></div>
                      <div className="col-span-2 mb-2 sm:mb-0"><span className="text-sm text-gray-500">{formatDate(expense.date)}</span></div>
                      <div className="col-span-1 mb-2 sm:mb-0"><span className="text-sm text-gray-600">{getTripName(expense.trip_id)}</span></div>
                      <div className="col-span-1 flex justify-end">
                        <button onClick={() => handleDelete(expense.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-110 cursor-pointer" title="Delete expense">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </ScrollReveal>
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setForm(emptyForm); }} title="Add New Expense" description="Record a new travel expense.">
        <div className="space-y-4">
          <Select label="Trip" placeholder="Select a trip" options={tripOptions} value={form.tripId} onChange={(e) => handleFormChange("tripId", e.target.value)} />
          <Select label="Category" placeholder="Select a category" options={categoryOptions} value={form.category} onChange={(e) => handleFormChange("category", e.target.value)} />
          <Input label="Description" placeholder="What was this expense for?" value={form.description} onChange={(e) => handleFormChange("description", e.target.value)} />
          <Input label="Amount (₹)" type="number" placeholder="0" value={form.amount} onChange={(e) => handleFormChange("amount", e.target.value)} min={0} />
          <Input label="Date" type="date" value={form.date} onChange={(e) => handleFormChange("date", e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#2D3436]">Notes</label>
            <textarea className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-[#2D3436] transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20" rows={3} placeholder="Additional notes (optional)" value={form.notes} onChange={(e) => handleFormChange("notes", e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => { setModalOpen(false); setForm(emptyForm); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Expense</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
