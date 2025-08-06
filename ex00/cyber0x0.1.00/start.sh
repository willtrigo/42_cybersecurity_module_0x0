#!/bin/bash

# Redirect errors to err.log file
exec 2> err.log

# Clean Docker images, volumes, and networks
echo "Cleaning Docker..."
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker-compose down -v --remove-orphans
docker image prune -af
docker volume prune -f
docker network prune -f

# Check if the cleaning was successful
if [ $? -ne 0 ]; then
    echo "Error cleaning Docker. Please check err.log for details."
    exit 1
fi

# Launch Docker Compose without displaying output
echo "Creation of the website."
docker-compose up -d

# Check if the Docker Compose was successful
if [ $? -ne 0 ]; then
    echo "Error creating the website. Please check err.log for details."
    exit 1
fi

# Retrieve URLs from Docker Compose logs and display
urls=$(docker-compose logs 2>/dev/null | awk -F'http://' '/http:\/\// {print $2}' | sed 's/.$//')

# Display URLs
echo "You can connect on this website:"
for url in $urls; do
    echo "http://$url"
done
