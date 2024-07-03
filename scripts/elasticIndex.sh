#!/bin/bash

# Wait until Elasticsearch is up
while true; do
  curl -s http://localhost:9200 > /dev/null
  if [ $? -eq 0 ]; then
    break
  fi
  echo "Waiting for Elasticsearch to be up..."
  sleep 5
done

# Create an index
curl -X PUT "http://localhost:9200/user_mailboxes" -H 'Content-Type: application/json' -d'
{
    "mappings": {
        "properties": {
            "user_id": {
                "type": "keyword"
            },
            "mailbox_id": {
                "type": "keyword"
            },
            "mailbox_name": {
                "type": "text"
            },
            "total_messages": {
                "type": "integer"
            },
            "unread_messages": {
                "type": "integer"
            },
            "created_at": {
                "type": "date"
            },
            "updated_at": {
                "type": "date"
            }
        }
    }
}
'

curl -X PUT "http://localhost:9200/user_emails" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "user_id": {
        "type": "keyword"
      },
      "email_id": {
        "type": "keyword"
      },
      "email_uid": {
        "type": "keyword"
      },
      "from": {
        "type": "keyword"
      },
      "to": {
        "type": "keyword"
      },
      "subject": {
        "type": "text"
      },
      "body": {
        "type": "text"
      },
      "received_at": {
        "type": "date"
      },
      "seen": {
        "type": "boolean"
      },
      "attachments": {
        "type": "nested",
        "properties": {
          "file_name": {
            "type": "keyword"
          },
          "file_size": {
            "type": "integer"
          },
          "mime_type": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
'