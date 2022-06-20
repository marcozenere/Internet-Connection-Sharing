#!/bin/bash

# The purpose of this file is to run all the necessary commands
# for deploying the smart contract and running the UI

echo "=== Start Ganache"
# remove old files
rm .ganache_output.txt

# get mnemonic phrase
mnem=$(cat .mnemonic.txt)

# kill all running instances of ganache
kill $(ps aux | grep ganache | awk '{print $2}')

# start ganache
if [[ ${#mnem} -gt 1 ]]
then
  ganache-cli -p 7545 -m "$mnem" >> .ganache_output.txt &
else
  ganache-cli -p 7545 >> .ganache_output.txt &
fi

# wait 5 seconds for data to be stored
sleep 5

echo "=== Update owner's address"
python assign_owner_account.py

echo "=== Compile"
truffle compile

echo "=== Migrate"
truffle migrate

# kill all running instances of front end
kill $(ps aux | grep 'npm run dev' | awk '{print $2}')

echo "=== Run the front-end"
npm run dev &