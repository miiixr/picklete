Picklete - E-Commerce Platform
==============================

prerequisite
------------

-	nvm(https://github.com/creationix/nvm\)
-	iojs ≧ 1.8.1
-	mysql
-	Ruby(RVM)

after get a copy
----------------

-	nvm use iojs-v1.8.X (或更高)
-	npm install
-	start mysql
-	create local mysql db 建立一個資料庫名稱為picklete，編碼為utf-8
-	`export PATH=node_modules/.bin:$PATH`
-	`gem install bootstrap-sass compass font-awesome-sass`

getting started
---------------

-	npm start

references
----------

-	Nodemailer, https://github.com/andris9/Nodemailer
-	sails-service-mailer, https://www.npmjs.com/package/sails-service-mailer

production for docker
---------------------

picklete docker repo: https://hub.docker.com/r/miiixr/picklete/

1.	cd picklete
2.	docker-compose up -d mysql
3.	create picklete_prod database, import schema
4.	docker run -d --link mysql -p 1337:1337 miiixr/picklete
