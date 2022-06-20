#!/bin/bash
sleep $DURATION$UNIT
sudo MENU_OPTION=2 CLIENTNUMBER=$(sudo tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep '^V' | cut -d '=' -f 2 | nl -s ') ' | grep $PROF_NAME | awk '{print $1}' | cut -c1) ./openvpn-install.sh | grep revoked
sudo service openvpn restart
