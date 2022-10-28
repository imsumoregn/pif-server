#!/bin/sh

now=$(date +"%Y-%m-%d %H-%M-%S")

echo "$now: Waiting for the database service to be fully started." ;
sleep 5 ;
echo "$now: Done waiting." ;
node index.js &
sleep 5 ;
npx sequelize-cli db:seed:all ;
echo "$now: Seeded the database." ;

while :; do :; done & kill -STOP $! && wait $!