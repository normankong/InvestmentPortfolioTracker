# sam-sentiment-socket

This SAM project is to create a web socket via API Gateway, which take incoming symbol subscription upon connect.

## 
Message Format
```
{ "action" : "sendmessage" , "symbol" : "AAPL"}
```

## Useful Command
cd ../sam-sentiment-socket
sam deploy --stack-name sam-sentiment-socket  