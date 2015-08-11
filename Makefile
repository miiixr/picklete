PICKLETE_DB_DIALECT='sqlite'
export PICKLETE_DB_DIALECT

all:
	export PATH=$$(npm bin):$$PATH
	echo $$PATH

dev:
	npm start
