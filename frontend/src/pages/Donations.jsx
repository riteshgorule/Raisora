import React, { useState } from 'react';
import { DollarSign, Heart, Target, Users, CreditCard, Shield, Award, TrendingUp, Globe, CheckCircle } from 'lucide-react';

const Donations = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [selectedCause, setSelectedCause] = useState('general');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const causes = [
    { id: 'general', name: 'General Fund', description: 'Support all our initiatives', raised: 850000, goal: 1000000, color: '#02c39a' },
    { id: 'environment', name: 'Environment', description: 'Climate action and conservation', raised: 650000, goal: 800000, color: '#10b981' },
    { id: 'education', name: 'Education', description: 'Quality education for all', raised: 420000, goal: 600000, color: '#f59e0b' },
    { id: 'healthcare', name: 'Healthcare', description: 'Medical care and mental health', raised: 380000, goal: 500000, color: '#ef4444' },
    { id: 'human-rights', name: 'Human Rights', description: 'Equality and justice initiatives', raised: 290000, goal: 400000, color: '#8b5cf6' }
  ];

  const impactExamples = [
    { amount: 25, impact: 'Provides clean water for 1 person for 6 months' },
    { amount: 50, impact: 'Funds educational materials for 5 children' },
    { amount: 100, impact: 'Supports mental health counseling for 2 people' },
    { amount: 250, impact: 'Plants 50 trees and maintains them for a year' },
    { amount: 500, impact: 'Provides job training for 10 individuals' },
    { amount: 1000, impact: 'Builds a water well serving 100 families' }
  ];

  const recentDonors = [
    { name: 'Sarah M.', amount: 100, cause: 'Environment', time: '2 minutes ago' },
    { name: 'John D.', amount: 250, cause: 'Education', time: '5 minutes ago' },
    { name: 'Maria R.', amount: 50, cause: 'Healthcare', time: '8 minutes ago' },
    { name: 'David L.', amount: 500, cause: 'General Fund', time: '12 minutes ago' },
    { name: 'Anonymous', amount: 1000, cause: 'Human Rights', time: '15 minutes ago' }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const getCurrentAmount = () => {
    return customAmount ? parseInt(customAmount) || 0 : selectedAmount;
  };

  const getCurrentImpact = () => {
    const amount = getCurrentAmount();
    const impact = impactExamples.find(example => example.amount <= amount);
    return impact ? impact.impact : 'Every donation makes a difference';
  };

  const selectedCauseData = causes.find(cause => cause.id === selectedCause);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#02c39a] to-[#016b52] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Make a Donation</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Your contribution helps us create lasting positive change in communities worldwide.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Donation</h2>

              {/* Donation Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Donation Type</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      donationType === 'one-time'
                        ? 'bg-[#02c39a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      donationType === 'monthly'
                        ? 'bg-[#02c39a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount {donationType === 'monthly' && '(per month)'}
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map(amount => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        selectedAmount === amount && !customAmount
                          ? 'bg-[#02c39a] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Cause Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose a Cause</label>
                <div className="space-y-3">
                  {causes.map(cause => (
                    <div
                      key={cause.id}
                      onClick={() => setSelectedCause(cause.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                        selectedCause === cause.id
                          ? 'border-[#02c39a] bg-[#02c39a]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{cause.name}</h4>
                          <p className="text-sm text-gray-600">{cause.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ${(cause.raised / 1000).toFixed(0)}K / ${(cause.goal / 1000).toFixed(0)}K
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(cause.raised / cause.goal) * 100}%`,
                                backgroundColor: cause.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'card'
                        ? 'border-[#02c39a] bg-[#02c39a]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'paypal'
                        ? 'border-[#02c39a] bg-[#02c39a]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="font-medium">PayPal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donate Button */}
              <button className="w-full bg-[#02c39a] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#016b52] transition-colors duration-200 flex items-center justify-center">
                <Heart className="mr-2 h-5 w-5" />
                Donate ${getCurrentAmount()} {donationType === 'monthly' && 'Monthly'}
              </button>

              {/* Security Notice */}
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Your donation is secure and encrypted. We never store your payment information.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Impact</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#02c39a] mb-2">${getCurrentAmount()}</div>
                <div className="text-sm text-gray-600 mb-4">{donationType === 'monthly' ? 'per month' : 'one-time'}</div>
                <div className="bg-[#f0f3bd]/30 rounded-lg p-4">
                  <Target className="h-8 w-8 text-[#02c39a] mx-auto mb-2" />
                  <p className="text-sm text-gray-700">{getCurrentImpact()}</p>
                </div>
              </div>
            </div>

            {/* Selected Cause Progress */}
            {selectedCauseData && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedCauseData.name}</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Raised</span>
                    <span>${(selectedCauseData.raised / 1000).toFixed(0)}K of ${(selectedCauseData.goal / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(selectedCauseData.raised / selectedCauseData.goal) * 100}%`,
                        backgroundColor: selectedCauseData.color
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{selectedCauseData.description}</p>
              </div>
            )}

            {/* Recent Donations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Donations</h3>
              <div className="space-y-3">
                {recentDonors.map((donor, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{donor.name}</div>
                      <div className="text-gray-500">{donor.cause}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#02c39a]">${donor.amount}</div>
                      <div className="text-gray-500">{donor.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Deductible Notice */}
            <div className="bg-[#f0f3bd]/30 rounded-2xl p-6">
              <div className="flex items-center mb-3">
                <Award className="h-6 w-6 text-[#02c39a] mr-2" />
                <h3 className="font-bold text-gray-900">Tax Deductible</h3>
              </div>
              <p className="text-sm text-gray-700">
                Your donation is tax-deductible. You'll receive a receipt via email for your records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Impact Stats */}
      <section className="py-16 bg-[#02c39a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Donation Impact Worldwide</h2>
            <p className="text-xl text-white/90">See how donations are making a difference globally</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#f0f3bd] mb-2">$2.8M</div>
              <div className="text-white text-lg">Total Raised</div>
              <div className="text-white/70 text-sm">This year</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#f0f3bd] mb-2">15K</div>
              <div className="text-white text-lg">Active Donors</div>
              <div className="text-white/70 text-sm">Monthly contributors</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#f0f3bd] mb-2">89</div>
              <div className="text-white text-lg">Funded Projects</div>
              <div className="text-white/70 text-sm">Completed this year</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#f0f3bd] mb-2">1.2M</div>
              <div className="text-white text-lg">Lives Impacted</div>
              <div className="text-white/70 text-sm">Through donations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Your Donation Matters</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every contribution, no matter the size, creates ripple effects of positive change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-[#02c39a]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Impact</h3>
              <p className="text-gray-600">
                100% of your donation goes directly to programs and initiatives, creating immediate positive change.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#02c39a]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Driven</h3>
              <p className="text-gray-600">
                Your support helps build stronger communities and empowers local leaders to create lasting change.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-[#02c39a]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Growth</h3>
              <p className="text-gray-600">
                We focus on long-term solutions that create sustainable improvements in communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donations;