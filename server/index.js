const index = require('express');

const app = index();
app.use(function (req, res, next) {
  // console.log(req.headers,req.headers['Access-Control-Request-Headers']);
  // res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  // // res.header("Access-Control-Allow-Origin", req.headers.origin); // update to match the domain you will make the request from

  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  // res.header("Access-Control-Allow-Headers", "*");
  res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE,PUT,HEAD,PATCH');
  res.header('Content-Type', 'application/json;charset=utf-8');
  res.header('Access-Control-Allow-Credentials', 'true');

  next();
});
app.post('/login', (req, res) => {
  res.json({
    userId: 0,
    userName: 'aaa',
  });
});
app.get('/OSSToken', (req, res) => {
  res.json({
    accessKeyId: 'STS.NU1CvWu7ySyFvVnDTLxwpLkqc',
    accessKeySecret: 'CDm8yofzWPLftoC3vmYhsx9yWWiN6j8nDHkVaTFT6jqe',
    stsToken:
      'CAIS+AF1q6Ft5B2yfSjIr5aECMzjmOhY5LutdHDfoFQZdPhco67agTz2IHlLe3ZsAuAcsvQymmBT7v0elq9sRpRMX0Gc3W3pUm0Ro22beIPkl5Gfz95t0e+IewW6Dxr8w7WhAYHQR8/cffGAck3NkjQJr5LxaTSlWS7OU/TL8+kFCO4aRQ6ldzFLKc5LLw950q8gOGDWKOymP2yB4AOSLjIx4VAk1zwluf/hkpfHu0qAtjCglL9J/baWC4O/csxhMK14V9qIx+FsfsLDqnUJtEcVqPwm1vAUpGmX5YnGX0Mq/BiNOvDZ6cF0JQRya7MhAalAoegmKiPKAyAX/RqAAaUrj8rCA2ICLo42q1AkT2Tl9i5vUYcBJSooiYgPQh8ICk39ImUcSxPVEfNughkZyX7E/gEZ0bpnmo7HcIKmrJ7LRF+5/PFKcV2F3SnVp/v7iFNZ7UfW20LT/+UQmcgwlnJUIM8+Me0NY0RyHc4TDCmdrtRUCcIsvFCaM11tsHfc',
    bucket: 'wecare-data-import',
    rolesessionname: 'wecare',
    region: 'oss-cn-zhangjiakou',
  });
});

app.get('/files', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'file901.jpg',
      status: 0,
    },
    {
      id: 5,
      name: 'file1101.jpg',
      status: 0,
    },
    {
      id: 7,
      name: 'file1203.jpg',
      status: 0,
    },
    {
      id: 11,
      name: 'file1204.jpg',
      status: 0,
    },
  ]);
});

app.post('/file', (req, res) => {
  res.json();
  res.status(200).end();
});

app.listen(3001, function () {
  console.log('Example app listening on port http://127.0.0.1:3001/');
});
