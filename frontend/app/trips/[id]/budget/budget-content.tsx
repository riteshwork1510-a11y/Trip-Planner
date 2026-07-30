"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { getTrip, type Trip } from "@/lib/api/trips";
import { getExpenses, createExpense, deleteExpense, type Expense, type ExpenseCategory } from "@/lib/api/expenses";
import { formatCurrency, formatDate, formatDateRange, generateId } from "@/lib/utils";

const categoryConfig: Record<string, { emoji: string; color: "green" | "orange" | "blue" | "red" }> = {
  Hotels: { emoji: "🏨", color: "blue" },
  Food: { emoji: "🍽️", color: "orange" },
  Transportation: { emoji: "🚗", color: "blue" },
  Activities: { emoji: "🎯", color: "green" },
  Shopping: { emoji: "🛍️", color: "orange" },
  Miscellaneous: { emoji: "📦", color: "red" },
};

const categoryBadgeVariant: Record<string, "info" | "success" | "warning" | "danger" | "default"> = {
  Hotels: "info",
  Food: "warning",
  Transportation: "info",
  Activities: "success",
  Shopping: "default",
  Miscellaneous: "default",
};

const categoryOptions = Object.keys(categoryConfig).map((c) => ({
  label: c,
  value: c,
}));

export default function BudgetContent() {
  const params = useParams();
  const tripId = params.id as string;
  const { addToast } = useToast();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripExpenses, setTripExpenses] = useState<Expense[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [tripRes, expensesRes] = await Promise.all([
        getTrip(tripId),
        getExpenses(tripId),
      ]);
      if (tripRes.success && tripRes.data) setTrip(tripRes.data);
      if (expensesRes.success && expensesRes.data) setTripExpenses(expensesRes.data);
    } catch {
      addToast("Failed to load trip data", "error");
    } finally {
      setLoading(false);
    }
  }, [tripId, addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const cat of Object.keys(categoryConfig)) {
      totals[cat] = tripExpenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
    }
    return totals;
  }, [tripExpenses]);

  const totalSpent = tripExpenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <DashboardLayout title="Trip Budget">
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B4332] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout title="Trip Budget">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-6xl">🗺️</div>
          <h2 className="text-2xl font-bold text-[#2D3436]">Trip not found</h2>
          <p className="text-gray-500">The trip you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/trips"><Button variant="primary">Back to Trips</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const remaining = trip.budget - totalSpent;
  const budgetPercentage = trip.budget > 0 ? Math.min(Math.round((totalSpent / trip.budget) * 100), 100) : 0;

  async function handleAddExpense() {
    if (!formCategory || !formDescription.trim() || !formAmount || !formDate) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    try {
      const res = await createExpense({
        trip_id: tripId,
        category: formCategory as ExpenseCategory,
        description: formDescription.trim(),
        amount: Number(formAmount),
        date: formDate,
        currency: "INR",
      });
      if (res.success && res.data) {
        setTripExpenses((prev) => [res.data!, ...prev]);
        addToast("Expense added successfully!", "success");
        setModalOpen(false);
        resetForm();
        fetchData();
      }
    } catch {
      addToast("Failed to add expense", "error");
    }
  }

  async function handleDeleteExpense(expenseId: string) {
    try {
      const res = await deleteExpense(expenseId);
      if (res.success) {
        setTripExpenses((prev) => prev.filter((e) => e.id !== expenseId));
        addToast("Expense removed", "info");
        fetchData();
      }
    } catch {
      addToast("Failed to delete expense", "error");
    }
  }

  function resetForm() {
    setFormCategory("");
    setFormDescription("");
    setFormAmount("");
    setFormDate("");
  }

  return (
    <DashboardLayout title="Trip Budget" breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "My Trips", href: "/trips" }, { label: trip.destination, href: `/trips/${tripId}` }, { label: "Budget" }]}>
      {/* Budget Header */}
      <div className="mb-8">
        <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1B4332] transition-colors mb-4">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to {trip.destination}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2D3436]">{trip.destination} Budget</h1>
            {trip.start_date && trip.end_date && <p className="text-sm text-gray-500 mt-1">{formatDateRange(trip.start_date, trip.end_date)}</p>}
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Expense
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]/10 text-lg">💰</div>
            <div>
              <p className="text-xs text-gray-500">Total Budget</p>
              <p className="text-lg font-bold text-[#2D3436]">{formatCurrency(trip.budget)}</p>
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E85D04]/10 text-lg">💳</div>
            <div>
              <p className="text-xs text-gray-500">Spent</p>
              <p className="text-lg font-bold text-[#E85D04]">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-lg">🪙</div>
            <div>
              <p className="text-xs text-gray-500">Remaining</p>
              <p className={`text-lg font-bold ${remaining >= 0 ? "text-[#1B4332]" : "text-red-600"}`}>{formatCurrency(remaining)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="elevated" padding="md" className="mb-8">
        <ProgressBar value={totalSpent} max={trip.budget} label="Budget Usage" showPercentage color={budgetPercentage > 90 ? "red" : budgetPercentage > 60 ? "orange" : "green"} />
      </Card>

      {/* Category Breakdown */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#2D3436] mb-4">Category Breakdown</h2>
        <Card variant="elevated" padding="none">
          <div className="divide-y divide-gray-100">
            {(Object.keys(categoryConfig) as ExpenseCategory[]).map((cat) => {
              const amount = categoryTotals[cat] || 0;
              const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
              const { emoji, color } = categoryConfig[cat];
              return (
                <div key={cat} className="flex items-center gap-4 px-5 py-4">
                  <span className="text-xl shrink-0">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#2D3436]">{cat}</span>
                      <span className="text-sm font-semibold text-[#2D3436]">{formatCurrency(amount)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ProgressBar value={amount} max={totalSpent || 1} showPercentage={false} color={color} className="flex-1" />
                      <span className="text-xs text-gray-500 w-10 text-right shrink-0">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between bg-gray-50 px-5 py-4 rounded-b-xl">
            <span className="text-sm font-bold text-[#2D3436]">Total</span>
            <span className="text-sm font-bold text-[#2D3436]">{formatCurrency(totalSpent)}</span>
          </div>
        </Card>
      </div>

      {/* Expense List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#2D3436]">
            Expenses
            {tripExpenses.length > 0 && <span className="ml-2 text-sm font-normal text-gray-500">({tripExpenses.length} {tripExpenses.length === 1 ? "item" : "items"})</span>}
          </h2>
        </div>

        {tripExpenses.length === 0 ? (
          <Card variant="elevated" padding="lg">
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="text-4xl">📝</div>
              <p className="text-sm text-gray-500">No expenses recorded for this trip yet.</p>
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>Add Your First Expense</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {tripExpenses.map((expense) => (
              <Card key={expense.id} variant="elevated" padding="md" className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg shrink-0">{categoryConfig[expense.category]?.emoji || "📦"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2D3436] truncate">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={categoryBadgeVariant[expense.category] || "default"} size="sm">{expense.category}</Badge>
                      <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-[#2D3436]">{formatCurrency(expense.amount)}</span>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer" title="Delete expense">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title="Add Expense" description="Track a new expense for this trip">
        <div className="flex flex-col gap-4">
          <Select label="Category" placeholder="Select category" options={categoryOptions} value={formCategory} onChange={(e) => setFormCategory(e.target.value)} />
          <Input label="Description" placeholder="e.g. Hotel booking, taxi fare..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          <Input label="Amount (₹)" type="number" placeholder="0" min={0} value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
          <Input label="Date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
          <div className="flex items-center justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button variant="primary" onClick={handleAddExpense}>Save Expense</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
