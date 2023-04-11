import React, {useState, useEffect} from "react";
import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import matic from "../matic.png";
import { Modal, Input, InputNumber } from "antd";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction  } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import ABI from "../abi.json";


function AccountDetails({balance,address, name,getNameAndBalance}) {
  const [userModal, setUserModal] = useState(false);
  const [username, setUsername] = useState("");

  const { config: configRequest  } = usePrepareContractWrite({
    chainId: polygonMumbai.id,
    address: "0x7A08aE88d27a562e9f6f1846c02208b13Bd1A721",
    abi: ABI,
    functionName: "addName",
    args: [username],
  });

  const { write: writeRequest, data: dataRequest } = useContractWrite(configRequest);

  const { isSuccess: isSuccessRequest } = useWaitForTransaction({
    hash: dataRequest?.hash,
  })

  const showRequestModal = () => {
    setUserModal(true);
  };
  const hideRequestModal = () => {
    setUserModal(false);
  };

  useEffect(()=>{
    if(isSuccessRequest){
      getNameAndBalance();
    }
  },[isSuccessRequest])


  return (
    <>
    <Modal
        title="Set Username"
        open={userModal}
        onOk={() => {
          writeRequest?.();
          hideRequestModal();
        }}
        onCancel={hideRequestModal}
        okText="Set"
        cancelText="Cancel"
      >
       <p>Set Username</p>
       <Input placeholder="Set username..." value={username} onChange={(val)=>setUsername(val.target.value)}/>
      </Modal>
    <Card title="Account Details" style={{ width: "100%" }}>
      <div className="accountDetailRow">
        <UserOutlined style={{ color: "#767676", fontSize: "25px" }} />
        <div>
          <div className="accountDetailHead"> {name} </div>
          <div className="accountDetailBody">
            {" "}
            Address: {address.slice(0,4)}....{address.slice(38)}
          </div>
        </div>
      </div>
      <div className="accountDetailRow">
        <img src={matic} alt="maticLogo" width={25} />
        <div>
          <div className="accountDetailHead"> Native Matic Tokens</div>
          <div className="accountDetailBody">{balance} Matic</div>
        </div>
      </div>
      <div className="balanceOptions">
        <div className="extraOption"
          onClick={() => {
            showRequestModal();
          }}>Set Username</div>
        <div className="extraOption">Switch Accounts</div>
      </div>
    </Card>
    </>
  );
}

export default AccountDetails;
