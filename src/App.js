import React, {useState, useEffect} from 'react';
import './App.css';
import Select from 'react-select';
import { Container, Navbar, Nav, Row, Col, Button, Image, Card, Accordion, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram, faGithub, faTwitter, faEthereum} from '@fortawesome/free-brands-svg-icons'
import {faHorseHead, faPlus} from  '@fortawesome/free-solid-svg-icons'
//https://etherscan.io/address/0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f#events
//0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351 - uniswap ropsten v1 factory address
//0x60B10C134088ebD63f80766874e2Cade05fc987B BAT ropsten
//0x7d5E6A841Ec195F30911074d920EEc665A973A2D DAI ropsten
//0x7FffaC23d59D287560DFecA7680B5393426Cf503 BEE ropsten
//0x2f45b6Fb2F28A73f110400386da31044b2e953D4 TEST ropsten
import Web3 from 'web3';
var BigNumber = require('big-number');

function App() {

  const tokenABI = [{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "spender","type": "address"}],"name": "allowance","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "approve","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "decimals","outputs": [{"internalType": "uint8","name": "","type": "uint8"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "recipient","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "transfer","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "sender","type": "address"},{"internalType": "address","name": "recipient","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "transferFrom","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"}];
  
  const uniholdABI = [{"inputs": [{"internalType": "address","name": "_token","type": "address"},{"internalType": "string","name": "_name","type": "string"},{"internalType": "string","name": "_symbol","type": "string"},{"internalType": "uint8","name": "_decimals","type": "uint8"},{"internalType": "uint256","name": "_currentEthToToken","type": "uint256"},{"internalType": "address","name": "_uniholdFactory","type": "address"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": false,"internalType": "uint256","name": "tokens","type": "uint256"}],"name": "Transfer","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "customerAddress","type": "address"},{"indexed": false,"internalType": "uint256","name": "xReinvested","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "tokensMinted","type": "uint256"}],"name": "onReinvestment","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "customerAddress","type": "address"},{"indexed": false,"internalType": "uint256","name": "incomingX","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "tokensMinted","type": "uint256"}],"name": "onTokenPurchase","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "customerAddress","type": "address"},{"indexed": false,"internalType": "uint256","name": "tokensBurned","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "xEarned","type": "uint256"}],"name": "onTokenSell","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "customerAddress","type": "address"},{"indexed": false,"internalType": "uint256","name": "xWithdrawn","type": "uint256"}],"name": "onWithdraw","type": "event"},{"inputs": [{"internalType": "address","name": "_customerAddress","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "_amountOfTokens","type": "uint256"}],"name": "buy","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "buyPrice","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "_xToSpend","type": "uint256"}],"name": "calculateTokensReceived","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "_tokensToSell","type": "uint256"}],"name": "calculateXReceived","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "decimals","outputs": [{"internalType": "uint8","name": "","type": "uint8"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_customerAddress","type": "address"}],"name": "dividendsOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "exit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "myDividends","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "myTokens","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "reinvest","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_amountOfTokens","type": "uint256"}],"name": "sell","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "sellPrice","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "token","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalTokenBalance","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_toAddress","type": "address"},{"internalType": "uint256","name": "_amountOfTokens","type": "uint256"}],"name": "transfer","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "withdraw","outputs": [],"stateMutability": "nonpayable","type": "function"}];

  const uniholdFactoryABI = [{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "TokenToUnihold","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "contracts","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "count","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "token","type": "address"}],"name": "createNewContract","outputs": [{"internalType": "address","name": "newContract","type": "address"}],"stateMutability": "payable","type": "function"},{"inputs": [],"name": "getContracts","outputs": [{"internalType": "address[]","name": "","type": "address[]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "idToUnihold","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "initialEthToTokenValue","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "uniholdToToken","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"}]
  const uniholdFactoryAddress = '0x945e751f16432254d262ce7ede2a0dbf21606b20'; //ropsten

  const [contracts, setContracts] = useState([]);
  const [currentContract, setCurrentContract] = useState("0x945e751f16432254d262ce7ede2a0dbf21606b20");
  const [contractCount, setContractCount] = useState(0);

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [etherscanURL, setEtherscanURL] = useState("");
  const [uniswapURL, setUniswapURL] = useState("");

  const [contractBalance, setContractBalance] = useState(0.0);
  const [totalTokens, setTotalTokens] = useState(0.0);
  const [buyPrice, setBuyPrice] = useState(0.0);
  const [sellPrice, setSellPrice] = useState(0.0);

  const [userDividends, setUserDividends] = useState(0);
  const [userTokens, setUserTokens] = useState(0);
  const [estimatedValue, setEstimatedValue] = useState(0);

  const [approveAmount, setApproveAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferToAddress, setTransferToAddress] = useState(0);

  const [approvedBalance, setApprovedBalance] = useState(0.0);
  const [walletBalance, setWalletBalance] = useState(0.0);

  const [newTokenAddress, setNewTokenAddress] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [accounts,setAccounts] = useState([]);

  let web3 = new Web3(window.ethereum);

  var uniholdInstance = new web3.eth.Contract(uniholdABI, currentContract);
    
  const factoryInstance = new web3.eth.Contract(uniholdFactoryABI, uniholdFactoryAddress);
  var tokenInstance = new web3.eth.Contract(tokenABI, tokenAddress);


   useEffect(() =>{

   connectMetamask();
   
     async function loadMetamask() {

        if(window.ethereum){
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);

          //Get unihold contract addresses
          factoryInstance.methods.count().call().then(c =>
          {
            setContractCount(c);
            for (var i = 0; i < c; i++) {
                factoryInstance.methods.contracts(i).call().then(contract => {
                  
                  var currentContract = contract;
                  console.log("Current contract " + contract);
                  factoryInstance.methods.uniholdToToken(contract).call().then(tok => {
                    let thisToken = new web3.eth.Contract(tokenABI, tok);
                    thisToken.methods.symbol().call().then(n => {

                   if(tokenAddress == ""){
                        setTokenAddress(tok);
                        setTokenSymbol(n);
                        uniholdInstance = new web3.eth.Contract(uniholdABI, contract);
                      }

                      setContracts(contracts => contracts.concat({"label": n, "value": contract, "token": tok}));

                      tokenInstance = new web3.eth.Contract(tokenABI, tok);
                      tokenInstance.methods.decimals().call().then(decimals => 
                      {
                        setTokenDecimals(decimals);
                        
                      });
                    });
                      
                  });
                });
          }}
          );
       
           updateInfo();

          setEstimatedValue(userTokens * sellPrice);

     }
   }

  if(web3){
    loadMetamask();
  }

  }, []);

   const updateInfo = () => {

          uniholdInstance.methods.totalTokenBalance().call().then(totalBalance =>
            setContractBalance(totalBalance));

          uniholdInstance.methods.totalSupply().call().then(totalSupply =>
            setTotalTokens(totalSupply));

          uniholdInstance.methods.buyPrice().call().then(price =>
            setBuyPrice(price / (10 ** tokenDecimals)));

          uniholdInstance.methods.sellPrice().call().then(price =>
            setSellPrice(price / (10 ** tokenDecimals)));

          if(accounts[0] != undefined){

          uniholdInstance.methods.dividendsOf(accounts[0]).call().then(divs =>
            setUserDividends(divs));

          uniholdInstance.methods.balanceOf(accounts[0]).call().then(bal =>
            setUserTokens(bal));

         
        }
   }

   const connectMetamask = () => {
      if(window.ethereum){   
      window.ethereum.enable();
    }
   }

  const approve = (amount) => {
    tokenInstance.methods.approve(currentContract, (amount * 10 ** tokenDecimals).toString()).send({from:accounts[0]});
  }

  const buy = (amount) => {
    uniholdInstance.methods.buy(amount * 10 ** tokenDecimals).send({from:accounts[0]});
    console.log(contracts);
  }

  const withdraw = () => {
    uniholdInstance.methods.withdraw().send({from:accounts[0]});
  };
  const reinvest = () => {
   uniholdInstance.methods.reinvest().send({from:accounts[0]});
  };
  const sell = (amount) => {
    uniholdInstance.methods.sell(amount * 10 ** tokenDecimals).send({from:accounts[0]});
  };
  const transfer = (to, amount) => {
    uniholdInstance.methods.transfer(to, amount * 10 ** tokenDecimals).send({from:accounts[0]});
  };

  const createNew = () => {

   factoryInstance.methods.createNewContract(newTokenAddress).send({from:accounts[0]}).then(handleClose);
  }


  const changeToken = (option) =>{
    setCurrentContract(option.value);
    setTokenSymbol(option.label);
    setTokenAddress(option.token);
    setEtherscanURL('https://etherscan.io/token/' + option.token);
    setUniswapURL('https://app.uniswap.org/#/swap?inputCurrency=' + option.token + '&use=v1');
   uniholdInstance = new web3.eth.Contract(uniholdABI, option.value);
   console.log(uniholdInstance);
   tokenInstance.methods.allowance(accounts[0], currentContract).call().then(all =>
                        {
                        setApprovedBalance(all / (10 ** tokenDecimals))
                        console.log("Allowance " + all)
                      })
   tokenInstance.methods.balanceOf(accounts[0]).call().then(bal => setWalletBalance(bal / (10 ** tokenDecimals)));

   updateInfo();
  }

  return (
    <div className="App">
      <header className="App-header">
       <Navbar>
          <Navbar.Brand href="#home"><img src='/Unihold.png' style={{'width':'150px'}}/></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
          <Nav.Link href="#home" onClick={() => connectMetamask()}>Connect Metamask</Nav.Link>
           {/* <Nav.Link href="#home">About</Nav.Link>
            <Nav.Link href="#home">Docs</Nav.Link> */}
            <Nav.Link href="#home">FAQ</Nav.Link>
            <Nav.Link href="#home" onClick={handleShow}><FontAwesomeIcon icon={faPlus} />Add</Nav.Link>
          </Navbar.Collapse>
        </Navbar>
       
      </header>



        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Token To Unihold</Modal.Title>
        </Modal.Header>

        <Modal.Body>
         <small> - The token must already be listed on Uniswap V1. <br/>
          - Initial price and increment are calculated based on current uniswap V1 price. <br/>
          - Only 1 unihold contract can be created per ERC token. <br/>
          - Clicking submit will create a blockchain transaction to create contract</small>
          <input className="modal-input" placeholder="Token Address 0x..." onChange={v => setNewTokenAddress(v.target.value)}></input>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={() => createNew(newTokenAddress)}>Submit</Button>
        </Modal.Footer>
      </Modal>


      <div className="content">
        <Row className="exchange">
        <Col>
          <Row>
          <Col className='token-select-column'>
           <Select options={contracts} 
           placeholder="Select Token..."
            onChange={opt => changeToken(opt)}/>
            </Col>
            <Col className="etherscan-column">

            <a href={etherscanURL} className="eth-links" target="_blank" title='View token contract on etherscan'><FontAwesomeIcon icon={faEthereum}/>Etherscan</a>
            <a href={uniswapURL} className="eth-links"  target="_blank" title='View ETH pair on Uniswap'> <FontAwesomeIcon icon={faHorseHead}/>Uniswap</a>
            </Col>
          </Row>
          <Row>
            <Col xs={4} >
            <Accordion defaultActiveKey="-1">
   <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="-1">
       Approve
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="-1">
      <Col>
      <input className="textbox-input" placeholder="0.0" onChange={v => setApproveAmount(v.target.value)}></input>
      <Button onClick={() => approve(approveAmount)}>Approve</Button>
      <p className="help-text">You must approve an amount of {tokenSymbol} before you can use them to buy UNI{tokenSymbol}.</p>
      <p className="help-text">Current Amount Approved: {approvedBalance} {tokenSymbol}.</p>
      </Col>
    </Accordion.Collapse>
  </Card>
  <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="0">
        Buy
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="0">
      <Col>
      <input className="textbox-input" placeholder="0.0" onChange={v => setBuyAmount(v.target.value)}></input>
      <Button onClick={() => buy(buyAmount)}>Buy</Button>
      <p className="help-text"> Buy specified number of tokens at current buy price</p>
      </Col>
    </Accordion.Collapse>
  </Card>
  <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="1">
        Withdraw
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="1">
    <Col>
     <Button onClick={() => withdraw()}>Withdraw All</Button>
     <p className="help-text"> Withdraw all your dividends back to your wallet </p>
     </Col>
    </Accordion.Collapse>
  </Card>
  <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="2">
         Reinvest
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="2">
     <Col>
       <Button onClick={() => reinvest()}>Reinvest</Button>
       <p className="help-text"> Reinvest all dividends and buy tokens with your dividend balance </p>
      </Col>
    </Accordion.Collapse>
  </Card>
    <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="3">
         Sell
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="3">
     <Col>
       <input className="textbox-input" placeholder="0.0" onChange={v => setSellAmount(v.target.value)}></input>
       <Button onClick={() => sell(sellAmount)}>Sell</Button>
       <p className="help-text"> Sell specified number of tokens at current sell price</p>
      </Col>
    </Accordion.Collapse>
  </Card>
  <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="4">
         Transfer
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="4">
     <Col>
      <input className="textbox-input" placeholder="To address: 0x..." onChange={v => setTransferToAddress(v.target.value)}></input>
              <input className="textbox-input" placeholder="0.0" onChange={v => setTransferAmount(v.target.value)}></input>
              <Button onClick={() => transfer(transferToAddress, transferAmount)}>Transfer</Button>
              <p className="help-text">Transfer number of tokens to specified ERC20 address. Your dividends will be auto withdrawn upon transfer. </p>
      </Col>
    </Accordion.Collapse>
  </Card>
</Accordion>
            
            </Col>
       
            <Col xs={4} className="padded-column">
              <Row>
                <div className="info-box">
                  <div className="info-header">Contract Balance</div>
                  <div className="info-body">{contractBalance} {tokenSymbol}</div>
                </div>
              </Row>
               <Row>
                <div className="info-box">
                  <div className="info-header">Buy Price</div>
                  <div className="info-body">{buyPrice} {tokenSymbol}</div>
                </div>
              </Row>
              <Row>
                <div className="info-box">
                  <div className="info-header">Dividends</div>
                  <div className="info-body">{userDividends} {tokenSymbol}</div>
                </div>
              </Row>
              <Row>
                <div className="info-box">
                  <div className="info-header">Your wallet Balance</div>
                  <div className="info-body">{walletBalance} {tokenSymbol}</div>
                </div>
              </Row>
              
            </Col>
          
            <Col xs={4} className="padded-column">
                <Row>
                <div className="info-box">
                  <div className="info-header">Total Tokens</div>
                  <div className="info-body">{totalTokens} UNI{tokenSymbol}</div>
                </div>
              </Row>
               <Row>
                <div className="info-box">
                  <div className="info-header">Sell Price</div>
                  <div className="info-body">{sellPrice} {tokenSymbol}</div>
                </div>
              </Row>
              <Row>
                <div className="info-box">
                  <div className="info-header">Your tokens </div>
                  <div className="info-body">{userTokens} UNI{tokenSymbol}</div>
                </div>
              </Row>
              <Row>
                <div className="info-box">
                  <div className="info-header">Approved Amount</div>
                  <div className="info-body">{approvedBalance} {tokenSymbol}</div>
                </div>
              </Row>

            </Col>

            <Col xs={12} className="padded-column">

             <div className="info-box">
                  <div className="info-header">Estimated Value of UNI{tokenSymbol} tokens</div>
                  <div className="info-body">{estimatedValue} {tokenSymbol}</div>
                </div>
            <div>

            <div className="help-text">UNI{tokenSymbol} contract address: {currentContract}</div>
            
            </div>
            
            </Col>

          </Row>
        
          </Col>
        </Row>
      </div>
      <footer className="App-footer">
     
      <a href='https://t.me/uniholdcrypto' className='icon-link' target='_blank' title="Telegram"><FontAwesomeIcon icon={faTelegram} /> </a> 
      <a href='https://github.com/unihold' className='icon-link' target='_blank' title="GitHub"><FontAwesomeIcon icon={faGithub} /> </a> 
      <a href='https://twitter.com/UniholdDeFi' className='icon-link' target='_blank' title="Twitter"><FontAwesomeIcon icon={faTwitter} /> </a>
      
      </footer>
    </div>
  );
}

export default App;
