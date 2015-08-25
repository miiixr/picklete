# About installation prepare


 * Node.js v0.12.x
 * MySQL server start

## nvm install (node env prepare)

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.1/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v0.12.3
nvm alias v0.12.3 default
nvm use default
```

## Package installation

```
npm install -g bower
npm install -g sails
npm install -g grunt-cli
npm install -g coffee-script

gem install compass
gem install bootstrap-sass
```

