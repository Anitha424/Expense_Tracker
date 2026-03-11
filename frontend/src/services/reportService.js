/**
 * Report Service - Handles PDF and Excel export functionality
 */

import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export transactions to Excel file
 * @param {Array} transactions - array of transactions
 * @param {Array} categories - array of categories
 * @param {string} filename - output filename
 */
export const exportToExcel = (transactions, categories, filename = 'expense-report') => {
  try {
    // Prepare data for Excel
    const transactionData = transactions.map((t) => ({
      Date: new Date(t.date).toLocaleDateString(),
      Title: t.title,
      Amount: `₹${t.amount}`,
      Category: t.category,
      Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
    }));

    // Calculate category totals
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      });

    const categoryData = Object.entries(categoryTotals).map(([category, total]) => ({
      Category: category,
      Total: `₹${total.toFixed(2)}`,
    }));

    // Calculate monthly summary
    const monthlyTotals = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (t.type === 'expense') {
        monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + Number(t.amount);
      }
    });

    const monthlyData = Object.entries(monthlyTotals).map(([month, total]) => ({
      Month: month,
      Expenses: `₹${total.toFixed(2)}`,
    }));

    // Create Excel workbook
    const wb = XLSX.utils.book_new();

    // Add sheets
    const transactionSheet = XLSX.utils.json_to_sheet(transactionData);
    const categorySheet = XLSX.utils.json_to_sheet(categoryData);
    const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);

    // Set column widths
    transactionSheet['!cols'] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 10 },
    ];

    XLSX.utils.book_append_sheet(wb, transactionSheet, 'Transactions');
    XLSX.utils.book_append_sheet(wb, categorySheet, 'Category Totals');
    XLSX.utils.book_append_sheet(wb, monthlySheet, 'Monthly Summary');

    // Generate file
    XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
};

/**
 * Export report to PDF
 * @param {Array} transactions - array of transactions
 * @param {Array} categories - array of categories
 * @param {string} filename - output filename
 */
export const exportToPDF = async (transactions, categories, filename = 'expense-report') => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 10;

    // Title
    pdf.setFontSize(18);
    pdf.text('Expense Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Date range
    pdf.setFontSize(10);
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );
    yPosition += 8;

    // Summary Section
    pdf.setFontSize(12);
    pdf.text('Summary', 10, yPosition);
    yPosition += 6;

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    pdf.setFontSize(10);
    pdf.text(`Total Income: ₹${totalIncome.toFixed(2)}`, 10, yPosition);
    yPosition += 5;
    pdf.text(`Total Expense: ₹${totalExpense.toFixed(2)}`, 10, yPosition);
    yPosition += 5;
    pdf.text(`Net Savings: ₹${(totalIncome - totalExpense).toFixed(2)}`, 10, yPosition);
    yPosition += 8;

    // Category Breakdown
    pdf.setFontSize(12);
    pdf.text('Spending by Category', 10, yPosition);
    yPosition += 6;

    const categoryTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      });

    pdf.setFontSize(9);
    Object.entries(categoryTotals).forEach(([category, total]) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 10;
      }
      pdf.text(`${category}: ₹${total.toFixed(2)}`, 10, yPosition);
      yPosition += 5;
    });

    yPosition += 5;

    // Recent Transactions
    pdf.setFontSize(12);
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 10;
    }
    pdf.text('Recent Transactions', 10, yPosition);
    yPosition += 6;

    // Table headers
    pdf.setFontSize(9);
    const headers = ['Date', 'Title', 'Amount', 'Category', 'Type'];
    const columnWidths = [
      pageWidth * 0.15 - 10,
      pageWidth * 0.25 - 10,
      pageWidth * 0.15 - 10,
      pageWidth * 0.25 - 10,
      pageWidth * 0.1 - 10,
    ];
    let xPos = 10;

    headers.forEach((header, i) => {
      pdf.text(header, xPos, yPosition, { maxWidth: columnWidths[i] });
      xPos += columnWidths[i];
    });

    yPosition += 5;
    pdf.setDrawColor(0);
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 3;

    // Table data (last 20 transactions)
    const recentTransactions = [...transactions].reverse().slice(0, 20);
    pdf.setFontSize(8);

    recentTransactions.forEach((t) => {
      if (yPosition > pageHeight - 10) {
        pdf.addPage();
        yPosition = 10;
      }

      xPos = 10;
      pdf.text(new Date(t.date).toLocaleDateString(), xPos, yPosition);
      xPos += columnWidths[0];
      pdf.text(t.title, xPos, yPosition, { maxWidth: columnWidths[1] });
      xPos += columnWidths[1];
      pdf.text(`₹${t.amount}`, xPos, yPosition);
      xPos += columnWidths[2];
      pdf.text(t.category, xPos, yPosition, { maxWidth: columnWidths[3] });
      xPos += columnWidths[3];
      pdf.text(t.type.charAt(0).toUpperCase() + t.type.slice(1), xPos, yPosition);

      yPosition += 4;
    });

    // Save PDF
    pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export to PDF');
  }
};

/**
 * Generate spending insights based on transactions
 * @param {Array} transactions - array of transactions
 * @param {Array} categories - array of categories
 * @returns {Array} - array of insight objects
 */
export const generateSpendingInsights = (transactions, categories) => {
  const insights = [];

  // Get current month transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Get previous month transactions
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const prevMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
  });

  // Calculate current month spending by category
  const currentCategoryTotals = {};
  currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      currentCategoryTotals[t.category] = (currentCategoryTotals[t.category] || 0) + Number(t.amount);
    });

  // Top spending category
  if (Object.keys(currentCategoryTotals).length > 0) {
    const topCategory = Object.entries(currentCategoryTotals).sort(([, a], [, b]) => b - a)[0];
    insights.push({
      type: 'category',
      icon: '📊',
      message: `You spent ₹${topCategory[1].toFixed(0)} on ${topCategory[0]} this month.`,
      urgency: 'normal',
    });
  }

  // Total spending comparison
  const currentTotal = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevTotal = prevMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (prevTotal > 0) {
    const percentChange = ((currentTotal - prevTotal) / prevTotal) * 100;
    if (percentChange > 5) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        message: `Your spending increased by ${percentChange.toFixed(1)}% compared to last month.`,
        urgency: 'high',
      });
    } else if (percentChange < -5) {
      insights.push({
        type: 'positive',
        icon: '🎉',
        message: `Great! Your spending decreased by ${Math.abs(percentChange).toFixed(1)}% compared to last month.`,
        urgency: 'normal',
      });
    }
  }

  // Daily average
  const daysWithTransactions = new Set(currentMonthTransactions.map((t) => new Date(t.date).getDate()));
  if (daysWithTransactions.size > 0) {
    const dailyAverage = (currentTotal / daysWithTransactions.size).toFixed(0);
    insights.push({
      type: 'info',
      icon: '📈',
      message: `Your daily average spending is ₹${dailyAverage}.`,
      urgency: 'normal',
    });
  }

  // Budget safety
  if (currentTotal === 0 && currentMonthTransactions.length === 0) {
    insights.push({
      type: 'info',
      icon: '💡',
      message: 'No expenses recorded this month yet. Start tracking to get insights!',
      urgency: 'normal',
    });
  }

  return insights;
};
