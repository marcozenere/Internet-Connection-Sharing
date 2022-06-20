#!/usr/bin/env python

# WS server

import asyncio
import websockets
import json
import random
from pprint import pprint
import os


def create_vpn_profile(msg):
    """ This function runs after a new contract is received
    and creates a .ovpn file for that specific contract.
    Return: the link of the .ovpn file. """

    # clean message
    msg = msg.split("\n")[-1]
    
    # generate name
    name = ""
    for k in range(10):
        name += chr(random.randint(ord('a'), ord('z')))
    duration = msg.split(',')[0].split(':')[-1]
    time_now = msg.split(',')[1].split(':')[-1]
    name += time_now

    # save details
    details = {'name': name, 'duration': duration}

    print('\n\nVPN Profile details:')
    pprint(details)
    print('\n\n')

    # create ovpn file
    print('\n\n================= VPN PROFILE CREATION =================')
    command = f"sudo MENU_OPTION=1 CLIENT={name} AUTO_INSTALL=y ./openvpn-install.sh | grep added"
    os.system(command)
    print('\n\n')

    # automate removal of vpn file
    plan_cancellation(name, duration)

    # get file's context
    with open(f'{name}.ovpn') as f:
        data_file = f.readlines()
    
    return data_file # return link to file


def plan_cancellation(name, duration):
    """ This function runs after a vpn profile is created and sends the
    cancellation command after a perido of time
    equal to the duration of the contract."""

    duration_n, unit = duration.split('_')

    # revoke a client with name "name" after time expires
    print('\n\n================= VPN PROFILE CANCELLATION =================')
    os.system(f"PROF_NAME={name} DURATION={duration_n} UNIT={unit} ./revoke_user.sh &")


async def run(websocket, path):
    # receive message
    msg = await websocket.recv()
    print(f"{msg}")

    if 'Contract:\n' in msg:
        vpn_file = create_vpn_profile(msg)

        # send to client
        await websocket.send(vpn_file)

start_server = websockets.serve(run, "192.168.1.138", 1331)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()