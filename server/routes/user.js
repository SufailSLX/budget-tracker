const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-pin');
    
    res.json({
      success: true,
      profile: {
        fullName: user.fullName,
        email: user.email,
        accountCreated: user.createdAt,
        monthlyBudget: user.monthlyBudget,
        linkedAccounts: user.linkedAccounts,
        savingsGoals: user.savingsGoals,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update monthly budget and get savings suggestions
router.post('/savings-plan', [
  auth,
  body('monthlyBudget')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Monthly budget must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { monthlyBudget } = req.body;

    // Update user's monthly budget
    await User.findByIdAndUpdate(req.user._id, { monthlyBudget });

    // Calculate savings suggestions
    const suggestions = [
      {
        title: "Emergency Fund",
        amount: Math.round(monthlyBudget * 0.2),
        percentage: 20,
        description: "Build a safety net for unexpected expenses",
        priority: "high",
        icon: "🛡️"
      },
      {
        title: "Investment Portfolio",
        amount: Math.round(monthlyBudget * 0.15),
        percentage: 15,
        description: "Grow your wealth with smart investments",
        priority: "medium",
        icon: "📈"
      },
      {
        title: "Entertainment & Leisure",
        amount: Math.round(monthlyBudget * 0.1),
        percentage: 10,
        description: "Enjoy life while staying within budget",
        priority: "low",
        icon: "🎉"
      },
      {
        title: "Health & Wellness",
        amount: Math.round(monthlyBudget * 0.08),
        percentage: 8,
        description: "Invest in your physical and mental health",
        priority: "medium",
        icon: "💪"
      },
      {
        title: "Education & Skills",
        amount: Math.round(monthlyBudget * 0.07),
        percentage: 7,
        description: "Continuous learning for career growth",
        priority: "medium",
        icon: "📚"
      }
    ];

    // Calculate remaining budget
    const totalSuggested = suggestions.reduce((sum, suggestion) => sum + suggestion.amount, 0);
    const remainingBudget = monthlyBudget - totalSuggested;

    res.json({
      success: true,
      message: 'Savings plan calculated successfully! ✨',
      data: {
        monthlyBudget,
        suggestions,
        totalSuggested,
        remainingBudget,
        utilizationPercentage: Math.round((totalSuggested / monthlyBudget) * 100)
      }
    });

  } catch (error) {
    console.error('Savings plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate savings plan'
    });
  }
});

// Link third-party account
router.post('/link-account', [
  auth,
  body('provider')
    .isIn(['google', 'apple', 'facebook', 'bank'])
    .withMessage('Invalid provider'),
  body('accountId')
    .notEmpty()
    .withMessage('Account ID is required'),
  body('accountName')
    .notEmpty()
    .withMessage('Account name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { provider, accountId, accountName } = req.body;

    const user = await User.findById(req.user._id);
    
    // Check if account is already linked
    const existingAccount = user.linkedAccounts.find(
      account => account.provider === provider && account.accountId === accountId
    );

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'This account is already linked'
      });
    }

    // Add new linked account
    user.linkedAccounts.push({
      provider,
      accountId,
      accountName,
      linkedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: `${provider} account linked successfully! 🔗`,
      linkedAccount: {
        provider,
        accountName,
        linkedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Link account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link account'
    });
  }
});

// Unlink third-party account
router.delete('/unlink-account/:accountId', auth, async (req, res) => {
  try {
    const { accountId } = req.params;

    const user = await User.findById(req.user._id);
    const accountIndex = user.linkedAccounts.findIndex(
      account => account._id.toString() === accountId
    );

    if (accountIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Linked account not found'
      });
    }

    const removedAccount = user.linkedAccounts[accountIndex];
    user.linkedAccounts.splice(accountIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: `${removedAccount.provider} account unlinked successfully`,
      unlinkedAccount: removedAccount
    });

  } catch (error) {
    console.error('Unlink account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlink account'
    });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month transactions
    const currentMonthTransactions = await Transaction.find({
      userId,
      date: { $gte: startOfMonth }
    });

    // Last month transactions
    const lastMonthTransactions = await Transaction.find({
      userId,
      date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Calculate current month stats
    const currentCredits = currentMonthTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = currentCredits - currentExpenses;

    // Calculate last month stats
    const lastCredits = lastMonthTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastBalance = lastCredits - lastExpenses;

    // Calculate percentage changes
    const creditChange = lastCredits === 0 ? 100 : ((currentCredits - lastCredits) / lastCredits) * 100;
    const expenseChange = lastExpenses === 0 ? 100 : ((currentExpenses - lastExpenses) / lastExpenses) * 100;
    const balanceChange = lastBalance === 0 ? 100 : ((currentBalance - lastBalance) / Math.abs(lastBalance)) * 100;

    res.json({
      success: true,
      stats: {
        totalCredits: {
          value: currentCredits,
          change: Math.round(creditChange)
        },
        totalExpenses: {
          value: currentExpenses,
          change: Math.round(expenseChange)
        },
        balance: {
          value: currentBalance,
          change: Math.round(balanceChange)
        },
        transactionCount: currentMonthTransactions.length,
        period: {
          current: {
            start: startOfMonth,
            end: now
          },
          previous: {
            start: startOfLastMonth,
            end: endOfLastMonth
          }
        }
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Update user preferences
router.patch('/preferences', [
  auth,
  body('preferences').isObject().withMessage('Preferences must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { preferences } },
      { new: true, runValidators: true }
    ).select('-pin');

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

module.exports = router;