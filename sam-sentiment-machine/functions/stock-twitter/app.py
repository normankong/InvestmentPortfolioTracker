import os
import json
import requests
import logging
import boto3

from botocore.exceptions import ClientError
from datetime import datetime

dynamodb = boto3.resource('dynamodb')

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Get the Information from the Environment Variable
TABLE_NAME = os.environ.get("TABLE_NAME")
BEARER_TOKEN = os.environ.get("BEARER_TOKEN")

def handler(event, context):

    logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)

    logger.info(event)

    # body = event['Records'][0]['body']
    # message = json.loads(body)
    # logger.info(message)

    # symbol = message['Message']
    symbol = event["Message"]
    logger.info(f'Received symbol: {symbol}')

    # Trigger twitter API
    twitter = TwitterFetch()
    json_response = twitter.connect_to_endpoint(symbol)

    # Log the Twitter Response
    response = json.dumps(json_response, indent=4, sort_keys=True)
    logger.info(response)

    # Write to DynamoDB
    table = dynamodb.Table(TABLE_NAME)

    if "data" not in json_response:
        logger.info("No tweets found for symbol: " + symbol)
        data = []
    else:
        data = json_response["data"]

    # Update to the database
    response = table.update_item(
        Key= { "symbol" : symbol },
        UpdateExpression="set twitter = :r,  #ts = :t",
        ExpressionAttributeNames={
            "#ts": "timestamp"
        },
        ExpressionAttributeValues={
            ":r": data,
            ":t" : str(datetime.now())
        },
        ReturnValues="UPDATED_NEW"
    )

    payload = {
        "symbol": symbol,
        "messages" : data
    }

    return payload

class TwitterFetch:
    """
    Fetch tweets from twitter.
    """
    def __init__(self):

        self.bearer_token = BEARER_TOKEN

        self.search_url = "https://api.twitter.com/2/tweets/search/recent"

    def bearer_oauth(self, r):
        """
        Method required by bearer token authentication.
        """
        r.headers["Authorization"] = f"Bearer {self.bearer_token}"
        r.headers["User-Agent"] = "v2RecentSearchPython"
        return r

    def connect_to_endpoint(self, params):

        # Optional params: start_time,end_time,since_id,until_id,max_results,next_token,
        # expansions,tweet.fields,media.fields,poll.fields,place.fields,user.fields
        param = {'query': f'{params} is:verified lang:en' , 'max_results': '20', 'tweet.fields' : 'lang,text'}

        response = requests.get(self.search_url, auth=self.bearer_oauth, params=param)

        if response.status_code != 200:
            raise Exception(response.status_code, response.text)
        return response.json()