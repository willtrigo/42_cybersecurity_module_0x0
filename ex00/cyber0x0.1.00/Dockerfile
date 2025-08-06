FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY index_secure.html /usr/share/nginx/html/index_secure.html
COPY secure.js /usr/share/nginx/html/secure.js
COPY .entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
