class LoanCalculator {
    constructor(principal, rate, years, downPayment) {
        this.principal = principal - downPayment;
        this.annualRate = rate;
        this.years = years;
        this.monthlyRate = this.annualRate / 100 / 12;
        this.totalPayments = this.years * 12;
    }

    calculateMonthlyPayment() {
        const { principal, monthlyRate, totalPayments } = this;
        return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    }

    calculateTotalPayment(monthlyPayment) {
        return monthlyPayment * this.totalPayments;
    }

    calculateTotalInterest(totalPayment) {
        return totalPayment - this.principal;
    }

    generateAmortizationSchedule(monthlyPayment) {
        let balance = this.principal;
        let amortizationSchedule = [];
        for (let i = 0; i < this.totalPayments; i++) {
            let interestPayment = balance * this.monthlyRate;
            let principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            amortizationSchedule.push({
                month: i + 1,
                principalPayment: principalPayment.toFixed(2),
                interestPayment: interestPayment.toFixed(2),
                balance: balance.toFixed(2)
            });
        }
        return amortizationSchedule;
    }
}

class InputValidator {
    static validate(inputs) {
        const { principal, rate, years, downPayment, bankName } = inputs;

        const rateRegex = /^(?:[1-9][0-9]?|99)$/;
        const yearsRegex = /^(?:[1-9]|[1-4][0-9]|50)$/;
        const bankNameRegex = /^[A-Z][a-zA-Z0-9\s]{0,49}$/;

        if (!rateRegex.test(rate)) {
            alert("Interest rate must be between 1 and 99 percent.");
            return false;
        }

        if (!yearsRegex.test(years)) {
            alert("Loan term must be between 1 and 50 years.");
            return false;
        }

        if (!bankNameRegex.test(bankName)) {
            alert("Bank name must start with a capital letter, can contain letters and numbers (not at the start), and be up to 50 characters long.");
            return false;
        }

        return [principal, rate, years, downPayment].every(input => input >= 0 && !isNaN(input));
    }
}

document.getElementById('loan-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const bankName = document.getElementById('bankName').value;
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const years = parseFloat(document.getElementById('years').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);

    const inputs = { bankName, principal, rate, years, downPayment };

    if (!InputValidator.validate(inputs)) {
        return;
    }

    const calculator = new LoanCalculator(principal, rate, years, downPayment);
    const monthlyPayment = calculator.calculateMonthlyPayment().toFixed(2);
    const totalPayment = calculator.calculateTotalPayment(monthlyPayment).toFixed(2);
    const totalInterest = calculator.calculateTotalInterest(totalPayment).toFixed(2);

    document.getElementById('monthly-payment').textContent = `$${monthlyPayment}`;
    document.getElementById('total-payment').textContent = `$${totalPayment}`;
    document.getElementById('total-interest').textContent = `$${totalInterest}`;

    const amortizationSchedule = calculator.generateAmortizationSchedule(monthlyPayment);
    const scheduleDiv = document.getElementById('amortization-schedule');
    scheduleDiv.innerHTML = '<h2>Amortization Schedule</h2>';
    amortizationSchedule.forEach(payment => {
        scheduleDiv.innerHTML += `<p>Month ${payment.month}: Principal: $${payment.principalPayment}, Interest: $${payment.interestPayment}, Balance: $${payment.balance}</p>`;
    });
});
