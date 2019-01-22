FROM alpine:3.8

ENV file /usr/local/bin/run.sh

RUN apk add --no-cache --update curl grep bash

RUN echo '*  *  *  *  * ${file}' > /etc/crontabs/root

COPY ./run.sh ${file}
RUN chmod +x ${file}

CMD ["crond", "-l2", "-f"]