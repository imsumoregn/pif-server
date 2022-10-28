#!/bin/sh

now=$(date +"%Y-%m-%d %H-%M-%S")

echo "$now: Waiting for the database service to be fully started." ;
sleep 3 ;
echo "$now: Done waiting." ;
npx nodemon index.js &
sleep 3 ;
npx sequelize-cli db:seed:all ;
echo "$now: Seeded the database." ;

wait
#while :; do :; done & kill -STOP $! && wait $!