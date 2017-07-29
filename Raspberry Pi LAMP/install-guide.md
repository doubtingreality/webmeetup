## Install PHP and MySQL

Install Apache
`sudo apt-get install apache2 -y`

Install PHP and Apache mod:
`sudo apt-get install php5 libapache2-mod-php5 -y`

Install MySQL:
`sudo apt-get install mysql-server php5-mysql -y`

Restart Apache:
`sudo service apache2 restart`


## Update user and groups
Create new user for SSH:
`sudo adduser webmeetup`

Check if user is noted under AllowUsers
`sudo nano /etc/ssh/sshd_config`

Append following lines:
```
Port 1234
PermitRootLogin no
AllowUsers webmeetup
```

`sudo service ssh reload`

Edit default password for 'pi' user:
`sudo passwd pi`

Add webmeetup user to www-data group
`sudo usermod -a -G www-data webmeetup`

Change to new user:
`su - webmeetup`

Check current group:
`groups`

Set correct rights of folder and files:

`sudo chown webmeetup:www-data /var/www/ -R`

`sudo chmod -R 775 /var/www/`

## Create user and add database

Open MySQL prompt:
`mysql -u root -p`
```
CREATE USER 'webmeetup'@'localhost'
  IDENTIFIED BY 'passwordhere';
```

```
CREATE DATABASE nameofdatabase;
```

```
GRANT ALL PRIVILEGES ON nameofdatabase . * TO 'webmeetup'@'localhost';
```

```
FLUSH PRIVILEGES;
```
