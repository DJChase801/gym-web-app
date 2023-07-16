*** clone instructions ***
git clone https://github.com/DJChase801/gym-web-app.git
cd gym-web-app
yarn -or- npm install
cd frontend 
yarn -or- npm install
cd ..
npm run start-local

*** start the db server locally ***
pg_ctl start -D /Library/PostgreSQL/15/data

*** If permission is denied set the access to you user with ***
sudo chown -R <username> /Library/PostgreSQL/15/data

*** start the server ***

cd server && npm run start

*** start the frontend react app ***

cd frontend && npm run start

*** stop the postgres server ***
pg_ctl stop -D /Library/PostgreSQL/15/data


*** Start On EC2 instance ***
cd to file with the 'main key.pem' file. I keep this in dir 'Documents/keys'
ssh -i 'main key.pem'  ec2-user@34.226.247.19
cd gym-web-app
npm run start-local

# start postgres server 
pg_ctl -D /var/lib/pgsql/data -l logfile start

cd server
npx sequelize-cli db:migrate
