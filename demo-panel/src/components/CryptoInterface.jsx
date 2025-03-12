import React, { useEffect, useState } from 'react';
import { Bitcoin, Feather as Ethereum, ChevronDown, Copy, ArrowLeft, AlertCircle, Coins, ArrowUpRight, ArrowDownRight, Clock, History } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetCurrencies } from '../store/global.Action';


const cryptoOptions = [

  {
    symbol: 'USDT',
    name: 'Tether',
    icon: <img src='https://cryptologos.cc/logos/tether-usdt-logo.svg' className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm" />,
    networks: ['ERC20'],
    balance: 1250.00,
    price: 1.00,
  }
];



export default function CryptoInterface() {
  const [mode, setMode] = useState('deposit');
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(cryptoOptions[0].networks[0]);
  const [amount, setAmount] = useState('');
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const dispatch = useDispatch()
  const currencies = useSelector(state => state.global.currencies)
  useEffect(() => {
    dispatch(GetCurrencies())
  }, [])


  // Transaction history
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'deposit',
      amount: 0.5,
      symbol: 'BTC',
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000),
      coins: 3367250
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 1.2,
      symbol: 'ETH',
      status: 'completed',
      timestamp: new Date(Date.now() - 86400000),
      coins: 415200
    },
    {
      id: '3',
      type: 'deposit',
      amount: 500,
      symbol: 'USDT',
      status: 'pending',
      timestamp: new Date(),
      coins: 50000
    }
  ]);

  // Casino coin state
  const [casinoCoins, setCasinoCoins] = useState(1000); // Starting balance
  const conversionRate = 100; // 1 USDT = 100 casino coins

  const dummyAddress = '0xb285007A2306FCf0786b18DBFB23DFC52B8174a4';

  const handleCopy = () => {
    navigator.clipboard.writeText(dummyAddress);
  };

  const handleConvertToCasinoCoins = () => {
    const usdValue = selectedCrypto.balance * selectedCrypto.price;
    const newCoins = Math.floor(usdValue * conversionRate);

    // Add transaction record
    setTransactions(prev => [{
      id: Date.now().toString(),
      type: 'deposit',
      amount: selectedCrypto.balance,
      symbol: selectedCrypto.symbol,
      status: 'completed',
      timestamp: new Date(),
      coins: newCoins
    }, ...prev]);

    setCasinoCoins(prev => prev + newCoins);
  };

  const handleWithdrawCasinoCoins = (amount) => {
    if (amount <= casinoCoins) {
      const usdValue = amount / conversionRate;

      // Add transaction record
      setTransactions(prev => [{
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: parseFloat(amount),
        symbol: selectedCrypto.symbol,
        status: 'completed',
        timestamp: new Date(),
        coins: amount
      }, ...prev]);

      setCasinoCoins(prev => prev - amount);
    }
  };

  return (
    <div className="m-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white max-w-xl mx-auto">
      <div className="backdrop-blur-xl bg-gray-800/70 rounded-2xl p-8 shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center mb-10">
          <button
            onClick={() => { }}
            className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-center flex-1 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text mr-8">
            {mode === 'deposit' ? 'Deposit' : 'Withdraw'}
          </h1>
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:scale-105 relative"
          >
            <History className="w-6 h-6" />
            {transactions.some(tx => tx.status === 'pending') && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
            )}
          </button>
        </div>

        {showTransactions ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Transaction History
            </h2>
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-gray-700/30 p-6 rounded-xl backdrop-blur-sm border border-gray-600/20 hover:bg-gray-700/40 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {tx.type === 'deposit' ? (
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
                        <ArrowDownRight className="w-5 h-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center backdrop-blur-sm">
                        <ArrowUpRight className="w-5 h-5 text-blue-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-lg">
                        {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'} {tx.symbol}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-lg">
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.symbol}
                    </div>
                    <div className="text-sm text-gray-400">
                      {tx.coins?.toLocaleString()} Coins
                    </div>
                    <div className={`text-xs mt-1 ${tx.status === 'completed' ? 'text-green-500' :
                        tx.status === 'pending' ? 'text-yellow-500' :
                          'text-red-500'
                      } font-medium`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mode Toggle */}
            <div className="flex mb-10 bg-gray-700/50 rounded-full p-1 backdrop-blur-sm">
              <button
                onClick={() => setMode('deposit')}
                className={`flex-1 py-2 rounded-lg transition-colors ${mode === 'deposit' ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg' : 'hover:bg-gray-600/50'
                  }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setMode('withdraw')}
                className={`flex-1 py-2 rounded-lg transition-colors ${mode === 'withdraw' ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg' : 'hover:bg-gray-600/50'
                  }`}
              >
                Withdraw
              </button>
            </div>


            {/* Balance Display */}
            {/* <div className="bg-gray-700/30 p-6 rounded-2xl mb-8 backdrop-blur-sm border border-gray-600/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Available Balance</span>
            <div className="text-right">
              <div className="font-bold text-xl">{selectedCrypto.balance.toFixed(4)} {selectedCrypto.symbol}</div>
              <div className="text-sm text-gray-400">
                ≈ ${(selectedCrypto.balance * selectedCrypto.price).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-600/50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full shadow-lg" 
              style={{ width: `${Math.min((selectedCrypto.balance / 10) * 100, 100)}%` }}
            />
          </div>
        </div> */}

            <div className="space-y-4 mb-8">
              <div className="relative">
                <button
                  onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                  className="w-full flex items-center justify-between p-6 bg-gray-700/30 rounded-2xl hover:bg-gray-600/30 transition-all duration-200 backdrop-blur-sm border border-gray-600/20"
                >
                  <div className="flex items-center gap-3">
                    {selectedCrypto.icon}
                    <span className="font-medium">{selectedCrypto.name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showCryptoDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCryptoDropdown && (
                  <div className="absolute w-full mt-2 bg-gray-700/90 rounded-xl overflow-hidden z-10 backdrop-blur-md border border-gray-600/20 shadow-xl">
                    {currencies?.map((crypto) => (
                      <button
                        key={crypto.symbol}
                        onClick={() => {
                          setSelectedCrypto(crypto);
                          setSelectedNetwork(crypto.networks[0]);
                          setShowCryptoDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-600/50 transition-all duration-200"
                      >
                        {crypto.icon}
                        <span className="font-medium">{crypto.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                  className="w-full flex items-center justify-between p-6 bg-gray-700/30 rounded-2xl hover:bg-gray-600/30 transition-all duration-200 backdrop-blur-sm border border-gray-600/20"
                >
                  <span className="font-medium">Network: {selectedNetwork}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showNetworkDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showNetworkDropdown && (
                  <div className="absolute w-full mt-2 bg-gray-700/90 rounded-xl overflow-hidden z-10 backdrop-blur-md border border-gray-600/20 shadow-xl">
                    {selectedCrypto.networks.map((network) => (
                      <button
                        key={network}
                        onClick={() => {
                          setSelectedNetwork(network);
                          setShowNetworkDropdown(false);
                        }}
                        className="w-full p-4 text-left hover:bg-gray-600/50 transition-all duration-200 font-medium"
                      >
                        {network}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {mode === 'deposit' ? (
              <>


                {/* QR Code and Address */}
                <div className="bg-gray-700/30 p-8 rounded-2xl mb-8 backdrop-blur-sm border border-gray-600/20">
                  <div className="bg-white p-4 rounded-xl w-48 h-48 mx-auto mb-6 shadow-lg">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0xb285007A2306FCf0786b18DBFB23DFC52B8174a4"
                      alt="QR Code"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400">Deposit address</p>
                    <div className="bg-gray-800/50 p-4 rounded-xl break-all font-mono text-sm border border-gray-700/50">
                      {dummyAddress}
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={handleCopy}
                        className="w-full py-4 bg-gray-600/50 hover:bg-gray-500/50 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                      >
                        <Copy className="w-5 h-5" />
                        Copy Address
                      </button>
                      <button
                        onClick={handleConvertToCasinoCoins}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-bold shadow-lg"
                      >
                        <Coins className="w-5 h-5" />
                        Convert to Casino Coins
                      </button>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm border border-gray-700/30">
                  <AlertCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-400 text-sm">
                    Send only {selectedCrypto.symbol} to this deposit address. Transfers below 1 {selectedCrypto.symbol} will not be credited.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Withdrawal Form */}
                <div className="space-y-8">
                  {/* Amount Card */}
                  <div className="relative bg-gray-700/30 rounded-2xl p-8 backdrop-blur-sm border border-gray-600/20">
                    <label className="block text-sm text-gray-400 mb-4 font-medium">How much would you like to withdraw?</label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value) || value === '') {
                          setAmount(value);
                        }
                      }}
                      placeholder="0.00"
                      className="w-full bg-gray-700/50 rounded-xl p-6 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 border border-gray-600/30"
                    />
                    <div className="absolute right-6 top-[5.5rem] text-right">
                      {selectedCrypto.symbol}
                      {amount && (
                        <div className="text-sm text-gray-400">
                          ≈ ${(parseFloat(amount || '0') * selectedCrypto.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[0.25, 0.5, 0.75, 1].map((multiplier) => (
                        <button
                          key={multiplier}
                          onClick={() => setAmount((selectedCrypto.balance * multiplier).toFixed(4))}
                          className="py-2 px-3 rounded-lg bg-gray-600/50 hover:bg-gray-500/50 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                        >
                          {multiplier === 1 ? 'MAX' : `${multiplier * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="bg-gray-700/30 rounded-2xl p-8 backdrop-blur-sm border border-gray-600/20">
                    <label className="block text-sm text-gray-400 mb-4 font-medium">Where would you like to withdraw to?</label>
                    <input
                      type="text"
                      placeholder={`Enter ${selectedCrypto.symbol} address`}
                      className="w-full bg-gray-700/50 rounded-xl p-6 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600/30"
                    />
                  </div>

                  {/* Transaction Summary */}
                  <div className="bg-gray-700/30 rounded-2xl p-8 space-y-4 backdrop-blur-sm border border-gray-600/20">
                    <h3 className="font-medium mb-4">Transaction Summary</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Casino Coins to Convert</span>
                      <div className="text-right">
                        <div className="font-medium">{Math.floor(parseFloat(amount || '0') * selectedCrypto.price * conversionRate)} Coins</div>
                        <div className="text-xs text-gray-400">Rate: 1 USD = {conversionRate} Coins</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gray-600 pt-4">
                      <span className="text-gray-400">You will withdraw</span>
                      <div className="text-right">
                        <div className="font-medium">{amount || '0'} {selectedCrypto.symbol}</div>
                        <div className="text-xs text-gray-400">
                          ≈ ${(parseFloat(amount || '0') * selectedCrypto.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleWithdrawCasinoCoins(Math.floor(parseFloat(amount || '0') * selectedCrypto.price * conversionRate))}
                    className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-200 font-bold text-lg shadow-lg"
                  >
                    Convert & Withdraw {selectedCrypto.symbol}
                  </button>

                  <div className="flex items-start gap-3 bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm border border-gray-700/30">
                    <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-400 text-sm">
                      Please double-check the withdrawal address. Transactions cannot be reversed once confirmed.
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}