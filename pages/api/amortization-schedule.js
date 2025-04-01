export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { loanAmount, interestRate, loanTerm, page = 1, pageSize = 12 } = req.body;

    // Validate inputs
    if (!loanAmount || !interestRate || !loanTerm) {
      return res.status(400).json({ 
        error: 'Missing required fields: loanAmount, interestRate, and loanTerm are required' 
      });
    }

    // Convert string inputs to numbers
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12; // Convert annual rate to monthly
    const n = parseFloat(loanTerm) * 12; // Convert years to months

    // Validate numeric values
    if (isNaN(P) || isNaN(r) || isNaN(n)) {
      return res.status(400).json({ error: 'Invalid numeric values provided' });
    }

    // Calculate monthly payment
    const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Calculate total schedule
    const schedule = [];
    let balance = P;
    let totalInterest = 0;
    let totalPrincipal = 0;

    for (let month = 1; month <= n; month++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      totalInterest += interestPayment;
      totalPrincipal += principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedSchedule = schedule.slice(startIndex, endIndex);

    // Calculate summary statistics
    const summary = {
      totalMonths: n,
      monthlyPayment,
      totalPayment: monthlyPayment * n,
      totalInterest,
      totalPrincipal,
      currentPage: page,
      totalPages: Math.ceil(n / pageSize),
      pageSize
    };

    return res.status(200).json({
      schedule: paginatedSchedule,
      summary
    });

  } catch (error) {
    console.error('Amortization schedule error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 