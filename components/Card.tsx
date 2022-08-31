import React from "react";

const Card = ({
  sendToken,
  connectKeplr,
  loading,
  seiAddress,
  setAmount,
  amount,
  setSeiAddress
}: any) => {
  return (
    <div className="p-6 max-w-lg bg-gray-700 rounded-lg border mt-20">
      <div className="flex justify-between">
        <span className="text-white">Bridge</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white"
          className="w-6 h-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
          />
        </svg>
      </div>
      <div className="mt-5">
        <div className="flex justify-between">
          <div className="flex items-center mb-2">
            <span className="text-white">From</span>
            <div className="flex ml-2 bg-gray-900 w-40 p-2 justify-between rounded-lg border-gray-600 border">
              <img alt="token" src="eth.png" className="h-3 sm:h-6" />
              <span className="text-white">Ethereum</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
          {/* <span className="text-sm text-white">Max: 0.0 aUSDC</span> */}
        </div>

        <div className="flex bg-gray-900 rounded-lg">
          <input
            type="text"
            id="default-input"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="flex p-2 w-48 items-center justify-between rounded-lg cursor-pointer hover:bg-blue-500">
            <img alt="token" src="https://trade.vortexprotocol.io/images/tokens/aUSDC.png" className="h-6 sm:h-8" />
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="text-gray-50">aUSDC</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              <span className="text-gray-100">USD Coin</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative p-4 rounded-lg bg-slate-600 mt-8">
        <div className="inline-flex absolute -top-4 left-6 justify-center items-center w-9 h-9 text-xs font-bold text-white bg-gray-900 rounded-full border-2 border-gray-400 dark:border-gray-900 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
            />
          </svg>
        </div>
        <div className="mt-3 mb-2">
          <div className="flex justify-between">
            <div className="flex items-center mb-2">
              <span className="text-white">To</span>
              <div className="flex ml-2 bg-gray-900 w-40 p-2 justify-between rounded-lg border-gray-600 border">
                <img
                  alt="token"
                  src="https://trade.vortexprotocol.io/images/tokens/SEI.png"
                  className="h-3 sm:h-5"
                />
                <span className="text-white">Sei Network</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            <span
              className="text-sm text-red-900 cursor-pointer"
              onClick={connectKeplr}
            >
              Get SEI Address
            </span>
          </div>

          <div className="flex bg-gray-900 rounded-lg">
            <input
              type="text"
              id="default-input"
              placeholder="Sei Address"
              value={seiAddress}
              onChange={(e) => setSeiAddress(e.target.value)}
              className="bg-transparent text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => sendToken()}
        className="w-full mt-5 text-white bg-gray-900 outline-none font-medium rounded-lg text-md px-5 py-4 text-center inline-flex items-center justify-center dark:focus:ring-[#2557D6]/50 mr-2 mb-2"
      >
        {loading ? "Bridging..." : "Bridge"}
      </button>
    </div>
  );
};

export default Card;
