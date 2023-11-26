#!/bin/sh

cat <<EOF > /usr/share/nginx/html/config.js
window.appConfig = {
  REACT_APP_API: '${REACT_APP_API}'
};
EOF
