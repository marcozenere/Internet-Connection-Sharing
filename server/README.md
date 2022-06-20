For running the project, a server must be set in order to let the Client to connect to the VPN.

We use an old computer running Ubuntu Server OS 32-bit 16.04.

#### Requirements:

  - OpenVPN

    - We use the script from this repository: https://github.com/angristan/openvpn-install

      Simply, download the script and make it executable.

  - Python > 3.5, pip, and websockets (`pip3 install websockets`)

- Other important configurations:

  - the server has a hostname from www.noip.com (kostasmarco.ddns.net)
  - port forwarding has been applied in the router's settings for the specific ports that listen to connections (1194 for OpenVPN, 1331 for Websockets)
  - the OS's firewall allows the ports to be used for connection:

    `sudo ufw enable`

    `sudo ufw allow {port_number}`


### How to run

  - Install OpenVPN:

    `sudo AUTO_INSTALL=y ./openvpn-install.sh`

  - Make sure VPN service is active:

    `sudo systemctl restart openvpn`

  - Same for firewall:

    `sudo ufw enable`

  - Make sure all files of this folder are in the same directory.

  - Start the Websocket Server:

    `python3 ws_server.py`
