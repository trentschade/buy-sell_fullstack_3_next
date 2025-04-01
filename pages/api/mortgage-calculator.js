export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { loanAmount, interestRate, loanTerm } = req.body;

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

    // Calculate monthly payment using the mortgage payment formula
    // M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Round to 2 decimal places
    const roundedPayment = Math.round(monthlyPayment * 100) / 100;

    return res.status(200).json({
      monthlyPayment: roundedPayment,
      totalPayment: roundedPayment * n,
      totalInterest: (roundedPayment * n) - P
    });

  } catch (error) {
    console.error('Mortgage calculator error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 