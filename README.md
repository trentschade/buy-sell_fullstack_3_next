# Buy-Sell Calculator

A comprehensive real estate calculator that helps users plan their home selling and buying process. This application provides detailed financial insights to help make informed decisions about selling your current home and purchasing a new one.

## Features

- **Unified Calculator**: A single-page application that combines selling, payoff, and purchasing calculations
- **Monthly Payment Matrix**: Visual representation of monthly payments across different sale and purchase price scenarios
- **Confidence Levels**: Adjust confidence levels for sale and purchase prices to see a range of possible outcomes
- **Down Payment Sufficiency**: Visual indicators showing when available funds from your sale are insufficient for your desired down payment
- **Detailed Cost Breakdowns**: Expandable sections for detailed selling costs, payoff details, and purchase details
- **Target Monthly Payment**: Set your target monthly payment and see color-coded results in the payment matrix
- **Real-time Calculations**: All calculations update in real-time as you adjust sliders
- **Responsive Design**: Works on desktop and mobile devices

## Key Components

- **Monthly Payment Matrix**: A 5×5 grid showing monthly payments across different sale and purchase price combinations, with color coding for payment targets and down payment sufficiency
- **Sale Price Calculator**: Estimate your home's sale price and calculate selling costs
- **Payoff Calculator**: Calculate the total amount needed to pay off existing mortgages and loans
- **Purchase Price Calculator**: Estimate the purchase price of your new home and calculate down payment
- **Target Monthly Payment**: Easily adjust your target payment to see how it affects affordability

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd buy-sell-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Set Your Target Monthly Payment**: Use the slider to set your target monthly payment
2. **Adjust Sale Price**: Set your estimated sale price and confidence level
3. **Adjust Payoff Amount**: Set your total payoff amount or expand to set individual components
4. **Adjust Purchase Price**: Set your estimated purchase price and confidence level
5. **View Results in the Matrix**: See color-coded monthly payments across different price combinations:
   - **Green**: Within target monthly payment
   - **Yellow**: Within 10% of target payment
   - **Red**: Exceeds target by more than 10% or insufficient down payment
6. **Check Down Payment Sufficiency**: Cells where your sale proceeds are insufficient for the desired down payment will show the available percentage
7. **Explore Detailed Options**: Expand each section to adjust detailed parameters

## Deployment

This application can be deployed to any Node.js hosting platform. Some options include:

- **Digital Ocean**: Deploy as a standalone Node.js application or using App Platform
- **Vercel**: Optimized for Next.js applications with simple deployment workflow
- **Netlify**: Easy deployment from Git repositories
- **AWS/GCP/Azure**: Deploy as a container or using serverless functions

## Technologies Used

- React 
- Next.js
- CSS Modules
- JavaScript

## License

This project is licensed under the MIT License - see the LICENSE file for details.
