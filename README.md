# Products Api

## How to create your mongodb container

- You will need to have docker and docker-compose installed.

- Create a .env file and copy from .env.example, change the variables as per your wishes.

- Create a docker network using the command:

  ```bash
    ./create-network.sh
    ```

- Spin up the mongo container service:

  ```bash
    ./db-up.sh
    ```

- To spin down the container just run:

  ```bash
    ./db-down.sh
    ```
