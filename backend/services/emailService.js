const nodemailer = require('nodemailer');

let transporter;

const buildTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }

  return transporter;
};

const sendEmail = async ({ to, subject, text }) => {
  if (!to) {
    return;
  }

  const sender = process.env.SMTP_FROM || 'ExpenseFlow <no-reply@expenseflow.local>';
  const mailer = buildTransporter();
  const info = await mailer.sendMail({ from: sender, to, subject, text });

  if (info.message) {
    console.log('Email payload:', info.message.toString());
  }
};

const sendBudgetExceededEmail = async ({ email, name, month, budget, spent, remaining }) => {
  await sendEmail({
    to: email,
    subject: `Budget exceeded for ${month}`,
    text: `Hi ${name || 'there'},\n\nYour budget for ${month} has been exceeded.\nBudget: INR ${budget.toFixed(2)}\nSpent: INR ${spent.toFixed(2)}\nRemaining: INR ${remaining.toFixed(2)}\n\nPlease review your expenses.`,
  });
};

const sendMonthlyReportEmail = async ({ email, name, month, income, expense, balance }) => {
  await sendEmail({
    to: email,
    subject: `Monthly Expense Report - ${month}`,
    text: `Hi ${name || 'there'},\n\nYour report for ${month} is ready.\nTotal Income: INR ${income.toFixed(2)}\nTotal Expense: INR ${expense.toFixed(2)}\nBalance: INR ${balance.toFixed(2)}\n\nThis report was generated from ExpenseFlow.`,
  });
};

module.exports = {
  sendBudgetExceededEmail,
  sendMonthlyReportEmail,
};
