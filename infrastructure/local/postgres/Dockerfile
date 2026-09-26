FROM postgres:18-bookworm

# Operational scripts
COPY ./maintenance /usr/local/bin/maintenance

RUN chmod +x /usr/local/bin/maintenance/* \
    && mv /usr/local/bin/maintenance/* /usr/local/bin \
    && rmdir /usr/local/bin/maintenance

# Database initialization scripts
COPY ./init /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/*