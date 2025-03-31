import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center flex-col !h-[400px] w-full p-5">
        <div className="space-y-1 mt-5">
          <h2 className="font-bold text-gray-400 text-3xl">Welcome</h2>
          <h2 className="text-base text-gray-300">Best Crypto Wallet</h2>
        </div>
        <div className="flex flex-col space-y-2 w-full mb-5">
          <Button
            onClick={() => navigate("/yourwallet")}
            className="!bg-white hover:!bg-blue-600 hover:!text-white !text-blue-600 !font-bold w-full !py-5 !rounded-full"
            type="primary"
          >
            Create A Wallet
          </Button>
          <Button
            onClick={() => navigate("/recover")}
            className="!bg-transparent !text-white !font-bold w-full !py-5 !rounded-full !border-none hover:underline"
            type="default"
          >
            Sign In With Seed Phrase
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
