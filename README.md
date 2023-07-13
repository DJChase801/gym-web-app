*** start the db server locally ***

# run the command below
pg_ctl start -D /Library/PostgreSQL/15/data

# If permission is denied set the access to you user with
sudo chown -R <username> /Library/PostgreSQL/15/data

*** start the server ***

cd server && npm run start

*** start the frontend react app ***

cd frontend && npm run start

*** stop the postgres server ***
pg_ctl stop -D /Library/PostgreSQL/15/data