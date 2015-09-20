FROM smlsunxie/picklete_env
COPY ./ /picklete
WORKDIR /picklete

ENV PORT "1337"
ENV NODE_ENV "production"
ENV DOMAIN_HOST "localhost:1337"



RUN /bin/bash -l -c 'npm i'
RUN /bin/bash -l -c 'node_modules/.bin/grunt prod'

EXPOSE 1337



CMD /bin/bash -l -c 'npm start'
