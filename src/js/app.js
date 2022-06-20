App = {
  
  web3Provider: null,
  contracts: {},
  product: {},
  owner: '',
  loggedAccount: '',


  init: async function() {

    // Load products
    $.getJSON('../products.json', function(data) {
      var productsRow = $('#productsRow');
      var productsTemplate = $('#productTemplate');
      product = data;
      owner = data[0].owner;

      for (i = 0; i < data.length; i ++) {
        productsTemplate.find('.panel-title').text(data[i].name);
        productsTemplate.find('img').attr('src', data[i].picture);
        productsTemplate.find('.contract-duration').text(data[i].duration);
        productsTemplate.find('.product-price').text(data[i].price);
        productsTemplate.find('.btn-buy').attr('data-id', data[i].id);
        productsRow.append(productsTemplate.html());
      }
    });

    // start a websocket client
    ws = App.connect_to_server();

    // if no error, inform server of new connection
    ws.onopen = function(e) {
      console.log("Communication with server works!");
      // send message to server
      ws.send("Hello server!");
    };

    loggedAccount = web3.eth.accounts[0];
    console.log(loggedAccount, 'Logged account');
    console.log(localStorage.length,'Items in local storage');
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
      if (window.ethereum) {
        App.web3Provider = window.ethereum;

        try {
        // Request account access
        await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('InternetConnection.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with @truffle/contract
    var InternetConnectionArtifact = data;
    App.contracts.InternetConnection = TruffleContract(InternetConnectionArtifact);
    
    // Set the provider for our contract
    App.contracts.InternetConnection.setProvider(App.web3Provider);
    
    // Use our contract to retrieve and mark the purchased products
      return App.markNotAvailable();
    });

    return App.bindEvents();
  },

  connect_to_server: function() {
    // start a websocket client
    var ws = new WebSocket('ws://kostasmarco.ddns.net:1331');
    
    // check communication to server via websocket
    ws.onerror = function() {
      alert('Connection error with the server. Abort!');
    };

    return ws;
  },

  download_file: function (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handlePurchase);
  },

  markNotAvailable: function() {

    var now = new Date();
    var users = []

    // Check if some contracts expired 
    for(let i=0; i<localStorage.length; i++) {
      let key = localStorage.key(i);
      if(now.getTime() >= localStorage.getItem(key)){
        localStorage.removeItem(key);
      }
      else{
        users.push(key);
      }
    }

    console.log(localStorage.length,'Items in local storage');

    if(loggedAccount == owner.toLowerCase() || users.includes(loggedAccount)){
      for (i = 0; i < product.length; i++) {
        $('.panel-product').eq(i).find('button').text('Not Available').attr('disabled', true);
      }
    }
  },

  popUpScreen: function(duration){

    alert("Purchase Confirmed!\n\nBy clicking ok, the downloading of the VPN file will start (it can take about 5 seconds).\n\nImport the file to the OpenVPN client to connect.\nThe cancellation of your VPN profile will be done automatically.\n\nThank you for your purchase!  #EthToTheMoon");
    // start of the contract
    var now = new Date();
    time_now = now.getTime();
    console.log("Sending contract details to the server and awaiting the file...");
    
    // send now+duration to the server    
    ws = App.connect_to_server();
    
    ws.onopen = function(e) {
      // send details as string of a JSON
      const msg = "Contract:\nduration:"+duration.toString()+"_m"+",time_now:"+time_now.toString();
      // NOTE HERE: We treat hours as minutes, for the purpose of the demo.
      // Otherwise, "_m" should be replaced by "_h".
      ws.send(msg);
    };

    // wait for response (the VPN file)
    ws.onmessage = function(msg) {
      console.log("WebSocket message received.");

      // download it
      App.download_file("config.ovpn",msg.data);
    };

    // end of the contract
    now = now.setMinutes(now.getMinutes() + duration);
    localStorage.setItem(loggedAccount,now);
  },

  handlePurchase: function(event) {
    event.preventDefault();

    var productId = parseInt($(event.target).data('id'));
    var purchaseInstance;
    var price = product[productId].price;
    var duration = product[productId].duration;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
      console.log(account)

      var price_inWei = web3.toWei(price.toString(),'ether');
      
      App.contracts.InternetConnection.deployed().then(function(instance) {
        purchaseInstance = instance;
    
        // Execute purchase as a transaction by sending account
        return purchaseInstance.purchaseProduct(productId, {from: account, value: price_inWei});
      }).then(function(result) {
        console.log(result);
        console.log('Transaction Approved');
        return App.popUpScreen(duration);

      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
