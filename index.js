const Imap = require('imap'),
    inspect = require('util').inspect;

const axios = require('axios');
const qs = require('qs');
const fs = require('node:fs');

const token = fs.readFileSync('./token','utf-8');
const mailId = 'adesh.t@outlook.com';
const auth2 = btoa("user=adesh.t@outlook.com\x01auth=Bearer "+token+"\x01\x01")

// const auth2 = Buffer.from([`user=${mailId}`, `auth=Bearer ${token}`, '', ''].join('\x01'), 'utf-8').toString('base64');

const imap = new Imap({
  xoauth2 : auth2,
  host: 'outlook.office365.com',
  port: 993,
  tls: true,
  debug: console.log,
  authTimeout: 25000,
  connTimeout: 30000,
  tlsOptions: {
    rejectUnauthorized: false,
    servername: 'outlook.office365.com'
  }
});

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    const f = imap.seq.fetch('1:3', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      const prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        let buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});
  
imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect(); 

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}