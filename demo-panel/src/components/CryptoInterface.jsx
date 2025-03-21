import React, { useEffect, useState } from 'react';
import { ChevronDown, Copy, ArrowLeft, AlertCircle, Coins, ArrowUpRight, ArrowDownRight, Clock, History, Repeat, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetCurrencies, GetWallet } from '../store/global.Action';
import { currentUserSelector, userWalletSelector } from '../store/global.Selctor';
import { convertToCasino, convertToCrypto, getBalance, getCasinoData, getERC20Balance, GetUserEvmWallet, withdrawCryptoToWallet } from '../utils/utils';



export default function CryptoInterface() {
  const [mode, setMode] = useState('deposit');
  const [conversionType, setConversionType] = useState('cryptoToCoins'); // New state for conversion direction

  const [selectedNetwork, setSelectedNetwork] = useState('ERC20');
  const [amount, setAmount] = useState('');
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const dispatch = useDispatch();
  const currencies = useSelector(state => state.global.currencies);
  const [jwtToken, setJwtToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [platformId, setPlatformId] = useState('');
  const [cryptoBalance, setcryptoBalance] = useState(0);
  const [casinoBalance, setcasinoBalance] = useState(0)
  const [casinoConfig, setcasinoConfig] = useState()
  const [userWallet, setuserWallet] = useState()
  const [cryptoPrice, setcryptoPrice] = useState(8.7)
  const [cryptoSymbol, setcryptoSymbol] = useState("usdt");
  const [cryptoIcon, setcryptoIcon] = useState(<img src='https://cryptologos.cc/logos/tether-usdt-logo.svg' className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm" />)
  const [cryptoName, setcryptoName] = useState("Tether")
  const [recipientAddress, setrecipientAddress] = useState()

  useEffect(() => {
    dispatch(GetCurrencies());
    extractFromUrl()
  }, [dispatch]);

  useEffect(() => {
    if (platformId) {
      const fa = async () => {
        const data = await getCasinoData(platformId);
        const bal = await getBalance({ apiUrl: data.balanceApi, userId: userId, secretToken: jwtToken });
        console.log("data =>", bal);
        const userWalletData = await GetUserEvmWallet({ userId: userId, platformId: platformId });
        const cryptoBalanceData = await getERC20Balance({ address: userWalletData.wallet[0].walletAddress, tokenAddress: "0x16B59e2d8274f2031c0eF4C9C460526Ada40BeDa" })
        setcryptoBalance(Number(cryptoBalanceData.balanceFormatted));
        setuserWallet(userWalletData);
        setcasinoBalance(bal)
        setcasinoConfig(data)
      }
      fa();
    }
  }, [platformId]);

  const extractFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Example: ?token=your_jwt_here
    const id = urlParams.get('userId');   // Example: ?userId=
    const platform = urlParams.get('platformId'); // Example: ?platform=
    console.log("data =>", token, id, platform);
    if (token) setJwtToken(token);
    if (id) setUserId(id);
    if (platform) setPlatformId(platform);
  };
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
  const [casinoCoins, setCasinoCoins] = useState(1000);
  const conversionRate = 100; // 1 USDT = 100 casino coins
  const dummyAddress = '0xb285007A2306FCf0786b18DBFB23DFC52B8174a4';

  const handleCopy = () => {
    navigator.clipboard.writeText(userWallet.wallet[0].walletAddress || dummyAddress);
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (conversionType === 'cryptoToCoins') {
      const cryptoAmount = parseFloat(amount);
      if (cryptoAmount > cryptoBalance) return;
      const usdValue = cryptoAmount * cryptoPrice;
      const newCoins = Math.floor(usdValue * conversionRate);
      await convertToCasino({ userId: userId, amount: cryptoAmount, wallet: userWallet.wallet[0].walletAddress, casinoId: platformId, secretKey: jwtToken });
      setTransactions(prev => [{
        id: Date.now().toString(),
        type: 'conversion',
        amount: cryptoAmount,
        symbol: cryptoSymbol,
        status: 'completed',
        timestamp: new Date(),
        coins: newCoins
      }, ...prev]);

      setCasinoCoins(prev => prev + newCoins);
    } else {
      const coinsAmount = parseFloat(amount);
      if (coinsAmount > casinoCoins) return;

      const cryptoValue = coinsAmount / conversionRate / cryptoPrice;
      await convertToCrypto({ amount: cryptoValue, userId: userId, casinoId: platformId, secretToken: jwtToken, casinoCoinAmount: coinsAmount, wallet: userWallet.wallet[0].walletAddress });
      setTransactions(prev => [{
        id: Date.now().toString(),
        type: 'conversion',
        amount: cryptoValue.toFixed(6),
        symbol: cryptoSymbol,
        status: 'completed',
        timestamp: new Date(),
        coins: -coinsAmount
      }, ...prev]);

      setCasinoCoins(prev => prev - coinsAmount);
    }
    setAmount('');
  };

  const calculateConversionPreview = () => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    if (conversionType === 'cryptoToCoins') {
      const cryptoAmount = parseFloat(amount);
      return `${Math.floor(cryptoAmount * cryptoPrice * conversionRate).toLocaleString()} Coins`;
    } else {
      const coinsAmount = parseFloat(amount);
      return `${(coinsAmount / conversionRate / cryptoPrice).toFixed(6)} ${cryptoSymbol}`;
    }
  };

  // Set appropriate max amount based on conversion type
  const setMaxAmount = () => {
    if (conversionType === 'cryptoToCoins') {
      setAmount(cryptoBalance.toFixed(4));
    } else {
      setAmount(casinoCoins.toString());
    }
  };

  const withdrawFn = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    await withdrawCryptoToWallet({ amount: parseFloat(amount), userId: userId, casinoId: platformId, secretToken: jwtToken, wallet: userWallet.wallet[0].walletAddress, recipientAddress: recipientAddress });
    setTransactions(prev => [{
      id: Date.now().toString(),
      type: 'withdrawal',
      amount: parseFloat(amount),
      symbol: cryptoSymbol,
      status: 'completed',
      timestamp: new Date(),
      coins: -parseInt(amount * conversionRate)
    }, ...prev]);
    setCasinoCoins(prev => prev + parseInt(amount * conversionRate));
    setAmount('');
  };




  return (
    <div className="m-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white max-w-lg mx-auto">
      <div className="backdrop-blur-xl bg-gray-800/70 rounded-2xl p-6 shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => { }}
            className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-center flex-1 text-white mr-8">
            {mode === 'deposit' ? 'Deposit' : mode === 'withdraw' ? 'Withdraw' : 'Convert'}
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
            <h2 className="text-xl font-bold mb-4 text-white">
              Transaction History
            </h2>
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/20 hover:bg-gray-700/40 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {tx.type === 'deposit' ? (
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <ArrowDownRight className="w-5 h-5 text-green-500" />
                      </div>
                    ) : tx.type === 'withdrawal' ? (
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-blue-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Repeat className="w-5 h-5 text-purple-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {tx.type === 'deposit' ? 'Deposit' : tx.type === 'withdrawal' ? 'Withdrawal' : 'Conversion'}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : tx.coins > 0 ? '+' : '-'}{Math.abs(tx.amount)} {tx.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      {tx.coins > 0 ? '+' : '-'}{Math.abs(tx.coins).toLocaleString()} Coins
                    </div>
                    <div className={`text-xs mt-1 ${tx.status === 'completed' ? 'text-green-500' : 'text-yellow-500'} font-medium`}>
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
            <div className="flex mb-6 bg-gray-700/50 rounded-full p-1">
              <button
                onClick={() => setMode('deposit')}
                className={`flex-1 py-2 rounded-lg transition-colors text-sm ${mode === 'deposit' ? 'bg-green-500 shadow-lg' : 'hover:bg-gray-600/50'}`}
              >
                Deposit
              </button>
              <button
                onClick={() => setMode('convert')}
                className={`flex-1 py-2 rounded-lg transition-colors text-sm ${mode === 'convert' ? 'bg-purple-500 shadow-lg' : 'hover:bg-gray-600/50'}`}
              >
                Convert
              </button>
              <button
                onClick={() => setMode('withdraw')}
                className={`flex-1 py-2 rounded-lg transition-colors text-sm ${mode === 'withdraw' ? 'bg-blue-500 shadow-lg' : 'hover:bg-gray-600/50'}`}
              >
                Withdraw
              </button>
            </div>

            {/* Balance Display */}
            <div className="bg-gray-700/30 p-4 rounded-xl mb-4 border border-gray-600/20">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-400 text-sm">Crypto Balance</span>
                  <div className="font-bold">{cryptoBalance} {cryptoSymbol}</div>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-sm">Casino Coins</span>
                  <div className="font-bold">{casinoBalance.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Conversion Section - IMPROVED */}
            {mode === 'convert' && (
              <div className="space-y-4">
                {/* Conversion Type Toggle */}
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                  <label className="block text-sm text-gray-400 mb-3">Select Conversion Direction</label>
                  <div className="flex bg-gray-700/50 rounded-full p-1">
                    <button
                      onClick={() => {
                        setConversionType('cryptoToCoins');
                        setAmount(''); // Clear amount when switching
                      }}
                      className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium ${conversionType === 'cryptoToCoins' ? 'bg-green-500 shadow-lg' : 'hover:bg-gray-600/50'
                        }`}
                    >
                      {cryptoSymbol} → Coins
                    </button>
                    <button
                      onClick={() => {
                        setConversionType('coinsToCrypto');
                        setAmount(''); // Clear amount when switching
                      }}
                      className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium ${conversionType === 'coinsToCrypto' ? 'bg-blue-500 shadow-lg' : 'hover:bg-gray-600/50'
                        }`}
                    >
                      Coins → {cryptoSymbol}
                    </button>
                  </div>
                </div>

                {/* Input Section with Clear Direction Indicators */}
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm text-gray-400">
                      {conversionType === 'cryptoToCoins'
                        ? `Enter ${cryptoSymbol} Amount`
                        : 'Enter Coins Amount'}
                    </label>
                    <button
                      onClick={setMaxAmount}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      MAX
                    </button>
                  </div>

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
                    className="w-full bg-gray-700/50 rounded-lg p-3 text-lg font-bold focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-600/30 mb-2"
                  />

                  <div className="text-right text-xs text-gray-400">
                    Available: {conversionType === 'cryptoToCoins'
                      ? `${cryptoBalance.toFixed(4)} ${cryptoSymbol}`
                      : `${casinoCoins.toLocaleString()} Coins`}
                  </div>
                </div>

                {/* Conversion Preview */}
                {amount && parseFloat(amount) > 0 && (
                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="flex items-center justify-center w-full">
                        <div className="text-center">
                          <span className="text-sm text-gray-400">From</span>
                          <div className="font-bold">
                            {conversionType === 'cryptoToCoins'
                              ? `${amount} ${cryptoSymbol}`
                              : `${amount} Coins`}
                          </div>
                        </div>

                        <div className="flex-shrink-0 mx-4">
                          <ArrowRight className="w-5 h-5 text-purple-400" />
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-400">To (You'll Receive)</span>
                          <div className="font-bold text-green-400">
                            {calculateConversionPreview()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleConvert}
                        disabled={
                          !amount ||
                          parseFloat(amount) <= 0 ||
                          (conversionType === 'cryptoToCoins' && parseFloat(amount) > cryptoBalance) ||
                          (conversionType === 'coinsToCrypto' && parseFloat(amount) > casinoCoins)
                        }
                        className={`w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold ${!amount ||
                          parseFloat(amount) <= 0 ||
                          (conversionType === 'cryptoToCoins' && parseFloat(amount) > cryptoBalance) ||
                          (conversionType === 'coinsToCrypto' && parseFloat(amount) > casinoCoins)
                          ? 'bg-gray-600/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                          }`}
                      >
                        <Repeat className="w-4 h-4" />
                        Convert Now
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                  <h3 className="font-medium mb-3 text-sm">Conversion Rates</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">1 {cryptoSymbol}</span>
                    <span className="font-medium">{conversionRate} Coins</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{conversionRate} Coins</span>
                    <span className="font-medium">1 {cryptoSymbol}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Deposit Flow */}
            {mode === 'deposit' && (
              <>
                <div className="bg-gray-700/30 p-4 rounded-xl mb-4 border border-gray-600/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {cryptoIcon}
                      <span className="font-medium">{cryptoName}</span>
                    </div>
                    <button
                      onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                      className="p-2 hover:bg-gray-600/50 rounded-lg transition-all flex items-center gap-1"
                    >
                      <span className="text-sm">Change</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCryptoDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {showCryptoDropdown && (
                    <div className="bg-gray-700/90 rounded-lg overflow-hidden z-10 border border-gray-600/20 shadow-lg mb-4">
                      {currencies?.map((crypto) => (
                        <button
                          key={crypto.symbol}
                          onClick={() => {
                            setSelectedCrypto(crypto);
                            setSelectedNetwork(crypto.networks[0]);
                            setShowCryptoDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-600/50 transition-all"
                        >
                          <img src={crypto.icon} alt="" className="w-6 h-6" />
                          <span className="font-medium">{crypto.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Network</span>
                    <button
                      onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                      className="p-2 hover:bg-gray-600/50 rounded-lg transition-all flex items-center gap-1"
                    >
                      <span>{selectedNetwork}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showNetworkDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {showNetworkDropdown && (
                    <div className="bg-gray-700/90 rounded-lg overflow-hidden z-10 border border-gray-600/20 shadow-lg mt-2">
                      {/* {selectedCrypto.networks.map((network) => (
                        <button
                          key={network}
                          onClick={() => {
                            setSelectedNetwork(network);
                            setShowNetworkDropdown(false);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-600/50 transition-all"
                        >
                          {network}
                        </button>
                      ))} */}
                    </div>
                  )}
                </div>

                <div className="bg-gray-700/30 p-4 rounded-xl mb-4 border border-gray-600/20">
                  <div className="bg-white p-4 rounded-lg w-32 h-32 mx-auto mb-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${userWallet?.wallet && userWallet.wallet.length > 0
                        ? userWallet.wallet[0].walletAddress
                        : dummyAddress
                        }`}
                      alt="QR Code"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Deposit address</p>
                    <div className="bg-gray-800/50 p-3 rounded-lg break-all font-mono text-xs border border-gray-700/50">
                      {userWallet?.wallet[0]?.walletAddress || dummyAddress}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="w-full py-3 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Address
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
                  <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-400 text-xs">
                    Send only {cryptoSymbol} to this deposit address. Transfers below 1 {cryptoSymbol} will not be credited.
                  </p>
                </div>
              </>
            )}

            {/* Withdraw Flow */}
            {mode === 'withdraw' && (
              <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {cryptoIcon}
                      <span className="font-medium">{cryptoName}</span>
                    </div>
                    <button
                      onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                      className="p-2 hover:bg-gray-600/50 rounded-lg transition-all flex items-center gap-1"
                    >
                      <span className="text-sm">Change</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCryptoDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {showCryptoDropdown && (
                    <div className="bg-gray-700/90 rounded-lg overflow-hidden z-10 border border-gray-600/20 shadow-lg mb-4">
                      {currencies?.map((crypto) => (
                        <button
                          key={crypto.symbol}
                          onClick={() => {
                            setSelectedCrypto(crypto);
                            setSelectedNetwork(crypto.networks[0]);
                            setShowCryptoDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-600/50 transition-all"
                        >
                          <img src={crypto.icon} alt="" className="w-6 h-6" />
                          <span className="font-medium">{crypto.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <label className="block text-sm text-gray-400 mb-2">Withdrawal Amount</label>
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
                    className="w-full bg-gray-700/50 rounded-lg p-3 text-lg font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-600/30"
                  />

                  <div className="flex justify-between mt-2">
                    {[0.25, 0.5, 0.75, 1].map((multiplier) => (
                      <button
                        key={multiplier}
                        onClick={() => setAmount((cryptoBalance * multiplier).toFixed(4))}
                        className="py-1 px-2 rounded-lg bg-gray-600/50 hover:bg-gray-500/50 transition-all text-xs font-medium"
                      >
                        {multiplier === 1 ? 'MAX' : `${multiplier * 100}%`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                  <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
                  <input
                    type="text"
                    placeholder={`Enter ${cryptoSymbol} address`}
                    className="w-full bg-gray-700/50 rounded-lg p-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-600/30"
                    onClick={(e) => {
                      setrecipientAddress(e.target.value);
                    }}
                  />
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                  <h3 className="text-sm font-medium mb-3">Withdrawal Summary</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Amount</span>
                    <div className="text-right">
                      <div className="font-medium">{amount || '0'} {cryptoSymbol}</div>
                      <div className="text-xs text-gray-400">
                        ≈ ${(parseFloat(amount || '0') * cryptoPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network</span>
                    <span className="font-medium">{selectedNetwork}</span>
                  </div>
                </div>

                <button
                  disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > cryptoBalance}
                  className={`w-full py-3 ${!amount || parseFloat(amount) <= 0 || parseFloat(amount) > cryptoBalance
                    ? 'bg-gray-600/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    } rounded-lg transition-all font-bold text-sm`}
                  onClick={withdrawFn}
                >
                  Withdraw {cryptoSymbol}
                </button>

                <div className="flex items-start gap-2 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-400 text-xs">
                    Double-check the withdrawal address. Transactions cannot be reversed once confirmed.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}