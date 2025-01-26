# Gestion salle de sport

### requirements
- docker

#### Run the project
```bash
docker-compose up --build
```

### Exigences techniques
1.	Technologies utilisées :
 - Node.js avec Express.js. 
 - Base de données relationnelle PostgreSQL
2.	Architecture de l’API :
 - Respect des principes REST.
 - Gestion des rôles et des permissions avec JWT
3.	Sécurité :
 - Validation des entrées utilisateur zod
4.	Scalabilité :
 - API modulable et évolutive pour intégrer des fonctionnalités futures.
 - Documentation claire Swagger

### Add a new seed file
```bash
npx sequelize-cli seed:generate --name authors
```

#### Run the seed file
```bash
npx sequelize-cli db:seed:all
```
