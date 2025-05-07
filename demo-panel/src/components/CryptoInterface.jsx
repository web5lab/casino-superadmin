import React, { useEffect, useState } from 'react';
import { ChevronDown, Copy, ArrowLeft, AlertCircle, Coins, ArrowUpRight, ArrowDownRight, Clock, History, Repeat, ArrowRight, CloudSnowIcon, SidebarCloseIcon, CircleX } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetCurrencies } from '../store/global.Action';
import { convertToCasino, convertToCrypto, getBalance, getCasinoData, getERC20Balance, GetUserEvmWallet, withdrawCryptoToWallet } from '../utils/utils';
import toast from 'react-hot-toast';
import { currenciesSelector } from '../store/global.Selctor';

export default function CryptoInterface() {
  const [mode, setMode] = useState('deposit');
  const [conversionType, setConversionType] = useState('cryptoToCoins'); // New state for conversion direction
  const [selectedNetwork, setSelectedNetwork] = useState('ERC20');
  const [selectedCrypto, setSelectedCrypto] = useState({})
  const [amount, setAmount] = useState('');
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const dispatch = useDispatch();
  const currencies = useSelector(currenciesSelector);
  const [jwtToken, setJwtToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [platformId, setPlatformId] = useState('');
  const [cryptoBalance, setcryptoBalance] = useState(0);
  const [casinoBalance, setcasinoBalance] = useState(0)
  const [casinoConfig, setcasinoConfig] = useState()
  const [userWallet, setuserWallet] = useState()
  const [cryptoPrice, setcryptoPrice] = useState(1)
  const [cryptoSymbol, setcryptoSymbol] = useState("usdt");
  const [cryptoIcon, setcryptoIcon] = useState(<img src='https://cryptologos.cc/logos/tether-usdt-logo.svg' className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm" />)
  const [cryptoName, setcryptoName] = useState("Tether")
  const [recipientAddress, setrecipientAddress] = useState(null)

  const [availableNetworks, setAvailableNetworks] = useState([]);

  const [loading, setLoading] = useState()

  useEffect(() => {
    dispatch(GetCurrencies());
    extractFromUrl()
  }, [dispatch]);

  function emitCloseEvent() {
    window.parent.postMessage(
      { type: "CUSTOM_IFRAME_CLOSE" },
      "*"
    );
  }
  const fa = async () => {
    const data = await getCasinoData(platformId);
    const bal = await getBalance({ apiUrl: data.balanceApi, userId, secretKey: jwtToken });

    console.log("casino data =>", bal);

    const userWalletData = await GetUserEvmWallet({ userId, platformId });
    const walletAddress = userWalletData.wallet[0].walletAddress;

    // USDT Token Addresses per chain
    const USDT_ADDRESSES = {
      ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      bsc: "0x55d398326f99059fF775485246999027B3197955",
      polygon: "0x3813e82e6f7098b9583FC0F33a962D02018B6803"
    };
    // Get balances
    const [ethUsdtData, bscUsdtData, polygonUsdtData] = await Promise.all([
      getERC20Balance({
        address: walletAddress,
        tokenAddress: USDT_ADDRESSES.ethereum,
        network: 'ethereum',
      }),
      getERC20Balance({
        address: walletAddress,
        tokenAddress: USDT_ADDRESSES.bsc,
        network: 'bsc',
      }),
      getERC20Balance({
        address: walletAddress,
        tokenAddress: USDT_ADDRESSES.polygon,
        network: 'polygon',
      }),
    ]);

    const ethUsdt = Number(ethUsdtData.balanceFormatted);
    const bscUsdt = Number(bscUsdtData.balanceFormatted);
    const polygonUsdt = Number(polygonUsdtData.balanceFormatted);
    const totalUsdt = ethUsdt + bscUsdt + polygonUsdt;

    // Set state
    setcryptoBalance(totalUsdt);
    setuserWallet(userWalletData);
    setcasinoBalance(bal);
    setcasinoConfig(data);

    console.log(`ETH USDT: ${ethUsdt}, BSC USDT: ${bscUsdt}, Polygon USDT: ${polygonUsdt}, Total: ${totalUsdt}`);
  };

  useEffect(() => {
    if (platformId) {
      fa();
    }
  }, [platformId]);

  useEffect(() => {
    if (currencies?.length > 0) {
      setSelectedCrypto(currencies[0]);
      setSelectedNetwork(currencies[0].network[0].name);
    }
  }, [currencies]);

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
  const conversionRate = 87; // 1 USDT = 87 casino coins
  const dummyAddress = '0xb285007A2306FCf0786b18DBFB23DFC52B8174a4';

  const handleCopy = () => {
    navigator.clipboard.writeText(userWallet.wallet[0].walletAddress || dummyAddress);
  };

  const handleConvert = async () => {
    try {
      console.log(conversionType);
      setLoading(true);
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

      } else {
        const coinsAmount = parseFloat(amount);
        if (coinsAmount > casinoBalance) return;

        const cryptoValue = coinsAmount / conversionRate / cryptoPrice;
        await convertToCrypto({ amount: cryptoValue, userId: userId, casinoId: platformId, secretToken: jwtToken, casinoCoinAmount: coinsAmount, wallet: userWallet.wallet[0].walletAddress, secretKey: jwtToken });
        setTransactions(prev => [{
          id: Date.now().toString(),
          type: 'conversion',
          amount: cryptoValue.toFixed(6),
          symbol: cryptoSymbol,
          status: 'completed',
          timestamp: new Date(),
          coins: -coinsAmount
        }, ...prev]);
      }
      await fa();
      setAmount('');
      toast.success("Funds converted successfully")
    } catch (error) {
      console.log("error", error);
      toast.error("Error converting funds")
    } finally {
      setLoading(false)
    }

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
      setAmount(casinoBalance.toString());
    }
  };

  const withdrawFn = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) return;
      if (!recipientAddress) {
        toast.error("Please enter recipient address")
        return;
      }
      setLoading(true);
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
      setAmount('');
      await fa();
      toast.success(`Successfully withdrawn ${amount} ${cryptoSymbol}`);
    } catch (error) {
      toast.error("Error withdrawing funds")
    } finally {
      setLoading(false);
    }

  };



  const isDisabled =
    !amount ||
    parseFloat(amount) <= 0 ||
    (conversionType === "cryptoToCoins" && parseFloat(amount) > cryptoBalance) ||
    (conversionType === "coinsToCrypto" && parseFloat(amount) > casinoBalance);
  return (
    <div className="m-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white max-w-lg mx-auto">
      <div className="backdrop-blur-xl bg-gray-800/70 rounded-2xl p-6 shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => { emitCloseEvent() }}
            className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:scale-105"
          >
            <CircleX className="w-6 h-6" />
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
                      : `${casinoBalance.toLocaleString()} Coins`}
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
                        disabled={loading || isDisabled}
                        className={`w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold ${loading || isDisabled
                          ? "bg-gray-600/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                          }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="w-5 h-5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" />
                              <path
                                fill="white"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                opacity="0.75"
                              />
                            </svg>
                            Converting...
                          </>
                        ) : (
                          <>
                            <Repeat className="w-4 h-4" />
                            Convert Now
                          </>
                        )}
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
                    <div className="bg-grey-700/90 rounded-lg overflow-hidden z-10 border border-gray-600/20 shadow-lg mb-4">
                      {currencies?.map((crypto) => (
                        <button
                          key={crypto._id}
                          onClick={() => {
                            setSelectedCrypto(crypto);
                            setcryptoSymbol(crypto.code);
                            setcryptoName(crypto.name);
                            setSelectedNetwork(crypto.network[0].name);
                            setShowCryptoDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-600/50 transition-all"
                        >
                          <img crossorigin="anonymous" src={crypto.icon} alt="" className="w-6 h-6" />
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
                      {console.log("selectedCrypto", selectedCrypto)}
                      {selectedCrypto.network.map((network) => (
                        <button
                          key={network._id}
                          onClick={() => {
                            setSelectedNetwork(network.name);
                            setShowNetworkDropdown(false);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-600/50 transition-all"
                        >
                          {network.name}
                        </button>
                      ))}
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
                    <div className='w-full flex flex-col md:flex-row items-center justify-between'>
                      <p className="text-gray-400 text-sm mb-2 md:mb-0">Deposit address</p>
                      <div style={{ flex: 1 }}></div>
                      <a
                        href="https://wa.me/917440983327"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 flex justify-center items-center gap-2 bg-green-500 rounded-md w-full md:w-auto"
                      >
                        Buy Through WhatsApp
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28px" height="28px" viewBox="0 0 48 48">
                          <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
                          <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path>
                          <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path>
                          <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
                          <path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                        </svg>
                      </a>
                    </div>

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
                {/* Currency Selection */}
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
                    <div className="bg-gray-700/90 rounded-lg overflow-hidden z-10 border border-gray-600/20 shadow-lg mb-2">
                      {currencies?.map((crypto) => (
                        <button
                          key={crypto.symbol}
                          onClick={() => {
                            setSelectedCrypto(crypto);
                            setcryptoSymbol(crypto.code);
                            setcryptoName(crypto.name);
                            setAvailableNetworks(crypto.network);
                            if (crypto.network.length === 1) {
                              setSelectedNetwork(crypto.network[0].name);
                              setShowNetworkDropdown(false);
                            } else {
                              setSelectedNetwork(null);
                              setShowNetworkDropdown(true);
                            }
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
                </div>

                {/* Network Selection */}
                {availableNetworks?.length > 1 && showNetworkDropdown && (
                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                    <label className="block text-sm text-gray-400 mb-2">Select Network</label>
                    <div className="bg-gray-700/90 rounded-lg overflow-hidden border border-gray-600/20 shadow-lg">
                      {availableNetworks.map((net) => (
                        <button
                          key={net.name}
                          onClick={() => {
                            setSelectedNetwork(net.name);
                            setShowNetworkDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-600/50 transition-all text-sm"
                        >
                          {net.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amount Input */}
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
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

                {/* Recipient Address */}
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/20">
                  <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
                  <input
                    type="text"
                    placeholder={`Enter ${cryptoSymbol} address`}
                    className="w-full bg-gray-700/50 rounded-lg p-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-600/30"
                    onChange={(e) => setrecipientAddress(e.target.value)}
                  />
                </div>

                {/* Summary */}
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
                    <span className="font-medium">{selectedNetwork || '-'}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > cryptoBalance}
                  className={`w-full py-3 flex justify-center items-center gap-2 ${loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > cryptoBalance
                    ? 'bg-gray-600/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    } rounded-lg transition-all font-bold text-sm`}
                  onClick={withdrawFn}
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" />
                        <path
                          fill="white"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          opacity="0.75"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Withdraw {cryptoSymbol}</>
                  )}
                </button>

                {/* Warning */}
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