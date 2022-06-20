This repository contains all the necessary files of the Project for the Cloud Computing course, 2021.

# Project: Internet connection sharing using Blockchain
*Authors: Marco Zenere, Kostas Tzoumpas*

#### Notes:
- Requirements:
  - npm, node.js, python, Chrome based browser (Firefox too, but make sure to disable the HTTPS-Only Mode for the websocket to run), Metamask extension in the browser, OpenVPN client, Ganache-cli, Truffle, and ws (`npm install ws`)
- In case you want to start a specific workspace in Ganache, modify the *hidden* file ".mnemonic.txt" by copy-pasting the preffered mnemonic phrase in one line. If not, leave it empty and a new random workspace will be created.
- Before running the starting script, make sure to save any work from running Ganache and front-end npm instances because the scripts kills them in order to set free the default ports (localhost ports: 7545, 3000).


### How to run

- For the Server:

  - Follow the instructions in the `server` directory (README.md).


- For the Client:

  - It is assumed that OpenVPN is running with pre-made configuration on a server machine, as described in the README.md file in the folder `server`.

  - For the project to run, simply open a terminal in this directory and run:

    `./run.sh`

    *Note: the information of Ganache is saved in the hidden file ".ganache_output.txt"*

  - In the webpage of the project, you can purchase one of the contracts if there isn't an alert that like `Connection to server has failed`, which happens when there isn't communication to the websocket.

  - After the purchase is done, a message is displayed and then the VPN file is automatically downloaded.

  - You can connect to the VPN with two ways:

    - On the command line:

      `sudo mv client.conf /etc/openvpn/client/client.conf`

      `sudo openvpn /etc/openvpn/client/client.conf`

    - On the OpenVPN client, simply drag 'n' drop the .ovpn file and connect.

  - The connection will be lost automatically when the contract expires.


*Last update: 28/5/21*
