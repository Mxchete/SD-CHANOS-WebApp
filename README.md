# SD WebApp
## Running
Use podman compose to run the application locally as follows:
```
podman compose up
```

This will create necessary containers. To interact with the api directly, use cURL to send POST and GET commands to API endpoints defined in the server/routes/ directory.

To interact with the dev database, enter the database container with the following command:
```
podman exec -ti webserver-db /bin/bash
```

This will drop you into a bash shell in the container, from there, run:
```
pqsl -U postgres -d datastore
```
to enter the database, here you can navigate the database using traditional SQL commands.