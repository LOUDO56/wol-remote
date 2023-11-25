# Pré-requis

Vous devez vous menir d'un raspberry pi, ou tout autre serveur permettant de faire tourner le système d'exploitation LINUX.

`pm2` sur le serveur et ordinateur pour pouvoir lancer les fichiers serveur.

# Setup

Vous avez dans ce repo 3 dossiers: `pc-server`, `rasp-server` et `website`.

### Serveur

Tout d'abord, vous devez aller sur votre serveur et installer le dossiers `rasp-server`. Si vous prévoyez de faire du self-host pour le site web, copier de même `website`.

Une fois fait, allez dans `rasp-server` et installer les dépendances avec `package.json`. Ensuite, creer un nouveau dossier nommé `.env` et vous devrez remplir le fichier avec vos propre mot de passes, le template ici
```
ACCESS_TOKEN_SECRET=
MAC_ADDRESS=
PASSWORD=
```
Vous allez ici renseigné vos mots de passe pour la signature du token et celui qui vous permettera de vous connecter à votre télécommande à distance sur le site web

Et enfin renseigner l'adresse mac de votre ordinateur pour pouvoir envoyer le paquet magique qui pourra allumer votre ordinateur. Pour trouver votre adresse MAC, vous devez simplement ouvrir l'invite de commande et taper la commande `ipconfig /all`.

Après que vous ayez rempli vos mots de passe et votre adresse mac, nous allons installer maintenant le module `wakeonlan` sur Linux.

Mais avant ça, soyez à jour en tapant `sudo apt-get update` et `sudo apt-get upgrade`.

Après avoir mit tout à jour, vous pouvez installer `wakeonlan` avec la commande `sudo apt-get install wakeonlan`.

Enfin, lancer le serveur avec `pm2 start index.js`

### Ordinateur

Pour votre ordinateur, vous devez uniquement copier le dossier `pc-server`, pour pouvoir l'éteindre ou le mettre en hibernation.

Vous faîtes les mêmes étapes que côté serveur, vous installer les dépendances, le `.env` avec seulement le `ACCESS_TOKEN_SECRET` renseigné et enfin `pm2 start index.js`.

# Déploiement

Première étape avant de commancer, il vous faut un nom de domaine. Si vous ne voulez pas payer un nom de domaine, vous pouvez très bien en avoir un gratuitement avec <a href="https://www.noip.com/" target="_blank">No-IP</a>. C'est simple, rapide et efficace.

Ensuite, vous allez premièrement installer `nginx`, nous allons faire du reverse-proxy, amener une requete sur votre domaine à votre lien ou est déploiyé votre projet en local.

Pour ça, faite `sudo apt-get install nginx` sur votre serveur.

Ensuite, tapez `sudo nano /etc/nginx/sites-available/default`

Et ajouter ce bout de code ci dessous
```
server {

    server_name www.votre-domaine.com;

    location /wakeonlan-login {
        proxy_pass http://localhost:4001/login;
    }

    location /wakeonlan-getToken {
        proxy_pass http://localhost:4001/getToken;
    }

    location /wakeonlan-wakeup {
        proxy_pass http://localhost:4001/wakeup;
    }

    # Ici, vous devez changer l'adresse ip locale avec celle de votre PC.
    location /wakeonlan-shutdown {
        proxy_pass http://192.168.1.10:4001/shutdown;
    }

    location /wakeonlan-hibernate {
        proxy_pass http://192.168.1.10:4001/hibernate;
    }
}
```

Enfin, enrengistrer et relancer nginx avec `sudo systemctl restart nginx`. Et votre API fonctionne!
