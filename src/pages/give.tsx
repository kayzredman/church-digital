import React, { useState } from 'react';
import { Card, Button, Input } from '@/components';
import { Heart, CreditCard, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks';

export default function GivePage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paystack'>('stripe');
  const [giveAnonymously, setGiveAnonymously] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const toast = useToast();

  const quickAmounts = [50, 100, 200, 500];

  const handleDonate = async () => {
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }

    if (!giveAnonymously && (!email || !name)) {
      toast.error('Please provide your name and email');
      return;
    }

    // TODO: Implement actual payment processing
    toast.success('Redirecting to payment...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative text-white py-12 overflow-hidden">
        {/* Gradient Background with Transparency */}
        <div className="absolute inset-0" style={{ background: '#EDD550' }}></div>
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Support Our Ministry</h1>
          <p className="text-xl" style={{ color: '#FFFBEA' }}>
            Your generous giving helps us serve and impact our community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Giving Form */}
          <div className="md:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold mb-6 text-gray-600">Make a Donation</h2>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`py-2 px-3 rounded-lg font-medium transition ${
                        amount === quickAmount.toString()
                          ? ''
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                      style={amount === quickAmount.toString() ? { background: '#EDD550', color: '#7B6B1A' } : {}}
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Custom Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  label="Or enter custom amount"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-4 border-2 rounded-lg transition ${
                      paymentMethod === 'stripe'
                        ? ''
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={paymentMethod === 'stripe' ? { borderColor: '#EDD550', background: '#FFFBEA' } : {}}
                  >
                    <CreditCard size={24} className="mb-2" style={paymentMethod === 'stripe' ? { color: '#EDD550' } : {}} />
                    <p className="font-medium">Card</p>
                    <p className="text-sm text-gray-600">Visa / Mastercard</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paystack')}
                    className={`p-4 border-2 rounded-lg transition ${
                      paymentMethod === 'paystack'
                        ? ''
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={paymentMethod === 'paystack' ? { borderColor: '#EDD550', background: '#FFFBEA' } : {}}
                  >
                    <Smartphone size={24} className="mb-2" style={paymentMethod === 'paystack' ? { color: '#EDD550' } : {}} />
                    <p className="font-medium">Mobile Money</p>
                    <p className="text-sm text-gray-600">Momo / Airtel Money</p>
                  </button>
                </div>
              </div>

              {/* Donor Information */}
              <div className="mb-6">
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={giveAnonymously}
                    onChange={(e) => setGiveAnonymously(e.target.checked)}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-gray-700">Give anonymously</span>
                </label>

                {!giveAnonymously && (
                  <>
                    <Input
                      label="Full Name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mb-3"
                    />
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </>
                )}
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  placeholder="Share what inspired your giving..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ boxShadow: '0 0 0 2px #EDD55033' }}
                  rows={4}
                />
              </div>

              {/* Submit */}
              <Button
                className="w-full py-3 text-lg font-bold"
                style={{ background: '#EDD550', color: '#7B6B1A' }}
                onClick={handleDonate}
                disabled={!amount}
              >
                <Heart size={22} className="inline mr-3" style={{ color: '#7B6B1A' }} />
                {amount ? `Complete Donation of $${amount}` : <span style={{ fontWeight: 900, letterSpacing: '0.5px' }}>Enter Amount to Donate</span>}
              </Button>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            <Card className="" style={{ background: '#FFFBEA', borderColor: '#EDD550' }}>
              <h3 className="font-bold text-lg mb-2 text-gray-600">100% Transparent</h3>
              <p className="text-sm text-gray-700">
                Your giving is handled securely and every donation goes directly to our ministry.
              </p>
            </Card>

            <Card className="" style={{ background: '#FFFBEA', borderColor: '#EDD550' }}>
              <h3 className="font-bold text-lg mb-2 text-gray-600">Tax Deductible</h3>
              <p className="text-sm text-gray-700">
                We are a registered 501(c)(3) nonprofit. Keep your receipt for tax purposes.
              </p>
            </Card>

            <Card className="" style={{ background: '#FFFBEA', borderColor: '#EDD550' }}>
              <h3 className="font-bold text-lg mb-2 text-gray-600">Secure Payment</h3>
              <p className="text-sm text-gray-700">
                Your payment information is encrypted and processed securely.
              </p>
            </Card>

            <Card className="" style={{ background: '#FFFBEA', borderColor: '#EDD550' }}>
              <h3 className="font-bold text-lg mb-2 text-gray-600">Recurring Giving</h3>
              <p className="text-sm text-gray-700">
                Set up monthly giving to sustain our ministry consistently.
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-600">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-bold text-lg mb-2 text-gray-600">Where does my donation go?</h3>
              <p className="text-gray-700 text-sm">
                Your donation supports our community programs, salaries, facility maintenance, and mission work.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-lg mb-2 text-gray-600">Is my information secure?</h3>
              <p className="text-gray-700 text-sm">
                Yes! We use industry-standard encryption to protect your personal and payment information.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-lg mb-2 text-gray-600">Can I give online?</h3>
              <p className="text-gray-700 text-sm">
                Yes! You can give anytime using our secure online donation form above.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-lg mb-2 text-gray-600">Do you offer receipts?</h3>
              <p className="text-gray-700 text-sm">
                Yes! Receipts are sent to your email for tax deduction purposes.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
